"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

type Props = {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate immediately on mount instead of when scrolled into view. */
  immediate?: boolean;
};

/** Masked line-by-line headline reveal. Render inside the semantic heading element. */
export function RevealLines({ lines, className, lineClassName, delay = 0, stagger = 0.08, immediate }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const show = immediate || inView;

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
          <motion.span
            className={`block will-change-transform ${lineClassName ?? ""}`}
            initial={reduce ? false : { y: "110%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Fade-and-rise for supporting copy and small blocks. */
export function FadeUp({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** Hairline that draws itself once. */
export function DrawLine({ className, dark, delay = 0 }: { className?: string; dark?: boolean; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={`${dark ? "hairline-dark" : "hairline"} origin-left ${className ?? ""}`}
      initial={reduce ? false : { scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : undefined}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay }}
    />
  );
}
