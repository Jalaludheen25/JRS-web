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
            data-reveal=""
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.07 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.8, ease }}
          >
            <HeroMedia alt={images.homeHero.alt} />
          </motion.div>
        </motion.div>
        {/* Light overlay: a thin wash of the heritage navy (#021343), slightly stronger at the top (navigation)
            and bottom (headline and copy), almost clear through the middle so the film stays bright. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(2_19_67/0.34)_0%,rgb(2_19_67/0.08)_32%,rgb(2_19_67/0.1)_55%,rgb(2_19_67/0.46)_100%)]" />
      </motion.div>

      <motion.div
        className="shell text-legible relative z-10 flex h-full flex-col justify-end pb-[clamp(28px,6vh,64px)] pt-28"
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <div className="relative">
          <div>
            <h1 id="hero-title">
              <motion.span
                data-reveal=""
                className="label text-legible-strong mb-6 block text-[12px] font-semibold text-white"
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
            data-reveal=""
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
              {/* Solid (opaque) secondary button: legible over any frame without putting a mask on the film. */}
              <MagneticButton href="#capabilities" variant="light">
                Explore solutions
              </MagneticButton>
            </div>
            <a href={site.phone.tel} className="label text-legible-strong mt-7 inline-flex items-center gap-2 text-white hover:text-accent">
              <Phone className="size-3.5" aria-hidden /> {site.phone.display}
            </a>
            <ReelControls className="mt-8 md:hidden" />
          </motion.div>
        </div>

        <div className="mt-10 hidden justify-end md:flex">
          <ReelControls className="w-[24rem]" />
        </div>
      </motion.div>
    </section>
    </HeroReel>
  );
}
