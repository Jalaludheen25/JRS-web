// Turns the raw extraction (../docs/source-content/extracted.json) into clean page content
// for the rebuild: src/content/legacy-pages.json. Copy is kept verbatim; only template clutter is removed.
// Images referenced by pages are downloaded once into public/images/legacy/.
// Run from jrs-website/: node scripts/build-pages.mjs
import fs from "fs";
import path from "path";
import sharp from "sharp";

const SRC = "../docs/source-content/extracted.json";
const OUT = "src/content/legacy-pages.json";
const IMG_DIR = "public/images/legacy";
fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(path.dirname(OUT), { recursive: true });

const data = JSON.parse(fs.readFileSync(SRC, "utf8"));

// Routes rebuilt as bespoke pages or redirected — their raw blocks are not used directly.
const SKIP_ROUTES = new Set(["/", "/about/", "/contact/", "/products/", "/blogs/", "/industries/", "/engine-parts/", "/error/", "/error-page/", "/author/tklmarketing01gmail-com/", "/category/cummins/", "/category/fuel-injection/", "/category/marine-engine-spare-parts/"]);

// Card headings on the industry hub pages; those grids are rebuilt from content.ts.
const CARD_HEADINGS = new Set(["Products", "Services", "Engine Bearings", "Cylinder Heads & Components", "Fuel Injection Systems", "Pistons & Piston Rings", "Liners & Anti Polishing Rings", "Filters", "Turbochargers & Cartridges", "Coolers & Heat Exchangers", "Engine Overhauls", "Turbocharger Overhauls"]);

const DATE_RE = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/;

async function localImage(src) {
  const name = path.basename(new URL(src).pathname).replace(/\.(png|jpe?g|webp)$/i, ".jpg").toLowerCase();
  const file = path.join(IMG_DIR, name);
  if (!fs.existsSync(file)) {
    const res = await fetch(src, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`${res.status} ${src}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).flatten({ background: "#ffffff" }).resize({ width: 1800, withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toFile(file);
  }
  const meta = await sharp(file).metadata();
  // Normalise Windows separators before stripping the public/ prefix.
  return { src: "/" + file.replace(/\\/g, "/").replace(/^public\//, ""), width: meta.width, height: meta.height };
}

const out = {};
for (const [route, { blocks: raw }] of Object.entries(data)) {
  if (SKIP_ROUTES.has(route)) continue;
  let blocks = [...raw];

  // Everything before the H1 is template chrome ("Products & services for the", etc.).
  const h1i = blocks.findIndex((b) => b.type === "h1");
  const h1 = blocks[h1i]?.text;
  blocks = blocks.slice(h1i + 1);

  // Posts end with related posts and a newsletter block.
  const cut = blocks.findIndex((b) => /^h[1-6]$/.test(b.type) && /^(Related Posts|Join Our Newsletter)$/i.test(b.text));
  if (cut >= 0) blocks = blocks.slice(0, cut);

  // Post date is rendered as a one-item list straight after the H1.
  let date;
  if (blocks[0]?.type === "list" && blocks[0].items.length === 1 && DATE_RE.test(blocks[0].items[0])) {
    date = blocks[0].items[0];
    blocks = blocks.slice(1);
  }

  // First image straight after the title is the featured image.
  let featured;
  if (blocks[0]?.type === "img") {
    featured = { ...(await localImage(blocks[0].src)), alt: blocks[0].alt || h1 };
    blocks = blocks.slice(1);
  }

  // Industry hubs: drop the product/service card grid (rebuilt from structured data).
  blocks = blocks.filter((b) => !(b.type === "img" || (/^h[1-6]$/.test(b.type) && CARD_HEADINGS.has(b.text))));

  // Merge runs of single-item lists (Elementor renders each bullet as its own list).
  const merged = [];
  for (const b of blocks) {
    const prev = merged[merged.length - 1];
    if (b.type === "list" && prev?.type === "list" && !prev.ordered && !b.ordered && (prev.items.length === 1 || b.items.length === 1)) prev.items.push(...b.items);
    else merged.push(b.type === "list" ? { ...b, items: [...b.items] } : b);
  }

  // A page whose first paragraph follows the H1 directly uses it as the hero lead.
  let lead;
  if (!date && merged[0]?.type === "p") lead = merged.shift().text;

  out[route] = { h1, ...(lead && { lead }), ...(date && { date }), ...(featured && { featured }), blocks: merged };
  console.log(route.padEnd(76), String(merged.length).padStart(3), date ?? "", featured ? "img" : "");
}

fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log("wrote", OUT, Object.keys(out).length, "pages");
