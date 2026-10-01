import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";

// Only routes that are built are listed. As templates ship, add their URLs here
// (the full target list is in docs/02-information-architecture.md).
const built = ["/", "/contact/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return built.map((path) => ({
    url: absolute(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
