// Bocetos de exploración para el formato carrusel de @leoelpasado.
// Genera 4 direcciones (3 láminas cada una, 1080x1350) en HTML y las renderiza a PNG con Chrome sin ventana.
// Uso: node carrusel/exploracion/bocetos.cjs   (desde la raíz del repositorio)
// Los textos son de MUESTRA para juzgar la jerarquía visual; no son guion aprobado.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const DIR = __dirname;
const RAIZ = path.resolve(DIR, "..", "..");
const url = (p) => "file:///" + path.join(RAIZ, p).replace(/\\/g, "/");
const MAPA = JSON.parse(fs.readFileSync(path.join(DIR, "mapa-colombia-panama.json"), "utf8"));

// Paleta de src/marca.ts (no se inventan colores nuevos)
const C = {
  tinta: "#0d0b09", papel: "#e8dcc2", papelOscuro: "#cdbd9b", hueso: "#f4ead5",
  rojo: "#c1121f", rojoClaro: "#ff4d57", texto: "#1b1612", gris: "#6b5a45", apagado: "#a8977c",
};

const BASE = `
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Special+Elite&display=block" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#222;display:flex;gap:0;width:3240px;height:1350px;overflow:hidden}
  .l{position:relative;width:1080px;height:1350px;overflow:hidden;flex:none}
  .serif{font-family:'Playfair Display',serif}
  .tipo{font-family:'Special Elite',monospace}
  .boceto{position:absolute;top:28px;right:36px;font:18px 'Special Elite',monospace;letter-spacing:2px;opacity:.7}
  .num{position:absolute;bottom:36px;right:48px;font:22px 'Special Elite',monospace;letter-spacing:3px}
  .sello{position:absolute;border:5px solid ${C.rojo};color:${C.rojo};font:30px 'Special Elite',monospace;
         letter-spacing:4px;padding:10px 22px;transform:rotate(-6deg);opacity:.92}
  .leo{position:absolute;image-rendering:pixelated}
  .fuente{font:22px 'Special Elite',monospace;letter-spacing:1px}
</style>`;

const pagina = (titulo, laminas) =>
  `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title>${BASE}</head><body>${laminas.join("")}</body></html>`;

const marcaBoceto = (color) => `<div class="boceto" style="color:${color}">BOCETO · TEXTO DE MUESTRA</div>`;

// ---------- A. Noticiero desde la historia ----------
const regla = (c) => `<div style="height:4px;background:${c};margin:10px 0"></div><div style="height:1px;background:${c}"></div>`;
const A = [
  `<div class="l" style="background:${C.papel} url('${url("public/texturas/papel.jpg")}') center/cover;color:${C.texto}">
    ${marcaBoceto(C.gris)}
    <div style="position:absolute;left:80px;right:80px;top:90px;text-align:center">
      <div class="serif" style="font-size:120px;font-weight:900;letter-spacing:6px">EL PASADO</div>
      ${regla(C.texto)}
      <div class="tipo" style="display:flex;justify-content:space-between;font-size:24px;margin-top:12px;letter-spacing:2px">
        <span>EDICIÓN EXTRA</span><span>4 DE NOVIEMBRE DE 1903</span><span>RECREACIÓN</span></div>
      ${regla(C.texto)}
    </div>
    <div class="serif" style="position:absolute;left:80px;right:80px;top:400px;font-size:180px;font-weight:900;line-height:.92;text-align:center">PANAMÁ<br>SE SEPARA</div>
    <div class="serif" style="position:absolute;left:120px;right:120px;top:960px;font-size:62px;font-weight:700;text-align:center;font-style:italic">¿Por qué se fue?</div>
    <div class="sello" style="left:330px;top:1110px">NOTICIA DE HACE 123 AÑOS</div>
    <div class="num" style="color:${C.gris}">1 / 3 →</div>
  </div>`,
  `<div class="l" style="background:${C.papel} url('${url("public/texturas/papel.jpg")}') center/cover;color:${C.texto}">
    ${marcaBoceto(C.gris)}
    <div style="position:absolute;left:80px;right:80px;top:90px">
      <div class="serif" style="font-size:44px;font-weight:900;letter-spacing:3px;text-align:center">EL PASADO · PÁGINA 2</div>${regla(C.texto)}
    </div>
    <div style="position:absolute;left:80px;top:250px;width:430px">
      <div class="tipo" style="font-size:28px;color:${C.gris};letter-spacing:2px">LO QUE SE DIJO ENTONCES</div>
      <div class="serif" style="font-size:56px;font-weight:900;line-height:1.05;margin-top:24px">«Cita de la prensa de 1903»</div>
      <div class="tipo" style="font-size:26px;line-height:1.5;margin-top:24px">[Texto original, con periódico, fecha y página]</div>
      <div class="fuente" style="color:${C.gris};margin-top:30px">FUENTE: [periódico, 1903]</div>
    </div>
    <div style="position:absolute;left:539px;top:250px;width:2px;height:820px;background:${C.texto}"></div>
    <div style="position:absolute;left:570px;top:250px;width:430px">
      <div class="tipo" style="font-size:28px;color:${C.rojo};letter-spacing:2px">LO QUE SABEMOS HOY</div>
      <div class="serif" style="font-size:56px;font-weight:900;line-height:1.05;margin-top:24px">El dato que cambia la lectura</div>
      <div class="tipo" style="font-size:26px;line-height:1.5;margin-top:24px">[Hallazgo historiográfico, con autor y año]</div>
      <div class="fuente" style="color:${C.gris};margin-top:30px">FUENTE: [libro o artículo]</div>
    </div>
    <div class="tipo" style="position:absolute;left:80px;top:720px;width:430px;height:420px;border:3px dashed ${C.gris};display:flex;align-items:center;justify-content:center;text-align:center;font-size:26px;color:${C.gris};padding:30px">[Recorte del periódico original, con crédito]</div>
    <div class="tipo" style="position:absolute;left:570px;top:720px;width:430px;height:420px;border:3px dashed ${C.rojo};display:flex;align-items:center;justify-content:center;text-align:center;font-size:26px;color:${C.rojo};padding:30px">[Mapa, foto o documento que lo prueba]</div>
    <svg style="position:absolute;left:0;top:0" width="1080" height="1350"><path d="M470 930 C 540 990, 560 880, 610 930" stroke="${C.rojo}" stroke-width="6" fill="none"/>
      <circle cx="470" cy="930" r="12" fill="${C.rojo}"/><circle cx="610" cy="930" r="12" fill="${C.rojo}"/></svg>
    <div class="num" style="color:${C.gris}">2 / 3 →</div>
  </div>`,
  `<div class="l" style="background:${C.tinta};color:${C.hueso}">
    ${marcaBoceto(C.apagado)}
    <div class="tipo" style="position:absolute;left:90px;top:170px;font-size:30px;letter-spacing:4px;color:${C.rojoClaro}">LA PREGUNTA QUE QUEDA</div>
    <div class="serif" style="position:absolute;left:90px;right:90px;top:240px;font-size:96px;font-weight:900;line-height:1.02">¿Quién decide cuándo un territorio deja de ser nuestro?</div>
    <div style="position:absolute;left:90px;top:800px;width:560px">
      <div class="tipo" style="font-size:26px;color:${C.apagado};letter-spacing:3px">FUENTES</div>
      <div class="fuente" style="color:${C.hueso};line-height:1.7;margin-top:12px">1. [Fuente primaria]<br>2. [Fuente secundaria]<br>3. [Mapa o archivo]</div>
    </div>
    <img class="leo" src="${url("public/personaje/leo-senala.png")}" style="right:110px;bottom:120px;height:402px">
    <div class="serif" style="position:absolute;left:90px;bottom:110px;font-size:44px;font-weight:900">Profe Leo <span class="tipo" style="font-size:26px;font-weight:400;color:${C.apagado};margin-left:12px">@leoelpasado</span></div>
  </div>`,
];

// ---------- B. Expediente panorámico (el hilo cruza las láminas) ----------
const ficha = (x, y, w, txt, rot, extra = "") =>
  `<div class="tipo" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;background:${C.papel};color:${C.texto};padding:26px 28px;font-size:30px;line-height:1.35;transform:rotate(${rot}deg);box-shadow:0 10px 24px rgba(0,0,0,.55)">${txt}${extra}</div>`;
const pin = (x, y) => `<div style="position:absolute;left:${x - 14}px;top:${y - 14}px;width:28px;height:28px;border-radius:50%;background:${C.rojo};box-shadow:0 4px 8px rgba(0,0,0,.6)"></div>`;
const corcho = `background:${C.tinta} url('${url("public/texturas/corcho.jpg")}') center/cover`;
// El hilo es un solo trazo sobre 3240 px; cada lámina muestra su tercio
const hiloB = (i) => `<svg style="position:absolute;left:${-1080 * i}px;top:0;pointer-events:none" width="3240" height="1350">
   <path d="M330 470 C 700 520, 900 760, 1320 700 S 1900 520, 2180 640 S 2700 900, 2900 820" stroke="${C.rojo}" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
const B = [
  `<div class="l" style="${corcho}">
    <div style="position:absolute;inset:0;background:rgba(13,11,9,.35)"></div>
    ${marcaBoceto(C.hueso)}
    ${ficha(110, 300, 470, '<div style="font-size:26px;color:' + C.gris + '">EXPEDIENTE N.º 7</div><div style="font-size:24px;margin-top:6px">MEDELLÍN · 1895</div>', -3)}
    ${pin(330, 300)}
    <div class="serif" style="position:absolute;left:90px;right:90px;top:620px;font-size:118px;font-weight:900;line-height:.98;color:${C.hueso};text-shadow:0 4px 18px #000">¿Quiénes hacían los zapatos de la ciudad?</div>
    ${hiloB(0)}
    <div class="num" style="color:${C.hueso}">DESLIZA →</div>
  </div>`,
  `<div class="l" style="${corcho}">
    <div style="position:absolute;inset:0;background:rgba(13,11,9,.35)"></div>
    ${marcaBoceto(C.hueso)}
    <div style="position:absolute;left:150px;top:230px;width:780px;background:#f2ead8;padding:28px 28px 90px;transform:rotate(2deg);box-shadow:0 14px 30px rgba(0,0,0,.6)">
      <img src="${url("public/imagenes/zapateros-meliton-rodriguez.jpg")}" style="width:100%;height:560px;object-fit:cover;filter:grayscale(1) contrast(1.05)">
      <div class="tipo" style="position:absolute;left:30px;bottom:24px;font-size:24px;color:${C.texto}">«Los zapateros», Medellín, 1895</div>
    </div>
    ${pin(540, 240)}
    ${ficha(560, 1000, 430, 'FUENTE: Melitón Rodríguez. Dominio público (Wikimedia Commons)', -2)}
    ${hiloB(1)}
    <div class="num" style="color:${C.hueso}">2 / 3 →</div>
  </div>`,
  `<div class="l" style="${corcho}">
    <div style="position:absolute;inset:0;background:rgba(13,11,9,.35)"></div>
    ${marcaBoceto(C.hueso)}
    ${ficha(620, 650, 380, '<div style="font-size:24px;color:' + C.gris + '">LO QUE DICE LA FOTO</div><div style="margin-top:10px">[Hallazgo con fuente]</div>', 3)}
    ${pin(820, 820)}
    <div class="serif" style="position:absolute;left:90px;top:200px;width:880px;font-size:84px;font-weight:900;line-height:1.02;color:${C.hueso};text-shadow:0 4px 18px #000">Ningún hilo sin fuente.</div>
    <div class="tipo" style="position:absolute;left:90px;top:400px;width:560px;font-size:30px;line-height:1.45;color:${C.hueso}">¿Qué oficio de tu familia tiene una foto como esta?</div>
    ${hiloB(2)}
    <img class="leo" src="${url("public/personaje/leo-normal.png")}" style="left:120px;bottom:110px;height:402px">
    <div class="tipo" style="position:absolute;left:330px;bottom:130px;font-size:28px;color:${C.hueso}">Profe Leo · @leoelpasado</div>
  </div>`,
];

// ---------- C. El mapa que cambia ----------
const mapa = (panama, extra = "") => `<svg style="position:absolute;left:0;top:0" width="1080" height="1350"><g transform="translate(150,300) scale(0.8)">
   ${["ven", "ecu", "per", "bra", "cri", "nic"].map((k) => `<path d="${MAPA[k]}" fill="#1f1a15" stroke="${C.gris}" stroke-width="1.5"/>`).join("")}
   <path d="${MAPA.col}" fill="${C.papelOscuro}" stroke="${C.tinta}" stroke-width="2"/>
   <path d="${MAPA.pan}" ${panama}/>${extra}</g></svg>`;
const leyendaMapa = `<div class="fuente" style="position:absolute;left:90px;bottom:60px;color:${C.apagado};font-size:20px">ESQUEMA · Bordes actuales, Natural Earth (dominio público)</div>`;
const Cc = [
  `<div class="l" style="background:${C.tinta}">
    ${mapa(`fill="${C.papelOscuro}" stroke="${C.tinta}" stroke-width="2"`)}
    ${marcaBoceto(C.apagado)}
    <div class="tipo" style="position:absolute;left:90px;top:110px;font-size:34px;letter-spacing:6px;color:${C.rojoClaro}">1902</div>
    <div class="serif" style="position:absolute;left:90px;top:160px;width:620px;font-size:92px;font-weight:900;line-height:.98;color:${C.hueso}">Este mapa tenía una pieza más</div>
    ${leyendaMapa}<div class="num" style="color:${C.apagado}">1 / 3 →</div>
  </div>`,
  `<div class="l" style="background:${C.tinta}">
    ${mapa(`fill="${C.rojo}" stroke="${C.hueso}" stroke-width="3"`)}
    ${marcaBoceto(C.apagado)}
    <div class="tipo" style="position:absolute;left:90px;top:110px;font-size:34px;letter-spacing:6px;color:${C.rojoClaro}">3 DE NOVIEMBRE DE 1903</div>
    <div class="serif" style="position:absolute;left:90px;top:160px;width:640px;font-size:92px;font-weight:900;line-height:.98;color:${C.hueso}">Panamá declara su independencia</div>
    ${leyendaMapa}<div class="num" style="color:${C.apagado}">2 / 3 →</div>
  </div>`,
  `<div class="l" style="background:${C.tinta}">
    ${mapa(`fill="none" stroke="${C.rojo}" stroke-width="3" stroke-dasharray="10 8"`)}
    ${marcaBoceto(C.apagado)}
    <div class="serif" style="position:absolute;left:90px;top:150px;width:700px;font-size:84px;font-weight:900;line-height:1.02;color:${C.hueso}">La pregunta no es dónde. Es por qué.</div>
    <img class="leo" src="${url("public/personaje/leo-senala.png")}" style="right:90px;bottom:120px;height:335px">
    <div class="tipo" style="position:absolute;right:90px;bottom:90px;font-size:24px;color:${C.hueso}">@leoelpasado</div>
    ${leyendaMapa}
  </div>`,
];

// ---------- D. Documento anotado (la fuente a pantalla completa) ----------
const lineasBloch = [
  "Le bon historien, lui, ressemble",
  `à <span id="o" style="position:relative">l'ogre de la légende<svg style="position:absolute;left:-30px;top:-28px;overflow:visible" width="520" height="120"><ellipse cx="240" cy="44" rx="262" ry="58" fill="none" stroke="${C.rojo}" stroke-width="6" transform="rotate(-2 240 44)"/></svg></span>. Là où il`,
  "flaire la chair humaine, il sait",
  "que là est son gibier.",
];
const hoja = (inner) => `<div style="position:absolute;left:70px;right:70px;top:150px;bottom:170px;background:${C.papel} url('${url("public/texturas/papel.jpg")}') center/cover;box-shadow:0 18px 40px rgba(0,0,0,.6);color:${C.texto}">${inner}</div>`;
const D = [
  `<div class="l" style="background:${C.tinta}">
    ${marcaBoceto(C.apagado)}
    ${hoja(`<div class="tipo" style="padding:70px 64px;font-size:40px;line-height:1.9">${lineasBloch.join("<br>")}</div>
      <div class="fuente" style="position:absolute;left:64px;bottom:50px;color:${C.gris}">RECREACIÓN · Marc Bloch, Apologie pour l'histoire (1949), cap. I</div>`)}
    <div class="serif" style="position:absolute;left:90px;right:90px;bottom:40px;font-size:62px;font-weight:900;line-height:1;color:${C.hueso}">Un historiador se comparó con un ogro</div>
    <div class="num" style="color:${C.apagado};top:90px;bottom:auto">1 / 3 →</div>
  </div>`,
  `<div class="l" style="background:${C.tinta}">
    ${marcaBoceto(C.apagado)}
    ${hoja(`<div class="tipo" style="padding:120px 50px 0;font-size:96px;line-height:1.2">à <span style="border-bottom:10px solid ${C.rojo}">l'ogre</span><br>de la légende</div>
      <div class="serif" style="position:absolute;left:60px;right:60px;top:560px;font-size:54px;font-weight:700;font-style:italic;line-height:1.2">«al ogro de la leyenda»</div>
      <div class="tipo" style="position:absolute;left:60px;right:60px;top:760px;font-size:30px;line-height:1.5;color:${C.texto}">Nota al margen. [Por qué Bloch usa esa imagen, con fuente]</div>`)}
    <div class="num" style="color:${C.apagado}">2 / 3 →</div>
  </div>`,
  `<div class="l" style="background:${C.tinta};color:${C.hueso}">
    ${marcaBoceto(C.apagado)}
    <div class="tipo" style="position:absolute;left:90px;top:170px;font-size:30px;letter-spacing:4px;color:${C.rojoClaro}">EN VERSIÓN HABLADA</div>
    <div class="serif" style="position:absolute;left:90px;right:90px;top:240px;font-size:78px;font-weight:900;line-height:1.05">Donde huele carne humana, ahí sabe que está su presa.</div>
    <div class="tipo" style="position:absolute;left:90px;right:420px;top:720px;font-size:32px;line-height:1.45">¿Qué rastro tuyo encontraría un historiador dentro de cien años?</div>
    <img class="leo" src="${url("public/personaje/leo-normal.png")}" style="right:120px;bottom:110px;height:402px">
    <div class="fuente" style="position:absolute;left:90px;bottom:110px;color:${C.apagado}">FUENTE: Bloch, Apologie pour l'histoire<br>ou Métier d'historien, 1949, cap. I</div>
  </div>`,
];

const direcciones = { "A-noticiero": A, "B-expediente": B, "C-mapa": Cc, "D-documento": D };
const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((p) => fs.existsSync(p));
for (const [nombre, laminas] of Object.entries(direcciones)) {
  const html = path.join(DIR, `${nombre}.html`);
  fs.writeFileSync(html, pagina(nombre, laminas));
  const png = path.join(DIR, `${nombre}.png`);
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
    "--virtual-time-budget=8000", "--window-size=3240,1350", `--screenshot=${png}`, "file:///" + html.replace(/\\/g, "/")], { stdio: "ignore" });
  console.log("ok", path.relative(RAIZ, png));
}
