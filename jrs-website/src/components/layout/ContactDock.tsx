"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { MessageCircle, Phone, FileText } from "lucide-react";
import { quoteHref, site } from "@/lib/site";

/** Mobile-only action bar: call, WhatsApp, quote. Appears once the hero is passed. */
export function ContactDock() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 480));

  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em]";
  return (
    <motion.nav
      aria-label="Quick contact"
      className="fixed inset-x-3 bottom-3 z-40 flex overflow-hidden rounded-2xl border border-white/10 bg-navy-900/92 shadow-2xl shadow-black/40 backdrop-blur-xl lg:hidden"
      initial={false}
      animate={{ y: show ? 0 : 120, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <a href={site.phone.tel} className={item} tabIndex={show ? 0 : -1}>
        <Phone className="size-[18px]" strokeWidth={1.6} aria-hidden /> Call
      </a>
      <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={`${item} border-x border-white/10`} tabIndex={show ? 0 : -1}>
        <MessageCircle className="size-[18px]" strokeWidth={1.6} aria-hidden /> WhatsApp
      </a>
      <Link href={quoteHref} className={`${item} bg-marine`} tabIndex={show ? 0 : -1}>
        <FileText className="size-[18px]" strokeWidth={1.6} aria-hidden /> Quote
      </Link>
    </motion.nav>
  );
}
