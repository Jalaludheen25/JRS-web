// Registry of every root-level legacy URL served by app/[slug]. Titles and descriptions are kept from
// the live site (docs/01-audit-and-seo-migration.md §5); only typos are corrected and missing
// descriptions are written from the page's own copy.
import legacy from "@/content/legacy-pages.json";
import type { Block } from "@/lib/blocks";
import { authored } from "@/content/authored";

export type PageKind = "product" | "service" | "industry" | "brand" | "post";
export type PostCategory = "cummins" | "fuel-injection" | "marine-engine-spare-parts";

export type Img = { src: string; alt: string; fit?: "cover" | "contain" };

export type PageEntry = {
  slug: string;
  kind: PageKind;
  title: string;
  description: string;
  /** Short label for cards, breadcrumbs and menus. */
  label: string;
  image?: Img;
  category?: PostCategory;
  /** Related product / service slugs (keys of this registry or `/services/` paths). */
  related?: string[];
};

export type LegacyContent = { h1: string; lead?: string; date?: string; featured?: { src: string; alt: string; width: number; height: number }; blocks: Block[] };

const P = (src: string, alt: string): Img => ({ src, alt, fit: "contain" });
const S = (src: string, alt: string): Img => ({ src, alt, fit: "cover" });

export const pages: PageEntry[] = [
  // ── Products ───────────────────────────────────────────────────────────────
  {
    slug: "engine-bearings-in-abu-dhabi",
    kind: "product",
    label: "Engine Bearings",
    title: "Engine Bearings in Abu Dhabi - JRS",
    description: "Marine engine bearings in Abu Dhabi from JRS: main, thrust and connecting rod bearings built to OEM specifications for load capacity and reliable performance.",
    image: P("/images/products/engine-bearings.jpg", "Main, thrust and connecting rod engine bearing shells"),
    related: ["pistons-piston-rings-in-abu-dhabi", "liners-anti-polishing-rings-in-abu-dhabi", "engine-overhaul-service-in-abu-dhabi"],
  },
  {
    slug: "cylinder-heads-components-in-abu-dhabi",
    kind: "product",
    label: "Cylinder Heads & Components",
    title: "Cylinder Heads & Components in Abu Dhabi - JRS",
    description: "Cylinder head components in Abu Dhabi for 2-stroke and 4-stroke marine engines: valve stems, valve seats, valve rotators, springs, guides, collets and gaskets.",
    image: P("/images/products/cylinder-heads-components.jpg", "Cylinder head components: valves, valve springs and seats"),
    related: ["pistons-piston-rings-in-abu-dhabi", "services/reconditioning-engine-parts", "engine-overhaul-service-in-abu-dhabi"],
  },
  {
    slug: "fuel-injection-systems-components-in-abu-dhabi",
    kind: "product",
    label: "Fuel Injection Systems",
    title: "Fuel Injection Systems & Components in Abu Dhabi - JRS",
    description: "Fuel injection systems and components in Abu Dhabi: injectors, pumps, nozzles and complete assemblies for marine diesel engines, sourced from trusted OEMs.",
    image: P("/images/products/fuel-injection-systems.jpg", "Fuel injection pump elements and injector nozzles"),
    related: ["fuel-injector-spare-parts-and-repair-in-abu-dhabi", "services/fuel-pump-overhaul", "services/marine-fuel-pump-injector-service"],
  },
  {
    slug: "pistons-piston-rings-in-abu-dhabi",
    kind: "product",
    label: "Pistons & Piston Rings",
    title: "Pistons & Piston Rings for Marine Engines in Abu Dhabi",
    description: "High-quality pistons and piston rings in Abu Dhabi for all marine engines durable, efficient, and sourced from trusted manufacturers.",
    image: P("/images/products/pistons-piston-rings.jpg", "Marine engine pistons with piston rings"),
    related: ["liners-anti-polishing-rings-in-abu-dhabi", "engine-bearings-in-abu-dhabi", "engine-overhaul-service-in-abu-dhabi"],
  },
  {
    slug: "liners-anti-polishing-rings-in-abu-dhabi",
    kind: "product",
    label: "Liners & Anti-Polishing Rings",
    title: "Cylinder Liners and Anti-Polishing Rings for Diesel & Gas Engines",
    description: "High-performance cylinder liners and anti-polishing rings for diesel and gas engines in marine and power generation applications.",
    image: P("/images/products/liners-anti-polishing-rings.jpg", "Centrifugally cast cylinder liners"),
    related: ["pistons-piston-rings-in-abu-dhabi", "engine-bearings-in-abu-dhabi", "engine-overhaul-service-in-abu-dhabi"],
  },
  {
    slug: "filters",
    kind: "product",
    label: "Filters",
    title: "Marine Filters in Abu Dhabi | Oil, Fuel and Air Filters",
    description: "JRS supplies high-quality marine filters in Abu Dhabi, including oil, fuel, air filters and water separators for reliable engine protection.",
    image: P("/images/products/marine-filters.jpg", "Marine oil, fuel and air filter elements"),
    related: ["fuel-injection-systems-components-in-abu-dhabi", "routine-maintenance-diagnostics-in-abu-dhabi", "coolers-heat-exchangers-in-abu-dhabi"],
  },
  {
    slug: "turbochargers-cartridges-in-abu-dhabi",
    kind: "product",
    label: "Turbochargers & Cartridges",
    title: "Marine Turbochargers and Cartridges in Abu Dhabi",
    description: "JRS supplies high-quality marine turbochargers & cartridges in Abu Dhabi, including casings, rotors, nozzle rings, seals & bearing assemblies",
    image: P("/images/products/turbocharger-cartridge.jpg", "Turbocharger cartridge with turbine wheel"),
    related: ["turbocharger-overhauls-in-abu-dhabi", "coolers-heat-exchangers-in-abu-dhabi", "services/reconditioning-engine-parts"],
  },
  {
    slug: "coolers-heat-exchangers-in-abu-dhabi",
    kind: "product",
    label: "Coolers & Heat Exchangers",
    title: "Coolers & Heat Exchangers in Abu Dhabi",
    description: "High-quality marine coolers and heat exchangers in Abu Dhabi by ensuring efficient thermal management & reliable engine performance at sea.",
    image: P("/images/products/coolers-heat-exchangers.jpg", "Shell-and-tube and plate heat exchangers"),
    related: ["engine-overhaul-service-in-abu-dhabi", "filters", "turbochargers-cartridges-in-abu-dhabi"],
  },
  {
    slug: "automatic-voltage-regulator-supplier-in-uae",
    kind: "product",
    label: "Automatic Voltage Regulators",
    title: "Automatic Voltage Regulator (AVR) Supplier in UAE",
    description: "Automatic Voltage Regulator Supplier in UAE offering reliable AVR solutions for stable voltage control & safe electrical system performance",
    image: S("/images/scenes/electrical-wiring-graded.jpg", "Generator electrical systems and wiring"),
    related: ["genset-controllers-amf-in-abu-dhabi", "services/electrical-instrumentation", "power-generation"],
  },
  {
    slug: "genset-controllers-amf-in-abu-dhabi",
    kind: "product",
    label: "Genset Controllers & AMF",
    title: "Genset Controllers & Automatic Mains Failure (AMF) in Abu Dhabi",
    description: "Generator control units from JRS in Abu Dhabi: OEM, universal and aftermarket genset controllers, and AMF modules for genset control, protection and ATS control.",
    image: S("/images/scenes/diesel-engine-detail-graded.jpg", "Generator engine served by genset control units"),
    related: ["automatic-voltage-regulator-supplier-in-uae", "services/electrical-instrumentation", "power-generation"],
  },

  // ── Services ───────────────────────────────────────────────────────────────
  {
    slug: "engine-overhaul-service-in-abu-dhabi",
    kind: "service",
    label: "Engine Overhaul",
    title: "Best Marine Engine Overhaul Service in Abu Dhabi",
    description: "Expert engine overhaul service in Abu Dhabi for marine and power systems. JRS restores engines with precision, speed & trusted reliability.",
    image: S("/images/scenes/diesel-engine-detail-graded.jpg", "Diesel engine front end during overhaul"),
    related: ["engine-bearings-in-abu-dhabi", "pistons-piston-rings-in-abu-dhabi", "turbocharger-overhauls-in-abu-dhabi"],
  },
  {
    slug: "turbocharger-overhauls-in-abu-dhabi",
    kind: "service",
    label: "Turbocharger Overhaul",
    title: "Turbocharger Overhauls in Abu Dhabi",
    description: "Expert Turbocharger overhauls in Abu Dhabi for marine and generator engines. Restore performance, cut downtime, and boost efficiency with JRS",
    image: S("/images/scenes/turbine-rotor-machining.jpg", "Turbine rotor mounted for balancing and machining"),
    related: ["turbochargers-cartridges-in-abu-dhabi", "services/reconditioning-engine-parts", "engine-overhaul-service-in-abu-dhabi"],
  },
  {
    slug: "outboard-engine-repair-overhaul-in-abu-dhabi",
    kind: "service",
    label: "Outboard Engine Repair",
    title: "Outboard Engine Repair and Overhaul in Abu Dhabi",
    description: "Expert outboard engine repair & overhaul in Abu Dhabi by JRS. We service Yamaha, Suzuki, Mercury & more for reliable marine performance.",
    image: S("/images/scenes/port-vessel-aerial-graded.jpg", "Vessels moving through a busy port"),
    related: ["boats-maintenance-and-services", "routine-maintenance-diagnostics-in-abu-dhabi", "performance-tuning-optimization"],
  },
  {
    slug: "routine-maintenance-diagnostics-in-abu-dhabi",
    kind: "service",
    label: "Routine Maintenance & Diagnostics",
    title: "Routine Maintenance & Diagnostics in Abu Dhabi",
    description: "Trust JRS for Routine Maintenance & Diagnostics in Abu Dhabi. Expert marine engine care, performance checks & prevention of costly breakdowns",
    image: S("/images/scenes/diesel-engine-detail-graded.jpg", "Marine diesel engine ready for inspection"),
    related: ["filters", "performance-tuning-optimization", "engine-overhaul-service-in-abu-dhabi"],
  },
  {
    slug: "boats-maintenance-and-services",
    kind: "service",
    label: "Boats Maintenance",
    title: "Boats Maintenance and Services in Abu Dhabi",
    description: "Expert boats maintenance and services in Abu Dhabi by JRS. Keep your vessel safe, efficient, and ready for smooth sailing all year round.",
    image: S("/images/scenes/vessel-aerial-2-graded.jpg", "Vessel alongside in port"),
    related: ["outboard-engine-repair-overhaul-in-abu-dhabi", "routine-maintenance-diagnostics-in-abu-dhabi", "marine-products-and-services"],
  },
  {
    slug: "ultrasonic-cleaning-for-parts-in-abu-dhabi",
    kind: "service",
    label: "Ultrasonic Cleaning",
    title: "Ultrasonic Cleaning for Parts in Abu Dhabi - JRS",
    description: "Ultrasonic cleaning for marine engine parts in Abu Dhabi: injectors, filters, heat exchangers and precision components cleaned thoroughly without damage.",
    image: S("/images/scenes/engine-parts-dark-graded.jpg", "Precision engine components"),
    related: ["services/fuel-pump-overhaul", "fuel-injection-systems-components-in-abu-dhabi", "routine-maintenance-diagnostics-in-abu-dhabi"],
  },
  {
    slug: "performance-tuning-optimization",
    kind: "service",
    label: "Performance Tuning",
    title: "Marine Engine Performance Tuning & Optimization in Abu Dhabi",
    description: "Enhance marine engine power and efficiency with our Performance Tuning & Optimization in Abu Dhabi, precision tuning for lasting performance.",
    image: S("/images/scenes/turbine-rotor-machining.jpg", "Precision-machined rotating equipment"),
    related: ["routine-maintenance-diagnostics-in-abu-dhabi", "fuel-injection-systems-components-in-abu-dhabi", "turbocharger-overhauls-in-abu-dhabi"],
  },

  // ── Industries ─────────────────────────────────────────────────────────────
  {
    slug: "marine-products-and-services",
    kind: "industry",
    label: "Marine",
    title: "Top Quality Marine Products And Services Abu Dhabi",
    description: "We provide top Marine Products and Services like marine engine overhauls and marine turbocharger overhauls, for peak performance & efficiency",
    image: S("/images/scenes/vessel-aerial-2-graded.jpg", "Container vessel berthed under ship-to-shore cranes"),
  },
  {
    slug: "power-generation",
    kind: "industry",
    label: "Power Generation",
    title: "Products and Services for Power Generation Industry in UAE",
    description: "Explore our products and services for the power generation industry in UAE. We supply reliable spare parts & equipment for power applications",
    image: S("/images/scenes/electrical-wiring-graded.jpg", "Generator electrical systems"),
  },

  // ── Brands ─────────────────────────────────────────────────────────────────
  {
    slug: "cummins-engine-spare-parts",
    kind: "brand",
    label: "Cummins",
    title: "Cummins Engine Spare Parts in UAE, Saudi, Oman & other GCC",
    description: "JRS supplies Cummins engine spare parts across UAE, Saudi, Oman & GCC. Built for durability, fuel efficiency, and reliable performance.",
    image: P("/images/legacy/cummins-engine-spare-parts-in-uae-1.jpg", "Cummins engine spare parts"),
  },
  {
    slug: "wartsila-marine-engine-spare-parts-supplier",
    kind: "brand",
    label: "Wärtsilä",
    title: "Wartsila Marine Engine Spare Parts - UAE, Oman, Bahrain & Qatar",
    description: "Trusted supplier of Wartsila marine engine spare parts across UAE, Oman, Bahrain, Qatar & Kuwait, Saudi. OEM-equivalent components.",
    image: P("/images/legacy/warstila-oem-quality-spare-parts.jpg", "OEM-quality spare parts for Wärtsilä marine engines"),
  },
  {
    slug: "yanmar-marine-engine-spare-parts-supplier",
    kind: "brand",
    label: "Yanmar",
    title: "Yanmar Marine Engine Spare Parts Supplier Across GCC",
    description: "Trusted supplier of OEM-quality Yanmar marine engine spare parts across the UAE, Saudi Arabia, Qatar, Oman, Bahrain, and Kuwait.",
    image: P("/images/legacy/yanmar-marine-engine-parts.jpg", "Yanmar marine engine"),
  },

  // ── Insights (posts) ───────────────────────────────────────────────────────
  { slug: "diesel-fuel-injection-parts-in-abu-dhabi", kind: "post", category: "fuel-injection", label: "Diesel Fuel Injection Parts in Abu Dhabi", title: "Diesel Fuel Injection Parts in Abu Dhabi | JRS", description: "Get diesel fuel injection parts in Abu Dhabi from JRS, injectors, fuel pumps, diesel engine and generator parts for marine and power use.", related: ["fuel-injection-systems-components-in-abu-dhabi", "services/fuel-pump-overhaul"] },
  { slug: "fuel-injector-spare-parts-and-repair-in-abu-dhabi", kind: "post", category: "fuel-injection", label: "Fuel Injector Spare Parts & Repair in Abu Dhabi", title: "Fuel Injector Spare Parts & Repair in Abu Dhabi", description: "Get fuel injector spare parts & repair in Abu Dhabi from JRS. Testing, calibration & injector components for marine engines & diesel generators", related: ["fuel-injection-systems-components-in-abu-dhabi", "services/marine-fuel-pump-injector-service"] },
  { slug: "lorange-injectors-and-pumps-repair", kind: "post", category: "fuel-injection", label: "L’Orange Injectors and Pumps Repair", title: "L’Orange Injectors and Pumps Repair in Abu Dhabi - UAE", description: "L’Orange Injectors and Pumps Repair in UAE with expert diagnostics, precision & reliable service to restore performance & extend engine life.", related: ["services/marine-fuel-pump-injector-service", "fuel-injection-systems-components-in-abu-dhabi"] },
  { slug: "wartsila-engine-spare-parts-in-saudi-arabia", kind: "post", category: "marine-engine-spare-parts", label: "Wärtsilä Engine Spare Parts in Saudi Arabia", title: "Wartsila Engine Spare Parts in Saudi -Jeddah, Riyadh & Dammam", description: "Wartsila engine spare parts in Saudi -Jeddah, Riyadh & Dammam with OEM-quality, reliable supply, competitive pricing & fast delivery.", related: ["wartsila-marine-engine-spare-parts-supplier"] },
  { slug: "yanmar-marine-engine-spare-parts-supplier-in-uae", kind: "post", category: "marine-engine-spare-parts", label: "Yanmar Marine Engine Spare Parts Supplier in UAE", title: "Yanmar Marine Engine Spare Parts Supplier in UAE", description: "Reliable Yanmar Marine Engine spare parts supplier in UAE offering OEM quality parts, fast availability & expert support for marine engines.", related: ["yanmar-marine-engine-spare-parts-supplier"] },
  { slug: "cummins-engine-spare-parts-for-marine-and-industrial", kind: "post", category: "cummins", label: "Cummins Engine Spare Parts for Marine and Industrial Applications", title: "Cummins Engine Spare Parts for Marine and Industrial Applications", description: "Find Cummins engine spare parts for marine & industrial applications across the Saudi, Oman, UAE & GCC ensuring you have the right components", related: ["cummins-engine-spare-parts"] },
  { slug: "yanmar-marine-engine-spare-parts-for-marine-operations", kind: "post", category: "marine-engine-spare-parts", label: "Yanmar Marine Engine Spare Parts for Marine Operations", title: "Yanmar Marine Engine Spare Parts Supplier", description: "OEM-quality Yanmar marine engine spare parts supplier in UAE, Oman, and Saudi Arabia for offshore and commercial marine operations.", related: ["yanmar-marine-engine-spare-parts-supplier"] },
  { slug: "cummins-engine-spare-parts-in-uae", kind: "post", category: "cummins", label: "Cummins Engine Spare Parts in UAE", title: "Cummins Engine Spare Parts in UAE", description: "Cummins engine spare parts in UAE for marine, offshore, industrial, and power generation sectors. Also supplying Oman and Saudi Arabia.", related: ["cummins-engine-spare-parts"] },
  { slug: "cummins-engine-spare-parts-supplier-saudi-arabia", kind: "post", category: "cummins", label: "Cummins Engine Spare Parts Supplier in Saudi Arabia", title: "Cummins Engine Spare Parts Supplier in Saudi Arabia", description: "JRS Mechanical Equipment supplies OEM-quality Cummins spare parts in Saudi Arabia for marine, industrial, oil & gas, and power sectors.", related: ["cummins-engine-spare-parts"] },
  { slug: "optimizing-engine-performance-with-yanmar-spare-parts-in-saudi-arabia", kind: "post", category: "marine-engine-spare-parts", label: "Optimizing Engine Performance with Yanmar Spare Parts in Saudi Arabia", title: "Yanmar Spare Parts Supplier in Saudi Arabia", description: "JRS Mechanical Equipment supplies OEM-quality Yanmar spare parts in Saudi Arabia for marine, industrial and power sectors across the GCC.", related: ["yanmar-marine-engine-spare-parts-supplier"] },
  { slug: "cummins-spare-parts-in-kuwait", kind: "post", category: "cummins", label: "The Importance of Cummins Spare Parts for Industries in Kuwait", title: "Cummins Spare Parts Supplier in Kuwait | JRS Mechanical", description: "JRS Mechanical Equipment supplies OEM-quality Cummins spare parts in Kuwait for marine, industrial, oil & gas, and power generation sectors.", related: ["cummins-engine-spare-parts"] },
];

export const categories: Record<PostCategory, { label: string; title: string; description: string }> = {
  cummins: { label: "Cummins", title: "Cummins Archives - JRS", description: "Insights from JRS on Cummins engine spare parts for marine, industrial and power-generation operations across the UAE, Saudi Arabia, Kuwait and the GCC." },
  "fuel-injection": { label: "Fuel Injection", title: "Fuel Injection Archives - JRS", description: "JRS insights on diesel fuel injection parts, injector repair and L’Orange injectors and pumps for marine engines and generators in Abu Dhabi." },
  "marine-engine-spare-parts": { label: "Marine Engine Spare Parts", title: "Marine Engine Spare Parts Archives - JRS", description: "JRS insights on Wärtsilä and Yanmar marine engine spare parts across the UAE, Oman, Saudi Arabia and the GCC." },
};

const content = legacy as Record<string, LegacyContent>;
const bySlug = new Map(pages.map((p) => [p.slug, p]));

export const getPage = (slug: string) => bySlug.get(slug);
export const getLegacyContent = (slug: string): LegacyContent | undefined => content[`/${slug}/`];
export const pagesOfKind = (kind: PageKind) => pages.filter((p) => p.kind === kind);

export function postsSorted() {
  return pagesOfKind("post")
    .map((p) => ({ ...p, content: getLegacyContent(p.slug)! }))
    .sort((a, b) => Date.parse(b.content.date ?? "") - Date.parse(a.content.date ?? ""));
}

/** Authored content (pages new to the rebuild) takes precedence over extracted legacy content. */
export function getContent(key: string): LegacyContent | undefined {
  const a = authored[key];
  if (a) return { h1: a.h1, lead: a.lead, blocks: a.blocks };
  return content[`/${key}/`];
}

export function postImage(slug: string): Img | undefined {
  const f = getLegacyContent(slug)?.featured;
  return f && { src: f.src, alt: f.alt, fit: "contain" };
}
