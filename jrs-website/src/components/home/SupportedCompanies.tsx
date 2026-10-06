import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeUp, RevealItem, RevealLines } from "@/components/ui/RevealLines";
import { Eyebrow } from "@/components/ui/primitives";
import { makeLogos, partsMakes, reconditioningMakes, referenceDisclaimer } from "@/lib/content";
import { quoteHref } from "@/lib/site";

/** Engine makes JRS supplies replacement parts for: the previous site's logo wall, on the light + blue surface. */
export function SupportedCompanies({ sheet = "11 / 15" }: { sheet?: string } = {}) {
  const reconOnly = reconditioningMakes.filter((m) => !partsMakes.includes(m) && m !== "Detroit");
  return (
    <section aria-labelledby="makes-title" className="section-y surface-mist relative overflow-hidden">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow sheet={sheet || undefined} className="text-marine">Supported companies</Eyebrow>
            <h2 id="makes-title" className="mt-8">
              <RevealLines className="display block text-[clamp(2.75rem,7vw,7.5rem)] text-abyss" lines={["Parts for the", <span key="e" className="accent text-heritage">engines you run.</span>]} />
            </h2>
          </div>
          <FadeUp className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[17px] leading-relaxed text-graphite/75">
              Replacement spare parts and reconditioning support for the main marine, industrial and power-generation engine makes.
            </p>
          </FadeUp>
        </div>

        <ul className="mt-[clamp(48px,6vw,88px)] grid grid-cols-2 gap-px border border-heritage/15 bg-heritage/15 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {makeLogos.map((m, i) => {
            const inner = (
              <>
                <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-heritage transition-transform duration-500 ease-(--ease-expo) group-hover:scale-x-100" />
                <span className="label absolute left-4 top-4 tabular-nums text-steel-500">{String(i + 1).padStart(2, "0")}</span>
                {m.href && (
                  <ArrowUpRight className="absolute right-4 top-4 size-4 text-heritage/60 transition-transform duration-500 ease-(--ease-expo) group-hover:rotate-45 group-hover:text-heritage" strokeWidth={1.75} aria-hidden />
                )}
                <Image
                  data-img-role="logo"
                  src={m.src}
                  alt={`${m.name} logo`}
                  width={480}
                  height={240}
                  sizes="(min-width: 1280px) 15vw, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
                  className="w-full max-w-[220px] transition-transform duration-700 ease-(--ease-expo) group-hover:scale-[1.06]"
                />
              </>
            );
            const tile = "group relative flex aspect-[3/2] items-center justify-center bg-white/80 px-4 pt-4 transition-colors duration-500 hover:bg-white";
            return (
              <RevealItem key={m.name} index={i} className="bg-mist">
                {m.href ? (
                  <Link href={m.href} className={tile} aria-label={`${m.name} engine spare parts`}>
                    {inner}
                  </Link>
                ) : (
                  <div className={tile}>{inner}</div>
                )}
              </RevealItem>
            );
          })}
          <RevealItem index={makeLogos.length} className="bg-heritage-deep">
            <Link
              href={quoteHref}
              className="group relative flex aspect-[3/2] h-full flex-col justify-between bg-[linear-gradient(135deg,var(--color-heritage)_0%,var(--color-heritage-deep)_100%)] p-4 text-white sm:p-5"
            >
              <span className="label text-white/70">Other makes</span>
              <span className="flex items-end justify-between gap-3">
                <span className="heading text-[clamp(1.05rem,1.5vw,1.35rem)] leading-tight">Ask about your engine</span>
                <ArrowUpRight className="size-5 shrink-0 text-accent transition-transform duration-500 ease-(--ease-expo) group-hover:rotate-45" strokeWidth={1.75} aria-hidden />
              </span>
            </Link>
          </RevealItem>
        </ul>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <FadeUp className="lg:col-span-7">
            <p className="label text-steel-500">Reconditioning support also covers</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {reconOnly.map((m) => (
                <li key={m} className="rounded-full border border-heritage/20 bg-white/70 px-3.5 py-1.5 text-[13px] text-graphite/80">
                  {m}
                </li>
              ))}
            </ul>
          </FadeUp>
          <p className="text-[12px] leading-relaxed text-graphite/55 lg:col-span-4 lg:col-start-9 lg:self-end">{referenceDisclaimer}</p>
        </div>
      </div>
    </section>
  );
}
