import { ImageReveal } from "@/components/ui/ImageReveal";
import { FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { ArrowLink, CropMarks, Eyebrow, TechnicalSpec } from "@/components/ui/primitives";
import { images } from "@/lib/images";

export function About() {
  return (
    <section aria-labelledby="about-title" className="section-y relative bg-abyss pt-0">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-6">
        <div className="relative lg:col-span-6">
          <div className="relative lg:sticky lg:top-28">
            <ImageReveal
              src={images.homeAbout.src}
              alt={images.homeAbout.alt}
              sizes="(min-width:1024px) 48vw, 100vw"
              className="aspect-[4/5] w-full lg:aspect-[5/6]"
              parallax={10}
            />
            <CropMarks />
            <p className="label mt-4 text-steel-500">Fig. 03 — Marine operations</p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-[12vh]">
          <Eyebrow sheet="03 / 16">About JRS</Eyebrow>
          <h2 id="about-title" className="mt-8">
            <RevealLines
              className="heading block text-[clamp(2.25rem,4.4vw,4.25rem)] text-white"
              lines={["A trusted partner", "for marine and", <span key="p" className="accent text-accent">power generation.</span>]}
            />
          </h2>
          <FadeUp className="mt-10 space-y-6 text-[17px] leading-relaxed text-fog/80">
            <p>
              JRS Mechanical Equipment is based in Abu Dhabi, UAE, and specialises in sourcing and supplying genuine and OEM engine spare parts, with tailored solutions for the critical needs of marine and power-generation clients.
            </p>
            <p>
              Whether it&rsquo;s routine maintenance or emergency repairs, our experienced team makes sure every part and service meets the highest industry standards and keeps your operations running smoothly and efficiently.
            </p>
          </FadeUp>
          <FadeUp delay={0.1} className="mt-12">
            <TechnicalSpec
              rows={[
                ["Based in", "Abu Dhabi, United Arab Emirates"],
                ["Sectors", "Marine · Power generation · Industrial · Offshore"],
                ["Supply", "Genuine and OEM engine spare parts"],
                ["Services", "Engine, turbocharger and fuel-system overhauls"],
                ["Certified", "ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018"],
              ]}
            />
          </FadeUp>
          <ArrowLink href="/about/" className="mt-12 text-white">Discover JRS</ArrowLink>
        </div>
      </div>
    </section>
  );
}
