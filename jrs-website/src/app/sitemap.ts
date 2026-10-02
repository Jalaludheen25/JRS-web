import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";
import { categories, getLegacyContent, pages } from "@/lib/pages";
import { services, industries } from "@/lib/content";

// Every built route. Redirected legacy URLs (docs/01 §4) are deliberately absent.
export default function sitemap(): MetadataRoute.Sitemap {
  const hubs = ["/", "/about/", "/products/", "/services/", "/industries/", "/brands/", "/blogs/", "/contact/"];
  const nested = [
    ...services.filter((s) => s.href.startsWith("/services/")).map((s) => s.href),
    ...industries.filter((i) => i.href.startsWith("/industries/")).map((i) => i.href),
    ...Object.keys(categories).map((c) => `/category/${c}/`),
  ];

  const toDate = (d?: string) => (d ? new Date(`${d} 12:00 UTC`) : undefined);

  return [
    ...hubs.map((path) => ({ url: absolute(path), changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.8 })),
    ...pages.map((p) => ({
      url: absolute(`/${p.slug}/`),
      lastModified: p.kind === "post" ? toDate(getLegacyContent(p.slug)?.date) : undefined,
      changeFrequency: "monthly" as const,
      priority: p.kind === "post" ? 0.5 : 0.7,
    })),
    ...nested.map((path) => ({ url: absolute(path), changeFrequency: "monthly" as const, priority: path.startsWith("/category/") ? 0.3 : 0.6 })),
  ];
}
