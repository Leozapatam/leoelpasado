// npm run render -- <slug>   ->  out/<slug>.mp4
// Usa las dependencias de ~/leoelpasado-deps si existen (la carpeta del proyecto vive en Google Drive).
const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const slug = process.argv[2] || "capitulo-0";
const deps = path.join(os.homedir(), "leoelpasado-deps", "node_modules");
const local = fs.existsSync(deps);
const cli = local ? `node "${path.join(deps, "@remotion", "cli", "remotion-cli.js")}"` : "npx remotion";
execSync(`${cli} render src/index.ts Episodio out/${slug}.mp4 --props="{\\"slug\\":\\"${slug}\\"}" --codec=h264 --crf=18 --audio-bitrate=256k`, {
  stdio: "inherit",
  env: local ? { ...process.env, NODE_PATH: deps } : process.env,
});
