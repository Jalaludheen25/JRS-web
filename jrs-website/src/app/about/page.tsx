import { PageHero } from "@/components/page/PageHero";
import { ContentBlocks } from "@/components/page/ContentBlocks";
import { QuoteBand } from "@/components/page/QuoteBand";
import { Certifications } from "@/components/home/Certifications";
import { MissionVision } from "@/components/home/MissionVision";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { CropMarks, TechnicalSpec } from "@/components/ui/primitives";
import type { Block } from "@/lib/blocks";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Marine and Power Generation Spare Parts Supplier in Abu Dhabi",
  description: "Discover JRS, a trusted supplier of marine and power generation spare parts in Abu Dhabi. We provide high-quality, marine spare parts",
  path: "/about/",
});

// Copy from the live /about/ page.
const blocks: Block[] = [
  { type: "h2", text: "Your Trusted Source for Marine and Industrial Solutions" },
  { type: "p", text: "Our team brings deep industry knowledge and a commitment to customer satisfaction, making JRS a trusted name for marine spare parts and technical support across the region. Whether it’s for scheduled maintenance, emergency breakdowns, or long-term supply contracts, we deliver tailored solutions that meet the critical demands of your operations." },
  { type: "p", text: "With a reputation built on precision, performance, and prompt service, JRS ensures that every component supplied adheres to the highest international standards. When operational uptime matters most, count on JRS to keep your engines running and your vessels moving — your reliable partner in marine and power generation." },
  { type: "h2", text: "Top Quality Service & Expertise" },
  { type: "p", text: "We deliver precision-engineered marine and power generation spare parts, industrial spare parts, and dependable repair solutions tailored to your operational needs. With an unwavering focus on quality, speed, and reliability, JRS ensures your equipment stays efficient, your vessels stay moving, and your power systems remain uninterrupted—every time." },
  { type: "h3", text: "Engine Spare Parts" },
  { type: "p", text: "From engine blocks to auxiliary systems, we supply a full range of marine and power generation spare parts for top engine performance. Whether for ships, industrial generators, or offshore platforms, we offer OEM parts from trusted global brands. Our stock includes turbochargers, pistons, fuel pumps, filters, gaskets, and more—ensuring compatibility, durability, and efficiency." },
  { type: "h3", text: "Repair & Overhaul Solutions" },
  { type: "p", text: "Our expert team specializes in repair and overhaul solutions for your essential machinery, ensuring extended lifespan and peak performance. Whether it’s troubleshooting, restoring, or reconditioning, we focus on every detail to minimize downtime and deliver results that you can rely on." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        variant="scene"
        eyebrow="About JRS"
        title="Delivering Trust with Every Marine and Power Generation Spare Part"
        lead="At JRS Mechanical Equipment, we are dedicated to providing high-quality marine and power generation spare parts along with reliable repair solutions that ensure uninterrupted operations."
        crumbs={[{ name: "About Us", path: "/about/" }]}
        image={{ src: "/images/scenes/port-vessel-aerial-graded.jpg", alt: "Container vessel leaving port with a tug alongside", fit: "cover" }}
      />

      <section className="section-y bg-abyss">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-6">
          <div className="relative lg:col-span-5">
            <ImageReveal src="/images/scenes/vessel-aerial-2-graded.jpg" alt="Container vessel berthed under ship-to-shore cranes" sizes="(min-width:1024px) 40vw, 100vw" className="aspect-[4/5] w-full" />
            <CropMarks />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[clamp(1.2rem,1.8vw,1.55rem)] leading-[1.45] text-fog">
              Headquartered in Abu Dhabi, UAE, we specialise in sourcing and supplying a comprehensive range of OEM engine spare parts for the marine, offshore, and industrial power sectors.
            </p>
            <TechnicalSpec
              className="mt-12"
              rows={[
                ["Company", site.legalName],
                ["Head office", `${site.address.building}, ${site.address.floor}, ${site.address.office}, ${site.address.street}, Abu Dhabi`],
                ["Sectors", "Marine · Power generation · Industrial · Offshore"],
                ["Supply", "Genuine and OEM engine spare parts"],
                ["Services", "Engine, turbocharger and fuel-system overhauls; reconditioning; electrical & instrumentation"],
                ["Certified", "ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018 · ICV"],
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section-y bg-plate text-graphite">
        <div className="shell">
          <ContentBlocks blocks={blocks} tone="light" />
        </div>
      </section>

      <div className="bg-abyss pt-[var(--section-y)]">
        <MissionVision sheet="" />
      </div>
      <Certifications sheet="" />
      <QuoteBand subject="a reliable supply partner" />
    </>
  );
}
