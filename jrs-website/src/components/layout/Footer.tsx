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
    <footer className="relative overflow-hidden border-t-[3px] border-heritage bg-heritage-deep pb-28 pt-24 text-fog lg:pb-10">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/brand/jrs-logo-white.png" alt="JRS Mechanical Equipment" width={1080} height={537} className="h-20 w-auto" />
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
              <p className="label flex items-center gap-2 text-steel-500">
                <span aria-hidden className="size-1.5 bg-accent" />
                {col.title}
              </p>
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

        {/* Brand line, set at full strength like the hero headline. */}
        <p className="display mt-24 text-[clamp(2.75rem,11vw,5rem)] text-white sm:text-[clamp(3rem,8.6vw,10rem)] lg:whitespace-nowrap">
          Engineered <br className="sm:hidden" />
          for <span className="accent text-accent">uptime.</span>
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-steel-500 md:flex-row md:items-center md:justify-between">
          <p className="label">© {year} {site.legalName}</p>
          <p className="label tabular-nums"><span className="text-accent">{site.geo.label}</span> — Abu Dhabi, UAE</p>
        </div>
      </div>
    </footer>
  );
}
