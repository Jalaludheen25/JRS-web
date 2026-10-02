// Crawls the running site (default http://localhost:3100): every sitemap URL, every internal link,
// and every legacy URL from the live-site inventory. Reports status, H1 count, title and main-content words.
// Usage: node scripts/check-site.mjs [baseUrl]
import fs from "fs";
import { parse } from "node-html-parser";
const BASE = process.argv[2] ?? "http://localhost:3100";
const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
const queue = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const legacy = JSON.parse(fs.readFileSync("../docs/source-content/live-site-inventory.json", "utf8")).map((p) => new URL(p.url).pathname);
const seen = new Set(), rows = [], broken = [];
const visit = async (path, from) => {
  if (seen.has(path)) return; seen.add(path);
  const res = await fetch(BASE + path, { redirect: "manual" });
  if (res.status >= 300 && res.status < 400) { rows.push({ path, status: res.status, to: res.headers.get("location") }); return; }
  if (res.status !== 200) { broken.push(`${res.status} ${path}  (linked from ${from})`); return; }
  const root = parse(await res.text());
  const main = root.querySelector("main");
  const words = (main?.text ?? "").split(/\s+/).filter(Boolean).length;
  rows.push({ path, status: 200, h1: root.querySelectorAll("h1").length, words, title: root.querySelector("title")?.text });
  for (const a of root.querySelectorAll("a[href]")) {
    const h = a.getAttribute("href");
    if (h.startsWith("/") && !h.startsWith("//")) queue.push([h.split("#")[0] || "/", path]);
  }
};
for (const p of queue.splice(0)) await visit(p, "sitemap");
while (queue.length) { const [p, from] = queue.shift(); await visit(p, from); }
for (const p of legacy) await visit(p, "legacy inventory");
for (const r of rows) console.log(r.status === 200 ? `${r.h1 === 1 ? "  " : "!!"} 200 h1=${r.h1} words=${String(r.words).padStart(5)}  ${r.path}  — ${r.title}` : `   ${r.status} ${r.path} -> ${r.to}`);
console.log(`\n${rows.filter((r) => r.status === 200).length} pages OK, ${rows.filter((r) => r.status !== 200).length} redirects, ${broken.length} broken`);
broken.forEach((b) => console.log("BROKEN", b));
const thin = rows.filter((r) => r.status === 200 && r.words < 250);
thin.forEach((r) => console.log("THIN", r.words, r.path));
