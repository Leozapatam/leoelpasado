// Tiempos anclados a palabras: en episodio.json cualquier tiempo puede ser un número (segundos de la voz)
// o un ancla de texto que se resuelve con palabras.json:
//   "@Bloch"        inicio de la primera vez que se dice «Bloch»
//   "@ogro#2"       inicio de la segunda vez
//   "@ogro+0.4"     0,4 s después de que empieza «ogro» (también -0.3)
//   "@ogro:fin"     cuando termina la palabra
// Así, si se regraba un tramo y cambia su duración, todo lo demás se mueve solo.
import type { Palabra } from "./tipos";

const limpia = (w: string) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[¿?¡!.,:;«»"()]/g, "");

const ANCLA = /^@([^#+\-:]+)(?:#(\d+))?(:fin)?([+-]\d+(?:\.\d+)?)?$/;

export const resolverAncla = (texto: string, palabras: Palabra[]): number => {
  const m = texto.match(ANCLA);
  if (!m) throw new Error(`Ancla mal escrita: ${texto}`);
  const [, palabra, n, fin, desfase] = m;
  const objetivo = limpia(palabra);
  const hits = palabras.filter((p) => limpia(p.w) === objetivo);
  const p = hits[(n ? Number(n) : 1) - 1];
  if (!p) throw new Error(`Ancla sin coincidencia en la voz: ${texto}`);
  return Math.round(((fin ? p.e : p.s) + (desfase ? Number(desfase) : 0)) * 100) / 100;
};

/** Recorre todo el episodio y cambia cada "@ancla" por su segundo */
export const resolverAnclas = <X>(dato: X, palabras: Palabra[]): X => {
  if (typeof dato === "string") return (dato.startsWith("@") && ANCLA.test(dato) ? resolverAncla(dato, palabras) : dato) as X;
  if (Array.isArray(dato)) return dato.map((d) => resolverAnclas(d, palabras)) as X;
  if (dato && typeof dato === "object")
    return Object.fromEntries(Object.entries(dato).map(([k, v]) => [k, resolverAnclas(v, palabras)])) as X;
  return dato;
};
