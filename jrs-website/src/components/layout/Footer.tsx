import Image from "next/image";
import Link from "next/link";
import { products, services, brandPages } from "@/lib/content";
import { primaryNav, site } from "@/lib/site";

const cols = [
  { title: "Products", links: products.map((p) => ({ label: p.name, href: p.href })) },
  { title: "Services", links: services.map((s) => ({ label: s.title, href: s.href })) },
  {
    title: "Company",
    links: [
      ...primaryNav,
      ...brandPages.map((b) => ({ label: `${b.name} spare parts`, href: b.href })),
      { label: "Contact", href: "/contact/" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink pb-28 pt-24 text-fog lg:pb-10">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/brand/jrs-logo.png" alt="JRS Mechanical Equipment" width={720} height={358} className="h-20 w-auto brightness-0 invert" />
            <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-steel-300">
              Quality spares and reliable repairs for the marine and power-generation sectors, supplied from Abu Dhabi.
            </p>
            <address className="mt-10 space-y-1 text-[15px] not-italic leading-relaxed text-fog/90">
              <p>{site.legalName}</p>
              <p lang="ar" dir="rtl" className="text-left text-steel-300">{site.legalNameAr}</p>
              <p className="pt-3 text-steel-300">
                {site.address.building}, {site.address.floor}, {site.address.office}
                <br />
                {site.address.street}, {site.address.city}, UAE
              </p>
            </address>
            <ul className="mt-8 space-y-2 text-[15px]">
              <li>
                <a className="link-underline" href={site.phone.tel}>{site.phone.display}</a>
              </li>
              <li>
                <a className="link-underline" href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp JRS</a>
              </li>
              <li>
                <a className="link-underline" href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
          </div>

          <div className="grid gap-12 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
          {cols.map((col) => (
            <nav key={col.title} aria-label={`Footer ${col.title}`}>
              <p className="label text-steel-500">{col.title}</p>
              <ul className="mt-6 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="link-underline text-[14px] leading-snug text-fog/75 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          </div>
        </div>

        <p aria-hidden className="display mt-24 select-none text-[clamp(4rem,19vw,20rem)] text-white/[0.04]">
          Engineered for uptime
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-steel-500 md:flex-row md:items-center md:justify-between">
          <p className="label">© {year} {site.legalName}</p>
          <p className="label tabular-nums">{site.geo.label} — Abu Dhabi, UAE</p>
        </div>
      </div>
    </footer>
  );
}
