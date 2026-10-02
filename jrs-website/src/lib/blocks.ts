// Content block model shared by legacy (extracted) and authored pages.
export type Block =
  | { type: "h2" | "h3" | "h4" | "h5" | "h6"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] };

export type Section = { heading?: string; blocks: Block[] };

/** Splits blocks into sections at each H2. Blocks before the first H2 become an untitled intro. */
export function toSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  let cur: Section = { blocks: [] };
  for (const b of blocks) {
    if (b.type === "h2") {
      if (cur.heading || cur.blocks.length) sections.push(cur);
      cur = { heading: b.text, blocks: [] };
    } else cur.blocks.push(b);
  }
  if (cur.heading || cur.blocks.length) sections.push(cur);
  return sections;
}

/** "Title – description" / "Title: description" list items render as feature cards. */
export function splitFeature(item: string): { title: string; body: string } | null {
  const m = item.match(/^(.{3,70}?)\s*(?:[–—:]|\s-\s)\s*(.{12,})$/);
  if (!m) return null;
  return { title: m[1].replace(/[.:]$/, ""), body: m[2] };
}
