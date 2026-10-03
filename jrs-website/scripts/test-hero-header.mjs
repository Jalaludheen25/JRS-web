// Hero ↔ header separation test across phone/tablet sizes and engines (Chromium, WebKit, Firefox).
// At rest and at several scroll positions (scrolling down, then back up) it checks that no hero text is visible
// inside the header bar: any hero text intersecting the header must be faded out (opacity ≈ 0) or covered by an
// opaque header background. Also checks the header itself stays put (no hide/jump), the overlay is present and
// every headline line fits inside the screen width.
// Usage: node scripts/test-hero-header.mjs [baseUrl] [outDir]
import { chromium, webkit, firefox } from "playwright-core";
import fs from "fs";

const [BASE = "http://localhost:3100", out] = process.argv.slice(2);
if (out) fs.mkdirSync(out, { recursive: true });
const sizes = [
  ["320x568", 320, 568], ["360x640", 360, 640], ["375x667", 375, 667], ["390x844", 390, 844],
  ["414x896", 414, 896], ["430x932", 430, 932], ["landscape-844x390", 844, 390], ["768x1024", 768, 1024], ["1440x900", 1440, 900],
];
const engines = [
  ["chromium", () => chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" })],
  ["webkit", () => webkit.launch()],
  ["firefox", () => firefox.launch()],
];

const probe = () => {
  const header = document.querySelector("header");
  const hr = header.getBoundingClientRect();
  const bar = header.querySelector("nav").getBoundingClientRect(); // the visible 76px bar
  const bg = header.querySelector("div.absolute.inset-0");
  const bgAlpha = (() => {
    const c = getComputedStyle(bg).backgroundColor; // rgba(...) or color(srgb ...)
    const m = c.match(/[\d.]+/g);
    return m ? (m.length >= 4 ? parseFloat(m[3]) : c.startsWith("rgb(") ? 1 : 0) : 0;
  })();
  const hero = document.querySelector("section[aria-labelledby='hero-title']");
  const eff = (el) => { let o = 1; for (let n = el; n && n !== document.documentElement; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity); return o; };
  const texts = [...hero.querySelectorAll("h1 > span, p, a, button")].filter((el) => getComputedStyle(el).display !== "none" && el.getBoundingClientRect().height > 0);
  const offenders = texts.filter((el) => {
    const r = el.getBoundingClientRect();
    const overlap = Math.min(r.bottom, bar.bottom) - Math.max(r.top, bar.top);
    if (overlap <= 2 || r.right < bar.left || r.left > bar.right) return false;
    return eff(el) > 0.05 && bgAlpha < 0.99; // visible text showing through a header that is not fully opaque
  });
  const eyebrow = hero.querySelector("h1 > span");
  return {
    headerTop: Math.round(hr.top), barBottom: Math.round(bar.bottom), bgAlpha: +bgAlpha.toFixed(2),
    eyebrowTop: Math.round(eyebrow.getBoundingClientRect().top),
    offenders: offenders.map((el) => el.textContent.trim().slice(0, 30)),
    overlay: !!hero.querySelector("[data-hero-overlay]"),
    clipped: [...hero.querySelectorAll("h1 [data-reveal-mask]")].filter((m) => {
      const range = document.createRange();
      range.selectNodeContents(m);
      const r = range.getBoundingClientRect();
      return r.left < 0 || r.right > document.documentElement.clientWidth;
    }).map((m) => m.textContent.trim()),
  };
};

const lines = [];
let fails = 0;
for (const [ename, launch] of engines) {
  const browser = await launch();
  for (const [label, w, h] of sizes) {
    const mobile = w < 900;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...(ename !== "firefox" && mobile ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "load" });
    await page.waitForTimeout(2600); // intro animations settle
    const problems = [];
    const rest = await page.evaluate(probe);
    if (rest.eyebrowTop < rest.barBottom + 8) problems.push(`at rest the label sits ${rest.barBottom + 8 - rest.eyebrowTop}px into the header zone`);
    if (!rest.overlay) problems.push("overlay missing");
    if (rest.clipped.length) problems.push(`headline runs off screen: ${rest.clipped.join(", ")}`);
    // Scroll down in small steps, then back up: no see-through overlap, header never moves.
    const steps = [6, 20, 40, 80, 140, 220, 320, 480, 700, 480, 220, 80, 20, 0];
    for (const y of steps) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(260);
      const s = await page.evaluate(probe);
      if (s.offenders.length) problems.push(`scrollY ${y}: hero text visible through header (${s.offenders.join(" | ")})`);
      if (s.headerTop !== 0) problems.push(`scrollY ${y}: header moved to ${s.headerTop}px`);
    }
    if (out) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      if (ename === "webkit" || ename === "chromium") await page.screenshot({ path: `${out}/${ename}-${label}.png` });
    }
    fails += problems.length ? 1 : 0;
    lines.push(`${problems.length ? "FAIL" : "PASS"}  ${ename.padEnd(8)} ${label.padEnd(18)} label top ${rest.eyebrowTop}px / header bar ends ${rest.barBottom}px` + (problems.length ? "\n        " + [...new Set(problems)].slice(0, 4).join("\n        ") : ""));
    await ctx.close();
  }
  await browser.close();
}
console.log(lines.join("\n"));
console.log(`\n${lines.length} size/engine combinations, ${fails} failing`);
process.exitCode = fails ? 1 : 0;
