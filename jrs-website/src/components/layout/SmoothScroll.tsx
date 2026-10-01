"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Lenis smooth scrolling on desktop; native scrolling for reduced motion and touch. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, syncTouch: false, anchors: { offset: -80 } }}>
      {children}
    </ReactLenis>
  );
}
