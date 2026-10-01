"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/content";
import { FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { ArrowLink, Eyebrow } from "@/components/ui/primitives";

export function Services() {
  const [active, setActive] = useState(0);
  const s = services[active];

  return (
    <section aria-labelledby="services-title" className="section-y relative bg-navy-900">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow sheet="09 / 14">Technical services</Eyebrow>
            <h2 id="services-title" className="mt-8">
              <RevealLines className="display block text-[clamp(2.75rem,7vw,7.5rem)] text-white" lines={["Repair.", "Recondition.", <span key="r" className="accent text-steel-300">Return to service.</span>]} />
            </h2>
          </div>
          <FadeUp className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[17px] leading-relaxed text-fog/75">
              Eight specialist services, from turbocharger overhauls to governors and electrical instrumentation, delivered by skilled technicians with precise diagnostic tools.
            </p>
          </FadeUp>
        </div>

        {/* Desktop: list + sticky stage */}
        <div className="mt-[clamp(48px,6vw,96px)] hidden gap-6 lg:grid lg:grid-cols-12">
          <ol className="col-span-6 border-t border-white/12">
            {services.map((sv, i) => (
              <li key={sv.href} className="border-b border-white/12">
                <Link
                  href={sv.href}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-baseline gap-6 py-5"
                  aria-current={i === active ? "true" : undefined}
                >
                  <span className={`label tabular-nums transition-colors ${i === active ? "text-signal" : "text-steel-500"}`}>{sv.index}</span>
                  <span
                    className={`heading text-[clamp(1.5rem,2.3vw,2.4rem)] transition-[color,transform] duration-700 ease-(--ease-expo) ${
                      i === active ? "translate-x-3 text-white" : "text-white/35 group-hover:text-white/70"
                    }`}
                  >
                    {sv.title}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="col-span-5 col-start-8">
            <div className="sticky top-28">
              <div className="scene relative aspect-[4/3] overflow-hidden bg-abyss">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={s.href}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image src={s.image.src} alt={s.image.alt} fill sizes="40vw" className="object-cover grayscale" />
                  </motion.div>
                </AnimatePresence>
                <span className="label absolute left-4 top-4 z-10 text-white/70">Service {s.index} / 08</span>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={s.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8"
                >
                  <p className="text-[16px] leading-relaxed text-fog/85">{s.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {s.points.map((p) => (
                      <li key={p} className="label border border-white/15 px-3 py-2 text-steel-300">{p}</li>
                    ))}
                  </ul>
                  <ArrowLink href={s.href} className="mt-8 text-white">{`View ${s.title}`}</ArrowLink>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile / tablet: stacked cards */}
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:hidden">
          {services.map((sv) => (
            <li key={sv.href}>
              <Link href={sv.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-abyss">
                  <Image src={sv.image.src} alt={sv.image.alt} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover grayscale" />
                  <span className="label absolute left-3 top-3 text-white/80">{sv.index}</span>
                </div>
                <h3 className="heading mt-5 flex items-start justify-between gap-4 text-2xl text-white">
                  {sv.title}
                  <ArrowUpRight className="mt-1 size-5 shrink-0" strokeWidth={1.5} aria-hidden />
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fog/70">{sv.body}</p>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex justify-end">
          <ArrowLink href="/services/" className="text-white">All services</ArrowLink>
        </div>
      </div>
    </section>
  );
}
