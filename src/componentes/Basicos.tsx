import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile } from "remotion";
import { C, TYPE, clamp } from "../marca";

/** Textura fotográfica a pantalla completa (corcho, madera…) */
export const Textura: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(`texturas/${src}`)} style={{ position: "absolute", objectFit: "cover", ...style }} />
);

/** Grano de película: siempre encima de todo */
export const Grano: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: 0.14, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <filter id="grano">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 6} />
    </filter>
    <rect width="100%" height="100%" filter="url(#grano)" />
  </svg>
);

/** Foco de luz noir + viñeta */
export const Foco: React.FC<{ x?: string; y?: string; fuerza?: number }> = ({ x = "50%", y = "46%", fuerza = 0.85 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 62% 46% at ${x} ${y}, rgba(0,0,0,0) 0%, rgba(0,0,0,${fuerza * 0.4}) 60%, rgba(0,0,0,${fuerza}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Chincheta roja */
export const Chincheta: React.FC<{ x: number; y: number; tam?: number }> = ({ x, y, tam = 30 }) => (
  <div
    style={{
      position: "absolute",
      left: x - tam / 2,
      top: y - tam / 2,
      width: tam,
      height: tam,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, #ff8a8a, ${C.rojo} 50%, #4a050c)`,
      boxShadow: "5px 8px 6px rgba(0,0,0,.55), inset -2px -3px 4px rgba(0,0,0,.35)",
    }}
  />
);

/** Sello de tinta que cae con golpe */
export const Sello: React.FC<{ texto: string; frame: number; fps: number; entra: number; sale: number; x: number; y: number; giro?: number }> = ({
  texto, frame, fps, entra, sale, x, y, giro = -12,
}) => {
  if (frame < entra || frame > sale) return null;
  const s = spring({ frame: frame - entra, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${giro}deg) scale(${interpolate(s, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, s) * 0.88,
        border: `6px double ${C.rojo}`,
        color: C.rojo,
        fontFamily: TYPE,
        fontSize: 40,
        padding: "8px 22px",
        letterSpacing: 4,
        whiteSpace: "nowrap",
        mixBlendMode: "screen",
        textShadow: "0 0 1px rgba(193,18,31,.6)",
      }}
    >
      {texto}
    </div>
  );
};

/** Lupa (ícono de marca) */
export const LupaIcono: React.FC<{ tam: number }> = ({ tam }) => (
  <svg width={tam} height={tam} viewBox="0 0 100 100">
    <circle cx="42" cy="42" r="28" fill="none" stroke={C.hueso} strokeWidth="7" />
    <line x1="62" y1="62" x2="88" y2="88" stroke={C.hueso} strokeWidth="10" strokeLinecap="round" />
    <circle cx="42" cy="42" r="7" fill={C.rojo} />
  </svg>
);

/** Aparición suave de una escena (corte con fundido corto) */
export const entrada = (frame: number, desde: number, hasta: number, dur = 6) =>
  interpolate(frame, [desde, desde + dur, hasta - 2, hasta], [0, 1, 1, 0], clamp);
