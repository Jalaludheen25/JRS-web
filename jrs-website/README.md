# JRS Mechanical Equipment — website (Next.js)

Rebuild of https://jrs-me.com. Planning documents live in [`../docs`](../docs):

| Doc | Contents |
|---|---|
| [01 — Audit & SEO migration](../docs/01-audit-and-seo-migration.md) | Crawl of all 45 live URLs, audit findings, keyword → URL map, 301 redirect map |
| [02 — Information architecture](../docs/02-information-architecture.md) | Sitemap, navigation, templates, internal-linking rules |
| [03 — Design system](../docs/03-design-system.md) | "Datum" concept, tokens, type, motion, homepage narrative, imagery gaps |
| [04 — Fact register](../docs/04-fact-register.md) | Every claim the site may make, with its source; list of things not to claim |
| [`source-content/`](../docs/source-content) | Plain text of every live page, kept as the content source of truth |

## Stack

Next.js 16 (App Router, Turbopack, static prerender) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lenis · three.js + React Three Fiber (one lazy-loaded scene) · lucide-react.
GSAP is not used: Motion's scroll hooks cover the pinned and horizontal sections without a second animation runtime.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npx next start -p 3100
node scripts/screenshot.mjs <outDir> desktop|mobile   # visual QA against :3100 using local Chrome
```

## Status: homepage concept (phase 1)

Built: homepage (14 sections), `/contact/`, global nav/footer/mobile dock, 404, `robots.txt`, `sitemap.xml`, Organization + LocalBusiness JSON-LD, the full 301 map, OG image and icons.

Not built yet: product, service, brand and industry templates, hubs and posts. Homepage links to those URLs return 404 until phase 2 (they are listed in IA §Sitemap). **Do not deploy over the live site until every URL in docs/01 §5 resolves.**

## Decisions needing JRS input

1. **Quote form delivery.** The form posts to `QUOTE_WEBHOOK_URL` (CRM, Make/Zapier, or an email function). Until that is set, it tells visitors to email or WhatsApp instead of showing a false success.
2. **Photography.** No video, workshop, engine-room, offshore or power-plant imagery exists. The live site's "AVR" photo shows a household voltage stabiliser, not a generator AVR, so it was removed and replaced by a schematic. The brochure's AVR, genset-controller, governor and workshop photos should be supplied as original files.
3. **Landline 02 235 8105** (in the PDFs) is not used, per the brief's "new number everywhere". Please confirm.
4. **Old `/wp-content/uploads/` image URLs.** Migrate them or let them 404?
5. **Logo.** Only raster PNGs exist (blue on an opaque white box). Transparent white and blue versions were derived in `scripts/make-logos.mjs`, but a vector SVG logo from the designer is needed for sharp rendering.

## Scripts

| Script | Purpose |
|---|---|
| `scripts/prep-images.mjs` | Resize and rename source images from the live site |
| `scripts/grade-images.mjs` | Monochrome navy grade for scene photography |
| `scripts/make-logos.mjs` | Derive transparent logo variants |
| `scripts/make-og.mjs` | Default Open Graph image |
| `scripts/build-inventory.mjs` | Regenerate the URL inventory table from the crawl |
| `scripts/screenshot.mjs` | Section-by-section screenshots for visual QA |
