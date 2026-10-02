// Searches Openverse for CC0 / public-domain images (Wikimedia Commons, StockSnap — rawpixel is excluded: its files are watermarked) and builds a labelled contact sheet per query,
// so candidates can be reviewed visually before anything is downloaded at full size.
// Usage: node scripts/search-openverse.mjs <outDir> "query one" "query two" ...
import fs from "fs";
import sharp from "sharp";

const [out, ...queries] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const all = {};

for (const q of queries) {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=cc0,pdm&source=wikimedia,stocksnap,nasa,spacex&page_size=20&mature=false`;
  const res = await fetch(url, { headers: { "user-agent": "JRS-website-build/1.0" } });
  const json = await res.json();
  const results = (json.results ?? []).filter((r) => (r.width ?? 0) >= 1200);
  const slug = q.replace(/\W+/g, "-");
  all[slug] = results.map((r, i) => ({ i, id: r.id, title: r.title, creator: r.creator, license: r.license, source: r.source, url: r.url, landing: r.foreign_landing_url, w: r.width, h: r.height, thumb: r.thumbnail }));

  const W = 320, H = 220;
  const tiles = [];
  for (const [i, r] of results.entries()) {
    try {
      const t = await fetch(r.thumbnail, { headers: { "user-agent": "JRS-website-build/1.0" } });
      if (!t.ok) continue;
      const img = await sharp(Buffer.from(await t.arrayBuffer())).resize(W, H - 22, { fit: "cover" }).toBuffer();
      const label = Buffer.from(`<svg width="${W}" height="22"><rect width="100%" height="100%"/><text x="4" y="16" font-size="13" fill="#fff" font-family="Arial">${i} ${r.width}x${r.height} ${r.source}</text></svg>`);
      tiles.push(await sharp({ create: { width: W, height: H, channels: 3, background: "#000" } }).composite([{ input: img, top: 0, left: 0 }, { input: label, top: H - 22, left: 0 }]).png().toBuffer());
    } catch {}
  }
  if (tiles.length) {
    const cols = 5;
    await sharp({ create: { width: cols * W, height: Math.ceil(tiles.length / cols) * H, channels: 3, background: "#222" } })
      .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * W, top: Math.floor(i / cols) * H })))
      .jpeg({ quality: 78 })
      .toFile(`${out}/${slug}.jpg`);
  }
  console.log(q, "→", results.length, "large results");
}
fs.writeFileSync(`${out}/results.json`, JSON.stringify(all, null, 1));
