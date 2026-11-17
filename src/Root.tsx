import { Composition, staticFile } from "remotion";
import { Episodio, type EpisodioProps } from "./Episodio";
import { FPS, H, W } from "./marca";
import type { Episodio as Ep, Palabra } from "./tipos";
import { resolverAnclas } from "./anclas";

// Para un episodio nuevo: crea public/episodios/<slug>/ y renderiza con --props='{"slug":"<slug>"}'
export const RemotionRoot = () => (
  <Composition
    id="Episodio"
    component={Episodio}
    fps={FPS}
    width={W}
    height={H}
    durationInFrames={FPS * 10}
    defaultProps={{ slug: "bananeras" } as EpisodioProps}
    calculateMetadata={async ({ props }) => {
      const base = `episodios/${props.slug}`;
      const palabras: Palabra[] = await fetch(staticFile(`${base}/palabras.json`)).then((r) => r.json());
      // los tiempos pueden ser segundos o anclas a palabras ("@Bloch", "@ogro+0.4"): ver src/anclas.ts
      const ep: Ep = resolverAnclas(await fetch(staticFile(`${base}/episodio.json`)).then((r) => r.json()), palabras);
      const boca: number[] = await fetch(staticFile(`${base}/boca.json`)).then((r) => (r.ok ? r.json() : [])).catch(() => []);
      return { durationInFrames: Math.ceil((ep.duracion + (ep.intro?.duracion ?? 0)) * FPS), props: { ...props, ep, palabras, boca } };
    }}
  />
);
