"""Paso 2 de cada episodio: música noir original + mezcla con la voz.

Uso: python scripts/musica.py <slug>
Lee "musica" y "duracion" de public/episodios/<slug>/episodio.json y crea musica.wav y mezcla.wav.
Pad menor, pulso de corazón, tic-tac, piano y golpes sincronizados con los momentos del episodio.
La música baja sola cuando hablas (sidechain) y la mezcla queda a -14 LUFS (estándar Reels/TikTok)."""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SLUG = sys.argv[1]
CARPETA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "episodios", SLUG)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from anclas import resolver  # noqa: E402
EP = resolver(json.load(open(os.path.join(CARPETA, "episodio.json"), encoding="utf-8")),
              json.load(open(os.path.join(CARPETA, "palabras.json"), encoding="utf-8")))
M = EP["musica"]

INTRO = EP.get("intro", {}).get("duracion", 0)  # la entrada va antes de la voz
SR = 48000
DUR = EP["duracion"] + INTRO
N = int(SR * DUR)
rng = np.random.default_rng(7)
t = np.arange(N) / SR

# Momentos clave (segundos de la voz), definidos en episodio.json
HITS = [h + INTRO for h in M["golpes"]]               # cambios de escena, fichas, pines
STAMPS = [h + INTRO for h in M.get("sellos", [])]     # sellos de tinta
RISERS = [h + INTRO for h in M.get("subidas", [])]    # subidas antes de un momento grande
END = M["final"] + INTRO                              # tarjeta final
WIDE = RISERS[0] if RISERS else END

def hz(n):  # nota MIDI -> Hz
    return 440 * 2 ** ((n - 69) / 12)

def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)

def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)

def saw(f, n, phase=0):
    p = (np.arange(n) * f / SR + phase) % 1
    return 2 * p - 1

def env(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e

L = np.zeros(N); R = np.zeros(N)
def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    j = min(N, i + len(sig))
    if j <= i: return
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt(0.5 * (1 - pan))
    R[i:j] += s * np.sqrt(0.5 * (1 + pan))

# ---- 1. Pad: Dm - Bb - Gm - A (8 s por acorde), sierras desafinadas y filtradas
chords = [[38, 45, 50, 53, 57], [34, 46, 50, 53, 58], [31, 43, 50, 55, 58], [33, 45, 49, 52, 57]]
seg = 8.0
for k in range(int(np.ceil(DUR / seg)) + 1):
    start = k * seg - 1.0
    if start > DUR: break
    notes = chords[k % 4] if start < END - 1 else [38, 45, 50, 53, 57]
    n = int((seg + 2.5) * SR)
    voice = np.zeros(n)
    for m in notes:
        for det in (-0.07, 0, 0.06):
            voice += saw(hz(m + det), n, rng.random())
    sweep = 500 + 350 * np.sin(np.linspace(0, np.pi, n))
    voice = lp(voice, 700) * 0.5 + lp(voice, 1200) * 0.15 * (sweep / 850)
    voice *= env(n, 2.0, 2.5) / len(notes) / 3
    add(voice, max(0, start), 0.55, pan=0.15 * (-1) ** k)

# ---- 2. Pulso de corazón grave (desde la primera ficha)
for beat in np.arange(INTRO + 6.3, END, 60 / 62):
    for off, g in ((0, 1.0), (0.22, 0.6)):
        n = int(0.35 * SR); tt = np.arange(n) / SR
        k = np.sin(2 * np.pi * (48 + 30 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9)
        add(k, beat + off, 0.32 * g)

# ---- 3. Tic-tac de reloj, muy discreto
for i, tick in enumerate(np.arange(INTRO + 6.3, WIDE, 1.0)):
    n = int(0.03 * SR)
    c = hp(rng.standard_normal(n), 3000) * np.exp(-np.arange(n) / SR * 180)
    add(c, tick, 0.05, pan=0.35 if i % 2 else -0.35)

# ---- 4. Piano: motivo menor escaso
def piano(m, dur=3.0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = hz(m)
    s = sum(np.sin(2 * np.pi * f * h * tt) * a * np.exp(-tt * (1.5 + h)) for h, a in ((1, 1), (2, .45), (3, .2), (4, .1)))
    return s * np.minimum(1, tt * 300)
motif = [(62, 0), (65, 1.5), (69, 3), (64, 5)]
for bar in (INTRO + 7.0, INTRO + 23.0, INTRO + 33.0):
    for m, dt in motif:
        add(piano(m), bar + dt, 0.07, pan=0.25)
for m, dt in [(62, 0), (69, 0.6), (74, 1.2)]:  # resolución final
    add(piano(m, 4.5), END + 0.2 + dt, 0.09)

# ---- 5. Golpes (impactos) en cada ficha + sello + tarjeta final
def boom(dur=2.2, f0=95, f1=38):
    n = int(dur * SR); tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 6)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.2)
    noise = lp(rng.standard_normal(n), 1800) * np.exp(-tt * 14) * 0.35
    return body + noise
for h in HITS:
    add(boom(), h - 0.02, 0.55)
for st_ in STAMPS:
    add(boom(1.2, 140, 60), st_, 0.3)
add(boom(3.0, 80, 32), END, 0.7)

# ---- 6. Riser antes del plano general y del final
def riser(dur):
    n = int(dur * SR); tt = np.linspace(0, 1, n)
    x = rng.standard_normal(n)
    out = np.zeros(n); blk = n // 40
    for b in range(40):  # filtro que se abre poco a poco
        seg_ = x[b * blk:(b + 1) * blk]
        out[b * blk:(b + 1) * blk] = lp(seg_, 300 + 5000 * (b / 40) ** 2)
    return out * tt ** 2
for r_ in RISERS:
    add(riser(2.2), r_ - 2.2, 0.16, pan=-0.2)
add(riser(1.8), END - 1.8, 0.2, pan=0.2)

# ---- Entrada: clic del láser, subida y golpe cuando la cámara llega al tablero
if INTRO:
    n = int(0.03 * SR)
    add(hp(rng.standard_normal(n), 2500) * np.exp(-np.arange(n) / SR * 150), 0.65, 0.25, pan=0.3)
    add(riser(INTRO * 0.55), INTRO * 0.45, 0.22)
    add(boom(2.4, 110, 40), INTRO - 0.03, 0.7)

# ---- Gancho inicial: drone tenso
n = int(6.5 * SR); tt = np.arange(n) / SR
drone = (np.sin(2 * np.pi * hz(26) * tt) + 0.5 * np.sin(2 * np.pi * hz(38.15) * tt)) * env(n, 1.0, 1.2)
add(drone, INTRO, 0.35)

# ---- Reverb de sala grande (respuesta al impulso sintética)
ir_n = int(2.8 * SR)
ir = rng.standard_normal((2, ir_n)) * np.exp(-np.arange(ir_n) / SR * 2.4)
ir = np.stack([lp(ir[0], 5000), lp(ir[1], 5000)])
wetL = fftconvolve(L, ir[0])[:N]; wetR = fftconvolve(R, ir[1])[:N]
mixL = L + wetL * 0.08; mixR = R + wetR * 0.08

# fade de salida y normalización
fade = np.ones(N); fn = int(2.0 * SR); fade[-fn:] = np.linspace(1, 0, fn)
st = np.stack([mixL, mixR], 1) * fade[:, None]
st = hp(st.T, 30).T
st /= np.abs(st).max() / 0.89

musica = os.path.join(CARPETA, "musica.wav")
with wave.open(musica, "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("musica.wav ->", DUR, "s")

# Mezcla: la música (-5 dB) se agacha cuando hablas y todo queda a -14 LUFS
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", musica, "-i", os.path.join(CARPETA, "voz.wav"), "-filter_complex",
    f"[0:a]volume=0.55[m];[1:a]adelay={int(INTRO * 1000)}|{int(INTRO * 1000)},apad[vd];[vd]asplit=2[v][sc];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450[md];"
    "[md][v]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95,loudnorm=I=-14:TP=-1:LRA=9",
    "-ar", "48000", os.path.join(CARPETA, "mezcla.wav")], check=True)
print("mezcla.wav listo")
