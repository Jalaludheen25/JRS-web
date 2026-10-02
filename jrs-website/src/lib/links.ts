import { services, products } from "./content";
import { getPage, postImage, type Img } from "./pages";

export type LinkCard = { href: string; label: string; kind: string; image?: Img; summary?: string };

const industryPages: Record<string, LinkCard> = {
  "industries/industrial": { href: "/industries/industrial/", label: "Industrial", kind: "Industry", image: { src: "/images/scenes/engine-parts-dark-graded.jpg", alt: "Industrial engine components", fit: "cover" } },
  "industries/offshore": { href: "/industries/offshore/", label: "Offshore", kind: "Industry", image: { src: "/images/scenes/port-vessel-aerial-graded.jpg", alt: "Vessels and port infrastructure from above", fit: "cover" } },
};

const kindLabel = { product: "Product", service: "Service", industry: "Industry", brand: "Brand", post: "Insight" } as const;

/** Resolves a registry key ("filters", "services/governors", "industries/offshore") to a card. */
export function resolveLink(key: string): LinkCard | undefined {
  if (key.startsWith("services/")) {
    const s = services.find((x) => x.href === `/${key}/`);
    return s && { href: s.href, label: s.title, kind: "Service", image: { ...s.image, fit: "cover" }, summary: s.body };
  }
  if (key.startsWith("industries/")) return industryPages[key];
  const p = getPage(key);
  if (!p) return undefined;
  const product = products.find((x) => x.href === `/${key}/`);
  const service = services.find((x) => x.href === `/${key}/`);
  return { href: `/${p.slug}/`, label: p.label, kind: kindLabel[p.kind], image: p.image ?? postImage(p.slug), summary: product?.summary ?? service?.body ?? p.description };
}
