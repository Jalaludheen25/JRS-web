// Frame contact sheets for each source clip (timestamps burned in), used to choose in/out points.
// Usage: node scripts/footage-sheets.mjs <outDir> [frames=20]
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import sharp from "sharp";

const [out, n = "20"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const sources = JSON.parse(fs.readFileSync("../docs/source-video/sources.json", "utf8"));
for (const s of sources) {
  const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", s.file]).toString().trim());
  const W = 320, H = 180, tiles = [];
  for (let i = 0; i < Number(n); i++) {
    const t = (dur * (i + 0.5)) / Number(n);
    const buf = execFileSync("ffmpeg", ["-v", "error", "-ss", t.toFixed(2), "-i", s.file, "-frames:v", "1", "-vf", `scale=${W}:${H}`, "-f", "image2pipe", "-vcodec", "png", "-"], { maxBuffer: 1 << 26 });
    const label = Buffer.from(`<svg width="${W}" height="20"><rect width="70" height="20" fill="#000"/><text x="4" y="15" font-size="13" fill="#ff0" font-family="Arial">${t.toFixed(1)}s</text></svg>`);
    tiles.push(await sharp(buf).composite([{ input: label, top: 0, left: 0 }]).png().toBuffer());
  }
  const cols = 5;
  await sharp({ create: { width: cols * W, height: Math.ceil(tiles.length / cols) * H, channels: 3, background: "#000" } })
    .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * W, top: Math.floor(i / cols) * H })))
    .jpeg({ quality: 75 }).toFile(path.join(out, `${s.id}.jpg`));
  console.log(s.id, dur.toFixed(1) + "s");
}
