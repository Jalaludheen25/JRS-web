// Full-page screenshots of given routes after scrolling through them (so reveal animations have fired).
// Usage: node scripts/screenshot-pages.mjs <outDir> <width> <route...>
import { chromium } from "playwright-core";
const [out, width, ...routes] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const mobile = Number(width) < 600;
const page = await browser.newPage({ viewport: { width: Number(width), height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
for (const r of routes) {
  await page.goto("http://localhost:3100" + r, { waitUntil: "load" });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(90); }
  await page.waitForTimeout(1300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const name = (r.replace(/\//g, "_") || "home").replace(/^_|_$/g, "") || "home";
  await page.screenshot({ path: `${out}/${width}-${name}.jpg`, fullPage: true, type: "jpeg", quality: 60 });
  console.log("shot", r, h);
}
await browser.close();
