"use client";

import dynamic from "next/dynamic";
import { useInView, useReducedMotion, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

// three.js + R3F are only fetched when this section approaches the viewport on a capable device.
const TurboWheel = dynamic(() => import("./TurboWheel"), { ssr: false, loading: () => null });

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function TurboViewer({ progress }: { progress?: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { margin: "400px 0px 400px 0px" });
  const visible = useInView(ref);
  const reduce = useReducedMotion();
  const [capable, setCapable] = useState(false);
  const [mounted3d, setMounted3d] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCapable(window.matchMedia("(min-width: 768px)").matches && supportsWebGL());
  }, []);
  useEffect(() => {
    if (near && capable && !reduce) setMounted3d(true);
  }, [near, capable, reduce]);

  return (
    <div ref={ref} className="relative size-full">
      <TurbineDrawing className={`transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`} spin={!reduce} />
      {mounted3d && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <TurboWheel progress={progress} active={visible} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}

/** Line-drawing of a compressor wheel, front view. Fallback for mobile, reduced motion and no-WebGL. */
export function TurbineDrawing({ className, spin }: { className?: string; spin?: boolean }) {
  const blades = 18;
  const paths = Array.from({ length: blades }, (_, i) => {
    const a = (i / blades) * Math.PI * 2;
    const pt = (r: number, da: number) => `${200 + r * Math.cos(a + da)} ${200 + r * Math.sin(a + da)}`;
    const main = i % 2 === 0;
    return `M${pt(main ? 34 : 92, main ? -0.9 : -0.45)} Q${pt(110, -0.15)} ${pt(176, 0.28)}`;
  });
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Schematic drawing of a turbocharger compressor wheel" className={`absolute inset-0 m-auto size-[82%] text-white/55 ${className ?? ""}`}>
      <g fill="none" stroke="currentColor" strokeWidth="0.75">
        <g className={spin ? "animate-spin-slow origin-center [transform-box:fill-box]" : ""}>
          <circle cx="200" cy="200" r="178" />
          <circle cx="200" cy="200" r="182" opacity=".4" />
          <circle cx="200" cy="200" r="34" />
          <circle cx="200" cy="200" r="12" />
          {paths.map((d, i) => (
            <path key={i} d={d} opacity={i % 2 === 0 ? 1 : 0.55} />
          ))}
        </g>
        <path d="M10 200h50M340 200h50M200 10v50M200 340v50" opacity=".35" strokeDasharray="4 4" />
        <path d="M18 392h364M18 386v12M382 386v12" opacity=".45" />
      </g>
    </svg>
  );
}
