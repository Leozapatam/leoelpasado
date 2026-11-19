"""Convierte una imagen pixel art (personaje sobre fondo blanco o claro) en un sprite limpio a su resolución real.

Uso: python scripts/sprite.py <imagen> <nombre>
     python scripts/sprite.py <hoja> <nombre1,nombre2,...,nombre8> --hoja     (hoja de 4 x 2 poses)
Salida: public/personaje/<nombre>.png  (fondo transparente, 1 píxel = 1 píxel del dibujo)
        personaje/vista-<nombre>.png   (ampliado con rejilla y coordenadas, para revisar)

Sirve para cualquier personaje histórico que aparezca en un episodio (Benjamin, Bloch…).
El estilo de la casa: chibi de cuerpo entero, contorno oscuro, fondo blanco, de frente.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import label, distance_transform_edt

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def rejilla(im, minimo=3.5, maximo=13.0):
    """Busca el tamaño de píxel y el desfase que dejan cada celda más uniforme.
    Se mide el borde de cada celda contra su interior (vectorizado, rápido también con píxeles chicos)."""
    gris = im.mean(2)
    mejor = None
    for g in np.arange(minimo, maximo + 0.01, 0.05):
        m = max(1, int(g * 0.22))
        for ox in np.arange(0, g, max(0.5, g / 8)):
            for oy in np.arange(0, g, max(0.5, g / 8)):
                ys = (oy + np.arange(int((im.shape[0] - oy) // g)) * g).astype(int)
                xs = (ox + np.arange(int((im.shape[1] - ox) // g)) * g).astype(int)
                # varianza dentro de cada celda (muestreo de 2x2 puntos interiores)
                a = gris[np.ix_(ys + m, xs + m)]
                b = gris[np.ix_(ys + int(g) - 1 - m, xs + int(g) - 1 - m)]
                c = gris[np.ix_(ys + m, xs + int(g) - 1 - m)]
                e = (np.abs(a - b) + np.abs(a - c)).mean() + 0.02 * g  # penaliza rejillas muy chicas por igual
                if mejor is None or e < mejor[0]:
                    mejor = (e, g, ox, oy)
    return mejor[1:]


def limpiar(sprite, personaje=False, solo_cabeza=False, publico=False):
    """Para sprites recortados de hojas: quita blancos encerrados (entre brazo y cuerpo, junto al micrófono),
    el halo claro del borde y las motas sueltas que vienen de la pose vecina."""
    rgb = sprite[..., :3].astype(int)
    alfa = sprite[..., 3] > 0
    lum, sat = rgb.mean(2), rgb.max(2) - rgb.min(2)
    # 1. blancos encerrados grandes. Se respetan los ojos y los brillos de las gafas:
    #    en hojas de alta resolución (v2) el blanco del ojo pasa de 40 px, así que en la zona de la cabeza
    #    (el 42 % superior, o toda la imagen en las fichas redondas) solo se quitan blancos muy grandes.
    alto_spr, total = alfa.shape[0], alfa.sum()
    blanco = alfa & (lum > 232) & (sat < 18)
    lab, n = label(blanco)
    for k in range(1, n + 1):
        trozo = lab == k
        area = trozo.sum()
        if area <= 40:
            continue
        en_cabeza = solo_cabeza or np.where(trozo)[0].mean() < 0.42 * alto_spr
        if en_cabeza and area <= 0.02 * total:
            continue
        # objetos: un blanco roto (enchufe, esmalte, papel) es parte del dibujo; solo se quita el blanco puro del fondo
        if (not personaje or publico) and lum[trozo].mean() < 250:
            continue
        alfa[trozo] = False
    # 1b. personajes: puntos blancos o claros pegados al borde (restos del fondo entre rizos, dedos, contorno).
    #     Los ojos y los brillos de las gafas quedan lejos del borde y no se tocan.
    if personaje:
        dist = distance_transform_edt(alfa)
        # en el público solo se quitan motas chicas: una camisa blanca grande toca el borde y debe quedarse
        pasadas = ((190, 40, 60, 2),) if publico else ((225, 25, None, 3), (190, 40, 60, 2))
        for umbral_lum, umbral_sat, tam_max, cerca in pasadas:
            claro = alfa & (lum > umbral_lum) & (sat < umbral_sat)
            lab, n = label(claro)
            for k in range(1, n + 1):
                trozo = lab == k
                if (tam_max is None or trozo.sum() <= tam_max) and dist[trozo].min() <= cerca:
                    alfa[trozo] = False
    # 2. halo: píxeles claros pegados al fondo (dos pasadas)
    for _ in range(2):
        borde = np.zeros_like(alfa)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            borde |= np.roll(~alfa, (dy, dx), (0, 1))
        alfa &= ~(borde & (lum > 190) & (sat < 40))
    # 2b. personajes: el contorno gris claro de 1 píxel (resto del suavizado del dibujo original).
    #     Se quita todo píxel del borde que sea más claro que el contorno oscuro y casi sin color.
    if personaje:
        for _ in range(2):
            borde = np.zeros_like(alfa)
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                borde |= np.roll(~alfa, (dy, dx), (0, 1))
            alfa &= ~(borde & (lum > 80) & (sat < 45))
    # 3. motas sueltas: solo quedan las piezas grandes (el personaje y lo que sostiene)
    lab, n = label(alfa)
    if n > 1:
        tam = np.bincount(lab.ravel())[1:]
        for k, t in enumerate(tam, 1):
            if t < 0.02 * tam.max():
                alfa[lab == k] = False
    sprite[..., 3] = np.where(alfa, 255, 0)
    sprite[~alfa] = 0
    return sprite


def extraer(ruta, nombre, nativo=False):
    im = ruta if isinstance(ruta, np.ndarray) else np.asarray(Image.open(ruta).convert("RGB")).astype(float)
    # nativo: sin ajustar a la rejilla (para hojas reescaladas, donde no hay rejilla limpia)
    g, ox, oy = (1.0, 0.0, 0.0) if nativo else rejilla(im)
    filas, cols = int((im.shape[0] - oy) // g), int((im.shape[1] - ox) // g)
    px = im.copy() if nativo else np.zeros((filas, cols, 3))
    for r in range(0 if nativo else filas):
        for c in range(cols):
            y0, x0 = int(oy + r * g), int(ox + c * g)
            m = max(1, int(g * 0.22))
            px[r, c] = np.median(im[y0 + m:int(y0 + g) - m, x0 + m:int(x0 + g) - m].reshape(-1, 3), axis=0)
    # fondo: celdas claras y sin color conectadas con el borde.
    # En las hojas v2 de público y objetos el fondo es blanco puro: un umbral más alto evita borrar camisas o papeles claros.
    base = os.path.basename(nombre)
    umbral = 246 if base.startswith(("pub-", "obj-aula", "obj-egg")) else 225
    claro = (px.mean(2) > umbral) & ((px.max(2) - px.min(2)) < 25)
    lab, _ = label(claro)
    borde = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1])
    fondo = np.isin(lab, [b for b in borde if b])
    # público (bustos cortados abajo): una camisa blanca toca el borde inferior y se confunde con el fondo.
    # En la mitad de abajo se rellena cada fila entre el primer y el último píxel del contorno.
    if base.startswith("pub-"):
        filas_dib = np.where((~fondo).any(1))[0]
        if len(filas_dib):
            y0 = filas_dib[0] + int(0.55 * (filas_dib[-1] - filas_dib[0]))
            for yy in range(y0, fondo.shape[0]):
                xs = np.where(~fondo[yy])[0]
                if len(xs) > 1:
                    fondo[yy, xs.min():xs.max() + 1] = False
    sprite = np.zeros((filas, cols, 4), np.uint8)
    sprite[..., :3] = np.nan_to_num(px).astype(np.uint8)
    sprite[..., 3] = np.where(fondo, 0, 255)
    if nativo:
        base = os.path.basename(nombre)  # admite modelos en subcarpeta: "v2/leo-normal"
        sprite = limpiar(sprite, personaje=base.startswith(("leo-", "ficha-")) or not base.startswith(("obj-", "ico-")),
                         solo_cabeza=base.startswith("ficha-"), publico=base.startswith("pub-"))
    ys, xs = np.where(sprite[..., 3] > 0)
    sprite = sprite[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    sprite[sprite[..., 3] == 0] = 0
    salida = os.path.join(RAIZ, "public", "personaje", f"{nombre}.png")
    os.makedirs(os.path.dirname(salida), exist_ok=True)
    os.makedirs(os.path.dirname(os.path.join(RAIZ, "personaje", f"vista-{nombre}.png")), exist_ok=True)
    Image.fromarray(sprite).save(salida)
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
    # centro de los pies (para anclar poses que estiran un brazo) y punta derecha (para el láser)
    alfa = sprite[..., 3] > 0
    pies = alfa[int(sprite.shape[0] * 0.85):]
    cx = float(np.mean(np.where(pies)[1])) if pies.any() else sprite.shape[1] / 2
    filas_brazo = alfa[: int(sprite.shape[0] * 0.6)]
    ys, xs = np.where(filas_brazo)
    punta = [int(xs.max()), int(ys[xs.argmax()])] if len(xs) else [sprite.shape[1], 0]
    reg[nombre] = [int(sprite.shape[1]), int(sprite.shape[0]), round(cx, 1), punta]
    json.dump(reg, open(reg_ruta, "w"), indent=1)
    print(f"{nombre}: rejilla {g:.2f} px → sprite {sprite.shape[1]} x {sprite.shape[0]}")


def separar_hoja(ruta, columnas=4, filas=2):
    """Corta una hoja de poses por los huecos blancos más cercanos a la cuadrícula ideal."""
    im = np.asarray(Image.open(ruta).convert("RGB")).astype(float)
    tinta = (im.mean(2) < 225) | ((im.max(2) - im.min(2)) > 25)
    h, w = tinta.shape

    def cortes(perfil, n, total):
        out = [0]
        for k in range(1, n):
            ideal = int(total * k / n)
            ventana = perfil[ideal - total // (3 * n): ideal + total // (3 * n)]
            out.append(ideal - total // (3 * n) + int(np.argmin(ventana)))
        return out + [total]

    ys = cortes(tinta.sum(1), filas, h)
    trozos = []
    for r in range(filas):
        banda = tinta[ys[r]:ys[r + 1]]
        xs = cortes(banda.sum(0), columnas, w)
        for c in range(columnas):
            trozo = np.full((ys[r + 1] - ys[r] + 20, xs[c + 1] - xs[c] + 20, 3), 255.0)
            trozo[10:-10, 10:-10] = im[ys[r]:ys[r + 1], xs[c]:xs[c + 1]]
            trozos.append(trozo)
    return trozos


if __name__ == "__main__":
    if "--hoja" in sys.argv:
        nombres = sys.argv[2].split(",")
        for trozo, nombre in zip(separar_hoja(sys.argv[1]), nombres):
            extraer(trozo, nombre, nativo=True)
    else:
        extraer(sys.argv[1], sys.argv[2])
