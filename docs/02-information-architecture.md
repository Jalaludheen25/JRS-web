# 02 — Information Architecture & Sitemap

## Principles

1. **Every ranking URL stays where it is.** The architecture is built around them; nothing is moved into a "cleaner" folder structure that would cost rankings.
2. **Hubs give context to flat URLs.** The legacy pages sit at the root (`/engine-bearings-in-abu-dhabi/`). Hubs (`/products/`, `/services/`, `/brands/`, `/industries/`) plus breadcrumbs and `BreadcrumbList` schema give them a logical parent without changing their URL.
3. **New pages follow one pattern.** New products use the established `/<topic>-in-abu-dhabi/` pattern. New services, which have no legacy URL, live under `/services/<slug>/` as the brief proposes.
4. **Quote is never more than one tap away.** A persistent "Request a quote" item sits in the nav, a WhatsApp/Call dock on mobile, and a CTA band on every template.

## Primary navigation

```
JRS (logo → /)
About        → /about/
Products     → /products/        (mega panel: 11 products)
Services     → /services/        (mega panel: 14 services)
Industries   → /industries/      (Marine · Power Generation · Industrial · Offshore)
Brands       → /brands/          (Cummins · Wärtsilä · Yanmar + engine makes supported)
Insights     → /blogs/           (label "Insights", URL preserved)
[ REQUEST A QUOTE ] → /contact/#quote
```

## Sitemap

Legend: ● existing URL kept · ◐ existing URL rebuilt as hub · ○ new URL

```
/                                                         ● Home
├── /about/                                               ● About JRS (mission, vision, certifications)
├── /contact/                                             ● Contact + Request a quote
│
├── /products/                                            ◐ Products hub   (/engine-parts/ 301s here)
│   ├── /engine-bearings-in-abu-dhabi/                    ●
│   ├── /cylinder-heads-components-in-abu-dhabi/          ●
│   ├── /fuel-injection-systems-components-in-abu-dhabi/  ●
│   ├── /pistons-piston-rings-in-abu-dhabi/               ●
│   ├── /liners-anti-polishing-rings-in-abu-dhabi/        ●
│   ├── /filters/                                         ●
│   ├── /turbochargers-cartridges-in-abu-dhabi/           ●
│   ├── /coolers-heat-exchangers-in-abu-dhabi/            ●
│   ├── /automatic-voltage-regulator-supplier-in-uae/     ●
│   └── /genset-controllers-amf-in-abu-dhabi/             ○ Genset Controllers & AMF (from profiles)
│
├── /services/                                            ○ Services hub
│   ├── /engine-overhaul-service-in-abu-dhabi/            ●  (/services/engine-overhaul/ 301s here)
│   ├── /turbocharger-overhauls-in-abu-dhabi/             ●  (/services/turbocharger-overhaul/ 301s here)
│   ├── /outboard-engine-repair-overhaul-in-abu-dhabi/    ●
│   ├── /routine-maintenance-diagnostics-in-abu-dhabi/    ●
│   ├── /boats-maintenance-and-services/                  ●
│   ├── /ultrasonic-cleaning-for-parts-in-abu-dhabi/      ●
│   ├── /performance-tuning-optimization/                 ●
│   ├── /lorange-injectors-and-pumps-repair/              ●  (post; also linked as a service)
│   ├── /services/fuel-pump-overhaul/                     ○
│   ├── /services/marine-fuel-pump-injector-service/      ○
│   ├── /services/electrical-instrumentation/             ○
│   ├── /services/governors/                              ○
│   ├── /services/reconditioning-engine-parts/            ○
│   └── /services/starter-motor-alternator-service/       ○
│
├── /industries/                                          ◐ Industries hub
│   ├── /marine-products-and-services/                    ●  Marine
│   ├── /power-generation/                                ●  Power Generation
│   ├── /industries/industrial/                           ○  Industrial
│   └── /industries/offshore/                             ○  Offshore
│
├── /brands/                                              ○ Brands hub (logo wall + disclaimer)
│   ├── /cummins-engine-spare-parts/                      ●
│   ├── /wartsila-marine-engine-spare-parts-supplier/     ●
│   └── /yanmar-marine-engine-spare-parts-supplier/       ●
│
├── /blogs/                                               ● Insights index
│   ├── /category/cummins/                                ●
│   ├── /category/fuel-injection/                         ●
│   ├── /category/marine-engine-spare-parts/              ●
│   └── 11 posts at their existing root URLs              ●
│
├── /privacy-policy/                                      ○ (required once the form collects data)
├── /sitemap.xml  /robots.txt                             generated
└── 404                                                   designed, with search shortcuts + quote CTA
```

**Industrial / Offshore pages:** the brief lists both industries. "Offshore" is supported by live-site copy (22 pages mention offshore operations) and "industrial" by the profiles' "marine and industrial spare parts". Each gets a short hub page built only from existing statements. If that's too thin, ship them as sections of `/industries/` and add the pages later.

## Templates

| Template | Used by | Key blocks |
|---|---|---|
| **Home** | `/` | See [03-design-system.md § Homepage](03-design-system.md#homepage-narrative) |
| **Product detail** | 10 product URLs | Hero (product on light plate) → Overview → Components/variants → Applications → Brand compatibility → Specifications (only where sourced; otherwise "Contact JRS for availability and specifications") → Related services → Related products → Quote CTA |
| **Service detail** | 14 service URLs | Cinematic hero → Overview → Process (numbered steps, where the source has a process) → Capabilities → Applications → Related products → Quote CTA |
| **Brand page** | 3 brand URLs | Brand hero → Coverage (countries named in existing copy) → Parts available → Reference-only disclaimer → Related posts |
| **Industry page** | 4 URLs | Full-bleed hero → Challenges → Relevant products/services → CTA |
| **Hub** | products / services / industries / brands | Index with large editorial rows, filters where useful |
| **Insight post** | 11 posts | Long-form editorial layout, `Article` schema, related products |
| **Contact** | `/contact/` | Quote form, Call / WhatsApp / Email, address, map |

## Internal-linking rules

- Each product page links to ≥ 2 related services and ≥ 2 related products. Each service page links to the products it uses.
- Brand pages link to their country posts (e.g. Cummins → UAE, Saudi Arabia, Kuwait, marine & industrial posts).
- Anchor text is descriptive and varied ("engine bearings in Abu Dhabi", "marine turbocharger overhaul"), never repeated exact-match stuffing.
- The footer carries the product and service lists. That is useful navigation, not a keyword block.
