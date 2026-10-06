import { MessageCircle, Phone, Mail } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { RevealLines } from "@/components/ui/RevealLines";
import { Eyebrow } from "@/components/ui/primitives";
import { site } from "@/lib/site";

export function ContactCTA({ sheet = "15 / 16" }: { sheet?: string } = {}) {
  const actions = [
    { href: site.phone.tel, label: "Call JRS", value: site.phone.display, icon: Phone, external: false },
    { href: site.whatsapp, label: "WhatsApp JRS", value: "Message us on WhatsApp", icon: MessageCircle, external: true },
    { href: `mailto:${site.email}`, label: "Email", value: site.email, icon: Mail, external: false },
  ];

  return (
    <section id="quote" aria-labelledby="contact-title" className="section-y relative overflow-hidden bg-heritage-deep">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:96px_96px]" />
      {/* Heritage band: the previous site's royal blue rising out of its deep navy. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_90%_at_88%_0%,rgb(30_68_149/0.75),transparent_70%)]" />
      <div className="shell relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Eyebrow sheet={sheet || undefined} className="text-white/75">Request a quote</Eyebrow>
          <h2 id="contact-title" className="mt-8">
            <RevealLines className="display block text-[clamp(3rem,7.2vw,7.75rem)] text-white" lines={["Let’s keep", "your operations", <span key="m" className="accent text-accent">moving.</span>]} />
          </h2>

          <ul className="mt-14 border-t border-white/25">
            {actions.map(({ href, label, value, icon: Icon, external }) => (
              <li key={label} className="border-b border-white/25">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center justify-between gap-6 py-5"
                >
                  <span className="flex items-center gap-4">
                    <Icon className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
                    <span className="label text-white/75">{label}</span>
                  </span>
                  <span className="heading text-right text-[clamp(1.1rem,2vw,1.75rem)] text-white transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-x-2">{value}</span>
                </a>
              </li>
            ))}
          </ul>

          <address className="mt-10 text-[15px] not-italic leading-relaxed text-white/80">
            {site.address.building}, {site.address.floor}, {site.address.office}, {site.address.street}, Abu Dhabi, UAE
          </address>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="border border-white/15 border-t-2 border-t-accent bg-abyss/40 p-[clamp(20px,3vw,44px)] backdrop-blur-sm">
            <p className="label text-white/75">Quotation request</p>
            <p className="mt-3 text-[15px] text-white/80">Send part numbers or a description, and the JRS team will confirm availability and specifications.</p>
            <div className="mt-8">
              <QuoteForm tone="blue" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
