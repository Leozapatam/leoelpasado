// MUESTRA de UNA lámina (la 2) para aprobar la escena antes de producir el carrusel completo.
// La pared se aleja (tablero y televisor más pequeños, más piso a la vista), Profe Leo pasa al frente y le habla
// al público, y en primer plano se ven las cabezas del público. Todo en pixel art; luz y sombra para integrar.
// Uso: node carrusel/panorama/muestra.cjs   → out/muestra/lamina.png
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const RAIZ = path.resolve(__dirname, "..", "..");
const OUT = path.join(RAIZ, "out", "muestra");
fs.mkdirSync(OUT, { recursive: true });
const url = (p) => "file:///" + path.join(RAIZ, p).replace(/\\/g, "/");
const W = 1080, H = 1350, PX = 4;
const TAB = { arriba: 300, abajo: 840 };
const PISO = 905;
const C = { texto: "#1b1612", rojo: "#c1121f", rojoOsc: "#7d0a13", rojoClaro: "#ff4d57", hueso: "#f4ead5", marcador: "#1d1d1f", azul: "#2456a6" };

const dibujo = `
const LW=${W / PX}, LH=${Math.ceil(H / PX)};
const cv=document.getElementById('aula'); cv.width=LW; cv.height=LH; const g=cv.getContext('2d');
let s=31; const rnd=()=>((s=(s*16807)%2147483647)/2147483647);
const bayer=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const banda=(y0,y1,c0,c1)=>{for(let y=y0;y<y1;y++){const t=(y-y0)/(y1-y0);for(let x=0;x<LW;x++){g.fillStyle=((t*15)>bayer[y%4][x%4])?c1:c0;g.fillRect(x,y,1,1);}}};
const P=${PISO / PX};
// pared al fondo: un poco más oscura arriba (la luz baja)
banda(0,60,'#cfcdc5','#d9d7cf'); banda(60,P,'#d9d7cf','#e4e2da');
g.fillStyle='#b4afa3'; g.fillRect(0,P-3,LW,3); g.fillStyle='#958f82'; g.fillRect(0,P-1,LW,1);
// televisor colgado del techo (más chico: está al fondo)
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
g.fillStyle='#2d2f36'; g.fillRect(210,T1,11,3);
// piso de baldosa con profundidad: las filas crecen hacia el frente y las juntas se inclinan
let y=P, alto=5, fila=0;
while(y<LH){for(let yy=y;yy<Math.min(LH,y+alto);yy++){const off=(yy-P)*0.55;
  for(let x=0;x<LW;x++){const ancho=22+fila*3; const junta=((x+off+fila*7)%ancho<1)||yy===y;
    const tono=(((x+off+fila*7)/ancho|0)+fila)%2?'#e2dfd7':'#d3cfc5'; g.fillStyle=junta?'#a6a194':tono; g.fillRect(x,yy,1,1);}}
  y+=alto; alto=Math.round(alto*1.35)+1; fila++;}
g.fillStyle='rgba(0,0,0,.10)'; g.fillRect(0,P,LW,3);
`;

const sup = (n) => `<sup style="font:700 .6em 'Playfair Display';color:${C.rojoClaro};margin-left:3px">${n}</sup>`;
const mtx = (x, y, t, tam, color = C.marcador) => `<text x="${x}" y="${y}" font-family="Permanent Marker" font-size="${tam}" fill="${color}">${t}</text>`;
// hilo que entra y sale a la misma altura que en el carrusel completo
const pts = [[0, 470], [90, 470], [540, 360], [990, 470], [1080, 470]];
const tramo = ([x1, y1], [x2, y2]) => `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + Math.min(26, Math.abs(x2 - x1) * 0.05)} ${x2},${y2}`;
const hilo = pts.slice(1).map((p, i) => tramo(pts[i], p)).join(" ");
const iman = ([x, y]) => `<ellipse cx="${x + 4}" cy="${y + 8}" rx="14" ry="10" fill="#000" opacity=".25" filter="url(#b)"/><circle cx="${x}" cy="${y}" r="14" fill="url(#iman)"/><circle cx="${x - 5}" cy="${y - 5}" r="4" fill="#fff" opacity=".5"/>`;

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Permanent+Marker&family=Patrick+Hand&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;overflow:hidden;position:relative;background:#000}
#aula{position:absolute;left:0;top:0;width:${W}px;height:${Math.ceil(H / PX) * PX}px;image-rendering:pixelated}</style></head><body>
<canvas id="aula"></canvas><script>${dibujo}</script>
<!-- pantalla del televisor -->
<div style="position:absolute;left:196px;top:52px;width:688px;height:180px;display:flex;flex-direction:column;justify-content:center;padding:0 34px">
  <div style="font:20px 'Special Elite';color:${C.rojoClaro};letter-spacing:4px">LIMA · 1922</div>
  <div style="font:900 62px 'Playfair Display';line-height:1.04;color:${C.hueso};margin-top:6px">Un acuerdo escrito${sup(1)}</div></div>
<!-- marcador e hilo en el tablero -->
<svg style="position:absolute;left:0;top:0" width="${W}" height="${H}">
  <defs><filter id="mano"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="9" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="3"/></filter>
    <filter id="b"><feGaussianBlur stdDeviation="3"/></filter>
    <radialGradient id="iman" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ff6b74"/><stop offset=".55" stop-color="${C.rojo}"/><stop offset="1" stop-color="#5e070e"/></radialGradient></defs>
  <g filter="url(#mano)">${mtx(600, 540, "1922", 100)}${mtx(606, 590, "Lima · un tratado", 32, C.azul)}
    <circle cx="574" cy="330" r="21" fill="none" stroke="${C.marcador}" stroke-width="4"/></g>
  <text x="574" y="340" text-anchor="middle" font-family="Playfair Display" font-weight="900" font-size="27" fill="${C.marcador}">1</text>
  <path d="${hilo}" stroke="#000" stroke-opacity=".22" stroke-width="6" fill="none" transform="translate(4,8)" filter="url(#b)"/>
  <path d="${hilo}" stroke="${C.rojoOsc}" stroke-width="6" fill="none"/><path d="${hilo}" stroke="${C.rojo}" stroke-width="3.5" fill="none"/>
  <path d="${hilo}" stroke="#ff7a82" stroke-width="1.3" stroke-dasharray="2 5" fill="none"/>
  ${pts.slice(1, 4).map(iman).join("")}
</svg>
<div style="position:absolute;left:400px;top:615px;width:630px;color:${C.marcador};font:400 34px/1.2 'Patrick Hand',cursive">
  En 1922, Colombia y Perú firmaron un tratado en Lima. Un tratado es un acuerdo escrito entre países. Allí dijeron por dónde pasaba la frontera. Perú le dejó a Colombia la punta que llega al Amazonas.</div>
<!-- luz: más clara en el centro del salón, más oscura en los bordes de arriba y abajo -->
<div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 50% 45%, rgba(255,246,225,.16), transparent 70%),
  linear-gradient(to bottom, rgba(20,18,24,.18), transparent 18%, transparent 78%, rgba(20,18,24,.28))"></div>
<!-- Profe Leo al frente, hablándole al público: sombra larga en el piso y borde de luz -->
<div style="position:absolute;left:70px;top:1236px;width:330px;height:50px;border-radius:50%;background:rgba(10,8,12,.35);filter:blur(3px)"></div>
<img src="${url("public/personaje/v2/leo-habla.png")}" style="position:absolute;left:225px;top:${1262 - 540}px;height:540px;transform:translateX(-50%);image-rendering:pixelated;
  filter:drop-shadow(-3px -2px 0 rgba(255,244,214,.55)) drop-shadow(8px 14px 10px rgba(0,0,0,.25))">
<!-- público: se redibuja encima de Profe Leo para que quede en primer plano -->
<canvas id="publico" style="position:absolute;left:0;top:0;width:${W}px;height:${Math.ceil(H / PX) * PX}px;image-rendering:pixelated"></canvas>
<script>{const a=document.getElementById('aula'), b=document.getElementById('publico'); b.width=a.width; b.height=a.height;
  const q=b.getContext('2d'); const LH=a.height; const LW=a.width;
  const persona=(cx,base,esc,pelo)=>{const r=13*esc;
    q.fillStyle='#17141a'; q.beginPath(); q.ellipse(cx,base,r*2.1,r*1.2,0,Math.PI,0); q.fill(); q.fillRect(cx-r*2.1,base,r*4.2,40);
    q.beginPath(); q.ellipse(cx,base-r*1.5,r,r*1.15,0,0,7); q.fill();
    q.fillStyle=pelo; q.beginPath(); q.ellipse(cx,base-r*2.0,r*1.02,r*0.7,0,Math.PI,0); q.fill();
    q.fillStyle='rgba(255,236,200,.35)'; q.fillRect((cx-r*0.9)|0,(base-r*2.4)|0,(r*0.8)|0,1);};
  persona(30,LH-4,1.3,'#2a2026'); persona(170,LH+10,1.6,'#1f1b20'); persona(246,LH-2,1.15,'#3a2a22');}</script>
<div style="position:absolute;right:20px;top:8px;font:16px 'Special Elite';color:#8a857a">MUESTRA · 2/6</div>
</body></html>`;

const f = path.join(OUT, "muestra.html");
fs.writeFileSync(f, html);
const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((p) => fs.existsSync(p));
execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--virtual-time-budget=9000",
  `--window-size=${W},${H}`, `--screenshot=${path.join(OUT, "lamina.png")}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
execFileSync("python", ["-c", `from PIL import Image; Image.open(r'${OUT}/lamina.png').resize((720,900)).save(r'${OUT}/vista.png')`]);
console.log("listo:", OUT);
