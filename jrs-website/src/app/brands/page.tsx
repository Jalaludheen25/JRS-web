import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { QuoteBand } from "@/components/page/QuoteBand";
import { Marquee } from "@/components/ui/primitives";
import { brandPages, partsMakes, reconditioningMakes, referenceDisclaimer, turbochargerMakes } from "@/lib/content";
import { getPage } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Engine Brands We Support – Cummins, Wärtsilä, Yanmar & More | JRS",
  description:
    "Spare parts and reconditioning support from JRS for Cummins, Wärtsilä, Yanmar, Caterpillar, MAN, MaK, Deutz, Mitsubishi and other marine and industrial engine makes.",
  path: "/brands/",
});

const governorMakes = ["Woodward", "Regulateurs Europa", "Zexel", "Yanmar", "Heinzmann"];

export default function BrandsPage() {
  const reconOnly = reconditioningMakes.filter((m) => !partsMakes.includes(m));
  const groups = [
    { label: "Replacement spare parts", items: partsMakes },
    { label: "Reconditioning support", items: reconditioningMakes },
    { label: "Turbocharger makes", items: turbochargerMakes },
    { label: "Governors & actuators", items: governorMakes },
  ];
  return (
    <>
      <PageHero
        variant="plate"
        eyebrow="Engine makes"
        title="Parts for the engines you run."
        lead="Replacement spare parts and reconditioning support for the main marine, industrial and power-generation engine makes, supplied from Abu Dhabi across the GCC."
        crumbs={[{ name: "Brands", path: "/brands/" }]}
      />

      <section aria-labelledby="brand-pages-title" className="bg-plate pb-[var(--section-y)] text-graphite">
        <div className="shell">
          <h2 id="brand-pages-title" className="label text-steel-500">Dedicated brand pages</h2>
          <ul className="mt-6 grid gap-px bg-graphite/12 md:grid-cols-3">
            {brandPages.map((b) => {
              const img = getPage(b.href.replace(/^\/|\/$/g, ""))?.image;
              return (
                <li key={b.href} className="bg-plate">
                  <Link href={b.href} className="group flex h-full flex-col p-5 transition-colors duration-500 hover:bg-white">
                    {img && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-white">
                        <Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-contain p-4 mix-blend-multiply transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
                      </div>
                    )}
                    <p className="heading mt-6 flex items-start justify-between text-[clamp(1.75rem,2.6vw,2.5rem)] text-abyss">
                      {b.name}
                      <ArrowUpRight className="mt-2 size-5 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} aria-hidden />
                    </p>
                    <p className="mt-2 text-[15px] text-graphite/70">{b.name} engine spare parts</p>
                    <p className="label mt-3 text-steel-500">{b.note}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-label="Engine makes" className="section-y overflow-hidden bg-abyss">
        <Marquee items={partsMakes} duration={55} className="heading text-[clamp(2.5rem,6vw,6rem)] text-white" />
        <Marquee items={[...reconOnly, ...reconOnly]} reverse duration={45} className="heading outline-type mt-4 text-[clamp(2.5rem,6vw,6rem)] text-steel-300" />
        <div className="shell mt-[clamp(48px,6vw,96px)] grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.label}>
              <h2 className="label text-steel-500">{g.label}</h2>
              <ul className="mt-5 border-t border-white/12">
                {g.items.map((m) => (
                  <li key={m} className="border-b border-white/10 py-3 text-[16px] text-fog/90">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="shell mt-16 grid gap-8 lg:grid-cols-12">
          <p className="text-[15px] leading-relaxed text-steel-300 lg:col-span-6">
            JRS is an authorized distributor for Interstate-McBee replacement engine and fuel-injection parts for Cummins®, Caterpillar® and Detroit Diesel engines.
          </p>
          <p className="text-[12px] leading-relaxed text-steel-500 lg:col-span-4 lg:col-start-9">{referenceDisclaimer}</p>
        </div>
      </section>

      <QuoteBand subject="parts for your engine make" />
    </>
  );
}
