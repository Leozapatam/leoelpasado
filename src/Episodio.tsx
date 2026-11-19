import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, NARRADOR, SEGURA, SERIF, T, TYPE, clamp } from "./marca";
import { Grano, Sello, entrada } from "./componentes/Basicos";
import { Subtitulos, agrupar } from "./componentes/Subtitulos";
import { CENTRO_LEO, Personaje, poseEn, spriteLeo, usarModelo } from "./componentes/Personaje";
import { Tablero } from "./escenas/Tablero";
import { Mapa } from "./escenas/Mapa";
import { Documento } from "./escenas/Documento";
import { Intro } from "./escenas/Intro";
import type { Episodio as Ep, Palabra } from "./tipos";

export type EpisodioProps = { slug: string; ep?: Ep; palabras?: Palabra[]; boca?: number[]; guias?: boolean };

/** Zonas que tapa la interfaz de Reels/TikTok (solo para revisar: --props con "guias": true) */
const Guias = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: SEGURA.arriba, background: "rgba(0,160,255,.25)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: SEGURA.abajo, background: "rgba(0,160,255,.25)" }} />
    <div style={{ position: "absolute", right: 0, width: SEGURA.derecha, top: SEGURA.botonesDesde, bottom: SEGURA.abajo, background: "rgba(0,160,255,.25)" }} />
    <div style={{ position: "absolute", left: 0, width: SEGURA.izquierda, top: SEGURA.arriba, bottom: SEGURA.abajo, background: "rgba(0,160,255,.18)" }} />
  </AbsoluteFill>
);

const Gancho: React.FC<{ g: Ep["gancho"]; frame: number }> = ({ g, frame }) => {
  const o = interpolate(frame, [0, 6, T(g.hasta) - 8, T(g.hasta)], [0, 1, 1, 0], clamp);
  if (o === 0) return null;
  const n = Math.floor(interpolate(frame, [T(g.desde), T(g.desde) + g.texto.length * 1.3], [0, g.texto.length], clamp));
  return (
    <AbsoluteFill style={{ opacity: o, justifyContent: "center", alignItems: "center", padding: 90, background: "rgba(8,6,5,.72)" }}>
      <div style={{ fontFamily: TYPE, color: C.rojo, fontSize: 30, letterSpacing: 5, marginBottom: 30 }}>{g.antetitulo}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, lineHeight: 1.1, color: C.hueso, textAlign: "center", textShadow: "0 6px 30px rgba(0,0,0,.9)" }}>
        {g.texto.slice(0, n)}
        <span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: C.rojo }}>|</span>
      </div>
    </AbsoluteFill>
  );
};

const Cierre: React.FC<{ c: Ep["cierre"]; desde: number; frame: number; fps: number; boca: number[] }> = ({ c, desde, frame, fps, boca }) => {
  const o = interpolate(frame, [T(desde) + 8, T(desde) + 20], [0, 1], clamp);
  const ES = 9;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1d1610, #070605 75%)" }}>
      {/* el cuerpo ocupa las columnas 3-24 del lienzo: se centra esa parte */}
      <Personaje sprite={spriteLeo("saluda")} frame={frame} fps={fps} alto={63 * ES} x={540 + CENTRO_LEO(spriteLeo("saluda"), ES)} y={1060} entra={T(desde)} sombra />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", opacity: o }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 104, color: C.hueso, lineHeight: 1 }}>{c.titulo}</div>
        <div style={{ fontFamily: TYPE, fontSize: 40, color: C.rojo, letterSpacing: 6, marginTop: 18 }}>{c.subtitulo}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Composición principal: entrada + episodio (episodio.json + palabras.json + boca.json) */
export const Episodio: React.FC<EpisodioProps> = ({ slug, ep, palabras, boca, guias }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grupos = useMemo(() => agrupar(palabras ?? []), [palabras]);
  if (!ep) return null;

  // la entrada va antes de la voz: todos los tiempos de episodio.json son relativos a la voz
  usarModelo(ep.narrador?.modelo);
  const off = T(ep.intro?.duracion ?? 0);
  const frame = f - off;
  const cierre = ep.escenas.find((e) => e.tipo === "cierre");
  const pose = poseEn((ep.narrador?.poses ?? []).map((p) => ({ f: T(p.t), pose: p.pose })), frame);

  const escenas = (fr: number) =>
    ep.escenas.map((e, i) => {
      const a = T(e.desde) - (i === 0 ? 0 : 4), b = T(e.hasta);
      if (fr < a || fr > b) return null;
      const o = i === 0 ? 1 : entrada(fr, a, b + 2, 6);
      return (
        <AbsoluteFill key={i} style={{ opacity: o }}>
          {e.tipo === "tablero" && <Tablero ep={ep} frame={fr} fps={fps} />}
          {e.tipo === "mapa" && <Mapa mapa={e.mapa} frame={fr} fps={fps} />}
          {e.tipo === "documento" && <Documento doc={e.documento} desde={e.desde} hasta={e.hasta} frame={fr} fps={fps} />}
          {e.tipo === "cierre" && <Cierre c={ep.cierre} desde={e.desde} frame={fr} fps={fps} boca={boca ?? []} />}
        </AbsoluteFill>
      );
    });

  return (
    <AbsoluteFill style={{ background: C.tinta }}>
      {frame < 0 ? (
        <Intro frame={f} fps={fps} duracion={ep.intro!.duracion} destino={escenas(0)} />
      ) : (
        <>
          {escenas(frame)}
          {ep.sellos.map((s, i) => (
            <Sello key={i} texto={s.texto} frame={frame} fps={fps} entra={T(s.t)} sale={T(s.hasta)} x={s.x} y={s.y} giro={s.giro} />
          ))}
          {(ep.personajes ?? []).map((p, i) => (
            <Personaje key={i} sprite={p.sprite} nombre={p.nombre} frame={frame} fps={fps} alto={p.alto ?? 430} x={p.x ?? 770} y={p.y ?? 1000}
              entra={T(p.desde)} sale={T(p.hasta)} fase={i * 17} />
          ))}
          <Gancho g={ep.gancho} frame={frame} />
          {(!cierre || frame < T(cierre.desde)) && (
            <Personaje sprite={spriteLeo(pose)} frame={frame} fps={fps} alto={NARRADOR.alto}
              x={spriteLeo(pose).startsWith("cuerpo") ? NARRADOR.x + CENTRO_LEO(spriteLeo(pose), 6) : NARRADOR.x} y={NARRADOR.pies} entra={4} />
          )}
          <Subtitulos grupos={grupos} resaltar={ep.subtitulos.resaltar} frame={frame}
            ocultar={(t) => t < ep.gancho.hasta || (cierre ? t >= cierre.desde : false)} />
          <Grano frame={frame} />
        </>
      )}
      {guias && <Guias />}
      <Audio src={staticFile(`episodios/${slug}/${ep.audio}`)} />
    </AbsoluteFill>
  );
};
