import sharp from "sharp";
import fs from "fs";
const dirs = ["C:/Users/PC/AppData/Local/Temp/claude/e--development-JRS/b331059e-9c09-427f-af2f-6a5c0386e8bc/scratchpad/live2", "public/images/scenes"];
const files = dirs.flatMap((d) => fs.readdirSync(d).filter((f) => /\.(png|jpe?g)$/.test(f) && !f.includes("-graded")).map((f) => d + "/" + f));
const W = 300, H = 200;
const tiles = await Promise.all(files.map(async (f, i) => {
  const m = await sharp(f).metadata();
  const img = await sharp(f).resize(W, H - 24, { fit: "contain", background: "#888" }).flatten({ background: "#888" }).toBuffer();
  const label = Buffer.from('<svg width="' + W + '" height="24"><rect width="100%" height="100%"/><text x="4" y="17" font-size="13" fill="#fff" font-family="Arial">' + i + " " + f.split("/").pop().slice(0, 30) + " " + m.width + "x" + m.height + "</text></svg>");
  return sharp({ create: { width: W, height: H, channels: 3, background: "#000" } }).composite([{ input: img, top: 0, left: 0 }, { input: label, top: H - 24, left: 0 }]).png().toBuffer();
}));
const cols = 5;
await sharp({ create: { width: cols * W, height: Math.ceil(files.length / cols) * H, channels: 3, background: "#222" } }).composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * W, top: Math.floor(i / cols) * H }))).jpeg({ quality: 80 }).toFile("../.check.jpg");
console.log(files.length);
