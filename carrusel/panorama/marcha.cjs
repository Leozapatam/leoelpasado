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
  ${mtx(70, 840, "No es la primera vez.", 62)}
  ${mtx(70, 924, "Hoy te cuento por qué", 46, C.azul)}${mtx(70, 982, "se sale a la calle.", 46, C.azul)}
  ${flecha(820, 950, 980, 950)}</g></svg>
<div style="position:absolute;right:20px;top:8px;font:16px 'Special Elite';color:#8a857a">PILOTO · BOCETO 1/6</div>
</body></html>`;

// ---------- piezas propias del tema ----------
const doc = (x, y, t = "") => `<path d="M${x},${y} L${x + 64},${y} L${x + 84},${y + 20} L${x + 84},${y + 116} L${x},${y + 116} Z M${x + 64},${y} L${x + 64},${y + 20} L${x + 84},${y + 20}" fill="#fbfaf6" ${trazo}/>
  <path d="M${x + 12},${y + 38} L${x + 70},${y + 38} M${x + 12},${y + 54} L${x + 70},${y + 54}" ${trazo} stroke-width="3"/>${t ? mtx(x + 42, y + 98, t, 30, M, 'text-anchor="middle"') : ""}`;
const pancarta = (x, y) => `<path d="M${x},${y} L${x},${y + 70} M${x + 90},${y} L${x + 90},${y + 70}" ${trazo}/><rect x="${x - 6}" y="${y - 30}" width="102" height="44" fill="#fbfaf6" stroke="${M}" stroke-width="4"/>
  <path d="M${x + 8},${y - 14} L${x + 80},${y - 14} M${x + 8},${y - 2} L${x + 60},${y - 2}" ${trazo} stroke-width="3"/>`;
const balanza = (cx, y) => `<path d="M${cx},${y} L${cx},${y + 96} M${cx - 30},${y + 96} L${cx + 30},${y + 96} M${cx - 70},${y + 14} L${cx + 70},${y + 4}
  M${cx - 70},${y + 14} L${cx - 90},${y + 54} M${cx - 70},${y + 14} L${cx - 50},${y + 54} M${cx + 70},${y + 4} L${cx + 50},${y + 44} M${cx + 70},${y + 4} L${cx + 90},${y + 44}" ${trazo}/>
  <path d="M${cx - 94},${y + 54} Q${cx - 70},${y + 72} ${cx - 46},${y + 54} Z M${cx + 46},${y + 44} Q${cx + 70},${y + 62} ${cx + 94},${y + 44} Z" fill="#dce7f7" ${trazo}/>`;
const escudo = (x, y) => `<path d="M${x},${y} L${x + 40},${y - 10} L${x + 80},${y} L${x + 80},${y + 50} Q${x + 40},${y + 96} ${x},${y + 50} Z" fill="#dce7f7" ${trazo}/>
  ${[1, 2, 3, 4, 5].map((n, i) => `<rect x="${x + 100}" y="${y + 70 - i * 18}" width="${30 + i * 16}" height="12" fill="${i === 0 ? C.azul : "#fbfaf6"}" stroke="${M}" stroke-width="3"/>`).join("")}`;
const libro = (x, y) => `<path d="M${x},${y + 10} Q${x + 45},${y - 8} ${x + 90},${y + 10} Q${x + 135},${y - 8} ${x + 180},${y + 10} L${x + 180},${y + 110} Q${x + 135},${y + 92} ${x + 90},${y + 110} Q${x + 45},${y + 92} ${x},${y + 110} Z M${x + 90},${y + 10} L${x + 90},${y + 110}" fill="#fbfaf6" ${trazo}/>
  ${mtx(x + 45, y + 70, "art.", 26, M, 'text-anchor="middle"')}${mtx(x + 135, y + 74, "37", 40, C.azul, 'text-anchor="middle"')}`;
const banda = cinta; // el grupo del tablero ya baja DY
const frase = (x, y, w, ...t) => `<div class="frase" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;color:${M};font:400 35px/1.1 'Patrick Hand',cursive">${t.map((p) => `<p style="margin-bottom:10px">${p}</p>`).join("")}</div>`;
const sup = (n) => `<sup style="font:700 .6em 'Playfair Display';color:${C.rojoClaro};margin-left:2px">${n}</sup>`;

// coordenadas finales de la lámina: tablero de y 377 a 929; la cabeza de Profe Leo ocupa x < 440 desde y 840
const L = [
  { k: 1, etq: "HOY · QUIÉN Y POR QUÉ", tit: `¿Quién marcha y contra qué?${sup(1)}`, leo: "leo-habla", egg: "obj-egg-bandera", n: 1,
    svg: `${banda("HOY")}
      ${personita(60, 500)}${personita(96, 494)}${personita(132, 500)}${pancarta(170, 520)}
      ${flecha(320, 540, 380, 540)}
      ${doc(400, 478, "$")}
      ${resaltado(508, 518, "AJUSTE", 38)}${resaltado(508, 562, "FISCAL", 38)}
      ${flecha(712, 540, 770, 540)}
      ${balanza(900, 470)}${mtx(800, 600, "Gobierno", 22, C.azul)}${mtx(930, 590, "marcha", 22, C.azul)}`,
    frases: frase(40, 600, 330, "Marchan la CUT, los maestros de Fecode, estudiantes y la oposición.") +
      frase(400, 620, 320, "Rechazan un proyecto de ley del Gobierno de Abelardo de la Espriella que cambia impuestos y gastos.") +
      frase(760, 630, 290, "El Gobierno lo llama «rescate económico». Ya quitó el IVA a la canasta, pero la marcha siguió.") },
  { k: 2, etq: "13 DE OCTUBRE DE 2026", tit: `Una regla nueva para la calle${sup(2)}`, leo: "leo-documento", egg: "obj-egg-telegrama", n: 2,
    svg: `${banda("DECRETO")}
      ${doc(50, 478, "1525")}${resaltado(150, 530, "1525", 40)}
      ${flecha(330, 540, 384, 540)}
      ${escudo(404, 490)}${mtx(404, 640, "5 niveles", 24, C.azul)}
      ${flecha(712, 540, 770, 540)}
      ${balanza(900, 470)}${mtx(808, 600, "demanda", 22, C.azul)}`,
    frases: frase(40, 600, 330, "El Gobierno firmó el Decreto 1525. Dice cómo actúa la Policía en una protesta.") +
      frase(400, 660, 320, "Tiene cinco niveles. El diálogo va primero, pero deja de ser obligatorio si hay violencia.") +
      frase(760, 630, 290, "La oposición lo demandó: dice que solo el Congreso puede limitar la protesta.") },
  { k: 3, etq: "PARO · 1977 · 2019 · 2021", tit: `No es la primera vez${sup(3)}`, leo: "leo-senala", egg: "obj-egg-radio", n: 3,
    svg: `${banda("PAROS")}
      <path d="M40,560 L1030,560" ${trazo} stroke-width="5"/><path d="M1012,546 L1034,560 L1012,574" ${trazo} stroke-width="5"/>
      ${[[80, "1977"], [400, "2019"], [690, "2021"]].map(([x, a]) => `<circle cx="${x + 40}" cy="560" r="11" fill="${C.azul}" stroke="${M}" stroke-width="4"/>${mtx(x, 530, a, 40)}`).join("")}
      ${resaltado(900, 530, "2026", 40)}<circle cx="940" cy="560" r="11" fill="#fbfaf6" stroke="${M}" stroke-width="4"/>`,
    frases: frase(40, 590, 330, "1977: paro cívico nacional por el costo de la vida.") +
      frase(400, 590, 262, "2019: el 21 de noviembre empezó un paro que duró semanas.") +
      frase(690, 590, 210, "2021: tras cuatro días de paro, el Gobierno retiró su reforma tributaria.") +
      frase(900, 590, 150, "¿Y esta vez?") },
  { k: 4, etq: "LA PREGUNTA QUE QUEDA", tit: "¿Quién pone las reglas de la calle?", leo: "leo-piensa", egg: "obj-egg-libros",
    svg: `${banda("1991")}
      ${libro(46, 482)}
      ${flecha(250, 540, 320, 540)}
      ${resaltado(340, 530, "DERECHO", 40)}${mtx(342, 574, "a reunirse y marchar", 26, C.azul)}
      ${flecha(712, 540, 770, 540)}
      ${mtx(860, 610, "?", 150)}`,
    frases: frase(40, 620, 290, "El artículo 37 dice que toda parte del pueblo puede reunirse y manifestarse en paz.") +
      frase(400, 610, 320, "Es un derecho. Pero un derecho también tiene reglas.") +
      frase(760, 660, 290, "¿Las pone el Gobierno con un decreto o el Congreso con una ley?") },
  { k: 5, etq: "CADA DATO CON SU FUENTE", tit: "Notas", leo: "leo-saluda", egg: "obj-egg-maleta",
    svg: `${banda("FUENTES")}`,
    frases: frase(40, 470, 300, "Cada número tiene aquí su fuente. Puedes revisarla tú mismo.") +
      `<div style="position:absolute;left:40px;top:640px;color:${M}"><div style="font:900 36px 'Playfair Display'">Profe Leo</div>
        <div style="font:22px 'Special Elite';color:${C.gris}">@leoelpasado</div></div>
      <div style="position:absolute;left:370px;top:400px;width:684px;background:#fdfcf8;padding:18px 22px 12px;box-shadow:0 5px 9px rgba(0,0,0,.22);color:${C.texto};transform:rotate(-.5deg)">
        <ol style="padding-left:24px;font:16px/1.3 'Special Elite'">
          <li style="margin-bottom:7px">Publimetro, «Marchas en Colombia hoy, 19 de noviembre: estos son los puntos de encuentro, horarios y recorridos», 19 de noviembre de 2026; El Espectador, «Marchas hoy 19 de noviembre EN VIVO», 19 de noviembre de 2026.</li>
          <li style="margin-bottom:7px">Forbes Colombia, «Decreto 1525 de 2026: qué cambia en la protesta en Colombia», 14 de octubre de 2026; Cambio, «Demanda al decreto de protesta social llega al Consejo de Estado», octubre de 2026.</li>
          <li style="margin-bottom:7px">Semana, «Pese al retiro de la reforma y de la renuncia de Carrasquilla, el paro se mantiene», 3 de mayo de 2021. Para 1977 y 2019: [PENDIENTE, fuente académica].</li>
          <li>Constitución Política de Colombia (1991), art. 37.</li></ol>
        <div style="font:14px 'Special Elite';color:${C.gris};margin-top:4px">Estilo Chicago, forma de nota. Enlaces completos en la descripción.</div></div>` },
];

const escena = (l) => `${HEAD}
<div style="position:absolute;inset:0;transform:scale(${Z});transform-origin:540px 0">
  ${sala(l.k)}
  <div class="capa" style="background:radial-gradient(ellipse 260px 60px at 540px 322px, rgba(240,160,100,.18), transparent 75%)"></div>
  ${pantalla(ETQ, TIT)}
  <img src="${spr(l.egg)}" style="position:absolute;left:880px;top:${K.PISO - 92}px;height:120px;transform:rotate(-8deg);image-rendering:pixelated;filter:drop-shadow(6px 6px 4px rgba(0,0,0,.25))">
  ${luz}
</div>
<!-- rótulo de la lámina: va en el tablero, arriba a la derecha de la cinta -->
<div style="position:absolute;left:350px;top:392px;color:${M}"><span style="font:15px 'Special Elite';letter-spacing:2px;color:${C.gris}">${l.etq}</span>
  <div style="font:900 34px 'Playfair Display';line-height:1">${l.tit}</div></div>
<svg class="capa" width="${W}" height="${H}">${filtro}<g filter="url(#mano)" transform="translate(0,${DY})">${l.svg}</g></svg>
${l.frases.replace(/top:(\d+)px/g, (m, y) => `top:${+y + DY}px`)}
<div style="position:absolute;inset:0;transform:translateX(${LEO_DX}px) scale(${Z});transform-origin:540px 0">${leo(l.leo, 0)}</div>
${CLASE.map(([n, cx]) => `<img src="${spr(n)}" style="position:absolute;left:${zx(cx)}px;top:1218px;height:${REG[`v2/${n}`][1] * 1.4 * Z}px;transform:translateX(-50%);image-rendering:pixelated;filter:brightness(.72) saturate(.85) drop-shadow(0 -6px 14px rgba(0,0,0,.25))">`).join("")}
<div style="position:absolute;right:20px;top:8px;font:16px 'Special Elite';color:#8a857a">PILOTO · BOCETO ${l.k + 1}/6</div>
</body></html>`;

const paginas = [["lamina-1", portada], ...L.map((l) => [`lamina-${l.k + 1}`, escena(l)])];
for (const [nombre, html] of paginas) {
  const f = path.join(OUT, `${nombre}.html`);
  fs.writeFileSync(f, html);
  execFileSync(K.chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--virtual-time-budget=9000",
    `--window-size=${W},${H}`, `--screenshot=${path.join(OUT, `${nombre}.png`)}`, "file:///" + f.replace(/\\/g, "/")], { stdio: "ignore" });
}
execFileSync("python", ["-c", `
from PIL import Image
S=Image.new('RGB',(3*${W}+40,2*${H}+20),(30,30,30))
for k in range(6): S.paste(Image.open(r'${OUT}'+f'/lamina-{k+1}.png').convert('RGB'),((k%3)*(${W}+20),(k//3)*(${H}+20)))
S.resize((S.width//2,S.height//2)).save(r'${OUT}/contacto.png')`]);
console.log("listo:", OUT);
