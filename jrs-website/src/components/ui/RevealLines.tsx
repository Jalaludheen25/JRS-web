"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

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
  // The line masks are released once the reveal has finished, so text shadows (hero) are not cut into boxes.
  const [revealed, setRevealed] = useState(false);

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} data-reveal-mask="" className={`block pb-[0.06em] -mb-[0.06em] ${revealed || reduce ? "" : "overflow-hidden"}`}>
          <motion.span
            data-reveal=""
            className={`block will-change-transform ${lineClassName ?? ""}`}
            initial={reduce ? false : { y: "110%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
            onAnimationComplete={i === lines.length - 1 ? () => setRevealed(true) : undefined}
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
      data-reveal=""
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
      data-reveal=""
      className={`${dark ? "hairline-dark" : "hairline"} origin-left ${className ?? ""}`}
      initial={reduce ? false : { scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : undefined}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay }}
    />
  );
}

/** Yellow highlighter stroke that draws in behind a phrase once it scrolls into view (light surfaces). */
export function Mark({ children, delay = 0.55 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      data-reveal=""
      className="mark"
      initial={reduce ? false : { backgroundSize: "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.span>
  );
}

/** Grid/list item that rises in as it scrolls into view, staggered across a row by `index`. */
export function RevealItem({ children, className, index = 0 }: { children: ReactNode; className?: string; index?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      data-reveal=""
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (index % 6) * 0.06 }}
    >
      {children}
    </motion.li>
  );
}
