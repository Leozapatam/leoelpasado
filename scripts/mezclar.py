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


def microfono_antiguo(voz):
    """Estilo «micrófono antiguo» (cinta de los años 40): banda más angosta, presencia cálida,
    saturación suave de válvula y un ruido de fondo muy tenue. El ruido pasa a ser estética, no defecto."""
    from scipy.signal import butter, sosfilt, lfilter
    sos = butter(2, [160, 6000], "band", fs=SR, output="sos")
    v = sosfilt(sos, voz, axis=0)
    # presencia cálida en 1,6 kHz (+3 dB) y un poco menos de "caja" en 400 Hz (-1,5 dB)
    for fc, g, q in ((1600, 3.0, 0.9), (400, -1.5, 1.0)):
        A = 10 ** (g / 40); w0 = 2 * np.pi * fc / SR; al = np.sin(w0) / (2 * q)
        b = np.array([1 + al * A, -2 * np.cos(w0), 1 - al * A]); a = np.array([1 + al / A, -2 * np.cos(w0), 1 - al / A])
        v = lfilter(b / a[0], a / a[0], v, axis=0)
    pico = np.abs(v).max() + 1e-9
    sat = np.tanh(v / pico * 2.2) * pico / np.tanh(2.2)
    v = v * 0.6 + sat * 0.4
    # ruido de válvula: rosa suave, filtrado, a unos -50 dB de la voz
    rng = np.random.default_rng(1940)
    ruido = sosfilt(butter(1, [300, 5000], "band", fs=SR, output="sos"), rng.standard_normal(v.shape), axis=0)
    ruido *= np.sqrt((v ** 2).mean()) * 10 ** (-50 / 20) / (np.sqrt((ruido ** 2).mean()) + 1e-9)
    return (v + ruido).astype(np.float32)


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
        voz = microfono_antiguo(voz)
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
