import type { Metadata } from "next";
import { site } from "./site";
import { certifications } from "./content";

export const absolute = (path: string) => new URL(path, site.url).toString();

type PageMeta = {
  /** Exact <title>. Legacy pages keep their ranking titles verbatim (docs/01-audit-and-seo-migration.md). */
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function pageMetadata({ title, description, path, image = "/images/og/jrs-og.jpg" }: PageMeta): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: "JRS Mechanical Equipment",
      title,
      description,
      locale: "en_AE",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

const orgId = `${site.url}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": orgId,
        name: site.name,
        legalName: site.legalName,
        alternateName: ["JRS", site.legalNameAr],
        slogan: site.tagline,
        url: site.url,
        logo: absolute("/brand/jrs-logo.png"),
        image: absolute("/images/og/jrs-og.jpg"),
        email: site.email,
        telephone: site.phone.e164,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.address.building}, ${site.address.floor}, ${site.address.office}, ${site.address.street}`,
          addressLocality: site.address.city,
          addressCountry: site.address.countryCode,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        areaServed: ["United Arab Emirates", "Saudi Arabia", "Oman", "Qatar", "Bahrain", "Kuwait"].map((c) => ({ "@type": "Country", name: c })),
        hasCredential: certifications
          .filter((c) => c.code.startsWith("ISO"))
          .map((c) => ({ "@type": "EducationalOccupationalCredential", credentialCategory: "certification", name: `${c.code} ${c.label}` })),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phone.e164,
          email: site.email,
          contactType: "sales",
          areaServed: "AE",
          availableLanguage: ["en", "ar"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: "JRS Mechanical Equipment",
        publisher: { "@id": orgId },
        inLanguage: "en",
      },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

export { orgId };
