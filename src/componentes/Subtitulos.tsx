import React from "react";
import { interpolate } from "remotion";
import { C, SEGURA, SERIF, clamp } from "../marca";
import type { Palabra } from "../tipos";

const limpia = (w: string) => w.toLowerCase().replace(/[¿?¡!.,:;«»"()]/g, "");

type Grupo = { palabras: Palabra[]; s: number; e: number };

export const agrupar = (palabras: Palabra[], max = 4): Grupo[] => {
  const out: Grupo[] = [];
  let cur: Palabra[] = [];
  palabras.forEach((w, i) => {
    cur.push(w);
    if (/[.,?:;]$/.test(w.w) || cur.length >= max || i === palabras.length - 1) {
      out.push({ palabras: cur, s: cur[0].s - 0.05, e: cur[cur.length - 1].e + 0.3 });
      cur = [];
    }
  });
  out.forEach((g, i) => {
    const sig = out[i + 1];
    if (sig && sig.s - g.e < 0.6) g.e = sig.s;
  });
  return out;
};

/**
 * Subtítulos estilo @leoelpasado:
 * - cada palabra aparece cuando la dices (no antes)
 * - la palabra activa se subraya con el hilo rojo
 * - las palabras clave y las cifras salen como etiqueta de papel de archivo
 */
export const Subtitulos: React.FC<{ grupos: Grupo[]; resaltar: string[]; frame: number; ocultar?: (t: number) => boolean }> = ({
  grupos, resaltar, frame, ocultar,
}) => {
  const t = frame / 30;
  if (ocultar?.(t)) return null;
  const g = grupos.find((x) => t >= x.s && t < x.e);
  if (!g) return null;
  const claves = new Set(resaltar.map(limpia));
  return (
    <div
      style={{
        // dentro de la zona segura (ver SEGURA en marca.ts), como "diálogo" al lado del narrador
        position: "absolute",
        left: 230,
        right: SEGURA.derecha,
        bottom: SEGURA.abajo + 30,
        minHeight: 200,
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-end",
        justifyContent: "flex-start",
        alignItems: "baseline",
        columnGap: 18,
        rowGap: 14,
        fontFamily: SERIF,
        fontWeight: 900,
        fontSize: 60,
        lineHeight: 1.15,
      }}
    >
      {g.palabras.map((w, i) => {
        if (t < w.s - 0.04) return null; // aparece al decirla
        const k = interpolate(t, [w.s - 0.04, w.s + 0.1], [0, 1], clamp);
        const activa = t >= w.s && t < w.e + 0.08;
        const linea = interpolate(t, [w.s, Math.max(w.e, w.s + 0.15)], [0, 1], clamp);
        const clave = claves.has(limpia(w.w)) || /\d/.test(w.w);
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              opacity: k,
              transform: `translateY(${(1 - k) * 22}px) rotate(${clave ? (i % 2 ? 2 : -2) : 0}deg)`,
              color: clave ? (/\d/.test(w.w) ? C.rojo : C.texto) : activa ? "#ffffff" : C.hueso,
              background: clave ? C.papel : "none",
              padding: clave ? "0 14px 4px" : 0,
              boxShadow: clave ? "4px 8px 16px rgba(0,0,0,.6)" : "none",
              textShadow: clave ? "none" : "0 4px 18px rgba(0,0,0,.95), 0 0 4px #000",
            }}
          >
            {w.w}
            {(activa || clave) && (
              <svg style={{ position: "absolute", left: 0, bottom: -10, overflow: "visible" }} width="100%" height="14" viewBox="0 0 100 14" preserveAspectRatio="none">
                <path d="M0 8 Q 25 3 50 8 T 100 6" fill="none" stroke={C.rojo} strokeWidth={6} vectorEffect="non-scaling-stroke"
                  strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - linea} />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
};
