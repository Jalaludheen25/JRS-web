// Searches Wikimedia Commons for freely licensed video (CC0, public domain, CC BY) and builds a labelled
// contact sheet of poster frames per query, plus results.json with licence, author and transcode URLs.
// Usage: node scripts/search-commons-video.mjs <outDir> "query one" "query two" ...
import fs from "fs";
import sharp from "sharp";

const [out, ...queries] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const UA = "JRS-website-build/1.0 (https://jrs-me.com)";
const API = "https://commons.wikimedia.org/w/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OK_LICENSE = /^(cc0|public domain|pd|cc by \d|cc-by-\d|cc by \d\.\d$|cc by 4\.0|cc by 3\.0|cc by 2\.0)/i;

async function get(url) {
  for (let i = 0; i < 5; i++) {
    await sleep(400);
    const r = await fetch(url, { headers: { "user-agent": UA } });
    if (r.status !== 429) return r;
    await sleep(5000 * (i + 1));
  }
  throw new Error("rate limited");
}

const all = {};
for (const q of queries) {
  const params = new URLSearchParams({
    action: "query", format: "json", generator: "search", gsrsearch: `filetype:video ${q}`, gsrnamespace: "6", gsrlimit: "40",
    prop: "imageinfo|videoinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: "320", viprop: "derivatives",
  });
  const json = await (await get(`${API}?${params}`)).json();
  const pages = Object.values(json.query?.pages ?? {});
  const results = [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const lic = ii.extmetadata?.LicenseShortName?.value ?? "";
    const sa = /sa/i.test(lic) && !/^pd|public/i.test(lic);
    if (!OK_LICENSE.test(lic) || sa || /nc|nd/i.test(lic)) continue;
    if ((ii.width ?? 0) < 1280) continue;
    const deriv = (p.videoinfo?.[0]?.derivatives ?? []).map((d) => ({ src: d.src, w: d.width, h: d.height, type: d.type }));
    results.push({
      title: p.title, w: ii.width, h: ii.height, duration: ii.duration ?? null, license: lic,
      artist: (ii.extmetadata?.Artist?.value ?? "").replace(/<[^>]+>/g, "").trim().slice(0, 80),
      url: ii.url, page: ii.descriptionurl, thumb: ii.thumburl, deriv,
    });
  }
  const slug = q.replace(/\W+/g, "-");
  all[slug] = results.map((r, i) => ({ i, ...r }));

  const W = 320, H = 210, tiles = [];
  for (const [i, r] of results.entries()) {
    try {
      const t = await get(r.thumb);
      if (!t.ok) continue;
      const img = await sharp(Buffer.from(await t.arrayBuffer())).resize(W, H - 34, { fit: "cover" }).toBuffer();
      const esc = (s) => s.replace(/[&<>]/g, "");
      const label = Buffer.from(`<svg width="${W}" height="34"><rect width="100%" height="100%"/><text x="4" y="14" font-size="12" fill="#fff" font-family="Arial">${i} ${r.w}x${r.h} ${Math.round(r.duration ?? 0)}s ${esc(r.license)}</text><text x="4" y="29" font-size="11" fill="#bbb" font-family="Arial">${esc(r.title.replace("File:", "").slice(0, 46))}</text></svg>`);
      tiles.push(await sharp({ create: { width: W, height: H, channels: 3, background: "#000" } }).composite([{ input: img, top: 0, left: 0 }, { input: label, top: H - 34, left: 0 }]).png().toBuffer());
    } catch {}
  }
  if (tiles.length) {
    const cols = 5;
    await sharp({ create: { width: cols * W, height: Math.ceil(tiles.length / cols) * H, channels: 3, background: "#222" } })
      .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * W, top: Math.floor(i / cols) * H })))
      .jpeg({ quality: 78 }).toFile(`${out}/${slug}.jpg`);
  }
  console.log(q, "→", results.length);
}
fs.writeFileSync(`${out}/results.json`, JSON.stringify(all, null, 1));
