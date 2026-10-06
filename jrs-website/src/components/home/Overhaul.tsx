import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { DrawLine, FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { Eyebrow } from "@/components/ui/primitives";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { overhaulCapabilities } from "@/lib/content";
import { images } from "@/lib/images";

export function Overhaul() {
  return (
    <section aria-labelledby="overhaul-title" className="relative overflow-hidden bg-ink">
      {/* Cinematic plate */}
      <div className="scene grain relative h-[92svh] min-h-[560px]">
        <ParallaxImage src={images.homeOverhaul.src} alt={images.homeOverhaul.alt} amount={10} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
        <div className="shell relative z-10 flex h-full flex-col justify-between pb-16 pt-28">
          <Eyebrow sheet="08 / 16">Engine overhaul</Eyebrow>
          <h2 id="overhaul-title">
            <RevealLines
              className="display block text-[clamp(3.25rem,10vw,11rem)] text-white"
              lines={["When performance", <span key="c" className="accent text-accent">cannot wait.</span>]}
            />
          </h2>
        </div>
      </div>

      <div className="shell section-y pt-[clamp(48px,6vw,96px)]">
        <div className="grid gap-12 lg:grid-cols-12">
          <FadeUp className="lg:col-span-4">
            <p className="text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.4] text-fog">
              Your engine is the heart of your work, whether it&rsquo;s powering a ship across the seas or running vital power systems. If it slows down, your business slows down too.
            </p>
            <p className="mt-6 text-[16px] leading-relaxed text-steel-300">
              Our engine overhaul service in Abu Dhabi focuses on speed, accuracy and reliability. Skilled engineers and technicians deliver comprehensive overhauls with a focus on safety, precision and global responsiveness.
            </p>
            <div className="mt-10">
              <MagneticButton href="/engine-overhaul-service-in-abu-dhabi/" variant="light">Engine overhaul service</MagneticButton>
            </div>
          </FadeUp>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="label text-steel-500">Overhaul capabilities</p>
            <DrawLine className="mt-5" />
            <ol className="grid sm:grid-cols-2 sm:gap-x-10">
              {overhaulCapabilities.map((c, i) => (
                <li key={c} className="flex gap-5 border-b border-white/10 py-5">
                  <span className="label w-6 shrink-0 pt-1 tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[16px] leading-snug text-fog/90">{c}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
