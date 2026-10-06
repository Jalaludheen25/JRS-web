import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeUp, RevealItem, RevealLines } from "@/components/ui/RevealLines";
import { Eyebrow } from "@/components/ui/primitives";
import { replacementParts } from "@/lib/content";
import { quoteHref } from "@/lib/site";

/** The previous site's "Replacement engine spare parts" strip as a catalogue grid, each tile linked to its range. */
export function ReplacementParts({ sheet = "12 / 16" }: { sheet?: string } = {}) {
  return (
    <section aria-labelledby="parts-title" className="section-y surface-mist relative overflow-hidden">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow sheet={sheet || undefined} className="text-marine">Products we serve</Eyebrow>
            <h2 id="parts-title" className="mt-8">
              <RevealLines className="display block text-[clamp(2.4rem,6.6vw,7rem)] text-abyss" lines={["Replacement", <span key="p" className="accent text-heritage">engine spare parts.</span>]} />
            </h2>
          </div>
          <FadeUp className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[17px] leading-relaxed text-graphite/75">
              A comprehensive range of engine spare parts for all major marine engines, sourced from trusted OEMs and leading manufacturers for reliable performance and long service life in demanding marine environments.
            </p>
          </FadeUp>
        </div>

        <ul className="mt-[clamp(48px,6vw,88px)] grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {replacementParts.map((p, i) => (
            <RevealItem key={p.name} index={i}>
              <Link
                href={p.href ?? quoteHref}
                className="group relative flex h-full flex-col bg-white p-3 shadow-[0_1px_0_rgb(30_68_149/0.08),0_22px_44px_-30px_rgb(2_19_67/0.45)] ring-1 ring-heritage/10 transition-[box-shadow,translate] duration-500 ease-(--ease-expo) hover:-translate-y-1 hover:shadow-[0_1px_0_rgb(30_68_149/0.12),0_30px_60px_-30px_rgb(2_19_67/0.55)] hover:ring-heritage/30 sm:p-4"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-heritage transition-transform duration-500 ease-(--ease-expo) group-hover:scale-x-100" />
                <span className="relative block aspect-[4/3] overflow-hidden bg-[radial-gradient(70%_65%_at_50%_55%,rgb(30_68_149/0.10),transparent_72%)]">
                  <Image
                    data-img-role="catalogue"
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
                    className="object-contain p-2 transition-transform duration-700 ease-(--ease-expo) group-hover:scale-[1.07] sm:p-4"
                  />
                  <span className="label absolute left-1 top-1 tabular-nums text-steel-500">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="mt-3 flex items-end justify-between gap-3 border-t border-heritage/10 pt-3 sm:mt-4 sm:pt-4">
                  <span>
                    <span className="heading block text-[clamp(1rem,1.5vw,1.3rem)] leading-tight text-abyss">{p.name}</span>
                    <span className="label mt-1.5 block text-marine">{p.href ? "View range" : "Ask for availability"}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-heritage/60 transition-transform duration-500 ease-(--ease-expo) group-hover:rotate-45 group-hover:text-heritage" strokeWidth={1.75} aria-hidden />
                </span>
              </Link>
            </RevealItem>
          ))}
          <RevealItem index={replacementParts.length}>
            <Link
              href={quoteHref}
              className="group relative flex h-full min-h-[220px] flex-col justify-between bg-[linear-gradient(140deg,var(--color-heritage)_0%,var(--color-heritage-deep)_100%)] p-5 text-white shadow-[0_22px_44px_-30px_rgb(2_19_67/0.6)] sm:p-6"
            >
              <span className="label text-white/70">Not listed?</span>
              <span>
                <span className="heading block text-[clamp(1.15rem,1.8vw,1.6rem)] leading-tight">Send us the part number.</span>
                <span className="mt-3 block text-[14px] leading-relaxed text-white/75">Add the engine make and model and we&rsquo;ll confirm availability and specifications.</span>
                <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-accent">
                  Request a quote
                  <ArrowUpRight className="size-4 transition-transform duration-500 ease-(--ease-expo) group-hover:rotate-45" strokeWidth={1.75} aria-hidden />
                </span>
              </span>
            </Link>
          </RevealItem>
        </ul>
      </div>
    </section>
  );
}
