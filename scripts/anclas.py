"""Tiempos anclados a palabras (misma sintaxis que src/anclas.ts): "@Bloch", "@ogro#2", "@ogro+0.4", "@ogro:fin"."""
import re
import unicodedata

ANCLA = re.compile(r"^@([^#+\-:]+)(?:#(\d+))?(:fin)?([+-]\d+(?:\.\d+)?)?$")


def _limpia(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[¿?¡!.,:;«»\"()]", "", w)


def resolver(dato, palabras):
    if isinstance(dato, str) and dato.startswith("@"):
        m = ANCLA.match(dato)
        if not m:
            raise ValueError(f"Ancla mal escrita: {dato}")
        palabra, n, fin, desfase = m.groups()
        hits = [p for p in palabras if _limpia(p["w"]) == _limpia(palabra)]
        if len(hits) < int(n or 1):
            raise ValueError(f"Ancla sin coincidencia en la voz: {dato}")
        p = hits[int(n or 1) - 1]
        return round((p["e"] if fin else p["s"]) + float(desfase or 0), 2)
    if isinstance(dato, list):
        return [resolver(d, palabras) for d in dato]
    if isinstance(dato, dict):
        return {k: resolver(v, palabras) for k, v in dato.items()}
    return dato
