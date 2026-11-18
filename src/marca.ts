// Identidad visual de @leoelpasado: un solo lugar para colores, fuentes y tiempos.
import { loadFont as loadTypewriter } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";

export const TYPE = loadTypewriter().fontFamily; // máquina de escribir: fichas, fuentes, sellos
export const SERIF = loadSerif("normal", { weights: ["700", "900"] }).fontFamily; // títulos, cifras, subtítulos

export const C = {
  tinta: "#0d0b09", // fondo
  papel: "#e8dcc2",
  papelOscuro: "#cdbd9b",
  hueso: "#f4ead5", // texto claro
  rojo: "#c1121f", // hilo, énfasis: el único acento
  rojoClaro: "#ff4d57", // cifras en subtítulos
  texto: "#1b1612",
  gris: "#6b5a45",
  apagado: "#a8977c",
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;

/** segundos -> fotogramas */
export const T = (s: number) => Math.round(s * FPS);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Zona segura común a TikTok, Instagram Reels y Facebook Reels (1080x1920, contenido orgánico).
 * Se toma la más estricta de cada borde: arriba 250 (FB/IG), abajo 480 (TikTok), derecha 160 (FB), izquierda 60.
 * Todo lo importante (narrador, subtítulos, cifras) vive dentro de este rectángulo.
 */
export const SEGURA = { arriba: 250, abajo: 480, derecha: 160, izquierda: 60, botonesDesde: 700 };

/** Profe Leo narrador: lejos del borde izquierdo y por encima de la franja de abajo de Instagram/TikTok */
export const NARRADOR = { x: SEGURA.izquierda + 160, pies: 1920 - SEGURA.abajo - 40, alto: 350 };
/** Los subtítulos empiezan a la derecha del narrador */
export const SUBTITULOS_IZQ = SEGURA.izquierda + 300;
