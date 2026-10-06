import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Location } from "@/components/home/Location";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { Eyebrow } from "@/components/ui/primitives";
import { RevealLines } from "@/components/ui/RevealLines";
import { maps, site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us - JRS",
  description:
    "Contact JRS Mechanical Equipment in Abu Dhabi for marine and power-generation spare parts, overhauls and technical services. Call or WhatsApp +971 55 770 4485.",
  path: "/contact/",
});

const checklist = [
  "Engine make and model (and the vessel or generator it serves)",
  "Part numbers, or a description and photo of the part",
  "Quantity required",
  "Delivery location: Abu Dhabi, elsewhere in the UAE, or a GCC port",
  "For overhauls and repairs: the equipment, its symptoms and where it is located",
];

export default function ContactPage() {
  const details = [
    { icon: Phone, label: "Call us", value: site.phone.display, href: site.phone.tel },
    { icon: MessageCircle, label: "WhatsApp", value: site.phone.display, href: site.whatsapp, external: true },
    { icon: Mail, label: "Email address", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: "Visit us", value: `${site.address.building}, ${site.address.floor}, ${site.address.office}, ${site.address.street}, Abu Dhabi, UAE`, href: maps.open, external: true },
  ];

  return (
    <>
      <section className="shell pb-16 pt-36">
        <Breadcrumbs items={[{ name: "Contact Us", path: "/contact/" }]} />
        <div className="mt-10">
          <Eyebrow>Abu Dhabi, UAE</Eyebrow>
        </div>
        <h1 className="mt-8">
          <RevealLines immediate className="display block text-[clamp(3.5rem,11vw,11rem)] text-white" lines={["Contact us"]} />
        </h1>
        <p className="mt-8 max-w-2xl text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-fog/85">
          We&rsquo;re here to help. Whether you&rsquo;re looking for high-quality spare parts or reliable repair solutions, JRS is ready to support you.
        </p>

        <ul className="mt-16 grid border-l border-t border-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {details.map(({ icon: Icon, label, value, href, external }) => (
            <li key={label} className="border-b border-r border-white/12">
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col gap-6 p-6 transition-colors hover:bg-white/[0.04]"
              >
                <Icon className="size-5 text-accent" strokeWidth={1.5} aria-hidden />
                <span>
                  <span className="label block text-steel-500">{label}</span>
                  <span className="mt-2 block text-[16px] leading-snug text-white">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="checklist-title" className="section-y bg-plate text-graphite">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-accent-ink">Faster quotations</p>
            <h2 id="checklist-title" className="heading mt-4 text-[clamp(1.75rem,3vw,2.75rem)] text-abyss">
              What to include in your request
            </h2>
            <p className="mt-6 text-[16px] leading-relaxed text-graphite/75">
              The more detail you share, the faster our team can confirm availability and specifications.
            </p>
          </div>
          <ol className="border-t border-graphite/14 lg:col-span-7 lg:col-start-6">
            {checklist.map((c, i) => (
              <li key={c} className="flex gap-5 border-b border-graphite/14 py-5">
                <span className="label w-6 shrink-0 pt-1 tabular-nums text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[17px] leading-snug text-abyss">{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContactCTA sheet="" />
      <Location sheet="" />
    </>
  );
}
