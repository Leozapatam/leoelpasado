// Carrusel panorámico: AULA MODERNA 2.5D en pixel art.
// Arriba: un televisor en la pared con el título. En medio: un tablero blanco continuo que se alarga por todas las láminas,
// con marcador negro y el hilo rojo entre imanes. Abajo: el párrafo en una hoja y Profe Leo v2 sobre una franja delgada
// de piso de baldosa. El hilo cruza todas las costuras a la misma altura.
// Uso: node carrusel/panorama/aula-blanca.cjs   (desde la raíz). Textos y datos de MUESTRA, por verificar.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const topo = require("topojson-client");
const d3 = require("d3-geo");

const RAIZ = path.resolve(__dirname, "..", "..");
const OUT = path.join(RAIZ, "out", "aula-blanca-leticia");
fs.mkdirSync(OUT, { recursive: true });
const url = (p) => "file:///" + path.join(RAIZ, p).replace(/\\/g, "/");
const N = 6, W = 1080, H = 1350, ANCHO = N * W, PX = 4;
const TAB = { arriba: 450, abajo: 1080 }; // tablero a altura de salón: el borde de abajo queda a la cadera de Profe Leo // interior del tablero blanco
const PISO = 1272; // empieza el piso
const COSTURA_Y = 610;
const C = { texto: "#1b1612", gris: "#6b5a45", rojo: "#c1121f", rojoOsc: "#7d0a13", rojoClaro: "#ff4d57", hueso: "#f4ead5", marcador: "#1d1d1f" };

// ---------- aula en pixel art (a 1/4 de resolución) ----------
const dibujo = `
const LW=${ANCHO / PX}, LH=${Math.ceil(H / PX)};
const cv=document.getElementById('aula'); cv.width=LW; cv.height=LH; const g=cv.getContext('2d');
let s=21; const rnd=()=>((s=(s*16807)%2147483647)/2147483647);
const bayer=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const banda=(y0,y1,c0,c1)=>{for(let y=y0;y<y1;y++){const t=(y-y0)/(y1-y0);for(let x=0;x<LW;x++){g.fillStyle=((t*15)>bayer[y%4][x%4])?c1:c0;g.fillRect(x,y,1,1);}}};
const P=${PISO / PX};
// pared clara
banda(0,P,'#dcdcd6','#e8e6df');
// zócalo
g.fillStyle='#b9b4a8'; g.fillRect(0,P-3,LW,3); g.fillStyle='#9d978a'; g.fillRect(0,P-1,LW,1);
// televisores: uno por lámina
for(let k=0;k<${N};k++){const x0=k*${W / PX}+26, y0=9, w=218, h=90;
  for(let i=1;i<=7;i++){g.fillStyle='rgba(20,20,25,.045)'; g.fillRect(x0+2+i,y0+4+i,w,h);}   // sombra suave en la pared
  for(const bx of [x0+56,x0+w-58]){g.fillStyle='#55565c'; g.fillRect(bx,0,2,y0); g.fillStyle='#7c7d84'; g.fillRect(bx,0,1,y0);
    g.fillStyle='rgba(20,20,25,.10)'; g.fillRect(bx+3,0,2,y0+2); g.fillStyle='#3d3e44'; g.fillRect(bx-2,y0-1,6,2);}  // tubos al techo
  g.fillStyle='#4a4b52'; g.fillRect(x0,y0,w,h);                               // canto claro del marco
  g.fillStyle='#1c1c21'; g.fillRect(x0+1,y0+1,w-2,h-2);                       // marco
  g.fillStyle='#2b2c33'; g.fillRect(x0+1,y0+1,w-2,1);
  g.fillStyle='#0b0c0f'; g.fillRect(x0+4,y0+4,w-8,h-11);                      // pantalla
  g.fillStyle='rgba(255,255,255,.035)'; for(let i=0;i<40;i++){g.fillRect(x0+130+i,y0+4,1,Math.min(h-11,i*2+4));}
  g.fillStyle='#c9cbd0'; g.fillRect(x0+w/2-6,y0+h-5,12,1);                    // marca
  g.fillStyle='#e0303a'; g.fillRect(x0+w-10,y0+h-5,2,1);}                      // luz de encendido
// tablero blanco continuo con marco de aluminio
const T0=${TAB.arriba / PX}, T1=${TAB.abajo / PX};
g.fillStyle='rgba(0,0,0,.15)'; g.fillRect(6,T0-1,LW-8,T1-T0+6);
g.fillStyle='#b8bdc2'; g.fillRect(3,T0-3,LW-6,T1-T0+6); g.fillStyle='#d9dde0'; g.fillRect(3,T0-3,LW-6,1);
g.fillStyle='#f5f6f3'; g.fillRect(6,T0,LW-12,T1-T0);
// reflejos y restos de borrador muy suaves
for(let i=0;i<70;i++){const cx=10+rnd()*(LW-20), cy=T0+6+rnd()*(T1-T0-12); g.fillStyle='rgba(120,125,130,.035)'; g.beginPath(); g.ellipse(cx,cy,10+rnd()*20,3+rnd()*5,0,0,7); g.fill();}
for(let x=0;x<LW;x+=90){g.fillStyle='rgba(255,255,255,.6)'; for(let i=0;i<30;i++){g.fillRect(x+i,T0+2+i,2,1);}}
// bandeja de aluminio con marcadores y borrador
g.fillStyle='#a3a8ad'; g.fillRect(3,T1+3,LW-6,4); g.fillStyle='#868b90'; g.fillRect(3,T1+7,LW-6,1);
for(let x=24;x<LW-30;x+=55+(rnd()*90|0)){const c=rnd();
  if(c<.65){const tapa=['#1d1d1f','#c1121f','#2456a6','#2e7d4a'][rnd()*4|0]; g.fillStyle='#ececec'; g.fillRect(x,T1+1,11,2); g.fillStyle=tapa; g.fillRect(x+11,T1+1,4,2);}
  else{g.fillStyle='#2d2f36'; g.fillRect(x,T1,13,3); g.fillStyle='#d9d2c4'; g.fillRect(x,T1+3,13,1);}}
// piso de baldosa (franja delgada), juntas inclinadas para dar profundidad
for(let y=P;y<LH;y++){for(let x=0;x<LW;x++){const fila=y<P+8?0:1; const off=(y-P)*0.45;
  const junta=((x+off)%26<1)||(y===P+8)||(y===P);
  const tono=(((x+off)/26|0)+fila)%2? '#e3e0d8':'#d6d2c8';
  g.fillStyle=junta?'#a9a497':tono; g.fillRect(x,y,1,1);}}
g.fillStyle='rgba(0,0,0,.10)'; g.fillRect(0,P,LW,2);
`;

// ---------- marcador sobre el tablero ----------
const w = require("world-atlas/countries-50m.json");
const col = topo.feature(w, w.objects.countries).features.find((f) => String(f.id).padStart(3, "0") === "170");
const proj = d3.geoMercator().fitExtent([[110, 468], [430, 752]], col);
const mapa = d3.geoPath(proj)(col);
const [, yCorte] = proj([-70, -2.2]);
const leticia = proj([-69.94, -4.21]);
const L = (k, x, y) => [k * W + x, y];
const mtx = (x, y, t, tam, color = C.marcador) => `<text x="${x}" y="${y}" font-family="Permanent Marker" font-size="${tam}" fill="${color}">${t}</text>`;
const num = ([x, y], n, dx = 36, dy = -32) => `<circle cx="${x + dx}" cy="${y + dy}" r="25" fill="none" stroke="${C.marcador}" stroke-width="4"/><text x="${x + dx}" y="${y + dy + 11}" text-anchor="middle" font-family="Playfair Display" font-weight="900" font-size="32" fill="${C.marcador}">${n}</text>`;
const NODO = [leticia, L(1, 540, 490), L(2, 540, 740), L(3, 540, 490), L(4, 540, 740), L(5, 350, 478)];
const trazos = [
  `<defs><clipPath id="trap"><rect x="0" y="${yCorte}" width="${W}" height="400"/></clipPath>
     <pattern id="rayado" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="5" height="10" fill="${C.rojo}"/></pattern></defs>
   <path d="${mapa}" fill="none" stroke="${C.marcador}" stroke-width="5" stroke-linejoin="round"/>
   <path d="${mapa}" fill="url(#rayado)" clip-path="url(#trap)"/>
   <ellipse cx="${leticia[0] - 6}" cy="${leticia[1] - 26}" rx="60" ry="46" fill="none" stroke="${C.rojo}" stroke-width="5" transform="rotate(-8 ${leticia[0]} ${leticia[1]})"/>
   ${mtx(520, 560, "¿esta punta?", 56)}
   <path d="M 600 580 Q 560 660 ${leticia[0] + 70} ${leticia[1] - 30}" fill="none" stroke="${C.marcador}" stroke-width="5" stroke-linecap="round"/>
   <path d="M ${leticia[0] + 96} ${leticia[1] - 52} l -26 22 l 32 10" fill="none" stroke="${C.marcador}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  `${mtx(L(1, 580, 0)[0], 690, "1922", 110)}${mtx(L(1, 585, 0)[0], 752, "Lima · un tratado", 36, "#2456a6")}${num(NODO[1], "1")}`,
  `${mtx(L(2, 580, 0)[0], 565, "1930", 110)}${mtx(L(2, 585, 0)[0], 618, "entrega de Leticia", 32, "#2456a6")}${num(NODO[2], "2", 42, 8)}`,
  `${mtx(L(3, 580, 0)[0], 690, "1932", 110)}${mtx(L(3, 585, 0)[0], 752, "guerra en la selva", 36, "#2456a6")}${num(NODO[3], "3")}`,
  `${mtx(L(4, 640, 0)[0], 620, "?", 150, C.rojo)}${mtx(L(4, 130, 0)[0], 550, "¿quién decide?", 52)}`,
  ``,
];

// ---------- hilo e imanes ----------
const puntos = [];
for (let k = 0; k < N; k++) {
  if (k > 0) puntos.push(L(k, 90, COSTURA_Y));
  puntos.push(NODO[k]);
  if (k < N - 1) puntos.push(L(k, 990, COSTURA_Y));
}
const tramo = ([x1, y1], [x2, y2]) => `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + Math.min(30, Math.abs(x2 - x1) * 0.05)} ${x2},${y2}`;
const hilo = puntos.slice(1).map((p, i) => tramo(puntos[i], p)).join(" ");
const iman = ([x, y]) => `<ellipse cx="${x + 5}" cy="${y + 9}" rx="17" ry="12" fill="#000" opacity=".25" filter="url(#borroso)"/>
  <circle cx="${x}" cy="${y}" r="17" fill="url(#iman)"/><circle cx="${x - 6}" cy="${y - 6}" r="5" fill="#fff" opacity=".5"/>`;

// ---------- televisor (título), hoja (párrafo) y Profe Leo ----------
const sup = (n) => `<sup style="font:700 .6em 'Playfair Display';color:${C.rojoClaro};margin-left:3px">${n}</sup>`;
const tv = (etq, tit) => `<div style="position:absolute;left:120px;top:52px;width:840px;height:316px;display:flex;flex-direction:column;justify-content:center;padding:0 40px;
  background:radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.07), transparent 60%)">
  <div style="font:24px 'Special Elite';color:${C.rojoClaro};letter-spacing:4px">${etq}</div>
  <div style="font:900 70px 'Playfair Display';line-height:1.04;color:${C.hueso};margin-top:10px">${tit}</div></div>`;
// el párrafo va escrito en el tablero, con letra de mano clara, a la derecha de Profe Leo
const hoja = (t, extra = "", top = 790) => `<div style="position:absolute;left:375px;top:${top}px;width:660px;color:${C.marcador}">
  <div style="font:400 37px/1.2 'Patrick Hand',cursive">${t}</div>${extra}</div>`;
const leo = (n, cx = 190, pies = 1336, h = 420) => `<div style="position:absolute;left:${cx - h * 0.3}px;top:${pies - 14}px;width:${h * 0.6}px;height:26px;border-radius:50%;background:rgba(0,0,0,.22)"></div>
  <img src="${url(`public/personaje/v2/${n}.png`)}" style="position:absolute;left:${cx}px;top:${pies - h}px;height:${h}px;transform:translateX(-50%);image-rendering:pixelated">`;

const laminas = [
  tv("EXPEDIENTE · AMAZONAS", "¿Por qué Colombia tiene esta punta?") +
    hoja("Mira el sur de Colombia en el mapa del tablero. Hay una punta delgada que baja hasta el río Amazonas. Se llama el trapecio amazónico. No siempre fue colombiana.") + leo("leo-mapa-mira-arriba"),
  tv("LIMA · 1922", `Un acuerdo escrito${sup(1)}`) +
    hoja("En 1922, Colombia y Perú firmaron un tratado en Lima. Un tratado es un acuerdo escrito entre países. Allí dijeron por dónde pasaba la frontera. Perú le dejó a Colombia la punta que llega al Amazonas.") + leo("leo-lupa"),
  tv("LETICIA · 1930", `Leticia pasa a Colombia${sup(2)}`) +
    hoja("Los dos países tardaron en aprobar el tratado. Colombia lo aprobó en 1925 y Perú en 1927. El 31 de julio de 1930, Perú entregó Leticia, un pueblo a orillas del Amazonas.") + leo("leo-documento"),
  tv("AMAZONAS · 1932", `Una guerra en la selva${sup(3)}`) +
    hoja("En 1932, un grupo de peruanos armados se tomó Leticia. Muchos en Perú no aceptaban el tratado. Colombia mandó barcos y soldados por los ríos. Hubo combates hasta 1933. Al final, Leticia volvió a Colombia.") + leo("leo-gancho-manos-cabeza"),
  tv("LA PREGUNTA QUE QUEDA", "¿Quién decide dónde termina un país?") +
    hoja("Una frontera parece una línea quieta. Pero detrás hay acuerdos, peleas y personas. Los pueblos indígenas del Amazonas vivían en este río mucho antes de cualquier tratado.") + leo("leo-piensa"),
  tv("NINGÚN HILO SIN FUENTE", "Notas") +
    `<div style="position:absolute;left:330px;top:464px;width:700px;height:450px;background:#fdfcf8;padding:24px 30px;box-shadow:0 6px 10px rgba(0,0,0,.25);color:${C.texto}">
      <ol style="padding-left:30px;font:19px/1.38 'Special Elite'">
       <li style="margin-bottom:12px">«Tratado de límites y navegación fluvial entre Colombia y Perú», Lima, [día] de [marzo o julio] de 1922, en [colección], [vol.], [p.].</li>
       <li style="margin-bottom:12px">[Nombre Apellido], <i>[Título del libro]</i> ([Ciudad]: [Editorial], [año]), [p.].</li>
       <li style="margin-bottom:12px">[Nombre Apellido], «[Título del artículo]», <i>[Revista]</i> [vol.], n.º [n] ([año]): [p.], https://doi.org/[…].</li>
       <li>Natural Earth, «Admin 0. Countries», escala 1:50m, consultado el 19 de noviembre de 2026, https://www.naturalearthdata.com/.</li></ol>
      <div style="font:18px 'Special Elite';color:${C.gris};margin-top:8px">Estilo Chicago, forma de nota. Bibliografía completa en la descripción.</div></div>` +
    hoja("Cada número tiene aquí su fuente. Puedes revisarla tú mismo.",
      `<div style="font:900 34px 'Playfair Display';margin-top:8px">Profe Leo <span style="font:22px 'Special Elite';color:${C.gris}">@leoelpasado</span></div>`, 930) + leo("leo-mapa-hilo"),
];

const pagina = (guias) => `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Source+Serif+4:opsz,wght@8..60,400&family=Permanent+Marker&family=Patrick+Hand&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${ANCHO}px;height:${H}px;overflow:hidden;position:relative;background:#000}
#aula{position:absolute;left:0;top:0;width:${ANCHO}px;height:${Math.ceil(H / PX) * PX}px;image-rendering:pixelated}</style></head><body>
<canvas id="aula"></canvas><script>${dibujo}</script>
<svg style="position:absolute;left:0;top:0" width="${ANCHO}" height="${H}">
  <defs>
    <filter id="mano" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="9" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="3"/></filter>
    <filter id="borroso"><feGaussianBlur stdDeviation="3"/></filter>
    <radialGradient id="iman" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ff6b74"/><stop offset=".55" stop-color="${C.rojo}"/><stop offset="1" stop-color="#5e070e"/></radialGradient>
  </defs>
  <g filter="url(#mano)" opacity=".95">${trazos.map((t, k) => `<g>${t}</g>`).join("")}</g>
  <path d="${hilo}" stroke="#000" stroke-opacity=".25" stroke-width="7" fill="none" transform="translate(4,9)" filter="url(#borroso)"/>
  <path d="${hilo}" stroke="${C.rojoOsc}" stroke-width="7" fill="none"/><path d="${hilo}" stroke="${C.rojo}" stroke-width="4" fill="none"/>
  <path d="${hilo}" stroke="#ff7a82" stroke-width="1.5" stroke-dasharray="2 6" fill="none"/>
  ${puntos.map(iman).join("")}
</svg>
${laminas.map((t, k) => `<div style="position:absolute;left:${k * W}px;top:0;width:${W}px;height:${H}px">${t}</div>`).join("")}
${guias ? [1, 2, 3, 4, 5].map((k) => `<div style="position:absolute;left:${k * W - 1}px;top:0;width:2px;height:${H}px;background:rgba(0,120,255,.8)"></div>`).join("") : ""}
${[...Array(N)].map((_, k) => `<div style="position:absolute;left:${k * W + W - 190}px;top:6px;font:16px 'Special Elite';color:#8a857a">BOCETO · ${k + 1}/${N}</div>`).join("")}
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
g=Image.open(r'${path.join(OUT, "panorama-con-guias.png")}'); g.resize((g.width//3,g.height//3)).save(r'${OUT}/vista-guias.png')
a=Image.open(r'${OUT}/lamina-1.png'); b=Image.open(r'${OUT}/lamina-2.png'); S=Image.new('RGB',(2160,1350)); S.paste(a,(0,0)); S.paste(b,(1080,0)); S.resize((1440,900)).save(r'${OUT}/l1-l2.png')`]);
console.log("listo:", OUT);
