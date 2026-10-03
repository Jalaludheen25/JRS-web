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
  // Copy drifts slightly *down* and fades as the page scrolls away, so it never rises into the fixed header.
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <HeroReel>
    {/* min-height, not a fixed height: on short screens the hero grows with its content instead of pushing it up
        under the header. Content keeps a fixed clearance below the 76px header (pt-[104px]). */}
    <section ref={ref} aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-abyss">
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
        {/* Subtle readability overlay in the heritage navy (#021343): a light wash over the whole film, a little
            more under the navigation and behind the headline/copy at the bottom, clear enough to keep the film bright. */}
        <div
          data-hero-overlay=""
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(2_19_67/0.38)_0%,rgb(2_19_67/0.14)_28%,rgb(2_19_67/0.16)_55%,rgb(2_19_67/0.55)_100%)]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_85%,rgb(2_19_67/0.32),transparent_70%)]" />
      </motion.div>

      <motion.div
        className="shell text-legible relative z-10 flex flex-1 flex-col justify-end pb-[clamp(24px,6vh,64px)] pt-[104px]"
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <div className="relative">
          <div>
            <h1 id="hero-title">
              <motion.span
                data-reveal=""
                className="label text-legible-strong mb-4 block text-[11px] font-semibold text-white sm:mb-6 sm:text-[12px]"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Marine engine spare parts &amp; technical solutions — Abu Dhabi, UAE
              </motion.span>
              <RevealLines
                immediate
                delay={0.15}
                className="display hero-title text-legible-strong block text-white"
                lines={["Engineered", "for", <span key="u" className="accent text-accent">uptime.</span>]}
              />
            </h1>
          </div>

          <motion.div
            data-reveal=""
            className="mt-7 sm:mt-10 lg:absolute lg:bottom-3 lg:right-0 lg:mt-0 lg:w-[min(32vw,440px)]"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
          >
            <p className="text-legible-strong max-w-sm text-[16px] font-medium leading-relaxed text-white sm:text-[17px]">
              Genuine and OEM spare parts, overhauls and technical services for the marine and power-generation machinery that cannot stop.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
              <MagneticButton href={quoteHref}>Request a quote</MagneticButton>
              {/* Solid (opaque) secondary button: legible over any frame without putting a mask on the film. */}
              <MagneticButton href="#capabilities" variant="light">
                Explore solutions
              </MagneticButton>
            </div>
            <a href={site.phone.tel} className="label text-legible-strong mt-5 inline-flex items-center gap-2 text-white hover:text-accent sm:mt-7">
              <Phone className="size-3.5" aria-hidden /> {site.phone.display}
            </a>
            <ReelControls className="mt-6 md:hidden" />
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
