"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

type Props = {
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  className?: string;
  /** Optional overlay inside the pinned viewport (e.g. sheet label). */
  overlay?: ReactNode;
};

/**
 * Pinned horizontal scroll: vertical scroll drives the track sideways on desktop with a fine pointer.
 * Touch devices and reduced-motion users get a native swipeable row with scroll-snap.
 */
export function HorizontalTrack({ children, id, labelledBy, className, overlay }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 1024px) and (pointer: fine)");
  const pinned = desktop && !reduce;
  const [dist, setDist] = useState(0);

  useIsoLayoutEffect(() => {
    if (!pinned || !trackRef.current) return;
    const el = trackRef.current;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * dist);

  if (!pinned) {
    return (
      <section id={id} aria-labelledby={labelledBy} className={`relative ${className ?? ""}`}>
        {overlay}
        <div className="flex snap-x snap-mandatory gap-0 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" tabIndex={0} aria-label="Scroll horizontally">
          {children}
        </div>
      </section>
    );
  }

  return (
    <section id={id} aria-labelledby={labelledBy} ref={sectionRef} className={`relative ${className ?? ""}`} style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {overlay}
        <motion.div ref={trackRef} style={{ x }} className="flex h-full w-max will-change-transform">
          {children}
        </motion.div>
        <div aria-hidden className="absolute inset-x-[var(--gutter)] bottom-8 h-px bg-white/12">
          <motion.div className="h-full origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}
