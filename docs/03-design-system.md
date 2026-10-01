# 03 — Visual Direction & Design System

## Concept: "Datum"

In engineering drawings, the **datum** is the fixed reference every measurement is taken from. JRS's role is the same for its clients: the fixed point that keeps machinery within tolerance.

The site borrows the language of a **technical drawing sheet** and pairs it with **luxury editorial pacing**:

- **Sheet numbering.** Each homepage section carries a sheet label (`SHEET 04 / 13 — CORE CAPABILITIES`) in mono type, like a drawing's title block. It doubles as a progress cue.
- **Hairline construction lines.** 1px grid lines, crop marks and dimension lines frame images and headings. They draw themselves on scroll, then stay still. Nothing pulses or glows.
- **Coordinates as identity.** Abu Dhabi's coordinates (24.4539° N, 54.3773° E) appear in the hero readout and footer. It is a quiet, true detail that signals "engineered and located".
- **Two surfaces.** *Abyss* (deep navy-black) for cinematic marine and service storytelling, and *Plate* (cool steel-white) for products. Product photos are shot on light grey, so they sit on the light "inspection plate" like objects on a measurement table. That is the furniture-catalogue idea, made industrial.
- **Monochrome photography.** All scene photography is graded to cool monochrome (`scripts/grade-images.mjs`), with a navy multiply overlay and subtle grain. This hides the saturated stock-photo look and unifies the mixed image sources.

What it avoids: neon, glass cards, gradient blobs, rounded "SaaS" cards, stock handshakes, and 3D used as decoration.

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `abyss` | `#060A14` | Primary dark surface |
| `ink` | `#03050A` | Footer, deepest layer |
| `navy-900` | `#0A1428` | Raised dark panels |
| `navy-800` | `#10203F` | Hover / active dark |
| `marine` | `#2147A0` | Brand blue (from logo `#21409A`): CTAs, focus |
| `marine-bright` | `#4A78E0` | Links and active states on dark |
| `signal` | `#7DD8F5` | **Rare** accent: live readouts, one data point per screen |
| `plate` | `#EEF1F5` | Light product surface |
| `plate-deep` | `#E2E6EC` | Product image wells |
| `steel-300` | `#B6BFCB` | Secondary text on dark |
| `steel-500` | `#7A8594` | Metadata |
| `graphite` | `#1A1F28` | Body text on plate |
| `line` | `rgb(255 255 255 / .12)` | Hairlines on dark |
| `line-dark` | `rgb(10 20 40 / .14)` | Hairlines on plate |

Contrast: body text on `abyss` uses `#E8ECF2` (≈ 15:1); `steel-300` on `abyss` ≈ 9:1; `graphite` on `plate` ≈ 14:1. Signal cyan is never used for text below 18px.

## Typography

| Role | Face | Spec |
|---|---|---|
| Display | **Geist** 500 | `clamp(3.5rem, 11vw, 12rem)`, line-height .86, tracking −0.055em, uppercase for statement headlines |
| Heading | Geist 500 | `clamp(2rem, 4.4vw, 4.25rem)`, lh 1.0, tracking −0.035em |
| Editorial accent | **Instrument Serif** italic | Used for one word or phrase per headline at most ("*under pressure*") |
| Body | Geist 400 | 17–19px, lh 1.6, max 62ch |
| Label / metadata | **Geist Mono** 500 | 11–12px, uppercase, tracking 0.16em |

All fonts are self-hosted via `next/font` (no layout shift, no third-party request).

## Grid & spacing

- 12-column grid, 24px gutters. Page margin `clamp(16px, 4vw, 64px)`. Max content width 1680px.
- Section rhythm: `clamp(96px, 14vw, 220px)` vertical padding. The large whitespace is the luxury signal.
- Radius: **0** almost everywhere. 999px only for the small pill CTA and the cursor.

## Motion principles

"Fewer, better" in practice:

| Pattern | Where | Spec |
|---|---|---|
| Line-mask reveal | Statement headlines | Each line slides up from a clip mask, 80ms stagger, `cubic-bezier(.22,1,.36,1)`, 1.1s |
| Clip-path image reveal | Editorial images | `inset(100% 0 0 0)` → `inset(0)`, 1.2s, with a 1.15 → 1 scale |
| Hero scroll-zoom | Hero | The image shrinks into a framed window as you scroll (scroll-linked, no timers) |
| Pinned horizontal track | Capabilities, Industries | Vertical scroll drives horizontal translation. Native vertical stack on touch and reduced motion. |
| Hairline draw | Section rules, dimension lines | `scaleX` 0 → 1, once |
| Magnetic CTA | Primary buttons (pointer: fine only) | ≤ 8px pull, spring back |
| Product plate hover | Product index | Image scales 1.06, spec sheet slides in, background shifts plate → white |
| 3D | Turbocharger section only | Procedural compressor wheel (R3F), slow rotation plus scroll-linked spin. Loaded on view, desktop only, with an SVG fallback. |

`prefers-reduced-motion: reduce` disables smooth scrolling, scroll-linked transforms, the 3D spin and all reveals (content renders in place).

## Components

`Container` · `Eyebrow` (sheet label) · `DisplayHeading` / `RevealLines` · `SectionHeading` · `Button` / `MagneticButton` · `ArrowLink` · `ImageReveal` · `ParallaxImage` · `Marquee` · `TechnicalSpec` (definition-list spec sheet) · `ProductShowcase` · `ProductCard` (editorial plate row) · `ServiceCard` · `BrandCard` · `HorizontalTrack` · `TurboViewer` (3D) · `Navbar` · `MobileMenu` · `Footer` · `QuoteForm` · `ContactDock` (mobile) · `Breadcrumbs` · `SEOSection` · `JsonLd`.

## Homepage narrative

| Sheet | Section | Surface | Signature moment |
|---|---|---|---|
| 01 | Hero: **ENGINEERED FOR UPTIME.** | Abyss, full-bleed graded vessel | Headline masks in; live coordinate readout; on scroll the photo contracts into a framed "viewport" |
| 02 | Brand statement: **QUALITY SPARES. RELIABLE REPAIRS.** | Abyss | Huge type, lines reveal one at a time, second line in outline |
| 03 | About JRS | Split: image / copy | Clip reveal image, mission excerpt, "Discover JRS" |
| 04 | Core capabilities ×6 | Abyss, pinned horizontal track | Oversized index numbers, one panel per capability |
| 05 | Products: **PRECISION COMPONENTS. CRITICAL PERFORMANCE.** | Plate | Editorial index: hovering a row reveals its product image and spec on a sticky plate |
| 06 | Engine bearings feature | Plate → white | Product parallax with dimension lines; three bearing types as a spec list |
| 07 | Turbochargers: **POWER, *under pressure*.** | Abyss | 3D compressor wheel; brand list ABB–IHI / MAN / Napier / Mitsubishi / KBB |
| 08 | Engine overhaul: **WHEN PERFORMANCE CANNOT WAIT.** | Abyss, full-bleed rotor image | 12 capabilities as a numbered two-column checklist |
| 09 | Technical services ×8 | Navy | Sticky list (left), with image and description swapping (right) |
| 10 | Industries: **BUILT FOR DEMANDING OPERATIONS.** | Full-screen panels | Horizontal panels: Marine / Power Gen / Industrial / Offshore |
| 11 | Engine makes | Plate | Two-row typographic marquee, plus the reference-only disclaimer |
| 12 | Certified for confidence | Abyss | ISO 9001 / 14001 / 45001 + ICV + Interstate-McBee distributor |
| 13 | Mission / vision | Abyss | Editorial two-column statement, set like a magazine pull quote |
| 14 | Contact: **LET'S KEEP YOUR OPERATIONS MOVING.** | Marine blue | Call / WhatsApp / quote, plus the footer |

## Imagery inventory & gaps

Available (from the live site, in `public/images/`): 9 product renders on light grey, 7 marine/port/engine scenes, and certificate badges. **Gaps:** no video, no engine-room or real JRS workshop photography, and no offshore or power-plant imagery. The biggest single upgrade before launch would be a half-day shoot at the JRS workshop (overhauls, test bench, parts on a dark table) plus a 10–15s ambient engine-room loop for the hero. Until then the concept uses graded stills, and the hero video slot is wired but empty.
