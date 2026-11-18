"""Paso 5: mezcla final. Voz + música + efectos, con la voz INTEGRADA (no pegada encima).

Uso: python scripts/mezclar.py <slug>   ->  public/episodios/<slug>/mezcla.wav

Qué hace que la voz suene integrada y profesional:
  1. La voz pasa por la misma sala que la música y los efectos (reverb corta, muy baja): están en el mismo "lugar".
  2. Un poco de calidez (saturación suave) y aire arriba, como un buen preamplificador.
  3. La música y los ambientes bajan solos cuando hablas (sidechain); los efectos bajan un poco menos.
  4. Compresión de "pegamento" en el bus final, ecualización de master y -14 LUFS (estándar Reels/TikTok).
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np
from scipy.signal import fftconvolve

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sonidos as S  # noqa: E402

SR = 48000


def leer(p):
    with wave.open(p) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        return x.reshape(-1, w.getnchannels())


def escribir(p, x):
    with wave.open(p, "w") as w:
        w.setnchannels(x.shape[1]); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def microfono_antiguo(voz, intensidad=1.0):
    """Estilo «transmisión antigua» (radio de los años 40): se tiene que NOTAR.
    intensidad 0.5 = sutil · 1.0 = radio clara (por defecto) · 1.5 = muy vieja.
      - banda de radio AM (250-4200 Hz) con presencia en 1,4 kHz
      - saturación de válvula y leve oscilación de la cinta (wow)
      - fondo de transmisión audible: siseo, crujidos de disco y zumbido eléctrico, también en las pausas"""
    from scipy.signal import butter, sosfilt, lfilter
    rng = np.random.default_rng(1940)
    n = len(voz)
    k = float(intensidad)
    # 1. banda de radio
    lo, hi = 180 + 70 * k, 6000 - 1800 * k
    v = sosfilt(butter(3, [lo, hi], "band", fs=SR, output="sos"), voz, axis=0)
    for fc, g, q in ((1400, 3.0 + 1.5 * k, 0.8), (400, -2.0, 1.0)):
        A = 10 ** (g / 40); w0 = 2 * np.pi * fc / SR; al = np.sin(w0) / (2 * q)
        bb = np.array([1 + al * A, -2 * np.cos(w0), 1 - al * A]); aa = np.array([1 + al / A, -2 * np.cos(w0), 1 - al / A])
        v = lfilter(bb / aa[0], aa / aa[0], v, axis=0)
    # 2. saturación de válvula
    pico = np.abs(v).max() + 1e-9
    drive = 2.0 + 2.0 * k
    sat = np.tanh(v / pico * drive) * pico / np.tanh(drive)
    mezcla = min(0.85, 0.45 + 0.25 * k)
    v = v * (1 - mezcla) + sat * mezcla
    # 3. wow: la cinta gira un poco irregular (retardo variable de ±1 ms a 0,6 Hz)
    t = np.arange(n) / SR
    retardo = (0.0012 * k) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.6 * t + 0.3 * np.sin(2 * np.pi * 0.13 * t))) * SR
    idx = np.clip(np.arange(n) - retardo, 0, n - 1)
    i0 = idx.astype(int); fr = (idx - i0)[:, None]
    v = v[i0] * (1 - fr) + v[np.minimum(i0 + 1, n - 1)] * fr
    # 4. fondo de transmisión (relativo a la voz)
    rms = np.sqrt((v ** 2).mean()) + 1e-9
    siseo = sosfilt(butter(2, [500, 7000], "band", fs=SR, output="sos"), rng.standard_normal(n))
    siseo *= rms * 10 ** ((-30 + 6 * k) / 20) / (np.sqrt((siseo ** 2).mean()) + 1e-9)
    # crujidos de disco: clics cortos al azar (~6 por segundo), filtrados
    clics = np.zeros(n)
    pos = rng.integers(0, n, int(n / SR * 6 * k))
    clics[pos] = rng.uniform(-1, 1, len(pos)) * rng.uniform(0.3, 1, len(pos)) ** 3
    clics = sosfilt(butter(2, [800, 5000], "band", fs=SR, output="sos"), clics)
    clics *= rms * 10 ** ((-18 + 4 * k) / 20) / (np.abs(clics).max() + 1e-9)
    # zumbido eléctrico (60 Hz y armónicos), suave y con leve vaivén
    zumbido = sum(np.sin(2 * np.pi * 60 * h * t) / h for h in (1, 2, 3)) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.2 * t))
    zumbido *= rms * 10 ** ((-38 + 4 * k) / 20) / (np.sqrt((zumbido ** 2).mean()) + 1e-9)
    fondo = (siseo + clics + zumbido)[:, None]
    return (v + fondo).astype(np.float32)


def interferencias(v, palabras, cada=18.0, semilla=7):
    """Interferencias notorias de vez en cuando, SIEMPRE en una pausa de la voz (nunca tapan una palabra).
    Se alternan: ráfaga de estática, silbido de sintonía (como mover el dial) y caída de señal con chasquido."""
    from scipy.signal import butter, sosfilt
    rng = np.random.default_rng(semilla)
    n = len(v)
    rms = np.sqrt((v ** 2).mean()) + 1e-9
    # pausas de al menos 0,45 s entre palabras
    pausas = [(a["e"], b["s"]) for a, b in zip(palabras, palabras[1:]) if b["s"] - a["e"] >= 0.45]
    elegidas, ultimo = [], 4.0
    for a, b in pausas:
        if a - ultimo >= cada * rng.uniform(0.8, 1.25):
            elegidas.append((a, b)); ultimo = a
    tipos = ["estatica", "sintonia", "caida"]
    for k, (a, b) in enumerate(elegidas):
        tipo = tipos[k % 3]
        dur = min(b - a - 0.08, 0.9 if tipo != "caida" else 0.6)
        i, m = int((a + 0.04) * SR), int(dur * SR)
        if m <= 0 or i + m >= n:
            continue
        t = np.arange(m) / SR
        env = np.sin(np.pi * np.arange(m) / m) ** 0.6
        if tipo == "estatica":
            x = sosfilt(butter(2, [400, 6500], "band", fs=SR, output="sos"), rng.standard_normal(m))
            x *= (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * rng.uniform(6, 14) * t)))  # la estática "late"
            x *= rms * 1.6 * env / (np.sqrt((x ** 2).mean()) + 1e-9)
        elif tipo == "sintonia":
            f = 700 + 2200 * (t / dur) ** 1.5 + 120 * np.sin(2 * np.pi * 7 * t)
            x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.6 + sosfilt(butter(2, [800, 5000], "band", fs=SR, output="sos"), rng.standard_normal(m)) * 0.25
            x *= rms * 1.3 * env / (np.sqrt((x ** 2).mean()) + 1e-9)
        else:  # caída: silencio de señal y un chasquido al volver
            x = np.zeros(m)
            j = int(m * 0.85)
            x[j:j + 200] = rng.uniform(-1, 1, min(200, m - j)) * rms * 4
            v[i:i + m] *= 0.25  # baja el fondo de transmisión: se "cae" la señal
        v[i:i + m] += x[:, None]
    print(f"interferencias: {len(elegidas)} (en pausas de la voz)")
    return v


def main():
    slug = sys.argv[1]
    car = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "episodios", slug)
    ep = json.load(open(os.path.join(car, "episodio.json"), encoding="utf-8"))
    I = ep.get("intro", {}).get("duracion", 0)

    # 1-2. voz en la sala + calidez
    voz = leer(os.path.join(car, "voz.wav"))
    if voz.shape[1] == 1:
        voz = np.repeat(voz, 2, 1)
    estilo = ep.get("voz", {}).get("estilo")
    if estilo == "microfono_antiguo":
        voz = microfono_antiguo(voz, ep.get("voz", {}).get("intensidad", 1.0))
        if ep.get("voz", {}).get("interferencias", 0):
            palabras = json.load(open(os.path.join(car, "palabras.json"), encoding="utf-8"))
            voz = interferencias(voz, palabras, cada=ep["voz"]["interferencias"])
        print("voz: estilo micrófono antiguo")
    ir = S.reverb_ir()
    sala = np.stack([fftconvolve(voz[:, 0], ir[0])[: len(voz)], fftconvolve(voz[:, 1], ir[1])[: len(voz)]], 1)
    sala *= np.abs(voz).max() / (np.abs(sala).max() + 1e-9)
    voz = voz + sala * 0.09                      # reverb muy baja: se siente, no se oye
    voz = np.tanh(voz * 1.4) / np.tanh(1.4)      # calidez suave
    voz = np.vstack([np.zeros((int(I * SR), 2)), voz])  # la entrada va antes de la voz
    tmp = tempfile.gettempdir()
    pv = os.path.join(tmp, f"{slug}_voz_int.wav")
    escribir(pv, voz)

    ent = ["-i", os.path.join(car, "musica.wav"), "-i", pv]
    filtro = "[0:a]volume=0.5[m];[1:a]apad,asplit=3[v][sc1][sc2];" \
             "[m][sc1]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450[md];"
    mezcla = "[md][v]"
    n = 2
    ef = os.path.join(car, "efectos.wav")
    if os.path.exists(ef):
        ent += ["-i", ef]
        filtro += "[2:a][sc2]sidechaincompress=threshold=0.05:ratio=2.5:attack=20:release=300[ed];"
        mezcla = "[md][ed][v]"
        n = 3
    else:
        filtro += "[sc2]anullsink;"
    filtro += (f"{mezcla}amix=inputs={n}:normalize=0:duration=first,"
               "highpass=f=30,"
               "acompressor=threshold=-18dB:ratio=1.8:attack=30:release=250:makeup=1,"  # pegamento
               "highshelf=f=11000:g=1.5,"                                              # aire
               "alimiter=limit=0.95,loudnorm=I=-14:TP=-1:LRA=9")
    dest = os.path.join(car, "mezcla.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ent, "-filter_complex", filtro, "-ar", str(SR), dest], check=True)
    print("mezcla.wav listo", "(con efectos)" if n == 3 else "(sin efectos)")


if __name__ == "__main__":
    main()
