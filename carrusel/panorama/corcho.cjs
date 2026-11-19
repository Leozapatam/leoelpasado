// Carrusel panorámico sobre TABLERO DE CORCHO: una imagen de 6 láminas (6480 x 1350) cortada en piezas de 1080 x 1350.
// El hilo rojo va de pin en pin, con su caída natural, y cruza cada costura a la misma altura.
// Cada lámina: tarjeta de título + párrafo en lenguaje sencillo + Profe Leo v2 + decoraciones (cinta, parches, stickers, chapas).
// Uso: node carrusel/panorama/corcho.cjs   (desde la raíz). Textos y datos de MUESTRA, por verificar.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const topo = require("topojson-client");
const d3 = require("d3-geo");

const RAIZ = path.resolve(__dirname, "..", "..");
const OUT = path.join(RAIZ, "out", "corcho-leticia");
fs.mkdirSync(OUT, { recursive: true });
const url = (p) => "file:///" + path.join(RAIZ, p).replace(/\\/g, "/");
const N = 6, W = 1080, H = 1350, ANCHO = N * W;
const COSTURA_Y = 1080; // altura a la que el hilo cruza todas las costuras (por debajo de los textos)
const C = { tinta: "#0d0b09", papel: "#e8dcc2", hueso: "#f6eedd", rojo: "#c1121f", rojoOsc: "#7d0a13",
  texto: "#1b1612", gris: "#6b5a45", apagado: "#a8977c" };

// ---------- fondo de corcho (baldosas espejadas, sin corte entre láminas) ----------
const fondo = path.join(OUT, "fondo.jpg");
if (!fs.existsSync(fondo)) {
  execFileSync("python", ["-c", `
from PIL import Image, ImageOps, ImageEnhance
t=Image.open(r'${path.join(RAIZ, "public/texturas/corcho.jpg")}').convert('RGB').resize((${W},${H}))
S=Image.new('RGB',(${ANCHO},${H}))
for k in range(${N}): S.paste(t if k%2==0 else ImageOps.mirror(t),(k*${W},0))
ImageEnhance.Brightness(S).enhance(0.92).save(r'${fondo}',quality=92)`]);
}

// ---------- piezas ----------
const tarjeta = (x, y, w, rot, html, extra = "") => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);
  background:${C.hueso};padding:34px 40px 36px;box-shadow:0 14px 22px rgba(30,15,5,.45), 0 2px 3px rgba(0,0,0,.3);color:${C.texto};${extra}">${html}</div>`;
// columna de tarjetas en flujo: el párrafo siempre queda debajo del título, sin importar cuántas líneas tenga
const columna = (html, top = 150) => `<div style="position:absolute;left:170px;top:${top}px;width:730px;display:flex;flex-direction:column;gap:30px">${html}</div>`;
const tarjetaF = (rot, html, conCinta = false) => `<div style="position:relative;transform:rotate(${rot}deg);background:${C.hueso};padding:${conCinta ? 40 : 52}px 40px 36px;
  box-shadow:0 14px 22px rgba(30,15,5,.45), 0 2px 3px rgba(0,0,0,.3);color:${C.texto}">${conCinta ? `<div style="position:absolute;left:290px;top:-24px;width:150px;height:46px;transform:rotate(${rot * -4}deg);
  background:rgba(236,226,196,.8);box-shadow:0 2px 4px rgba(0,0,0,.18);clip-path:polygon(2% 0,98% 4%,100% 50%,97% 100%,3% 96%,0 45%)"></div>` : ""}${html}</div>`;
const etiqueta = (t) => `<div style="font:26px 'Special Elite';color:${C.gris};letter-spacing:3px">${t}</div>`;
const titular = (t, tam = 76) => `<div style="font:900 ${tam}px 'Playfair Display';line-height:1;margin-top:8px">${t}</div>`;
// párrafo: letra de lectura (propuesta: Source Serif 4), 38 px = unos 13 px en un celular de 375 px
const parrafo = (t) => `<div style="font:400 38px/1.38 'Source Serif 4',serif;color:${C.texto}">${t}</div>`;
const sup = (n) => `<sup style="font:700 .6em 'Playfair Display';color:${C.rojo};margin-left:3px">${n}</sup>`;
const cinta = (x, y, w, rot) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:46px;transform:rotate(${rot}deg);
  background:rgba(236,226,196,.78);box-shadow:0 2px 4px rgba(0,0,0,.18);clip-path:polygon(2% 0,98% 4%,100% 50%,97% 100%,3% 96%,0 45%)"></div>`;
const parche = (x, y, d, t, color = C.tinta) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;
  background:${color};box-shadow:0 8px 14px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;transform:rotate(-8deg)">
  <div style="width:${d - 18}px;height:${d - 18}px;border-radius:50%;border:4px dashed ${C.hueso};display:flex;align-items:center;justify-content:center;
  text-align:center;font:${Math.round(d / 7)}px/1.1 'Special Elite';color:${C.hueso};padding:10px">${t}</div></div>`;
const sticker = (src, x, y, h, rot = 0) => `<img src="${url(src)}" style="position:absolute;left:${x}px;top:${y}px;height:${h}px;transform:rotate(${rot}deg);image-rendering:pixelated;
  filter:drop-shadow(4px 0 0 #fff) drop-shadow(-4px 0 0 #fff) drop-shadow(0 4px 0 #fff) drop-shadow(0 -4px 0 #fff) drop-shadow(5px 8px 6px rgba(0,0,0,.45))">`;
const chapa = (src, x, y, d) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;overflow:hidden;
  box-shadow:0 10px 16px rgba(0,0,0,.5), inset 0 0 0 4px rgba(255,255,255,.35)"><img src="${url(src)}" style="width:100%;height:100%;image-rendering:pixelated"></div>`;
const leo = (n, x, y, h) => `<img src="${url(`public/personaje/v2/${n}.png`)}" style="position:absolute;left:${x}px;top:${y}px;height:${h}px;image-rendering:pixelated;filter:drop-shadow(6px 10px 6px rgba(0,0,0,.5))">`;

// ---------- mapa impreso clavado (lámina 1) ----------
const w = require("world-atlas/countries-50m.json");
const paises = topo.feature(w, w.objects.countries).features;
const por = (id) => paises.find((f) => String(f.id).padStart(3, "0") === id);
const col = por("170");
const MAPA = { x: 400, y: 850, w: 520, h: 400 };
const proj = d3.geoMercator().fitExtent([[MAPA.x + 40, MAPA.y + 40], [MAPA.x + MAPA.w - 40, MAPA.y + MAPA.h - 50]], col);
const g = d3.geoPath(proj);
const [, yCorte] = proj([-70, -2.2]);
const leticia = proj([-69.94, -4.21]);

// ---------- recorrido del hilo: pin a pin ----------
// En cada lámina el hilo entra por abajo a la izquierda, sube por el margen, cruza por encima de la tarjeta
// de título (entre sus dos pines) y baja por el margen derecho. Nunca pasa por encima de un párrafo.
const L = (k, x, y) => [k * W + x, y];
const entra = (k) => L(k, 90, COSTURA_Y), sale = (k) => L(k, 990, COSTURA_Y);
const pinesTitulo = (k) => [L(k, 200, 152), L(k, 868, 152)];
const recorrido = [
  ...pinesTitulo(0), L(0, 985, 640), leticia, sale(0),
  entra(1), ...pinesTitulo(1), sale(1),
  entra(2), ...pinesTitulo(2), sale(2),
  entra(3), ...pinesTitulo(3), sale(3),
  entra(4), ...pinesTitulo(4), sale(4),
  entra(5), L(5, 520, 1150),
];
// tramo con caída: la cuerda cuelga un poco hacia abajo según qué tan horizontal es
const tramo = ([x1, y1], [x2, y2]) => {
  const len = Math.hypot(x2 - x1, y2 - y1), caida = Math.min(34, len * 0.05) * Math.abs(x2 - x1) / (len || 1);
  return `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + caida} ${x2},${y2}`;
};
const tramos = recorrido.slice(1).map((p, i) => tramo(recorrido[i], p)).join(" ");
const PIN_COLOR = { rojo: ["#ff6b74", "#c1121f", "#5e070e"], laton: ["#fff1b8", "#c9a227", "#5a4510"] };
const pin = ([x, y], tipo = "rojo") => `<ellipse cx="${x + 7}" cy="${y + 11}" rx="15" ry="11" fill="#000" opacity=".35" filter="url(#borroso)"/>
  <circle cx="${x}" cy="${y}" r="15" fill="url(#pin-${tipo})"/><circle cx="${x - 5}" cy="${y - 6}" r="4" fill="#fff" opacity=".55"/>`;

const texto_l = [
  // 1. portada
  `${columna(tarjetaF(-0.4, `${etiqueta("EXPEDIENTE · AMAZONAS")}${titular("¿Por qué Colombia tiene esta punta?", 74)}`) +
     tarjetaF(0.4, parrafo(`Mira el sur del mapa. Esa punta delgada baja hasta el río Amazonas y se llama el trapecio amazónico. No siempre fue colombiana.`), true))}
   <div style="position:absolute;left:${MAPA.x}px;top:${MAPA.y}px;width:${MAPA.w}px;height:${MAPA.h}px;background:#efe6d0;transform:rotate(1.2deg);
     box-shadow:0 14px 22px rgba(30,15,5,.45)">
     <div style="position:absolute;left:24px;bottom:16px;font:20px 'Special Elite';color:${C.gris}">ESQUEMA · Natural Earth ${sup(4)}</div></div>
   <svg style="position:absolute;left:0;top:0" width="${W}" height="${H}"><g transform="rotate(1.2 ${MAPA.x + MAPA.w / 2} ${MAPA.y + MAPA.h / 2})">
     <defs><clipPath id="trap"><rect x="0" y="${yCorte}" width="${W}" height="${H}"/></clipPath></defs>
     <path d="${g(col)}" fill="#cdbd9b" stroke="${C.gris}" stroke-width="3"/><path d="${g(col)}" fill="${C.rojo}" clip-path="url(#trap)"/></g></svg>
   ${cinta(MAPA.x - 30, MAPA.y - 14, 170, -28)}${cinta(MAPA.x + MAPA.w - 130, MAPA.y + MAPA.h - 30, 170, -24)}
   ${leo("leo-mapa-puntero", 60, 990, 270)}
   ${sticker("public/personaje/v2/obj-rosa-vientos.png", 300, 880, 120, 12)}`,
  // 2. 1922
  `${columna(tarjetaF(0.5, `${etiqueta("LIMA · 1922")}${titular(`Un acuerdo escrito${sup(1)}`)}`) +
     tarjetaF(-0.4, parrafo(`En 1922, Colombia y Perú firmaron un tratado en Lima. Un tratado es un acuerdo escrito entre países. Allí dijeron por dónde pasaba la frontera. Perú le dejó a Colombia la punta que llega al Amazonas. Colombia también cedió tierras.`), true))}
   ${leo("leo-lupa", 300, 960, 300)}
   ${parche(640, 980, 210, "LIMA<br>1922")}`,
  // 3. 1930
  `${columna(tarjetaF(-0.5, `${etiqueta("LETICIA · 1930")}${titular(`Leticia pasa a Colombia${sup(2)}`)}`) +
     tarjetaF(0.3, parrafo(`Los dos países tardaron en aprobar el tratado. Colombia lo aprobó en 1925 y Perú en 1927. El 31 de julio de 1930, Perú entregó Leticia, un pueblo a orillas del Amazonas.`), true))}
   ${leo("leo-mapa-pin", 290, 1010, 240)}
   ${sticker("public/personaje/v2/ico-barco.png", 600, 960, 190, -6)}`,
  // 4. 1932
  `${columna(tarjetaF(0.6, `${etiqueta("AMAZONAS · 1932")}${titular(`Una guerra en la selva${sup(3)}`)}`) +
     tarjetaF(-0.3, parrafo(`En 1932, un grupo de peruanos armados se tomó Leticia. Muchos en Perú no aceptaban el tratado. Colombia mandó barcos y soldados por los ríos. Hubo combates hasta 1933. Al final, Leticia volvió a Colombia.`), true))}
   ${leo("leo-gancho-manos-cabeza", 280, 960, 290)}
   ${sticker("public/personaje/v2/ico-canoa.png", 610, 1080, 110, -8)}
   ${parche(700, 930, 170, "1932<br>1933", C.rojoOsc)}`,
  // 5. pregunta
  `${columna(tarjetaF(-0.4, `${etiqueta("LA PREGUNTA QUE QUEDA")}${titular("¿Quién decide dónde termina un país?")}`) +
     tarjetaF(0.4, parrafo(`Una frontera parece una línea quieta en el mapa. Pero detrás hay acuerdos, peleas y personas. Los pueblos indígenas del Amazonas vivían en ese río mucho antes de cualquier tratado.`), true))}
   ${leo("leo-piensa", 300, 990, 270)}
   ${chapa("public/personaje/v2/ficha-duda.png", 640, 990, 170)}`,
  // 6. notas
  `${columna(tarjetaF(0.3, `${etiqueta("NINGÚN HILO SIN FUENTE")}${titular("Notas", 70)}
     <div style="font:400 30px/1.35 'Source Serif 4',serif;margin-top:14px">Cada número de este carrusel tiene aquí su fuente. Puedes revisarla tú mismo.</div>
     <ol style="margin-top:22px;padding-left:34px;font:21px/1.4 'Special Elite';color:${C.texto}">
       <li style="margin-bottom:12px">«Tratado de límites y navegación fluvial entre Colombia y Perú», Lima, [día] de [marzo o julio] de 1922, en [colección], [vol.], [p.].</li>
       <li style="margin-bottom:12px">[Nombre Apellido], <i>[Título del libro]</i> ([Ciudad]: [Editorial], [año]), [p.].</li>
       <li style="margin-bottom:12px">[Nombre Apellido], «[Título del artículo]», <i>[Revista]</i> [vol.], n.º [n] ([año]): [p.], https://doi.org/[…].</li>
       <li>Natural Earth, «Admin 0. Countries», escala 1:50m, consultado el 19 de noviembre de 2026, https://www.naturalearthdata.com/.</li></ol>
     <div style="font:19px 'Special Elite';color:${C.gris};margin-top:16px">Estilo Chicago, forma de nota. Bibliografía completa en la descripción.</div>`))}
   ${sticker("public/personaje/v2/obj-hilo.png", 440, 1060, 170, -10)}
   ${leo("leo-saluda", 760, 1000, 250)}
   <div style="position:absolute;left:150px;top:1250px;font:900 40px 'Playfair Display';color:${C.hueso};text-shadow:0 3px 8px #000">Profe Leo
     <span style="font:26px 'Special Elite'">@leoelpasado</span></div>`,
];

const laminas = texto_l.map((html, k) => `<div style="position:absolute;left:${k * W}px;top:0;width:${W}px;height:${H}px">${html}</div>`).join("");
const pinesNudo = recorrido.filter(([x, y]) => !(y === COSTURA_Y)); // los de la costura van en latón
const pinesCostura = recorrido.filter(([, y]) => y === COSTURA_Y);

const pagina = (guias) => `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${ANCHO}px;height:${H}px;overflow:hidden;position:relative;background:url('${url(path.relative(RAIZ, fondo))}') 0 0/${ANCHO}px ${H}px}</style></head><body>
${laminas}
<svg style="position:absolute;left:0;top:0;pointer-events:none" width="${ANCHO}" height="${H}">
  <defs>
    <filter id="borroso"><feGaussianBlur stdDeviation="3"/></filter>
    ${Object.entries(PIN_COLOR).map(([k, [a, b, c]]) => `<radialGradient id="pin-${k}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`).join("")}
  </defs>
  <path d="${tramos}" stroke="#000" stroke-opacity=".35" stroke-width="8" fill="none" transform="translate(5,9)" filter="url(#borroso)"/>
  <path d="${tramos}" stroke="${C.rojoOsc}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="${tramos}" stroke="${C.rojo}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="${tramos}" stroke="#ff7a82" stroke-width="1.6" fill="none" stroke-dasharray="2 6" stroke-opacity=".8"/>
  ${pinesNudo.map((p) => pin(p)).join("")}${pinesCostura.map((p) => pin(p, "laton")).join("")}
</svg>
${guias ? [1, 2, 3, 4, 5].map((k) => `<div style="position:absolute;left:${k * W - 1}px;top:0;width:2px;height:${H}px;background:rgba(0,120,255,.7)"></div>`).join("") : ""}
${[...Array(N)].map((_, k) => `<div style="position:absolute;left:${k * W + W - 210}px;top:40px;font:20px 'Special Elite';color:${C.hueso};text-shadow:0 1px 3px #000">BOCETO · ${k + 1}/${N}</div>`).join("")}
</body></html>`;

const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((p) => fs.existsSync(p));
for (const [guias, nombre] of [[true, "panorama-con-guias.png"], [false, "panorama.png"]]) {
  const f = path.join(OUT, guias ? "guias.html" : "final.html");
  fs.writeFileSync(f, pagina(guias));
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
    "--virtual-time-budget=9000", `--window-size=${ANCHO},${H}`, `--screenshot=${path.join(OUT, nombre)}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
}
execFileSync("python", ["-c", `
from PIL import Image
p=Image.open(r'${path.join(OUT, "panorama.png")}')
for k in range(${N}): p.crop((k*${W},0,(k+1)*${W},${H})).save(r'${OUT}'+f'/lamina-{k+1}.png')
g=Image.open(r'${path.join(OUT, "panorama-con-guias.png")}'); g.resize((g.width//3,g.height//3)).save(r'${OUT}/vista-guias.png')`]);
console.log("listo:", OUT);
