import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LinkCard } from "@/lib/links";

const cols: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

/** Editorial card grid for related products, services and pages. */
export function RelatedLinks({ title, eyebrow, items, tone = "dark" }: { title: string; eyebrow: string; items: LinkCard[]; tone?: "dark" | "light" }) {
  if (!items.length) return null;
  const dark = tone === "dark";
  return (
    <section className={`section-y ${dark ? "bg-abyss" : "bg-plate text-graphite"}`}>
      <div className="shell">
        <p className={`label ${dark ? "text-steel-300" : "text-steel-500"}`}>{eyebrow}</p>
        <h2 className={`heading mt-5 text-[clamp(2rem,4vw,3.5rem)] ${dark ? "text-white" : "text-abyss"}`}>{title}</h2>
        <ul className={`mt-12 grid border-l border-t sm:grid-cols-2 ${cols[Math.max(3, Math.min(items.length, 4))]} ${dark ? "border-white/10" : "border-graphite/12"}`}>
          {items.map((it) => (
            <li key={it.href} className={`border-b border-r ${dark ? "border-white/10" : "border-graphite/12"}`}>
              <Link href={it.href} className={`group relative flex h-full flex-col p-5 transition-colors duration-500 ${dark ? "hover:bg-navy-900" : "hover:bg-white"}`}>
                <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-(--ease-expo) group-hover:scale-x-100" />
                {it.image && (
                  <div className={`relative aspect-[4/3] overflow-hidden ${it.image.fit === "contain" ? "bg-white" : "bg-navy-900"}`}>
                    <Image
                      data-img-role="thumb"
                      src={it.image.src}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      className={`transition-transform duration-[1.2s] ease-(--ease-expo) group-hover:scale-[1.05] ${it.image.fit === "contain" ? "object-contain p-4 mix-blend-multiply" : "object-cover grayscale"}`}
                    />
                  </div>
                )}
                <p className={`label mt-5 ${dark ? "text-steel-500" : "text-steel-500"}`}>{it.kind}</p>
                <p className={`heading mt-2 flex items-start justify-between gap-4 text-[clamp(1.25rem,1.8vw,1.6rem)] ${dark ? "text-white" : "text-abyss"}`}>
                  {it.label}
                  <ArrowUpRight className={`mt-1 size-5 shrink-0 transition-[transform,color] duration-500 group-hover:rotate-45 ${dark ? "group-hover:text-accent" : "group-hover:text-accent-ink"}`} strokeWidth={1.5} aria-hidden />
                </p>
                {it.summary && <p className={`mt-3 line-clamp-3 text-[14px] leading-relaxed ${dark ? "text-fog/65" : "text-graphite/65"}`}>{it.summary}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
