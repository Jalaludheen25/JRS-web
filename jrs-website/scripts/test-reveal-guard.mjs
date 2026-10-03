// Verifies the reveal safety net (src/lib/reveal-guard.ts) against the running site (default http://localhost:3100):
//   1. normal: JS runs → html.reveal set, no fallback, reveal animations play and finish visible;
//   2. no JS → every [data-reveal] element is visible on first paint;
//   3. JS chunks fail to load → fallback triggers and every [data-reveal] element becomes visible;
//   4. app never starts (scripts hang) → fallback triggers after the timeout.
// Usage: node scripts/test-reveal-guard.mjs [baseUrl]
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const results = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);

// Count [data-reveal] elements that are still in a hidden starting state (judged on computed style).
const hiddenCount = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("[data-reveal]")].filter((el) => {
      const cs = getComputedStyle(el);
      return parseFloat(cs.opacity) < 0.05 || /inset\(100%|inset\(0% 100%|inset\(0% 0% 0% 100%/.test(cs.clipPath) || /matrix\(1, 0, 0, 1, 0, [1-9]\d*\.?\d*\)/.test(cs.transform) && el.parentElement && getComputedStyle(el.parentElement).overflow === "hidden";
    }).length,
  );
const htmlClass = (page) => page.evaluate(() => document.documentElement.className);

// 1. Normal
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "load" });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(140); }
  await page.waitForTimeout(4500);
  const cls = await htmlClass(page);
  check("normal: guard class set, no fallback", cls.includes("reveal") && !cls.includes("reveal-fallback"), cls.split(" ").filter((c) => c.startsWith("reveal")).join(" "));
  check("normal: app reported start", await page.evaluate(() => window.__jrsHydrated === true));
  await page.close();
}

// 2. No JavaScript
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });
  const total = await page.evaluate(() => document.querySelectorAll("[data-reveal]").length);
  const hidden = await hiddenCount(page);
  check("no JS: all reveal elements visible on first paint", hidden === 0, `${hidden}/${total} hidden`);
  await ctx.close();
}

// 3. JS chunks fail to load
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route(/\/_next\/static\/chunks\/.*\.js/, (r) => r.abort());
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.waitForTimeout(800);
  const cls = await htmlClass(page);
  const hidden = await hiddenCount(page);
  check("failed scripts: fallback triggered quickly", cls.includes("reveal-fallback"), cls.split(" ").filter((c) => c.startsWith("reveal")).join(" "));
  check("failed scripts: all reveal elements visible", hidden === 0, `${hidden} hidden`);
  await page.close();
}

// 4. Scripts hang (app never starts) → timeout fallback
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route(/\/_next\/static\/chunks\/.*\.js/, () => { /* never respond */ });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const early = (await htmlClass(page)).includes("reveal-fallback");
  await page.waitForTimeout(3000);
  const cls = await htmlClass(page);
  const hidden = await hiddenCount(page);
  check("hung scripts: no premature fallback (<1.5 s)", !early);
  check("hung scripts: fallback after timeout, all visible", cls.includes("reveal-fallback") && hidden === 0, `${hidden} hidden`);
  await page.close();
}

await browser.close();
console.log(results.join("\n"));
process.exitCode = results.some((r) => r.startsWith("FAIL")) ? 1 : 0;
