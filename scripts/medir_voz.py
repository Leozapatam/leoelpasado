"""Mide una voz para decidir cuánto corregir: piso de ruido (siseo), eses, cuerpo, volumen.
Uso: python scripts/medir_voz.py archivo1 [archivo2 ...]"""
import subprocess, sys, tempfile, os, wave
import numpy as np

SR = 48000


def cargar(p):
    t = os.path.join(tempfile.gettempdir(), "medir.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-ac", "1", "-ar", str(SR), t], check=True)
    with wave.open(t) as wf:
        return np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768


def banda(x, lo, hi):
    S = np.abs(np.fft.rfft(x)) ** 2
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return S[(f >= lo) & (f < hi)].sum() + 1e-12


for p in sys.argv[1:]:
    a = cargar(p)
    w = int(0.05 * SR)
    v = a[: len(a) // w * w].reshape(-1, w)
    rms = 20 * np.log10(np.sqrt((v ** 2).mean(1)) + 1e-9)
    habla = v[rms > np.percentile(rms, 60)]
    piso = np.percentile(rms, 5)
    # eses: los 2 % de ventanas con más energía 5-10 kHz frente a su energía 200-4000 Hz
    ratios = np.array([10 * np.log10(banda(x, 5000, 10000) / banda(x, 200, 4000)) for x in habla])
    eses = np.percentile(ratios, 98)
    tot = sum(banda(x, 80, 12000) for x in habla[::4])
    cuerpo = 10 * np.log10(sum(banda(x, 100, 250) for x in habla[::4]) / tot)
    caja = 10 * np.log10(sum(banda(x, 250, 600) for x in habla[::4]) / tot)
    pres = 10 * np.log10(sum(banda(x, 2000, 5000) for x in habla[::4]) / tot)
    voz = np.median(rms[rms > np.percentile(rms, 60)])
    print(f"{os.path.basename(p):28s} siseo bajo la voz {voz - piso:5.1f} dB | eses(pico) {eses:+5.1f} dB | cuerpo {cuerpo:5.1f} | caja {caja:5.1f} | presencia {pres:5.1f}")
