// Renders the "Replacement engine spare parts" product images from the procedural models in scripts/parts-3d/
// (three.js in headless Chrome), downsamples the 2× supersampled frames and writes transparent PNGs, 1200×900,
// to public/images/spare-parts/<id>.png.
// Usage (from jrs-website/): node scripts/render-parts.mjs [--out dir] [id ...]
import fs from "fs";
import path from "path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const OUT = outIdx >= 0 ? args.splice(outIdx, 2)[1] : "public/images/spare-parts";
const only = args;
fs.mkdirSync(OUT, { recursive: true });

const ROOT = path.resolve("scripts/parts-3d");
const NM = path.resolve("node_modules");
const types = { ".js": "text/javascript", ".html": "text/html", ".json": "application/json" };

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log("  [page]", m.text().slice(0, 200)); });
page.on("pageerror", (e) => console.log("  [page error]", e.message));
await page.route("http://parts.local/**", async (route) => {
  const p = decodeURIComponent(new URL(route.request().url()).pathname);
  let file;
  if (p === "/") file = path.join(ROOT, "index.html");
  else if (/^\/(three|three-mesh-bvh|three-bvh-csg)\//.test(p)) file = path.join(NM, p);
  else file = path.join(ROOT, p);
  if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: "not found" });
  route.fulfill({ status: 200, body: fs.readFileSync(file), contentType: types[path.extname(file)] ?? "application/octet-stream" });
});
await page.goto("http://parts.local/");
await page.waitForFunction(() => window.studioReady === true, null, { timeout: 60000 });

const ids = only.length ? only : await page.evaluate(async () => Object.keys((await import("/parts.js")).parts));
for (const id of ids) {
  const t = Date.now();
  const url = await page.evaluate((i) => window.renderPart(i), id);
  const buf = Buffer.from(url.split(",")[1], "base64");
  const file = path.join(OUT, `${id}.png`);
  // Soft fade of the alpha over the outer 6% of the frame, so a long shadow never ends in a hard edge.
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const m = 0.06, fade = (t) => (t >= m ? 1 : (t / m) ** 2 * (3 - 2 * (t / m)));
  for (let y = 0; y < info.height; y++) {
    const fy = fade(Math.min(y, info.height - 1 - y) / info.height);
    for (let x = 0; x < info.width; x++) {
      const k = fy * fade(Math.min(x, info.width - 1 - x) / info.width);
      if (k < 1) data[(y * info.width + x) * 4 + 3] *= k;
    }
  }
  await sharp(data, { raw: info }).resize(1200, 900, { kernel: "lanczos3" }).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(file);
  console.log(`${id.padEnd(24)} ${((Date.now() - t) / 1000).toFixed(1)}s  ${(fs.statSync(file).size / 1e3).toFixed(0)} KB`);
}
await browser.close();
