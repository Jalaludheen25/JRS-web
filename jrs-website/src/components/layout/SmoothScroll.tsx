"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

/** Lenis smooth scrolling on desktop; native scrolling for reduced motion and touch. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  // Tell the reveal guard (src/lib/reveal-guard.ts) that the app started, so it never forces the fallback.
  useEffect(() => {
    (window as Window & { __jrsHydrated?: boolean }).__jrsHydrated = true;
  }, []);
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, syncTouch: false, anchors: { offset: -80 } }}>
      {children}
    </ReactLenis>
  );
}
