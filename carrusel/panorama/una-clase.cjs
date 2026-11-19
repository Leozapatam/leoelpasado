// Formato «Una clase», escena ACERCADA: el salón, el televisor y Profe Leo se amplían (ZOOM) desde arriba,
// así el tablero gana tamaño y el piso casi desaparece. El contenido del tablero NO se amplía con la escena
// (se saldría por los lados): se reubica dentro del tablero más grande y la letra sube a 37 px.
// El público queda más abajo (se ven menos las cabezas), pero son los mismos tres estudiantes en el mismo puesto.
// Genera dos láminas de prueba:
//   out/una-clase/lamina-tratado.png  → la lámina 2 del carrusel con la escena acercada
//   out/una-clase/lamina-mapas.png    → ejemplos de mapas con indicativos (sombreado, flechas, pines, leyenda, escala, norte)
// Uso: node carrusel/panorama/una-clase.cjs
const fs = require("fs");
const path = require("path");
const topo = require("topojson-client");
const d3 = require("d3-geo");
const { execFileSync } = require("child_process");
const K = require("./carrusel.cjs");
const { W, H, N, PX, C, REG, spr, dibujo, L, leo, CLASE, trazo, trazoAzul, mtx, cinta, resaltado, nota, notaNum, SUBE } = K;

const OUT = path.join(K.RAIZ, "out", "una-clase");
fs.mkdirSync(OUT, { recursive: true });
const Z = 1.15;            // acercamiento de la escena
const DY = 45;             // el contenido del tablero baja para quedar centrado en el tablero ampliado
const LEO_DX = 70;        // Profe Leo se corre a la derecha para que no lo corte el borde al acercar
const zx = (x) => 540 + (x - 540) * Z; // dónde cae una x de la escena después del acercamiento

// ---------- lámina de mapas con indicativos ----------
const wa = require("world-atlas/countries-50m.json");
const paises = topo.feature(wa, wa.objects.countries).features;
const pais = (id) => paises.find((f) => String(f.id).padStart(3, "0") === id);
const col = pais("170"), base = ["170", "604", "218", "076", "862", "591"].map(pais);
const SITIO = { Bogotá: [-74.07, 4.71], Leticia: [-69.94, -4.21], Lima: [-77.04, -12.05] };

const panel = (id, caja, foco, cuerpo) => {
  const pj = d3.geoMercator().fitExtent(caja, { type: "FeatureCollection", features: foco });
  const g = d3.geoPath(pj);
  const [[x0, y0], [x1, y1]] = caja;
  const vecinos = base.map((f) => `<path d="${g(f)}" fill="#fbfaf6" stroke="#9a9a9a" stroke-width="2" stroke-linejoin="round"/>`).join("");
  return `<clipPath id="c-${id}"><rect x="${x0 - 10}" y="${y0 - 10}" width="${x1 - x0 + 20}" height="${y1 - y0 + 20}"/></clipPath>
    <g clip-path="url(#c-${id})">${vecinos}<path d="${g(col)}" fill="#fbfaf6" ${trazo} stroke-width="3.5"/>${cuerpo(pj, g)}</g>`;
};
const punto = ([x, y], t, dx = 10, dy = -10, anchor = "start") => `<circle cx="${x}" cy="${y}" r="6" fill="${C.marcador}"/>${mtx(x + dx, y + dy, t, 22, C.marcador, `text-anchor="${anchor}"`)}`;
const pin = ([x, y], n) => `<path d="M${x},${y} L${x - 11},${y - 22} A15,15 0 1 1 ${x + 11},${y - 22} Z" fill="${C.rojo}" stroke="${C.rojoOsc}" stroke-width="2"/>
  <text x="${x}" y="${y - 26}" text-anchor="middle" font-family="Playfair Display" font-weight="900" font-size="18" fill="#fff">${n}</text>`;

const p1 = panel("p1", [[50, 520], [330, 770]], [col], (pj, g) => {
  const [, yT] = pj([-70, -2.2]);
  return `<clipPath id="t1"><rect x="0" y="${yT}" width="${W}" height="400"/></clipPath><path d="${g(col)}" fill="url(#rayas)" clip-path="url(#t1)"/>
    <path d="${g(col)}" ${trazo} stroke-width="3.5"/>`;
});
const p2 = panel("p2", [[400, 520], [690, 770]], [col], (pj) => {
  const a = pj(SITIO.Bogotá), b = pj(SITIO.Leticia);
  return `<path d="M${a[0]},${a[1]} Q${a[0] + 90},${(a[1] + b[1]) / 2} ${b[0] - 4},${b[1] - 14}" fill="none" stroke="${C.azul}" stroke-width="5" stroke-dasharray="12 9" stroke-linecap="round"/>
    <path d="M${b[0] - 22},${b[1] - 24} L${b[0] - 3},${b[1] - 12} L${b[0] - 6},${b[1] - 36}" ${trazoAzul} stroke-width="5"/>
    ${punto(a, "Bogotá", -10, -12, "end")}${punto(b, "Leticia", -12, 30, "end")}`;
});
// panel 3: escala real (1000 km sobre el ecuador) calculada con la misma proyección
let barra = "";
const p3 = panel("p3", [[750, 520], [1030, 800]], [col, pais("604")], (pj) => {
  const a = pj([-80, 0]), b = pj([-80 + 1000 / 111.32, 0]);
  barra = b[0] - a[0];
  return `${pin(pj(SITIO.Lima), 1)}${pin(pj(SITIO.Leticia), 2)}${pin(pj(SITIO.Bogotá), 3)}`;
});
const norte = (x, y) => `<path d="M${x},${y - 34} L${x + 13},${y + 8} L${x},${y} L${x - 13},${y + 8} Z" fill="${C.marcador}"/>${mtx(x, y - 42, "N", 24, C.marcador, 'text-anchor="middle"')}`;

const mapas = {
  etq: "EJEMPLOS · MAPAS", tit: "Cómo marcar un mapa", leo: "leo-mapa-puntero", egg: "obj-egg-globo", sala: 2,
  svg: `<defs><pattern id="rayas" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="4" height="9" fill="${C.azul}"/></pattern></defs>
    <g transform="translate(0,${DY - SUBE})">${cinta("MAPAS")}</g>
    ${resaltado(52, 498, "SOMBREADO", 32)}${resaltado(404, 498, "FLECHAS", 32)}${resaltado(752, 498, "PINES", 32)}
    ${p1}${p2}${p3}
    ${norte(366, 600)}
    <!-- leyendas: cada indicativo dice qué significa -->
    <rect x="52" y="790" width="34" height="24" fill="url(#rayas)" stroke="${C.marcador}" stroke-width="3"/>${mtx(96, 811, "zona que cambió", 24, C.azul)}
    <path d="M404,812 L470,812" stroke="${C.azul}" stroke-width="5" stroke-dasharray="12 9"/><path d="M462,802 L474,812 L462,822" ${trazoAzul} stroke-width="5"/>${mtx(486, 820, "recorrido", 24, C.azul)}
    <path d="M404,862 L${404 + barra},862 M404,852 L404,872 M${404 + barra},852 L${404 + barra},872" ${trazo}/>${mtx(404 + barra + 12, 870, "1000 km", 22)}
    ${mtx(752, 836, "1 Lima · 2 Leticia", 22, C.azul)}${mtx(752, 866, "3 Bogotá", 22, C.azul)}`,
};

// ---------- página de una lámina ----------
const pagina = ({ etq, tit, leo: pose, egg, sala, svg, frases = "" }) => `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Permanent+Marker&family=Patrick+Hand&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;overflow:hidden;position:relative;background:#000}
#aula{display:none}.capa{position:absolute;inset:0;pointer-events:none}
.frase{font-size:37px!important;line-height:1.1!important}</style></head><body>
<canvas id="aula"></canvas><script>${dibujo}</script>
<div style="position:absolute;inset:0;transform:scale(${Z});transform-origin:540px 0">
  <div id="sala" class="capa" style="background-size:${N * W}px ${Math.ceil(H / PX) * PX}px;background-position:${-sala * W}px 0;image-rendering:pixelated"></div>
  <script>document.getElementById('sala').style.backgroundImage='url('+document.getElementById('aula').toDataURL()+')';</script>
  <div class="capa" style="background:radial-gradient(ellipse 260px 60px at 540px 322px, rgba(150,180,230,.20), transparent 75%)"></div>
  <div style="position:absolute;left:292px;top:36px;width:496px;height:260px;display:flex;flex-direction:column;justify-content:center;padding:0 30px">
    <div style="font:17px 'Special Elite';color:${C.rojoClaro};letter-spacing:3px">${etq}</div>
    <div style="font:900 ${tit.length > 30 ? 40 : 50}px 'Playfair Display';line-height:1.04;color:${C.hueso};margin-top:6px">${tit}</div></div>
  <img src="${spr(egg)}" style="position:absolute;left:880px;top:${K.PISO - 92}px;height:120px;transform:rotate(-8deg);image-rendering:pixelated;filter:drop-shadow(6px 6px 4px rgba(0,0,0,.25))">
  <div class="capa" style="background:radial-gradient(ellipse 80% 55% at 50% 45%, rgba(255,246,225,.16), transparent 70%),
    linear-gradient(to bottom, rgba(20,18,24,.18), transparent 18%, transparent 78%, rgba(20,18,24,.28))"></div>
</div>
<!-- contenido del tablero a escala normal, reubicado en el tablero ampliado -->
<svg class="capa" width="${W}" height="${H}"><defs><filter id="mano"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="9" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="3"/></filter></defs>
  <g filter="url(#mano)">${svg}</g></svg>
<div class="capa" style="transform:translateY(${DY}px)">${frases}</div>
<!-- Profe Leo, acercado con la escena -->
<div style="position:absolute;inset:0;transform:translateX(${LEO_DX}px) scale(${Z});transform-origin:540px 0">${leo(pose, 0)}</div>
<!-- la misma clase: tres estudiantes en el mismo puesto, más abajo porque la cámara se acercó -->
${CLASE.map(([n, cx]) => `<img src="${spr(n)}" style="position:absolute;left:${zx(cx)}px;top:1218px;height:${REG[`v2/${n}`][1] * 1.4 * Z}px;transform:translateX(-50%);image-rendering:pixelated;filter:brightness(.72) saturate(.85) drop-shadow(0 -6px 14px rgba(0,0,0,.25))">`).join("")}
<div style="position:absolute;right:20px;top:8px;font:16px 'Special Elite';color:#8a857a">BOCETO · UNA CLASE</div>
</body></html>`;

// la lámina 2 del carrusel, con su sketchnote y sus frases
const t = L[1];
const tratado = { ...t, sala: 1, svg: `<g transform="translate(0,${DY})"><g transform="translate(0,-${SUBE})">${t.sketch}</g>${nota(t.n)}</g><g transform="translate(0,${DY})">${notaNum(t.n)}</g>`, frases: t.frases };

for (const [nombre, l] of [["lamina-tratado", tratado], ["lamina-mapas", mapas]]) {
  const f = path.join(OUT, `${nombre}.html`);
  fs.writeFileSync(f, pagina(l));
  execFileSync(K.chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--virtual-time-budget=9000",
    `--window-size=${W},${H}`, `--screenshot=${path.join(OUT, `${nombre}.png`)}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
}
console.log("listo:", OUT);
