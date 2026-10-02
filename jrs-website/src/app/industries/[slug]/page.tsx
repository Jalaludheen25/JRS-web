import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/PageHero";
import { ContentBlocks } from "@/components/page/ContentBlocks";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { QuoteBand } from "@/components/page/QuoteBand";
import { JsonLd } from "@/components/ui/primitives";
import { authored } from "@/content/authored";
import { industries } from "@/lib/content";
import { resolveLink, type LinkCard } from "@/lib/links";
import { absolute, orgId, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

const meta: Record<string, { title: string; description: string; products: string[]; services: string[] }> = {
  industrial: {
    title: "Industrial Engine Spare Parts & Repair Solutions | JRS Abu Dhabi",
    description: "Engine spare parts and repair solutions for industrial generators, heavy equipment and oil and gas operations, supplied by JRS from Abu Dhabi across the GCC.",
    products: ["fuel-injection-systems-components-in-abu-dhabi", "pistons-piston-rings-in-abu-dhabi", "liners-anti-polishing-rings-in-abu-dhabi", "filters"],
    services: ["engine-overhaul-service-in-abu-dhabi", "services/fuel-pump-overhaul", "services/governors", "services/electrical-instrumentation"],
  },
  offshore: {
    title: "Offshore Engine Spare Parts Supply | JRS Abu Dhabi",
    description: "OEM engine spare parts for offshore support vessels, offshore platforms and marine fleets, supplied from Abu Dhabi for planned maintenance and emergency sourcing.",
    products: ["turbochargers-cartridges-in-abu-dhabi", "engine-bearings-in-abu-dhabi", "coolers-heat-exchangers-in-abu-dhabi", "filters"],
    services: ["engine-overhaul-service-in-abu-dhabi", "turbocharger-overhauls-in-abu-dhabi", "services/marine-fuel-pump-injector-service", "services/reconditioning-engine-parts"],
  },
};

export function generateStaticParams() {
  return Object.keys(meta).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const m = meta[slug];
  return m ? pageMetadata({ title: m.title, description: m.description, path: `/industries/${slug}/` }) : {};
}

const cards = (keys: string[]) => keys.map(resolveLink).filter(Boolean) as LinkCard[];

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const m = meta[slug];
  const content = authored[`industries/${slug}`];
  const ind = industries.find((x) => x.href === `/industries/${slug}/`);
  if (!m || !content || !ind) notFound();

  return (
    <>
      <PageHero
        variant="scene"
        eyebrow="Industry solutions"
        title={content.h1}
        lead={content.lead}
        crumbs={[{ name: "Industries", path: "/industries/" }, { name: ind.title, path: `/industries/${slug}/` }]}
        image={ind.image}
      />
      <section className="section-y bg-abyss">
        <div className="shell">
          <ContentBlocks blocks={content.blocks} tone="dark" />
        </div>
      </section>
      <RelatedLinks eyebrow="Products" title="Products for this industry" items={cards(m.products)} tone="light" />
      <RelatedLinks eyebrow="Services" title="Services for this industry" items={cards(m.services)} tone="dark" />
      <QuoteBand subject={`${ind.title.toLowerCase()} engine spare parts`} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: content.h1, description: m.description, url: absolute(`/industries/${slug}/`), publisher: { "@id": orgId } }} />
    </>
  );
}
