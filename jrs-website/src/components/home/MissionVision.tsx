import { DrawLine, FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { Eyebrow } from "@/components/ui/primitives";
import { mission, missionSupport, vision, visionSupport } from "@/lib/content";

export function MissionVision({ sheet = "14 / 15" }: { sheet?: string } = {}) {
  return (
    <section aria-labelledby="purpose-title" className="section-y relative bg-abyss pt-0">
      <div className="shell">
        <Eyebrow sheet={sheet || undefined}>Purpose</Eyebrow>
        <h2 id="purpose-title" className="sr-only">Mission and vision</h2>
        <DrawLine className="mt-6" />

        <div className="mt-[clamp(48px,7vw,112px)] grid gap-16 lg:grid-cols-12 lg:gap-6">
          <article className="lg:col-span-6">
            <p className="accent text-[clamp(1.5rem,2.4vw,2.25rem)] text-accent">Our mission</p>
            <RevealLines
              className="mt-6 block text-[clamp(1.75rem,3.1vw,3rem)] font-medium leading-[1.12] tracking-[-0.03em] text-white"
              lines={[mission]}
            />
            <FadeUp className="mt-8 max-w-lg">
              <p className="text-[16px] leading-relaxed text-steel-300">{missionSupport}</p>
            </FadeUp>
          </article>

          <article className="lg:col-span-5 lg:col-start-8 lg:pt-[18vh]">
            <p className="accent text-[clamp(1.5rem,2.4vw,2.25rem)] text-accent">Our vision</p>
            <RevealLines
              className="mt-6 block text-[clamp(1.75rem,3.1vw,3rem)] font-medium leading-[1.12] tracking-[-0.03em] text-white"
              lines={[vision]}
            />
            <FadeUp className="mt-8 max-w-lg">
              <p className="text-[16px] leading-relaxed text-steel-300">{visionSupport}</p>
            </FadeUp>
          </article>
        </div>
      </div>
    </section>
  );
}
