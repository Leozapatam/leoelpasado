// CARRUSEL COMPLETO (6 láminas) con la escena aprobada en muestra.cjs y el tablero en sketchnote jerárquico.
// Una sola imagen panorámica de 6 x 1080 px que se corta en láminas de 1080 x 1350. El tablero, el piso y el hilo son continuos;
// el hilo cruza todas las costuras a la misma altura (HILO_Y) y ningún texto toca una costura.
// Luz de ventana: fuerte por la izquierda en la lámina 1 y por la derecha en la 6; las sombras de Profe Leo siguen ese lado.
// Textos y datos de MUESTRA (por verificar en fuentes primarias y por reescribir con la voz de Leo).
// Uso: node carrusel/panorama/carrusel.cjs   → out/carrusel/lamina-1.png … lamina-6.png, panorama.png
const fs = require("fs");
const path = require("path");
const topo = require("topojson-client");
const d3 = require("d3-geo");
const { execFileSync } = require("child_process");

const RAIZ = path.resolve(__dirname, "..", "..");
const OUT = path.join(RAIZ, "out", "carrusel");
fs.mkdirSync(OUT, { recursive: true });
const url = (p) => "file:///" + path.join(RAIZ, p).replace(/\\/g, "/");
const N = 6, W = 1080, H = 1350, ANCHO = N * W, PX = 4;
const TAB = { arriba: 328, abajo: 808 };
const PISO = 960;
const HILO_Y = 468;
const C = { texto: "#1b1612", gris: "#6b5a45", rojo: "#c1121f", rojoOsc: "#7d0a13", rojoClaro: "#ff4d57", hueso: "#f4ead5", marcador: "#1d1d1f", azul: "#2456a6" };
const REG = JSON.parse(fs.readFileSync(path.join(RAIZ, "public/personaje/sprites.json"), "utf8"));
const spr = (n) => url(`public/personaje/v2/${n}.png`);

// ---------- salón continuo (pixel art a 1/4) ----------
const dibujo = `
const LW=${ANCHO / PX}, LH=${Math.ceil(H / PX)}, LS=${W / PX};
const cv=document.getElementById('aula'); cv.width=LW; cv.height=LH; const g=cv.getContext('2d');
let s=31; const rnd=()=>((s=(s*16807)%2147483647)/2147483647);
const bayer=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const banda=(y0,y1,c0,c1)=>{for(let y=y0;y<y1;y++){const t=(y-y0)/(y1-y0);for(let x=0;x<LW;x++){g.fillStyle=((t*15)>bayer[y%4][x%4])?c1:c0;g.fillRect(x,y,1,1);}}};
const P=${PISO / PX};
banda(0,60,'#cfcdc5','#d9d7cf'); banda(60,P,'#d9d7cf','#e4e2da');
g.fillStyle='#b4afa3'; g.fillRect(0,P-3,LW,3); g.fillStyle='#958f82'; g.fillRect(0,P-1,LW,1);
// un televisor por lámina, colgado del techo
for(let k=0;k<${N};k++){const x0=k*LS+70, y0=6, w=130, h=73;
  for(let i=1;i<=6;i++){g.fillStyle='rgba(20,20,25,.05)'; g.fillRect(x0+2+i,y0+3+i,w,h);}
  for(const bx of [x0+44,x0+w-46]){g.fillStyle='#55565c'; g.fillRect(bx,0,2,y0); g.fillStyle='rgba(20,20,25,.12)'; g.fillRect(bx+3,0,2,y0+2);}
  g.fillStyle='#4a4b52'; g.fillRect(x0,y0,w,h); g.fillStyle='#1c1c21'; g.fillRect(x0+1,y0+1,w-2,h-2);
  g.fillStyle='#0b0c0f'; g.fillRect(x0+3,y0+3,w-6,h-8);
  g.fillStyle='rgba(255,255,255,.035)'; for(let i=0;i<24;i++){g.fillRect(x0+80+i,y0+3,1,Math.min(h-8,i*2+3));}
  g.fillStyle='#c9cbd0'; g.fillRect(x0+w/2-5,y0+h-4,10,1); g.fillStyle='#e0303a'; g.fillRect(x0+w-8,y0+h-4,2,1);}
// tablero blanco continuo: el marco solo cierra en la primera y en la última lámina
const T0=${TAB.arriba / PX}, T1=${TAB.abajo / PX};
for(let i=1;i<=4;i++){g.fillStyle='rgba(20,20,25,.04)'; g.fillRect(8+i,T0-2+i,LW-16,T1-T0+6);}
g.fillStyle='#b8bdc2'; g.fillRect(6,T0-3,LW-12,T1-T0+6); g.fillStyle='#d9dde0'; g.fillRect(6,T0-3,LW-12,1);
g.fillStyle='#f5f6f3'; g.fillRect(9,T0,LW-18,T1-T0);
for(let i=0;i<80;i++){const cx=rnd()*LW, cy=T0+6+rnd()*(T1-T0-12); g.fillStyle='rgba(120,125,130,.035)'; g.beginPath(); g.ellipse(cx,cy,10+rnd()*20,3+rnd()*5,0,0,7); g.fill();}
for(let x=20;x<LW;x+=110){g.fillStyle='rgba(255,255,255,.6)'; for(let i=0;i<26;i++){g.fillRect(x+i,T0+2+i,2,1);}}
g.fillStyle='#a3a8ad'; g.fillRect(6,T1+3,LW-12,3); g.fillStyle='#868b90'; g.fillRect(6,T1+6,LW-12,1);
// marcadores y borradores en la bandeja (lejos de las costuras)
for(let k=0;k<${N};k++){const b=k*LS;
  const tapas=['#1d1d1f','#2456a6','#1d1d1f','#2e7d4a','#1d1d1f','#2456a6'];
  g.fillStyle='#ececec'; g.fillRect(b+60+k*7,T1+1,9,2); g.fillStyle=tapas[k]; g.fillRect(b+69+k*7,T1+1,3,2);
  if(k%2===0){g.fillStyle='#ececec'; g.fillRect(b+150,T1+1,9,2); g.fillStyle='#c1121f'; g.fillRect(b+159,T1+1,3,2);}
  g.fillStyle='#2d2f36'; g.fillRect(b+(k%2?205:118),T1,11,3);}
// piso de baldosa de frente, filas que crecen hacia la cámara
let y=P, alto=4, fila=0; const ancho=27;
while(y<LH){for(let yy=y;yy<Math.min(LH,y+alto);yy++){
  for(let x=0;x<LW;x++){const junta=(x%ancho===0)||yy===y;
    const tono=((x/ancho|0)+fila)%2?'#e2dfd7':'#d6d2c8'; g.fillStyle=junta?'#aaa598':tono; g.fillRect(x,yy,1,1);}}
  g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(0,y+1,LW,1);
  y+=alto; alto=Math.round(alto*1.32)+1; fila++;}
g.fillStyle='rgba(0,0,0,.10)'; g.fillRect(0,P,LW,3);
// enchufes de frente (láminas 2 y 5)
for(const k of [1,4]){const ex=k*LS+184, ey=P-25; g.fillStyle='rgba(20,20,25,.10)'; g.fillRect(ex+1,ey+1,13,18);
  g.fillStyle='#bab5aa'; g.fillRect(ex,ey,13,18); g.fillStyle='#f2f0ea'; g.fillRect(ex+1,ey+1,11,16);
  g.fillStyle='#ffffff'; g.fillRect(ex+1,ey+1,11,1); g.fillStyle='#d8d4cb'; g.fillRect(ex+1,ey+16,11,1);
  for(const ty of [ey+3,ey+10]){g.fillStyle='#e3e0d8'; g.fillRect(ex+3,ty,7,5); g.fillStyle='#5c5952'; g.fillRect(ex+4,ty+1,1,2); g.fillRect(ex+8,ty+1,1,2); g.fillRect(ex+6,ty+3,1,1);}}
`;

// ---------- piezas de sketchnote (coordenadas locales de cada lámina) ----------
const M = C.marcador;
const trazo = `fill="none" stroke="${M}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`;
const trazoAzul = `fill="none" stroke="${C.azul}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`;
const mtx = (x, y, t, tam, color = M, extra = "") => `<text x="${x}" y="${y}" font-family="Permanent Marker" font-size="${tam}" fill="${color}" ${extra}>${t}</text>`;
// el contenido del tablero sube 40 px (ya no hay hilo arriba); la cinta se queda en su sitio
const SUBE = 40;
const cinta = (t) => `<g transform="translate(0,${SUBE})"><path d="M40,352 L322,352 L306,376 L322,400 L40,400 L56,376 Z" fill="#dce7f7" stroke="${M}" stroke-width="4" stroke-linejoin="round"/>${mtx(181, 390, t, 34, M, 'text-anchor="middle"')}</g>`;
const flecha = (x1, y1, x2, y2) => `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - 18} ${x2},${y2}" ${trazo}/>
  <path d="M${x2 - 14},${y2 - 10} L${x2},${y2} L${x2 - 15},${y2 + 8}" ${trazo}/>`;
const resaltado = (x, y, t, tam) => `<rect x="${x - 4}" y="${y - tam * 0.8}" width="${t.length * tam * 0.62 + 8}" height="${tam}" fill="rgba(255,226,80,.6)" transform="rotate(-1.5 ${x} ${y})"/>${mtx(x, y, t, tam)}`;
const persona = (cx, y0, brazoX, brazoY = y0 + 38) => `<circle cx="${cx}" cy="${y0}" r="17" ${trazo}/>
  <path d="M${cx},${y0 + 17} L${cx},${y0 + 63} M${cx},${y0 + 63} L${cx - 16},${y0 + 98} M${cx},${y0 + 63} L${cx + 16},${y0 + 98} M${cx},${y0 + 33} L${brazoX},${brazoY}" ${trazo}/>`;
const personita = (cx, y0) => `<circle cx="${cx}" cy="${y0}" r="9" ${trazo} stroke-width="3.5"/><path d="M${cx},${y0 + 9} L${cx},${y0 + 36} M${cx},${y0 + 36} L${cx - 9},${y0 + 56} M${cx},${y0 + 36} L${cx + 9},${y0 + 56} M${cx - 13},${y0 + 20} L${cx + 13},${y0 + 20}" ${trazo} stroke-width="3.5"/>`;
const doc = (x, y, w = 84, h = 116) => `<path d="M${x},${y} L${x + w - 20},${y} L${x + w},${y + 20} L${x + w},${y + h} L${x},${y + h} Z M${x + w - 20},${y} L${x + w - 20},${y + 20} L${x + w},${y + 20}" fill="#fbfaf6" ${trazo}/>
  <path d="M${x + 12},${y + 38} L${x + w - 14},${y + 38} M${x + 12},${y + 54} L${x + w - 14},${y + 54} M${x + 12},${y + 70} L${x + w - 26},${y + 70}" ${trazo} stroke-width="3"/>`;
const firma = (x, y) => `<path d="M${x},${y} q10,-12 18,0 t18,0" ${trazo} stroke-width="3"/>`;
const check = (x, y, k = 1) => `<path d="M${x},${y} L${x + 14 * k},${y + 16 * k} L${x + 40 * k},${y - 22 * k}" ${trazoAzul} stroke-width="6"/>`;
const casa = (x, y, w = 46) => `<path d="M${x},${y} L${x},${y - 34} L${x + w / 2},${y - 58} L${x + w},${y - 34} L${x + w},${y} Z M${x + w * 0.38},${y} L${x + w * 0.38},${y - 18} L${x + w * 0.62},${y - 18} L${x + w * 0.62},${y}" fill="#fbfaf6" ${trazo}/>`;
const bandera = (x, y, color = "#dce7f7") => `<path d="M${x},${y} L${x},${y - 80}" ${trazo}/><path d="M${x},${y - 80} L${x + 44},${y - 72} L${x},${y - 56} Z" fill="${color}" ${trazo}/>`;
const rio = (x1, x2, y) => `<path d="M${x1},${y} ${Array.from({ length: Math.floor((x2 - x1) / 30) }, () => "q15,-9 30,0").join(" ")}" ${trazoAzul}/>
  <path d="M${x1 + 15},${y + 16} ${Array.from({ length: Math.floor((x2 - x1 - 30) / 30) }, () => "q15,-9 30,0").join(" ")}" ${trazoAzul} stroke-width="3"/>`;
const barco = (x, y) => `<path d="M${x},${y} L${x + 120},${y} L${x + 100},${y + 26} L${x + 14},${y + 26} Z" fill="#fbfaf6" ${trazo}/>
  <path d="M${x + 30},${y} L${x + 30},${y - 26} L${x + 78},${y - 26} L${x + 78},${y} M${x + 52},${y - 26} L${x + 52},${y - 50}" fill="#fbfaf6" ${trazo}/>
  <path d="M${x + 58},${y - 58} q12,-8 6,-20 q14,-6 8,-18" ${trazo} stroke-width="3"/>`;
const nota = (n) => `<circle cx="574" cy="${HILO_Y - 120}" r="21" ${trazo}/>`;
const notaNum = (n) => `<text x="574" y="${HILO_Y - 110}" text-anchor="middle" font-family="Playfair Display" font-weight="900" font-size="27" fill="${M}">${n}</text>`;

// mapas a partir de Natural Earth (world-atlas)
const wa = require("world-atlas/countries-50m.json");
const colombia = topo.feature(wa, wa.objects.countries).features.find((f) => String(f.id).padStart(3, "0") === "170");
const mapa = (id, caja, colorTrap = C.azul) => {
  const pj = d3.geoMercator().fitExtent(caja, colombia);
  const d = d3.geoPath(pj)(colombia), [, yT] = pj([-70, -2.2]), p = pj([-69.94, -4.21]);
  return { punta: p, svg: `<path d="${d}" ${trazo} stroke-width="3.5"/><clipPath id="${id}"><rect x="0" y="${yT}" width="${W}" height="400"/></clipPath>
    <path d="${d}" fill="${colorTrap}" opacity=".55" clip-path="url(#${id})"/>` };
};
// letra más grande (antes 29 px); varias frases de una columna se apilan solas para que nunca se monten
const frase = (x, y, w, ...t) => `<div style="position:absolute;left:${x}px;top:${y - SUBE}px;width:${w}px;color:${M};font:400 33px/1.12 'Patrick Hand',cursive">${t.map((p) => `<p style="margin-bottom:10px">${p}</p>`).join("")}</div>`;
const sup = (n) => `<sup style="font:700 .6em 'Playfair Display';color:${C.rojoClaro};margin-left:3px">${n}</sup>`;

const m1 = mapa("trap1", [[390, 470], [640, 792]]);
const m2 = mapa("trap2", [[800, 482], [955, 642]]);

// ---------- las 6 láminas ----------
// nodos: puntos del hilo dentro de la lámina (además de la entrada en x=90 y la salida en x=990, a la altura HILO_Y)
const L = [
  { // 1. GANCHO
    etq: "EXPEDIENTE · AMAZONAS", tit: "¿Por qué Colombia tiene esta punta?", leo: "leo-senala", egg: "obj-egg-globo", pub: "pub-mano",
    nodos: [[540, HILO_Y - 90]],
    sketch: `${cinta("AMAZONAS")}
      ${m1.svg}
      <ellipse cx="${m1.punta[0] - 4}" cy="${m1.punta[1] - 16}" rx="34" ry="30" ${trazoAzul}/>
      ${mtx(m1.punta[0] + 40, m1.punta[1] - 4, "?", 64)}
      ${flecha(320, 600, 382, 640)}
      ${resaltado(690, 528, "TRAPECIO", 38)}${resaltado(690, 574, "AMAZÓNICO", 38)}`,
    frases: frase(40, 490, 280, "Mira el sur de Colombia en el mapa del tablero.") +
      frase(690, 602, 360, "Hay una punta delgada que baja hasta el río Amazonas. Se llama el trapecio amazónico.", "No siempre fue colombiana."),
  },
  { // 2. EL TRATADO (la muestra aprobada)
    etq: "LIMA · 1922", tit: `Un acuerdo escrito${sup(1)}`, leo: "leo-habla", egg: "obj-mapa-enrollado", pub: "pub-apuntes", n: 1,
    nodos: [[540, HILO_Y - 90]],
    sketch: `${cinta("1922 · LIMA")}
      ${persona(110, 502, 182, 540)}${persona(258, 502, 188, 540)}
      <ellipse cx="185" cy="540" rx="13" ry="9" fill="#dce7f7" stroke="${M}" stroke-width="4"/>
      ${mtx(56, 630, "COLOMBIA", 22, C.azul)}${mtx(232, 630, "PERÚ", 22, C.azul)}
      ${flecha(312, 540, 372, 540)}
      ${doc(388, 482)}${firma(402, 582)}
      ${resaltado(492, 532, "TRATADO", 40)}
      ${mtx(494, 574, "= acuerdo escrito", 26, C.azul)}
      ${flecha(706, 540, 784, 540)}
      ${m2.svg}
      <ellipse cx="${m2.punta[0] - 3}" cy="${m2.punta[1] - 12}" rx="26" ry="22" ${trazoAzul}/>
      ${mtx(m2.punta[0] + 30, m2.punta[1] - 6, "la punta", 24, C.azul)}`,
    frases: frase(40, 646, 300, "En 1922, Colombia y Perú firmaron un tratado en Lima.") +
      frase(386, 612, 330, "Un tratado es un acuerdo escrito entre países. Allí dijeron por dónde pasaba la frontera.") +
      frase(770, 660, 290, "Perú le dejó a Colombia la punta que llega al Amazonas."),
  },
  { // 3. LA ENTREGA
    etq: "LETICIA · 1930", tit: `Leticia pasa a Colombia${sup(2)}`, leo: "leo-documento", egg: "obj-egg-telegrama", pub: "pub-cuaderno", n: 2,
    nodos: [[540, HILO_Y - 90]],
    sketch: `${cinta("1925 → 1930")}
      ${doc(56, 482)}${check(76, 560)}${doc(196, 482)}${check(216, 560)}
      ${mtx(64, 630, "1925", 26, C.azul)}${mtx(204, 630, "1927", 26, C.azul)}
      ${flecha(312, 540, 382, 540)}
      ${resaltado(404, 532, "APROBAR", 40)}
      ${mtx(406, 574, "= decir que sí", 26, C.azul)}
      ${flecha(706, 540, 784, 540)}
      ${casa(806, 590)}${casa(862, 590, 40)}${bandera(930, 590)}
      ${rio(796, 1036, 612)}
      ${mtx(806, 508, "LETICIA", 24)}`,
    frases: frase(404, 600, 330, "Los dos países tardaron en aprobar el tratado. Colombia lo aprobó en 1925 y Perú en 1927.") +
      frase(770, 650, 280, "El 31 de julio de 1930, Perú entregó Leticia, un pueblo a orillas del Amazonas."),
  },
  { // 4. EL CONFLICTO
    etq: "AMAZONAS · 1932", tit: `Una guerra en la selva${sup(3)}`, leo: "leo-gancho-manos-cabeza", egg: "obj-egg-radio", pub: "pub-rasca", n: 3,
    nodos: [[540, HILO_Y - 90]],
    sketch: `${cinta("1932 – 1933")}
      ${casa(56, 590, 60)}${bandera(140, 590)}
      ${personita(200, 532)}${personita(236, 528)}${personita(272, 534)}
      ${mtx(288, 560, "!", 56)}
      ${flecha(338, 548, 390, 548)}
      ${resaltado(404, 528, "GUERRA", 40)}
      ${barco(560, 600)}${rio(410, 700, 634)}
      ${flecha(706, 540, 784, 540)}
      <path d="M930,520 A54,54 0 1 1 876,574" ${trazoAzul}/><path d="M862,560 L876,576 L894,564" ${trazoAzul}/>
      ${casa(896, 600, 56)}${check(960, 512, 0.8)}`,
    frases: frase(40, 618, 290, "En 1932, un grupo de peruanos armados se tomó Leticia.") +
      frase(404, 662, 330, "Muchos en Perú no aceptaban el tratado. Colombia mandó barcos y soldados por los ríos.") +
      frase(770, 650, 290, "Hubo combates hasta 1933. Al final, Leticia volvió a Colombia."),
  },
  { // 5. LA PREGUNTA
    etq: "LA PREGUNTA QUE QUEDA", tit: "¿Quién decide dónde termina un país?", leo: "leo-piensa", egg: "obj-egg-libros", pub: "pub-inclina",
    nodos: [[540, HILO_Y - 90]],
    sketch: `${cinta("LA FRONTERA")}
      <path d="M50,540 L320,540" ${trazo} stroke-dasharray="16 12"/>
      ${[70, 160, 250].map((x) => `<path d="M${x},560 L${x},526 L${x + 10},518 L${x + 20},526 L${x + 20},560 Z" fill="#fbfaf6" ${trazo} stroke-width="3.5"/>`).join("")}
      ${flecha(330, 540, 384, 540)}
      ${persona(420, 492, 452, 530)}${persona(484, 492, 452, 530)}
      ${mtx(412, 618, "acuerdos", 22, C.azul)}
      <path d="M560,500 L600,560 M600,500 L560,560" ${trazo} stroke-width="6"/>
      ${mtx(552, 618, "peleas", 22, C.azul)}
      ${personita(650, 506)}${personita(680, 500)}${personita(710, 506)}
      ${resaltado(636, 618, "personas", 26)}
      ${flecha(736, 540, 784, 540)}
      <path d="M816,560 L846,520 L876,560 Z" fill="#fbfaf6" ${trazo}/>
      ${personita(906, 506)}${personita(940, 512)}
      ${rio(800, 1036, 600)}
      ${mtx(980, 560, "?", 52)}`,
    frases: frase(40, 600, 290, "Una frontera parece una línea quieta.") +
      frase(404, 650, 340, "Pero detrás hay acuerdos, peleas y personas.") +
      frase(770, 640, 290, "Los pueblos indígenas del Amazonas vivían en este río mucho antes de cualquier tratado."),
  },
  { // 6. FUENTES
    etq: "CADA DATO CON SU FUENTE", tit: "Notas", leo: "leo-saluda", egg: "obj-egg-maleta", pub: "pub-aplaude",
    nodos: [[700, HILO_Y + 10]],
    sketch: `${cinta("FUENTES")}`,
    frases: frase(40, 490, 300, "Cada número tiene aquí su fuente. Puedes revisarla tú mismo.") +
      `<div style="position:absolute;left:40px;top:604px;color:${M}"><div style="font:900 36px 'Playfair Display'">Profe Leo</div>
        <div style="font:22px 'Special Elite';color:${C.gris}">@leoelpasado</div></div>
      <div style="position:absolute;left:380px;top:430px;width:670px;background:#fdfcf8;padding:22px 24px 16px;box-shadow:0 5px 9px rgba(0,0,0,.22);color:${C.texto};transform:rotate(-.6deg)">
        <ol style="padding-left:28px;font:20px/1.3 'Special Elite'">
          <li style="margin-bottom:9px">«Tratado de límites y navegación fluvial entre Colombia y Perú», Lima, [día] de [marzo o julio] de 1922, en [colección], [vol.], [p.].</li>
          <li style="margin-bottom:9px">[Nombre Apellido], <i>[Título del libro]</i> ([Ciudad]: [Editorial], [año]), [p.].</li>
          <li style="margin-bottom:9px">[Nombre Apellido], «[Título del artículo]», <i>[Revista]</i> [vol.], n.º [n] ([año]): [p.].</li>
          <li>Natural Earth, «Admin 0. Countries», escala 1:50m, consultado el 19 de noviembre de 2026.</li></ol>
        <div style="font:15px 'Special Elite';color:${C.gris};margin-top:6px">Estilo Chicago, forma de nota. Bibliografía completa en la descripción.</div></div>`,
  },
];

// ---------- hilo: entra y sale de cada lámina a la misma altura ----------
const puntos = [];
L.forEach((l, k) => {
  if (k > 0) puntos.push([k * W + 90, HILO_Y]);
  l.nodos.forEach(([x, y]) => puntos.push([k * W + x, y]));
  if (k < N - 1) puntos.push([k * W + 990, HILO_Y]);
});
const tramo = ([x1, y1], [x2, y2]) => `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + Math.min(26, Math.abs(x2 - x1) * 0.05)} ${x2},${y2}`;
const hilo = puntos.slice(1).map((p, i) => tramo(puntos[i], p)).join(" ");
const iman = ([x, y]) => `<ellipse cx="${x + 4}" cy="${y + 8}" rx="14" ry="10" fill="#000" opacity=".25" filter="url(#b)"/><circle cx="${x}" cy="${y}" r="14" fill="url(#iman)"/><circle cx="${x - 5}" cy="${y - 5}" r="4" fill="#fff" opacity=".5"/>`;

// ---------- Profe Leo con sombra en tres capas; la luz viene de la izquierda (láminas 1-3) o de la derecha (4-6) ----------
const leo = (pose, k) => {
  const alto = REG[`v2/${pose}`][1] * 2, cx = 225, pies = 1262, izq = k < 3;
  return `<div style="position:absolute;left:${cx - 190}px;top:${pies - 30}px;width:380px;height:60px;border-radius:50%;background:radial-gradient(closest-side, rgba(40,32,38,.22), transparent);mix-blend-mode:multiply"></div>
  <img src="${spr(pose)}" style="position:absolute;left:${cx}px;top:${pies - alto}px;height:${alto}px;transform:translateX(-50%) scaleY(.2) skewX(${izq ? -52 : 52}deg);transform-origin:50% 100%;filter:brightness(0) blur(5px);opacity:.20;mix-blend-mode:multiply;image-rendering:pixelated">
  <div style="position:absolute;left:${cx - 105}px;top:${pies - 12}px;width:210px;height:22px;border-radius:50%;background:radial-gradient(closest-side, rgba(25,18,22,.55), rgba(25,18,22,.15) 70%, transparent);filter:blur(1.5px);mix-blend-mode:multiply"></div>
  <img src="${spr(pose)}" style="position:absolute;left:${cx}px;top:${pies}px;height:${alto}px;transform:translateX(-50%) scaleY(-1);transform-origin:top;image-rendering:pixelated;opacity:.08;-webkit-mask-image:linear-gradient(to bottom, #000, transparent 25%)">
  <img src="${spr(pose)}" style="position:absolute;left:${cx}px;top:${pies - alto}px;height:${alto}px;transform:translateX(-50%);image-rendering:pixelated">
  <div style="position:absolute;left:${cx - 160}px;top:${pies - alto}px;width:320px;height:${alto}px;background:linear-gradient(${izq ? 90 : 270}deg, rgba(255,236,200,.10), transparent 60%);mix-blend-mode:soft-light;
    -webkit-mask-image:url('${spr(pose)}');-webkit-mask-size:auto 100%;-webkit-mask-position:center;-webkit-mask-repeat:no-repeat"></div>`;
};
const pub = (n, cx, top) => `<img src="${spr(n)}" style="position:absolute;left:${cx}px;top:${top}px;height:${REG[`v2/${n}`][1] * 1.4}px;transform:translateX(-50%);image-rendering:pixelated;filter:brightness(.72) saturate(.85) drop-shadow(0 -6px 14px rgba(0,0,0,.25))">`;
// formato «Una clase»: los mismos estudiantes, en el mismo puesto, en todas las láminas (es la misma clase de principio a fin)
const CLASE = [["pub-rizos", 70, 1150], ["pub-cola", 590, 1125], ["pub-gorra", 1010, 1160]];
// el hilo rojo queda apagado en este formato (prueba del 19/11/2026); se puede volver a encender
const CON_HILO = false;

const ventana = (izq, fuerza) => `<div class="capa" style="background:repeating-linear-gradient(${izq ? 118 : 62}deg, rgba(255,240,205,0) 0 70px, rgba(255,240,205,${fuerza}) 70px 150px, rgba(255,240,205,0) 150px 260px);
  -webkit-mask-image:linear-gradient(${izq ? 90 : 270}deg, #000 0%, rgba(0,0,0,.6) 40%, transparent 75%)"></div>
  <svg class="capa" width="${W}" height="${H}">${Array.from({ length: 34 }, (_, i) => {
    const x = (i * 97) % 520, y = 120 + ((i * 211) % 820); return `<rect x="${izq ? x : W - x}" y="${y}" width="${i % 3 ? 3 : 4}" height="${i % 3 ? 3 : 4}" fill="#fff6dc" opacity="${0.25 + (i % 4) * 0.08}"/>`; }).join("")}</svg>`;

const lamina = (l, k) => `<div style="position:absolute;left:${k * W}px;top:0;width:${W}px;height:${H}px">
  <div class="capa" style="background:radial-gradient(ellipse 260px 60px at 540px 322px, rgba(150,180,230,.20), transparent 75%)"></div>
  <div style="position:absolute;left:292px;top:36px;width:496px;height:260px;display:flex;flex-direction:column;justify-content:center;padding:0 30px">
    <div style="font:17px 'Special Elite';color:${C.rojoClaro};letter-spacing:3px">${l.etq}</div>
    <div style="font:900 ${l.tit.length > 30 ? 40 : 50}px 'Playfair Display';line-height:1.04;color:${C.hueso};margin-top:6px">${l.tit}</div></div>
  <svg class="capa" width="${W}" height="${H}"><g filter="url(#mano)"><g transform="translate(0,-${SUBE})">${l.sketch}</g>${l.n ? nota(l.n) : ""}</g>${l.n ? notaNum(l.n) : ""}</svg>
  ${l.frases}
  ${l.carrete ? `<img src="${spr("obj-hilo")}" style="position:absolute;left:640px;top:${TAB.abajo - 62}px;height:78px;image-rendering:pixelated;filter:drop-shadow(3px 4px 2px rgba(0,0,0,.3))">` : ""}
  <img src="${spr(l.egg)}" style="position:absolute;left:880px;top:${PISO - 92}px;height:120px;transform:rotate(${k < 3 ? -8 : 8}deg);image-rendering:pixelated;filter:drop-shadow(${k < 3 ? 6 : -6}px 6px 4px rgba(0,0,0,.25))">
</div>`;

const capasPost = (l, k) => `<div style="position:absolute;left:${k * W}px;top:0;width:${W}px;height:${H}px">
  ${k === 0 ? ventana(true, 0.12) : ""}${k === N - 1 ? ventana(false, 0.12) : ""}
  <div class="capa" style="background:radial-gradient(ellipse 80% 55% at 50% 45%, rgba(255,246,225,.16), transparent 70%),
    linear-gradient(to bottom, rgba(20,18,24,.18), transparent 18%, transparent 78%, rgba(20,18,24,.28))"></div>
  ${leo(l.leo, k)}
  ${CLASE.map(([n, cx, top]) => pub(n, cx, top)).join("")}
</div>`;

const pagina = (guias) => `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Permanent+Marker&family=Patrick+Hand&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${ANCHO}px;height:${H}px;overflow:hidden;position:relative;background:#000}
canvas{position:absolute;left:0;top:0;width:${ANCHO}px;height:${Math.ceil(H / PX) * PX}px;image-rendering:pixelated}
.capa{position:absolute;inset:0;pointer-events:none}</style></head><body>
<canvas id="aula"></canvas><script>${dibujo}</script>
<svg width="0" height="0" style="position:absolute"><defs>
  <filter id="mano"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="9" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="3"/></filter>
  <filter id="b"><feGaussianBlur stdDeviation="3"/></filter>
  <radialGradient id="iman" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ff6b74"/><stop offset=".55" stop-color="${C.rojo}"/><stop offset="1" stop-color="#5e070e"/></radialGradient></defs></svg>
${L.map(lamina).join("")}
${CON_HILO ? `<svg style="position:absolute;left:0;top:0" width="${ANCHO}" height="${H}">
  <path d="${hilo}" stroke="#000" stroke-opacity=".22" stroke-width="6" fill="none" transform="translate(4,8)" filter="url(#b)"/>
  <path d="${hilo}" stroke="${C.rojoOsc}" stroke-width="6" fill="none"/><path d="${hilo}" stroke="${C.rojo}" stroke-width="3.5" fill="none"/>
  <path d="${hilo}" stroke="#ff7a82" stroke-width="1.3" stroke-dasharray="2 5" fill="none"/>
  ${L.flatMap((l, k) => l.nodos.map(([x, y]) => iman([k * W + x, y]))).join("")}
</svg>` : ""}
${L.map(capasPost).join("")}
${guias ? [1, 2, 3, 4, 5].map((k) => `<div style="position:absolute;left:${k * W - 1}px;top:0;width:2px;height:${H}px;background:rgba(0,120,255,.8)"></div>`).join("") : ""}
${[...Array(N)].map((_, k) => `<div style="position:absolute;left:${k * W + W - 190}px;top:8px;font:16px 'Special Elite';color:#8a857a">BOCETO · ${k + 1}/${N}</div>`).join("")}
</body></html>`;

const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((p) => fs.existsSync(p));
for (const [guias, nombre] of [[true, "panorama-con-guias.png"], [false, "panorama.png"]]) {
  const f = path.join(OUT, guias ? "guias.html" : "final.html");
  fs.writeFileSync(f, pagina(guias));
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--virtual-time-budget=12000",
    `--window-size=${ANCHO},${H}`, `--screenshot=${path.join(OUT, nombre)}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
}
execFileSync("python", ["-c", `
from PIL import Image
p=Image.open(r'${path.join(OUT, "panorama.png")}').convert('RGB')
for k in range(${N}): p.crop((k*${W},0,(k+1)*${W},${H})).save(r'${OUT}'+f'/lamina-{k+1}.png')
g=Image.open(r'${path.join(OUT, "panorama-con-guias.png")}'); g.resize((g.width//4,g.height//4)).save(r'${OUT}/vista-guias.png')
# hoja de contacto 3 x 2 para aprobar
S=Image.new('RGB',(3*${W}+40,2*${H}+20),(30,30,30))
for k in range(${N}): S.paste(p.crop((k*${W},0,(k+1)*${W},${H})),((k%3)*(${W}+20),(k//3)*(${H}+20)))
S.resize((S.width//2,S.height//2)).save(r'${OUT}/contacto.png')`]);
console.log("listo:", OUT);
