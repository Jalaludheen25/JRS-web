"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** Vertical parallax travel in % of the frame height. 0 disables. */
  parallax?: number;
  from?: "bottom" | "left" | "right";
  preload?: boolean;
};

const clipFrom = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Clip-path masked image reveal with optional scroll parallax. */
export function ImageReveal({ src, alt, sizes, className, imageClassName, parallax = 8, from = "bottom", preload }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);

  return (
    <motion.div
      ref={ref}
      data-reveal=""
      className={`relative overflow-hidden ${className ?? ""}`}
      initial={reduce ? false : { clipPath: clipFrom[from] }}
      animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        data-reveal=""
        className="absolute -inset-y-[10%] inset-x-0"
        style={reduce || !parallax ? undefined : { y }}
        initial={reduce ? false : { scale: 1.18 }}
        animate={inView ? { scale: 1 } : undefined}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className={`object-cover ${imageClassName ?? ""}`} />
      </motion.div>
    </motion.div>
  );
}
