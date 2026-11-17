"""Paso 1a (opcional): edita la grabación cruda quitando tomas repetidas o tropiezos.

Uso: python scripts/editar_voz.py <slug> <grabacion>
Lee public/episodios/<slug>/cortes.json, de una de estas dos formas:
  { "conservar": [[0, 103.6], [156.4, 160.3], [166.3, 999]] }   tramos de una sola grabación
  { "piezas": [                                                  tramos de varias grabaciones (regrabar una parte)
      {"archivo": "grabaciones/piloto.m4a", "desde": 0, "hasta": 19.5},
      {"archivo": "grabaciones/cap0-definicion.m4a"},
      {"archivo": "grabaciones/piloto.m4a", "desde": 55.0, "hasta": 999} ] }
Con "piezas", cada tramo se iguala en volumen al primero para que no se note la costura,
y <grabacion> se ignora.
Silencios: "pausas": {"max": 0.8, "nueva": 0.5} acorta todo silencio más largo que "max" segundos
a "nueva" segundos (por defecto así). Mantiene el ritmo natural pero quita los huecos muertos.
Cada corte se ajusta al punto más silencioso cercano (±0,25 s) y se une con un fundido de 30 ms,
así no se oyen clics ni saltos. Escribe grabaciones/<slug>-editada.wav, que luego va a preparar_voz.py.
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SR = 48000


def silencio_cercano(a, t, radio=0.25, ventana=0.02):
    """Momento más silencioso alrededor de t (para cortar entre palabras)."""
    i0, i1 = max(0, int((t - radio) * SR)), min(len(a), int((t + radio) * SR))
    w = int(ventana * SR)
    if i1 - i0 <= w:
        return int(t * SR)
    e = np.convolve(a[i0:i1] ** 2, np.ones(w) / w, mode="valid")
    return i0 + int(np.argmin(e)) + w // 2


DEEP_FILTER = os.path.join(os.path.expanduser("~"), "leoelpasado-deps", "deep-filter.exe")


def limpiar_ia(wav):
    """Supresión de ruido con IA (DeepFilterNet), el equivalente en software del ENC de un micrófono tipo Lark.
    Si el programa no está instalado, devuelve el audio sin tocar."""
    if not os.path.exists(DEEP_FILTER):
        return wav
    salida = os.path.join(tempfile.gettempdir(), "limpia_ia")
    os.makedirs(salida, exist_ok=True)
    # --atten-lim-db: cuánto puede bajar el ruido como máximo; 30 dB limpia sin dejar la voz "robótica"
    subprocess.run([DEEP_FILTER, "--atten-lim-db", "30", "-o", salida, wav], check=True, capture_output=True)
    print("  limpieza IA (DeepFilterNet) aplicada")
    return os.path.join(salida, os.path.basename(wav))


def cargar(archivo):
    tmp = os.path.join(tempfile.gettempdir(), "editar_crudo.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", archivo, "-ac", "1", "-ar", str(SR), tmp], check=True)
    tmp = limpiar_ia(tmp)
    with wave.open(tmp) as wf:
        return np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768


def nivel_voz(x):
    """Volumen típico de la voz (ignora silencios): mediana del RMS de las ventanas más fuertes."""
    w = int(0.05 * SR)
    v = x[: len(x) // w * w].reshape(-1, w)
    rms = np.sqrt((v ** 2).mean(1)) + 1e-9
    return float(np.median(rms[rms > np.percentile(rms, 60)]))


def acortar_pausas(x, max=0.8, nueva=0.5, umbral_db=-20):
    """Acorta silencios largos: busca tramos más bajos que la voz (umbral relativo) y deja solo `nueva` segundos."""
    w = int(0.02 * SR)
    v = x[: len(x) // w * w].reshape(-1, w)
    rms = 20 * np.log10(np.sqrt((v ** 2).mean(1)) + 1e-9)
    voz = np.median(rms[rms > np.percentile(rms, 60)])
    calla = rms < voz + umbral_db
    trozos, i, quitado = [], 0, 0.0
    k = 0
    while k < len(calla):
        if calla[k]:
            j = k
            while j < len(calla) and calla[j]:
                j += 1
            largo = (j - k) * w / SR
            if largo > max:
                # se conserva la mitad de `nueva` a cada lado del silencio, con fundidos
                a = k * w + int(nueva / 2 * SR)
                b = j * w - int(nueva / 2 * SR)
                trozos.append(x[i:a]); i = b
                quitado += (b - a) / SR
            k = j
        else:
            k += 1
    trozos.append(x[i:])
    f = int(0.015 * SR)
    for t in trozos[1:]:
        if len(t) > 2 * f:
            t[:f] *= np.linspace(0, 1, f)
    for t in trozos[:-1]:
        if len(t) > 2 * f:
            t[-f:] *= np.linspace(1, 0, f)
    print(f"pausas: {quitado:.1f} s de silencio sobrante quitados")
    return np.concatenate(trozos)


OCTAVAS = [125, 250, 500, 1000, 2000, 4000, 8000]


def bandas_voz(x, w=4096):
    """Nivel relativo (dB) de la voz en cada octava, solo con ventanas que tienen voz: la 'huella' tonal."""
    v = x[: len(x) // w * w].reshape(-1, w)
    rms = np.sqrt((v ** 2).mean(1))
    v = v[rms > np.percentile(rms, 60)] * np.hanning(w)
    S = (np.abs(np.fft.rfft(v, axis=1)) ** 2).mean(0)
    f = np.fft.rfftfreq(w, 1 / SR)
    tot = S[(f > 88) & (f < 11300)].sum()
    return np.array([10 * np.log10(S[(f >= fc / 1.414) & (f < fc * 1.414)].sum() / tot) for fc in OCTAVAS])


def _campana(fc, ganancia_db, q=1.2):
    """Filtro de campana (ecualizador paramétrico, fórmulas RBJ)."""
    A = 10 ** (ganancia_db / 40)
    w0 = 2 * np.pi * fc / SR
    al = np.sin(w0) / (2 * q)
    b = np.array([1 + al * A, -2 * np.cos(w0), 1 - al * A])
    a = np.array([1 + al / A, -2 * np.cos(w0), 1 - al / A])
    return b / a[0], a / a[0]


def igualar_timbre(x, ref_bandas, pasadas=5, max_db=8.0):
    """Ecualizador de octavas que corrige poco a poco y vuelve a medir hasta quedar a menos de 1 dB de la referencia."""
    from scipy.signal import lfilter
    total = np.zeros(len(OCTAVAS))
    for _ in range(pasadas):
        dif = ref_bandas - bandas_voz(x)
        if np.abs(dif).max() < 1.0:
            break
        paso = np.clip(dif * 0.7, -3, 3)
        paso = np.clip(total + paso, -max_db, max_db) - total
        total += paso
        for fc, g in zip(OCTAVAS, paso):
            if abs(g) > 0.2:
                b, a = _campana(fc, g)
                x = lfilter(b, a, x).astype(np.float32)
    print("  ecualización aplicada (dB por octava):", " ".join(f"{fc}:{g:+.1f}" for fc, g in zip(OCTAVAS, total)))
    print("  diferencia final con la referencia:", " ".join(f"{d:+.1f}" for d in ref_bandas - bandas_voz(x)))
    return x


def main():
    slug, entrada = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None
    cortes = json.load(open(os.path.join(RAIZ, "public", "episodios", slug, "cortes.json"), encoding="utf-8"))
    tramos = cortes.get("piezas") or [{"archivo": entrada, "desde": a, "hasta": b} for a, b in cortes["conservar"]]

    fade = int(0.03 * SR)
    puente = int(0.12 * SR)  # fundido cruzado entre grabaciones distintas
    cache, piezas, ref, archivos = {}, [], None, []
    ref_ruta = None
    for t in tramos:
        ruta = os.path.join(RAIZ, t["archivo"]) if not os.path.isabs(t["archivo"]) else t["archivo"]
        if ruta not in cache:
            crudo = cargar(ruta)
            if ref_ruta is None:
                ref_ruta, ref_bandas = ruta, bandas_voz(crudo)
            elif cortes.get("igualar_timbre", True):
                print(f"timbre de {os.path.basename(ruta)} → {os.path.basename(ref_ruta)}")
                crudo = igualar_timbre(crudo, ref_bandas)
            cache[ruta] = crudo
        a = cache[ruta]
        ini, fin = t.get("desde", 0), t.get("hasta", 1e9)
        if t.get("exacto"):  # corte exacto (para quitar una sola palabra)
            i, j = int(ini * SR), min(len(a), int(fin * SR))
        else:
            i = 0 if ini <= 0 else silencio_cercano(a, ini)
            j = len(a) if fin >= len(a) / SR else silencio_cercano(a, fin)
        p = a[i:j].copy()
        nv = nivel_voz(p)
        ref = ref or nv
        p *= ref / nv  # misma intensidad de voz en todas las piezas
        p[:fade] *= np.linspace(0, 1, fade)
        p[-fade:] *= np.linspace(1, 0, fade)
        piezas.append(p)
        archivos.append(ruta)
        print(f"{os.path.basename(ruta):24s} {i / SR:7.2f} → {j / SR:7.2f} s  (ganancia {20 * np.log10(ref / nv):+.1f} dB)")
    # unir: entre grabaciones distintas, fundido cruzado (puente); dentro de la misma, corte limpio
    out = piezas[0]
    for k in range(1, len(piezas)):
        p = piezas[k]
        if archivos[k] != archivos[k - 1] and len(out) > puente and len(p) > puente:
            c = np.linspace(0, np.pi / 2, puente)
            cola, cabeza = out[-puente:].copy(), p[:puente].copy()
            # deshacer los fundidos cortos para que el cruce sea de potencia constante
            cola[-fade:] /= np.maximum(np.linspace(1, 0, fade), 0.05)
            cabeza[:fade] /= np.maximum(np.linspace(0, 1, fade), 0.05)
            cruce = cola * np.cos(c) + cabeza * np.sin(c)
            out = np.concatenate([out[:-puente], cruce, p[puente:]])
        else:
            out = np.concatenate([out, p])
    out = acortar_pausas(out, **cortes.get("pausas", {}))
    dest = os.path.join(RAIZ, "grabaciones", f"{slug}-editada.wav")
    with wave.open(dest, "w") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
    print(f"editada: {len(out) / SR:.1f} s  ({dest})")


if __name__ == "__main__":
    main()
