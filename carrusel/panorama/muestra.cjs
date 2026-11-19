// MUESTRA de UNA lámina (la 2) para aprobar la escena antes de producir el carrusel completo.
// Pared al fondo con degradado de luz, televisor colgado del techo con brillo, tablero blanco de altura normal,
// Profe Leo al frente hablándole al público (con reflejo suave en la baldosa), público en pixel art en primer plano,
// un objeto del tema junto a la pared (easter egg), enchufe y el carrete de hilo rojo en la bandeja.
// Luz de ventana: en la lámina 1 entra por la izquierda y en la última por la derecha; en esta muestra (2) entra suave por la izquierda.
// Uso: node carrusel/panorama/muestra.cjs   → out/muestra/lamina.png
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const RAIZ = path.resolve(__dirname, "..", "..");
const OUT = path.join(RAIZ, "out", "muestra");
fs.mkdirSync(OUT, { recursive: true });
const url = (p) => "file:///" + path.join(RAIZ, p).replace(/\\/g, "/");
const W = 1080, H = 1350, PX = 4;
const TAB = { arriba: 320, abajo: 800 }; // tablero de altura normal, un poco más abajo
const PISO = 960;
const HILO_Y = 460; // altura a la que el hilo cruza las costuras en todo el carrusel
const C = { texto: "#1b1612", rojo: "#c1121f", rojoOsc: "#7d0a13", rojoClaro: "#ff4d57", hueso: "#f4ead5", marcador: "#1d1d1f", azul: "#2456a6" };

// ---------- salón (pixel art a 1/4) ----------
const dibujo = `
const LW=${W / PX}, LH=${Math.ceil(H / PX)};
const cv=document.getElementById('aula'); cv.width=LW; cv.height=LH; const g=cv.getContext('2d');
let s=31; const rnd=()=>((s=(s*16807)%2147483647)/2147483647);
const bayer=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const banda=(y0,y1,c0,c1)=>{for(let y=y0;y<y1;y++){const t=(y-y0)/(y1-y0);for(let x=0;x<LW;x++){g.fillStyle=((t*15)>bayer[y%4][x%4])?c1:c0;g.fillRect(x,y,1,1);}}};
const P=${PISO / PX};
banda(0,60,'#cfcdc5','#d9d7cf'); banda(60,P,'#d9d7cf','#e4e2da');
g.fillStyle='#b4afa3'; g.fillRect(0,P-3,LW,3); g.fillStyle='#958f82'; g.fillRect(0,P-1,LW,1);
// televisor colgado del techo
{const x0=46, y0=10, w=178, h=52;
  for(let i=1;i<=6;i++){g.fillStyle='rgba(20,20,25,.05)'; g.fillRect(x0+2+i,y0+3+i,w,h);}
  for(const bx of [x0+44,x0+w-46]){g.fillStyle='#55565c'; g.fillRect(bx,0,2,y0); g.fillStyle='rgba(20,20,25,.12)'; g.fillRect(bx+3,0,2,y0+2);}
  g.fillStyle='#4a4b52'; g.fillRect(x0,y0,w,h); g.fillStyle='#1c1c21'; g.fillRect(x0+1,y0+1,w-2,h-2);
  g.fillStyle='#0b0c0f'; g.fillRect(x0+3,y0+3,w-6,h-8);
  g.fillStyle='rgba(255,255,255,.035)'; for(let i=0;i<30;i++){g.fillRect(x0+110+i,y0+3,1,Math.min(h-8,i*2+3));}
  g.fillStyle='#c9cbd0'; g.fillRect(x0+w/2-5,y0+h-4,10,1); g.fillStyle='#e0303a'; g.fillRect(x0+w-8,y0+h-4,2,1);}
// tablero blanco
const T0=${TAB.arriba / PX}, T1=${TAB.abajo / PX};
for(let i=1;i<=4;i++){g.fillStyle='rgba(20,20,25,.04)'; g.fillRect(2+i,T0-2+i,LW-4,T1-T0+6);}
g.fillStyle='#b8bdc2'; g.fillRect(0,T0-3,LW,T1-T0+6); g.fillStyle='#d9dde0'; g.fillRect(0,T0-3,LW,1);
g.fillStyle='#f5f6f3'; g.fillRect(0,T0,LW,T1-T0);
for(let i=0;i<14;i++){const cx=rnd()*LW, cy=T0+6+rnd()*(T1-T0-12); g.fillStyle='rgba(120,125,130,.035)'; g.beginPath(); g.ellipse(cx,cy,10+rnd()*20,3+rnd()*5,0,0,7); g.fill();}
for(let x=20;x<LW;x+=110){g.fillStyle='rgba(255,255,255,.6)'; for(let i=0;i<26;i++){g.fillRect(x+i,T0+2+i,2,1);}}
g.fillStyle='#a3a8ad'; g.fillRect(0,T1+3,LW,3); g.fillStyle='#868b90'; g.fillRect(0,T1+6,LW,1);
g.fillStyle='#ececec'; g.fillRect(60,T1+1,9,2); g.fillStyle='#1d1d1f'; g.fillRect(69,T1+1,3,2);
g.fillStyle='#ececec'; g.fillRect(150,T1+1,9,2); g.fillStyle='#c1121f'; g.fillRect(159,T1+1,3,2);
g.fillStyle='#2d2f36'; g.fillRect(118,T1,11,3);
// piso de baldosa con profundidad
let y=P, alto=5, fila=0;
while(y<LH){for(let yy=y;yy<Math.min(LH,y+alto);yy++){const off=(yy-P)*0.55;
  for(let x=0;x<LW;x++){const ancho=22+fila*3; const junta=((x+off+fila*7)%ancho<1)||yy===y;
    const tono=(((x+off+fila*7)/ancho|0)+fila)%2?'#e2dfd7':'#d3cfc5'; g.fillStyle=junta?'#a6a194':tono; g.fillRect(x,yy,1,1);}}
  y+=alto; alto=Math.round(alto*1.35)+1; fila++;}
g.fillStyle='rgba(0,0,0,.10)'; g.fillRect(0,P,LW,3);
`;

// ---------- público en pixel art (de espaldas, en primer plano) ----------
const publico_viejo = `
{const a=document.getElementById('aula'), b=document.getElementById('publico'); b.width=a.width; b.height=a.height;
 const q=b.getContext('2d'); const LH=a.height;
 const px=(x,y,w,h,c)=>{q.fillStyle=c; q.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const disco=(cx,cy,rx,ry,c)=>{for(let yy=-Math.round(ry);yy<=Math.round(ry);yy++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(yy/ry)**2))); px(cx-w,cy+yy,w*2,1,c);}};
 // alumno de espaldas: hombros con camiseta, cuello, orejas, cabeza y peinado; borde de luz arriba
 const alumno=(cx,base,r,piel,ropa,pelo,peinado)=>{
   disco(cx,base+r*1.6,r*2.4,r*1.5,ropa); px(cx-r*2.4,base+r*1.6,r*4.8,r*3,ropa);
   px(cx-r*0.45,base-r*0.2,r*0.9,r*1.2,piel);
   disco(cx-r*0.95,base-r*1.1,r*0.22,r*0.32,piel); disco(cx+r*0.95,base-r*1.1,r*0.22,r*0.32,piel);
   disco(cx,base-r*1.2,r*0.92,r*1.05,pelo);
   if(peinado==='rizos'){for(let i=0;i<9;i++){disco(cx-r*0.9+i*r*0.22,base-r*2.1+((i%2)?2:0),r*0.28,r*0.26,pelo);}}
   if(peinado==='cola'){disco(cx,base-r*0.15,r*0.22,r*0.5,pelo); px(cx-r*0.3,base-r*0.55,r*0.6,r*0.12,'#c1121f');}
   if(peinado==='gorra'){disco(cx,base-r*1.55,r*0.98,r*0.75,'#2e4a6b'); px(cx-r*0.55,base-r*0.95,r*1.1,r*0.25,'#24394f'); px(cx-r*0.2,base-r*0.85,r*0.4,r*0.16,'#c9b48a');}
   px(cx-r*0.6,base-r*2.2,r*1.0,1,'rgba(255,238,205,.55)');
   px(cx+r*1.1,base+r*0.4,r*1.1,1,'rgba(255,238,205,.30)');};
 alumno(20,LH-14,15,'#a5764f','#3b3f52','#1f1712','rizos');
 alumno(168,LH-6,19,'#c8946a','#5a3e45','#2a1c16','cola');
 alumno(255,LH-12,14,'#8d5f3f','#2f4a3e','#120e0c','gorra');}
`;

// ---------- marcador, hilo e imanes ----------
const sup = (n) => `<sup style="font:700 .6em 'Playfair Display';color:${C.rojoClaro};margin-left:3px">${n}</sup>`;
const mtx = (x, y, t, tam, color = C.marcador) => `<text x="${x}" y="${y}" font-family="Permanent Marker" font-size="${tam}" fill="${color}">${t}</text>`;
const pts = [[0, HILO_Y], [90, HILO_Y], [540, HILO_Y - 90], [990, HILO_Y], [1080, HILO_Y]];
const tramo = ([x1, y1], [x2, y2]) => `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + Math.min(26, Math.abs(x2 - x1) * 0.05)} ${x2},${y2}`;
const hilo = pts.slice(1).map((p, i) => tramo(pts[i], p)).join(" ");
const iman = ([x, y]) => `<ellipse cx="${x + 4}" cy="${y + 8}" rx="14" ry="10" fill="#000" opacity=".25" filter="url(#b)"/><circle cx="${x}" cy="${y}" r="14" fill="url(#iman)"/><circle cx="${x - 5}" cy="${y - 5}" r="4" fill="#fff" opacity=".5"/>`;
const SPRITE_ALTO = JSON.parse(fs.readFileSync(path.join(RAIZ, "public/personaje/sprites.json"), "utf8"))["v2/leo-habla"][1];
const LEO = { cx: 225, pies: 1262, alto: SPRITE_ALTO * 2 }; // escala entera: cada píxel del dibujo = 2 x 2 en la lámina

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Permanent+Marker&family=Patrick+Hand&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;overflow:hidden;position:relative;background:#000}
canvas{position:absolute;left:0;top:0;width:${W}px;height:${Math.ceil(H / PX) * PX}px;image-rendering:pixelated}
.capa{position:absolute;inset:0;pointer-events:none}</style></head><body>
<canvas id="aula"></canvas><script>${dibujo}</script>

<!-- brillo frío del televisor sobre la pared, justo debajo de la pantalla -->
<div class="capa" style="background:radial-gradient(ellipse 340px 70px at 540px 262px, rgba(150,180,230,.20), transparent 75%)"></div>

<!-- pantalla del televisor -->
<div style="position:absolute;left:196px;top:52px;width:688px;height:180px;display:flex;flex-direction:column;justify-content:center;padding:0 34px">
  <div style="font:20px 'Special Elite';color:${C.rojoClaro};letter-spacing:4px">LIMA · 1922</div>
  <div style="font:900 62px 'Playfair Display';line-height:1.04;color:${C.hueso};margin-top:6px">Un acuerdo escrito${sup(1)}</div></div>

<!-- marcador e hilo en el tablero -->
<svg class="capa" width="${W}" height="${H}">
  <defs><filter id="mano"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="9" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="3"/></filter>
    <filter id="b"><feGaussianBlur stdDeviation="3"/></filter>
    <radialGradient id="iman" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ff6b74"/><stop offset=".55" stop-color="${C.rojo}"/><stop offset="1" stop-color="#5e070e"/></radialGradient></defs>
  <g filter="url(#mano)">${mtx(600, 535, "1922", 90)}${mtx(606, 575, "Lima · un tratado", 30, C.azul)}
    <circle cx="574" cy="${HILO_Y - 120}" r="21" fill="none" stroke="${C.marcador}" stroke-width="4"/></g>
  <text x="574" y="${HILO_Y - 110}" text-anchor="middle" font-family="Playfair Display" font-weight="900" font-size="27" fill="${C.marcador}">1</text>
  <path d="${hilo}" stroke="#000" stroke-opacity=".22" stroke-width="6" fill="none" transform="translate(4,8)" filter="url(#b)"/>
  <path d="${hilo}" stroke="${C.rojoOsc}" stroke-width="6" fill="none"/><path d="${hilo}" stroke="${C.rojo}" stroke-width="3.5" fill="none"/>
  <path d="${hilo}" stroke="#ff7a82" stroke-width="1.3" stroke-dasharray="2 5" fill="none"/>
  ${pts.slice(1, 4).map(iman).join("")}
</svg>
<div style="position:absolute;left:395px;top:596px;width:655px;color:${C.marcador};font:400 31px/1.18 'Patrick Hand',cursive">
  En 1922, Colombia y Perú firmaron un tratado en Lima. Un tratado es un acuerdo escrito entre países. Allí dijeron por dónde pasaba la frontera. Perú le dejó a Colombia la punta que llega al Amazonas.</div>

<!-- enchufe (sprite) -->
<img src="${url("public/personaje/v2/obj-aula-enchufe.png")}" style="position:absolute;left:728px;top:${PISO - 96}px;height:64px;image-rendering:pixelated;filter:drop-shadow(2px 3px 1px rgba(0,0,0,.18))">
<!-- carrete de hilo rojo sobre la bandeja: siempre abajo, como si Profe Leo lo hubiera dejado ahí -->
<img src="${url("public/personaje/v2/obj-hilo.png")}" style="position:absolute;left:880px;top:${TAB.abajo - 62}px;height:78px;image-rendering:pixelated;filter:drop-shadow(3px 4px 2px rgba(0,0,0,.3))">

<!-- easter egg del tema (1922, un tratado): el pergamino enrollado, recostado contra la pared -->
<img src="${url("public/personaje/v2/obj-mapa-enrollado.png")}" style="position:absolute;left:880px;top:${PISO - 92}px;height:120px;transform:rotate(-14deg);image-rendering:pixelated;filter:drop-shadow(6px 6px 4px rgba(0,0,0,.25))">

<!-- luz de ventana: en esta lámina entra suave por la izquierda (en la 1 entra fuerte por la izquierda; en la última, por la derecha) -->
<div class="capa" style="background:repeating-linear-gradient(118deg, rgba(255,240,205,0) 0 70px, rgba(255,240,205,.10) 70px 150px, rgba(255,240,205,0) 150px 260px);
  -webkit-mask-image:linear-gradient(90deg, #000 0%, rgba(0,0,0,.6) 40%, transparent 75%)"></div>
<svg class="capa" width="${W}" height="${H}">${Array.from({ length: 34 }, (_, i) => {
  const x = (i * 97) % 520, y = 120 + ((i * 211) % 820); return `<rect x="${x}" y="${y}" width="${i % 3 ? 3 : 4}" height="${i % 3 ? 3 : 4}" fill="#fff6dc" opacity="${0.25 + (i % 4) * 0.08}"/>`; }).join("")}</svg>

<!-- luz general: centro más claro, bordes de arriba y abajo más oscuros -->
<div class="capa" style="background:radial-gradient(ellipse 80% 55% at 50% 45%, rgba(255,246,225,.16), transparent 70%),
  linear-gradient(to bottom, rgba(20,18,24,.18), transparent 18%, transparent 78%, rgba(20,18,24,.28))"></div>

<!-- Profe Leo al frente. Sombra en tres capas, sin bordes claros alrededor del personaje:
     1) oclusión ambiental: mancha amplia y muy suave; 2) sombra proyectada: la silueta de Leo aplastada sobre el piso
     y tirada hacia la derecha (la luz de ventana viene de la izquierda); 3) sombra de contacto: oscura y pegada a las botas.
     El sprite se muestra a escala entera (x2) para que el píxel quede nítido. -->
<div style="position:absolute;left:${LEO.cx - 190}px;top:${LEO.pies - 30}px;width:380px;height:60px;border-radius:50%;
  background:radial-gradient(closest-side, rgba(40,32,38,.22), transparent);mix-blend-mode:multiply"></div>
<img src="${url("public/personaje/v2/leo-habla.png")}" style="position:absolute;left:${LEO.cx}px;top:${LEO.pies - LEO.alto}px;height:${LEO.alto}px;
  transform:translateX(-50%) scaleY(.2) skewX(-52deg);transform-origin:50% 100%;filter:brightness(0) blur(5px);opacity:.20;mix-blend-mode:multiply;image-rendering:pixelated">
<div style="position:absolute;left:${LEO.cx - 105}px;top:${LEO.pies - 12}px;width:210px;height:22px;border-radius:50%;
  background:radial-gradient(closest-side, rgba(25,18,22,.55), rgba(25,18,22,.15) 70%, transparent);filter:blur(1.5px);mix-blend-mode:multiply"></div>
<img src="${url("public/personaje/v2/leo-habla.png")}" style="position:absolute;left:${LEO.cx}px;top:${LEO.pies}px;height:${LEO.alto}px;transform:translateX(-50%) scaleY(-1);transform-origin:top;
  image-rendering:pixelated;opacity:.08;-webkit-mask-image:linear-gradient(to bottom, #000, transparent 25%)">
<img src="${url("public/personaje/v2/leo-habla.png")}" style="position:absolute;left:${LEO.cx}px;top:${LEO.pies - LEO.alto}px;height:${LEO.alto}px;transform:translateX(-50%);image-rendering:pixelated">
<!-- luz de la escena sobre el personaje: un poco más cálido del lado de la ventana, sin contorno -->
<div style="position:absolute;left:${LEO.cx - 160}px;top:${LEO.pies - LEO.alto}px;width:320px;height:${LEO.alto}px;pointer-events:none;
  background:linear-gradient(90deg, rgba(255,236,200,.10), transparent 60%);mix-blend-mode:soft-light;
  -webkit-mask-image:url('${url("public/personaje/v2/leo-habla.png")}');-webkit-mask-size:auto 100%;-webkit-mask-position:center;-webkit-mask-repeat:no-repeat"></div>

<!-- público en primer plano: sprites v2 a escala x2, más oscuros por estar cerca de la cámara y fuera de la luz.
     En esta lámina (el tratado) una alumna toma apuntes. -->
${[["pub-rizos", 0, 1150], ["pub-apuntes", 610, 1110], ["pub-gorra", 1015, 1160]].map(([n, cx, top]) =>
  `<img src="${url(`public/personaje/v2/${n}.png`)}" style="position:absolute;left:${cx}px;top:${top}px;height:${JSON.parse(fs.readFileSync(path.join(RAIZ, "public/personaje/sprites.json"), "utf8"))[`v2/${n}`][1] * 1.4}px;
    transform:translateX(-50%);image-rendering:pixelated;filter:brightness(.72) saturate(.85) drop-shadow(0 -6px 14px rgba(0,0,0,.25))">`).join("")}
<div style="position:absolute;right:20px;top:8px;font:16px 'Special Elite';color:#8a857a">MUESTRA · 2/6</div>
</body></html>`;

const f = path.join(OUT, "muestra.html");
fs.writeFileSync(f, html);
const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((p) => fs.existsSync(p));
execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--virtual-time-budget=9000",
  `--window-size=${W},${H}`, `--screenshot=${path.join(OUT, "lamina.png")}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
execFileSync("python", ["-c", `from PIL import Image; Image.open(r'${OUT}/lamina.png').resize((720,900)).save(r'${OUT}/vista.png')`]);
console.log("listo:", OUT);
