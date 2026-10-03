// Cross-browser rendering check: Chromium (installed Chrome), WebKit (Safari engine) and Firefox via Playwright,
// plus a "no JS" pass that shows what any browser sees if the site's JavaScript fails to run (old browsers,
// blocked scripts, in-app webviews, script errors).
// Each <section> is scrolled into view and measured while on screen, the way a visitor sees it. Text counts as
// invisible when its effective opacity is ~0, it is clipped out of an overflow / clip-path mask, or it has no size.
// By-design off-screen content (marquee copies, horizontal-track panels outside the viewport) is ignored.
// Usage: node scripts/cross-browser.mjs <outDir> [baseUrl] [--engines=chromium,webkit,firefox,nojs] [paths...]
import { chromium, webkit, firefox } from "playwright-core";
import fs from "fs";

const args = process.argv.slice(2);
const [out, BASE = "https://jrs-web.vercel.app"] = args.filter((a) => !a.startsWith("--") && !a.startsWith("/"));
const argPaths = args.filter((a) => a.startsWith("/"));
const engineArg = (args.find((a) => a.startsWith("--engines=")) ?? "--engines=chromium,webkit,firefox,nojs").split("=")[1].split(",");
const paths = argPaths.length ? argPaths : ["/", "/engine-bearings-in-abu-dhabi/", "/services/", "/about/", "/blogs/"];
fs.mkdirSync(out, { recursive: true });

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const engines = {
  chromium: { launch: () => chromium.launch({ executablePath: CHROME }), js: true },
  webkit: { launch: () => webkit.launch(), js: true },
  firefox: { launch: () => firefox.launch(), js: true },
  nojs: { launch: () => chromium.launch({ executablePath: CHROME }), js: false },
};
const viewports = [
  ["desktop", { viewport: { width: 1440, height: 900 } }],
  ["mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true }],
];

const measureSection = (idx) => {
  const s = [...document.querySelectorAll("main section, footer")][idx];
  const vw = window.innerWidth, vh = window.innerHeight;
  const effOpacity = (el) => {
    let o = 1;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity || "1");
    return o;
  };
  const inViewport = (r) => r.right > 0 && r.left < vw && r.bottom > 0 && r.top < vh;
  const clippedOut = (el, r) => {
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      const m = cs.clipPath && cs.clipPath.match(/inset\(\s*([\d.]+)%(?:\s+([\d.]+)%)?(?:\s+([\d.]+)%)?(?:\s+([\d.]+)%)?/);
      if (m && m.slice(1).some((v) => v && parseFloat(v) >= 99)) return true;
      if (cs.overflowY === "hidden" || cs.overflowY === "clip") {
        const p = n.getBoundingClientRect();
        const iy = Math.min(r.bottom, p.bottom) - Math.max(r.top, p.top);
        if (iy < r.height * 0.25) return true;
      }
    }
    return false;
  };
  const label = s.getAttribute("aria-labelledby") || s.getAttribute("aria-label") || s.id || `${s.tagName.toLowerCase()}#${idx}`;
  const texts = [...s.querySelectorAll("h1,h2,h3,h4,p,li,a,dt,dd")].filter((el) => {
    if (el.textContent.trim().length < 2 || el.closest("[aria-hidden='true']")) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    if (el.closest(".animate-marquee")) return false;
    const r = el.getBoundingClientRect();
    // Horizontal tracks: only judge panels that are actually within the viewport horizontally.
    if (el.closest(".w-max, .snap-x") && (r.right < 0 || r.left > vw)) return false;
    if (el.closest('.sr-only') || el.classList.contains('sr-only')) return false;
    // Judge only what a visitor can see right now: fully inside the upper 85% of the viewport.
    return r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= vh * 0.85;
  });
  const hidden = texts.filter((el) => effOpacity(el) < 0.05 || clippedOut(el, el.getBoundingClientRect()));
  return { label, total: texts.length, hidden: hidden.length, sample: hidden.slice(0, 3).map((el) => el.textContent.trim().replace(/\s+/g, " ").slice(0, 48)) };
};

const report = [];
for (const name of engineArg) {
  const eng = engines[name];
  const browser = await eng.launch();
  for (const [vpName, vp] of viewports) {
    const mobileFlag = name !== "firefox" && vpName === "mobile" ? { isMobile: true } : {};
    const ctx = await browser.newContext({ ...vp, ...mobileFlag, javaScriptEnabled: eng.js });
    const page = await ctx.newPage();
    for (const path of paths) {
      const errors = [];
      const onErr = (e) => errors.push(e.message.slice(0, 160));
      page.on("pageerror", onErr);
      try {
        await page.goto(BASE + path, { waitUntil: "load", timeout: 60000 });
      } catch (e) {
        report.push({ name, vpName, path, fatal: e.message.split("\n")[0] });
        page.off("pageerror", onErr);
        continue;
      }
      await page.waitForTimeout(1200);
      const count = await page.evaluate(() => document.querySelectorAll("main section, footer").length);
      const bad = [];
      for (let i = 0; i < count; i++) {
        // Scroll the section's top into view (sticky/pinned tracks: also sample part-way through).
        const top = await page.evaluate((idx) => {
          const s = [...document.querySelectorAll("main section, footer")][idx];
          return s.getBoundingClientRect().top + window.scrollY;
        }, i);
        await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 40)), top);
        await page.waitForTimeout(1500);
        let r = await page.evaluate(measureSection, i);
        if (!(r.total && r.hidden / r.total > 0.25)) {
          await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.5));
          await page.waitForTimeout(1500);
          const r2 = await page.evaluate(measureSection, i);
          if (r2.total && r2.hidden / r2.total > 0.25) r = r2;
        }
        if (r.total && r.hidden / r.total > 0.25) bad.push(r);
      }
      report.push({ name, vpName, path, errors: [...new Set(errors)], bad });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      const file = `${name}-${vpName}-${path.replace(/\//g, "_")}`.replace(/_+$/, "") || `${name}-${vpName}-home`;
      await page.screenshot({ path: `${out}/${file === `${name}-${vpName}-` ? `${name}-${vpName}-home` : file}.jpg`, fullPage: true, type: "jpeg", quality: 55 }).catch(() => {});
      page.off("pageerror", onErr);
    }
    await ctx.close();
  }
  await browser.close();
}

let issues = 0;
for (const r of report) {
  const head = `${r.name.padEnd(8)} ${r.vpName.padEnd(7)} ${r.path}`;
  if (r.fatal) { issues++; console.log(`FATAL ${head}  ${r.fatal}`); continue; }
  const has = r.bad.length || r.errors.length;
  issues += has ? 1 : 0;
  console.log(`${has ? "ISSUE" : "ok   "} ${head}`);
  for (const e of r.errors) console.log(`        js error: ${e}`);
  for (const b of r.bad) console.log(`        invisible ${b.hidden}/${b.total} in [${b.label}]  e.g. ${JSON.stringify(b.sample)}`);
}
console.log(`\n${report.length} page/viewport/engine combinations, ${issues} with issues`);
process.exitCode = issues ? 1 : 0;
