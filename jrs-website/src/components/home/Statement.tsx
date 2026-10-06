import { DrawLine, FadeUp, RevealLines } from "@/components/ui/RevealLines";
import { Eyebrow } from "@/components/ui/primitives";

export function Statement() {
  return (
    <section aria-labelledby="statement-title" className="section-y relative bg-abyss">
      <div className="shell">
        <Eyebrow sheet="02 / 16">Brand statement</Eyebrow>
        <DrawLine className="mt-6" />
        <h2 id="statement-title" className="mt-[clamp(48px,8vw,120px)]">
          <RevealLines
            className="display block text-[clamp(3rem,11.5vw,12rem)]"
            stagger={0.12}
            lines={[
              <span key="a" className="text-white">Quality</span>,
              <span key="b" className="block pl-[8vw] text-white">spares<span className="text-accent">.</span></span>,
              <span key="c" className="outline-type tracking-[-0.03em] text-steel-300">Reliable</span>,
              <span key="d" className="outline-type block pl-[16vw] tracking-[-0.03em] text-steel-300">repairs<span className="text-accent [-webkit-text-fill-color:currentColor] [-webkit-text-stroke-width:0]">.</span></span>,
            ]}
          />
        </h2>
        <div className="mt-[clamp(48px,7vw,104px)] grid gap-8 lg:grid-cols-12">
          <FadeUp className="lg:col-span-5 lg:col-start-7">
            <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.35] tracking-[-0.01em] text-fog">
              Built around the machinery that keeps marine and power-generation operations moving, whether it&rsquo;s routine maintenance or an emergency repair.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
