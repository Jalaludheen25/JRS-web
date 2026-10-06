// Builds the logo and badge assets for the "Supported companies", "Replacement engine spare parts" and
// "Accredited & certified" sections from the previous website's originals (../docs/source-logos/, see sources.json).
//
//  makes/  engine-maker logos → public/images/makes/<slug>.png: white backgrounds removed, trimmed, and placed on a
//          uniform 480×240 transparent canvas at a matched optical size (equal area, per-logo weight), so the grid
//          reads evenly whatever each logo's proportions.
//  certs/  certification badges → public/images/certifications/<slug>.png: background removed, trimmed, 300px tall.
//  parts/  product tiles → public/images/parts/<slug>.png: the label pill baked into each image is cut off (the site
//          sets the label as real text), background removed, product centred on a 640×480 canvas.
//  Interstate-McBee logo → public/images/certifications/interstate-mcbee.png, from company-profile.pdf page 8.
//
// Run from jrs-website/: node scripts/build-logo-assets.mjs [outDirForContactSheet]
import fs from "fs";
import path from "path";
import * as mupdf from "mupdf";
import sharp from "sharp";

const SRC = "../docs/source-logos";
const OUT = "public/images";

// ── pixel helpers ───────────────────────────────────────────────────────────────────────────────
async function load(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

// Make the background transparent: flood-fill from the border through near-white (or already transparent) pixels.
// Enclosed white (inside letters or badges) is kept.
function clearBackground(img, tol = 28) {
  const { data, w, h } = img;
  const isBg = (i) => data[i + 3] < 16 || 765 - (data[i] + data[i + 1] + data[i + 2]) <= tol * 3;
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    if (!isBg(p * 4)) continue;
    data[p * 4 + 3] = 0;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - w);
    if (y < h - 1) stack.push(p + w);
  }
  // Soften the light anti-aliasing fringe left around the cut: alpha follows how far a pixel is from white.
  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    if (data[i + 3] === 0) continue;
    const x = p % w, y = (p / w) | 0;
    const nearCut = [p - 1, p + 1, p - w, p + w].some((q, k) => (k === 0 ? x > 0 : k === 1 ? x < w - 1 : k === 2 ? y > 0 : y < h - 1) && data[q * 4 + 3] === 0);
    if (!nearCut) continue;
    const darkness = (765 - (data[i] + data[i + 1] + data[i + 2])) / 765;
    data[i + 3] = Math.min(data[i + 3], Math.round(255 * Math.min(1, darkness * 3)));
  }
  return img;
}

function bbox({ data, w, h }, minAlpha = 12) {
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] >= minAlpha) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

const toSharp = ({ data, w, h }) => sharp(Buffer.from(data), { raw: { width: w, height: h, channels: 4 } });
const trimmed = async (img) => toSharp(img).extract(bbox(img)).png().toBuffer({ resolveWithObject: true });

async function place(buf, width, height, canvasW, canvasH) {
  const logo = await sharp(buf).resize(Math.round(width), Math.round(height), { fit: "fill", kernel: "lanczos3" }).toBuffer();
  return sharp({ create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: logo, left: Math.round((canvasW - width) / 2), top: Math.round((canvasH - height) / 2) }])
    .png({ compressionLevel: 9, palette: false });
}

const written = [];
async function save(pipeline, file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await pipeline.toFile(file);
  written.push(file);
  console.log(file.padEnd(52), `${(fs.statSync(file).size / 1e3).toFixed(0)} KB`);
}

// ── engine makes ────────────────────────────────────────────────────────────────────────────────
// weight < 1 for visually heavy marks (solid black / large colour fields), > 1 for light, thin ones.
const makes = {
  caterpillar: 0.82, cummins: 0.78, "detroit-diesel": 1.0, perkins: 1.0, wartsila: 1.05, doosan: 0.86,
  mak: 0.98, man: 1.12, deutz: 1.02, yanmar: 0.9, mitsubishi: 0.96,
};
for (const [slug, weight] of Object.entries(makes)) {
  const img = clearBackground(await load(path.join(SRC, "makes", `${slug}.png`)));
  const { data: buf, info } = await trimmed(img);
  const W = 480, H = 240, area = W * H * 0.3 * weight;
  const aspect = info.width / info.height;
  let w = Math.sqrt(area * aspect), h = Math.sqrt(area / aspect);
  const fit = Math.min(1, 420 / w, 176 / h);
  w *= fit;
  h *= fit;
  await save(await place(buf, w, h, W, H), path.join(OUT, "makes", `${slug}.png`));
}

// ── certification badges ────────────────────────────────────────────────────────────────────────
for (const slug of ["icv", "iso-9001-2015", "iso-14001-2015", "iso-45001-2018"]) {
  const img = clearBackground(await load(path.join(SRC, "certs", `${slug}.jpg`)), 18);
  const { data: buf } = await trimmed(img);
  await save(sharp(buf).resize({ height: 300, kernel: "lanczos3" }).png({ compressionLevel: 9 }), path.join(OUT, "certifications", `${slug}.png`));
}

// Interstate-McBee logo from the company profile (page 8), the only distributor relationship JRS states.
{
  const doc = new mupdf.PDFDocument(fs.readFileSync("../docs/source-pdf/company-profile.pdf"));
  let found = null;
  const page = doc.loadPage(7);
  page.getObject().get("Resources").get("XObject").forEach((ref) => {
    const obj = ref.resolve();
    if (obj.get("Subtype").toString() !== "/Image") return;
    const im = doc.loadImage(ref);
    if (im.getWidth() === 499 && im.getHeight() === 116) found = im;
  });
  if (!found) throw new Error("Interstate-McBee logo not found on company-profile.pdf p.8");
  let s = sharp(Buffer.from(found.toPixmap().asPNG())).toColourspace("srgb");
  const mask = found.getMask();
  if (mask) s = s.joinChannel(await sharp(Buffer.from(mask.toPixmap().asPNG())).resize(499, 116).extractChannel(0).toBuffer());
  const img = clearBackground(await load(await s.png().toBuffer()), 18);
  const { data: buf } = await trimmed(img);
  await save(sharp(buf).resize({ height: 160, kernel: "lanczos3" }).png({ compressionLevel: 9 }), path.join(OUT, "certifications", "interstate-mcbee.png"));
}

// ── replacement spare parts ─────────────────────────────────────────────────────────────────────
for (const file of fs.readdirSync(path.join(SRC, "parts")).filter((f) => f.endsWith(".png"))) {
  const img = await load(path.join(SRC, "parts", file));
  const { data, w } = img;
  // The label is a royal-blue pill near the bottom: find its first row and cut everything from there down.
  const isPill = (i) => data[i + 2] > 120 && data[i + 2] - data[i] > 70 && data[i + 1] < 120;
  let pillTop = img.h;
  for (let y = Math.floor(img.h * 0.5); y < img.h; y++) {
    let n = 0;
    for (let x = 0; x < w; x++) if (isPill((y * w + x) * 4)) n++;
    if (n > 60) { pillTop = y; break; }
  }
  for (let y = Math.max(0, pillTop - 6); y < img.h; y++) for (let x = 0; x < w; x++) data[(y * w + x) * 4 + 3] = 0;
  clearBackground(img, 14);
  const { data: buf, info } = await trimmed(img);
  const W = 640, H = 480;
  const scale = Math.min(560 / info.width, 400 / info.height, 1.6);
  await save(await place(buf, info.width * scale, info.height * scale, W, H), path.join(OUT, "parts", file));
}

// Optional contact sheet on a light tile background to eyeball the results.
const [sheetDir] = process.argv.slice(2);
if (sheetDir) {
  fs.mkdirSync(sheetDir, { recursive: true });
  const tiles = await Promise.all(written.map(async (f) => sharp(f).resize(300, 150, { fit: "contain", background: "#ffffff" }).flatten({ background: "#ffffff" }).png().toBuffer()));
  const cols = 5, rows = Math.ceil(tiles.length / cols);
  await sharp({ create: { width: cols * 310 + 10, height: rows * 160 + 10, channels: 3, background: "#dfe6f0" } })
    .composite(tiles.map((t, i) => ({ input: t, left: 10 + (i % cols) * 310, top: 10 + Math.floor(i / cols) * 160 })))
    .png().toFile(path.join(sheetDir, "logo-assets.png"));
  console.log("sheet:", path.join(sheetDir, "logo-assets.png"));
}
