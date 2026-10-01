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
  geo: { lat: 24.4539, lng: 54.3773, label: "24.4539° N · 54.3773° E" },
} as const;

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
