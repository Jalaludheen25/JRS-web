import Image from "next/image";
import { FadeUp, RevealItem, RevealLines } from "@/components/ui/RevealLines";
import { Eyebrow } from "@/components/ui/primitives";
import { certifications } from "@/lib/content";

/** Certification and accreditation badges (previous site / company profile p.8) on the light + blue surface. */
export function Certifications({ sheet = "13 / 15" }: { sheet?: string } = {}) {
  return (
    <section aria-labelledby="certs-title" className="section-y surface-mist relative overflow-hidden">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow sheet={sheet || undefined} className="text-marine">Accredited &amp; certified</Eyebrow>
            <h2 id="certs-title" className="mt-8">
              <RevealLines className="display block text-[clamp(3rem,7.5vw,8rem)] text-abyss" lines={["Certified", <span key="c" className="accent text-heritage">for confidence.</span>]} />
            </h2>
          </div>
          <FadeUp className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[17px] leading-relaxed text-graphite/75">
              Management systems certified to international standards, and recognised under the UAE In-Country Value programme.
            </p>
          </FadeUp>
        </div>

        <ul className="mt-[clamp(48px,6vw,88px)] grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {certifications.map((c, i) => (
            <RevealItem key={c.code} index={i}>
              <div className="group relative flex h-full flex-col bg-white p-4 shadow-[0_1px_0_rgb(30_68_149/0.08),0_22px_44px_-30px_rgb(2_19_67/0.45)] ring-1 ring-heritage/10 transition-[box-shadow,translate] duration-500 ease-(--ease-expo) hover:-translate-y-1 hover:ring-heritage/30 sm:p-6">
                <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-heritage transition-transform duration-500 ease-(--ease-expo) group-hover:scale-x-100" />
                <span className="label tabular-nums text-steel-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-4 flex h-20 items-center justify-center sm:mt-6 sm:h-28">
                  <Image
                    data-img-role="logo"
                    src={c.badge.src}
                    alt={`${c.code === "ICV" ? "In-Country Value (ICV)" : c.code} certification badge`}
                    width={c.badge.width}
                    height={c.badge.height}
                    sizes="(min-width: 1024px) 18vw, 40vw"
                    className="max-h-full w-auto max-w-full object-contain transition-transform duration-700 ease-(--ease-expo) group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-6 block border-t border-heritage/10 pt-4 sm:mt-8 sm:pt-5">
                  <span className="heading block text-[clamp(1.15rem,2vw,1.9rem)] text-abyss">{c.code}</span>
                  <span className="mt-1.5 block text-[13px] leading-snug text-graphite/70 sm:text-[14px]">{c.label}</span>
                </span>
              </div>
            </RevealItem>
          ))}
        </ul>

        <FadeUp className="mt-6 grid gap-8 border-l-[3px] border-heritage bg-white p-[clamp(24px,3vw,44px)] shadow-[0_22px_44px_-30px_rgb(2_19_67/0.45)] ring-1 ring-heritage/10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="label text-marine">Authorized distributor</p>
            <Image
              data-img-role="logo"
              src="/images/certifications/interstate-mcbee.png"
              alt="Interstate-McBee logo"
              width={671}
              height={160}
              sizes="(min-width: 1024px) 22vw, 70vw"
              className="mt-5 h-12 w-auto sm:h-14"
            />
          </div>
          <div className="lg:col-span-8">
            <p className="heading text-[clamp(1.4rem,2.4vw,2.25rem)] text-abyss">Interstate-McBee</p>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-graphite/75">
              JRS is an authorized distributor for Interstate-McBee, which offers engine and fuel-injection replacement parts for Cummins®, Caterpillar® and Detroit Diesel engines for the marine, diesel and natural-gas industries.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
