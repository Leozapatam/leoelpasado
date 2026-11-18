import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile } from "remotion";
import { C, SERIF, T, TYPE, clamp } from "../marca";
import { Foco, Textura } from "../componentes/Basicos";
import { existeSprite } from "../componentes/Personaje";
import { Img } from "remotion";
import type { DocumentoDatos } from "../tipos";

const PAPEL_X = 110, PAPEL_Y = 380, PAPEL_W = 860, PAPEL_H = 1120;
const LINEA = 62; // interlineado del texto tecleado
const TOP_TEXTO = 230;

/** Escenario 3: un documento sobre el escritorio, bajo la lámpara. Se teclea línea a línea y se subraya con el hilo rojo. */
export const Documento: React.FC<{ doc: DocumentoDatos; desde: number; hasta: number; frame: number; fps: number }> = ({
  doc, desde, hasta, frame, fps,
}) => {
  // la cámara empuja despacio y sigue la línea que se está escribiendo
  const activa = Math.max(0, doc.lineas.filter((l) => frame >= T(l.t)).length - 1);
  const objetivoY = PAPEL_Y + TOP_TEXTO + activa * LINEA;
  const push = interpolate(frame, [T(desde), T(hasta)], [1.05, 1.32], clamp);
  const sigue = spring({ frame: frame - T(doc.lineas[activa]?.t ?? desde), fps, config: { damping: 30 } });
  const prevY = PAPEL_Y + TOP_TEXTO + Math.max(0, activa - 1) * LINEA;
  // se sigue la línea a medias, para que el documento no "salte"
  const camY = 960 + (interpolate(sigue, [0, 1], [prevY, objetivoY]) - 960) * 0.6;
  const entra = spring({ frame: frame - T(desde), fps, config: { damping: 16 } });

  const res = doc.resaltar;
  const subrayado = interpolate(frame, [T(res.t), T(res.t) + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ background: C.tinta, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0",
        transform: `translate(${540 - 540 * push}px, ${960 - camY * push}px) scale(${push})` }}>
        <Textura src="madera.jpg" style={{ left: -660, top: -740, width: 2400, height: 3400 }} />
        {existeSprite("obj-lampara") && (
          <Img src={staticFile("personaje/obj-lampara.png")} style={{ position: "absolute", left: 700, top: 120, width: 330, imageRendering: "pixelated",
            filter: "drop-shadow(12px 18px 10px rgba(0,0,0,.6))" }} />
        )}
        {existeSprite("obj-lupa") && (
          <Img src={staticFile("personaje/obj-lupa.png")} style={{ position: "absolute", left: 40, top: 1560, width: 240, transform: "rotate(-18deg)", imageRendering: "pixelated",
            filter: "drop-shadow(10px 14px 8px rgba(0,0,0,.6))" }} />
        )}
        {/* luz de lámpara */}
        <div style={{ position: "absolute", left: -400, top: -300, width: 1900, height: 2500,
          background: "radial-gradient(ellipse 38% 32% at 50% 44%, rgba(255,214,150,.28), rgba(0,0,0,0) 70%)" }} />
        <div
          style={{
            position: "absolute",
            left: PAPEL_X,
            top: PAPEL_Y + interpolate(entra, [0, 1], [120, 0]),
            width: PAPEL_W,
            height: PAPEL_H,
            transform: `rotate(${interpolate(entra, [0, 1], [-6, -1.2])}deg)`,
            backgroundImage: `url(${staticFile("texturas/papel.jpg")})`,
            backgroundSize: "cover",
            boxShadow: "0 30px 60px rgba(0,0,0,.75), 0 2px 4px rgba(0,0,0,.5)",
            padding: "70px 70px",
            boxSizing: "border-box",
            color: C.texto,
          }}
        >
          <div style={{ fontFamily: TYPE, fontSize: 24, letterSpacing: 3, borderBottom: `2px solid ${C.texto}`, paddingBottom: 14 }}>
            {doc.membrete}
          </div>
          <div style={{ position: "absolute", left: 70, right: 70, top: TOP_TEXTO - 40 }}>
            {doc.lineas.map((l, i) => {
              const a = T(l.t);
              const sig = doc.lineas[i + 1] ? T(doc.lineas[i + 1].t) : a + 40;
              const n = Math.floor(interpolate(frame, [a, a + Math.min(sig - a, l.texto.length * 1.6)], [0, l.texto.length], clamp));
              if (frame < a) return null;
              const visible = l.texto.slice(0, n);
              const k = i === res.linea ? l.texto.indexOf(res.desde) : -1;
              return (
                <div key={i} style={{ position: "absolute", top: i * LINEA, fontFamily: TYPE, fontSize: 34, whiteSpace: "pre" }}>
                  {k >= 0 ? (
                    <>
                      {visible.slice(0, k)}
                      <span style={{ position: "relative" }}>
                        {visible.slice(k)}
                        <svg style={{ position: "absolute", left: -4, bottom: -12, overflow: "visible" }} width="100%" height="16" viewBox="0 0 100 16" preserveAspectRatio="none">
                          <path d="M0 9 Q 30 4 55 9 T 100 7" fill="none" stroke={C.rojo} strokeWidth={5} vectorEffect="non-scaling-stroke"
                            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - subrayado} strokeLinecap="round" />
                        </svg>
                      </span>
                    </>
                  ) : (
                    visible
                  )}
                  {n < l.texto.length && <span style={{ color: C.rojo }}>▌</span>}
                </div>
              );
            })}
          </div>
          {doc.firma && frame >= T(doc.lineas[doc.lineas.length - 1].t) + 30 && (
            <div style={{ position: "absolute", left: 70, top: TOP_TEXTO - 40 + (doc.lineas.length + 0.6) * LINEA, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 36 }}>
              {doc.firma}
            </div>
          )}
          <div style={{ position: "absolute", left: 70, right: 70, bottom: 60, fontFamily: TYPE, fontSize: 20, color: C.gris, borderTop: `1px dashed ${C.gris}`, paddingTop: 10 }}>
            {doc.fuente}
          </div>
          <div style={{ position: "absolute", right: 46, top: 150, transform: "rotate(5deg)", border: `4px solid ${C.rojo}`, color: C.rojo,
            fontFamily: TYPE, fontSize: 19, padding: "4px 10px", letterSpacing: 2, opacity: 0.85 }}>
            {doc.aviso}
          </div>
        </div>
      </div>
      <Foco y="44%" fuerza={0.9} />
    </AbsoluteFill>
  );
};
