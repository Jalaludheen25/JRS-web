import { ContactCTA } from "@/components/home/ContactCTA";
import { Eyebrow, JsonLd } from "@/components/ui/primitives";
import { RevealLines } from "@/components/ui/RevealLines";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us - JRS",
  description:
    "Contact JRS Mechanical Equipment in Abu Dhabi for marine and power-generation spare parts, overhauls and technical services. Call or WhatsApp +971 55 770 4485.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <section className="shell pb-16 pt-40">
        <Eyebrow>Abu Dhabi, UAE</Eyebrow>
        <h1 className="mt-8">
          <RevealLines immediate className="display block text-[clamp(3.5rem,11vw,11rem)] text-white" lines={["Contact us"]} />
        </h1>
      </section>
      <ContactCTA />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact/" }])} />
    </>
  );
}
