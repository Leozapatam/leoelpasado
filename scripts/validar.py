"""Revisa un episodio antes de renderizar (sin gastar 10 minutos de render).

Uso: python scripts/validar.py <slug>
Comprueba: anclas que existen, escenas/personajes/sellos con desde < hasta, escenas en orden y sin huecos,
fichas citadas por los hilos, imágenes y sprites que existen, y lista dónde cae cada ancla repetida
(una palabra que se dice varias veces: hay que usar @palabra#2, #3…).
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from anclas import resolver, _limpia  # noqa: E402

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
slug = sys.argv[1]
car = os.path.join(RAIZ, "public", "episodios", slug)
palabras = json.load(open(os.path.join(car, "palabras.json"), encoding="utf-8"))
crudo = json.load(open(os.path.join(car, "episodio.json"), encoding="utf-8"))
problemas, avisos = [], []
try:
    ep = resolver(crudo, palabras)
except ValueError as e:
    print("ERROR:", e); sys.exit(1)

def rango(nombre, a, b):
    if not (isinstance(a, (int, float)) and isinstance(b, (int, float)) and a < b):
        problemas.append(f"{nombre}: desde {a} no es menor que hasta {b}")

prev = 0
for i, e in enumerate(ep["escenas"]):
    rango(f"escena {i} ({e['tipo']})", e["desde"], e["hasta"])
    if abs(e["desde"] - prev) > 0.6:
        avisos.append(f"escena {i} ({e['tipo']}) empieza en {e['desde']} pero la anterior termina en {prev}")
    prev = e["hasta"]
for p in ep.get("personajes", []):
    rango(f"personaje {p['sprite']}", p["desde"], p["hasta"])
    if not os.path.exists(os.path.join(RAIZ, "public", "personaje", p["sprite"] + ".png")):
        problemas.append(f"falta el sprite public/personaje/{p['sprite']}.png")
for s in ep.get("sellos", []):
    rango(f"sello «{s['texto']}»", s["t"], s["hasta"])
ids = {f["id"] for f in ep["tablero"]["fichas"]}
for h in ep["tablero"]["hilos"]:
    for x in h[:2]:
        if x not in ids:
            problemas.append(f"hilo {h[:2]}: no existe la ficha «{x}»")
for f in ep["tablero"]["fichas"]:
    if f.get("imagen") and not os.path.exists(os.path.join(RAIZ, "public", f["imagen"])):
        problemas.append(f"ficha {f['id']}: falta la imagen {f['imagen']}")

# anclas sin número (#n) sobre palabras que se repiten
conteo = {}
for p in palabras:
    conteo[_limpia(p["w"])] = conteo.get(_limpia(p["w"]), 0) + 1
texto = json.dumps(crudo, ensure_ascii=False)
import re
for m in set(re.findall(r'"@([^"#+\-:]+)[+\-:"]', texto)):
    n = conteo.get(_limpia(m), 0)
    if n > 1:
        avisos.append(f"«@{m}» se dice {n} veces: se usa la primera (¿querías @{m}#2…?)")

for a in avisos:
    print("aviso:", a)
for p in problemas:
    print("ERROR:", p)
print("OK" if not problemas else f"{len(problemas)} error(es)")
sys.exit(1 if problemas else 0)
