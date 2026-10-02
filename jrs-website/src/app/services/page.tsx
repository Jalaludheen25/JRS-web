import { PageHero } from "@/components/page/PageHero";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { QuoteBand } from "@/components/page/QuoteBand";
import { overhaulCapabilities } from "@/lib/content";
import { resolveLink, type LinkCard } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Marine Engine Repair & Overhaul Services in Abu Dhabi | JRS",
  description:
    "JRS technical services in Abu Dhabi: engine and turbocharger overhauls, fuel pump and injector service, governors, electrical & instrumentation, reconditioning and more.",
  path: "/services/",
});

const groups: { title: string; eyebrow: string; keys: string[] }[] = [
  {
    eyebrow: "Overhaul & repair",
    title: "Engine and turbocharger overhauls",
    keys: ["engine-overhaul-service-in-abu-dhabi", "turbocharger-overhauls-in-abu-dhabi", "services/reconditioning-engine-parts", "outboard-engine-repair-overhaul-in-abu-dhabi"],
  },
  {
    eyebrow: "Fuel systems",
    title: "Fuel pumps, injectors and governors",
    keys: ["services/fuel-pump-overhaul", "services/marine-fuel-pump-injector-service", "lorange-injectors-and-pumps-repair", "services/governors"],
  },
  {
    eyebrow: "Electrical",
    title: "Electrical and instrumentation",
    keys: ["services/electrical-instrumentation", "services/starter-motor-alternator-service"],
  },
  {
    eyebrow: "Maintenance",
    title: "Maintenance and optimisation",
    keys: ["routine-maintenance-diagnostics-in-abu-dhabi", "boats-maintenance-and-services", "ultrasonic-cleaning-for-parts-in-abu-dhabi", "performance-tuning-optimization"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        variant="scene"
        eyebrow="Technical services — Abu Dhabi, UAE"
        title="Repair. Recondition. Return to service."
        lead="Comprehensive engine overhaul and technical services for marine and power-generation machinery, with a focus on safety, precision and global responsiveness."
        crumbs={[{ name: "Services", path: "/services/" }]}
        image={{ src: "/images/scenes/turbine-rotor-machining.jpg", alt: "Turbine rotor on a machining and balancing rig", fit: "cover" }}
      />

      {groups.map((g, i) => (
        <RelatedLinks key={g.title} eyebrow={g.eyebrow} title={g.title} items={g.keys.map(resolveLink).filter(Boolean) as LinkCard[]} tone={i % 2 ? "dark" : "light"} />
      ))}

      <section aria-labelledby="caps-title" className="section-y bg-abyss">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-steel-300">Engine overhaul capabilities</p>
            <h2 id="caps-title" className="heading mt-5 text-[clamp(2rem,3.6vw,3.25rem)] text-white">
              From cylinder heads to laser alignment
            </h2>
          </div>
          <ol className="grid sm:grid-cols-2 sm:gap-x-10 lg:col-span-7 lg:col-start-6">
            {overhaulCapabilities.map((c, i) => (
              <li key={c} className="flex gap-5 border-b border-white/10 py-5">
                <span className="label w-6 shrink-0 pt-1 tabular-nums text-marine-bright">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[16px] leading-snug text-fog/90">{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <QuoteBand subject="an overhaul or repair" />
    </>
  );
}
