"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { ArrowLink, Eyebrow } from "@/components/ui/primitives";
import { MagneticButton } from "@/components/ui/MagneticButton";

const types = [
  { n: "A", name: "Main bearings" },
  { n: "B", name: "Thrust bearings" },
  { n: "C", name: "Connecting rod bearings" },
];

export function BearingsFeature() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2.5, 2.5]);
  const dim = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);

  return (
    <section ref={ref} aria-labelledby="bearings-title" className="relative overflow-hidden bg-plate pb-[var(--section-y)] text-graphite">
      <div className="shell grid items-center gap-12 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <motion.div className="relative aspect-[3/2] w-[112%] -translate-x-[6%]" style={reduce ? undefined : { x, rotate }}>
            <Image
              src="/images/products/engine-bearings.jpg"
              alt="Marine engine bearings: main, thrust and connecting-rod bearing shells"
              fill
              sizes="(min-width:1024px) 62vw, 100vw"
              className="object-contain mix-blend-multiply"
            />
          </motion.div>

          {/* Dimension annotation: drawn on scroll, decorative */}
          <svg aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-6 h-10 w-full text-graphite/50" viewBox="0 0 100 10" preserveAspectRatio="none">
            <motion.path d="M2 5 H98" stroke="currentColor" strokeWidth="0.15" vectorEffect="non-scaling-stroke" style={reduce ? undefined : { pathLength: dim }} />
            <path d="M2 1 V9 M98 1 V9" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <p className="label absolute -bottom-14 left-1/2 -translate-x-1/2 text-steel-500">Manufactured to OEM specifications</p>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Eyebrow sheet="06 / 14" className="text-steel-500">Featured product</Eyebrow>
          <h2 id="bearings-title" className="mt-8">
            <RevealLines className="display block text-[clamp(3rem,6.4vw,6.5rem)] text-abyss" lines={["Engine", "bearings."]} />
          </h2>
          <FadeUp className="mt-8">
            <p className="text-[17px] leading-relaxed text-graphite/75">
              JRS supplies marine engine bearings in Abu Dhabi, designed to withstand the rigorous demands of marine diesel engines, with superior durability, load capacity and smooth operation under extreme conditions.
            </p>
          </FadeUp>

          <ul className="mt-10">
            {types.map((t, i) => (
              <li key={t.n} className="border-t border-graphite/14">
                <FadeUp delay={0.08 * i} className="flex items-baseline gap-5 py-4">
                  <span className="label text-marine">{t.n}</span>
                  <span className="heading text-2xl text-abyss">{t.name}</span>
                </FadeUp>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2">
            {["OEM specifications", "Marine applications", "High load capacity"].map((c) => (
              <li key={c} className="label border border-graphite/20 px-3 py-2 text-graphite/70">
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <MagneticButton href="/engine-bearings-in-abu-dhabi/" variant="solid">Explore engine bearings</MagneticButton>
            <ArrowLink href="/pistons-piston-rings-in-abu-dhabi/" className="text-abyss">Pistons &amp; rings</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
