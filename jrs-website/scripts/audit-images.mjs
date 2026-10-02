// Image-repetition audit of the running site (default http://localhost:3100), in a real browser.
// For every sitemap URL, at desktop (1440) and mobile (390) widths, it collects the images a visitor can see
// and checks:
//   1. Hero/section images (anything not tagged data-img-role="thumb") are used on exactly one page.
//   2. Thumbnails (cards linking to a page) show the image of the page they link to.
//   3. No picture is shown twice on the same page.
//   4. No two different files are visually the same picture (perceptual hash).
// Usage: node scripts/audit-images.mjs [baseUrl]
import { chromium } from "playwright-core";
import sharp from "sharp";
import path from "path";

const BASE = process.argv[2] ?? "http://localhost:3100";
const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const decode = (src) => {
  if (!src) return null;
  const u = new URL(src, BASE);
  return u.pathname.startsWith("/_next/image") ? decodeURIComponent(u.searchParams.get("url")) : u.pathname;
};

const uses = new Map(); // src -> [{page, role, link}]
const problems = [];

for (const [label, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport });
  for (const url of urls) {
    await page.goto(BASE + url, { waitUntil: "load" });
    const imgs = await page.evaluate(() =>
      [...document.querySelectorAll("main img")]
        .filter((img) => {
          const r = img.getBoundingClientRect();
          if (r.width < 8 || r.height < 8) return false;
          for (let el = img; el; el = el.parentElement) {
            const cs = getComputedStyle(el);
            if (cs.display === "none" || cs.visibility === "hidden") return false;
          }
          return true;
        })
        .map((img) => ({ src: img.getAttribute("src"), role: img.dataset.imgRole ?? "hero", link: img.closest("a")?.getAttribute("href") ?? null })),
    );
    const seen = new Map();
    for (const im of imgs) {
      const src = decode(im.src);
      if (!src || src.endsWith(".svg")) continue;
      if (seen.has(src)) problems.push(`[${label}] shown twice on ${url}: ${src}`);
      seen.set(src, im);
      if (label === "desktop" || !uses.has(src)) {
        const list = uses.get(src) ?? [];
        if (!list.some((u) => u.page === url && u.role === im.role)) list.push({ page: url, role: im.role, link: im.link });
        uses.set(src, list);
      }
    }
  }
  await page.close();
}
await browser.close();

// Identity image of each page = its hero image(s).
const heroOf = new Map();
for (const [src, list] of uses) for (const u of list) if (u.role === "hero") heroOf.set(u.page, [...(heroOf.get(u.page) ?? []), src]);

for (const [src, list] of uses) {
  const heroes = list.filter((u) => u.role === "hero");
  if (heroes.length > 1) problems.push(`hero/section image used on ${heroes.length} pages: ${src}  (${heroes.map((h) => h.page).join(", ")})`);
  for (const t of list.filter((u) => u.role === "thumb")) {
    const target = t.link && heroOf.has(t.link) ? t.link : null;
    if (target && !heroOf.get(target).includes(src)) problems.push(`thumbnail on ${t.page} → ${t.link} does not match that page's image: ${src}`);
    if (!heroes.length && ![...heroOf.values()].some((h) => h.includes(src))) problems.push(`thumbnail is not any page's own image: ${src} on ${t.page}`);
  }
}

// Perceptual near-duplicates between different files.
async function dhash(file) {
  const buf = await sharp(file).flatten({ background: "#ffffff" }).trim({ threshold: 30 }).greyscale().resize(9, 8, { fit: "fill" }).raw().toBuffer();
  let bits = 0n;
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits = (bits << 1n) | (buf[y * 9 + x] > buf[y * 9 + x + 1] ? 1n : 0n);
  return bits;
}
const hashes = [];
for (const src of uses.keys()) hashes.push({ src, h: await dhash(path.join("public", src)) });
for (let i = 0; i < hashes.length; i++)
  for (let j = i + 1; j < hashes.length; j++) {
    let v = hashes[i].h ^ hashes[j].h, d = 0;
    while (v) { d += Number(v & 1n); v >>= 1n; }
    // Graded variants of the same photo are deliberately different files of one picture; flag those too.
    if (d <= 10) problems.push(`visually near-identical (distance ${d}): ${hashes[i].src} ≈ ${hashes[j].src}`);
  }

const placements = [...uses.values()].flat();
console.log(`${urls.length} pages · ${uses.size} distinct images · ${placements.filter((u) => u.role === "hero").length} hero/section placements · ${placements.filter((u) => u.role === "thumb").length} thumbnail placements`);
console.log(problems.length ? problems.join("\n") : "No repeated images: every page and section has its own picture; thumbnails match their target pages.");
process.exitCode = problems.length ? 1 : 0;
