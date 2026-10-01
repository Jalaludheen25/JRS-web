import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { Eyebrow, Marquee } from "@/components/ui/primitives";
import { brandPages, partsMakes, reconditioningMakes, referenceDisclaimer } from "@/lib/content";

export function Brands() {
  const reconOnly = reconditioningMakes.filter((m) => !partsMakes.includes(m));
  return (
    <section aria-labelledby="brands-title" className="section-y relative overflow-hidden bg-plate text-graphite">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow sheet="11 / 14" className="text-steel-500">Engine makes</Eyebrow>
          <h2 id="brands-title" className="mt-8">
            <RevealLines className="display block text-[clamp(2.75rem,7vw,7.5rem)] text-abyss" lines={["Parts for the", <span key="e" className="accent text-marine">engines you run.</span>]} />
          </h2>
        </div>
        <FadeUp className="self-end lg:col-span-4 lg:col-start-9">
          <p className="text-[17px] leading-relaxed text-graphite/75">
            Replacement spare parts and reconditioning support for the main marine, industrial and power-generation engine makes.
          </p>
        </FadeUp>
      </div>

      <div className="mt-[clamp(48px,6vw,96px)] space-y-2 border-y border-graphite/14 py-8">
        <p className="shell label text-steel-500">Replacement spare parts</p>
        <Marquee items={partsMakes} duration={55} className="heading py-2 text-[clamp(2.5rem,6vw,6rem)] text-abyss" />
        <p className="shell label pt-6 text-steel-500">Reconditioning support</p>
        <Marquee items={[...reconOnly, ...reconOnly]} reverse duration={45} className="heading outline-type py-2 text-[clamp(2.5rem,6vw,6rem)] text-graphite/60" />
      </div>

      <div className="shell mt-16 grid gap-10 lg:grid-cols-12">
        <ul className="grid gap-px bg-graphite/14 sm:grid-cols-3 lg:col-span-8">
          {brandPages.map((b) => (
            <li key={b.href} className="bg-plate">
              <Link href={b.href} className="group flex h-full flex-col justify-between gap-10 p-6 transition-colors duration-500 hover:bg-white">
                <span className="flex items-start justify-between">
                  <span className="heading text-3xl text-abyss">{b.name}</span>
                  <ArrowUpRight className="size-5 text-graphite/50 transition-transform duration-500 group-hover:rotate-45 group-hover:text-marine" strokeWidth={1.5} aria-hidden />
                </span>
                <span>
                  <span className="block text-[14px] text-graphite/70">{b.name} engine spare parts</span>
                  <span className="label mt-2 block text-steel-500">{b.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-[12px] leading-relaxed text-graphite/55 lg:col-span-3 lg:col-start-10 lg:self-end">{referenceDisclaimer}</p>
      </div>
    </section>
  );
}
