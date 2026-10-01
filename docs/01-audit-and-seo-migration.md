# 01 — Site Audit, URL Inventory & SEO Migration Map

Crawled: 2026-10-01 · Source: `https://jrs-me.com/sitemap_index.xml` (Yoast) plus every internal link found on those pages.
Raw crawl output: [`source-content/live-site-inventory.json`](source-content/live-site-inventory.json). Full page text for every URL is in [`source-content/`](source-content/).

## 1. What the live site is

- WordPress with Elementor/ElementsKit and Yoast SEO. Sitemaps: `post`, `page`, `category`, `author`.
- **45 indexable URLs**: 29 pages, 12 posts, 3 category archives and 1 author archive.
- Every URL uses a **trailing slash**. The new site must do the same (`trailingSlash: true`) or all 45 URLs would change.
- `/home/` already 301s to `/`.
- Yoast emits `WebPage`, `BreadcrumbList`, `WebSite`/`SearchAction` and `Organization` JSON-LD everywhere, plus `Article` on posts. There is no `LocalBusiness`, `Product` or `Service` schema.

## 2. Audit findings

| # | Finding | Impact | Fix in rebuild |
|---|---|---|---|
| 1 | The old phone **+971 50 245 0986** appears in the header, footer, contact block, WhatsApp link and `tel:` link (also seen in the SEO report's outbound clicks) | Leads go to the wrong number | Replace everywhere with **+971 55 770 4485** (`tel:+971557704485`, `wa.me/971557704485`) |
| 2 | 13 URLs have **no meta description** (`/products/`, `/contact/`, `/blogs/`, `/cylinder-heads-components-in-abu-dhabi/`, `/engine-bearings-in-abu-dhabi/`, `/fuel-injection-systems-components-in-abu-dhabi/`, `/ultrasonic-cleaning-for-parts-in-abu-dhabi/`, `/industries/`, `/engine-parts/`, categories, junk pages) | Lower CTR. Three of these are ranking keyword pages. | Write unique descriptions from source content |
| 3 | Homepage H1 is rendered **twice** (slider duplicate), and the hero slider repeats each slide | Duplicate H1, bloated DOM | Single H1 |
| 4 | `/engine-parts/`, `/industries/` and `/error-page/` have **no H1 and almost no content** | Thin pages | Consolidate or rebuild (see map) |
| 5 | Junk URLs indexed: `/error/` (post) and `/error-page/` | Index bloat | 301 → `/` and drop from sitemap |
| 6 | Author archive slug `tklmarketing01gmail-com` exposes an agency email | Privacy / brand | 301 → `/blogs/` |
| 7 | Broken internal link `/marine-products-and-servic` (truncated) | 404 | 301 → `/marine-products-and-services/` |
| 8 | Date archives linked (`/2025/11/14/` etc.) | Thin archive pages | 301 → `/blogs/` |
| 9 | Typo in title: "…Marine Engines in Abu **Dhab**" (`/pistons-piston-rings-in-abu-dhabi/`) | Cosmetic | Fix to "Dhabi"; keep the rest of the title |
| 10 | Grammar issues in descriptions ("We supplies…") | Trust | Light copy edit, same keyword intent |
| 11 | Outbound link to `wpmet.com/plugin/elementskit` (theme credit) got clicks | Leaks visitors | Remove |
| 12 | Topbar claims "ISO 45001:2018 · ISO 9001:2015 · ISO 14001:2015 Certified Company" | Supported by company-profile badges | Keep, without inventing certificate numbers |
| 13 | No `LocalBusiness`, `Product` or `Service` schema | Missed rich-result eligibility | Add per page type |

## 3. Keyword → page map (from the SEO report, 22–28 Aug 2026)

Every tracked keyword already has a ranking URL. **None of these URLs changes.**

| Tracked keyword | Pos. | Ranking URL (preserved) |
|---|---|---|
| cylinder head and components in abu dhabi | 1 | `/cylinder-heads-components-in-abu-dhabi/` |
| liners anti polishing rings in abu dhabi | 1 | `/liners-anti-polishing-rings-in-abu-dhabi/` |
| lorange injectors and pumps repair *(the brief's "orange injectors" = L'Orange)* | 1 | `/lorange-injectors-and-pumps-repair/` |
| marine engine bearings abu dhabi | 1 | `/` (+ `/engine-bearings-in-abu-dhabi/`) |
| marine engine turbocharger abu dhabi | 1 | `/turbochargers-cartridges-in-abu-dhabi/` |
| marine expert turbocharger overhaul service abu dhabi | 1 | `/turbocharger-overhauls-in-abu-dhabi/` |
| marine turbocharger overhaul abu dhabi | 1 | `/turbocharger-overhauls-in-abu-dhabi/` |
| outboard engine repair & overhaul in abu dhabi | 1 | `/outboard-engine-repair-overhaul-in-abu-dhabi/` |
| top quality marine products and services in abu dhabi | 1 | `/marine-products-and-services/` |
| turbochargers & cartridges in abu dhabi | 1 | `/turbochargers-cartridges-in-abu-dhabi/` |
| fuel injection systems & components in abu dhabi | 2 | `/fuel-injector-spare-parts-and-repair-in-abu-dhabi/` (+ `/fuel-injection-systems-components-in-abu-dhabi/`) |
| yanmar marine engine spare parts in oman | 2 | `/yanmar-marine-engine-spare-parts-for-marine-operations/` |
| cummins engine spare parts in saudi (arabia) | 3 | `/cummins-engine-spare-parts-supplier-saudi-arabia/` |
| turbocharger overhauls in abu dhabi | 3 | `/` |
| yanmar marine engine spare parts supplier | 4 | `/yanmar-marine-engine-spare-parts-for-marine-operations/` |
| parts of turbocharger abu dhabi | 5 | `/turbochargers-cartridges-in-abu-dhabi/` |
| yanmar marine engine spare parts (supplier) in uae | 5 | `/yanmar-marine-engine-spare-parts-for-marine-operations/` |
| wartsila marine engine spare parts supplier in uae | 8 | `/wartsila-marine-engine-spare-parts-supplier/` |
| cummins engine spare parts in oman | 9 | `/cummins-engine-spare-parts/` |

**Risk notes**

- The homepage ranks #1 for *marine engine bearings abu dhabi* and #3 for *turbocharger overhauls in abu dhabi*. The new homepage **must keep crawlable text** naming engine bearings and turbocharger overhauls in Abu Dhabi, with internal links to the dedicated pages. The homepage concept does this in sections 05–07.
- Two pairs of pages compete with each other (`/fuel-injection-systems-components-in-abu-dhabi/` vs `/fuel-injector-spare-parts-and-repair-in-abu-dhabi/`; and the three Yanmar UAE pages). Do not merge them during launch. Strengthen cross-links and revisit after 8–12 weeks of Search Console data.
- Top countries: UAE 38%, India 15%, Saudi 6%, US 6%, Kuwait 5%. Keep the GCC brand/location pages prominent in the Brands hub.

## 4. Redirect map (permanent 301)

Implemented in `next.config.ts` → `redirects()`.

| From | To | Reason |
|---|---|---|
| `/home/` | `/` | Already 301 on live; keep |
| `/engine-parts/` | `/products/` | Empty page, consolidated |
| `/error/` | `/` | Junk post |
| `/error-page/` | `/` | Junk page |
| `/author/:slug/` and `/author/:slug/page/:n/` | `/blogs/` | Author archive removed |
| `/:yyyy(\d{4})/:mm(\d{2})/:dd(\d{2})/` | `/blogs/` | WordPress date archives |
| `/marine-products-and-servic` | `/marine-products-and-services/` | Truncated link in the wild |
| `/feed/`, `/comments/feed/`, `/:slug/feed/` | `/blogs/` | WordPress feeds |
| `/wp-content/uploads/:path*` | — | **Open decision:** keep old image URLs alive (image search / backlinks) by migrating the uploads folder, or let them 404 |

Prompt-suggested service URLs that would **duplicate** existing ranking pages become redirects *to* the legacy URLs, not the other way round:

| From | To |
|---|---|
| `/services/engine-overhaul/` | `/engine-overhaul-service-in-abu-dhabi/` |
| `/services/turbocharger-overhaul/` | `/turbocharger-overhauls-in-abu-dhabi/` |

## 5. Full URL inventory

Status: **KEEP** = same URL, rebuilt in the new templates, with title/H1/keyword intent preserved. **KEEP (rebuilt)** = same URL, content substantially rebuilt. **301** = redirected.

| Old URL | Current title | Current H1 | Primary keyword intent | Meta desc. | Status | New URL | Notes |
|---|---|---|---|---|---|---|---|
| `/` | Best Spare Parts and Marine Equipment Supplier in Abu Dhabi | Your Trusted Marine Spare Parts Supplier in UAE | marine spare parts supplier Abu Dhabi / UAE | yes | KEEP | `/` |  |
| `/about/` | Marine and Power Generation Spare Parts Supplier in Abu Dhabi | Delivering Trust with Every Marine and power generation spare parts | marine and power generation spare parts supplier Abu Dhabi | yes | KEEP | `/about/` |  |
| `/products/` | Products - JRS | REPLACEMENT ENGINE SPARE PARTS | replacement engine spare parts | **missing** | KEEP (rebuilt) | `/products/` | Becomes the products hub. |
| `/contact/` | Contact Us - JRS | Contact Us | brand / contact | **missing** | KEEP | `/contact/` |  |
| `/author/tklmarketing01gmail-com/` | JRS Experts, Author at JRS | — (missing) | — | **missing** | 301 → /blogs/ | `/blogs/` | Author archive exposes an email-derived slug. |
| `/automatic-voltage-regulator-supplier-in-uae/` | Automatic Voltage Regulator (AVR) Supplier in UAE | Automatic Voltage Regulator (AVR) | automatic voltage regulator supplier in UAE | yes | KEEP | `/automatic-voltage-regulator-supplier-in-uae/` |  |
| `/blogs/` | Blogs - JRS | Blogs | — | **missing** | KEEP | `/blogs/` |  |
| `/boats-maintenance-and-services/` | Boats Maintenance and Services in Abu dhabi | Boats Maintenance and Services in Abu Dhabi | boats maintenance and services Abu Dhabi | yes | KEEP | `/boats-maintenance-and-services/` |  |
| `/category/cummins/` | Cummins Archives - JRS | — (missing) | — | **missing** | KEEP | `/category/cummins/` |  |
| `/category/fuel-injection/` | Fuel Injection Archives - JRS | — (missing) | — | **missing** | KEEP | `/category/fuel-injection/` |  |
| `/category/marine-engine-spare-parts/` | Marine Engine Spare Parts Archives - JRS | — (missing) | — | **missing** | KEEP | `/category/marine-engine-spare-parts/` |  |
| `/coolers-heat-exchangers-in-abu-dhabi/` | Coolers & Heat Exchangers in Abu Dhabi | Coolers & Heat Exchangers in Abu Dhabi | coolers & heat exchangers in Abu Dhabi | yes | KEEP | `/coolers-heat-exchangers-in-abu-dhabi/` |  |
| `/cummins-engine-spare-parts-for-marine-and-industrial/` | Cummins Engine Spare Parts for Marine and Industrial Applications | Cummins Engine Spare Parts for Marine and Industrial Applications | Cummins engine spare parts marine & industrial | yes | KEEP | `/cummins-engine-spare-parts-for-marine-and-industrial/` |  |
| `/cummins-engine-spare-parts-in-uae/` | Cummins Engine Spare Parts in UAE | Cummins Engine Spare Parts in UAE | Cummins engine spare parts in UAE | yes | KEEP | `/cummins-engine-spare-parts-in-uae/` |  |
| `/cummins-engine-spare-parts-supplier-saudi-arabia/` | Cummins Engine Spare Parts Supplier in Saudi Arabia | Cummins Engine Spare Parts Supplier in Saudi Arabia for Reliable Engine Performance | Cummins engine spare parts in Saudi (Arabia) | yes | KEEP | `/cummins-engine-spare-parts-supplier-saudi-arabia/` |  |
| `/cummins-engine-spare-parts/` | Cummins Engine Spare Parts in UAE, Saudi, Oman & other GCC | Cummins Engine Spare Parts | Cummins engine spare parts (UAE, Saudi, Oman, GCC); Cummins engine spare parts in Oman | yes | KEEP | `/cummins-engine-spare-parts/` |  |
| `/cummins-spare-parts-in-kuwait/` | Cummins Spare Parts Supplier in Kuwait · JRS Mechanical | The Importance of Cummins Spare Parts for Industries in Kuwait | Cummins spare parts supplier in Kuwait | yes | KEEP | `/cummins-spare-parts-in-kuwait/` |  |
| `/cylinder-heads-components-in-abu-dhabi/` | Cylinder Heads & Components in Abu Dhabi - JRS | Cylinder Heads & Components in Abu Dhabi | cylinder head and components in Abu Dhabi | **missing** | KEEP | `/cylinder-heads-components-in-abu-dhabi/` |  |
| `/diesel-fuel-injection-parts-in-abu-dhabi/` | Diesel Fuel Injection Parts in Abu Dhabi · JRS | Diesel Fuel Injection Parts in Abu Dhabi | diesel fuel injection parts in Abu Dhabi | yes | KEEP | `/diesel-fuel-injection-parts-in-abu-dhabi/` |  |
| `/engine-bearings-in-abu-dhabi/` | Engine Bearings in Abu Dhabi - JRS | Engine Bearings in Abu Dhabi | marine engine bearings Abu Dhabi | **missing** | KEEP | `/engine-bearings-in-abu-dhabi/` |  |
| `/engine-overhaul-service-in-abu-dhabi/` | Best Marine Engine Overhaul Service in Abu Dhabi | Engine Overhaul Service in Abu Dhabi | marine engine overhaul service Abu Dhabi | yes | KEEP | `/engine-overhaul-service-in-abu-dhabi/` |  |
| `/engine-parts/` | ENGINE PARTS - JRS | — (missing) | — | **missing** | 301 → /products/ | `/products/` | Empty page (no H1, ~0 body copy). Consolidate into the products hub. |
| `/error-page/` | error page - JRS | — (missing) | — | **missing** | 301 → / | `/` | Junk page. Remove from index. |
| `/error/` | error - JRS | error | — | **missing** | 301 → / | `/` | Junk post. Remove from index. |
| `/filters/` | Marine Filters in Abu Dhabi · Oil, Fuel and Air Filters | Marine Filters in Abu Dhabi | marine filters in Abu Dhabi | yes | KEEP | `/filters/` |  |
| `/fuel-injection-systems-components-in-abu-dhabi/` | Fuel Injection Systems & Components in Abu Dhabi - JRS | Fuel Injection Systems & Components in Abu Dhabi | fuel injection systems & components in Abu Dhabi | **missing** | KEEP | `/fuel-injection-systems-components-in-abu-dhabi/` |  |
| `/fuel-injector-spare-parts-and-repair-in-abu-dhabi/` | Fuel Injector Spare Parts & Repair in Abu Dhabi | Fuel Injector Spare Parts and Repair in Abu Dhabi: A Practical Guide for Marine & Generator Operators | fuel injector spare parts and repair Abu Dhabi | yes | KEEP | `/fuel-injector-spare-parts-and-repair-in-abu-dhabi/` |  |
| `/industries/` | Industries - JRS | — (missing) | — | **missing** | KEEP (rebuilt) | `/industries/` | Currently empty; becomes the Industries hub. |
| `/liners-anti-polishing-rings-in-abu-dhabi/` | Cylinder Liners and Anti-Polishing Rings for Diesel & Gas Engines | Liners & Anti-Polishing Rings in Abu Dhabi | liners anti polishing rings in Abu Dhabi | yes | KEEP | `/liners-anti-polishing-rings-in-abu-dhabi/` |  |
| `/lorange-injectors-and-pumps-repair/` | L’Orange Injectors and Pumps Repair in Abu Dhabi - UAE | L’Orange Injectors and Pumps Repair: Keeping High-Performance Diesel Engines Running Reliably | L'Orange injectors and pumps repair | yes | KEEP | `/lorange-injectors-and-pumps-repair/` |  |
| `/marine-products-and-services/` | Top Quality Marine Products And Services Abu Dhabi | Marine Industry Solutions | top quality marine products and services in Abu Dhabi | yes | KEEP | `/marine-products-and-services/` |  |
| `/optimizing-engine-performance-with-yanmar-spare-parts-in-saudi-arabia/` | Yanmar Spare Parts Supplier in Saudi Arabia | Optimizing Engine Performance with Yanmar Spare Parts in Saudi Arabia | Yanmar spare parts Saudi Arabia | yes | KEEP | `/optimizing-engine-performance-with-yanmar-spare-parts-in-saudi-arabia/` |  |
| `/outboard-engine-repair-overhaul-in-abu-dhabi/` | Outboard Engine Repair and Overhaul in Abu Dhabi | Outboard Engine Repair & Overhaul in Abu Dhabi | outboard engine repair & overhaul in Abu Dhabi | yes | KEEP | `/outboard-engine-repair-overhaul-in-abu-dhabi/` |  |
| `/performance-tuning-optimization/` | Marine Engine Performance Tuning & Optimization in Abu Dhabi | Performance Tuning & Optimization | marine engine performance tuning Abu Dhabi | yes | KEEP | `/performance-tuning-optimization/` |  |
| `/pistons-piston-rings-in-abu-dhabi/` | Pistons & Piston Rings for Marine Engines in Abu Dhab | Pistons & Piston Rings in Abu Dhabi | pistons & piston rings in Abu Dhabi | yes | KEEP | `/pistons-piston-rings-in-abu-dhabi/` |  |
| `/power-generation/` | Products and Services for Power Generation Industry in UAE | Power Generation Industry Solutions | power generation spare parts UAE | yes | KEEP | `/power-generation/` |  |
| `/routine-maintenance-diagnostics-in-abu-dhabi/` | Routine Maintenance & Diagnostics in Abu Dhabi | Routine Maintenance & Diagnostics in Abu Dhabi | routine maintenance & diagnostics Abu Dhabi | yes | KEEP | `/routine-maintenance-diagnostics-in-abu-dhabi/` |  |
| `/turbocharger-overhauls-in-abu-dhabi/` | Turbocharger Overhauls in Abu Dhabi | Turbocharger Overhauls in Abu Dhabi | turbocharger overhauls in Abu Dhabi; marine turbocharger overhaul Abu Dhabi | yes | KEEP | `/turbocharger-overhauls-in-abu-dhabi/` |  |
| `/turbochargers-cartridges-in-abu-dhabi/` | Marine Turbochargers and Cartridges in Abu Dhabi | Turbochargers & Cartridges in Abu Dhabi | turbochargers & cartridges in Abu Dhabi; marine engine turbocharger Abu Dhabi; parts of turbocharger Abu Dhabi | yes | KEEP | `/turbochargers-cartridges-in-abu-dhabi/` |  |
| `/ultrasonic-cleaning-for-parts-in-abu-dhabi/` | Ultrasonic Cleaning for Parts in Abu Dhabi - JRS | Ultrasonic Cleaning for Parts in Abu Dhabi | ultrasonic cleaning for parts in Abu Dhabi | **missing** | KEEP | `/ultrasonic-cleaning-for-parts-in-abu-dhabi/` |  |
| `/wartsila-engine-spare-parts-in-saudi-arabia/` | Wartsila Engine Spare Parts in Saudi -Jeddah, Riyadh & Dammam | Wartsila Marine Engine Spare Parts Supplier in Saudi Arabia | Wärtsilä engine spare parts in Saudi Arabia | yes | KEEP | `/wartsila-engine-spare-parts-in-saudi-arabia/` |  |
| `/wartsila-marine-engine-spare-parts-supplier/` | Wartsila Marine Engine Spare Parts - UAE, Oman, Bahrain & Qatar | Wärtsilä Marine Engine Spare Parts | Wärtsilä marine engine spare parts supplier in UAE | yes | KEEP | `/wartsila-marine-engine-spare-parts-supplier/` |  |
| `/yanmar-marine-engine-spare-parts-for-marine-operations/` | Yanmar Marine Engine Spare Parts Supplier | Yanmar Marine Engine Spare Parts for Marine Operations | Yanmar marine engine spare parts in Oman / supplier | yes | KEEP | `/yanmar-marine-engine-spare-parts-for-marine-operations/` |  |
| `/yanmar-marine-engine-spare-parts-supplier-in-uae/` | Yanmar Marine Engine Spare Parts Supplier in UAE | Yanmar Marine Engine Spare Parts Supplier in UAE | Yanmar marine engine spare parts (supplier) in UAE | yes | KEEP | `/yanmar-marine-engine-spare-parts-supplier-in-uae/` |  |
| `/yanmar-marine-engine-spare-parts-supplier/` | Yanmar Marine Engine Spare Parts Supplier Across GCC | Yanmar Marine Engine Spare Parts | Yanmar marine engine spare parts supplier (GCC) | yes | KEEP | `/yanmar-marine-engine-spare-parts-supplier/` |  |

## 6. Pre-launch SEO checklist

- [ ] Crawl the staging site with the 45 old URLs: every one returns 200 (KEEP) or a single-hop 301 (no chains).
- [ ] `<title>`, H1 and meta description per URL match this table's intent. Diff them with `scripts/` tooling before launch.
- [ ] Canonicals are absolute (`https://jrs-me.com/...`) with a trailing slash.
- [ ] The new `sitemap.xml` excludes redirected URLs. Resubmit in Search Console and keep `sitemap_index.xml` 301 → `/sitemap.xml`.
- [ ] No page contains `+971 50 245 0986` (`grep -r "245 0986"` in the build output).
- [ ] Image alt text is carried over from the live pages (see raw crawl `alts`).
- [ ] Keep GA4 and Search Console verification tags.
