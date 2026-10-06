import { ArrowUpRight, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { FadeUp } from "@/components/ui/RevealLines";
import { maps, site } from "@/lib/site";

/**
 * Footer location card (every page): the JRS Google Maps listing beside the address and directions. Sits on the
 * light + blue band at the top of the footer and floats across the edge into the navy footer below.
 */
export function FooterMap() {
  const a = site.address;
  return (
    <FadeUp className="relative z-10">
      <div className="rounded-[28px] border border-heritage/15 bg-white p-2 shadow-[0_50px_90px_-50px_rgb(2_19_67/0.7),0_18px_40px_-28px_rgb(2_19_67/0.35)] sm:p-2.5">
        <div className="isolate grid overflow-hidden rounded-[22px] lg:grid-cols-12">
          {/* Map */}
          <div className="relative min-h-[300px] bg-mist-deep sm:min-h-[380px] lg:col-span-7 lg:min-h-[430px]">
            <iframe
              src={maps.embed}
              title={`Map: ${site.name}, ${a.building}, ${a.street}, ${a.city}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.9)_contrast(1.02)]"
            />
            <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/95 py-1.5 pl-2.5 pr-3.5 shadow-[0_8px_20px_-10px_rgb(2_19_67/0.6)] ring-1 ring-heritage/15 sm:bottom-4 sm:left-4">
              <span aria-hidden className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-heritage/50 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2.5 rounded-full bg-heritage" />
              </span>
              <span className="label tabular-nums text-heritage">{site.geo.label}</span>
            </span>
          </div>

          {/* Address and directions */}
          <div className="relative flex flex-col justify-between gap-8 overflow-hidden bg-[linear-gradient(160deg,#f8fafd_0%,#e9eff8_100%)] p-6 sm:p-8 lg:col-span-5 lg:p-10">
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,var(--color-heritage),var(--color-marine)_55%,transparent)]" />
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(30_68_149/0.16),transparent)]" />

            <div className="relative">
              <p className="label flex items-center gap-3 text-marine">
                <span aria-hidden className="h-[2px] w-8 bg-accent" />
                Visit us
              </p>
              <h2 className="heading mt-5 text-[clamp(1.9rem,3.2vw,3rem)] leading-[1.02] text-abyss">
                Find us in <span className="accent text-heritage">Abu Dhabi.</span>
              </h2>

              <address className="mt-7 flex gap-4 not-italic">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-heritage/10 text-heritage ring-1 ring-heritage/15">
                  <MapPin className="size-5" strokeWidth={1.6} aria-hidden />
                </span>
                <span className="text-[15px] leading-relaxed text-graphite/85">
                  <span className="block font-medium text-abyss">{site.name}</span>
                  {a.building}, {a.floor}, {a.office}
                  <br />
                  {a.street}, {a.city}, UAE
                </span>
              </address>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <li>
                  <a href={site.phone.tel} className="group flex items-center gap-3 rounded-xl bg-white/70 p-3 ring-1 ring-heritage/10 transition-colors hover:bg-white hover:ring-heritage/30">
                    <Phone className="size-4 text-heritage" strokeWidth={1.75} aria-hidden />
                    <span className="text-[14px] tabular-nums text-abyss">{site.phone.display}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="group flex items-center gap-3 rounded-xl bg-white/70 p-3 ring-1 ring-heritage/10 transition-colors hover:bg-white hover:ring-heritage/30">
                    <Mail className="size-4 text-heritage" strokeWidth={1.75} aria-hidden />
                    <span className="text-[14px] text-abyss">{site.email}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="relative flex flex-wrap gap-3">
              <a
                href={maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,var(--color-heritage)_0%,var(--color-heritage-deep)_100%)] px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_14px_28px_-14px_rgb(30_68_149/0.9)] transition-[filter,translate] duration-300 hover:-translate-y-0.5 hover:brightness-125 sm:flex-none"
              >
                <Navigation className="size-4" strokeWidth={1.75} aria-hidden />
                Get directions
              </a>
              <a
                href={maps.open}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-heritage/25 bg-white/80 px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-heritage transition-colors duration-300 hover:border-heritage hover:bg-white sm:flex-none"
              >
                Open in Maps
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-(--ease-expo) group-hover:rotate-45" strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}
