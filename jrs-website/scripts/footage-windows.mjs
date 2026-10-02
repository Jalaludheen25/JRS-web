// Close-up frame strips for candidate in/out windows: node scripts/footage-windows.mjs <outFile> "id:start:end" ...
import { execFileSync } from "child_process";
import sharp from "sharp";
import fs from "fs";

const [out, ...wins] = process.argv.slice(2);
const sources = Object.fromEntries(JSON.parse(fs.readFileSync("../docs/source-video/sources.json", "utf8")).map((s) => [s.id, s.file]));
const W = 288, H = 162, N = 6, rows = [];
for (const w of wins) {
  const [id, a, b] = w.split(":");
  const tiles = [];
  for (let i = 0; i < N; i++) {
    const t = Number(a) + ((Number(b) - Number(a)) * i) / (N - 1);
    const buf = execFileSync("ffmpeg", ["-v", "error", "-ss", t.toFixed(2), "-i", sources[id], "-frames:v", "1", "-vf", `scale=${W}:${H}`, "-f", "image2pipe", "-vcodec", "png", "-"], { maxBuffer: 1 << 26 });
    const label = Buffer.from(`<svg width="${W}" height="18"><rect width="${W}" height="18" fill="#000" opacity=".7"/><text x="4" y="13" font-size="12" fill="#ff0" font-family="Arial">${id} ${t.toFixed(1)}s</text></svg>`);
    tiles.push(await sharp(buf).composite([{ input: label, top: 0, left: 0 }]).png().toBuffer());
  }
  rows.push(tiles);
}
await sharp({ create: { width: W * N, height: H * rows.length, channels: 3, background: "#000" } })
  .composite(rows.flatMap((r, y) => r.map((t, x) => ({ input: t, left: x * W, top: y * H }))))
  .jpeg({ quality: 78 }).toFile(out);
