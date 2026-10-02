// Finds visually near-identical images (different files, same picture) using a 64-bit difference hash.
// Usage: node scripts/image-dupes.mjs <dir-or-file> [...]   (threshold: Hamming distance <= 10)
import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputs = process.argv.slice(2);
const files = inputs.flatMap((p) =>
  fs.statSync(p).isDirectory() ? fs.readdirSync(p).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => path.join(p, f)) : [p],
);

async function dhash(file) {
  // Trim flat borders first so banners with gradients/padding still match their source image.
  const buf = await sharp(file).flatten({ background: "#ffffff" }).trim({ threshold: 30 }).greyscale().resize(9, 8, { fit: "fill" }).raw().toBuffer();
  let bits = 0n;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits = (bits << 1n) | (buf[y * 9 + x] > buf[y * 9 + x + 1] ? 1n : 0n);
  return bits;
}
const dist = (a, b) => {
  let v = a ^ b, n = 0;
  while (v) { n += Number(v & 1n); v >>= 1n; }
  return n;
};

const hashes = [];
for (const f of files) {
  try { hashes.push({ f, h: await dhash(f) }); } catch {}
}
const pairs = [];
for (let i = 0; i < hashes.length; i++)
  for (let j = i + 1; j < hashes.length; j++) {
    const d = dist(hashes[i].h, hashes[j].h);
    if (d <= 10) pairs.push([d, hashes[i].f, hashes[j].f]);
  }
pairs.sort((a, b) => a[0] - b[0]);
for (const [d, a, b] of pairs) console.log(String(d).padStart(2), path.basename(a), "≈", path.basename(b));
console.log(`${hashes.length} images, ${pairs.length} near-duplicate pairs`);
