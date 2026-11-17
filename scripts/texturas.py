"""Genera las texturas fotográficas de la plantilla (corcho, papel, madera).
Uso: python scripts/texturas.py  -> public/texturas/*.jpg"""
import os
import numpy as np
from scipy.ndimage import gaussian_filter, zoom
from scipy.signal import fftconvolve

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "texturas")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(1928)


def noise(h, w, scale):
    """Ruido suave: ruido blanco pequeño ampliado."""
    sh, sw = max(2, h // scale), max(2, w // scale)
    n = rng.standard_normal((sh, sw))
    n = zoom(n, (h / sh, w / sw), order=3)[:h, :w]
    return (n - n.mean()) / (n.std() + 1e-9)


def shade(height, strength, light=(-1, -1.4)):
    """Iluminación tipo relieve a partir de un mapa de alturas."""
    gy, gx = np.gradient(height)
    lx, ly = light
    s = -(gx * lx + gy * ly) * strength
    return s


def save(name, rgb):
    from PIL import Image
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=88)
    print("ok", name, rgb.shape[1], "x", rgb.shape[0])


def corcho(h=3400, w=2400):
    # gránulos: muchas manchas irregulares de distintos tonos
    gran = np.zeros((h, w))
    for size, amp in ((3, 0.9), (6, 0.7), (12, 0.45), (40, 0.35), (160, 0.25)):
        gran += noise(h, w, size) * amp
    # poros oscuros
    pores = gaussian_filter((rng.random((h, w)) > 0.9965).astype(float), 1.6)
    pores = pores / pores.max()
    height = gaussian_filter(gran, 1.2) - pores * 2.5
    base = np.array([118, 82, 50], float)  # corcho natural
    tone = gran * 9 + shade(height, 22)
    rgb = base[None, None, :] + tone[..., None] * np.array([1.0, 0.82, 0.6])
    # vetas cálidas y manchas de uso
    rgb += noise(h, w, 260)[..., None] * np.array([10, 7, 3])
    rgb -= pores[..., None] * np.array([55, 42, 30])
    # marcas de chinchetas viejas y rectángulos de papel que ya no están
    holes = np.zeros((h, w))
    holes[rng.integers(0, h, 140), rng.integers(0, w, 140)] = 1
    holes = gaussian_filter(holes, 2.2); holes /= holes.max()
    rgb *= (1 - np.clip(holes * 1.6, 0, 0.6))[..., None]
    for _ in range(9):
        y, x = rng.integers(0, h - 500), rng.integers(0, w - 500)
        hh, ww = rng.integers(220, 480), rng.integers(260, 420)
        m = np.zeros((h, w)); m[y:y + hh, x:x + ww] = 1
        rgb *= (1 + gaussian_filter(m, 10) * 0.06)[..., None]
    save("corcho.jpg", rgb)


def papel(h=1200, w=1600):
    fib = noise(h, w, 2) * 0.6 + noise(h, w, 8) * 0.5 + noise(h, w, 60) * 0.8
    # fibras alargadas
    k = np.zeros((1, 41)); k[0, :] = 1 / 41
    streak = fftconvolve(rng.standard_normal((h, w)), k, mode="same") * 6
    base = np.array([236, 224, 198], float)
    rgb = base[None, None, :] + (fib * 4 + streak * 2)[..., None]
    # manchas de humedad y oscurecimiento de bordes
    stains = np.clip(noise(h, w, 180), 0.8, None) - 0.8
    rgb -= gaussian_filter(stains, 20)[..., None] * np.array([28, 34, 46])
    yy, xx = np.mgrid[0:h, 0:w]
    edge = np.minimum.reduce([xx, w - xx, yy, h - yy]) / 90
    rgb -= (np.clip(1 - edge, 0, 1) ** 2)[..., None] * np.array([40, 46, 58])
    save("papel.jpg", rgb)


def madera(h=3400, w=2400):
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    warp = noise(h, w, 420) * 26 + noise(h, w, 90) * 5 + noise(h, w, 20) * 0.8
    contrast = 0.55 + 0.45 * np.clip(noise(h, w, 140), -1, 1)
    rings = (np.sin((xx + warp) / 3.2) * 0.45 + np.sin((xx + warp * 1.4) / 12.0) * 0.55) * contrast
    fine = noise(h, w, 2) * 0.4
    # el grano corre en vertical: se estira el ruido
    grain = gaussian_filter(rng.standard_normal((h, w)), (14, 0.8)) * 8
    height = rings * 0.6 + grain * 0.1 + fine
    base = np.array([62, 38, 22], float)  # nogal oscuro
    rgb = base[None, None, :] + (rings * 9 + grain * 1.6 + fine * 4)[..., None] * np.array([1, .75, .5])
    rgb += shade(height, 6)[..., None]
    # tablones
    for x0 in range(0, w, 600):
        rgb[:, x0:x0 + 4] *= 0.45
    save("madera.jpg", rgb)


if __name__ == "__main__":
    corcho(); papel(); madera()
