// Contact and identity facts. Sources: docs/04-fact-register.md
export const site = {
  name: "JRS Mechanical Equipment",
  legalName: "JRS MECHANICAL EQUIPMENT-L.L.C-S.P.C",
  legalNameAr: "جي ار اس للمعدات الميكانيكية - د.م.م - شش و",
  tagline: "Quality Spares, Reliable Repairs",
  url: "https://jrs-me.com",
  email: "info@jrs-me.com",
  phone: {
    display: "+971 55 770 4485",
    tel: "tel:+971557704485",
    e164: "+971557704485",
  },
  whatsapp: "https://wa.me/971557704485",
  address: {
    building: "Hanging Garden Tower",
    floor: "2nd Floor",
    office: "Office No. 36",
    street: "Al Nahlah Street",
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
  },
  // JRS's Google Business Profile listing ("JRS Mechanical Equipment L.L.C -S.P.C", Hanging Garden Tower - 2nd Floor),
  // the map the previous site embedded on its contact page. Coordinates are that listing's pin.
  maps: { query: "JRS Mechanical Equipment L.L.C -S.P.C" },
  geo: { lat: 24.4907, lng: 54.3645, label: "24.4907° N · 54.3645° E" },
} as const;

const mapsQuery = encodeURIComponent(site.maps.query);
export const maps = {
  /** Keyless Google Maps embed (iframe src), centred on the business listing. */
  embed: `https://maps.google.com/maps?q=${mapsQuery}&t=m&z=16&output=embed&iwloc=near`,
  /** Opens the listing in Google Maps (app on phones). */
  open: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  /** Turn-by-turn directions to the listing. */
  directions: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
};

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "About", href: "/about/" },
  { label: "Products", href: "/products/" },
  { label: "Services", href: "/services/" },
  { label: "Industries", href: "/industries/" },
  { label: "Brands", href: "/brands/" },
  { label: "Insights", href: "/blogs/" },
];

export const quoteHref = "/contact/#quote";
