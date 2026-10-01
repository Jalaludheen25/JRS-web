import type { NextConfig } from "next";

// Every URL on the live WordPress site ends in "/". Keep it that way so no ranking URL changes.
// Redirect map documented in docs/01-audit-and-seo-migration.md §4.
const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80, 90],
  },
  async redirects() {
    return [
      { source: "/home/", destination: "/", permanent: true },
      { source: "/engine-parts/", destination: "/products/", permanent: true },
      { source: "/error/", destination: "/", permanent: true },
      { source: "/error-page/", destination: "/", permanent: true },
      { source: "/author/:slug/", destination: "/blogs/", permanent: true },
      { source: "/author/:slug/page/:n/", destination: "/blogs/", permanent: true },
      { source: "/:y(\\d{4})/:m(\\d{2})/:d(\\d{2})/", destination: "/blogs/", permanent: true },
      { source: "/:y(\\d{4})/:m(\\d{2})/", destination: "/blogs/", permanent: true },
      { source: "/marine-products-and-servic/", destination: "/marine-products-and-services/", permanent: true },
      { source: "/feed/", destination: "/blogs/", permanent: true },
      { source: "/comments/feed/", destination: "/blogs/", permanent: true },
      { source: "/:slug/feed/", destination: "/:slug/", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/post-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/category-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/author-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      // Brief-proposed service URLs point at the existing ranking pages instead of replacing them.
      { source: "/services/engine-overhaul/", destination: "/engine-overhaul-service-in-abu-dhabi/", permanent: true },
      { source: "/services/turbocharger-overhaul/", destination: "/turbocharger-overhauls-in-abu-dhabi/", permanent: true },
    ];
  },
};

export default nextConfig;
