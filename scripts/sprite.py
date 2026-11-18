"""Convierte una imagen pixel art (personaje sobre fondo blanco o claro) en un sprite limpio a su resolución real.

Uso: python scripts/sprite.py <imagen> <nombre>
Salida: public/personaje/<nombre>.png  (fondo transparente, 1 píxel = 1 píxel del dibujo)
        personaje/vista-<nombre>.png   (ampliado con rejilla y coordenadas, para revisar)

Sirve para cualquier personaje histórico que aparezca en un episodio (Benjamin, Bloch…).
El estilo de la casa: chibi de cuerpo entero, contorno oscuro, fondo blanco, de frente.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import label

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def rejilla(im):
    """Busca el tamaño de píxel y el desfase que dejan cada celda más uniforme."""
    def error(g, ox, oy):
        h, w, _ = im.shape
        e = 0.0
        for y in np.arange(oy, h - g, g * 2):
            for x in np.arange(ox, w - g, g * 2):
                c = im[int(y) + 2:int(y + g) - 2, int(x) + 2:int(x + g) - 2]
                e += c.var(axis=(0, 1)).sum()
        return e
    return min((error(g, ox, oy), g, ox, oy) for g in np.arange(7.0, 13.01, 0.1)
               for ox in np.arange(0, g, 1.5) for oy in np.arange(0, g, 1.5))[1:]


def extraer(ruta, nombre):
    im = np.asarray(Image.open(ruta).convert("RGB")).astype(float)
    g, ox, oy = rejilla(im)
    filas, cols = int((im.shape[0] - oy) // g), int((im.shape[1] - ox) // g)
    px = np.zeros((filas, cols, 3))
    for r in range(filas):
        for c in range(cols):
            y0, x0 = int(oy + r * g), int(ox + c * g)
            px[r, c] = np.median(im[y0 + 2:int(y0 + g) - 2, x0 + 2:int(x0 + g) - 2].reshape(-1, 3), axis=0)
    # fondo: celdas claras y sin color conectadas con el borde
    claro = (px.mean(2) > 225) & ((px.max(2) - px.min(2)) < 25)
    lab, _ = label(claro)
    borde = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1])
    fondo = np.isin(lab, [b for b in borde if b])
    sprite = np.zeros((filas, cols, 4), np.uint8)
    sprite[..., :3] = px.astype(np.uint8)
    sprite[..., 3] = np.where(fondo, 0, 255)
    ys, xs = np.where(sprite[..., 3] > 0)
    sprite = sprite[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    sprite[sprite[..., 3] == 0] = 0
    os.makedirs(os.path.join(RAIZ, "public", "personaje"), exist_ok=True)
    Image.fromarray(sprite).save(os.path.join(RAIZ, "public", "personaje", f"{nombre}.png"))
    S = 10
    big = Image.fromarray(sprite).resize((sprite.shape[1] * S, sprite.shape[0] * S), Image.NEAREST)
    vista = Image.new("RGBA", big.size, (60, 120, 60, 255))
    vista.alpha_composite(big)
    d = ImageDraw.Draw(vista)
    for x in range(0, sprite.shape[1], 5):
        d.text((x * S + 1, 1), str(x), fill="white")
    for y in range(0, sprite.shape[0], 5):
        d.text((1, y * S + 1), str(y), fill="white")
    vista.save(os.path.join(RAIZ, "personaje", f"vista-{nombre}.png"))
    # registro de tamaños (lo usa src/componentes/Personaje.tsx)
    reg_ruta = os.path.join(RAIZ, "public", "personaje", "sprites.json")
    reg = json.load(open(reg_ruta)) if os.path.exists(reg_ruta) else {}
    reg[nombre] = [int(sprite.shape[1]), int(sprite.shape[0])]
    json.dump(reg, open(reg_ruta, "w"), indent=1)
    print(f"{nombre}: rejilla {g:.2f} px → sprite {sprite.shape[1]} x {sprite.shape[0]}")


if __name__ == "__main__":
    extraer(sys.argv[1], sys.argv[2])
