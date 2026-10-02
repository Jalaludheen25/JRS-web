import Image from "next/image";
import type { ReactNode } from "react";
import { Phone } from "lucide-react";
import { RevealLines } from "@/components/ui/RevealLines";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CropMarks } from "@/components/ui/primitives";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { quoteHref, site } from "@/lib/site";
import type { Img } from "@/lib/pages";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs: Crumb[];
  image?: Img;
  /** "scene": full-bleed graded photo (services, industries). "plate": light surface with the product image (products, brands, posts). */
  variant: "scene" | "plate";
  meta?: ReactNode;
  cta?: boolean;
};

export function PageHero({ eyebrow, title, lead, crumbs, image, variant, meta, cta = true }: Props) {
  // Long titles (blog posts) step down in size so they never clip.
  const size =
    title.length > 70 ? "text-[clamp(2.1rem,4.4vw,4.4rem)]" : title.length > 40 ? "text-[clamp(2.5rem,5.6vw,6rem)]" : "text-[clamp(2.9rem,7vw,7.5rem)]";

  if (variant === "scene") {
    return (
      <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-abyss">
        {image && (
          <div className="scene grain absolute inset-0">
            <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/55 to-abyss/30" />
        <div className="shell relative z-10 w-full pb-16 pt-36">
          <Breadcrumbs items={crumbs} />
          <p className="label mt-10 text-steel-300">{eyebrow}</p>
          <h1 className="mt-5">
            {/* max-width in ch must sit on the element that carries the display font size */}
            <RevealLines immediate className={`display block max-w-[18ch] normal-case ${size} text-white`} lines={[title]} />
          </h1>
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            {lead && <p className="max-w-2xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-fog/85 lg:col-span-7">{lead}</p>}
            {cta && <HeroActions className="lg:col-span-4 lg:col-start-9 lg:justify-end" />}
          </div>
          {meta}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-plate pt-[76px] text-graphite">
      {/* Dark band behind the fixed navigation keeps the white logo legible */}
      <div className="absolute inset-x-0 top-0 h-[76px] bg-abyss" />
      <div className="shell grid gap-12 pb-16 pt-14 lg:grid-cols-12 lg:items-center lg:gap-6 lg:pb-24">
        <div className={image ? "lg:col-span-7" : "lg:col-span-10"}>
          <Breadcrumbs items={crumbs} tone="light" />
          <p className="label mt-10 text-marine">{eyebrow}</p>
          <h1 className="mt-5">
            <RevealLines immediate className={`display block normal-case ${size} text-abyss`} lines={[title]} />
          </h1>
          {lead && <p className="mt-8 max-w-2xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-graphite/75">{lead}</p>}
          {meta}
          {cta && <HeroActions light className="mt-10" />}
        </div>
        {image && (
          <div className="relative lg:col-span-5">
            <div className={`relative aspect-[4/3] w-full overflow-hidden ${image.fit === "cover" ? "bg-abyss" : "bg-white"}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload
                sizes="(min-width:1024px) 40vw, 100vw"
                className={image.fit === "cover" ? "object-cover" : "object-contain p-6 mix-blend-multiply"}
              />
            </div>
            <CropMarks className="text-graphite/35" />
          </div>
        )}
      </div>
    </section>
  );
}

function HeroActions({ className, light }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className ?? ""}`}>
      <MagneticButton href={quoteHref}>Request a quote</MagneticButton>
      <a href={site.phone.tel} className={`label inline-flex items-center gap-2 ${light ? "text-graphite/70 hover:text-abyss" : "text-fog/75 hover:text-white"}`}>
        <Phone className="size-3.5" aria-hidden /> {site.phone.display}
      </a>
    </div>
  );
}
