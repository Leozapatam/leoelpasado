// Carrusel panorámico como ESCENARIO 2.5D en pixel art: un paisaje en capas con profundidad
// (cielo, cordillera lejana, selva, río, orilla y camino) que se recorre de lámina en lámina.
// El fondo se dibuja a 1/4 de resolución y se amplía sin suavizar, para que el píxel coincida con el de Profe Leo v2.
// El hilo es una cuerda roja tendida entre postes de madera a la misma altura en todas las costuras.
// Uso: node carrusel/panorama/escena.cjs   (desde la raíz). Textos y datos de MUESTRA, por verificar.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const RAIZ = path.resolve(__dirname, "..", "..");
const OUT = path.join(RAIZ, "out", "escena-leticia");
fs.mkdirSync(OUT, { recursive: true });
const url = (p) => "file:///" + path.join(RAIZ, p).replace(/\\/g, "/");
const N = 6, W = 1080, H = 1350, ANCHO = N * W, PX = 4;
const CUERDA_Y = 1060; // altura de la cuerda en los postes de las costuras
const C = { texto: "#1b1612", gris: "#6b5a45", rojo: "#c1121f", rojoOsc: "#7d0a13", papel: "#f3ead6", madera: "#6b4423", maderaOsc: "#3e2614" };

// ---------- fondo pixel art (se dibuja en el navegador, a baja resolución) ----------
const dibujo = `
const LW=${ANCHO / PX}, LH=${Math.ceil(H / PX)};
const cv=document.getElementById('fondo'); cv.width=LW; cv.height=LH; const g=cv.getContext('2d');
let s=7; const rnd=()=>((s=(s*16807)%2147483647)/2147483647);
const bayer=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const banda=(y0,y1,c0,c1)=>{for(let y=y0;y<y1;y++){const t=(y-y0)/(y1-y0);for(let x=0;x<LW;x++){g.fillStyle=((t*15)>bayer[y%4][x%4])?c1:c0;g.fillRect(x,y,1,1);}}};
// cielo en tres tramos con tramado
banda(0,70,'#c9d6d3','#dcd9c4'); banda(70,150,'#dcd9c4','#ecdcb8'); banda(150,230,'#ecdcb8','#f1d3a1');
// sol bajo
g.fillStyle='#f6e2b4'; for(let y=-14;y<=14;y++){const w=Math.sqrt(196-y*y)|0; g.fillRect(1290-w,170+y,w*2,1);}
// cordillera lejana: alta a la izquierda (Andes), baja hacia la selva
const cresta=(x)=>{const alto=Math.max(6, 95*Math.exp(-(((x-160)/330)**2))+55*Math.exp(-(((x-520)/180)**2)));
  return 214-alto*(0.75+0.25*Math.sin(x*0.05)*Math.sin(x*0.013))-6*Math.sin(x*0.11);};
for(let x=0;x<LW;x++){const y0=cresta(x)|0; g.fillStyle='#a9aeb0'; g.fillRect(x,y0,1,224-y0);
  if(y0<150){g.fillStyle='#e9eef0'; g.fillRect(x,y0,1,Math.max(1,(150-y0)/5|0));}}
// selva lejana
for(let x=0;x<LW;x++){const h=8+7*Math.abs(Math.sin(x*0.21))+5*Math.abs(Math.sin(x*0.057))+(x>350?6:0);
  g.fillStyle='#55705a'; g.fillRect(x,(222-h)|0,1,h|0);}
// río (el Amazonas, con reflejos)
g.fillStyle='#5f8d8f'; g.fillRect(0,222,LW,20);
g.fillStyle='#86b0ac'; for(let i=0;i<900;i++){const x=rnd()*LW|0, y=223+(rnd()*18|0); g.fillRect(x,y,3+(rnd()*6|0),1);}
g.fillStyle='#4b7476'; g.fillRect(0,241,LW,1);
// orilla con selva cercana
for(let x=0;x<LW;x++){const h=5+5*Math.abs(Math.sin(x*0.37))+4*Math.abs(Math.sin(x*0.09));
  g.fillStyle='#2f4a35'; g.fillRect(x,(250-h)|0,1,(h+2)|0); g.fillStyle='#3e5e43'; g.fillRect(x,(250-h)|0,1,2);}
// suelo y camino
banda(250,LH,'#7a5b3a','#5e4429');
for(let x=0;x<LW;x++){const yc=284+3*Math.sin(x*0.02); g.fillStyle='#b08a5c'; g.fillRect(x,yc|0,1,20); g.fillStyle='#c49c6a'; g.fillRect(x,(yc+3)|0,1,2);}
g.fillStyle='#8f6c45'; for(let i=0;i<1400;i++){g.fillRect(rnd()*LW|0,286+(rnd()*18|0),1,1);}
// pasto en primer plano
for(let i=0;i<2600;i++){const x=rnd()*LW|0, y=255+(rnd()*80|0); if(y>282&&y<306) continue; g.fillStyle=rnd()<.5?'#4f6b3a':'#6b8a4a'; g.fillRect(x,y,1,2+(rnd()*2|0));}
// neblina sobre lo lejano (profundidad)
g.fillStyle='rgba(240,228,200,.18)'; g.fillRect(0,120,LW,105);
`;

// ---------- piezas del escenario ----------
const sprite = (n, x, y, h, extra = "") => `<img src="${url(`public/personaje/v2/${n}.png`)}" style="position:absolute;left:${x}px;top:${y}px;height:${h}px;image-rendering:pixelated;${extra}">`;
const sombra = (x, y, w) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w / 5)}px;border-radius:50%;background:rgba(30,18,8,.35)"></div>`;
const personaje = (n, cx, pies, h) => `${sombra(cx - h * 0.28, pies - h * 0.05, h * 0.56)}<img src="${url(`public/personaje/v2/${n}.png`)}" style="position:absolute;left:${cx}px;top:${pies - h}px;height:${h}px;transform:translateX(-50%);image-rendering:pixelated">`;
const sup = (n) => `<sup style="font:700 .6em 'Playfair Display';color:${C.rojo};margin-left:3px">${n}</sup>`;
// cartel de madera con papel, clavado en dos patas que bajan hasta la orilla
// El cartel toma la altura de su texto; las patas bajan siempre hasta la orilla del río (y = 900).
const cartel = (x, y, w, h, html) => `
  <div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;background:${C.madera};padding:16px;
    box-shadow:inset 0 0 0 6px ${C.maderaOsc}, 0 16px 24px rgba(40,25,10,.35)">
    <div style="position:absolute;left:60px;top:100%;width:20px;height:calc(${900 - y}px - 100%);background:${C.maderaOsc}"></div>
    <div style="position:absolute;right:60px;top:100%;width:20px;height:calc(${900 - y}px - 100%);background:${C.maderaOsc}"></div>
    <div style="background:${C.papel};padding:28px 36px 32px;color:${C.texto}">${html}</div></div>`;
const etiqueta = (t) => `<div style="font:24px 'Special Elite';color:${C.gris};letter-spacing:3px">${t}</div>`;
const titular = (t, tam = 66) => `<div style="font:900 ${tam}px 'Playfair Display';line-height:1.02;margin:6px 0 16px">${t}</div>`;
const parrafo = (t) => `<div style="font:400 36px/1.36 'Source Serif 4',serif">${t}</div>`;

// postes de la cuerda: dos junto a cada costura (misma altura) y uno con la nota en el centro de cada lámina
const POSTE_ALTO = 150;
const poste = (x, y) => `<div style="position:absolute;left:${x - 9}px;top:${y - 6}px;width:18px;height:${POSTE_ALTO}px;background:linear-gradient(90deg,#4a2f18,#7a5330 40%,#3e2614);box-shadow:4px 0 0 rgba(0,0,0,.2)"></div>
  <div style="position:absolute;left:${x - 12}px;top:${y - 12}px;width:24px;height:12px;background:#5a3a1f"></div>`;
const L = (k, x, y) => [k * W + x, y];
const puntos = [];
for (let k = 0; k < N; k++) {
  if (k > 0) puntos.push(L(k, 70, CUERDA_Y));
  puntos.push(L(k, 540, CUERDA_Y - 30));
  if (k < N - 1) puntos.push(L(k, 1010, CUERDA_Y));
}
const tramo = ([x1, y1], [x2, y2]) => `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + Math.min(40, Math.abs(x2 - x1) * 0.07)} ${x2},${y2}`;
const cuerda = puntos.slice(1).map((p, i) => tramo(puntos[i], p)).join(" ");
const nota = ([x, y], n) => `<div style="position:absolute;left:${x - 26}px;top:${y + 8}px;width:52px;height:60px;background:${C.papel};transform:rotate(${n % 2 ? 6 : -5}deg);
  box-shadow:0 6px 8px rgba(0,0,0,.35);font:900 34px 'Playfair Display';color:${C.rojo};text-align:center;line-height:60px">${n}</div>`;

// ---------- láminas ----------
const textos = [
  cartel(110, 110, 860, 660, `${etiqueta("EXPEDIENTE · AMAZONAS")}${titular("¿Por qué Colombia tiene esta punta?", 72)}
    ${parrafo("Mira el sur de Colombia en un mapa. Hay una punta delgada que baja hasta el río Amazonas. Se llama el trapecio amazónico. No siempre fue colombiana. Vamos a seguir el hilo para saber cómo llegó a serlo.")}`),
  cartel(110, 110, 860, 660, `${etiqueta("LIMA · 1922")}${titular(`Un acuerdo escrito${sup(1)}`)}
    ${parrafo("En 1922, Colombia y Perú firmaron un tratado en Lima. Un tratado es un acuerdo escrito entre países. Allí dijeron por dónde pasaba la frontera. Perú le dejó a Colombia la punta que llega al Amazonas.")}`),
  cartel(110, 110, 860, 660, `${etiqueta("LETICIA · 1930")}${titular(`Leticia pasa a Colombia${sup(2)}`)}
    ${parrafo("Los dos países tardaron en aprobar el tratado. Colombia lo aprobó en 1925 y Perú en 1927. El 31 de julio de 1930, Perú entregó Leticia, un pueblo a orillas del Amazonas.")}`),
  cartel(110, 110, 860, 660, `${etiqueta("AMAZONAS · 1932")}${titular(`Una guerra en la selva${sup(3)}`)}
    ${parrafo("En 1932, un grupo de peruanos armados se tomó Leticia. Muchos en Perú no aceptaban el tratado. Colombia mandó barcos y soldados por los ríos. Hubo combates hasta 1933. Al final, Leticia volvió a Colombia.")}`),
  cartel(110, 110, 860, 660, `${etiqueta("LA PREGUNTA QUE QUEDA")}${titular("¿Quién decide dónde termina un país?")}
    ${parrafo("Una frontera parece una línea quieta. Pero detrás hay acuerdos, peleas y personas. Los pueblos indígenas del Amazonas vivían en este río mucho antes de cualquier tratado.")}`),
  cartel(110, 110, 860, 700, `${etiqueta("NINGÚN HILO SIN FUENTE")}${titular("Notas", 60)}
    <div style="font:400 28px/1.35 'Source Serif 4',serif;margin-bottom:14px">Cada número de la cuerda tiene aquí su fuente. Puedes revisarla tú mismo.</div>
    <ol style="padding-left:30px;font:20px/1.38 'Special Elite'">
      <li style="margin-bottom:9px">«Tratado de límites y navegación fluvial entre Colombia y Perú», Lima, [día] de [marzo o julio] de 1922, en [colección], [vol.], [p.].</li>
      <li style="margin-bottom:9px">[Nombre Apellido], <i>[Título del libro]</i> ([Ciudad]: [Editorial], [año]), [p.].</li>
      <li>[Nombre Apellido], «[Título del artículo]», <i>[Revista]</i> [vol.], n.º [n] ([año]): [p.], https://doi.org/[…].</li></ol>`),
];
const escena = [
  `${personaje("leo-mapa-despliega", 300, 1235, 280)}${sprite("ico-mula", 690, 1050, 150, "filter:drop-shadow(4px 6px 3px rgba(0,0,0,.3))")}`,
  `${personaje("leo-lupa", 320, 1240, 280)}${sprite("ico-mojon", 760, 1000, 170, "filter:drop-shadow(4px 6px 3px rgba(0,0,0,.3))")}`,
  `${sprite("ico-barco", 640, 820, 120)}${personaje("leo-mapa-camina", 330, 1240, 270)}`,
  `${sprite("ico-canoa", 180, 880, 60)}${sprite("ico-fuerte", 720, 860, 160)}${personaje("leo-gancho-manos-cabeza", 380, 1240, 280)}`,
  `${personaje("leo-piensa", 330, 1240, 270)}${sprite("ico-canoa", 700, 885, 56, "transform:scaleX(-1)")}`,
  `${sprite("obj-hilo", 470, 1120, 120)}${personaje("leo-saluda", 780, 1240, 260)}
   <div style="position:absolute;left:120px;top:1265px;font:900 38px 'Playfair Display';color:#f6eedd;text-shadow:0 2px 6px #000">Profe Leo <span style="font:24px 'Special Elite'">@leoelpasado</span></div>`,
];

const postes = puntos.map(([x, y]) => poste(x, y)).join("");
const notas = [1, 2, 3, 4].map((k) => (k < 4 ? nota(L(k, 540, CUERDA_Y - 30), k) : "")).join("");
const capas = textos.map((t, k) => `<div style="position:absolute;left:${k * W}px;top:0;width:${W}px;height:${H}px">${t}</div>`).join("") +
  postes +
  `<svg style="position:absolute;left:0;top:0" width="${ANCHO}" height="${H}">
     <path d="${cuerda}" stroke="#000" stroke-opacity=".3" stroke-width="7" fill="none" transform="translate(4,10)"/>
     <path d="${cuerda}" stroke="${C.rojoOsc}" stroke-width="7" fill="none"/><path d="${cuerda}" stroke="${C.rojo}" stroke-width="4" fill="none"/>
     <path d="${cuerda}" stroke="#ff7a82" stroke-width="1.5" stroke-dasharray="2 6" fill="none"/></svg>` +
  notas +
  escena.map((t, k) => `<div style="position:absolute;left:${k * W}px;top:0;width:${W}px;height:${H}px">${t}</div>`).join("");

const pagina = (guias) => `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&family=Source+Serif+4:opsz,wght@8..60,400&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{width:${ANCHO}px;height:${H}px;overflow:hidden;position:relative;background:#000}
#fondo{position:absolute;left:0;top:0;width:${ANCHO}px;height:${Math.ceil(H / PX) * PX}px;image-rendering:pixelated}</style></head><body>
<canvas id="fondo"></canvas><script>${dibujo}</script>${capas}
${guias ? [1, 2, 3, 4, 5].map((k) => `<div style="position:absolute;left:${k * W - 1}px;top:0;width:2px;height:${H}px;background:rgba(0,120,255,.8)"></div>`).join("") : ""}
${[...Array(N)].map((_, k) => `<div style="position:absolute;left:${k * W + W - 200}px;top:40px;font:20px 'Special Elite';color:${C.texto}">BOCETO · ${k + 1}/${N}</div>`).join("")}
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
