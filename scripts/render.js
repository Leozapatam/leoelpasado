// npm run render -- <slug>   ->  out/<slug>.mp4
const { execSync } = require("child_process");
const slug = process.argv[2] || "bananeras";
execSync(
  `npx remotion render src/index.ts Episodio out/${slug}.mp4 --props="{\\"slug\\":\\"${slug}\\"}" --codec=h264 --crf=18 --audio-bitrate=256k`,
  { stdio: "inherit" }
);
