// Browser test of the hero film against the running site (default http://localhost:3100).
// Checks source selection per device, playback, the pause control, reduced-motion fallback, off-screen pausing,
// and saves screenshots at several points in the reel. Usage: node scripts/test-hero-video.mjs <outDir> [baseUrl]
import { chromium } from "playwright-core";
import fs from "fs";

const [out, BASE = "http://localhost:3100"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--autoplay-policy=no-user-gesture-required"] });
const results = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);

async function open(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, isMobile: viewport.width < 600, hasTouch: viewport.width < 600, reducedMotion: opts.reducedMotion ?? "no-preference" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/404/.test(m.text()) && errors.push(m.text()));
  await page.goto(BASE + "/", { waitUntil: "load" });
  return { ctx, page, errors };
}
const waitPlaying = (page) =>
  page.waitForFunction(() => { const v = document.querySelector("video"); return v && !v.paused && v.currentTime > 0.3 && getComputedStyle(v).opacity === "1"; }, null, { timeout: 20000 }).then(() => true, () => false);
const state = (page) => page.evaluate(() => { const v = document.querySelector("video"); return v ? { src: v.currentSrc.split("/").pop(), paused: v.paused, t: +v.currentTime.toFixed(2), w: v.videoWidth, h: v.videoHeight } : null; });

// 1. Desktop 1440×900 → 1080p (AV1 in Chrome), plays, screenshots across the reel.
{
  const { ctx, page, errors } = await open({ width: 1440, height: 900 });
  const lcpPoster = await page.evaluate(() => !!document.querySelector('picture img[fetchpriority="high"]'));
  check("poster rendered with high fetch priority", lcpPoster);
  const playing = await waitPlaying(page);
  const s = await state(page);
  check("desktop: video plays", playing, JSON.stringify(s));
  check("desktop: 1080p AV1 selected", s?.src === "hero-1080-av1.mp4" && s.h === 1080, s?.src);
  for (const t of [1.2, 5.2, 9.5, 12.5, 15.6, 18.5, 21.4, 24.2]) {
    await page.evaluate((tt) => { const v = document.querySelector("video"); v.currentTime = tt; }, t);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/desktop-${String(t).replace(".", "_")}.png` });
  }
  const caption = await page.locator("main section").first().locator("button[aria-label*='background video']").count();
  check("desktop: pause control present", caption >= 1);
  await page.locator("button[aria-label='Pause background video']:visible").first().click();
  await page.waitForTimeout(400);
  check("desktop: pause control pauses", (await state(page)).paused === true);
  await page.locator("button[aria-label='Play background video']:visible").first().click();
  await page.waitForTimeout(600);
  check("desktop: play control resumes", (await state(page)).paused === false);
  await page.mouse.wheel(0, 2400);
  await page.waitForTimeout(1500);
  check("desktop: pauses when scrolled off-screen", (await state(page)).paused === true);
  check("desktop: no runtime errors", errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 2. Tablet landscape 1024×768 → 720p.
{
  const { ctx, page } = await open({ width: 1024, height: 768 });
  await waitPlaying(page);
  const s = await state(page);
  check("tablet landscape: 720p selected", s?.src === "hero-720-av1.mp4", s?.src);
  await page.screenshot({ path: `${out}/tablet-landscape.png` });
  await ctx.close();
}

// 3. Tablet portrait 768×1024 and phone 390×844 → portrait cut.
for (const [name, vp] of [["tablet-portrait", { width: 768, height: 1024 }], ["phone", { width: 390, height: 844 }]]) {
  const { ctx, page, errors } = await open(vp);
  const playing = await waitPlaying(page);
  const s = await state(page);
  check(`${name}: portrait cut selected and playing`, playing && s?.src === "hero-portrait-av1.mp4", JSON.stringify(s));
  await page.waitForTimeout(4500);
  await page.screenshot({ path: `${out}/${name}.png` });
  check(`${name}: no runtime errors`, errors.length === 0, errors.join(" | "));
  await ctx.close();
}

// 4. Reduced motion → poster only, no video requested.
{
  const { ctx, page } = await open({ width: 1440, height: 900 }, { reducedMotion: "reduce" });
  await page.waitForTimeout(3500);
  check("reduced motion: no video element, poster shown", (await page.locator("video").count()) === 0 && (await page.locator("picture img").count()) > 0);
  await page.screenshot({ path: `${out}/reduced-motion.png` });
  await ctx.close();
}

await browser.close();
console.log(results.join("\n"));
process.exitCode = results.some((r) => r.startsWith("FAIL")) ? 1 : 0;
