"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { products, type Product } from "@/lib/content";
import { DrawLine, FadeUp, Mark, RevealLines } from "@/components/ui/RevealLines";
import { ArrowLink, CropMarks, Eyebrow } from "@/components/ui/primitives";

export function Products() {
  const [active, setActive] = useState(0);
  const current = products[active];

  return (
    <section aria-labelledby="products-title" className="section-y relative bg-plate text-graphite">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow sheet="05 / 16" className="text-steel-500">Products</Eyebrow>
            <h2 id="products-title" className="mt-8">
              <RevealLines
                className="display block text-[clamp(2.75rem,7.5vw,8rem)] text-abyss"
                lines={["Precision", "components.", <span key="c" className="accent text-abyss"><Mark>Critical performance.</Mark></span>]}
              />
            </h2>
          </div>
          <FadeUp className="self-end lg:col-span-4">
            <p className="text-[17px] leading-relaxed text-graphite/75">
              Pistons, rings, bearings, liners, fuel injection systems, cylinder heads, valve components, filters and separators, sourced from trusted manufacturers for industrial and marine applications.
            </p>
          </FadeUp>
        </div>

        <DrawLine dark className="mt-[clamp(48px,6vw,96px)]" />

        <div className="grid lg:grid-cols-12 lg:gap-6">
          <ol className="lg:col-span-7">
            {products.map((p, i) => (
              <ProductRow key={p.slug} p={p} i={i} active={i === active} onActivate={() => setActive(i)} />
            ))}
          </ol>

          {/* Sticky inspection plate (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-24 pt-6">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-plate-deep">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={current.slug}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
                      {/* Cut-out PNGs (brochure) sit inside the plate; full-frame renders fill it. */}
                      <Image data-img-role="thumb"
                        src={current.image.src}
                        alt={current.image.alt}
                        fill
                        sizes="40vw"
                        className={current.image.src.endsWith(".png") ? "object-contain p-10" : "object-cover mix-blend-multiply"}
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
                <CropMarks className="text-accent-deep" />
                <div className="absolute left-5 top-5 label text-graphite/60">Fig. 05.{String(active + 1).padStart(2, "0")}</div>
              </div>
              <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-6">
                <div>
                  <p className="label text-steel-500">{current.short}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-graphite/80">{current.summary}</p>
                </div>
                <Link
                  href={current.href}
                  aria-label={`View ${current.name}`}
                  className="grid size-14 place-items-center rounded-full bg-abyss text-accent transition-colors hover:bg-accent hover:text-abyss"
                >
                  <ArrowUpRight className="size-5" strokeWidth={1.5} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-xl text-[14px] text-graphite/60">
            Need a part not listed here? Send the engine make, model and part number. JRS will confirm availability and specifications.
          </p>
          <ArrowLink href="/products/" className="text-abyss">All products</ArrowLink>
        </div>
      </div>
    </section>
  );
}

function ProductRow({ p, i, active, onActivate }: { p: Product; i: number; active: boolean; onActivate: () => void }) {
  return (
    <li className="border-b border-graphite/14">
      <Link
        href={p.href}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-6 lg:grid-cols-[3.5rem_1fr_auto] lg:py-7"
      >
        <span
          aria-hidden
          className={`absolute inset-y-0 -left-4 -right-4 origin-bottom bg-white transition-transform duration-700 ease-(--ease-expo) ${active ? "scale-y-100" : "scale-y-0"} max-lg:hidden`}
        />
        <span
          aria-hidden
          className={`absolute inset-y-4 -left-4 w-[3px] origin-top bg-accent transition-transform duration-700 ease-(--ease-expo) ${active ? "scale-y-100" : "scale-y-0"} max-lg:hidden`}
        />
        <span className={`label relative tabular-nums transition-colors ${active ? "text-accent-ink" : "text-steel-500"}`}>{String(i + 1).padStart(2, "0")}</span>
        <span className="relative">
          <span
            className={`heading block text-[clamp(1.5rem,2.6vw,2.6rem)] transition-[color,transform] duration-700 ease-(--ease-expo) ${
              active ? "text-abyss lg:translate-x-2" : "text-graphite/55"
            }`}
          >
            {p.name}
          </span>
          <span className="label mt-2 block text-steel-500 lg:hidden">{p.short}</span>
        </span>
        <span className="relative flex items-center gap-4">
          <span className="label hidden text-steel-500 xl:block">{p.tags.join(" · ")}</span>
          <span className="relative block size-16 overflow-hidden bg-plate-deep lg:hidden">
            <Image data-img-role="thumb" src={p.image.src} alt="" fill sizes="64px" className={p.image.src.endsWith(".png") ? "object-contain p-1.5" : "object-cover mix-blend-multiply"} />
          </span>
          <ArrowUpRight
            className={`size-5 transition-all duration-500 ease-(--ease-expo) max-lg:hidden ${active ? "rotate-45 text-accent-ink opacity-100" : "opacity-30"}`}
            strokeWidth={1.5}
            aria-hidden
          />
        </span>
      </Link>
    </li>
  );
}
