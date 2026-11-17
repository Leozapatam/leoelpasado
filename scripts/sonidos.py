"""Biblioteca de efectos de sonido de @leoelpasado: todos sintetizados (originales, sin derechos de terceros).

Cada función devuelve un arreglo mono a 48 kHz, normalizado a pico ~1. El volumen final lo decide efectos.py.
Para escucharlos sueltos:  python scripts/sonidos.py  ->  out/sonidos/*.wav
"""
import os
import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
_rng = np.random.default_rng(1886)


def _t(seg):
    return np.arange(int(seg * SR)) / SR


def _bp(x, lo, hi, orden=2):
    return sosfilt(butter(orden, [lo, hi], "band", fs=SR, output="sos"), x)


def _lp(x, f, orden=2):
    return sosfilt(butter(orden, f, "low", fs=SR, output="sos"), x)


def _hp(x, f, orden=2):
    return sosfilt(butter(orden, f, "high", fs=SR, output="sos"), x)


def _norm(x):
    m = np.abs(x).max()
    return x / m if m > 0 else x


def _env(n, ataque, caida):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(ataque, 1e-4)) * np.exp(-t / caida)


def _ruido(seg):
    return _rng.standard_normal(int(seg * SR))


# ---------------- objetos de papel y tablero ----------------
def papel(dur=0.22):
    """Roce de papel: ruido en banda alta con 'crujidos' (modulación irregular)."""
    n = int(dur * SR)
    crujido = np.repeat(_rng.random(n // 240 + 1) ** 3, 240)[:n]
    x = _bp(_ruido(dur), 1800, 7500) * (0.4 + crujido) * _env(n, 0.01, dur / 3)
    return _norm(x)


def chincheta():
    """Clavar una chincheta en el corcho: clic seco + golpecito grave."""
    n = int(0.12 * SR)
    clic = _hp(_ruido(0.12), 2500) * _env(n, 0.0005, 0.006)
    golpe = np.sin(2 * np.pi * 150 * _t(0.12)) * _env(n, 0.002, 0.03)
    return _norm(clic * 0.8 + golpe * 0.6)


def ficha():
    return _norm(np.concatenate([papel(0.18), np.zeros(int(0.03 * SR))])[: int(0.21 * SR)] * 0.7 + np.pad(chincheta(), (int(0.09 * SR), 0))[: int(0.21 * SR)])


def hilo(dur=0.5):
    """Hilo que se tensa: ruido filtrado con barrido ascendente."""
    n = int(dur * SR)
    x = _ruido(dur)
    out = np.zeros(n)
    tramos = 24
    for i in range(tramos):
        a, b = i * n // tramos, (i + 1) * n // tramos
        f = 600 + 2600 * (i / tramos) ** 1.5
        out[a:b] = _bp(x[a:b], f, f * 1.6)
    return _norm(out * np.sin(np.linspace(0, np.pi, n)) ** 0.7)


def sello():
    """Sello de tinta: golpe grave + palmada de papel."""
    n = int(0.35 * SR)
    t = _t(0.35)
    golpe = np.sin(2 * np.pi * (55 + 60 * np.exp(-t * 40)) * t) * _env(n, 0.001, 0.07)
    palmada = _bp(_ruido(0.35), 400, 3000) * _env(n, 0.0008, 0.025)
    return _norm(golpe + palmada * 0.7)


def lupa():
    """Destello de cristal: brillo agudo y breve."""
    t = _t(0.6)
    f = 3200 + 2400 * t / 0.6
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 + np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 0.3
    return _norm(x * _env(len(t), 0.02, 0.18))


def obturador():
    """Cámara de fotos (polaroid): dos clics + motor."""
    n = int(0.45 * SR)
    x = np.zeros(n)
    for d in (0.0, 0.06):
        i = int(d * SR)
        c = _hp(_ruido(0.03), 1500) * _env(int(0.03 * SR), 0.0005, 0.005)
        x[i:i + len(c)] += c
    motor = _bp(_ruido(0.3), 300, 1200) * (0.5 + 0.5 * np.sin(2 * np.pi * 40 * _t(0.3)))
    x[int(0.12 * SR):int(0.42 * SR)] += motor * 0.25
    return _norm(x)


# ---------------- máquina de escribir ----------------
def tecla(variante=0):
    rng = np.random.default_rng(variante)
    n = int(0.05 * SR)
    golpe = _hp(rng.standard_normal(n), 1200 + rng.integers(0, 600)) * _env(n, 0.0004, 0.006)
    metal = np.sin(2 * np.pi * (2800 + rng.integers(0, 900)) * _t(0.05)) * _env(n, 0.001, 0.012)
    return _norm(golpe + metal * 0.25)


def campanita():
    """Campana del carro de la máquina de escribir."""
    t = _t(0.9)
    x = sum(np.sin(2 * np.pi * 2650 * h * t) * a for h, a in ((1, 1), (2.76, 0.3), (5.4, 0.12)))
    return _norm(x * _env(len(t), 0.001, 0.25))


# ---------------- cámara y transiciones ----------------
def whoosh(dur=0.55, grave=False):
    n = int(dur * SR)
    x = _ruido(dur)
    out = np.zeros(n)
    for i in range(20):
        a, b = i * n // 20, (i + 1) * n // 20
        c = (220 if grave else 500) + (1600 if grave else 3500) * np.sin(np.pi * i / 20)
        out[a:b] = _bp(x[a:b], c * 0.6, c * 1.4)
    return _norm(out * np.sin(np.linspace(0, np.pi, n)) ** 1.5)


def pop():
    """Pin en el mapa / aparición."""
    t = _t(0.12)
    return _norm(np.sin(2 * np.pi * (700 * np.exp(-t * 18) + 250) * t) * _env(len(t), 0.001, 0.035))


def tinta():
    """Un país se tiñe: tono suave y grave que florece."""
    t = _t(1.2)
    x = np.sin(2 * np.pi * 110 * t) + 0.5 * np.sin(2 * np.pi * 165 * t) + 0.25 * np.sin(2 * np.pi * 220 * t)
    return _norm(_lp(x, 900) * np.minimum(1, t / 0.25) * np.exp(-t / 0.5))


def laser():
    t = _t(0.25)
    return _norm(np.sin(2 * np.pi * (1800 + 600 * np.sin(2 * np.pi * 30 * t)) * t) * _env(len(t), 0.002, 0.08))


# ---------------- gente ----------------
def aplausos(dur=3.0, personas=40):
    """Aplausos sintetizados: muchas palmadas con tiempos irregulares."""
    n = int(dur * SR)
    x = np.zeros(n)
    for _ in range(personas):
        ritmo = _rng.uniform(0.18, 0.3)
        t0 = _rng.uniform(0, 0.4)
        while t0 < dur - 0.05:
            i = int(t0 * SR)
            c = _bp(_rng.standard_normal(int(0.025 * SR)), 900, 6000) * _env(int(0.025 * SR), 0.0005, 0.006)
            x[i:i + len(c)] += c * _rng.uniform(0.4, 1)
            t0 += ritmo * _rng.uniform(0.85, 1.15)
    forma = np.minimum(1, np.arange(n) / (0.3 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.8 * SR))
    return _norm(x * forma)


def murmullo(dur=4.0):
    """Murmullo de gente lejana (sala, aula): voces sin palabras."""
    n = int(dur * SR)
    x = np.zeros(n)
    for _ in range(14):
        f0 = _rng.uniform(110, 230)
        silabas = np.repeat(_rng.random(int(dur * 5) + 1) > 0.35, SR // 5)[:n].astype(float)
        silabas = _lp(silabas, 6)
        voz = sum(np.sin(2 * np.pi * f0 * h * _t(dur) + _rng.uniform(0, 6)) / h for h in range(1, 6))
        x += _bp(voz * silabas, 300, 2500)
    return _norm(_lp(x, 1800))


# ---------------- ambientes (camas largas, muy bajas) ----------------
def ambiente(tipo, dur):
    n = int(dur * SR)
    if tipo == "archivo":  # sala de archivo: aire quieto + papeles lejanos
        base = _lp(_ruido(dur), 500) * 0.6 + _bp(_ruido(dur), 2000, 6000) * 0.05
        for _ in range(int(dur / 4)):
            i = _rng.integers(0, max(1, n - SR))
            p = papel(0.4) * 0.25
            base[i:i + len(p)] += _lp(p, 3000)
    elif tipo == "escritorio":  # lámpara + reloj de pared lejano
        base = _lp(_ruido(dur), 350) * 0.5
        for k in range(int(dur)):
            i = int(k * SR)
            c = _bp(_ruido(0.02), 2000, 5000) * _env(int(0.02 * SR), 0.0005, 0.004) * 0.25
            base[i:i + len(c)] += c
    elif tipo == "mapa":  # viento suave, alto y lejano
        lfo = 0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * np.arange(n) / SR)
        base = _bp(_ruido(dur), 250, 1400) * lfo
    else:  # sala neutra
        base = _lp(_ruido(dur), 400)
    return _norm(base)


def reverb_ir(seg=0.6, decaimiento=3.0):
    """Respuesta al impulso de una sala pequeña: une voz, música y efectos en el mismo 'lugar'."""
    n = int(seg * SR)
    ir = _rng.standard_normal((2, n)) * np.exp(-np.arange(n) / SR * decaimiento / seg * 2)
    ir[:, : int(0.008 * SR)] = 0  # pre-delay
    return np.stack([_lp(ir[0], 6000), _lp(ir[1], 6000)])


CATALOGO = {
    "papel": papel, "chincheta": chincheta, "ficha": ficha, "hilo": hilo, "sello": sello, "lupa": lupa,
    "obturador": obturador, "tecla": tecla, "campanita": campanita, "whoosh": whoosh, "pop": pop,
    "tinta": tinta, "laser": laser, "aplausos": aplausos, "murmullo": murmullo,
}

if __name__ == "__main__":
    import wave
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "out", "sonidos")
    os.makedirs(out, exist_ok=True)
    for nombre, f in CATALOGO.items():
        x = f()
        with wave.open(os.path.join(out, f"{nombre}.wav"), "w") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((x * 0.8 * 32767).astype(np.int16).tobytes())
        print(nombre, f"{len(x) / SR:.2f} s")
