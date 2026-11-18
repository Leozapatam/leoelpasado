import React from "react";
import { Img, interpolate, spring, staticFile } from "remotion";
import SPRITES from "../../public/personaje/sprites.json";
import { C, SERIF, TYPE, clamp } from "../marca";

const REG = SPRITES as Record<string, [number, number]>;
export const existeSprite = (n: string) => n in REG;

/**
 * Un personaje en pixel art (Profe Leo o una figura histórica).
 * - No mueve la boca: cambia de pose (otro sprite) cuando el episodio lo pide.
 * - Respira: cada ~2,4 s la parte de arriba del cuerpo sube UN píxel del dibujo y vuelve (como los sprites de juegos).
 * - Se escala para medir `alto` px en pantalla, sin suavizar.
 */
export const Personaje: React.FC<{
  sprite: string;
  frame: number;
  fps: number;
  x: number; // centro horizontal (pantalla)
  y: number; // pies (pantalla)
  alto: number; // altura en pantalla
  entra?: number; // fotograma
  sale?: number;
  nombre?: string; // placa con el nombre debajo
  fase?: number; // desfase de la respiración (para que no respiren todos a la vez)
  sombra?: boolean;
}> = ({ sprite, frame, fps, x, y, alto, entra = 0, sale, nombre, fase = 0, sombra = true }) => {
  if (frame < entra || (sale !== undefined && frame > sale)) return null;
  const [sw, sh] = REG[sprite] ?? [40, 63];
  const px = alto / sh; // tamaño de un píxel del dibujo en pantalla
  const w = sw * px;
  const e = spring({ frame: frame - entra, fps, config: { damping: 14, stiffness: 150 } });
  const fuera = sale !== undefined ? interpolate(frame, [sale - 8, sale], [1, 0], clamp) : 1;
  const inhala = Math.floor((frame + fase) / 36) % 2 === 1; // 1,2 s arriba, 1,2 s abajo
  const cintura = Math.round(sh * 0.6); // de aquí para arriba "respira"
  const img = (
    <Img src={staticFile(`personaje/${sprite}.png`)} style={{ position: "absolute", left: 0, top: 0, width: w, height: alto, imageRendering: "pixelated" }} />
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - alto + interpolate(e, [0, 1], [alto * 0.25, 0]),
        width: w,
        height: alto,
        opacity: Math.min(1, e * 2) * fuera,
        filter: sombra ? `drop-shadow(${px * 1.5}px ${px * 1.5}px 0 rgba(0,0,0,.45))` : undefined,
      }}
    >
      {/* piernas: quietas */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${(cintura - 1) * px}px 0 0 0)` }}>{img}</div>
      {/* torso y cabeza: suben un píxel al inhalar */}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(sh - cintura) * px}px 0)`, transform: `translateY(${inhala ? -px : 0}px)` }}>{img}</div>
      {nombre && (
        <div style={{ position: "absolute", left: "50%", top: alto + 10, transform: "translateX(-50%) rotate(-1.5deg)", whiteSpace: "nowrap",
          background: C.papel, padding: "4px 12px 6px", boxShadow: "3px 5px 10px rgba(0,0,0,.55)", textAlign: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 30, color: C.texto }}>{nombre}</div>
          <div style={{ fontFamily: TYPE, fontSize: 12, color: C.gris, letterSpacing: 1 }}>ILUSTRACIÓN</div>
        </div>
      )}
    </div>
  );
};

/** Pose vigente según la lista de cambios [{t, pose}] (t en fotogramas) */
export const poseEn = (poses: { f: number; pose: string }[], frame: number, porDefecto = "normal") => {
  let p = porDefecto;
  for (const c of poses) if (frame >= c.f) p = c.pose;
  return p;
};

/** Sprite de Profe Leo para una pose: usa leo-<pose>.png si existe; si no, los sprites actuales */
export const spriteLeo = (pose: string) =>
  existeSprite(`leo-${pose}`) ? `leo-${pose}` : pose === "senala" ? "cuerpo_senala" : "cuerpo";
// los sprites actuales tienen el lienzo más ancho que el cuerpo (espacio para el brazo): corrección del centro
export const CENTRO_LEO = (sprite: string, px: number) => (sprite.startsWith("cuerpo") ? (20 - 13.5) * px : 0);
