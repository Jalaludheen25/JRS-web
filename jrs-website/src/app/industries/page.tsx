import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { QuoteBand } from "@/components/page/QuoteBand";
import { industries } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { images } from "@/lib/images";

export const metadata = pageMetadata({
  title: "Industries We Serve – Marine, Power Generation, Industrial & Offshore | JRS",
  description:
    "JRS supplies engine spare parts and repair solutions for marine, power generation, industrial and offshore operations from Abu Dhabi across the UAE and GCC.",
  path: "/industries/",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        variant="scene"
        eyebrow="Industries"
        title="Built for demanding operations."
        lead="Marine is our core sector. We also support power generation, industrial and offshore operations with engine spare parts and dependable repair solutions."
        crumbs={[{ name: "Industries", path: "/industries/" }]}
        image={images.industriesHub}
      />
      <section aria-labelledby="industries-intro" className="section-y bg-plate text-graphite">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <h2 id="industries-intro" className="heading text-[clamp(1.75rem,3vw,2.75rem)] text-abyss lg:col-span-4">
            One supply partner across four sectors
          </h2>
          <div className="space-y-6 text-[17px] leading-[1.7] text-graphite/80 lg:col-span-7 lg:col-start-6">
            <p>
              At JRS Mechanical Equipment, the marine industry remains our core focus and primary service sector. We support marine operations with spare parts, technical solutions and dependable maintenance, specialising in marine engine overhauls and marine turbocharger overhauls.
            </p>
            <p>
              For power generation, our expertise covers engine overhauls, turbocharger overhauls, fuel injection systems and cylinder head overhaul for power plant engines, alongside automatic voltage regulators and genset controllers.
            </p>
            <p>
              Headquartered in Abu Dhabi, we source and supply OEM engine spare parts for the marine, offshore and industrial power sectors, whether for scheduled maintenance, emergency breakdowns or long-term supply contracts.
            </p>
          </div>
        </div>
      </section>
      <section aria-label="Industries" className="bg-ink">
        {industries.map((ind, i) => (
          <article key={ind.title} className="group relative min-h-[80svh] overflow-hidden border-t border-white/10">
            <div className="scene grain absolute inset-0">
              <Image data-img-role="thumb" src={ind.image.src} alt={ind.image.alt} fill sizes="100vw" className="object-cover transition-transform duration-[2s] ease-(--ease-expo) group-hover:scale-[1.03]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
            <div className="shell relative z-10 flex min-h-[80svh] flex-col justify-end pb-16 pt-32">
              <span className="label text-accent">
                {String(i + 1).padStart(2, "0")} / {String(industries.length).padStart(2, "0")}
              </span>
              <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
                <h2 className="display text-[clamp(3rem,8vw,8.5rem)] text-white lg:col-span-7">{ind.title}</h2>
                <div className="lg:col-span-4 lg:col-start-9">
                  <p className="text-[17px] leading-relaxed text-fog/85">{ind.body}</p>
                  <Link href={ind.href} className="label mt-6 inline-flex items-center gap-2 text-white after:absolute after:inset-0">
                    <span className="link-underline pb-1">Explore {ind.title}</span>
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
      <QuoteBand subject="support for your operation" />
    </>
  );
}
