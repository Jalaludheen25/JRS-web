"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Phone } from "lucide-react";
import { RevealLines } from "@/components/ui/RevealLines";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { quoteHref, site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // The full-bleed photo contracts into a framed viewport as the user scrolls away.
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(0% 0% 0% 0%)", "inset(9% 5% 18% 5%)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-abyss">
      <motion.div className="scene grain absolute inset-0 overflow-hidden" style={reduce ? undefined : { clipPath: clip }}>
        <motion.div className="absolute inset-0" style={reduce ? undefined : { scale }}>
          <Image
            src="/images/scenes/open-sea-panorama-graded.jpg"
            alt="Container vessel under way towards a port, seen from above"
            fill
            preload
            sizes="100vw"
            quality={80}
            className="object-cover object-[62%_50%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_100%,rgb(6_10_20/0.92),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-abyss/80 to-transparent" />
      </motion.div>

      <TechnicalGrid />

      <motion.div
        className="shell relative z-10 flex h-full flex-col justify-end pb-[clamp(28px,6vh,64px)] pt-28"
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 id="hero-title">
              <motion.span
                className="label mb-6 block text-steel-300"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Marine engine spare parts &amp; technical solutions — Abu Dhabi, UAE
              </motion.span>
              <RevealLines
                immediate
                delay={0.15}
                className="display block text-[clamp(3.6rem,13.5vw,13.5rem)] text-white"
                lines={["Engineered", <>for <span className="accent normal-case text-steel-300">uptime.</span></>]}
              />
            </h1>
          </div>

          <motion.div
            className="lg:col-span-4 lg:pb-4"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
          >
            <p className="max-w-sm text-[17px] leading-relaxed text-fog/85">
              Genuine and OEM spare parts, overhauls and technical services for the marine and power-generation machinery that cannot stop.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton href={quoteHref}>Request a quote</MagneticButton>
              <MagneticButton href="#capabilities" variant="ghost">Explore solutions</MagneticButton>
            </div>
            <a href={site.phone.tel} className="label mt-7 inline-flex items-center gap-2 text-fog/75 hover:text-white">
              <Phone className="size-3.5" aria-hidden /> {site.phone.display}
            </a>
          </motion.div>
        </div>

        <div className="mt-10 hidden items-center justify-between border-t border-white/15 pt-5 text-steel-300 md:flex">
          <p className="label tabular-nums">01 / 14 — JRS Mechanical Equipment</p>
          <p className="label tabular-nums">{site.geo.label}</p>
          <p className="label">Marine · Power generation · Industrial · Offshore</p>
          <p className="label flex items-center gap-3">
            Scroll
            <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-white/15">
              <span className="animate-scroll-cue absolute inset-0 bg-white" />
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/** Quiet coordinate grid: column rules, crosshairs and a slow scan line. Decorative. */
function TechnicalGrid() {
  const reduce = useReducedMotion();
  const cols = [1, 2, 3, 4, 5];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      <div className="shell relative h-full">
        {cols.map((c, i) => (
          <motion.span
            key={c}
            className="absolute top-0 bottom-0 w-px origin-top bg-white/[0.07]"
            style={{ left: `${(c / 6) * 100}%` }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.6, ease, delay: 0.1 + i * 0.08 }}
          />
        ))}
        {[22, 64].map((top) =>
          cols.map((c) => (
            <span key={`${top}-${c}`} className="absolute -translate-x-1/2 -translate-y-1/2 text-white/30" style={{ left: `${(c / 6) * 100}%`, top: `${top}%` }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M5.5 0v11M0 5.5h11" />
              </svg>
            </span>
          )),
        )}
        <span className="label absolute right-[var(--gutter)] top-28 hidden text-right text-white/35 md:block">
          Sheet 01
          <br />
          Datum A
        </span>
      </div>
    </div>
  );
}
