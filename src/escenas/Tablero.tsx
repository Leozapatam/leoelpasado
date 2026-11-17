import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile } from "remotion";
import { C, SERIF, T, TYPE, clamp } from "../marca";
import { Chincheta, Foco, Textura } from "../componentes/Basicos";
import { Objeto, Silueta } from "../componentes/Utileria";
import type { Episodio, Ficha } from "../tipos";

// Tamaño de cada tipo de pieza del tablero
const tam = (f: Ficha): [number, number] => {
  switch (f.tipo) {
    case "mini": return [150, 110];
    case "polaroid": return [300, 370];
    case "objeto": return [340, 330];
    case "etiqueta": return [f.ancho ?? 300, 76];
    default: return [f.ancho ?? 420, 330];
  }
};

const papel = { backgroundImage: `url(${staticFile("texturas/papel.jpg")})`, backgroundSize: "cover" } as const;
const marcaIlustracion = (
  <div style={{ position: "absolute", right: 8, top: 8, fontFamily: TYPE, fontSize: 11, letterSpacing: 1, color: "#fff", background: "rgba(20,14,10,.7)", padding: "2px 6px" }}>ILUSTRACIÓN</div>
);

/** Pie de fuente: se ilumina en rojo cuando el tablero "brilla" */
const Fuente: React.FC<{ texto?: string; brilla: number; tamano?: number }> = ({ texto, brilla, tamano = 15 }) =>
  texto ? (
    <div style={{ fontFamily: TYPE, fontSize: tamano, color: brilla > 0 ? C.rojo : C.gris, borderTop: `1px dashed ${C.gris}`, paddingTop: 7,
      textShadow: brilla > 0 ? `0 0 ${10 * brilla}px rgba(255,60,70,${0.8 * brilla})` : "none" }}>{texto}</div>
  ) : null;

// ---------- Contenido de cada tipo ----------
const Cuerpo: React.FC<{ f: Ficha; hub: boolean; frame: number; brilla: number }> = ({ f, hub, frame, brilla }) => {
  const [w, h] = tam(f);
  if (f.tipo === "mini") {
    const ve = f.revela !== undefined && frame >= T(f.revela);
    const k = ve ? interpolate(frame, [T(f.revela!), T(f.revela!) + 6], [0, 1], clamp) : 0;
    return (
      <div style={{ width: w, height: h, ...papel, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 72, color: C.rojo, opacity: k, transform: `scale(${0.6 + 0.4 * k})` }}>?</span>
      </div>
    );
  }
  if (f.tipo === "polaroid") {
    return (
      <div style={{ width: w, height: h, background: "#f1ece0", padding: "18px 18px 0", boxSizing: "border-box", position: "relative" }}>
        <div style={{ width: w - 36, height: w - 36, overflow: "hidden", background: "#3a2c1e" }}>
          {f.imagen ? (
            <Img src={staticFile(f.imagen)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", filter: "grayscale(1) sepia(.35) contrast(1.05)" }} />
          ) : (
            <Silueta w={w - 36} h={w - 36} />
          )}
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontStyle: "italic", fontSize: 24, color: C.texto, textAlign: "center", marginTop: 10 }}>{f.texto}</div>
        <div style={{ fontFamily: TYPE, fontSize: 12, color: brilla > 0 ? C.rojo : C.gris, textAlign: "center", marginTop: 2 }}>{f.fuente}</div>
        {f.ilustracion && marcaIlustracion}
      </div>
    );
  }
  if (f.tipo === "objeto") {
    return (
      <div style={{ width: w, height: h, position: "relative" }}>
        <div style={{ position: "absolute", left: 10, top: 0 }}><Objeto tipo={f.objeto ?? "papel"} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 246, ...papel, padding: "8px 12px", boxShadow: "3px 5px 10px rgba(0,0,0,.5)", transform: "rotate(-1.5deg)" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 24, color: C.texto }}>{f.texto}</div>
          <Fuente texto={f.fuente} brilla={brilla} tamano={13} />
        </div>
        {f.ilustracion && marcaIlustracion}
      </div>
    );
  }
  if (f.tipo === "etiqueta") {
    return (
      <div style={{ width: w, height: h, ...papel, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 14px", boxSizing: "border-box" }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 34, letterSpacing: 2, color: C.texto }}>{f.texto}</span>
      </div>
    );
  }
  const cifra = f.cifra ?? "";
  return (
    <div style={{ width: w, height: h, ...papel, padding: "36px 26px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column", color: C.texto }}>
      <div style={{ fontFamily: TYPE, fontSize: 19, letterSpacing: 1.5, color: C.rojo }}>{f.encabezado}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: hub ? 70 : cifra.length > 9 ? 50 : 92, lineHeight: 1.05, marginTop: 10 }}>{cifra}</div>
      <div style={{ fontFamily: TYPE, fontSize: 21, lineHeight: 1.3, marginTop: 8 }}>{f.texto}</div>
      <div style={{ flex: 1 }} />
      <Fuente texto={f.fuente} brilla={brilla} />
    </div>
  );
};

// ---------- Lupa ----------
const R = 80;
const ZOOM = 1.9;
const Lupa: React.FC<{ f: Ficha; frame: number; hub: boolean; brilla: number }> = ({ f, frame, hub, brilla }) => {
  if (!f.lupa) return null;
  const [w] = tam(f);
  const a = T(f.lupa.desde), b = T(f.lupa.hasta);
  const op = interpolate(frame, [a, a + 8, b - 8, b], [0, 1, 1, 0], clamp);
  if (op === 0) return null;
  const lx = interpolate(frame, [a, b], [80, w - 100], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const ly = (f.lupa.y ?? 112) + Math.sin(frame / 6) * 4;
  return (
    <div style={{ position: "absolute", left: lx - R, top: ly - R, opacity: op }}>
      <div style={{ position: "absolute", left: R * 2 - 18, top: R * 2 - 18, width: 26, height: 115, borderRadius: 8,
        background: "linear-gradient(90deg,#2a1d12,#6a4a2c,#2a1d12)", transform: "rotate(-45deg)", transformOrigin: "top center",
        boxShadow: "8px 14px 18px rgba(0,0,0,.6)" }} />
      <div style={{ position: "absolute", width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden",
        border: "9px solid #9a7840", boxSizing: "border-box", boxShadow: "0 14px 30px rgba(0,0,0,.65), inset 0 0 22px rgba(0,0,0,.35)" }}>
        <div style={{ position: "absolute", left: R - 9 - lx * ZOOM, top: R - 9 - ly * ZOOM, transform: `scale(${ZOOM})`, transformOrigin: "0 0" }}>
          <Cuerpo f={f} hub={hub} frame={frame} brilla={brilla} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.35), rgba(255,255,255,0) 45%)" }} />
      </div>
    </div>
  );
};

const Pieza: React.FC<{ f: Ficha; frame: number; fps: number; hub: boolean; brilla: number }> = ({ f, frame, fps, hub, brilla }) => {
  const e = T(f.entra);
  if (frame < e) return null;
  const [w, h] = tam(f);
  const s = spring({ frame: frame - e, fps, config: { damping: 13, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        left: f.x - w / 2,
        top: f.y - h / 2 + interpolate(s, [0, 1], [-60, 0]),
        transform: `rotate(${f.giro ?? 0}deg) scale(${interpolate(s, [0, 1], [1.12, 1])})`,
        opacity: Math.min(1, s * 1.5),
        boxShadow: f.tipo === "objeto" ? "none" : `0 ${20 * s}px ${44 * s}px rgba(0,0,0,.7), 0 2px 3px rgba(0,0,0,.4)`,
        filter: f.tipo === "objeto" ? `drop-shadow(0 ${16 * s}px ${18 * s}px rgba(0,0,0,.7))` : "none",
      }}
    >
      <Cuerpo f={f} hub={hub} frame={frame} brilla={brilla} />
      <Lupa f={f} frame={frame} hub={hub} brilla={brilla} />
      <Chincheta x={w / 2} y={16} tam={f.tipo === "mini" ? 22 : 30} />
    </div>
  );
};

// ---------- Hilo rojo ----------
const ancla = (f: Ficha): [number, number] => [f.x, f.y - tam(f)[1] / 2 + 16];

const Hilo: React.FC<{ a: Ficha; b: Ficha; t?: number; frame: number }> = ({ a, b, t, frame }) => {
  const fin = t !== undefined ? T(t) + 30 : T(b.entra) + 5;
  const p = interpolate(frame, [fin - 30, fin], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (p === 0) return null;
  const [x0, y0] = ancla(a), [x1, y1] = ancla(b);
  const d = `M ${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.max(y0, y1) + 70} ${x1} ${y1}`;
  const comun = { d, fill: "none", pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, strokeLinecap: "round" as const };
  return (
    <g>
      <path {...comun} stroke="rgba(0,0,0,.45)" strokeWidth={7} transform="translate(6,10)" style={{ filter: "blur(3px)" }} />
      <path {...comun} stroke={C.rojo} strokeWidth={6} />
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
      // zoom en escala logarítmica: se siente uniforme aunque vaya de 1.3 a 0.35
      const z = Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * t);
      return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, z };
    }
  }
  const [, x, y, z] = k[k.length - 1];
  return { x, y, z };
};

export const Tablero: React.FC<{ ep: Episodio; frame: number; fps: number }> = ({ ep, frame, fps }) => {
  const cam = camara(ep.tablero.camara, frame);
  const porId = Object.fromEntries(ep.tablero.fichas.map((f) => [f.id, f]));
  const hubId = ep.tablero.fichas[0]?.id;
  const brilla = ep.tablero.brillo !== undefined ? interpolate(frame, [T(ep.tablero.brillo), T(ep.tablero.brillo) + 15], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{ background: C.tinta, overflow: "hidden" }}>
      <div style={{ position: "absolute", transformOrigin: "0 0", transform: `translate(${540 - cam.x * cam.z}px, ${960 - cam.y * cam.z}px) scale(${cam.z})` }}>
        <div style={{ position: "absolute", width: 1080, height: 1920 }}>
          <Textura src="corcho.jpg" style={{ left: -660, top: -740, width: 2400, height: 3400 }} />
          <div style={{ position: "absolute", left: -660, top: -740, width: 2400, height: 3400, boxShadow: "inset 0 0 0 60px #2b1a0e, inset 0 0 0 66px #1a0f07, inset 0 0 80px 70px rgba(0,0,0,.55)" }} />
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {ep.tablero.hilos.map(([a, b, t]) => (porId[a] && porId[b] ? <Hilo key={a + b} a={porId[a]} b={porId[b]} t={t} frame={frame} /> : null))}
          </svg>
          {ep.tablero.fichas.map((f) => (
            <Pieza key={f.id} f={f} frame={frame} fps={fps} hub={f.id === hubId} brilla={brilla} />
          ))}
        </div>
      </div>
      <Foco />
    </AbsoluteFill>
  );
};
