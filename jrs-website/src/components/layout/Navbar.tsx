"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { primaryNav, quoteHref, site } from "@/lib/site";
import { products, services } from "@/lib/content";

const panels: Record<string, { title: string; href: string; items: { label: string; href: string }[] }> = {
  Products: { title: "All products", href: "/products/", items: products.map((p) => ({ label: p.name, href: p.href })) },
  Services: { title: "All services", href: "/services/", items: services.map((s) => ({ label: s.title, href: s.href })) },
};

export function Navbar() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelId = useId();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 600 && y > prev && !menuOpen && !panel);
  });

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setPanel(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const openPanel = (name: string | null) => {
    clearTimeout(closeTimer.current);
    setPanel(name);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel(null), 160);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onMouseLeave={scheduleClose}
      >
        <div
          className={`absolute inset-0 -z-10 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
            solid || panel ? "border-white/10 bg-abyss/88 backdrop-blur-xl" : "border-transparent bg-transparent"
          }`}
        />
        <nav aria-label="Primary" className="shell flex h-[76px] items-center justify-between gap-6">
          <Link href="/" className="relative z-10 shrink-0" aria-label="JRS Mechanical Equipment, home">
            <Image src="/brand/jrs-logo.png" alt="JRS — Quality Spares, Reliable Repairs" width={720} height={358} preload className="h-11 w-auto brightness-0 invert" />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {primaryNav.map((item) => {
              const hasPanel = item.label in panels;
              return (
                <li key={item.href} onMouseEnter={() => openPanel(hasPanel ? item.label : null)}>
                  <Link
                    href={item.href}
                    className="link-underline py-2 text-[13px] font-medium uppercase tracking-[0.08em] text-fog/85 transition-colors hover:text-white"
                    aria-expanded={hasPanel ? panel === item.label : undefined}
                    aria-controls={hasPanel ? panelId : undefined}
                    onFocus={() => openPanel(hasPanel ? item.label : null)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a href={site.phone.tel} className="label hidden text-fog/70 transition-colors hover:text-white xl:block">
              {site.phone.display}
            </a>
            <Link
              href={quoteHref}
              className="group hidden h-11 items-center gap-2 rounded-full bg-white px-5 text-[12px] font-semibold uppercase tracking-[0.1em] text-abyss transition-colors hover:bg-plate sm:inline-flex"
            >
              Request a quote
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-(--ease-expo) group-hover:rotate-45" strokeWidth={1.75} aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="relative z-10 grid size-11 place-items-center rounded-full border border-white/20 lg:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <span aria-hidden className="relative block h-3 w-5">
                <span className={`absolute left-0 h-px w-5 bg-white transition-all duration-500 ease-(--ease-expo) ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-5 bg-white transition-all duration-500 ease-(--ease-expo) ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>

        {/* Desktop mega panel */}
        <AnimatePresence>
          {panel && panels[panel] && (
            <motion.div
              id={panelId}
              key={panel}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => openPanel(panel)}
              className="hidden border-b border-white/10 bg-abyss/95 backdrop-blur-xl lg:block"
            >
              <div className="shell grid grid-cols-12 gap-6 py-10">
                <div className="col-span-3">
                  <p className="label text-steel-500">{panel}</p>
                  <Link href={panels[panel].href} className="heading mt-4 block text-3xl text-white hover:text-marine-bright">
                    {panels[panel].title} →
                  </Link>
                </div>
                <ul className="col-span-9 grid grid-cols-2 gap-x-10">
                  {panels[panel].items.map((it, i) => (
                    <li key={it.href} className="border-t border-white/10">
                      <Link href={it.href} className="group flex items-baseline gap-4 py-3.5 text-[15px] text-fog/80 hover:text-white" onClick={() => setPanel(null)}>
                        <span className="label tabular-nums text-steel-500">{String(i + 1).padStart(2, "0")}</span>
                        <span className="transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-1.5">{it.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-abyss pt-[76px] lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
          >
            <nav aria-label="Mobile" className="shell flex flex-1 flex-col overflow-y-auto pb-8">
              <ul className="mt-6">
                {[{ label: "Home", href: "/" }, ...primaryNav, { label: "Contact", href: "/contact/" }].map((item, i) => (
                  <motion.li
                    key={item.href}
                    className="overflow-hidden border-b border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={item.href} onClick={() => setMenuOpen(false)} className="flex items-baseline justify-between py-4">
                      <span className="heading text-[clamp(2rem,9vw,3.25rem)] uppercase">{item.label}</span>
                      <span className="label text-steel-500">{String(i + 1).padStart(2, "0")}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto grid grid-cols-2 gap-3 pt-10">
                <a href={site.phone.tel} className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 text-sm font-medium">
                  <Phone className="size-4" aria-hidden /> Call JRS
                </a>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-14 items-center justify-center gap-2 rounded-full bg-marine text-sm font-medium">
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp
                </a>
              </div>
              <p className="label mt-6 text-steel-500">{site.phone.display} · {site.email}</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
