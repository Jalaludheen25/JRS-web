import { FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { Eyebrow } from "@/components/ui/primitives";
import { certifications } from "@/lib/content";

export function Certifications() {
  return (
    <section aria-labelledby="certs-title" className="section-y relative bg-abyss">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow sheet="12 / 14">Accredited &amp; certified</Eyebrow>
            <h2 id="certs-title" className="mt-8">
              <RevealLines className="display block text-[clamp(3rem,7.5vw,8rem)] text-white" lines={["Certified", <span key="c" className="accent text-steel-300">for confidence.</span>]} />
            </h2>
          </div>
          <FadeUp className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[17px] leading-relaxed text-fog/75">
              Management systems certified to international standards, and recognised under the UAE In-Country Value programme.
            </p>
          </FadeUp>
        </div>

        <ul className="mt-[clamp(48px,6vw,96px)] grid border-t border-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((c, i) => (
            <li key={c.code} className="group relative border-b border-white/12 py-10 sm:odd:border-r lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 sm:px-6 sm:first:pl-0">
              <span className="label text-steel-500">{String(i + 1).padStart(2, "0")}</span>
              {/* Minimal seal: concentric rings drawn in hairline */}
              <svg aria-hidden viewBox="0 0 80 80" className="mt-8 size-16 text-white/35 transition-colors duration-700 group-hover:text-signal">
                <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="0.75" />
                <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 3" />
                <path d="M28 41l8 8 16-18" fill="none" stroke="currentColor" strokeWidth="1.25" />
              </svg>
              <p className="heading mt-8 text-[clamp(1.75rem,2.4vw,2.5rem)] text-white">{c.code}</p>
              <p className="mt-2 text-[15px] text-steel-300">{c.label}</p>
            </li>
          ))}
        </ul>

        <FadeUp className="mt-16 grid gap-8 border border-white/12 p-[clamp(24px,3vw,48px)] lg:grid-cols-12 lg:items-center">
          <p className="label text-signal lg:col-span-3">Authorized distributor</p>
          <div className="lg:col-span-9">
            <p className="heading text-[clamp(1.5rem,2.6vw,2.5rem)] text-white">Interstate-McBee</p>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-steel-300">
              JRS is an authorized distributor for Interstate-McBee, which offers engine and fuel-injection replacement parts for Cummins®, Caterpillar® and Detroit Diesel engines for the marine, diesel and natural-gas industries.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
