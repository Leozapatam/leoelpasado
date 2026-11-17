import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile } from "remotion";
import { C, SERIF, T, TYPE, clamp } from "../marca";
import { Chincheta, Foco, Textura } from "../componentes/Basicos";
import type { Episodio, Ficha } from "../tipos";

const ALTO = 330;
const ancho = (f: Ficha) => f.ancho ?? 420;

// ---------- Ficha de archivo ----------
const Cuerpo: React.FC<{ f: Ficha; hub: boolean }> = ({ f, hub }) => (
  <div
    style={{
      width: ancho(f),
      height: ALTO,
      backgroundImage: `url(${staticFile("texturas/papel.jpg")})`,
      backgroundSize: "cover",
      padding: "36px 26px 20px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      color: C.texto,
    }}
  >
    <div style={{ fontFamily: TYPE, fontSize: 19, letterSpacing: 1.5, color: C.rojo }}>{f.encabezado}</div>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: hub ? 70 : f.cifra.length > 9 ? 50 : 92, lineHeight: 1.05, marginTop: 10 }}>{f.cifra}</div>
    <div style={{ fontFamily: TYPE, fontSize: 21, lineHeight: 1.3, marginTop: 8 }}>{f.texto}</div>
    <div style={{ flex: 1 }} />
    <div style={{ fontFamily: TYPE, fontSize: 15, color: C.gris, borderTop: `1px dashed ${C.gris}`, paddingTop: 8 }}>{f.fuente}</div>
  </div>
);

const R = 80;
const ZOOM = 1.9;
const Lupa: React.FC<{ f: Ficha; frame: number; hub: boolean }> = ({ f, frame, hub }) => {
  if (!f.lupa) return null;
  const a = T(f.lupa.desde), b = T(f.lupa.hasta);
  const op = interpolate(frame, [a, a + 8, b - 8, b], [0, 1, 1, 0], clamp);
  if (op === 0) return null;
  const lx = interpolate(frame, [a, b], [80, ancho(f) - 120], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const ly = 112 + Math.sin(frame / 6) * 4;
  return (
    <div style={{ position: "absolute", left: lx - R, top: ly - R, opacity: op }}>
      <div style={{ position: "absolute", left: R * 2 - 18, top: R * 2 - 18, width: 26, height: 115, borderRadius: 8,
        background: "linear-gradient(90deg,#2a1d12,#6a4a2c,#2a1d12)", transform: "rotate(-45deg)", transformOrigin: "top center",
        boxShadow: "8px 14px 18px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden",
        border: "9px solid #9a7840", boxSizing: "border-box",
        boxShadow: "0 14px 30px rgba(0,0,0,.65), inset 0 0 22px rgba(0,0,0,.35)" }}>
        <div style={{ position: "absolute", left: R - 9 - lx * ZOOM, top: R - 9 - ly * ZOOM, transform: `scale(${ZOOM})`, transformOrigin: "0 0" }}>
          <Cuerpo f={f} hub={hub} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.35), rgba(255,255,255,0) 45%)" }} />
      </div>
    </div>
  );
};

const FichaTablero: React.FC<{ f: Ficha; frame: number; fps: number; hub: boolean }> = ({ f, frame, fps, hub }) => {
  const e = T(f.entra);
  if (frame < e) return null;
  const s = spring({ frame: frame - e, fps, config: { damping: 13, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        left: f.x - ancho(f) / 2,
        top: f.y - ALTO / 2 + interpolate(s, [0, 1], [-60, 0]),
        transform: `rotate(${f.giro ?? 0}deg) scale(${interpolate(s, [0, 1], [1.12, 1])})`,
        opacity: Math.min(1, s * 1.5),
        boxShadow: `0 ${20 * s}px ${44 * s}px rgba(0,0,0,.7), 0 2px 3px rgba(0,0,0,.4)`,
      }}
    >
      <Cuerpo f={f} hub={hub} />
      <Lupa f={f} frame={frame} hub={hub} />
      <Chincheta x={ancho(f) / 2} y={16} />
    </div>
  );
};

// ---------- Hilo rojo (con fibras) ----------
const Hilo: React.FC<{ a: Ficha; b: Ficha; frame: number }> = ({ a, b, frame }) => {
  const p = interpolate(frame, [T(b.entra) - 25, T(b.entra) + 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (p === 0) return null;
  const x0 = a.x, y0 = a.y - ALTO / 2 + 16, x1 = b.x, y1 = b.y - ALTO / 2 + 16;
  const d = `M ${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.max(y0, y1) + 70} ${x1} ${y1}`;
  const comun = { d, fill: "none", pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, strokeLinecap: "round" as const };
  return (
    <g>
      <path {...comun} stroke="rgba(0,0,0,.45)" strokeWidth={7} transform="translate(6,10)" style={{ filter: "blur(3px)" }} />
      <path {...comun} stroke={C.rojo} strokeWidth={6} />
      <path {...comun} stroke="#7d0a14" strokeWidth={6} strokeDasharray="0.004 0.006" strokeDashoffset={0} opacity={p > 0.99 ? 0.6 : 0} />
      <path {...comun} stroke="rgba(255,150,150,.35)" strokeWidth={1.5} />
    </g>
  );
};

// ---------- Cámara ----------
const camara = (keys: Episodio["tablero"]["camara"], f: number) => {
  const k = keys.map(([t, x, y, z]) => [T(t), x, y, z]);
  for (let i = 0; i < k.length - 1; i++) {
    const [f0, x0, y0, z0] = k[i], [f1, x1, y1, z1] = k[i + 1];
    if (f <= f1) {
      const t = interpolate(f, [f0, f1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
      return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, z: z0 + (z1 - z0) * t };
    }
  }
  const [, x, y, z] = k[k.length - 1];
  return { x, y, z };
};

export const Tablero: React.FC<{ ep: Episodio; frame: number; fps: number }> = ({ ep, frame, fps }) => {
  const cam = camara(ep.tablero.camara, frame);
  const porId = Object.fromEntries(ep.tablero.fichas.map((f) => [f.id, f]));
  const hubId = ep.tablero.fichas[0]?.id;
  return (
    <AbsoluteFill style={{ background: C.tinta, overflow: "hidden" }}>
      <div style={{ position: "absolute", transformOrigin: "0 0", transform: `translate(${540 - cam.x * cam.z}px, ${960 - cam.y * cam.z}px) scale(${cam.z})` }}>
        <div style={{ position: "absolute", width: 1080, height: 1920 }}>
          <Textura src="corcho.jpg" style={{ left: -660, top: -740, width: 2400, height: 3400 }} />
          {/* marco de madera del tablero */}
          <div style={{ position: "absolute", left: -660, top: -740, width: 2400, height: 3400, boxShadow: "inset 0 0 0 60px #2b1a0e, inset 0 0 0 66px #1a0f07, inset 0 0 80px 70px rgba(0,0,0,.55)" }} />
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {ep.tablero.hilos.map(([a, b]) => (porId[a] && porId[b] ? <Hilo key={a + b} a={porId[a]} b={porId[b]} frame={frame} /> : null))}
          </svg>
          {ep.tablero.fichas.map((f) => (
            <FichaTablero key={f.id} f={f} frame={frame} fps={fps} hub={f.id === hubId} />
          ))}
        </div>
      </div>
      <Foco />
    </AbsoluteFill>
  );
};
