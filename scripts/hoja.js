// Hoja de contactos: renderiza varios momentos de un episodio en una sola pasada (empaqueta una vez).
// Uso: node scripts/hoja.js <slug> <seg1,seg2,...> [--guias]
//   Los segundos son de la VOZ (la entrada se suma sola). Salida: out/hoja-<slug>/NN.png
const path = require("path");
const fs = require("fs");
const os = require("os");

// dependencias fuera de Google Drive (ver remotion.config.ts)
const DEPS = path.join(os.homedir(), "leoelpasado-deps", "node_modules");
const req = (m) => require(fs.existsSync(path.join(DEPS, m)) ? path.join(DEPS, m) : m);
const { bundle } = req("@remotion/bundler");
const { selectComposition, renderStill } = req("@remotion/renderer");

(async () => {
  const [slug, lista, flag] = process.argv.slice(2);
  const raiz = path.join(__dirname, "..");
  const ep = JSON.parse(fs.readFileSync(path.join(raiz, "public", "episodios", slug, "episodio.json"), "utf8"));
  const intro = ep.intro?.duracion ?? 0;
  const segs = lista.split(",").map(Number);
  const out = path.join(raiz, "out", `hoja-${slug}`);
  fs.mkdirSync(out, { recursive: true });

  const serveUrl = await bundle({
    entryPoint: path.join(raiz, "src", "index.ts"),
    webpackOverride: (c) =>
      fs.existsSync(DEPS)
        ? { ...c, resolve: { ...c.resolve, modules: [...(c.resolve?.modules ?? ["node_modules"]), DEPS] },
            resolveLoader: { ...c.resolveLoader, modules: [...(c.resolveLoader?.modules ?? ["node_modules"]), DEPS] } }
        : c,
  });
  const inputProps = { slug, guias: flag === "--guias" };
  const composition = await selectComposition({ serveUrl, id: "Episodio", inputProps });
  for (let i = 0; i < segs.length; i++) {
    const frame = Math.round((segs[i] + intro) * 30);
    await renderStill({ composition, serveUrl, inputProps, frame, scale: 0.3, output: path.join(out, `${String(i).padStart(2, "0")}.png`) });
    process.stdout.write(`${segs[i]}s `);
  }
  console.log(`\nlisto: ${out}`);
})();
