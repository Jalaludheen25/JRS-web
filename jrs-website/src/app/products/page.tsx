import { PageHero } from "@/components/page/PageHero";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { QuoteBand } from "@/components/page/QuoteBand";
import { Marquee } from "@/components/ui/primitives";
import { partsMakes, products, referenceDisclaimer } from "@/lib/content";
import { resolveLink, type LinkCard } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Replacement Engine Spare Parts | Products - JRS",
  description:
    "Replacement and OEM engine spare parts from JRS in Abu Dhabi: engine bearings, cylinder heads, fuel injection, pistons, liners, filters, turbochargers, coolers, AVRs and genset controllers.",
  path: "/products/",
});

export default function ProductsPage() {
  const items = products.map((p) => resolveLink(p.href.replace(/^\/|\/$/g, ""))).filter(Boolean) as LinkCard[];
  return (
    <>
      <PageHero
        variant="plate"
        eyebrow="Products — Abu Dhabi, UAE"
        title="Replacement Engine Spare Parts"
        lead="We offer a comprehensive range of premium engine spare parts for all major marine engines. Sourced from trusted OEMs and leading manufacturers, our parts are engineered for performance, reliability and long-lasting durability in demanding marine environments."
        crumbs={[{ name: "Products", path: "/products/" }]}
      />

      <section className="bg-plate pb-[var(--section-y)] text-graphite">
        <div className="shell grid gap-10 border-t border-graphite/14 pt-14 lg:grid-cols-12">
          <h2 className="heading text-[clamp(1.75rem,3vw,2.75rem)] text-abyss lg:col-span-4">Built for durability and performance</h2>
          <div className="space-y-6 text-[17px] leading-[1.7] text-graphite/80 lg:col-span-7 lg:col-start-6">
            <p>
              At JRS Mechanical Equipment, we supply a wide range of high-quality engine components built for durability and performance. Our product line includes pistons, piston rings, bearings, liners, fuel injection systems, cylinder heads, valve components, filter elements and separators.
            </p>
            <p>
              Every part is sourced from trusted manufacturers to ensure reliability across industrial and marine applications. With a strong focus on quality and compatibility, we help our clients achieve efficient and uninterrupted operations.
            </p>
          </div>
        </div>
      </section>

      <RelatedLinks eyebrow="Product range" title="Ten product families" items={items} tone="dark" />

      <section aria-labelledby="makes-title" className="section-y overflow-hidden bg-plate text-graphite">
        <div className="shell">
          <p className="label text-steel-500">Replacement engine parts</p>
          <h2 id="makes-title" className="heading mt-5 text-[clamp(2rem,4vw,3.5rem)] text-abyss">
            Spare parts for leading engine makes
          </h2>
        </div>
        <Marquee items={partsMakes} duration={55} className="heading mt-12 border-y border-graphite/14 py-6 text-[clamp(2.5rem,6vw,6rem)] text-abyss" />
        <div className="shell mt-10 grid gap-8 lg:grid-cols-12">
          <p className="text-[15px] leading-relaxed text-graphite/75 lg:col-span-6">
            JRS is an authorized distributor for Interstate-McBee replacement engine and fuel-injection parts for Cummins®, Caterpillar® and Detroit Diesel engines, serving the marine, diesel and natural-gas industries.
          </p>
          <p className="text-[12px] leading-relaxed text-graphite/55 lg:col-span-4 lg:col-start-9">{referenceDisclaimer}</p>
        </div>
      </section>

      <QuoteBand subject="a specific part" />
    </>
  );
}
