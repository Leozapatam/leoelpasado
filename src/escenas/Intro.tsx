import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C, SERIF, TYPE, clamp } from "../marca";
import { Foco, Grano, Textura } from "../componentes/Basicos";
import { CENTRO_LEO, Personaje, puntaEnPantalla, spriteLeo } from "../componentes/Personaje";

// Marco en la pared: misma proporción que el video (9:16), así el zoom termina
// exactamente en la primera escena real.
const MARCO_W = 430, MARCO_H = (430 * 16) / 9;
const MARCO_X = 590, MARCO_Y = 230; // centro horizontal y borde superior

/**
 * Entrada de cada video (~3 s): Profe Leo señala el tablero con el láser
 * y la cámara entra hasta que el marco llena la pantalla.
 * `destino` es la primera escena del episodio, dibujada dentro del marco.
 */
export const Intro: React.FC<{ frame: number; fps: number; duracion: number; destino: React.ReactNode }> = ({
  frame, fps, duracion, destino,
}) => {
  const fin = Math.round(duracion * fps);
  const senala = frame > 18;
  const laser = interpolate(frame, [20, 30], [0, 1], clamp);
  // zoom: del plano general al marco (ease-in fuerte, como un "empujón")
  const z = interpolate(frame, [fin * 0.45, fin], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const escala = 1 + z * (1080 / MARCO_W - 1);
  const cx = MARCO_X, cy = MARCO_Y + MARCO_H / 2;
  const tx = 540 - cx * escala, ty = 960 - cy * escala;
  const tx0 = 0, ty0 = 0;
  const transform = `translate(${tx0 + (tx - tx0) * Math.min(1, z * 1.0)}px, ${ty0 + (ty - ty0) * z}px) scale(${escala})`;

  // punta del láser (mano del personaje) y punto rojo en el tablero
  const ES = 7; // escala del personaje
  const PX = 40, PY = 1440; // pies del personaje
  const ALTO = 63 * ES;
  const pieX = PX + 13.5 * ES; // centro de los pies de Profe Leo
  const sprSenala = spriteLeo("senala");
  const [puntaX, puntaY] = sprSenala.startsWith("cuerpo")
    ? [PX + 38.5 * ES, PY - 63 * ES + 26.5 * ES]
    : puntaEnPantalla(sprSenala, pieX, PY, ALTO);
  const puntoX = MARCO_X + 40, puntoY = MARCO_Y + MARCO_H * 0.42;

  return (
    <AbsoluteFill style={{ background: C.tinta, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform }}>
        {/* pared y zócalo */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #1c1611 0%, #241b14 60%, #17110c 100%)" }} />
        <Textura src="madera.jpg" style={{ left: 0, top: 1300, width: 1080, height: 620, opacity: 0.9 }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, height: 14, background: "#3a2617", boxShadow: "0 6px 14px rgba(0,0,0,.6)" }} />
        {/* luz de lámpara sobre el marco */}
        <div style={{ position: "absolute", left: MARCO_X - 600, top: MARCO_Y - 300, width: 1200, height: 1400,
          background: "radial-gradient(ellipse 45% 40% at 50% 45%, rgba(255,210,150,.16), rgba(0,0,0,0) 70%)" }} />
        {/* marco con la primera escena dentro */}
        <div style={{ position: "absolute", left: MARCO_X - MARCO_W / 2 - 16, top: MARCO_Y - 16, width: MARCO_W + 32, height: MARCO_H + 32,
          background: "linear-gradient(135deg,#4a2f1b,#2a190d)", boxShadow: "0 30px 60px rgba(0,0,0,.7)" }} />
        <div style={{ position: "absolute", left: MARCO_X - MARCO_W / 2, top: MARCO_Y, width: MARCO_W, height: MARCO_H, overflow: "hidden" }}>
          <div style={{ width: 1080, height: 1920, transform: `scale(${MARCO_W / 1080})`, transformOrigin: "0 0" }}>{destino}</div>
        </div>
        {/* láser */}
        {senala && (
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
            <line x1={puntaX} y1={puntaY} x2={puntaX + (puntoX - puntaX) * laser} y2={puntaY + (puntoY - puntaY) * laser}
              stroke={C.rojo} strokeWidth={3} opacity={0.75} />
            {laser >= 1 && (
              <>
                <circle cx={puntoX} cy={puntoY} r={16 + Math.sin(frame / 3) * 3} fill={C.rojo} opacity={0.35} />
                <circle cx={puntoX} cy={puntoY} r={7} fill="#ff5a64" />
              </>
            )}
          </svg>
        )}
        <Personaje sprite={spriteLeo(senala ? "senala" : "normal")} frame={frame} fps={fps} alto={ALTO}
          x={pieX + CENTRO_LEO(spriteLeo(senala ? "senala" : "normal"), ES)} y={PY} />
        {/* placa con el nombre */}
        <div style={{ position: "absolute", left: 50, top: 800, opacity: interpolate(frame, [6, 14], [0, 1], clamp) }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: C.hueso, lineHeight: 1 }}>Profe Leo</div>
          <div style={{ fontFamily: TYPE, fontSize: 30, color: C.rojo, letterSpacing: 4, marginTop: 10 }}>LEO EL PASADO</div>
        </div>
      </div>
      <Foco fuerza={0.75 * (1 - z)} />
      <Grano frame={frame} />
    </AbsoluteFill>
  );
};
