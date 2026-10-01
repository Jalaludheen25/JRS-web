// Visual QA: scrolls the homepage like a user and saves a viewport screenshot per section.
// Usage: node scripts/screenshot.mjs <outDir> [desktop|mobile]  (expects next start on :3100, uses local Chrome)
import { chromium } from 'playwright-core';
const out = process.argv[2], mode = process.argv[3] ?? 'desktop';
const vp = mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--use-angle=d3d11', '--enable-gpu'] });
const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 1, hasTouch: mode === 'mobile', isMobile: mode === 'mobile' });
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
await page.goto('http://localhost:3100/', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(1800);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const sections = await page.evaluate(() => [...document.querySelectorAll('main > section, footer')].map(s => ({ id: s.getAttribute('aria-labelledby') || s.tagName, top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight })));
console.log('scrollHeight', total, JSON.stringify(sections));
let n = 0;
const shot = async (label) => { await page.screenshot({ path: `${out}/${mode}-${String(n++).padStart(2, '0')}-${label}.png` }); };
await shot('hero');
// Scroll smoothly via wheel so Lenis + scroll-linked effects run as they would for a user.
let y = 0;
const scrollTo = async (target) => {
  while (Math.abs(y - target) > 5) {
    const step = Math.max(-400, Math.min(400, target - y));
    if (mode === 'mobile') await page.evaluate(s => window.scrollBy(0, s), step); else await page.mouse.wheel(0, step);
    await page.waitForTimeout(60);
    y = await page.evaluate(() => scrollY);
    if (step > 0 && y >= total - vp.height - 2) break;
  }
  await page.waitForTimeout(1400);
};
for (const s of sections) {
  if (s.id === 'hero-title') continue;
  const stops = s.h > vp.height * 2.2 && mode === 'desktop' ? [0, 0.35, 0.7] : [0];
  for (const f of stops) {
    await scrollTo(Math.round(s.top + f * (s.h - vp.height)) + (f === 0 ? 0 : 0));
    await shot(`${s.id}-${Math.round(f * 100)}`);
  }
}
console.log(errors.length ? errors.join('\n') : 'no console errors');
await browser.close();
