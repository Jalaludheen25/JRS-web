"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Phone } from "lucide-react";
import { RevealLines } from "@/components/ui/RevealLines";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { quoteHref, site } from "@/lib/site";
import { images } from "@/lib/images";
import { HeroMedia, HeroReel, ReelControls } from "./HeroVideo";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // The full-bleed film contracts into a framed viewport as the user scrolls away.
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(0% 0% 0% 0%)", "inset(9% 5% 18% 5%)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <HeroReel>
    <section ref={ref} aria-labelledby="hero-title" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-abyss">
      <motion.div className="absolute inset-0 overflow-hidden" style={reduce ? undefined : { clipPath: clip }}>
        <motion.div className="absolute inset-0" style={reduce ? undefined : { scale }}>
          {/* Slow "settle" on arrival: the film eases back from a slight push-in. */}
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.8, ease }}
          >
            <HeroMedia alt={images.homeHero.alt} />
          </motion.div>
        </motion.div>
        {/* No overlay mask: the film stays fully visible. Only a light gradient at the bottom, which settles the
            bottom bar and eases the film into the next section. Text legibility comes from .text-legible shadows. */}
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-abyss/75 via-abyss/25 to-transparent" />
      </motion.div>

      <TechnicalGrid />

      <motion.div
        className="shell text-legible relative z-10 flex h-full flex-col justify-end pb-[clamp(28px,6vh,64px)] pt-28"
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <div className="relative">
          <div>
            <h1 id="hero-title">
              <motion.span
                className="label mb-6 inline-block bg-abyss/40 px-3 py-1.5 text-white [text-shadow:none] backdrop-blur-md"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Marine engine spare parts &amp; technical solutions — Abu Dhabi, UAE
              </motion.span>
              <RevealLines
                immediate
                delay={0.15}
                className="display text-legible-strong block text-[clamp(3.4rem,13vw,13rem)] text-white"
                lines={["Engineered", "for", <span key="u" className="accent text-accent">uptime.</span>]}
              />
            </h1>
          </div>

          <motion.div
            className="mt-10 lg:absolute lg:bottom-3 lg:right-0 lg:mt-0 lg:w-[min(32vw,440px)]"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
          >
            <p className="text-legible-strong max-w-sm text-[17px] font-medium leading-relaxed text-white">
              Genuine and OEM spare parts, overhauls and technical services for the marine and power-generation machinery that cannot stop.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton href={quoteHref}>Request a quote</MagneticButton>
              {/* Frosted backing keeps the outline button legible over bright footage without a full-frame overlay. */}
              <MagneticButton href="#capabilities" variant="ghost" className="bg-abyss/30 backdrop-blur-md">
                Explore solutions
              </MagneticButton>
            </div>
            <a href={site.phone.tel} className="label text-legible-strong mt-7 inline-flex items-center gap-2 text-white hover:text-accent">
              <Phone className="size-3.5" aria-hidden /> {site.phone.display}
            </a>
            <ReelControls className="mt-8 border-t border-white/15 pt-5 md:hidden" />
          </motion.div>
        </div>

        <div className="mt-10 hidden items-center justify-between border-t border-white/15 pt-5 text-steel-300 md:flex">
          <p className="label hidden tabular-nums lg:block">01 / 14 — JRS Mechanical Equipment</p>
          <p className="label hidden tabular-nums lg:block">{site.geo.label}</p>
          <ReelControls className="w-[22rem]" />
          <p className="label flex items-center gap-3">
            Scroll
            <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-white/15">
              <span className="animate-scroll-cue absolute inset-0 bg-accent" />
            </span>
          </p>
        </div>
      </motion.div>
    </section>
    </HeroReel>
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
            <span key={`${top}-${c}`} className={`absolute -translate-x-1/2 -translate-y-1/2 ${c === 4 && top === 64 ? "text-accent" : "text-white/30"}`} style={{ left: `${(c / 6) * 100}%`, top: `${top}%` }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M5.5 0v11M0 5.5h11" />
              </svg>
            </span>
          )),
        )}
        <span className="label text-legible absolute right-[var(--gutter)] top-28 hidden text-right text-white/60 md:block">
          Sheet 01
          <br />
          Datum A
        </span>
      </div>
    </div>
  );
}
