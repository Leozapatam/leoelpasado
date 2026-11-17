"""Tiempos anclados a palabras (misma sintaxis que src/anclas.ts): "@Bloch", "@ogro#2", "@ogro+0.4", "@ogro:fin"."""
import re
import unicodedata

ANCLA = re.compile(r"^@([^#+\-:]+)(?:#(\d+))?(:fin)?([+-]\d+(?:\.\d+)?)?$")


def _limpia(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[¿?¡!.,:;«»\"()]", "", w)


# solo estos campos son tiempos (así un texto como "@leoelpasado" nunca se toma por ancla)
CLAVES = {"t", "desde", "hasta", "entra", "revela", "brillo", "final"}
LISTAS = {"camara", "hilos", "golpes", "sellos", "subidas"}


def _ancla(dato, palabras):
    m = ANCLA.match(dato)
    if not m:
        raise ValueError(f"Ancla mal escrita: {dato}")
    palabra, n, fin, desfase = m.groups()
    hits = [p for p in palabras if _limpia(p["w"]) == _limpia(palabra)]
    if len(hits) < int(n or 1):
        raise ValueError(f"Ancla sin coincidencia en la voz: {dato}")
    p = hits[int(n or 1) - 1]
    return round((p["e"] if fin else p["s"]) + float(desfase or 0), 2)


def resolver(dato, palabras, es_tiempo=False):
    if isinstance(dato, str):
        return _ancla(dato, palabras) if es_tiempo and dato.startswith("@") else dato
    if isinstance(dato, list):
        return [resolver(d, palabras, es_tiempo) for d in dato]
    if isinstance(dato, dict):
        return {k: resolver(v, palabras, k in CLAVES or (k in LISTAS and isinstance(v, list))) for k, v in dato.items()}
    return dato
