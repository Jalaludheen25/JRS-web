// Extracts the body content of every crawled live page into ordered blocks
// (headings, paragraphs, lists, images) so the rebuild keeps the existing, ranking copy.
// Input: ../docs/source-html/*.html (raw crawl, 2026-10-01). Output: ../docs/source-content/extracted.json
// Run from jrs-website/: node scripts/extract-content.mjs
import fs from "fs";
import path from "path";
import { parse } from "node-html-parser";

const IN = "../docs/source-html";
const OUT = "../docs/source-content/extracted.json";

const decode = (s) =>
  s
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#038;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\s+/g, " ")
    .trim();

// Boilerplate that appears on every page and is rebuilt as design components instead.
const SKIP = [/^get a free quote$/i, /^read more/i, /^leave a reply/i, /^share/i, /^previous|^next/i, /^search$/i, /^recent posts$/i, /^categories$/i];

const out = {};
for (const file of fs.readdirSync(IN).filter((f) => f.endsWith(".html"))) {
  const route = file.replace(/\.html$/, "").replace(/_/g, "/") || "/";
  const root = parse(fs.readFileSync(path.join(IN, file), "utf8"));
  const region = root.querySelector('[data-elementor-type="wp-page"], [data-elementor-type="single-post"], [data-elementor-type="archive"], main');
  if (!region) {
    out[route] = { blocks: [] };
    continue;
  }
  // Drop comment forms, post navigation and sidebars inside the template.
  region.querySelectorAll("form, .comments-area, #comments, .elementor-widget-post-navigation, .elementor-widget-post-comments, script, style, noscript").forEach((n) => n.remove());

  const blocks = [];
  const seen = new Set();
  const walk = (node) => {
    for (const el of node.childNodes) {
      if (el.nodeType !== 1) continue;
      const tag = el.rawTagName?.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        const text = decode(el.text);
        if (text && !SKIP.some((r) => r.test(text))) blocks.push({ type: tag, text });
        continue;
      }
      if (tag === "p") {
        const text = decode(el.text);
        if (text.length > 1 && !SKIP.some((r) => r.test(text))) blocks.push({ type: "p", text });
        continue;
      }
      if (tag === "ul" || tag === "ol") {
        const items = el.querySelectorAll("li").map((li) => decode(li.text)).filter(Boolean);
        if (items.length) blocks.push({ type: "list", ordered: tag === "ol", items });
        continue;
      }
      if (tag === "img") {
        const src = (el.getAttribute("data-src") || el.getAttribute("src") || "").replace(/-\d+x\d+(\.\w+)$/, "$1");
        const alt = decode(el.getAttribute("alt") || "");
        if (src && !/logo/i.test(src) && !seen.has(src)) {
          seen.add(src);
          blocks.push({ type: "img", src, alt });
        }
        continue;
      }
      // Elementor text widgets sometimes hold bare text in a div.
      if (tag === "div" && el.classList?.contains("elementor-text-editor") && !el.querySelector("p, ul, ol, h1, h2, h3, h4")) {
        const text = decode(el.text);
        if (text) blocks.push({ type: "p", text });
        continue;
      }
      walk(el);
    }
  };
  walk(region);

  // Collapse consecutive duplicates (Elementor renders mobile/desktop copies).
  const dedup = blocks.filter((b, i) => !(i && JSON.stringify(b) === JSON.stringify(blocks[i - 1])));
  out[route] = { blocks: dedup };
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
for (const [r, v] of Object.entries(out)) console.log(String(v.blocks.length).padStart(4), r);
