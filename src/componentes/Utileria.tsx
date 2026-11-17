import React from "react";
import { staticFile } from "remotion";
import { C, SERIF, TYPE } from "../marca";

/**
 * Objetos de utilería para el tablero (siempre ilustraciones, nunca documentos reales).
 * Cada uno ocupa 320 x 240 y se dibuja con CSS/SVG en la paleta de archivo.
 */
const papel = { backgroundImage: `url(${staticFile("texturas/papel.jpg")})`, backgroundSize: "cover" } as const;

// "Escritura" ilegible: trazos ondulados que se leen como manuscrito sin decir nada
const Manuscrito: React.FC<{ lineas: number; ancho: number; alto: number; color?: string }> = ({ lineas, ancho, alto, color = "#2b2018" }) => (
  <svg width={ancho} height={alto}>
    {Array.from({ length: lineas }).map((_, i) => {
      const y = 12 + i * (alto - 16) / lineas;
      const fin = ancho * (i === lineas - 1 ? 0.55 : 0.9 + ((i * 37) % 10) / 100);
      let d = `M 4 ${y}`;
      for (let x = 4; x < fin; x += 14) d += ` q 4 ${-6 - ((x + i * 13) % 5)} 7 0 t 7 ${((x * 3 + i) % 4) - 2}`;
      return <path key={i} d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" opacity={0.75} />;
    })}
  </svg>
);

const Mecanografiado: React.FC<{ lineas: number; ancho: number }> = ({ lineas, ancho }) => (
  <div>
    {Array.from({ length: lineas }).map((_, i) => (
      <div key={i} style={{ height: 7, width: ancho * (i % 4 === 3 ? 0.5 : 0.92 - (i % 3) * 0.05), background: "rgba(30,24,20,.55)", margin: "7px 0", borderRadius: 1 }} />
    ))}
  </div>
);

export const Objeto: React.FC<{ tipo: "carta" | "foto" | "expediente" | "papel" }> = ({ tipo }) => {
  if (tipo === "carta")
    return (
      <div style={{ width: 320, height: 240, ...papel, filter: "sepia(.5) contrast(1.05)", padding: "22px 22px", boxSizing: "border-box", position: "relative" }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20, color: "#3a2a1c", marginBottom: 6 }}>Querida…</div>
        <Manuscrito lineas={6} ancho={276} alto={150} />
        <div style={{ position: "absolute", right: 22, bottom: 18, width: 44, height: 44, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #d33, ${C.rojo} 55%, #5c0710)`, boxShadow: "2px 3px 4px rgba(0,0,0,.4)" }} />
      </div>
    );
  if (tipo === "foto")
    return (
      <div style={{ width: 320, height: 240, background: "#efe9dc", padding: 14, boxSizing: "border-box", transform: "rotate(-2deg)" }}>
        <svg width="292" height="212" viewBox="0 0 292 212">
          <defs>
            <radialGradient id="vin" cx="50%" cy="45%" r="70%">
              <stop offset="0%" stopColor="#b59a74" />
              <stop offset="100%" stopColor="#4a3a28" />
            </radialGradient>
          </defs>
          <rect width="292" height="212" fill="url(#vin)" />
          {/* dos figuras genéricas, sin rostro: una foto cualquiera de cajón */}
          <g fill="#3a2c1e" opacity={0.85}>
            <circle cx="112" cy="78" r="22" /><path d="M76 212 Q80 118 112 108 Q144 118 148 212Z" />
            <circle cx="182" cy="86" r="19" /><path d="M152 212 Q156 128 182 118 Q208 128 212 212Z" />
          </g>
          <rect width="292" height="212" fill="none" stroke="#2a1f14" strokeWidth={3} />
        </svg>
      </div>
    );
  if (tipo === "expediente")
    return (
      <div style={{ width: 320, height: 240, position: "relative" }}>
        <div style={{ position: "absolute", left: 18, top: 0, width: 110, height: 30, background: "#b8935a", borderRadius: "6px 6px 0 0" }} />
        <div style={{ position: "absolute", left: 0, top: 22, width: 320, height: 218, background: "linear-gradient(160deg,#c9a467,#a8844a)", boxShadow: "inset 0 0 30px rgba(0,0,0,.25)", padding: "26px 24px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: TYPE, fontSize: 26, color: "#2a1d10", letterSpacing: 3 }}>EXPEDIENTE</div>
          <div style={{ fontFamily: TYPE, fontSize: 16, color: "#3d2b17", marginTop: 6 }}>CAUSA CRIMINAL N.º ____</div>
          <div style={{ marginTop: 36, display: "inline-block", border: `4px solid ${C.rojo}`, color: C.rojo, fontFamily: TYPE, fontSize: 22, padding: "2px 12px", transform: "rotate(-7deg)", opacity: 0.85 }}>JUZGADO</div>
        </div>
      </div>
    );
  return (
    <div style={{ width: 320, height: 240, ...papel, padding: "20px 24px", boxSizing: "border-box", position: "relative", filter: "sepia(.35)" }}>
      <div style={{ fontFamily: TYPE, fontSize: 14, color: "#4a3a2a", letterSpacing: 2 }}>ARCHIVO · FONDO · LEGAJO</div>
      <Mecanografiado lineas={9} ancho={272} />
      <div style={{ position: "absolute", right: 18, bottom: 16, width: 58, height: 58, borderRadius: "50%", border: "3px solid rgba(40,60,110,.6)", color: "rgba(40,60,110,.7)", fontFamily: TYPE, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-12deg)" }}>ARCHIVO</div>
    </div>
  );
};

/** Silueta de persona (cuando no hay una foto de dominio público segura) */
export const Silueta: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
    <rect width="100" height="100" fill="#8a7458" />
    <g fill="#3a2c1e">
      <circle cx="50" cy="38" r="17" />
      <path d="M18 100 Q20 62 50 58 Q80 62 82 100Z" />
    </g>
  </svg>
);
