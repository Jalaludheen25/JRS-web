// Extracts every embedded raster image from the JRS brochure PDFs (../docs/source-pdf/*.pdf)
// into ../docs/source-pdf/extracted/, recording which page each appears on.
// Run from jrs-website/: node scripts/extract-pdf-images.mjs
import fs from "fs";
import path from "path";
import * as mupdf from "mupdf";
import sharp from "sharp";

const DIR = "../docs/source-pdf";
const OUT = path.join(DIR, "extracted");
fs.mkdirSync(OUT, { recursive: true });

const jobs = [];
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".pdf"))) {
  const doc = new mupdf.PDFDocument(fs.readFileSync(path.join(DIR, file)));
  const tag = path.basename(file, ".pdf");
  const seen = new Set();
  for (let p = 0; p < doc.countPages(); p++) {
    const page = doc.loadPage(p);
    // Walk page XObjects, recursing into Form XObjects (backgrounds are often nested there).
    const visit = (resources, depth) => {
      const xobjs = resources.get("XObject");
      if (xobjs.isNull()) return;
      xobjs.forEach((ref, key) => {
        const obj = ref.resolve();
        const subtype = obj.get("Subtype").toString();
        if (subtype === "/Form" && depth < 4) {
          const res = obj.get("Resources");
          if (!res.isNull()) visit(res, depth + 1);
          return;
        }
        if (subtype !== "/Image") return;
        const id = ref.isIndirect() ? ref.asIndirect() : `${p}-${key}`;
        if (seen.has(id)) return;
        seen.add(id);
        const img = doc.loadImage(ref);
        if (img.getWidth() < 300 || img.getHeight() < 200) return; // icons, logos, badges
        jobs.push({ name: `${tag}-p${String(p + 1).padStart(2, "0")}-${id}`, page: p + 1, img });
      });
    };
    visit(page.getObject().get("Resources"), 0);
  }
}

const index = [];
for (const j of jobs) {
  const w = j.img.getWidth();
  const h = j.img.getHeight();
  // mupdf returns colour and soft mask separately: rejoin them so cut-outs keep clean edges.
  // Pixmaps come back without alpha (n=3); do not call removeAlpha() — sharp would apply it after joinChannel.
  let img = sharp(Buffer.from(j.img.toPixmap().asPNG())).toColourspace("srgb");
  const mask = j.img.getMask();
  if (mask) {
    const alpha = await sharp(Buffer.from(mask.toPixmap().asPNG())).resize(w, h).extractChannel(0).toBuffer();
    img = img.joinChannel(alpha);
  }
  const png = path.join(OUT, `${j.name}.png`);
  await img.png().toFile(png);
  await sharp(png).flatten({ background: "#ffffff" }).jpeg({ quality: 90 }).toFile(path.join(OUT, `${j.name}.jpg`));
  index.push({ name: j.name, page: j.page, w, h, alpha: !!mask });
  console.log(`${j.name.padEnd(40)} ${w}x${h}${mask ? " (alpha)" : ""}`);
}
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 1));
