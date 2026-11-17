import React from "react";
import { Img, interpolate, spring, staticFile } from "remotion";
import { clamp } from "../marca";

// Lienzo del cuerpo entero (public/personaje/cuerpo*.png). El cuerpo ocupa las columnas 3-24;
// el resto del ancho es para el brazo que señala.
export const SPRITE_W = 40, SPRITE_H = 63;
export const ANCHO_CUERPO = 25; // columnas útiles (para colocar subtítulos al lado)

/** Parpadeo determinista: cada ~3,7 s (con algo de irregularidad), 4 fotogramas */
const parpadea = (frame: number) => {
  const ciclo = 111 + ((Math.floor(frame / 111) * 37) % 23);
  return frame % ciclo < 4;
};

/** Promedio de la boca en una ventana corta: suaviza el movimiento */
const energia = (boca: number[], frame: number, ventana = 4) => {
  let s = 0;
  for (let i = 0; i < ventana; i++) s += boca[frame - i] ?? 0;
  return s / (ventana * 2);
};

/**
 * Profe Leo en pixel art, de cuerpo entero, hablando con tu voz.
 * boca[frame]: 0 cerrada · 1 media · 2 abierta (scripts/preparar_voz.py)
 * Se mueve como una sola pieza (sin separar el cuello): respira, se balancea apenas
 * y da un pequeño impulso en las sílabas fuertes.
 */
export const Narrador: React.FC<{
  boca: number[];
  frame: number;
  fps: number;
  escala?: number; // tamaño de cada píxel en pantalla
  x: number; // esquina inferior izquierda del lienzo
  y: number;
  entra?: number;
  pose?: "normal" | "senala";
  habla?: boolean; // false = boca cerrada (p. ej. en la entrada, antes de la voz)
}> = ({ boca, frame, fps, escala = 6, x, y, entra = 0, pose = "normal", habla = true }) => {
  if (frame < entra) return null;
  const e = spring({ frame: frame - entra, fps, config: { damping: 12, stiffness: 140 } });
  const estado = habla ? boca[frame] ?? 0 : 0;
  const w = SPRITE_W * escala, h = SPRITE_H * escala;

  const en = habla ? energia(boca, frame) : 0;
  const respira = 1 + Math.sin(frame / 24) * 0.01;
  const balanceo = Math.sin(frame / 45) * 0.7; // grados, pivote en los pies
  const impulso = -en * escala * 0.8;

  const capa = (src: string) => (
    <Img src={staticFile(`personaje/${src}.png`)} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, imageRendering: "pixelated" }} />
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - h + interpolate(e, [0, 1], [h * 0.4, 0]) + impulso,
        width: w,
        height: h,
        opacity: interpolate(e, [0, 0.3], [0, 1], clamp),
        transform: `rotate(${balanceo}deg) scaleY(${respira})`,
        transformOrigin: `${(ANCHO_CUERPO / 2 / SPRITE_W) * 100}% 100%`,
        filter: `drop-shadow(${escala}px ${escala}px 0 rgba(0,0,0,.45))`,
      }}
    >
      {capa(pose === "senala" ? "cuerpo_senala" : "cuerpo")}
      {estado === 1 && capa("cuerpo_boca1")}
      {estado === 2 && capa("cuerpo_boca2")}
      {parpadea(frame) && capa("cuerpo_ojos")}
    </div>
  );
};
