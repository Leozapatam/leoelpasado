// PILOTO · Formato «Una clase» · tema: ¿Por qué Colombia marcha el 19 de noviembre? (2026)
// Lámina 1: la cámara pegada al televisor; en la pantalla, una imagen épica en pixel art (multitud ante el Capitolio).
// Láminas 2-6: la cámara se aleja a la escena acercada de una-clase.cjs y la MISMA imagen sigue en el televisor.
// Textos de BOCETO (Leo los reescribe con su voz). Datos con fuente en la lámina 6; lo marcado [PENDIENTE] falta verificar.
// Uso: node carrusel/panorama/marcha.cjs   → out/marcha/lamina-1.png … lamina-6.png, contacto.png
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const K = require("./carrusel.cjs");
const { W, H, N, PX, C, REG, spr, dibujo, leo, CLASE, trazo, trazoAzul, mtx, cinta, flecha, resaltado, personita, SUBE } = K;

const OUT = path.join(K.RAIZ, "out", "marcha");
fs.mkdirSync(OUT, { recursive: true });
const M = C.marcador;
const Z = 1.15, DY = 45, LEO_DX = 70;
const zx = (x) => 540 + (x - 540) * Z;

// ---------- imagen épica para la pantalla (pixel art 160 x 84, se amplía sin suavizar) ----------
const epica = `
(()=>{const cv=document.getElementById('epica'); const w=160,h=84; cv.width=w; cv.height=h; const g=cv.getContext('2d');
let s=7; const r=()=>((s=(s*16807)%2147483647)/2147483647);
const B=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const px=(x,y,c)=>{g.fillStyle=c; g.fillRect(x|0,y|0,1,1);};
const rect=(x,y,a,b,c)=>{g.fillStyle=c; g.fillRect(x|0,y|0,a|0,b|0);};
// cielo de amanecer con tramado: violeta arriba, naranja en el horizonte
const cielo=['#1d1838','#2c2150','#4a2c62','#7a3a63','#b44f55','#e0743f','#f3a04a'];
for(let y=0;y<56;y++){const t=y/56*(cielo.length-1), i=Math.floor(t), f=(t-i)*16;
  for(let x=0;x<w;x++) px(x,y,(f>B[y%4][x%4])?cielo[Math.min(i+1,cielo.length-1)]:cielo[i]);}
// sol detrás del Capitolio y nubes largas
for(let y=0;y<56;y++)for(let x=0;x<w;x++){const d=Math.hypot(x-80,(y-44)*1.4); if(d<30&&(30-d)>B[y%4][x%4]*1.8) px(x,y,d<9?'#ffe2a0':'#f8b45c');}
for(const [cx,cy,l] of [[30,14,34],[118,10,40],[64,22,26],[140,26,22]]){rect(cx-l/2,cy,l,1,'#c86a6a'); rect(cx-l/2+4,cy+1,l-8,1,'#8e4a68');}
// montañas de Bogotá al fondo
for(let x=0;x<w;x++){const m=46-Math.round(6*Math.sin(x/17)+4*Math.sin(x/7+1)); for(let y=m;y<60;y++) px(x,y,(y-m)>2?'#3b2a4e':'#5a3a5c');}
// Capitolio: base, columnata, cornisa y banderas
const X0=30, X1=130, TOP=40, BASE=60;
rect(X0,TOP,X1-X0,BASE-TOP,'#cdbfa6'); rect(X0,TOP,X1-X0,2,'#e8dcc4'); rect(X0-2,TOP-2,X1-X0+4,2,'#b3a48a');
rect(X0+18,TOP-4,X1-X0-36,2,'#cdbfa6'); rect(X0+18,TOP-5,X1-X0-36,1,'#e8dcc4');
for(let x=X0+4;x<X1-3;x+=6){rect(x,TOP+4,3,BASE-TOP-8,'#efe5cf'); rect(x+2,TOP+4,1,BASE-TOP-8,'#b9aa8e'); rect(x+3,TOP+4,3,BASE-TOP-8,'#6e5d52');}
rect(X0,BASE-4,X1-X0,4,'#a8987c'); rect(X0-6,BASE,X1-X0+12,2,'#8e7f68');
// luz del sol que roza la fachada (borde cálido)
for(let x=X0;x<X1;x++) if((x+TOP)%2) px(x,TOP+2,'#ffd79a');
const bandera=(x,y)=>{rect(x,y,1,12,'#3a3036'); rect(x+1,y,7,2,'#f2c230'); rect(x+1,y+2,7,1,'#2456a6'); rect(x+1,y+3,7,1,'#c1121f');};
bandera(X0+20,TOP-17); bandera(X1-28,TOP-17); bandera(79,TOP-19);
// plaza de piedra
for(let y=62;y<h;y++)for(let x=0;x<w;x++) px(x,y,((x+(y>>1))%9===0||y%5===0)?'#5b4c4e':'#6e5c58');
// palomas de la Plaza de Bolívar (huevo de pascua)
for(const [x,y] of [[12,30],[17,27],[146,36],[151,33],[103,18]]){px(x,y,'#2a2030'); px(x-1,y-1,'#2a2030'); px(x+1,y-1,'#2a2030');}
// multitud: filas de cabezas que crecen hacia el frente, con borde de luz naranja arriba
const ropa=['#2456a6','#c1121f','#f2c230','#3d6b4f','#e8e2d0','#5a3e72','#2a2a32','#d06a2a'];
const piel=['#8d5f3f','#c8946a','#a5764f','#6b4430','#e0b48a'];
let fila=0;
for(let y=63;y<h+8;y+=3+Math.floor(fila/2)){const t=fila++, rr=1+Math.floor(t/2);
  for(let x=-4+(t%2)*3;x<w+4;x+=2*rr+2+Math.floor(r()*2)){
    const c=ropa[(r()*ropa.length)|0]; rect(x-rr-1,y+rr,2*rr+3,rr*2+3,c);
    rect(x-rr,y-rr,2*rr+1,2*rr+1,r()<.5?'#1a1418':'#2d2018'); rect(x-rr+1,y,2*rr-1,rr,piel[(r()*piel.length)|0]);
    rect(x-rr,y-rr-1,2*rr+1,1,'#f8a858');}}
// pancartas en blanco (sin consignas) y banderas en alto
for(const [x,y,a] of [[22,50,18],[60,47,22],[104,49,20],[138,52,16]]){rect(x,y+8,1,14,'#3a3036'); rect(x+a-1,y+8,1,14,'#3a3036');
  rect(x,y,a,9,'#f4ead5'); rect(x,y+8,a,1,'#c9bda4'); for(let k=2;k<a-2;k+=3) rect(x+k,y+3,2,1,'#c9bda4'); for(let k=1;k<a-4;k+=4) rect(x+k,y+5,3,1,'#c9bda4');}
for(const [x,y] of [[44,48],[86,45],[124,47],[10,52]]){rect(x,y,1,20,'#3a3036'); rect(x+1,y,10,3,'#f2c230'); rect(x+1,y+3,10,2,'#2456a6'); rect(x+1,y+5,10,2,'#c1121f'); px(x+11,y+1,'#f2c230');}
// bruma de luz sobre la multitud
for(let y=56;y<68;y++)for(let x=0;x<w;x++) if(B[y%4][x%4]<(64-y)/1.5) px(x,y,'rgba(255,190,120,.18)');
})();`;

// pantalla del televisor en coordenadas de la escena (la misma en todas las láminas)
const pantalla = (etq, tit) => `<div style="position:absolute;left:292px;top:36px;width:496px;height:260px;overflow:hidden">
  <canvas id="epica" style="position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated"></canvas><script>${epica}</script>
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(8,8,14,.80) 0%, rgba(8,8,14,.45) 30%, transparent 50%)"></div>
  <div style="position:absolute;left:20px;right:20px;top:12px">
    <div style="font:13px 'Special Elite';color:${C.rojoClaro};letter-spacing:3px">${etq}</div>
    <div style="font:900 ${tit.length > 34 ? 27 : 31}px/1.05 'Playfair Display';color:${C.hueso};margin-top:3px;text-shadow:0 2px 4px #000">${tit}</div></div>
  <div style="position:absolute;inset:0;background:repeating-linear-gradient(to bottom, rgba(0,0,0,.12) 0 1px, transparent 1px 3px)"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 15%, rgba(255,255,255,.08), transparent 55%)"></div></div>`;

const HEAD = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Permanent+Marker&family=Patrick+Hand&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;overflow:hidden;position:relative;background:#000}
#aula{display:none}.capa{position:absolute;inset:0;pointer-events:none}
.frase{font-size:35px!important;line-height:1.1!important}</style></head><body>
<canvas id="aula"></canvas><script>${dibujo}</script>`;
const sala = (k) => `<div class="capa sala" style="background-size:${N * W}px ${Math.ceil(H / PX) * PX}px;background-position:${-k * W}px 0;image-rendering:pixelated"></div>
  <script>document.querySelectorAll('.sala').forEach(e=>e.style.backgroundImage='url('+document.getElementById('aula').toDataURL()+')');</script>`;
const luz = `<div class="capa" style="background:radial-gradient(ellipse 80% 55% at 50% 45%, rgba(255,246,225,.16), transparent 70%),
  linear-gradient(to bottom, rgba(20,18,24,.18), transparent 18%, transparent 78%, rgba(20,18,24,.28))"></div>`;
const filtro = `<defs><filter id="mano"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="9" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="3"/></filter></defs>`;

const ETQ = "BOGOTÁ · 19 NOV 2026";
const TIT = "¿Por qué Colombia marcha el 19 de noviembre?";

// ---------- objetos del tema en pixel art (se amplían x6) ----------
const BANDEJA = 1236;
const objetos = `
(()=>{const dib=(id,w,h,f)=>{const c=document.getElementById(id); c.width=w; c.height=h; const g=c.getContext('2d'); f((x,y,a,b,col)=>{g.fillStyle=col; g.fillRect(x,y,a,b);});};
// cacerola de aluminio con cuchara de palo
dib('cacerola',24,14,(r)=>{
  r(1,6,4,2,'#2b2b30'); r(2,7,2,1,'#6e737a');
  r(5,4,16,10,'#2b2b30'); r(6,5,14,8,'#9aa0a6'); r(6,5,14,1,'#c9ced3'); r(7,6,2,6,'#d6dade'); r(17,6,3,7,'#7a8086');
  r(4,3,18,2,'#2b2b30'); r(5,3,16,1,'#c9ced3');
  for(let i=0;i<9;i++) r(11+i,3-Math.floor(i/3),2,1,'#2b2b30'); for(let i=0;i<8;i++) r(12+i,3-Math.floor(i/3),1,1,'#b07a46');
  r(20,0,3,2,'#2b2b30'); r(21,0,1,1,'#c9915a');});
// megáfono blanco con banda roja
dib('megafono',26,16,(r)=>{
  r(1,5,5,6,'#2b2b30'); r(2,6,3,4,'#e8e2d0');
  for(let x=6;x<24;x++){const a=Math.round((x-6)*0.33); r(x,5-a,1,6+2*a,'#2b2b30'); r(x,6-a,1,4+2*a,x>18&&x<21?'#c1121f':'#f2eee4'); r(x,6-a,1,1,'#ffffff');}
  r(24,0,2,16,'#2b2b30'); r(24,1,1,14,'#9aa0a6');
  r(10,10,3,6,'#2b2b30'); r(11,11,1,4,'#55565c');});})();`;

// ---------- lámina 1: primer plano del televisor ----------
const portada = `${HEAD}
<div style="position:absolute;inset:0;transform:translateY(170px) scale(2);transform-origin:540px 170px">
  ${sala(0)}
  <div class="capa" style="background:radial-gradient(ellipse 300px 80px at 540px 330px, rgba(240,150,80,.22), transparent 75%)"></div>
  ${pantalla(ETQ, TIT)}
</div>
${luz}
<!-- en el tablero, que asoma abajo: una sola línea que invita a deslizar -->
<svg class="capa" width="${W}" height="${H}">${filtro}<g filter="url(#mano)">
  ${mtx(60, 760, "104 días de gobierno.", 58)}
  ${mtx(60, 836, "Hoy te cuento por qué", 44, C.azul)}${mtx(60, 890, "se sale a la calle.", 44, C.azul)}
  ${flecha(60, 960, 200, 960)}</g></svg>
<!-- firma como rótulo de televisión -->
<div style="position:absolute;left:60px;top:1040px;display:flex;align-items:stretch;gap:14px">
  <div style="width:8px;background:${C.rojo}"></div>
  <div><div style="font:900 50px/1 'Playfair Display';color:${M}">Profe Leo</div>
    <div style="font:26px 'Special Elite';color:${C.gris};margin-top:8px;letter-spacing:1px">@leoelpasado</div></div></div>
<!-- bandeja del tablero con dos objetos del tema: cacerola (cacerolazo de 2019) y megáfono -->
<div style="position:absolute;left:0;right:0;top:${BANDEJA}px;height:14px;background:linear-gradient(#c4c9ce,#a3a8ad 60%,#868b90)"></div>
<div style="position:absolute;left:0;right:0;top:${BANDEJA + 14}px;height:22px;background:linear-gradient(rgba(0,0,0,.18),transparent)"></div>
<canvas id="cacerola" style="position:absolute;left:60px;top:${BANDEJA - 14 * 6}px;width:${24 * 6}px;height:${14 * 6}px;image-rendering:pixelated;filter:drop-shadow(4px 5px 3px rgba(0,0,0,.3))"></canvas>
<canvas id="megafono" style="position:absolute;left:240px;top:${BANDEJA - 16 * 6}px;width:${26 * 6}px;height:${16 * 6}px;image-rendering:pixelated;filter:drop-shadow(4px 5px 3px rgba(0,0,0,.3))"></canvas>
<script>${objetos}</script>
<!-- Profe Leo cortado abajo, mirando hacia el texto; escala entera x3 -->
<img src="${spr("leo-habla")}" style="position:absolute;left:${830 - 165 * 1.5}px;top:740px;height:${266 * 3}px;transform:scaleX(-1);image-rendering:pixelated;filter:drop-shadow(-14px 12px 18px rgba(30,24,28,.28))">
<div style="position:absolute;left:${830 - 165 * 1.5}px;top:740px;width:${165 * 3}px;height:${266 * 3}px;transform:scaleX(-1);background:linear-gradient(90deg, rgba(255,200,150,.16), transparent 55%);mix-blend-mode:soft-light;
  -webkit-mask-image:url('${spr("leo-habla")}');-webkit-mask-size:100% 100%"></div>
<div class="capa" style="background:linear-gradient(to bottom, transparent 85%, rgba(20,18,24,.22))"></div>
<div style="position:absolute;right:20px;top:8px;font:16px 'Special Elite';color:#8a857a">PILOTO · BOCETO 1/10</div>
</body></html>`;


// ---------- objetos del tema para la escena (pixel art en código, x5) ----------
// cada lámina tiene un objeto asociado a su contenido (TABLERO.md, punto 5)
const O = "#1d1d1f";
const PIX = {
  megafono: [26, 16, `r(1,5,5,6,O); r(2,6,3,4,'#e8e2d0');
    for(let x=6;x<24;x++){const a=Math.round((x-6)*0.33); r(x,5-a,1,6+2*a,O); r(x,6-a,1,4+2*a,x>18&&x<21?'#c1121f':'#f2eee4'); r(x,6-a,1,1,'#fff');}
    r(24,0,2,16,O); r(24,1,1,14,'#9aa0a6'); r(10,10,3,6,O); r(11,11,1,4,'#55565c');`],
  calculadora: [16, 22, `r(0,0,16,22,O); r(1,1,14,20,'#4a4a52'); r(1,1,14,1,'#6a6a74'); r(2,2,12,5,O); r(3,3,10,3,'#b9d3a6'); r(5,4,2,1,'#3d5a34'); r(8,4,1,1,'#3d5a34'); r(10,4,2,1,'#3d5a34');
    for(let j=0;j<4;j++)for(let i=0;i<3;i++){r(2+i*4,9+j*3,3,2,(i===2&&j===3)?'#e07a2a':'#d6d2c8');}`],
  alcancia: [26, 18, `r(2,9,2,3,O); r(4,4,18,12,O); r(5,5,16,10,'#e89aa8'); r(6,5,14,2,'#f6c2cb'); r(21,7,4,5,O); r(22,8,2,3,'#d77f8f'); r(22,9,1,1,O);
    r(11,4,6,1,'#7a3442'); r(17,7,1,1,O); r(6,15,3,3,O); r(16,15,3,3,O); r(7,15,1,2,'#d77f8f'); r(17,15,1,2,'#d77f8f');
    r(12,0,4,3,O); r(13,0,2,2,'#f2c230');`],
  vela: [12, 28, `r(5,0,2,2,'#ffe28a'); r(4,2,4,4,'#f6a23a'); r(5,3,2,2,'#ffe28a'); r(5,6,1,2,O);
    r(2,8,8,16,O); r(3,9,6,15,'#f2eadb'); r(3,9,2,15,'#fffaf0'); r(7,10,1,4,'#e2d6bf'); r(0,24,12,4,O); r(1,25,10,2,'#9aa0a6');`],
  pasaporte: [18, 24, `r(0,0,18,24,O); r(1,1,16,22,'#6b1f2a'); r(1,1,16,1,'#8a2c3a'); r(6,6,6,6,'#c9a24a'); r(7,7,4,4,'#6b1f2a'); r(8,8,2,2,'#c9a24a');
    r(4,15,10,1,'#c9a24a'); r(5,17,8,1,'#c9a24a'); r(10,16,8,7,'#2456a6'); r(11,17,6,5,'#dce7f7'); r(12,19,4,1,'#2456a6');`],
  olla: [32, 24, `r(14,0,1,3,'#b0b4ba'); r(18,1,1,3,'#b0b4ba'); r(22,0,1,3,'#b0b4ba');
    r(20,0,2,9,O); r(21,1,1,7,'#b07a46');
    r(0,9,4,3,O); r(28,9,4,3,O); r(3,7,26,17,O); r(4,8,24,15,'#8e949b'); r(4,8,24,2,'#c9ced3'); r(6,11,3,10,'#b9bec4'); r(23,11,3,11,'#6e737a'); r(2,6,28,2,O);`],
  constitucion: [22, 28, `r(0,0,22,28,O); r(1,1,19,26,'#1f3a6b'); r(20,2,1,25,'#f2eadb'); r(1,1,19,1,'#2f4f86');
    r(4,5,13,1,'#c9a24a'); r(5,7,11,1,'#c9a24a'); r(6,12,9,7,'#c9a24a'); r(7,13,7,5,'#1f3a6b'); r(9,14,3,3,'#c9a24a'); r(4,22,13,1,'#c9a24a');`],
};
const objetoEscena = (egg) => {
  if (!egg.startsWith("px:")) return `<img src="${spr(egg)}" style="position:absolute;left:880px;top:${K.PISO - 92}px;height:120px;transform:rotate(-8deg);image-rendering:pixelated;filter:drop-shadow(6px 6px 4px rgba(0,0,0,.25))">`;
  const [w, h, cod] = PIX[egg.slice(3)], E = 5;
  return `<canvas id="egg" style="position:absolute;left:880px;top:${K.PISO + 28 - h * E}px;width:${w * E}px;height:${h * E}px;image-rendering:pixelated;filter:drop-shadow(6px 6px 4px rgba(0,0,0,.25))"></canvas>
  <script>(()=>{const c=document.getElementById('egg'); c.width=${w}; c.height=${h}; const g=c.getContext('2d'); const O='${O}'; const r=(x,y,a,b,col)=>{g.fillStyle=col; g.fillRect(x,y,a,b);}; ${cod}})();</script>`;
};

// ---------- piezas de sketch propias del tema ----------
const doc = (x, y, t = "") => `<path d="M${x},${y} L${x + 64},${y} L${x + 84},${y + 20} L${x + 84},${y + 116} L${x},${y + 116} Z M${x + 64},${y} L${x + 64},${y + 20} L${x + 84},${y + 20}" fill="#fbfaf6" ${trazo}/>
  <path d="M${x + 12},${y + 38} L${x + 70},${y + 38} M${x + 12},${y + 54} L${x + 70},${y + 54}" ${trazo} stroke-width="3"/>${t ? mtx(x + 42, y + 100, t, 28, M, 'text-anchor="middle"') : ""}`;
const libro = (x, y) => `<path d="M${x},${y + 10} Q${x + 45},${y - 8} ${x + 90},${y + 10} Q${x + 135},${y - 8} ${x + 180},${y + 10} L${x + 180},${y + 110} Q${x + 135},${y + 92} ${x + 90},${y + 110} Q${x + 45},${y + 92} ${x},${y + 110} Z M${x + 90},${y + 10} L${x + 90},${y + 110}" fill="#fbfaf6" ${trazo}/>
  ${mtx(x + 45, y + 70, "art.", 26, M, 'text-anchor="middle"')}${mtx(x + 135, y + 74, "37", 40, C.azul, 'text-anchor="middle"')}`;
const capitolio = (x, y, bandera = true) => `<path d="M${x},${y + 90} L${x + 260},${y + 90} M${x + 10},${y + 20} L${x + 250},${y + 20} L${x + 250},${y + 90} M${x + 10},${y + 20} L${x + 10},${y + 90} M${x + 4},${y + 12} L${x + 256},${y + 12}" ${trazo}/>
  ${Array.from({ length: 11 }, (_, i) => `<path d="M${x + 30 + i * 20},${y + 30} L${x + 30 + i * 20},${y + 84}" ${trazo} stroke-width="3"/>`).join("")}
  <path d="M${x + 130},${y + 12} L${x + 130},${y - 30}" ${trazo}/>${bandera ? `<path d="M${x + 130},${y - 30} L${x + 170},${y - 30} L${x + 170},${y - 6} L${x + 130},${y - 6}" fill="#f2c230" ${trazo} stroke-width="3"/>
  <path d="M${x + 132},${y - 18} L${x + 168},${y - 18}" stroke="${C.azul}" stroke-width="5"/><path d="M${x + 132},${y - 11} L${x + 168},${y - 11}" stroke="#c1121f" stroke-width="5"/>` : `<path d="M${x + 130},${y - 30} L${x + 170},${y - 30} L${x + 170},${y - 6} L${x + 130},${y - 6}" fill="#fbfaf6" ${trazo} stroke-width="3"/>`}`;
const txt = (x, y, t, tam = 30, color = M, extra = "") => `<text x="${x}" y="${y}" font-family="Patrick Hand" font-size="${tam}" fill="${color}" ${extra}>${t}</text>`;
const sube = (x, y) => `<path d="M${x},${y} L${x + 10},${y - 16} L${x + 20},${y}" ${trazoAzul} stroke-width="5"/>`;
const baja = (x, y) => `<path d="M${x},${y - 16} L${x + 10},${y} L${x + 20},${y - 16}" ${trazoAzul} stroke-width="5"/>`;
const eslabon = (x, y, rot) => `<rect x="${x}" y="${y}" width="70" height="40" rx="20" fill="none" ${trazo} stroke-width="6" transform="rotate(${rot} ${x + 35} ${y + 20})"/>`;
const frase = (x, y, w, ...t) => `<div class="frase" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;color:${M};font:400 35px/1.1 'Patrick Hand',cursive">${t.map((p) => `<p style="margin-bottom:10px">${p}</p>`).join("")}</div>`;
const sup = (n) => `<sup style="font:700 .6em 'Playfair Display';color:${C.rojoClaro};margin-left:2px">${n}</sup>`;

// mapa de Colombia con indicativos (lámina 6)
const topo = require("topojson-client"), d3 = require("d3-geo");
const wa = require("world-atlas/countries-50m.json");
const colombia = topo.feature(wa, wa.objects.countries).features.find((f) => String(f.id).padStart(3, "0") === "170");
const pjM = d3.geoMercator().fitExtent([[50, 478], [320, 770]], colombia);
const mapaCol = d3.geoPath(pjM)(colombia);
const marca = (lonlat, t, dx, dy) => { const [x, y] = pjM(lonlat); return `<circle cx="${x}" cy="${y}" r="16" fill="${C.azul}" opacity=".55"/><circle cx="${x}" cy="${y}" r="16" ${trazo} stroke-width="3"/>${mtx(x + dx, y + dy, t, 20)}`; };
const cifra = (x, y, n, t) => `${mtx(x, y, n, 64)}${txt(x, y + 34, t, 28, C.azul)}`;

// ---------- láminas 2 a 10 (coordenadas del tablero antes de bajar DY; la cabeza de Leo ocupa x < 440 desde y 795) ----------
const L = [
  { n: 2, k: 1, etq: "HOY · 104 DÍAS DE GOBIERNO", tit: `¿Quién marcha?${sup(1)}`, leo: "leo-habla", egg: "px:megafono",
    svg: `${cinta("ACTORES")}
      ${[["CUT", 60], ["Fecode", 180], ["estudiantes", 300], ["indígenas", 420], ["oposición", 540]].map(([t, x]) => `${personita(x + 10, 494)}${personita(x + 44, 500)}${txt(x + 27, 590, t, 24, C.azul, 'text-anchor="middle"')}`).join("")}
      ${flecha(626, 530, 690, 530)}
      ${capitolio(730, 490)}`,
    frases: frase(40, 620, 330, "Marchan sindicatos, maestros, estudiantes y pueblos indígenas.") +
      frase(400, 620, 330, "El Gobierno cumplió 100 días y los celebró como «100 días, más de 100 milagros».") +
      frase(760, 620, 290, "En la calle, la lista de razones es otra.") },
  { n: 3, k: 2, etq: "PROYECTO DE LEY 477 DE 2026", tit: `La ley de rescate: ¿a quién rescata?${sup(2)}`, leo: "leo-documento", egg: "px:calculadora",
    svg: `${cinta("CAMBIOS")}
      <path d="M300,488 L300,734 M600,488 L600,734 M40,528 L1040,528" ${trazo} stroke-width="3"/>
      ${mtx(330, 518, "ANTES", 30)}${mtx(630, 518, "DESPUÉS", 30)}
      <rect x="640" y="550" width="44" height="34" fill="rgba(255,226,80,.6)"/>
      ${[["Asalariados", "—", "9 % desde $3,3 M al mes", "s"], ["Empresas", "35 %", "31 % desde 2028", "b"], ["Bancos", "40 %", "36 %", "b"], ["Patrimonio", "desde $3.771 M", "desde $5.000 M, hasta 2030", "b"]]
        .map(([a, b, c, d], i) => { const y = 576 + i * 52; return `${txt(48, y, a, 32)}${txt(330, y, b, 32)}${d === "s" ? sube(612, y) : baja(612, y)}${txt(644, y, c, 30)}`; }).join("")}`,
    frases: frase(440, 742, 600, "Al que gana más de $3,3 millones al mes le sube el impuesto. A empresas y bancos les baja.") },
  { n: 4, k: 3, etq: "QUIÉN GANA · QUIÉN PIERDE", tit: `¿Quién carga la cuenta?${sup(2)}`, leo: "leo-gancho-pregunta", egg: "px:alcancia",
    svg: `${cinta("BALANZA")}
      <path d="M620,500 L620,700 M570,700 L670,700 M400,560 L840,500" ${trazo} stroke-width="5"/><circle cx="620" cy="530" r="9" fill="${M}"/>
      <path d="M400,560 L360,640 M400,560 L440,640 M840,500 L800,570 M840,500 L880,570" ${trazo} stroke-width="3"/>
      <path d="M346,640 Q400,676 454,640 Z M786,570 Q840,600 894,570 Z" fill="#dce7f7" ${trazo}/>
      ${[0, 1, 2, 3].map((i) => personita(355 + i * 30, 590 - (i % 2) * 4)).join("")}
      ${txt(400, 706, "asalariados · maestros", 24, C.azul, 'text-anchor="middle"')}${txt(400, 734, "militares · Ecopetrol", 24, C.azul, 'text-anchor="middle"')}
      <rect x="800" y="548" width="34" height="22" fill="#fbfaf6" ${trazo} stroke-width="3"/><rect x="842" y="540" width="34" height="30" fill="#fbfaf6" ${trazo} stroke-width="3"/>
      ${txt(840, 630, "bancos · empresas", 24, C.azul, 'text-anchor="middle"')}${txt(840, 658, "grandes patrimonios", 24, C.azul, 'text-anchor="middle"')}
      ${resaltado(706, 708, "salud: 1,5 % → 4 %", 30)}`,
    frases: frase(40, 600, 290, "Quitaron el IVA a la canasta. El resto sigue igual.") +
      frase(700, 724, 340, "Maestros, militares y gente de Ecopetrol pagarían más.") },
  { n: 5, k: 4, etq: "ARTÍCULO 7 · FACULTADES EXTRAORDINARIAS", tit: `Seis meses con tijeras${sup(2)}`, leo: "leo-gancho-tijeras", egg: "obj-tijeras",
    svg: `${cinta("CIFRA")}
      ${resaltado(50, 600, "6 MESES", 96)}
      ${[["ministerio", 560, 490], ["superintendencia", 760, 490], ["agencia", 640, 576]].map(([t, x, y]) => `<rect x="${x}" y="${y}" width="${t.length * 13 + 30}" height="54" fill="#fbfaf6" ${trazo}/>${txt(x + 15, y + 36, t, 28)}`).join("")}
      <path d="M540,562 L1040,562" stroke="${M}" stroke-width="3" stroke-dasharray="12 8"/>
      <circle cx="960" cy="610" r="14" ${trazo}/><circle cx="960" cy="650" r="14" ${trazo}/><path d="M972,602 L1030,560 M972,658 L1030,566" ${trazo}/>`,
    frases: frase(40, 630, 360, "El artículo 7 le da al presidente seis meses para suprimir o fusionar ministerios y entidades.") +
      frase(560, 680, 470, "Sin volver al Congreso. Quienes marchan temen que lo público termine en manos privadas.") },
  { n: 6, k: 5, etq: "7 AGO – 15 NOV 2026 · INDEPAZ", tit: `100 días, 26 masacres${sup(3)}`, leo: "leo-piensa", egg: "px:vela",
    svg: `${cinta("MAPA")}
      <path d="${mapaCol}" fill="#fbfaf6" ${trazo} stroke-width="3.5"/>
      ${marca([-76.6, 2.44], "Cauca", 22, 6)}${marca([-75.57, 6.25], "Antioquia", 22, -6)}
      <circle cx="70" cy="790" r="12" fill="${C.azul}" opacity=".55"/>${txt(92, 798, "más líderes asesinados", 22, C.azul)}
      ${cifra(400, 540, "26", "masacres")}${cifra(580, 540, "87", "víctimas")}${cifra(760, 540, "45", "líderes sociales")}${cifra(400, 650, "8", "firmantes de paz")}
      ${resaltado(620, 650, "paz: suspendida", 36)}`,
    frases: frase(400, 720, 330, "Indepaz: un líder social asesinado cada dos días.") +
      frase(760, 700, 290, "El Gobierno responde con 51.000 capturas.") },
  { n: 7, k: 0, etq: "COLOMBIA · ISRAEL · 2024 → 2026", tit: `¿Con quién se alía Colombia?${sup(4)}`, leo: "leo-senala", egg: "px:pasaporte",
    svg: `${cinta("CADENA")}
      ${eslabon(70, 500, -20)}${eslabon(170, 520, -20)}${txt(60, 600, "2024: relaciones rotas", 26, C.azul)}
      ${flecha(320, 540, 380, 540)}
      ${capitolio(400, 500, false)}${txt(400, 620, "14 oct 2026: embajada", 26, C.azul)}
      ${flecha(690, 540, 750, 540)}
      <circle cx="850" cy="540" r="40" fill="#f6dd8a" ${trazo}/><path d="M830,578 L816,630 L850,612 L884,630 L870,578" fill="#dce7f7" ${trazo}/>${txt(780, 660, "18 nov: premio", 26, C.azul)}`,
    frases: frase(40, 640, 320, "En 2024 Colombia rompió relaciones con Israel por la guerra en Gaza.") +
      frase(400, 650, 320, "En 2025, una comisión de la ONU concluyó que Israel cometía genocidio en Gaza.") +
      frase(760, 690, 290, "Este Gobierno abrió embajada en Jerusalén y recibió un premio de ese Estado.") },
  { n: 8, k: 1, etq: "1977 · 2019 · 2020 · 2021 · 2026", tit: `El 19 de noviembre ya tiene historia${sup(5)}`, leo: "leo-mapa-puntero", egg: "px:olla",
    svg: `${cinta("LÍNEA")}
      <path d="M40,560 L1030,560" ${trazo} stroke-width="5"/><path d="M1012,546 L1034,560 L1012,574" ${trazo} stroke-width="5"/>
      ${[[40, "1977"], [240, "2019"], [440, "2020"], [640, "2021"], [840, "2026"]].map(([x, a], i) => `${i === 2 || i === 4 ? `<rect x="${x - 4}" y="502" width="118" height="40" fill="rgba(255,226,80,.6)"/>` : ""}${mtx(x, 534, a, 40)}<circle cx="${x + 50}" cy="560" r="11" fill="${i === 4 ? "#fbfaf6" : C.azul}" stroke="${M}" stroke-width="4"/>`).join("")}`,
    frases: frase(40, 590, 185, "Paro cívico por el costo de la vida.") + frase(240, 590, 185, "21N: paro y cacerolazos.") +
      frase(440, 590, 185, "19N: otro paro nacional.") + frase(640, 590, 185, "El paro tumba una reforma tributaria.") + frase(840, 590, 200, "19N: ¿y ahora?") },
  { n: 9, k: 2, etq: "LA PREGUNTA QUE QUEDA", tit: `¿Quién pone las reglas de la calle?${sup(6)}`, leo: "leo-piensa", egg: "px:constitucion",
    svg: `${cinta("CITA")}
      ${libro(46, 482)}
      ${flecha(250, 540, 320, 540)}
      ${doc(340, 478, "1525")}${[0, 1, 2, 3, 4].map((i) => `<rect x="${450 + i * 26}" y="${580 - i * 18}" width="24" height="${18 + i * 18}" fill="${i === 4 ? C.azul : "#fbfaf6"}" stroke="${M}" stroke-width="3"/>`).join("")}
      ${flecha(600, 540, 660, 540)}
      ${mtx(880, 640, "?", 170)}`,
    frases: frase(40, 620, 290, "Artículo 37 de la Constitución:") +
      frase(400, 630, 340, "«Toda parte del pueblo puede reunirse y manifestarse pública y pacíficamente».") +
      frase(760, 690, 280, "Un mes antes, un decreto cambió las reglas.") },
  { n: 10, k: 3, etq: "CADA DATO CON SU FUENTE", tit: "Notas", leo: "leo-saluda", egg: "obj-egg-maleta",
    svg: `${cinta("FUENTES")}`,
    frases: frase(40, 470, 300, "¿Quién paga la cuenta? ¿Y quién decide cuándo se protesta por ella?") +
      `<div style="position:absolute;left:40px;top:700px;color:${M}"><div style="font:900 36px 'Playfair Display'">Profe Leo</div>
        <div style="font:22px 'Special Elite';color:${C.gris}">@leoelpasado</div></div>
      <div style="position:absolute;left:370px;top:396px;width:690px;background:#fdfcf8;padding:14px 18px 10px;box-shadow:0 5px 9px rgba(0,0,0,.22);color:${C.texto};transform:rotate(-.5deg)">
        <ol style="padding-left:22px;font:13.5px/1.28 'Special Elite'">
          <li style="margin-bottom:5px">Gobierno de Colombia, «100 días, más de 100 milagros», en Portafolio, 15 de noviembre de 2026; Cambio, «Los 100 días de Abelardo de la Espriella», noviembre de 2026.</li>
          <li style="margin-bottom:5px">Proyecto de Ley 477 de 2026, «Ley de Rescate Económico» [Gaceta del Congreso, pendiente]; La Silla Vacía, «Más tributaria que recorte: claves de la Ley de Rescate de Abelardo»; El País (Cali), «Los cambios en impuestos de renta, IVA y patrimonio que trae la ley de rescate».</li>
          <li style="margin-bottom:5px">Indepaz, balance de los primeros 100 días (7 de agosto a 15 de noviembre de 2026), en El País, 15 de noviembre de 2026; El Universal, 17 de noviembre de 2026.</li>
          <li style="margin-bottom:5px">Semana, restablecimiento de relaciones con Israel, octubre de 2026; Infobae, 18 de noviembre de 2026; ONU, Comisión Internacional Independiente de Investigación sobre el Territorio Palestino Ocupado, informe del 16 de septiembre de 2025 [signatura por verificar].</li>
          <li style="margin-bottom:5px">Radio Nacional y Portafolio, 19 de noviembre de 2020; Semana y CNN Español, 2 y 3 de mayo de 2021; [1977 y 2019: fuente académica pendiente].</li>
          <li>Constitución Política de Colombia (1991), art. 37; Decreto 1525 de 2026 [Diario Oficial, pendiente].</li></ol>
        <div style="font:12px 'Special Elite';color:${C.gris};margin-top:4px">Estilo Chicago, forma de nota. Enlaces en la descripción.</div></div>` },
];

const escena = (l) => `${HEAD}
<div style="position:absolute;inset:0;transform:scale(${Z});transform-origin:540px 0">
  ${sala(l.k)}
  <div class="capa" style="background:radial-gradient(ellipse 260px 60px at 540px 322px, rgba(240,160,100,.18), transparent 75%)"></div>
  ${pantalla(ETQ, TIT)}
  ${objetoEscena(l.egg)}
  ${luz}
</div>
<div style="position:absolute;left:350px;top:392px;width:700px;color:${M}"><span style="font:15px 'Special Elite';letter-spacing:2px;color:${C.gris}">${l.etq}</span>
  <div style="font:900 34px 'Playfair Display';line-height:1">${l.tit}</div></div>
<svg class="capa" width="${W}" height="${H}">${filtro}<g filter="url(#mano)" transform="translate(0,${DY})">${l.svg}</g></svg>
${l.frases.replace(/top:(\d+)px/g, (m, y) => `top:${+y + DY}px`)}
<div style="position:absolute;inset:0;transform:translateX(${LEO_DX}px) scale(${Z});transform-origin:540px 0">${leo(l.leo, 0)}</div>
${CLASE.map(([n, cx]) => `<img src="${spr(n)}" style="position:absolute;left:${zx(cx)}px;top:1218px;height:${REG[`v2/${n}`][1] * 1.4 * Z}px;transform:translateX(-50%);image-rendering:pixelated;filter:brightness(.72) saturate(.85) drop-shadow(0 -6px 14px rgba(0,0,0,.25))">`).join("")}
<div style="position:absolute;right:20px;top:8px;font:16px 'Special Elite';color:#8a857a">PILOTO · BOCETO ${l.n}/10</div>
</body></html>`;

const solo = process.argv[2] ? process.argv[2].split(",").map(Number) : null; // node marcha.cjs 3,5 → solo esas láminas
const paginas = [["lamina-1", portada, 1], ...L.map((l) => [`lamina-${l.n}`, escena(l), l.n])].filter(([, , n]) => !solo || solo.includes(n));
for (const [nombre, html] of paginas) {
  const f = path.join(OUT, `${nombre}.html`);
  fs.writeFileSync(f, html);
  execFileSync(K.chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--virtual-time-budget=9000",
    `--window-size=${W},${H}`, `--screenshot=${path.join(OUT, `${nombre}.png`)}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
}
execFileSync("python", ["-c", `
from PIL import Image
S=Image.new('RGB',(5*${W}+80,2*${H}+20),(30,30,30))
for k in range(10): S.paste(Image.open(r'${OUT}'+f'/lamina-{k+1}.png').convert('RGB'),((k%5)*(${W}+20),(k//5)*(${H}+20)))
S.resize((S.width//3,S.height//3)).save(r'${OUT}/contacto.png')`]);
console.log("listo:", OUT);
