import { ArrowUpRight, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { CropMarks, Eyebrow } from "@/components/ui/primitives";
import { maps, site } from "@/lib/site";

/** Office location: address, contact lines and the Google Maps listing the previous site embedded. */
export function Location({ sheet = "16 / 16" }: { sheet?: string } = {}) {
  const a = site.address;
  return (
    <section aria-labelledby="location-title" className="section-y surface-mist relative overflow-hidden">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col lg:col-span-5">
          <Eyebrow sheet={sheet || undefined} className="text-marine">Location</Eyebrow>
          <h2 id="location-title" className="mt-8">
            <RevealLines className="display block text-[clamp(2.75rem,6.5vw,6.5rem)] text-abyss" lines={["Find us in", <span key="a" className="accent text-heritage">Abu Dhabi.</span>]} />
          </h2>

          <FadeUp className="mt-10 lg:mt-auto lg:pt-14">
            <address className="not-italic">
              <p className="flex gap-4">
                <MapPin className="mt-1 size-5 shrink-0 text-heritage" strokeWidth={1.5} aria-hidden />
                <span className="text-[17px] leading-relaxed text-abyss">
                  <span className="font-medium">{site.name}</span>
                  <br />
                  {a.building}, {a.floor}, {a.office}
                  <br />
                  {a.street}, {a.city}, {a.country}
                </span>
              </p>
              <ul className="mt-6 grid gap-px border border-heritage/15 bg-heritage/15 sm:grid-cols-2">
                <li className="bg-white/80">
                  <a href={site.phone.tel} className="group flex items-center gap-3 p-4 transition-colors hover:bg-white">
                    <Phone className="size-4 text-heritage" strokeWidth={1.75} aria-hidden />
                    <span>
                      <span className="label block text-steel-500">Call</span>
                      <span className="mt-1 block text-[15px] tabular-nums text-abyss">{site.phone.display}</span>
                    </span>
                  </a>
                </li>
                <li className="bg-white/80">
                  <a href={`mailto:${site.email}`} className="group flex items-center gap-3 p-4 transition-colors hover:bg-white">
                    <Mail className="size-4 text-heritage" strokeWidth={1.75} aria-hidden />
                    <span>
                      <span className="label block text-steel-500">Email</span>
                      <span className="mt-1 block text-[15px] text-abyss">{site.email}</span>
                    </span>
                  </a>
                </li>
              </ul>
            </address>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-heritage px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-heritage-deep"
              >
                <Navigation className="size-4" strokeWidth={1.75} aria-hidden />
                Get directions
              </a>
              <a
                href={maps.open}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-heritage/30 bg-white/70 px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-heritage transition-colors duration-300 hover:border-heritage hover:bg-white"
              >
                Open in Google Maps
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-(--ease-expo) group-hover:rotate-45" strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </FadeUp>
        </div>

        <FadeUp className="lg:col-span-7">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-mist-deep shadow-[0_30px_60px_-36px_rgb(2_19_67/0.55)] ring-1 ring-heritage/15 sm:aspect-[4/3] lg:aspect-[16/12]">
              <iframe
                src={maps.embed}
                title={`Map: ${site.name}, ${a.building}, ${a.street}, ${a.city}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.85)_contrast(1.03)]"
              />
            </div>
            <CropMarks className="text-heritage/50" />
            <p className="label mt-4 flex items-center justify-between gap-4 tabular-nums text-steel-500">
              <span>{site.geo.label}</span>
              <span>{a.city}, UAE</span>
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
