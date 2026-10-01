"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "solid" | "ghost" | "light";

const styles: Record<Variant, string> = {
  solid: "bg-marine text-white hover:bg-marine-bright",
  ghost: "border border-white/25 text-fog hover:border-white/60 hover:bg-white/5",
  light: "bg-white text-abyss hover:bg-plate",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  icon?: ReactNode;
  ariaLabel?: string;
};

/** Pill CTA with a subtle magnetic pull on fine pointers. */
export function MagneticButton({ href, children, variant = "solid", className, external, icon, ariaLabel }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`group inline-flex h-12 items-center gap-3 rounded-full pl-6 pr-2 text-[13px] font-medium tracking-[0.04em] uppercase transition-colors duration-300 ${styles[variant]} ${className ?? ""}`}
    >
      <span>{children}</span>
      <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-white/12">
        <span className="relative block size-4">
          <span className="absolute inset-0 transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-4 group-hover:-translate-y-4">
            {icon ?? <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />}
          </span>
          <span className="absolute inset-0 -translate-x-4 translate-y-4 transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-0 group-hover:translate-y-0">
            {icon ?? <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />}
          </span>
        </span>
      </span>
    </motion.span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="inline-block rounded-full">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={ariaLabel} className="inline-block rounded-full">
      {inner}
    </Link>
  );
}
