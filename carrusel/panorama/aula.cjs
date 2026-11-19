// Carrusel panorámico como AULA 2.5D en pixel art: un tablero de tiza que se alarga por todas las láminas.
// Arriba: el título en una cartulina pegada a la pared. En medio: el tablero, con dibujos de tiza y el hilo rojo
// que une imanes (los puntos). Abajo: Profe Leo v2 en el piso del salón y el párrafo en una hoja.
// El hilo cruza todas las costuras a la misma altura. El aula se dibuja a 1/4 de resolución y se amplía sin suavizar.
// Uso: node carrusel/panorama/aula.cjs   (desde la raíz). Textos y datos de MUESTRA, por verificar.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const topo = require("topojson-client");
const d3 = require("d3-geo");

const RAIZ = path.resolve(__dirname, "..", "..");
const OUT = path.join(RAIZ, "out", "aula-leticia");
fs.mkdirSync(OUT, { recursive: true });
const url = (p) => "file:///" + path.join(RAIZ, p).replace(/\\/g, "/");
const N = 6, W = 1080, H = 1350, ANCHO = N * W, PX = 4;
const TABLERO = { arriba: 356, abajo: 804 }; // interior del tablero (px reales)
const COSTURA_Y = 580; // el hilo cruza todas las costuras a esta altura
const C = { texto: "#1b1612", gris: "#6b5a45", rojo: "#c1121f", rojoOsc: "#7d0a13", papel: "#f3ead6", tiza: "#f2efe6" };

// ---------- el aula en pixel art (se dibuja en el navegador, a baja resolución) ----------
const dibujo = `
const LW=${ANCHO / PX}, LH=${Math.ceil(H / PX)};
const cv=document.getElementById('aula'); cv.width=LW; cv.height=LH; const g=cv.getContext('2d');
let s=11; const rnd=()=>((s=(s*16807)%2147483647)/2147483647);
const bayer=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const banda=(y0,y1,c0,c1)=>{for(let y=y0;y<y1;y++){const t=(y-y0)/(y1-y0);for(let x=0;x<LW;x++){g.fillStyle=((t*15)>bayer[y%4][x%4])?c1:c0;g.fillRect(x,y,1,1);}}};
// pared: arriba más oscura, luz que baja
banda(0,120,'#c7b48c','#d9c9a3'); banda(120,226,'#d9c9a3','#e0d2ae');
// zócalo verde y moldura
g.fillStyle='#6f7d5d'; g.fillRect(0,228,LW,22); g.fillStyle='#5b684b'; g.fillRect(0,228,LW,2); g.fillStyle='#8a5f38'; g.fillRect(0,226,LW,2);
// tablero continuo con marco de madera
const T0=${TABLERO.arriba / PX}, T1=${TABLERO.abajo / PX};
g.fillStyle='#6b4423'; g.fillRect(4,T0-4,LW-8,T1-T0+8); g.fillStyle='#4a2f18'; g.fillRect(4,T1+3,LW-8,1);
g.fillStyle='#2c4436'; g.fillRect(8,T0,LW-16,T1-T0);
for(let i=0;i<9000;i++){g.fillStyle=rnd()<.6?'#35503f':'#26392e'; g.fillRect(8+(rnd()*(LW-16)|0),T0+(rnd()*(T1-T0)|0),1,1);}
// manchas de borrador
for(let i=0;i<60;i++){const cx=8+rnd()*(LW-16), cy=T0+8+rnd()*(T1-T0-16), r=6+rnd()*14; g.fillStyle='rgba(220,230,220,.035)';
  for(let k=0;k<5;k++){g.beginPath(); g.ellipse(cx+k*3,cy,r,r*0.45,0,0,7); g.fill();}}
// bandeja de la tiza, con tizas y borradores
g.fillStyle='#7a5330'; g.fillRect(4,T1+4,LW-8,4); g.fillStyle='#5a3a1f'; g.fillRect(4,T1+8,LW-8,1);
for(let x=20;x<LW-20;x+=37+(rnd()*60|0)){const c=rnd(); if(c<.55){g.fillStyle=['#f4f1e8','#f2e27a','#f2a3a3'][rnd()*3|0]; g.fillRect(x,T1+3,6,2);}
  else{g.fillStyle='#3b3b45'; g.fillRect(x,T1+1,12,3); g.fillStyle='#c9b48a'; g.fillRect(x,T1+4,12,1);}}
// piso de tablas de madera
banda(250,LH,'#86643f','#73552f');
for(let y=252;y<LH;y+=7){g.fillStyle='#5e4426'; g.fillRect(0,y,LW,1); for(let x=(rnd()*40|0);x<LW;x+=40+(rnd()*50|0)){g.fillRect(x,y,1,7);}}
g.fillStyle='rgba(30,18,8,.18)'; g.fillRect(0,250,LW,10);
`;

// ---------- tiza ----------
const w = require("world-atlas/countries-50m.json");
const col = topo.feature(w, w.objects.countries).features.find((f) => String(f.id).padStart(3, "0") === "170");
const proj = d3.geoMercator().fitExtent([[560, 372], [960, 790]], col);
const mapa = d3.geoPath(proj)(col);
const [, yCorte] = proj([-70, -2.2]);
const leticia = proj([-69.94, -4.21]);
const tizaTexto = (x, y, t, tam, extra = "") => `<text x="${x}" y="${y}" font-family="Cabin Sketch" font-weight="700" font-size="${tam}" fill="${C.tiza}" ${extra}>${t}</text>`;
const numTiza = ([x, y], n, dx = 34, dy = -30) => `<circle cx="${x + dx}" cy="${y + dy}" r="24" fill="none" stroke="${C.tiza}" stroke-width="3"/>${tizaTexto(x + dx - 9, y + dy + 11, n, 32)}`;
const L = (k, x, y) => [k * W + x, y];

// nudos del hilo: alternan arriba y abajo para que el ojo baje y suba
const NODO = [leticia, L(1, 540, 420), L(2, 540, 740), L(3, 540, 420), L(4, 540, 740), L(5, 170, 384)];
const tiza = [
  // 1. mapa de tiza con la punta en rojo
  `<g transform="translate(0,0)"><defs><clipPath id="trap"><rect x="0" y="${yCorte}" width="${W}" height="400"/></clipPath></defs>
    <path d="${mapa}" fill="none" stroke="${C.tiza}" stroke-width="4"/>
    <path d="${mapa}" fill="#e88a8a" opacity=".85" clip-path="url(#trap)"/></g>
   <ellipse cx="${leticia[0] - 6}" cy="${leticia[1] - 26}" rx="58" ry="44" fill="none" stroke="#f08a8a" stroke-width="5" transform="rotate(-8 ${leticia[0]} ${leticia[1]})"/>
   ${tizaTexto(120, 770, "¿esta punta?", 58)}
   <path d="M 470 752 Q 600 720 ${leticia[0] - 70} ${leticia[1] - 24}" fill="none" stroke="${C.tiza}" stroke-width="4"/>
   <path d="M ${leticia[0] - 96} ${leticia[1] - 44} l 28 20 l -32 12" fill="none" stroke="${C.tiza}" stroke-width="4"/>`,
  // 2. 1922 (texto debajo del hilo, imán arriba)
  `${tizaTexto(L(1, 330, 0)[0], 640, "1922", 120)}${tizaTexto(L(1, 345, 0)[0], 720, "Lima · un tratado", 46)}${numTiza(NODO[1], "1")}`,
  // 3. 1930 (texto encima del hilo, imán abajo)
  `${tizaTexto(L(2, 330, 0)[0], 470, "1930", 120)}${tizaTexto(L(2, 345, 0)[0], 540, "Leticia pasa a Colombia", 42)}
   <path d="M ${L(2, 700, 0)[0]} 720 q 30 -14 60 0 t 60 0 t 60 0" fill="none" stroke="${C.tiza}" stroke-width="4"/>${numTiza(NODO[2], "2", 40, 10)}`,
  // 4. 1932
  `${tizaTexto(L(3, 290, 0)[0], 640, "1932", 120)}${tizaTexto(L(3, 305, 0)[0], 720, "guerra en la selva", 46)}${numTiza(NODO[3], "3")}`,
  // 5. la pregunta
  `${tizaTexto(L(4, 470, 0)[0], 600, "?", 230)}${tizaTexto(L(4, 150, 0)[0], 470, "¿quién decide?", 50)}`,
  // 6. hoja de notas pegada al tablero (se dibuja como HTML)
  ``,
];

// ---------- hilo: imanes junto a cada costura (misma altura) y un imán por nudo ----------
const puntos = [];
for (let k = 0; k < N; k++) {
  if (k > 0) puntos.push(L(k, 90, COSTURA_Y));
  puntos.push(NODO[k]);
  if (k < N - 1) puntos.push(L(k, 990, COSTURA_Y));
}
const tramo = ([x1, y1], [x2, y2]) => `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + Math.min(30, Math.abs(x2 - x1) * 0.05)} ${x2},${y2}`;
const hilo = puntos.slice(1).map((p, i) => tramo(puntos[i], p)).join(" ");
const iman = ([x, y]) => `<ellipse cx="${x + 5}" cy="${y + 9}" rx="17" ry="12" fill="#000" opacity=".35" filter="url(#borroso)"/>
  <circle cx="${x}" cy="${y}" r="17" fill="url(#iman)"/><circle cx="${x - 6}" cy="${y - 6}" r="5" fill="#fff" opacity=".5"/>`;

// ---------- textos de arriba (cartulina) y de abajo (hoja) ----------
const sup = (n) => `<sup style="font:700 .6em 'Playfair Display';color:${C.rojo};margin-left:3px">${n}</sup>`;
const cinta = (x, y, rot) => `<div style="position:absolute;left:${x}px;top:${y}px;width:90px;height:30px;transform:rotate(${rot}deg);background:rgba(240,232,205,.8);box-shadow:0 1px 3px rgba(0,0,0,.2)"></div>`;
const cartulina = (etq, tit) => `<div style="position:absolute;left:110px;top:50px;width:860px;min-height:250px;background:${C.papel};padding:26px 36px;
  box-shadow:0 10px 16px rgba(40,25,10,.3);color:${C.texto};display:flex;flex-direction:column;justify-content:center">
  <div style="font:24px 'Special Elite';color:${C.gris};letter-spacing:3px">${etq}</div>
  <div style="font:900 68px 'Playfair Display';line-height:1.02;margin-top:6px">${tit}</div>
  ${cinta(-30, -12, -20)}${cinta(800, -12, 18)}</div>`;
const hoja = (t, extra = "") => `<div style="position:absolute;left:340px;top:870px;width:690px;background:#fbf7ec;padding:26px 32px 28px;
  box-shadow:0 12px 18px rgba(30,18,8,.4);color:${C.texto};transform:rotate(-0.4deg)">
  <div style="font:400 34px/1.36 'Source Serif 4',serif">${t}</div>${extra}</div>`;
const leo = (n, cx = 185, pies = 1300, h = 300) => `<div style="position:absolute;left:${cx - h * 0.3}px;top:${pies - 16}px;width:${h * 0.6}px;height:30px;border-radius:50%;background:rgba(30,18,8,.35)"></div>
  <img src="${url(`public/personaje/v2/${n}.png`)}" style="position:absolute;left:${cx}px;top:${pies - h}px;height:${h}px;transform:translateX(-50%);image-rendering:pixelated">`;

const laminas = [
  cartulina("EXPEDIENTE · AMAZONAS", "¿Por qué Colombia tiene esta punta?") +
    hoja("Mira el sur de Colombia en el mapa del tablero. Hay una punta delgada que baja hasta el río Amazonas. Se llama el trapecio amazónico. No siempre fue colombiana.") + leo("leo-mapa-mira-arriba"),
  cartulina("LIMA · 1922", `Un acuerdo escrito${sup(1)}`) +
    hoja("En 1922, Colombia y Perú firmaron un tratado en Lima. Un tratado es un acuerdo escrito entre países. Allí dijeron por dónde pasaba la frontera. Perú le dejó a Colombia la punta que llega al Amazonas.") + leo("leo-lupa"),
  cartulina("LETICIA · 1930", `Leticia pasa a Colombia${sup(2)}`) +
    hoja("Los dos países tardaron en aprobar el tratado. Colombia lo aprobó en 1925 y Perú en 1927. El 31 de julio de 1930, Perú entregó Leticia, un pueblo a orillas del Amazonas.") + leo("leo-documento"),
  cartulina("AMAZONAS · 1932", `Una guerra en la selva${sup(3)}`) +
    hoja("En 1932, un grupo de peruanos armados se tomó Leticia. Muchos en Perú no aceptaban el tratado. Colombia mandó barcos y soldados por los ríos. Hubo combates hasta 1933. Al final, Leticia volvió a Colombia.") + leo("leo-gancho-manos-cabeza"),
  cartulina("LA PREGUNTA QUE QUEDA", "¿Quién decide dónde termina un país?") +
    hoja("Una frontera parece una línea quieta. Pero detrás hay acuerdos, peleas y personas. Los pueblos indígenas del Amazonas vivían en este río mucho antes de cualquier tratado.") + leo("leo-piensa"),
  cartulina("NINGÚN HILO SIN FUENTE", "Notas") +
    `<div style="position:absolute;left:150px;top:372px;width:790px;height:418px;background:#fbf7ec;padding:22px 30px;box-shadow:0 8px 12px rgba(0,0,0,.4);color:${C.texto}">
      <ol style="padding-left:30px;font:22px/1.42 'Special Elite'">
       <li style="margin-bottom:12px">«Tratado de límites y navegación fluvial entre Colombia y Perú», Lima, [día] de [marzo o julio] de 1922, en [colección], [vol.], [p.].</li>
       <li style="margin-bottom:12px">[Nombre Apellido], <i>[Título del libro]</i> ([Ciudad]: [Editorial], [año]), [p.].</li>
       <li style="margin-bottom:12px">[Nombre Apellido], «[Título del artículo]», <i>[Revista]</i> [vol.], n.º [n] ([año]): [p.], https://doi.org/[…].</li>
       <li>Natural Earth, «Admin 0. Countries», escala 1:50m, consultado el 19 de noviembre de 2026, https://www.naturalearthdata.com/.</li></ol>
      <div style="font:18px 'Special Elite';color:${C.gris};margin-top:8px">Estilo Chicago, forma de nota. Bibliografía completa en la descripción.</div></div>` +
    hoja("Cada número del tablero tiene aquí su fuente. Puedes revisarla tú mismo. Así trabaja la historia. Ningún hilo sin fuente.",
      `<div style="font:900 34px 'Playfair Display';margin-top:14px">Profe Leo <span style="font:22px 'Special Elite';color:${C.gris}">@leoelpasado</span></div>`) + leo("leo-mapa-hilo"),
];

const pagina = (guias) => `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Source+Serif+4:opsz,wght@8..60,400&family=Cabin+Sketch:wght@700&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${ANCHO}px;height:${H}px;overflow:hidden;position:relative;background:#000}
#aula{position:absolute;left:0;top:0;width:${ANCHO}px;height:${Math.ceil(H / PX) * PX}px;image-rendering:pixelated}</style></head><body>
<canvas id="aula"></canvas><script>${dibujo}</script>
<svg style="position:absolute;left:0;top:0" width="${ANCHO}" height="${H}">
  <defs>
    <filter id="tizaF" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" result="r"/>
      <feColorMatrix in="r" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.2 1.9" result="m"/>
      <feComposite in="SourceGraphic" in2="m" operator="in" result="t"/><feDisplacementMap in="t" in2="r" scale="2.5"/></filter>
    <filter id="borroso"><feGaussianBlur stdDeviation="3"/></filter>
    <radialGradient id="iman" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ff6b74"/><stop offset=".55" stop-color="${C.rojo}"/><stop offset="1" stop-color="#5e070e"/></radialGradient>
  </defs>
  <g filter="url(#tizaF)" opacity=".92">${tiza.join("")}</g>
  <path d="${hilo}" stroke="#000" stroke-opacity=".35" stroke-width="7" fill="none" transform="translate(4,9)" filter="url(#borroso)"/>
  <path d="${hilo}" stroke="${C.rojoOsc}" stroke-width="7" fill="none"/><path d="${hilo}" stroke="${C.rojo}" stroke-width="4" fill="none"/>
  <path d="${hilo}" stroke="#ff7a82" stroke-width="1.5" stroke-dasharray="2 6" fill="none"/>
  ${puntos.map(iman).join("")}
</svg>
${laminas.map((t, k) => `<div style="position:absolute;left:${k * W}px;top:0;width:${W}px;height:${H}px">${t}</div>`).join("")}
${guias ? [1, 2, 3, 4, 5].map((k) => `<div style="position:absolute;left:${k * W - 1}px;top:0;width:2px;height:${H}px;background:rgba(0,120,255,.8)"></div>`).join("") : ""}
${[...Array(N)].map((_, k) => `<div style="position:absolute;left:${k * W + W - 200}px;top:14px;font:18px 'Special Elite';color:${C.gris}">BOCETO · ${k + 1}/${N}</div>`).join("")}
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
