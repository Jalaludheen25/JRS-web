import { MessageCircle, Phone } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { site } from "@/lib/site";

/** Closing call-to-action used on every inner page, with the quote form prefilled where possible. */
export function QuoteBand({ subject, defaultTopic }: { subject: string; defaultTopic?: string }) {
  return (
    <section id="quote" aria-labelledby="quote-band-title" className="section-y relative overflow-hidden bg-navy-900">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:96px_96px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_85%_20%,rgb(33_71_160/0.35),transparent_70%)]" />
      <div className="shell relative grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label text-white/75">Request a quote</p>
          <h2 id="quote-band-title" className="display mt-6 text-[clamp(2.5rem,5.4vw,5.5rem)] text-white">
            Let&rsquo;s keep
            <br />
            <span className="accent text-accent">you moving.</span>
          </h2>
          <p className="mt-8 max-w-md text-[16px] leading-relaxed text-white/85">
            Need {subject}? Send the engine make, model and part numbers, and JRS will confirm availability and specifications.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={site.phone.tel} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-5 text-[13px] font-medium uppercase tracking-[0.06em] text-white transition-colors hover:border-accent hover:text-accent">
              <Phone className="size-4" aria-hidden /> {site.phone.display}
            </a>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-5 text-[13px] font-medium uppercase tracking-[0.06em] text-white transition-colors hover:border-accent hover:text-accent">
              <MessageCircle className="size-4" aria-hidden /> WhatsApp
            </a>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="border border-white/15 border-t-2 border-t-accent bg-abyss/40 p-[clamp(20px,3vw,44px)]">
            <QuoteForm tone="blue" defaultTopic={defaultTopic} />
          </div>
        </div>
      </div>
    </section>
  );
}
