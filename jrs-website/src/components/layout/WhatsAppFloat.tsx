"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { site } from "@/lib/site";

/**
 * Floating WhatsApp button on every page. Desktop: always shown, bottom right, with a label that slides out on hover.
 * Below 1024px it gives way to the contact dock (which carries its own WhatsApp button) once that appears, so only
 * one WhatsApp control is on screen at a time.
 */
export function WhatsAppFloat() {
  const { scrollY } = useScroll();
  const [dock, setDock] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setDock(y > 480)); // same threshold as ContactDock

  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with JRS on WhatsApp, ${site.phone.display}`}
      className={`group fixed bottom-4 right-4 z-[35] flex items-center transition-[opacity,translate,visibility] duration-500 ease-(--ease-expo) sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 ${
        dock ? "max-lg:invisible max-lg:translate-y-3 max-lg:opacity-0" : ""
      }`}
    >
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-white py-2 pl-4 pr-4 text-[13px] font-medium text-abyss opacity-0 shadow-[0_12px_30px_-12px_rgb(2_19_67/0.5)] ring-1 ring-heritage/10 transition-[opacity,translate] duration-300 ease-(--ease-expo) translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 lg:block">
        Chat on WhatsApp
      </span>
      <span className="relative grid size-[52px] place-items-center rounded-full bg-[#44d119] text-white shadow-[0_14px_30px_-10px_rgb(40_150_20/0.6),0_4px_12px_-4px_rgb(0_0_0/0.35)] ring-4 ring-white/70 transition-transform duration-300 ease-(--ease-expo) group-hover:scale-110 sm:size-14">
        <span aria-hidden className="wa-pulse absolute inset-0 rounded-full bg-[#44d119] motion-reduce:hidden" />
        <WhatsAppIcon px={96} className="relative size-full" />
      </span>
    </a>
  );
}
