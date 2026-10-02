import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/PageHero";
import { ContentBlocks } from "@/components/page/ContentBlocks";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { QuoteBand } from "@/components/page/QuoteBand";
import { JsonLd } from "@/components/ui/primitives";
import { authored } from "@/content/authored";
import { services } from "@/lib/content";
import { resolveLink, type LinkCard } from "@/lib/links";
import { absolute, orgId, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

// Services new to the rebuild. Existing services keep their legacy root URLs.
const meta: Record<string, { title: string; description: string; related: string[] }> = {
  "fuel-pump-overhaul": {
    title: "Fuel Pump Overhaul Service in Abu Dhabi | JRS",
    description: "Fuel pump overhaul in Abu Dhabi for marine and industrial pumps: inspection, dismantling, ultrasonic cleaning, part replacement, precision calibration and final testing.",
    related: ["services/marine-fuel-pump-injector-service", "fuel-injection-systems-components-in-abu-dhabi", "ultrasonic-cleaning-for-parts-in-abu-dhabi"],
  },
  "marine-fuel-pump-injector-service": {
    title: "Marine Fuel Pump & Injector Service in Abu Dhabi | JRS",
    description: "Marine fuel pump and injector service in Abu Dhabi for main, auxiliary, fire-fighting and bow-thruster engines: cleaning, calibration and repair to OEM standards.",
    related: ["services/fuel-pump-overhaul", "fuel-injector-spare-parts-and-repair-in-abu-dhabi", "lorange-injectors-and-pumps-repair"],
  },
  "electrical-instrumentation": {
    title: "Electrical & Instrumentation Services for Marine and Industrial | JRS",
    description: "Electrical and instrumentation services from JRS: installation, maintenance, calibration, troubleshooting and repair of electrical systems, control panels, sensors and transmitters.",
    related: ["automatic-voltage-regulator-supplier-in-uae", "genset-controllers-amf-in-abu-dhabi", "services/starter-motor-alternator-service"],
  },
  governors: {
    title: "Governor & Actuator Service in Abu Dhabi | JRS",
    description: "Supply and service of governors and actuators from Woodward, Regulateurs Europa, Zexel, Yanmar and Heinzmann, with test-bench assessment and testing to manufacturer specifications.",
    related: ["power-generation", "services/fuel-pump-overhaul", "genset-controllers-amf-in-abu-dhabi"],
  },
  "reconditioning-engine-parts": {
    title: "Reconditioning of Engine Parts in Abu Dhabi | JRS",
    description: "Reconditioning of exhaust valve spindles and seats, piston crowns, cylinder heads and turbocharger casings, plus electrical motor repair, for major marine engine makes.",
    related: ["cylinder-heads-components-in-abu-dhabi", "turbocharger-overhauls-in-abu-dhabi", "engine-overhaul-service-in-abu-dhabi"],
  },
  "starter-motor-alternator-service": {
    title: "Starter Motor & Alternator Service in Abu Dhabi | JRS",
    description: "Diesel engine starter motor repair and Bosch / Delphi alternator service in Abu Dhabi: inspection, cleaning, testing and overhaul for reliable starting and charging.",
    related: ["services/electrical-instrumentation", "routine-maintenance-diagnostics-in-abu-dhabi", "engine-overhaul-service-in-abu-dhabi"],
  },
};

export function generateStaticParams() {
  return Object.keys(meta).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const m = meta[slug];
  const s = services.find((x) => x.href === `/services/${slug}/`);
  return m ? pageMetadata({ title: m.title, description: m.description, path: `/services/${slug}/`, image: s?.image.src }) : {};
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const m = meta[slug];
  const content = authored[`services/${slug}`];
  const service = services.find((x) => x.href === `/services/${slug}/`);
  if (!m || !content || !service) notFound();

  return (
    <>
      <PageHero
        variant="scene"
        eyebrow="Technical service — Abu Dhabi"
        title={content.h1}
        lead={content.lead}
        crumbs={[{ name: "Services", path: "/services/" }, { name: service.title, path: `/services/${slug}/` }]}
        image={{ ...service.image, fit: "cover" }}
      />
      <section className="section-y bg-abyss">
        <div className="shell">
          <ContentBlocks blocks={content.blocks} tone="dark" />
        </div>
      </section>
      <RelatedLinks eyebrow="Related" title="Explore related solutions" items={m.related.map(resolveLink).filter(Boolean) as LinkCard[]} tone="light" />
      <QuoteBand subject={service.title.toLowerCase()} defaultTopic={service.title} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: content.h1,
          description: m.description,
          url: absolute(`/services/${slug}/`),
          provider: { "@id": orgId },
          areaServed: "AE",
        }}
      />
    </>
  );
}
