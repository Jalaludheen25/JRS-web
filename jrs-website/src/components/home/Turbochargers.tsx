"use client";

import { useScroll } from "motion/react";
import { useRef } from "react";
import { TurboViewer } from "@/components/three/TurboViewer";
import { FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { ArrowLink, CropMarks, Eyebrow } from "@/components/ui/primitives";
import { turbochargerMakes } from "@/lib/content";

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
            <Eyebrow sheet="07 / 14">Turbochargers &amp; cartridges</Eyebrow>
            <h2 id="turbo-title" className="mt-8">
              <RevealLines
                className="display block text-[clamp(3.5rem,9vw,9.5rem)] text-white"
                lines={["Power,", <span key="u" className="accent text-steel-300">under pressure.</span>]}
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
              <CropMarks className="text-white/30" />
              <div aria-hidden className="absolute inset-0 border border-white/[0.06]" />
              <TurboViewer progress={scrollYProgress} />
              <p className="label absolute bottom-4 left-4 text-steel-500">Fig. 07 — Compressor wheel · schematic</p>
              <p className="label absolute right-4 top-4 text-right text-steel-500">Rotor balancing
                <br />Thermal balancing
              </p>
            </div>
          </div>
        </div>

        {/* Makes supported */}
        <div className="mt-[clamp(64px,8vw,128px)]">
          <p className="label text-steel-500">Turbocharger makes supported</p>
          <ul className="mt-6 grid grid-cols-2 border-t border-white/12 sm:grid-cols-3 lg:grid-cols-5">
            {turbochargerMakes.map((m, i) => (
              <li key={m} className="border-b border-white/12 py-6 pr-4 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                <span className="label text-steel-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="heading mt-3 block text-[clamp(1.5rem,2.4vw,2.25rem)] text-white">{m}</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {supply.map(([k, v]) => (
            <div key={k}>
              <dt className="flex items-center gap-2 text-[15px] font-medium text-white">
                <span aria-hidden className="size-1.5 bg-signal" />
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
