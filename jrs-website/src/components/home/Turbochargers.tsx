"use client";

import Image from "next/image";
import { useScroll } from "motion/react";
import { useRef } from "react";
import { TurboViewer } from "@/components/three/TurboViewer";
import { FadeUp, RevealItem, RevealLines } from "@/components/ui/RevealLines";
import { ArrowLink, CropMarks, Eyebrow } from "@/components/ui/primitives";
import { referenceDisclaimer, turbochargerLogos } from "@/lib/content";

const supply = [
  ["Genuine components", "Genuine spares for marine turbochargers, sourced from trusted manufacturers."],
  ["OEM components", "OEM components for efficient engine performance and reduced downtime at sea."],
  ["Turbocharger parts", "Casings, rotors, nozzle rings, labyrinth seals and bearing assemblies."],
  ["Cartridges", "Turbocharger cartridges, available as genuine and OEM components."],
  ["Overhaul services", "Rotor balancing and re-blading, thermal balancing, partition wall sealing strips."],
] as const;

export function Turbochargers() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} aria-labelledby="turbo-title" className="section-y relative overflow-hidden bg-abyss">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_40%,rgb(33_71_160/0.22),transparent_70%)]" />
      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <Eyebrow sheet="07 / 15">Turbochargers &amp; cartridges</Eyebrow>
            <h2 id="turbo-title" className="mt-8">
              <RevealLines
                className="display block text-[clamp(3.5rem,9vw,9.5rem)] text-white"
                lines={["Power,", <span key="u" className="accent text-accent">under pressure.</span>]}
              />
            </h2>
            <FadeUp className="mt-10 max-w-md">
              <p className="text-[17px] leading-relaxed text-fog/80">
                Marine engine turbochargers in Abu Dhabi: genuine and OEM spare parts for a wide range of marine turbochargers, plus a service centre equipped to overhaul all major turbocharger models with precision.
              </p>
            </FadeUp>
            <div className="mt-10 flex flex-col items-start gap-4">
              <ArrowLink href="/turbochargers-cartridges-in-abu-dhabi/" className="text-white">Turbochargers &amp; cartridges</ArrowLink>
              <ArrowLink href="/turbocharger-overhauls-in-abu-dhabi/" className="text-white">Turbocharger overhauls in Abu Dhabi</ArrowLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-square w-full">
              <CropMarks className="text-accent/60" />
              <div aria-hidden className="absolute inset-0 border border-white/[0.06]" />
              <TurboViewer progress={scrollYProgress} />
              <p className="label absolute bottom-4 left-4 text-steel-500">Fig. 07 — Compressor wheel · schematic</p>
              <p className="label absolute right-4 top-4 text-right text-steel-500">Rotor balancing
                <br />Thermal balancing
              </p>
            </div>
          </div>
        </div>

        {/* Makes supported: logo grid on a heritage-blue gradient panel (ABB – IHI spans two columns on small screens). */}
        <div className="relative mt-[clamp(64px,8vw,128px)] overflow-hidden bg-[linear-gradient(135deg,var(--color-heritage)_0%,var(--color-heritage-deep)_78%)] p-4 ring-1 ring-white/10 sm:p-8 lg:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_90%_at_92%_0%,rgb(255_255_255/0.14),transparent_70%)]" />
          <div className="relative flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <h3 className="label flex items-center gap-3 text-white/80">
              <span aria-hidden className="h-[2px] w-8 bg-accent" />
              Turbocharger makes supported
            </h3>
            <p className="max-w-lg text-[15px] leading-relaxed text-white/80">Spare parts compatible with all major marine turbocharger brands.</p>
          </div>
          <ul className="relative mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
            {turbochargerLogos.map((m, i) => (
              <RevealItem key={m.name} index={i} className={i === 0 ? "col-span-2 lg:col-span-1" : undefined}>
                <div className="group relative flex h-32 items-center justify-center bg-white px-2 pb-6 sm:px-4 shadow-[0_18px_36px_-24px_rgb(0_0_0/0.65)] transition-[translate,box-shadow] duration-500 ease-(--ease-expo) hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgb(0_0_0/0.75)] sm:h-36 lg:h-40">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-(--ease-expo) group-hover:scale-x-100" />
                  <span className="label absolute left-3 top-3 tabular-nums text-steel-500">{String(i + 1).padStart(2, "0")}</span>
                  <Image
                    data-img-role="logo"
                    src={m.src}
                    alt={m.alt}
                    width={480}
                    height={240}
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 26vw, 60vw"
                    className="h-auto w-[94%] max-w-[230px] transition-transform duration-700 ease-(--ease-expo) group-hover:scale-[1.07]"
                  />
                  <span className="label absolute inset-x-3 bottom-3 text-center text-graphite/55 transition-colors duration-500 group-hover:text-heritage">{m.name}</span>
                </div>
              </RevealItem>
            ))}
          </ul>
          <p className="relative mt-5 max-w-3xl text-[12px] leading-relaxed text-white/55">{referenceDisclaimer}</p>
        </div>

        <dl className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {supply.map(([k, v]) => (
            <div key={k}>
              <dt className="flex items-center gap-2 text-[15px] font-medium text-white">
                <span aria-hidden className="size-1.5 bg-accent" />
                {k}
              </dt>
              <dd className="mt-3 text-[14px] leading-relaxed text-steel-300">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
