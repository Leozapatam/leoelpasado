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


def cargar(archivo):
    tmp = os.path.join(tempfile.gettempdir(), "editar_crudo.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", archivo, "-ac", "1", "-ar", str(SR), tmp], check=True)
    with wave.open(tmp) as wf:
        return np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768


def nivel_voz(x):
    """Volumen típico de la voz (ignora silencios): mediana del RMS de las ventanas más fuertes."""
    w = int(0.05 * SR)
    v = x[: len(x) // w * w].reshape(-1, w)
    rms = np.sqrt((v ** 2).mean(1)) + 1e-9
    return float(np.median(rms[rms > np.percentile(rms, 60)]))


def main():
    slug, entrada = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None
    cortes = json.load(open(os.path.join(RAIZ, "public", "episodios", slug, "cortes.json"), encoding="utf-8"))
    tramos = cortes.get("piezas") or [{"archivo": entrada, "desde": a, "hasta": b} for a, b in cortes["conservar"]]

    fade = int(0.03 * SR)
    cache, piezas, ref = {}, [], None
    for t in tramos:
        ruta = os.path.join(RAIZ, t["archivo"]) if not os.path.isabs(t["archivo"]) else t["archivo"]
        a = cache.setdefault(ruta, cargar(ruta))
        ini, fin = t.get("desde", 0), t.get("hasta", 1e9)
        i = 0 if ini <= 0 else silencio_cercano(a, ini)
        j = len(a) if fin >= len(a) / SR else silencio_cercano(a, fin)
        p = a[i:j].copy()
        nv = nivel_voz(p)
        ref = ref or nv
        p *= ref / nv  # misma intensidad de voz en todas las piezas
        p[:fade] *= np.linspace(0, 1, fade)
        p[-fade:] *= np.linspace(1, 0, fade)
        piezas.append(p)
        print(f"{os.path.basename(ruta):24s} {i / SR:7.2f} → {j / SR:7.2f} s  (ganancia {20 * np.log10(ref / nv):+.1f} dB)")
    out = np.concatenate(piezas)
    a = out  # para el resumen
    dest = os.path.join(RAIZ, "grabaciones", f"{slug}-editada.wav")
    with wave.open(dest, "w") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
    print(f"editada: {len(out) / SR:.1f} s  ({dest})")


if __name__ == "__main__":
    main()
