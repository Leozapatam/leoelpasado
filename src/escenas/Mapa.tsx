import React from "react";
import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { geoBounds, geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import mundo from "world-atlas/countries-50m.json";
import mundo10 from "world-atlas/countries-10m.json";
import { C, SERIF, T, TYPE, clamp } from "../marca";
import { Foco, Textura } from "../componentes/Basicos";
import type { MapaDatos } from "../tipos";

// Bordes reales: Natural Earth 1:50m (dominio público) vía world-atlas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PAISES = (feature(mundo as any, (mundo as any).objects.countries) as any).features as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PAISES10 = ((feature(mundo10 as any, (mundo10 as any).objects.countries) as any).features as any[]).map((f) => ({ f, b: geoBounds(f) }));
const RETICULA = geoGraticule10();

/** Con zoom cercano (span < 25°) se usan los bordes 1:10m, solo de los países a la vista */
const paisesVisibles = (lon: number, lat: number, span: number) => {
  if (span >= 25) return PAISES;
  const dx = span * 0.7, dy = span * 1.1;
  return PAISES10.filter(({ b: [[x0, y0], [x1, y1]] }) => x1 > lon - dx && x0 < lon + dx && y1 > lat - dy && y0 < lat + dy).map((p) => p.f);
};

const camara = (keys: MapaDatos["camara"], f: number) => {
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= T(b.t)) {
      const t = interpolate(f, [T(a.t), T(b.t)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
      // el zoom se interpola en escala logarítmica para que se sienta uniforme
      const span = Math.exp(Math.log(a.span) + (Math.log(b.span) - Math.log(a.span)) * t);
      return { lon: a.lon + (b.lon - a.lon) * t, lat: a.lat + (b.lat - a.lat) * t, span };
    }
  }
  return keys[keys.length - 1];
};

const aparece = (frame: number, t: number, dur = 12) => interpolate(frame, [T(t), T(t) + dur], [0, 1], clamp);

export const Mapa: React.FC<{ mapa: MapaDatos; frame: number; fps: number }> = ({ mapa, frame, fps }) => {
  const cam = camara(mapa.camara, frame);
  const proj = geoEquirectangular()
    .scale(((1080 / cam.span) * 180) / Math.PI)
    .center([cam.lon, cam.lat])
    .translate([540, 960]);
  const path = geoPath(proj);
  const px = (lon: number, lat: number) => proj([lon, lat]) as [number, number];

  return (
    <AbsoluteFill style={{ background: "#0a0807", overflow: "hidden" }}>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <path d={path(RETICULA) ?? ""} fill="none" stroke={C.papel} strokeOpacity={0.07} strokeWidth={1} />
        {paisesVisibles(cam.lon, cam.lat, cam.span).map((p, i) => (
          <path key={i} d={path(p) ?? ""} fill="#3a2b1e" stroke={C.papel} strokeOpacity={0.3} strokeWidth={1.1} />
        ))}
        {(mapa.paises ?? []).map((h, i) => {
          const p = paisesVisibles(cam.lon, cam.lat, cam.span).find((x) => x.properties.name === h.nombre);
          const o = aparece(frame, h.t);
          if (!p || o === 0) return null;
          const rojo = h.estilo === "rojo";
          return (
            <path key={i} d={path(p) ?? ""} fill={rojo ? C.rojo : C.papel} fillOpacity={(rojo ? 0.85 : 0.2) * o}
              stroke={C.papel} strokeOpacity={0.9 * o} strokeWidth={2.2} />
          );
        })}
        {(mapa.zonas ?? []).map((z, i) => {
          const o = aparece(frame, z.t, 15);
          if (o === 0) return null;
          const pts = z.puntos.map(([lon, lat]) => px(lon, lat));
          const d = "M" + pts.map((p) => p.join(",")).join("L") + "Z";
          const pulso = 0.75 + 0.25 * Math.sin(frame / 8);
          return (
            <g key={i} opacity={o}>
              <path d={d} fill={C.rojo} opacity={0.7 * pulso} filter="url(#brillo)" strokeLinejoin="round" />
              <path d={d} fill={C.rojo} fillOpacity={0.55} stroke="#ffb0b0" strokeWidth={2.5} strokeLinejoin="round" />
            </g>
          );
        })}
        {(mapa.rutas ?? []).map((r, i) => {
          const p = interpolate(frame, [T(r.t), T(r.t) + T(r.dur ?? 1.4)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          if (p === 0) return null;
          const d = "M" + r.puntos.map(([lon, lat]) => px(lon, lat).join(",")).join("L");
          return <path key={i} d={d} fill="none" stroke={C.rojo} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
        })}
      </svg>
      {/* papel envejecido encima del mapa */}
      <Textura src="papel.jpg" style={{ inset: 0, width: 1080, height: 1920, mixBlendMode: "multiply", opacity: 0.22 }} />

      {(mapa.zonas ?? []).map((z, i) => {
        const [lon, lat] = z.etiquetaEn ?? z.puntos[0];
        const [x, y] = px(lon, lat);
        const o = aparece(frame, z.t + 0.3);
        return o > 0 ? <Etiqueta key={i} x={x} y={y} texto={z.texto} o={o} papel /> : null;
      })}
      {(mapa.etiquetas ?? []).map((e, i) => {
        const o = aparece(frame, e.t) * (e.hasta ? interpolate(frame, [T(e.hasta) - 8, T(e.hasta)], [1, 0], clamp) : 1);
        if (o === 0) return null;
        const [x, y] = px(e.lon, e.lat);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity: o,
            fontFamily: SERIF, fontWeight: 900, fontSize: e.tam ?? 54, letterSpacing: 6, color: C.hueso,
            textShadow: "0 3px 14px rgba(0,0,0,.9)" }}>{e.texto}</div>
        );
      })}
      {(mapa.pines ?? []).map((p, i) => {
        if (frame < T(p.t)) return null;
        const [x, y] = px(p.lon, p.lat);
        const s = spring({ frame: frame - T(p.t), fps, config: { damping: 11, stiffness: 160 } });
        const color = p.color === "papel" ? C.papel : C.rojo;
        const anillo = ((frame - T(p.t)) % 40) / 40;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 30, top: y - 30, width: 60, height: 60, borderRadius: "50%",
              border: `3px solid ${color}`, opacity: (1 - anillo) * 0.8, transform: `scale(${0.3 + anillo * 1.4})` }} />
            <svg width="44" height="62" viewBox="0 0 44 62" style={{ position: "absolute", left: x - 22, top: y - 60,
              transform: `scale(${s})`, transformOrigin: "50% 100%", filter: "drop-shadow(4px 8px 5px rgba(0,0,0,.7))" }}>
              <path d="M22 60 C22 60 4 34 4 22 a18 18 0 0 1 36 0 C40 34 22 60 22 60Z" fill={color} />
              <circle cx="22" cy="22" r="7" fill={C.tinta} />
            </svg>
            <Etiqueta x={x + (p.lado === "izq" ? -40 : 40)} y={y - 34} texto={p.texto} o={Math.min(1, s)} alinear={p.lado === "izq" ? "der" : "izq"} />
          </React.Fragment>
        );
      })}
      <Foco fuerza={0.8} />
    </AbsoluteFill>
  );
};

/** Etiqueta de mapa: tira de papel escrita a máquina */
const Etiqueta: React.FC<{ x: number; y: number; texto: string; o: number; papel?: boolean; alinear?: "izq" | "der" }> = ({
  x, y, texto, o, papel, alinear = "izq",
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(${papel ? "-50%" : alinear === "der" ? "-100%" : "0"},-50%) rotate(-1.5deg)`,
      opacity: o,
      fontFamily: TYPE,
      fontSize: 34,
      letterSpacing: 1,
      color: C.texto,
      background: C.papel,
      padding: "6px 14px",
      boxShadow: "4px 6px 12px rgba(0,0,0,.6)",
      whiteSpace: "nowrap",
    }}
  >
    {texto}
  </div>
);
