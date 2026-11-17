// Grabadora local de @leoelpasado: sirve la página y guarda cada toma en ../grabaciones
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4567;
const OUT = path.join(__dirname, "..", "grabaciones");
fs.mkdirSync(OUT, { recursive: true });

const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

http
  .createServer((req, res) => {
    if (req.method === "POST" && req.url.startsWith("/upload")) {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      const kind = url.searchParams.get("kind") === "video" ? "video" : "voz";
      const name = `${kind}-${stamp()}.webm`;
      const file = fs.createWriteStream(path.join(OUT, name));
      req.pipe(file);
      file.on("finish", () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, name }));
        console.log("Guardado:", name);
      });
      return;
    }
    if (req.url === "/guion") {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      fs.createReadStream(path.join(__dirname, "..", "guion.md")).pipe(res);
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream(path.join(__dirname, "index.html")).pipe(res);
  })
  .listen(PORT, () => console.log(`Grabadora en http://localhost:${PORT}`));
