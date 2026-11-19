// Prototipo del carrusel panorámico: UNA imagen horizontal de N láminas, cortada en piezas de 1080 x 1350.
// Un hilo rojo continuo guía la lectura (de arriba abajo dentro de cada lámina, de izquierda a derecha entre láminas)
// y cruza cada costura a la misma altura. Cada nudo del hilo lleva un número que remite a la fuente (Chicago) del final.
// Uso: node carrusel/panorama/panorama.cjs     (desde la raíz del repositorio)
// Textos y datos de MUESTRA, por verificar. No es guion aprobado.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const topo = require("topojson-client");
const d3 = require("d3-geo");

const DIR = __dirname;
const RAIZ = path.resolve(DIR, "..", "..");
const OUT = path.join(RAIZ, "out", "panorama-leticia");
fs.mkdirSync(OUT, { recursive: true });
const url = (p) => "file:///" + path.join(RAIZ, p).replace(/\\/g, "/");

const N = 6, W = 1080, H = 1350, ANCHO = N * W;
const COSTURA_Y = 760; // el hilo cruza todas las costuras a esta altura
const C = { tinta: "#0d0b09", papel: "#e8dcc2", papelOscuro: "#cdbd9b", hueso: "#f4ead5", rojo: "#c1121f",
  texto: "#1b1612", gris: "#6b5a45", apagado: "#a8977c" };

// ---------- mapa (Natural Earth, bordes actuales: se rotula ESQUEMA) ----------
const w = require("world-atlas/countries-50m.json");
const paises = topo.feature(w, w.objects.countries).features;
const por = (id) => paises.find((f) => String(f.id).padStart(3, "0") === id);
const col = por("170");
const proj = d3.geoMercator().fitExtent([[330, 560], [1250, 1190]], col);
const camino = d3.geoPath(proj);
const vecinos = ["862", "218", "604", "076", "591", "188"].map(por);
const [, yCorte] = proj([-70, -2.2]); // al sur de esta latitud queda el trapecio amazónico (esquema)
const leticia = proj([-69.94, -4.21]);

// ---------- nudos del hilo (coordenadas de la imagen completa) ----------
const P = {
  titulo: [100, 470],
  leticia,
  n1: [W + 150, 300],
  n2: [2 * W + 140, 330],
  barco: [2 * W + 760, 1010],
  n3: [3 * W + 140, 300],
  pregunta: [4 * W + 100, 330],
  fuentes: [5 * W + 60, 205],
};
const costura = (k) => [k * W, COSTURA_Y];
// el hilo baja por el borde izquierdo de cada ficha y pasa por debajo: nunca cruza un texto
const puntos = [P.titulo, [150, 760], P.leticia, costura(1), P.n1, [W + 105, 720], [W + 640, 1150], costura(2),
  P.n2, [2 * W + 100, 760], P.barco, costura(3), P.n3, [3 * W + 100, 720], [3 * W + 600, 1160], costura(4),
  P.pregunta, [4 * W + 75, 780], [4 * W + 520, 1180], costura(5), P.fuentes];
// Catmull-Rom a Bézier: curva suave que pasa por todos los nudos
const curva = (pts) => {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
};
const pin = ([x, y], r = 15) => `<circle cx="${x}" cy="${y + 4}" r="${r}" fill="#000" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="${C.rojo}"/><circle cx="${x - 4}" cy="${y - 5}" r="${r / 3}" fill="#ff8a8f"/>`;
const sup = (n) => `<sup style="font:700 0.55em 'Playfair Display';color:${C.rojo};margin-left:4px">${n}</sup>`;

// ---------- piezas ----------
const ficha = (x, y, w, rot, html) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);
  background:${C.hueso};padding:30px 32px 26px;box-shadow:0 12px 26px rgba(40,25,10,.35);color:${C.texto}">${html}</div>`;
const anio = (t) => `<div style="font:900 96px 'Playfair Display';line-height:.9;color:${C.texto}">${t}</div>`;
const linea = (t) => `<div style="font:30px 'Special Elite';line-height:1.35;margin-top:14px">${t}</div>`;
const sprite = (n, x, y, alto, extra = "") => `<img src="${url(`public/personaje/v2/${n}.png`)}" style="position:absolute;left:${x}px;top:${y}px;height:${alto}px;image-rendering:pixelated;${extra}">`;
const texto = (x, y, w, html, estilo = "") => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;${estilo}">${html}</div>`;

const chicago = [
  `Colombia y Perú. «Tratado de límites y navegación fluvial» [Tratado Salomón-Lozano]. Lima, [fecha por verificar: marzo o julio] de 1922. En [colección o archivo], [volumen y página].`,
  `[Apellido], [Nombre]. <i>[Título del libro sobre la entrega de Leticia]</i>. [Ciudad]: [Editorial], [año].`,
  `[Apellido], [Nombre]. «[Título del artículo sobre el conflicto de 1932 a 1933]». <i>[Revista]</i> [vol.], n.º [número] ([año]): [páginas]. https://doi.org/[…].`,
  `Natural Earth. «Admin 0. Countries», escala 1:50m. Consultado el 19 de noviembre de 2026. https://www.naturalearthdata.com/.`,
];

const capas = `
<svg style="position:absolute;left:0;top:0" width="${ANCHO}" height="${H}">
  <defs><clipPath id="trap"><rect x="0" y="${yCorte}" width="${ANCHO}" height="${H}"/></clipPath></defs>
  ${vecinos.map((f) => `<path d="${camino(f)}" fill="${C.papelOscuro}" opacity=".45" stroke="${C.apagado}" stroke-width="2"/>`).join("")}
  <path d="${camino(col)}" fill="${C.papelOscuro}" stroke="${C.gris}" stroke-width="3"/>
  <path d="${camino(col)}" fill="${C.rojo}" clip-path="url(#trap)"/>
</svg>
${texto(90, 120, 900, `<div style="font:900 96px 'Playfair Display';line-height:.98;color:${C.texto}">¿Por qué Colombia tiene esta punta?</div>`)}
${sprite("leo-mapa-puntero", 70, 960, 280)}
${texto(330, 1230, 700, `ESQUEMA · Bordes actuales, Natural Earth ${sup(4)}`, `font:22px 'Special Elite';color:${C.gris}`)}

${ficha(W + 150, 300, 560, 0, `<div style="font:24px 'Special Elite';color:${C.gris}">LIMA</div>${anio("1922")}${linea(`Colombia y Perú firman un tratado de límites ${sup(1)}`)}`)}
${sprite("leo-lupa", W + 700, 600, 360)}

<img src="${url("public/personaje/v2/obj-pergamino.png")}" style="position:absolute;left:${2 * W - 170}px;top:930px;height:300px;transform:rotate(-4deg);opacity:.95">

${ficha(2 * W + 140, 330, 560, 0, `<div style="font:24px 'Special Elite';color:${C.gris}">LETICIA</div>${anio("1930")}${linea(`Perú entrega Leticia a Colombia ${sup(2)}`)}`)}
<img src="${url("public/personaje/v2/ico-barco.png")}" style="position:absolute;left:${2 * W + 640}px;top:930px;height:190px;image-rendering:pixelated">
${sprite("leo-mapa-pin", 2 * W + 110, 1000, 250)}

${ficha(3 * W + 140, 300, 600, 0, `<div style="font:24px 'Special Elite';color:${C.gris}">AMAZONAS</div>${anio("1932")}${linea(`Empieza una guerra en la selva ${sup(3)}`)}`)}
${sprite("leo-gancho-manos-cabeza", 3 * W + 660, 700, 330)}
<img src="${url("public/personaje/v2/ico-fuerte.png")}" style="position:absolute;left:${3 * W + 150}px;top:960px;height:180px;image-rendering:pixelated">

${texto(4 * W + 150, 380, 840, `<div style="font:24px 'Special Elite';color:${C.gris};letter-spacing:3px">LA PREGUNTA QUE QUEDA</div>
  <div style="font:900 92px 'Playfair Display';line-height:1.02;color:${C.texto};margin-top:18px">¿Quién decide dónde termina un país?</div>`)}
${sprite("leo-piensa", 4 * W + 640, 680, 300)}
<img src="${url("public/personaje/v2/ficha-duda.png")}" style="position:absolute;left:${4 * W + 830}px;top:640px;height:150px">

${texto(5 * W + 130, 150, 880, `<div style="font:900 64px 'Playfair Display';color:${C.texto};margin-left:56px">Fuentes</div>
  <ol style="margin-top:34px;padding-left:44px;font:24px/1.45 'Special Elite';color:${C.texto}">
  ${chicago.map((c) => `<li style="margin-bottom:22px;padding-left:10px">${c}</li>`).join("")}</ol>
  <div style="font:20px 'Special Elite';color:${C.gris};margin-top:6px">Estilo Chicago (notas y bibliografía). Enlaces completos en la descripción.</div>`)}
${sprite("leo-saluda", 5 * W + 730, 950, 260)}
${texto(5 * W + 90, 1150, 600, `<div style="font:900 42px 'Playfair Display';color:${C.texto}">Profe Leo <span style="font:26px 'Special Elite';color:${C.gris}">@leoelpasado</span></div>`)}

<svg style="position:absolute;left:0;top:0;pointer-events:none" width="${ANCHO}" height="${H}">
  <path d="${curva(puntos)}" stroke="#000" stroke-opacity=".25" stroke-width="9" fill="none" transform="translate(0,5)"/>
  <path d="${curva(puntos)}" stroke="${C.rojo}" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${[P.titulo, P.leticia, P.n1, P.n2, P.barco, P.n3, P.pregunta, P.fuentes].map((p) => pin(p)).join("")}
</svg>
${[1, 2, 3, 4, 5].map((k) => `<div class="guia" style="position:absolute;left:${k * W - 1}px;top:0;width:2px;height:${H}px;background:rgba(0,90,200,.55)"></div>`).join("")}
${[...Array(N)].map((_, k) => `<div style="position:absolute;left:${k * W + W - 150}px;top:46px;font:20px 'Special Elite';color:${C.gris}">BOCETO ${k + 1}/${N}</div>`).join("")}
`;

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${ANCHO}px;height:${H}px;overflow:hidden;position:relative;
background:${C.papel} url('${url("public/texturas/papel.jpg")}') 0 0/1080px 1350px repeat}
body.sin-guias .guia{display:none}</style></head><body class="CLASE">${capas}</body></html>`;

const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((p) => fs.existsSync(p));
for (const [clase, archivo] of [["", "panorama-con-guias.png"], ["sin-guias", "panorama.png"]]) {
  const f = path.join(OUT, `${clase || "guias"}.html`);
  fs.writeFileSync(f, html.replace("CLASE", clase));
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
    "--virtual-time-budget=8000", `--window-size=${ANCHO},${H}`, `--screenshot=${path.join(OUT, archivo)}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
}
console.log("listo:", OUT);
