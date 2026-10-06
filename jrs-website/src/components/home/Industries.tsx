import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HorizontalTrack } from "@/components/ui/HorizontalTrack";
import { Eyebrow } from "@/components/ui/primitives";
import { industries } from "@/lib/content";

export function Industries() {
  return (
    <HorizontalTrack
      labelledBy="industries-title"
      className="bg-ink"
      overlay={
        <div className="shell pointer-events-none absolute inset-x-0 top-0 z-20 pt-24 lg:pt-28">
          <Eyebrow sheet="10 / 16" className="text-white/70">Industries</Eyebrow>
        </div>
      }
    >
      <div className="flex w-[88vw] shrink-0 snap-start items-end px-[var(--gutter)] pb-20 pt-40 sm:w-[70vw] lg:h-full lg:w-[52vw] lg:pb-28">
        <h2 id="industries-title" className="display text-[clamp(3rem,8vw,8.5rem)] text-white">
          Built for
          <br />
          demanding
          <br />
          <span className="accent text-accent">operations.</span>
        </h2>
      </div>

      {industries.map((ind, i) => (
        <article key={ind.title} className="group relative h-[78svh] w-[88vw] shrink-0 snap-start overflow-hidden sm:w-[70vw] lg:h-full lg:w-[82vw]">
          <div className="scene grain absolute inset-0">
            <Image data-img-role="thumb"
              src={ind.image.src}
              alt={ind.image.alt}
              fill
              sizes="(min-width:1024px) 82vw, 88vw"
              className="object-cover transition-transform duration-[2s] ease-(--ease-expo) group-hover:scale-[1.04]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/30" />
          <div className="relative z-10 flex h-full flex-col justify-between border-l border-white/15 p-[clamp(20px,3vw,56px)] pt-36">
            <span className="label self-end text-accent">
              {String(i + 1).padStart(2, "0")} / {String(industries.length).padStart(2, "0")}
            </span>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <h3 className="display text-[clamp(2.75rem,6.6vw,7.5rem)] text-white lg:col-span-8">{ind.title}</h3>
              <div className="lg:col-span-4">
                <p className="max-w-sm text-[16px] leading-relaxed text-fog/85">{ind.body}</p>
                <Link href={ind.href} className="label mt-6 inline-flex items-center gap-2 text-white after:absolute after:inset-0">
                  <span className="link-underline pb-1">Explore {ind.title}</span>
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </HorizontalTrack>
  );
}
