"use client";

import { getImageProps } from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import reel from "@/content/hero-reel.json";

/*
 * Cinematic hero reel (built by scripts/build-hero-video.mjs).
 *
 * Loading: the poster still is the LCP element and paints immediately. The video is requested only after the
 * page has loaded and the browser is idle, and fades in over the poster once it is actually playing.
 *   portrait screens → 720×1280 portrait cut · landscape < 1280px → 720p · landscape ≥ 1280px → 1080p
 *   AV1 first (smallest), H.264 fallback. Reduced motion, Save-Data or 2G-class connections → poster only.
 *   Autoplay refused (e.g. iOS Low Power Mode) or a decode error → the poster simply stays.
 * Playback pauses off-screen and in background tabs. The visible pause control meets WCAG 2.2.2.
 */

type Variant = "landscape-1080" | "landscape-720" | "portrait";

const SOURCES: Record<Variant, { av1: string; av1Codec: string; h264: string; h264Codec: string }> = {
  "landscape-1080": { av1: "/video/hero-1080-av1.mp4", av1Codec: "av01.0.08M.08", h264: "/video/hero-1080.mp4", h264Codec: "avc1.640028" },
  "landscape-720": { av1: "/video/hero-720-av1.mp4", av1Codec: "av01.0.05M.08", h264: "/video/hero-720.mp4", h264Codec: "avc1.64001f" },
  portrait: { av1: "/video/hero-portrait-av1.mp4", av1Codec: "av01.0.05M.08", h264: "/video/hero-portrait.mp4", h264Codec: "avc1.64001f" },
};

type Conn = { saveData?: boolean; effectiveType?: string };

function pickVariant(): Variant | null {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const conn = (navigator as Navigator & { connection?: Conn }).connection;
  if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return null;
  if (window.innerHeight > window.innerWidth) return "portrait";
  return window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.5) >= 1280 ? "landscape-1080" : "landscape-720";
}

const orientation = (v: Variant) => (v === "portrait" ? "portrait" : "landscape");
const PAUSE_KEY = "jrs-hero-paused";

type ReelState = {
  variant: Variant | null;
  ready: boolean;
  playing: boolean;
  scene: number;
  toggle: () => void;
  tryPlay: () => void;
  onPlaying: () => void;
  onPause: () => void;
  onError: () => void;
  /** State setters used as callback refs: the provider receives the elements without ref objects in render. */
  attachVideo: (el: HTMLVideoElement | null) => void;
  attachProgress: (el: HTMLSpanElement | null) => void;
};
const ReelContext = createContext<ReelState | null>(null);

/** Owns reel state; wrap the whole hero so the media layer and the bottom-bar controls can share it. */
export function HeroReel({ children }: { children: ReactNode }) {
  const [video, attachVideo] = useState<HTMLVideoElement | null>(null);
  const [progress, attachProgress] = useState<HTMLSpanElement | null>(null);
  const userPaused = useRef(false);
  const inView = useRef(true);
  const [variant, setVariant] = useState<Variant | null>(null);
  // Readiness is tracked per variant, so after an orientation swap the poster shows until the new cut plays.
  const [readyVariant, setReadyVariant] = useState<Variant | null>(null);
  const ready = variant !== null && readyVariant === variant;
  const [playing, setPlaying] = useState(false);
  const [scene, setScene] = useState(0);

  // Choose a source once the page has loaded and the main thread is idle; re-choose if orientation flips.
  useEffect(() => {
    try {
      userPaused.current = window.localStorage.getItem(PAUSE_KEY) === "1";
    } catch {}
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idle = 0;
    const choose = () => setVariant(pickVariant());
    const start = () => {
      idle = w.requestIdleCallback ? w.requestIdleCallback(choose, { timeout: 2500 }) : window.setTimeout(choose, 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    const onResize = () => {
      const next = pickVariant();
      setVariant((cur) => (cur && next && orientation(cur) !== orientation(next) ? next : cur));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("load", start);
      window.removeEventListener("resize", onResize);
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, []);

  const tryPlay = useCallback(() => {
    if (!video || userPaused.current || !inView.current || document.hidden) return;
    video.play().catch(() => {
      /* Autoplay refused: the poster remains, which is the designed fallback. */
    });
  }, [video]);

  // Pause off-screen and in background tabs; resume when visible again.
  useEffect(() => {
    const v = video;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (e.isIntersecting) tryPlay();
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    const onVisibility = () => (document.hidden ? v.pause() : tryPlay());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [video, tryPlay]);

  // Scene caption + progress hairline follow the video clock (rAF runs only while playing).
  useEffect(() => {
    if (!playing || !video) return;
    let raf = 0;
    const tick = () => {
      {
        const t = video.currentTime % reel.duration;
        if (progress) progress.style.transform = `scaleX(${t / reel.duration})`;
        let idx = 0;
        for (let i = 0; i < reel.scenes.length; i++) if (t >= reel.scenes[i].start) idx = i;
        setScene((s) => (s === idx ? s : idx));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, video, progress]);

  const toggle = useCallback(() => {
    const v = video;
    if (!v) return;
    userPaused.current = !v.paused;
    try {
      window.localStorage.setItem(PAUSE_KEY, userPaused.current ? "1" : "0");
    } catch {}
    if (userPaused.current) v.pause();
    else tryPlay();
  }, [video, tryPlay]);

  const value: ReelState = {
    variant,
    ready,
    playing,
    scene,
    toggle,
    tryPlay,
    onPlaying: () => {
      setReadyVariant(variant);
      setPlaying(true);
    },
    onPause: () => setPlaying(false),
    onError: () => setReadyVariant(null),
    attachVideo,
    attachProgress,
  };
  return <ReelContext.Provider value={value}>{children}</ReelContext.Provider>;
}

const useReel = () => useContext(ReelContext);

/** Poster still (art-directed landscape / portrait) with the reel fading in on top once it plays. */
export function HeroMedia({ alt }: { alt: string }) {
  const reelState = useReel();
  const common = { alt, sizes: "100vw", quality: 80 };
  const {
    props: { srcSet: portrait },
  } = getImageProps({ ...common, src: "/images/hero/hero-poster-portrait.jpg", width: 900, height: 1600 });
  const {
    props: { srcSet: landscape, ...img },
  } = getImageProps({ ...common, src: "/images/hero/hero-poster.jpg", width: 1920, height: 1080 });

  // Destructure first: the compiler treats an object as ref-like once any property is passed to `ref`.
  const { variant, ready, attachVideo, tryPlay, onPlaying, onPause, onError } = reelState ?? {};
  const src = variant ? SOURCES[variant] : null;

  return (
    <>
      <picture>
        <source media="(orientation: portrait)" srcSet={portrait} />
        <source media="(orientation: landscape)" srcSet={landscape} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is supplied through getImageProps */}
        <img {...img} loading="eager" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
      </picture>
      {src && (
        <video
          key={variant}
          ref={attachVideo}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[1400ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
          onCanPlay={tryPlay}
          onPlaying={onPlaying}
          onPause={onPause}
          onError={onError}
        >
          <source src={src.av1} type={`video/mp4; codecs="${src.av1Codec}"`} />
          <source src={src.h264} type={`video/mp4; codecs="${src.h264Codec}"`} />
        </video>
      )}
    </>
  );
}

/** Scene caption, loop progress and pause control for the hero's bottom bar. Renders nothing until the reel plays. */
export function ReelControls({ className }: { className?: string }) {
  const reelState = useReel();
  if (!reelState?.ready) return null;
  const { playing, scene, toggle, attachProgress } = reelState;
  const caption = reel.scenes[scene]?.caption ?? "";
  return (
    <motion.div
      className={`flex items-center gap-4 ${className ?? ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:text-accent"
      >
        {playing ? <Pause className="size-3.5" fill="currentColor" aria-hidden /> : <Play className="size-3.5" fill="currentColor" aria-hidden />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="label flex items-baseline gap-2 text-steel-300">
          <span className="tabular-nums text-accent">{String(scene + 1).padStart(2, "0")}</span>
          <span className="tabular-nums text-white/40">/ {String(reel.scenes.length).padStart(2, "0")}</span>
          <span className="relative block h-[1.4em] min-w-[11rem] flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={caption}
                className="absolute inset-0 truncate"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {caption}
              </motion.span>
            </AnimatePresence>
          </span>
        </p>
        <span aria-hidden className="mt-2 block h-px w-full bg-white/15">
          <span ref={attachProgress} className="block h-full origin-left scale-x-0 bg-accent" />
        </span>
      </div>
    </motion.div>
  );
}
