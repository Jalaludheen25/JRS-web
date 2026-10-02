// Downloads the source clips for the homepage hero reel from Wikimedia Commons into ../docs/source-video/
// (cached) and records licence + author for each in sources.json. Prefers a 1080p transcode for 4K sources.
// Run from jrs-website/: node scripts/fetch-hero-footage.mjs
import fs from "fs";
import path from "path";

const OUT = "../docs/source-video";
fs.mkdirSync(OUT, { recursive: true });
const UA = "JRS-website-build/1.0 (https://jrs-me.com)";
const API = "https://commons.wikimedia.org/w/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Shortlist chosen from contact sheets (scripts/search-commons-video.mjs). Only CC0 / public-domain
// footage is used so the site carries no attribution obligation. Licences are re-checked below.
export const footage = [
  { id: "cargo-ship-at-sea", file: "File:Angela Oulu 20210724.webm" },
  { id: "port-cranes", file: "File:20201119-TFAA-LSC-0044-CLIPX2 5.webm" },
  { id: "port-cranes-2", file: "File:20201119-TFAA-LSC-0052-CLIP.webm" },
  { id: "lpg-carrier", file: "File:22,000 cbm LPG Carrier Navigator Centauri transits Porpoise Bay.webm" },
  { id: "tug-in-ice", file: "File:Ajax South Harbour Helsinki 20260214 02.webm" },
  { id: "ship-engine-crankshaft", file: "File:Maschine La Suisse.ogv" },
  { id: "ship-engine-motion", file: "File:Maschine-ds-uri.ogv" },
  { id: "lathe-drilling-gear", file: "File:Drilling a gear wheel on a turning machine.WebM" },
  { id: "welding-sparks", file: "File:Gof a Gweithiwr Metrel Ray Burrell Metal Fabricator and Blacksmith.webm" },
  { id: "cnc-milling", file: "File:Machining NICER’s Patches (SVS14610 - Machine Shop B-roll Part 2 Slow Motion).webm" },
];

async function api(params) {
  for (let i = 0; i < 5; i++) {
    await sleep(500);
    const r = await fetch(`${API}?${new URLSearchParams({ format: "json", ...params })}`, { headers: { "user-agent": UA } });
    if (r.ok) return r.json();
    await sleep(5000 * (i + 1));
  }
  throw new Error("api failed");
}

const sources = [];
for (const f of footage) {
  // Titles from the search may be truncated; resolve the exact page via search if needed.
  let title = f.file;
  let q = await api({ action: "query", titles: title, prop: "imageinfo|videoinfo", iiprop: "url|size|extmetadata", viprop: "derivatives" });
  let page = Object.values(q.query.pages)[0];
  if (page.missing !== undefined) {
    const s = await api({ action: "query", list: "search", srsearch: f.file.replace("File:", "").replace(/\.\w+$/, ""), srnamespace: "6", srlimit: "1" });
    title = s.query.search[0]?.title;
    if (!title) throw new Error("not found: " + f.file);
    q = await api({ action: "query", titles: title, prop: "imageinfo|videoinfo", iiprop: "url|size|extmetadata", viprop: "derivatives" });
    page = Object.values(q.query.pages)[0];
  }
  const ii = page.imageinfo[0];
  const meta = ii.extmetadata ?? {};
  const license = meta.LicenseShortName?.value ?? "";
  if (!/^(cc0|public domain)$/i.test(license.trim())) throw new Error(`licence not allowed for ${title}: ${license}`);
  const derivs = (page.videoinfo?.[0]?.derivatives ?? []).filter((d) => /webm|ogg/.test(d.type) && d.height);
  // Best source: original if ≤1080p, otherwise the 1080p transcode.
  const t1080 = derivs.find((d) => d.height === 1080 && /vp9/.test(d.src)) ?? derivs.find((d) => d.height === 1080);
  const src = ii.height > 1080 && t1080 ? t1080.src : ii.url;
  const ext = path.extname(new URL(src).pathname) || ".webm";
  const dest = path.join(OUT, f.id + ext);
  if (!fs.existsSync(dest)) {
    const r = await fetch(src, { headers: { "user-agent": UA } });
    if (!r.ok) throw new Error(`${r.status} ${src}`);
    fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  }
  sources.push({
    id: f.id, title, file: dest, license, page: ii.descriptionurl,
    artist: (meta.Artist?.value ?? "").replace(/<[^>]+>/g, "").trim(),
    original: `${ii.width}x${ii.height}`, duration: ii.duration,
  });
  console.log(f.id.padEnd(24), license.padEnd(16), `${ii.width}x${ii.height}`, Math.round(ii.duration) + "s", (fs.statSync(dest).size / 1e6).toFixed(1) + "MB");
}
fs.writeFileSync(path.join(OUT, "sources.json"), JSON.stringify(sources, null, 1));
