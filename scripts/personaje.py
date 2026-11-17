"""Convierte la imagen del personaje (pixel art generado) en un sprite limpio a su resolución real,
con fondo transparente, y genera las variantes de boca y ojos para animarlo con la voz.

Uso: python scripts/personaje.py personaje/originales/5.webp
Salida: public/personaje/{base,boca1,boca2,ojos}.png  +  personaje/vista.png (revisión)"""
import os, sys
import numpy as np
from PIL import Image

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(RAIZ, "public", "personaje")
os.makedirs(OUT, exist_ok=True)

src = np.asarray(Image.open(sys.argv[1]).convert("RGB")).astype(float)
# zona del busto en la imagen 768x1344 (sin textos)
CROP = (220, 495, 550, 885)
im = src[CROP[1]:CROP[3], CROP[0]:CROP[2]]


def error_rejilla(g, ox, oy):
    h, w, _ = im.shape
    e = 0.0
    for y in np.arange(oy, h - g, g):
        for x in np.arange(ox, w - g, g):
            c = im[int(y) + 2:int(y + g) - 2, int(x) + 2:int(x + g) - 2]
            e += c.var(axis=(0, 1)).sum()
    return e


# buscar el tamaño de píxel y el desfase que dejan cada celda más uniforme
mejor = None
for g in np.arange(9.0, 13.01, 0.1):
    for ox in np.arange(0, g, 1.0):
        for oy in np.arange(0, g, 1.0):
            pass
cands = []
for g in np.arange(9.0, 13.01, 0.1):
    e = min((error_rejilla(g, ox, oy), ox, oy) for ox in np.arange(0, g, 1.5) for oy in np.arange(0, g, 1.5))
    cands.append((e[0], g, e[1], e[2]))
_, g, ox, oy = min(cands)
print(f"rejilla: {g:.2f} px, desfase ({ox}, {oy})")

h, w, _ = im.shape
filas = int((h - oy) // g)
cols = int((w - ox) // g)
sprite = np.zeros((filas, cols, 4), np.uint8)
for r in range(filas):
    for c in range(cols):
        y0, x0 = int(oy + r * g), int(ox + c * g)
        cel = im[y0 + 2:int(y0 + g) - 2, x0 + 2:int(x0 + g) - 2].reshape(-1, 3)
        col = np.median(cel, axis=0)
        sat = col.max() - col.min()
        fondo = col.mean() > 205 and sat < 30  # beige claro del fondo
        sprite[r, c] = (*col.astype(np.uint8), 0 if fondo else 255)

# quitar islas de fondo que quedaron dentro (no tocan nada opaco): no hace falta, el contorno es oscuro
ys, xs = np.where(sprite[..., 3] > 0)
sprite = sprite[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
Image.fromarray(sprite).save(os.path.join(OUT, "base.png"))
print("sprite:", sprite.shape[1], "x", sprite.shape[0], "píxeles")

# vista ampliada con rejilla y coordenadas para ubicar boca y ojos
S = 20
big = Image.fromarray(sprite).resize((sprite.shape[1] * S, sprite.shape[0] * S), Image.NEAREST)
fondo = Image.new("RGBA", big.size, (60, 120, 60, 255))
fondo.alpha_composite(big)
from PIL import ImageDraw
d = ImageDraw.Draw(fondo)
for x in range(sprite.shape[1]):
    d.line([(x * S, 0), (x * S, big.size[1])], fill=(0, 0, 0, 60))
    d.text((x * S + 3, 2), str(x), fill=(255, 255, 255, 255))
for y in range(sprite.shape[0]):
    d.line([(0, y * S), (big.size[0], y * S)], fill=(0, 0, 0, 60))
    d.text((2, y * S + 4), str(y), fill=(255, 255, 255, 255))
fondo.save(os.path.join(RAIZ, "personaje", "vista.png"))

# ---- limpieza: restos grises del fondo
for (x, y) in [(9, 0), (23, 3), (1, 12), (25, 20)]:
    if y < sprite.shape[0] and x < sprite.shape[1]:
        c = sprite[y, x, :3].astype(int)
        if c.max() - c.min() < 30 and c.mean() > 110:
            sprite[y, x, 3] = 0
# borde: píxeles grisáceos pegados al fondo (restos del fondo mezclados) -> color del contorno
CONTORNO = (26, 21, 33)
H_, W_ = sprite.shape[:2]
for y in range(H_):
    for x in range(W_):
        if sprite[y, x, 3] == 0:
            continue
        c = sprite[y, x, :3].astype(int)
        borde = any(not (0 <= y + dy < H_ and 0 <= x + dx < W_) or sprite[y + dy, x + dx, 3] == 0
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        if borde and c.max() - c.min() < 35 and 45 < c.mean() < 200:
            sprite[y, x, :3] = CONTORNO
sprite[sprite[..., 3] == 0] = 0  # píxeles transparentes sin color (evita halos al escalar)
Image.fromarray(sprite).save(os.path.join(OUT, "base.png"))

# ---- capas para animar (coordenadas en píxeles del sprite; ver personaje/vista.png)
PIEL = tuple(int(v) for v in sprite[14, 14, :3])
BOCA = (34, 12, 14)
LENGUA = (120, 40, 44)


def capa(pixeles):
    c = np.zeros_like(sprite)
    for (x, y), col in pixeles.items():
        c[y, x] = (*col, 255)
    return c


# ojos: columnas 11-12 y 17-18, filas 13-15 · bigote: fila 18 · boca: fila 19, columnas 13-16 · perilla: filas 20-21
boca1 = capa({(x, 19): BOCA for x in (14, 15)})
boca2 = capa({**{(x, 19): BOCA for x in (13, 14, 15, 16)}, **{(x, 20): LENGUA for x in (14, 15)}, (13, 20): BOCA, (16, 20): BOCA})
ojos = capa({**{(x, y): PIEL for x in (11, 12, 17, 18) for y in (13, 14)}, **{(x, 15): (40, 22, 26) for x in (11, 12, 17, 18)}})
for nombre, c in (("boca1", boca1), ("boca2", boca2), ("ojos", ojos)):
    Image.fromarray(c).save(os.path.join(OUT, f"{nombre}.png"))
print("capas: boca1, boca2, ojos")

# =====================================================================
# Cuerpo entero (dibujado píxel a píxel con la paleta de la imagen 2)
# Lienzo 40 x 63: el busto queda arriba a la izquierda; el espacio a la
# derecha es para el brazo que señala.
# =====================================================================
CW, CH = 40, 63
CONT = (26, 21, 33)
CAMISA, CAMISA_SOMBRA = (45, 46, 53), (37, 37, 44)
PIEL_C, PIEL_SOMBRA = (224, 175, 132), (201, 140, 108)
JEAN, JEAN_LUZ, JEAN_SOMBRA = (36, 44, 70), (56, 68, 102), (28, 33, 52)
BOTA, BOTA_LUZ, SUELA = (78, 50, 36), (106, 72, 52), (30, 22, 20)
CINTO, HEBILLA = (44, 32, 28), (168, 144, 98)
CEJA = (58, 36, 34)
LASER, ROJO = (40, 40, 46), (193, 18, 31)

cuerpo = np.zeros((CH, CW, 4), np.uint8)
cuerpo[:sprite.shape[0], :sprite.shape[1]] = sprite


def p(x, y, col):
    cuerpo_actual[y, x] = (*col, 255)


def borrar(x, y):
    cuerpo_actual[y, x] = 0


cuerpo_actual = cuerpo
# cejas serias (rectas, un poco pesadas)
for x in (11, 12, 17, 18):
    p(x, 12, CEJA)
# torso: filas 36-45, contorno en columnas 8 y 21
for y in range(36, 46):
    p(8, y, CONT); p(21, y, CONT)
    for x in range(9, 21):
        p(x, y, CAMISA_SOMBRA if x == 9 or y == 45 else CAMISA)
# brazo izquierdo (columnas 3-7) y mano
for y in range(36, 40):
    p(3, y, CONT); p(7, y, CONT)
    for x in (4, 5, 6):
        p(x, y, PIEL_C if x != 6 else PIEL_SOMBRA)
for y in (40, 41):
    p(3, y, CONT); p(7, y, CONT)
    for x in (4, 5, 6):
        p(x, y, PIEL_SOMBRA if y == 41 else PIEL_C)
for x in (4, 5, 6):
    p(x, 42, CONT)
# brazo derecho (columnas 22-23) y mano
for y in range(36, 42):
    p(24, y, CONT)
    for x in (22, 23):
        p(x, y, PIEL_SOMBRA if (y == 41 or x == 23) else PIEL_C)
for x in (22, 23):
    p(x, 42, CONT)
# cinturón
for x in range(8, 22):
    p(x, 46, CONT if x in (8, 21) else CINTO)
p(14, 46, HEBILLA); p(15, 46, HEBILLA)
# jean: cadera (47-50) y piernas (51-58)
for y in range(47, 59):
    if y <= 50:
        p(8, y, CONT); p(21, y, CONT)
        for x in range(9, 21):
            p(x, y, JEAN_SOMBRA if x in (9, 20) else JEAN)
    else:
        for (a, b) in ((8, 13), (16, 21)):
            p(a, y, CONT); p(b, y, CONT)
            for x in range(a + 1, b):
                p(x, y, JEAN_LUZ if x == a + 2 else JEAN_SOMBRA if x == b - 1 else JEAN)
for x in (14, 15):
    p(x, 50, CONT)  # entrepierna
# botas (59-62)
for (a, b) in ((7, 13), (16, 22)):
    for y in range(59, 63):
        p(a, y, CONT); p(b, y, CONT)
        for x in range(a + 1, b):
            p(x, y, SUELA if y == 62 else BOTA_LUZ if (y == 59 and x == a + 2) else BOTA)
    for x in range(a, b + 1):
        p(x, 58 if x in (a, b) else 62, CONT if x in (a, b) else SUELA)
Image.fromarray(cuerpo).save(os.path.join(OUT, "cuerpo.png"))

# pose: señala con el brazo derecho extendido (para la entrada del video)
senala = cuerpo.copy()
cuerpo_actual = senala
for y in range(32, 43):
    for x in (22, 23, 24):
        borrar(x, y)
for y in range(32, 36):
    p(21, y, CONT)
# manga hacia la derecha (filas 25-30) y antebrazo
for y in range(25, 31):
    for x in range(21, 26):
        p(x, y, CONT if y in (25, 30) or x == 25 else CAMISA)
for y in range(26, 30):
    for x in range(26, 33):
        p(x, y, CONT if y in (26, 29) else PIEL_SOMBRA if y == 28 else PIEL_C)
# mano y puntero láser
for y in range(25, 30):
    for x in (33, 34):
        p(x, y, CONT if y in (25,) or x == 34 and y in (28, 29) else PIEL_C)
for x in (35, 36, 37):
    p(x, 26, CONT); p(x, 27, LASER)
p(38, 26, ROJO); p(38, 27, ROJO)
Image.fromarray(senala).save(os.path.join(OUT, "cuerpo_senala.png"))

# capas de boca y ojos en el lienzo del cuerpo (misma cabeza, mismas coordenadas)
for nombre in ("boca1", "boca2", "ojos"):
    c = np.asarray(Image.open(os.path.join(OUT, f"{nombre}.png")))
    lienzo = np.zeros((CH, CW, 4), np.uint8)
    lienzo[:c.shape[0], :c.shape[1]] = c
    Image.fromarray(lienzo).save(os.path.join(OUT, f"cuerpo_{nombre}.png"))
print("cuerpo entero: cuerpo.png, cuerpo_senala.png + capas")
