import { Hero } from "@/components/home/Hero";
import { Statement } from "@/components/home/Statement";
import { About } from "@/components/home/About";
import { Capabilities } from "@/components/home/Capabilities";
import { Products } from "@/components/home/Products";
import { BearingsFeature } from "@/components/home/BearingsFeature";
import { Turbochargers } from "@/components/home/Turbochargers";
import { Overhaul } from "@/components/home/Overhaul";
import { Services } from "@/components/home/Services";
import { Industries } from "@/components/home/Industries";
import { SupportedCompanies } from "@/components/home/SupportedCompanies";
import { ReplacementParts } from "@/components/home/ReplacementParts";
import { Certifications } from "@/components/home/Certifications";
import { MissionVision } from "@/components/home/MissionVision";
import { ContactCTA } from "@/components/home/ContactCTA";
import { pageMetadata } from "@/lib/seo";

// Title and description kept from the live page: the homepage ranks #1 for "marine engine bearings abu dhabi"
// and #3 for "turbocharger overhauls in abu dhabi" (SEO report, Aug 2026).
export const metadata = pageMetadata({
  title: "Best Spare Parts and Marine Equipment Supplier in Abu Dhabi",
  description:
    "Best spare parts and marine equipment supplier in Abu Dhabi offering top-quality marine spare parts, components, and technical support.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <About />
      <Capabilities />
      <Products />
      <BearingsFeature />
      <Turbochargers />
      <Overhaul />
      <Services />
      <Industries />
      <SupportedCompanies />
      <ReplacementParts />
      <Certifications />
      <MissionVision />
      <ContactCTA />
    </>
  );
}
