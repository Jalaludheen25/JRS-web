import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HorizontalTrack } from "@/components/ui/HorizontalTrack";
import { Eyebrow } from "@/components/ui/primitives";
import { capabilities } from "@/lib/content";

export function Capabilities() {
  return (
    <HorizontalTrack id="capabilities" labelledBy="capabilities-title" className="bg-abyss">
      {/* Intro panel */}
      <div className="flex w-[88vw] shrink-0 snap-start flex-col justify-between px-[var(--gutter)] py-24 sm:w-[64vw] lg:h-full lg:w-[42vw] lg:py-32">
        <Eyebrow sheet="04 / 15">Core capabilities</Eyebrow>
        <div>
          <h2 id="capabilities-title" className="display text-[clamp(3rem,7vw,7.5rem)] text-white">
            Six ways
            <br />
            we keep
            <br />
            <span className="accent text-accent">engines running.</span>
          </h2>
          <p className="mt-8 max-w-sm text-[17px] leading-relaxed text-fog/75">
            From a single bearing shell to a complete overhaul: parts, repairs and technical services under one roof in Abu Dhabi.
          </p>
        </div>
        <p className="label hidden text-steel-500 lg:block">Scroll to explore →</p>
      </div>

      {capabilities.map((c) => (
        <article
          key={c.index}
          className="group relative flex w-[88vw] shrink-0 snap-start flex-col border-l border-white/10 px-[clamp(20px,2.4vw,40px)] py-16 sm:w-[64vw] lg:h-full lg:w-[min(46vw,780px)] lg:py-24"
        >
          <div className="flex items-start justify-between">
            <span className="display outline-type text-[clamp(5rem,10vw,10rem)] text-white/40 transition-colors duration-700 group-hover:text-accent">{c.index}</span>
            <span className="label mt-3 text-steel-500">{c.index} / 06</span>
          </div>

          <div
            className={`relative mt-6 aspect-[16/10] w-full overflow-hidden lg:mt-auto lg:aspect-auto lg:h-[44vh] ${c.image.fit === "contain" ? "bg-plate" : "bg-navy-900"}`}
          >
            <Image
              src={c.image.src}
              alt={c.image.alt}
              fill
              sizes="(min-width:1024px) 46vw, 88vw"
              className={`transition-transform duration-[1.4s] ease-(--ease-expo) group-hover:scale-[1.06] ${c.image.fit === "contain" ? "object-contain p-8 mix-blend-multiply" : "object-cover"}`}
            />
            {c.image.fit !== "contain" && <div className="absolute inset-0 bg-gradient-to-t from-abyss/70 to-transparent" />}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <h3 className="heading text-[clamp(1.875rem,3.2vw,3.25rem)] uppercase text-white">{c.title}</h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-fog/70">{c.body}</p>
            </div>
            <Link
              href={c.href}
              aria-label={`Explore ${c.title}`}
              className="grid size-14 place-items-center rounded-full border border-white/20 transition-all duration-500 ease-(--ease-expo) after:absolute after:inset-0 hover:border-accent hover:bg-accent hover:text-abyss group-hover:rotate-45"
            >
              <ArrowUpRight className="size-5" strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </article>
      ))}
      <div aria-hidden className="w-[var(--gutter)] shrink-0" />
    </HorizontalTrack>
  );
}
