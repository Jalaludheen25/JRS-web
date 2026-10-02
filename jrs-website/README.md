# JRS Mechanical Equipment — website (Next.js)

Rebuild of https://jrs-me.com. Planning documents live in [`../docs`](../docs):

| Doc | Contents |
|---|---|
| [01 — Audit & SEO migration](../docs/01-audit-and-seo-migration.md) | Crawl of all 45 live URLs, audit findings, keyword → URL map, 301 redirect map |
| [02 — Information architecture](../docs/02-information-architecture.md) | Sitemap, navigation, templates, internal-linking rules |
| [03 — Design system](../docs/03-design-system.md) | "Datum" concept, tokens, type, motion, homepage narrative, imagery gaps |
| [04 — Fact register](../docs/04-fact-register.md) | Every claim the site may make, with its source; list of things not to claim |
| [05 — Image credits](../docs/05-image-credits.md) | Source and licence of every image; stock photos are CC0 |
| [06 — Hero film](../docs/06-hero-film.md) | Homepage video: sources and licences, encodes, loading strategy, readability approach |
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

## Status

**All pages are built: 52 pages in the sitemap.** That is the homepage, hubs (about, products, services, industries, brands, insights, contact), 34 legacy URLs at their original addresses, 6 new service pages, 2 new industry pages and 3 category archives. All of them are statically prerendered.

- **Legacy pages** keep their live-site copy word for word. `scripts/extract-content.mjs` pulls headings, paragraphs and lists from the crawled HTML (`../docs/source-html/`). `scripts/build-pages.mjs` cleans that into `src/content/legacy-pages.json` and downloads the post images to `public/images/legacy/`. Titles and descriptions are in `src/lib/pages.ts`.
- **New pages** (genset controllers, six services, Industrial, Offshore) are written in `src/content/authored.ts` from the company and product profiles only.
- **Images:** every page hero and homepage section has its own picture, assigned in `src/lib/images.ts`. A card shows the image of the page it links to. `node scripts/audit-images.mjs` enforces this. Sources: the live site, the brochure PDFs and 19 CC0 photos from Wikimedia Commons (docs/05).
- **QA:** `node scripts/check-site.mjs` crawls every sitemap URL, internal link and legacy URL, then reports status, H1 count and word count. Last run: 52 pages OK, 0 broken links, 0 broken images, one H1 per page.

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
| `scripts/screenshot.mjs` | Section-by-section homepage screenshots for visual QA |
| `scripts/screenshot-pages.mjs` | Full-page screenshots of any routes |
| `scripts/extract-content.mjs` | Extract body content from the crawled live pages |
| `scripts/build-pages.mjs` | Clean extracted content and localise images |
| `scripts/check-site.mjs` | Crawl the running site: status, H1s, links, thin pages |
| `scripts/search-commons-video.mjs` | Search Wikimedia Commons for freely licensed video; contact sheets of poster frames |
| `scripts/fetch-hero-footage.mjs` | Download the hero source clips (CC0 / public domain only) into `docs/source-video/` |
| `scripts/footage-sheets.mjs`, `scripts/footage-windows.mjs` | Frame sheets for choosing in/out points |
| `scripts/build-hero-video.mjs` | Cut, grade and loop the hero film; AV1 + H.264 encodes, posters, scene timings, docs/06 (`--preview`, `--doc`) |
| `scripts/test-hero-video.mjs` | Browser test of the hero film: source per device, playback, pause control, reduced motion |
| `scripts/extract-pdf-images.mjs` | Extract embedded photos (with transparency) from the brochure PDFs |
| `scripts/build-image-library.mjs` | Build `public/images/brochure/` and `public/images/stock/`, graded variants and `docs/05-image-credits.md` |
| `scripts/search-openverse.mjs` | Search CC0 / public-domain photos (Wikimedia, StockSnap) and build review contact sheets |
| `scripts/image-dupes.mjs` | Find visually identical images saved under different file names |
| `scripts/audit-images.mjs` | Browser audit of the running site: every page/section has its own image; card thumbnails match their target page |
