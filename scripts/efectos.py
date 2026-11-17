"""Paso 4b: efectos de sonido y ambientes, automáticos a partir de episodio.json.

Uso: python scripts/efectos.py <slug>   ->  public/episodios/<slug>/efectos.wav

El método es fijo: cada tipo de evento del video tiene SIEMPRE su sonido (tabla REGLAS).
Lo que cambia entre episodios son los eventos (fichas, hilos, mapas), no las reglas.
Efectos extra a mano en episodio.json:  "efectos": [{"t": "@aplaudan", "sonido": "aplausos", "vol": 0.4}]
"""
import json, os, sys, wave
import numpy as np
from scipy.signal import fftconvolve

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sonidos as S  # noqa: E402
from anclas import resolver  # noqa: E402

SR = S.SR
FPS = 30

# ---- REGLAS: evento -> (sonido, volumen en dB). Esto es el método; no cambiar por episodio. ----
REGLAS = {
    "ficha": ("ficha", -16), "objeto": ("ficha", -15), "mini": ("papel", -24), "etiqueta": ("papel", -20),
    "polaroid": ("obturador", -18), "chincheta_mini": ("chincheta", -24),
    "hilo": ("hilo", -22), "lupa": ("lupa", -24), "sello": ("sello", -12), "brillo": ("tinta", -22),
    "tecla": ("tecla", -27), "campanita": ("campanita", -30), "doc_entra": ("papel", -16),
    "escena": ("whoosh", -20), "zoom_mapa": ("whoosh_grave", -22),
    "pais": ("tinta", -20), "pin": ("pop", -18), "zona": ("tinta", -18), "etiqueta_mapa": ("papel", -26),
    "laser": ("laser", -26), "intro_zoom": ("whoosh_grave", -16), "cierre": ("whoosh", -18),
}
AMBIENTES = {"tablero": ("archivo", -38), "documento": ("escritorio", -36), "mapa": ("mapa", -38),
             "intro": ("neutro", -40), "cierre": ("neutro", -42)}


def db(x):
    return 10 ** (x / 20)


def main():
    slug = sys.argv[1]
    car = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "episodios", slug)
    palabras = json.load(open(os.path.join(car, "palabras.json"), encoding="utf-8"))
    ep = resolver(json.load(open(os.path.join(car, "episodio.json"), encoding="utf-8")), palabras)
    I = ep.get("intro", {}).get("duracion", 0)
    total = ep["duracion"] + I
    n = int(total * SR)
    L, R = np.zeros(n), np.zeros(n)
    rng = np.random.default_rng(7)
    cache = {}

    def sonido(nombre, **kw):
        k = (nombre, tuple(sorted(kw.items())))
        if k not in cache:
            if nombre == "whoosh_grave":
                cache[k] = S.whoosh(grave=True, **kw)
            else:
                cache[k] = S.CATALOGO[nombre](**kw)
        return cache[k]

    def poner(t, regla=None, nombre=None, vol=None, pan=None, **kw):
        if regla:
            nombre, vol = REGLAS[regla]
        x = sonido(nombre, **kw) * db(vol)
        i = int((t + I) * SR) if t is not None else 0
        if i < 0 or i >= n:
            return
        x = x[: n - i]
        p = rng.uniform(-0.35, 0.35) if pan is None else pan
        L[i:i + len(x)] += x * np.sqrt((1 - p) / 2)
        R[i:i + len(x)] += x * np.sqrt((1 + p) / 2)

    escenas = ep["escenas"]

    def escena_en(t):
        for e in escenas:
            if e["desde"] <= t < e["hasta"]:
                return e
        return None

    # ---- entrada ----
    if I:
        poner(0.67 - I, "laser", pan=-0.3)
        poner(I * 0.45 - I, nombre="whoosh_grave", vol=REGLAS["intro_zoom"][1], dur=round(I * 0.55, 2), pan=0)

    # ---- gancho tecleado ----
    g = ep["gancho"]
    for k, ch in enumerate(g["texto"]):
        if ch != " ":
            poner(g["desde"] + k * 1.3 / FPS, nombre="tecla", vol=REGLAS["tecla"][1], variante=k % 12)

    # ---- cambios de escena ----
    for e in escenas[1:]:
        poner(e["desde"] - 0.15, "cierre" if e["tipo"] == "cierre" else "escena", pan=0)

    # ---- tablero ----
    tab = ep["tablero"]
    visible = lambda t: (escena_en(t) or {}).get("tipo") == "tablero"
    por_id = {f["id"]: f for f in tab["fichas"]}
    for f in tab["fichas"]:
        if not visible(f["entra"]):
            continue
        tipo = f.get("tipo", "ficha")
        poner(f["entra"], tipo)
        if tipo in ("mini", "polaroid"):
            poner(f["entra"] + 0.08, "chincheta_mini")
        if "lupa" in f and visible(f["lupa"]["desde"]):
            poner(f["lupa"]["desde"], "lupa")
    for h in tab["hilos"]:
        b = por_id.get(h[1])
        if not b:
            continue
        t = h[2] if len(h) > 2 else b["entra"] - 25 / FPS
        if visible(t):
            poner(t, "hilo", dur=0.9)
    if "brillo" in tab:
        poner(tab["brillo"], "brillo")

    # ---- sellos ----
    for s in ep.get("sellos", []):
        poner(s["t"], "sello", pan=0)

    # ---- documento: teclas, campanita al final de cada línea ----
    for e in escenas:
        if e["tipo"] != "documento":
            continue
        poner(e["desde"], "doc_entra")
        lineas = e["documento"]["lineas"]
        for j, l in enumerate(lineas):
            a = round(l["t"] * FPS)
            sig = round(lineas[j + 1]["t"] * FPS) if j + 1 < len(lineas) else a + 40
            dur_f = min(sig - a, len(l["texto"]) * 1.6)
            for k, ch in enumerate(l["texto"]):
                if ch != " ":
                    poner((a + k * dur_f / len(l["texto"])) / FPS, nombre="tecla", vol=REGLAS["tecla"][1], variante=(k + j) % 12)
            poner((a + dur_f) / FPS + 0.05, "campanita", pan=0.4)

    # ---- mapa ----
    for e in escenas:
        if e["tipo"] != "mapa":
            continue
        m = e["mapa"]
        vistos = set()
        for p in m.get("paises", []):
            if p["t"] not in vistos:  # un solo sonido por grupo de países que se tiñen juntos
                vistos.add(p["t"]); poner(p["t"], "pais")
        for p in m.get("pines", []):
            poner(p["t"], "pin")
        for z in m.get("zonas", []):
            poner(z["t"], "zona")
        for et in m.get("etiquetas", []):
            poner(et["t"], "etiqueta_mapa")
        cam = m["camara"]
        for a, b in zip(cam, cam[1:]):
            if max(a["span"], b["span"]) / min(a["span"], b["span"]) > 1.5 and b["t"] - a["t"] < 4:
                poner(a["t"], nombre="whoosh_grave", vol=REGLAS["zoom_mapa"][1], dur=round(min(1.4, b["t"] - a["t"]), 2))

    # ---- efectos a mano ----
    for x in ep.get("efectos", []):
        kw = {"dur": x["dur"]} if "dur" in x else {}
        poner(x["t"], nombre=x["sonido"], vol=20 * np.log10(x.get("vol", 0.5)) - 6, **kw)

    # ---- ambientes por escena (camas largas, fundidos de 0,6 s) ----
    tramos = [("intro", -I, 0)] if I else []
    tramos += [(e["tipo"], e["desde"], e["hasta"]) for e in escenas]
    for tipo, a, b in tramos:
        nombre, vol = AMBIENTES.get(tipo, ("neutro", -42))
        dur = b - a + 0.6
        x = S.ambiente(nombre, dur) * db(vol)
        f = int(0.6 * SR)
        x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
        i = int((a + I) * SR)
        x = x[: n - i]
        L[i:i + len(x)] += x; R[i:i + len(x)] += x[::-1] if False else x

    # ---- todo en la misma sala que la voz ----
    ir = S.reverb_ir()
    L = L + fftconvolve(L, ir[0])[:n] * 0.18
    R = R + fftconvolve(R, ir[1])[:n] * 0.18
    st = np.stack([L, R], 1)
    pico = np.abs(st).max()
    if pico > 0.95:
        st *= 0.95 / pico
    dest = os.path.join(car, "efectos.wav")
    with wave.open(dest, "w") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    print(f"efectos.wav -> {total:.1f} s")


if __name__ == "__main__":
    main()
