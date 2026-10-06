import { images, type Img } from "./images";

// Single source of truth for products, services and brand facts.
// Every statement here traces to docs/04-fact-register.md (Company Profile, Product Profile, live site).
// Do not add specifications, statistics or brand relationships that are not in that register.

export type Product = {
  slug: string;
  href: string;
  name: string;
  short: string;
  tags: string[];
  summary: string;
  image: Img;
};

export const products: Product[] = [
  {
    slug: "engine-bearings",
    href: "/engine-bearings-in-abu-dhabi/",
    name: "Engine Bearings",
    short: "Main · Thrust · Connecting rod",
    tags: ["OEM specifications", "Marine diesel"],
    summary:
      "Main, thrust and connecting-rod bearings manufactured to OEM specifications for durability, load capacity and smooth running under extreme conditions.",
    image: images.engineBearings,
  },
  {
    slug: "cylinder-heads",
    href: "/cylinder-heads-components-in-abu-dhabi/",
    name: "Cylinder Heads & Components",
    short: "Valve stems · Seats · Rotators",
    tags: ["2-stroke", "4-stroke"],
    summary:
      "Cylinder head components for 2-stroke and 4-stroke marine engines, including valve stems, cooled and uncooled valve seats, valve rotators, springs, guides and gaskets.",
    image: images.cylinderHeads,
  },
  {
    slug: "fuel-injection",
    href: "/fuel-injection-systems-components-in-abu-dhabi/",
    name: "Fuel Injection Systems",
    short: "Injectors · Pumps · Nozzles",
    tags: ["Marine diesel", "Complete assemblies"],
    summary:
      "Injectors, pumps, nozzles and complete system assemblies for marine diesel engines, sourced from trusted OEMs for precise combustion and fuel efficiency.",
    image: images.fuelInjection,
  },
  {
    slug: "pistons",
    href: "/pistons-piston-rings-in-abu-dhabi/",
    name: "Pistons & Piston Rings",
    short: "Slow · Medium · High-speed engines",
    tags: ["European manufacturers", "Coated finishes"],
    summary:
      "Pistons and rings for slow, medium and high-speed marine engines from leading European manufacturers, with chromium-ceramic, plasma-spray or ceramic coatings.",
    image: images.pistons,
  },
  {
    slug: "liners",
    href: "/liners-anti-polishing-rings-in-abu-dhabi/",
    name: "Liners & Anti-Polishing Rings",
    short: "Ø 150 – 500 mm · Centrifugally cast",
    tags: ["Diesel & gas engines", "Class-certified"],
    summary:
      "Centrifugally cast cylinder liners from 150 mm to 500 mm in diameter, mostly pre-honed, with anti-polishing rings for diesel and gas engines.",
    image: images.liners,
  },
  {
    slug: "filters",
    href: "/filters/",
    name: "Filters",
    short: "Oil · Fuel · Air · Water separators",
    tags: ["OEM standards", "Engine & auxiliary"],
    summary:
      "Oil, fuel and air filters and water separators that protect critical engine and auxiliary systems from contaminants.",
    image: images.filters,
  },
  {
    slug: "turbochargers",
    href: "/turbochargers-cartridges-in-abu-dhabi/",
    name: "Turbochargers & Cartridges",
    short: "ABB–IHI · MAN · Napier · Mitsubishi · KBB",
    tags: ["Genuine", "OEM"],
    summary:
      "Genuine and OEM turbocharger parts: casings, rotors, nozzle rings, labyrinth seals, bearing assemblies and cartridges.",
    image: images.turbochargers,
  },
  {
    slug: "coolers",
    href: "/coolers-heat-exchangers-in-abu-dhabi/",
    name: "Coolers & Heat Exchangers",
    short: "Charge air · Lube oil · FW · SW",
    tags: ["Complete units", "Tube stacks & seals"],
    summary:
      "Charge-air, lube-oil, freshwater and seawater coolers, as complete units or spares such as tube stacks, gaskets and seals.",
    image: images.coolers,
  },
  {
    slug: "avr",
    href: "/automatic-voltage-regulator-supplier-in-uae/",
    name: "Generator Automatic Voltage Regulators",
    short: "40+ regulator types supplied",
    tags: ["Shunt · AREP · PMG", "Brush & brushless"],
    summary:
      "More than 40 types of AVR supplied across self-excited, separately excited, AREP, AUX, harmonic and PMG excitation systems.",
    image: images.avr,
  },
  {
    slug: "genset-controllers",
    href: "/genset-controllers-amf-in-abu-dhabi/",
    name: "Genset Controllers & AMF",
    short: "Genset control · ATS control",
    tags: ["OEM · Universal", "Aftermarket"],
    summary:
      "Generator control units as OEM, universal and aftermarket replacements. The AMF module provides complete genset control and protection and controls the ATS.",
    image: images.gensetControllers,
  },
];

export type Capability = {
  index: string;
  title: string;
  body: string;
  href: string;
  image: Img;
};

export const capabilities: Capability[] = [
  {
    index: "01",
    title: "Engine Spares",
    body: "Genuine and OEM engine spare parts for marine and power-generation engines: bearings, pistons, liners, cylinder-head components, filters and more.",
    href: "/products/",
    image: images.capEngineSpares,
  },
  {
    index: "02",
    title: "Turbochargers",
    body: "Parts and cartridges for ABB–IHI, MAN, Napier, Mitsubishi and KBB turbochargers, plus rotor balancing, re-blading and thermal balancing.",
    href: "/turbochargers-cartridges-in-abu-dhabi/",
    image: images.capTurbochargers,
  },
  {
    index: "03",
    title: "Engine Overhauls",
    body: "Complete overhauls, from cylinder heads and crankshaft deflection checks to line boring, laser alignment, reassembly and load testing.",
    href: "/engine-overhaul-service-in-abu-dhabi/",
    image: images.capEngineOverhauls,
  },
  {
    index: "04",
    title: "Fuel Systems",
    body: "Injectors, pumps and nozzles, with overhaul, ultrasonic cleaning and calibration of marine and industrial fuel pumps.",
    href: "/fuel-injection-systems-components-in-abu-dhabi/",
    image: images.capFuelSystems,
  },
  {
    index: "05",
    title: "Power Generation",
    body: "Automatic voltage regulators, genset controllers and AMF modules, with the engine parts that keep generator sets online.",
    href: "/power-generation/",
    image: images.capPowerGeneration,
  },
  {
    index: "06",
    title: "Technical Services",
    body: "Electrical and instrumentation, governors, starter motors, alternators and reconditioning of critical engine parts.",
    href: "/services/",
    image: images.capTechnicalServices,
  },
];

export const overhaulCapabilities = [
  "Complete overhaul of cylinder heads",
  "Inspection and overhaul of pistons & connecting rods",
  "Removal, refitting and honing / deglazing of liners",
  "Main & thrust bearing inspections",
  "Overhaul of fuel pumps and injectors",
  "Camshaft and bush inspections and replacements",
  "Crankshaft deflection checks, pre & post overhaul",
  "Cleaning and overhaul of charge air and lube oil coolers",
  "Overhaul of LO and FW pumps",
  "Engine reassembly and load testing",
  "Renewal of crankshaft and entablature",
  "Line bore checks, line boring & laser alignment",
];

export type Service = {
  index: string;
  title: string;
  href: string;
  body: string;
  points: string[];
  image: Img;
};

export const services: Service[] = [
  {
    index: "01",
    title: "Engine Overhaul",
    href: "/engine-overhaul-service-in-abu-dhabi/",
    body: "Your engine is the heart of your work, whether it powers a ship across the seas or vital power systems. Our engine overhaul service in Abu Dhabi focuses on speed, accuracy and reliability.",
    points: ["Cylinder heads, pistons & liners", "Crankshaft deflection checks", "Load testing & laser alignment"],
    image: images.engineOverhaul,
  },
  {
    index: "02",
    title: "Turbocharger Overhaul",
    href: "/turbocharger-overhauls-in-abu-dhabi/",
    body: "A skilled team experienced in repairing and refurbishing critical rotating equipment, with a service centre equipped for all major turbocharger models.",
    points: ["Rotor balancing & re-blading", "Thermal balancing", "Partition wall sealing strips"],
    image: images.turbochargerOverhaul,
  },
  {
    index: "03",
    title: "Fuel Pump Overhaul",
    href: "/services/fuel-pump-overhaul/",
    body: "Complete fuel pump overhaul: thorough inspection, dismantling, ultrasonic cleaning, replacement of worn parts, precision calibration and final testing.",
    points: ["Ultrasonic cleaning", "Precision calibration", "Final testing"],
    image: images.fuelPumpOverhaul,
  },
  {
    index: "04",
    title: "Marine Fuel Pump & Injector Service",
    href: "/services/marine-fuel-pump-injector-service/",
    body: "Inspection, cleaning, calibration and repair to restore pumps and injectors to OEM standards, optimising spray patterns for precise fuel delivery.",
    points: ["Main & auxiliary engines", "Fire-fighting engines", "Bow thrusters"],
    image: images.marineInjectorService,
  },
  {
    index: "05",
    title: "Electrical & Instrumentation",
    href: "/services/electrical-instrumentation/",
    body: "Installation, maintenance, calibration, troubleshooting and repair of electrical systems, control panels, sensors, transmitters and instrumentation.",
    points: ["Control panels", "Sensors & transmitters", "Calibration"],
    image: images.electricalInstrumentation,
  },
  {
    index: "06",
    title: "Governors",
    href: "/services/governors/",
    body: "Supply and service of governors and actuators from Woodward, Regulateurs Europa, Zexel, Yanmar and Heinzmann. Each unit is bench-tested before and after service.",
    points: ["Test-bench assessment", "Rebuild & recoating", "Tested to manufacturer spec"],
    image: images.governors,
  },
  {
    index: "07",
    title: "Reconditioning of Engine Parts",
    href: "/services/reconditioning-engine-parts/",
    body: "Reconditioning that begins with a detailed examination of the cause of damage, for exhaust valve spindles, piston crowns, cylinder heads and turbocharger casings.",
    points: ["Exhaust valve spindles & seats", "Piston crowns & cylinder heads", "Turbocharger crack repair"],
    image: images.reconditioning,
  },
  {
    index: "08",
    title: "Starter Motor & Alternator Service",
    href: "/services/starter-motor-alternator-service/",
    body: "Inspection, cleaning, testing and overhaul of starter motors and alternators for dependable engine starting and consistent charging.",
    points: ["Diesel engine starter motors", "Bosch / Delphi alternators"],
    image: images.starterAlternator,
  },
];

export type Industry = { title: string; href: string; body: string; image: Img };

export const industries: Industry[] = [
  {
    title: "Marine",
    href: "/marine-products-and-services/",
    body: "Our core sector: spare parts, technical solutions and dependable maintenance for vessels, from marine engine overhauls to turbocharger support.",
    image: images.marine,
  },
  {
    title: "Power Generation",
    href: "/power-generation/",
    body: "Engine overhauls, turbocharger overhauls and fuel injection work for power-plant engines, plus AVRs and genset controllers.",
    image: images.powerGeneration,
  },
  {
    title: "Industrial",
    href: "/industries/industrial/",
    body: "Engine spare parts and repair solutions for industrial generators and machinery where downtime has a direct cost.",
    image: images.industrial,
  },
  {
    title: "Offshore",
    href: "/industries/offshore/",
    body: "OEM engine spare parts for the offshore sector, supplied from Abu Dhabi for scheduled maintenance and emergency breakdowns.",
    image: images.offshore,
  },
];

// Replacement spare parts logo wall (Company Profile p.4, live site).
export const partsMakes = ["Caterpillar", "Cummins", "Detroit Diesel", "Perkins", "Wärtsilä", "Doosan", "MaK", "MAN", "Deutz", "Yanmar", "Mitsubishi"];
// Engines supported for reconditioning (Product Profile p.10).
export const reconditioningMakes = ["MAN", "Mitsubishi", "Wärtsilä", "MaK", "Deutz", "Akasaka", "Caterpillar", "Yanmar", "Daihatsu", "Hanshin", "Wichmann", "Rolls-Royce Bergen", "Detroit", "Niigata"];
export const turbochargerMakes = ["ABB – IHI", "MAN", "Napier", "Mitsubishi", "KBB"];

export const brandPages = [
  { name: "Cummins", href: "/cummins-engine-spare-parts/", note: "UAE · Saudi Arabia · Oman · GCC" },
  { name: "Wärtsilä", href: "/wartsila-marine-engine-spare-parts-supplier/", note: "UAE · Oman · Bahrain · Qatar" },
  { name: "Yanmar", href: "/yanmar-marine-engine-spare-parts-supplier/", note: "UAE · Saudi Arabia · Oman · GCC" },
];

// Logos for the "Supported companies" grid: the previous site's replacement-parts logo wall, in its order
// (source files and URLs: docs/source-logos/sources.json; processed by scripts/build-logo-assets.mjs).
// Makes with a dedicated page link to it. Always shown with referenceDisclaimer.
export type MakeLogo = { name: string; src: string; href?: string };
const makeSlug: Record<string, string> = { "Wärtsilä": "wartsila", "Detroit Diesel": "detroit-diesel" };
export const makeLogos: MakeLogo[] = partsMakes.map((name) => ({
  name,
  src: `/images/makes/${makeSlug[name] ?? name.toLowerCase()}.png`,
  href: brandPages.find((b) => b.name === name)?.href,
}));

// "Replacement engine spare parts" tiles: the previous site's product strip (same order), each linked to the product
// page that covers it. Separators have no page of their own, so that tile asks for availability instead.
export type PartTile = { name: string; src: string; alt: string; href?: string };
const pistonsHref = "/pistons-piston-rings-in-abu-dhabi/";
const headsHref = "/cylinder-heads-components-in-abu-dhabi/";
export const replacementParts: PartTile[] = [
  { name: "Pistons", src: "/images/parts/pistons.png", alt: "Marine diesel engine piston", href: pistonsHref },
  { name: "Fuel injection systems", src: "/images/parts/fuel-injection-systems.png", alt: "Diesel fuel injection pump", href: "/fuel-injection-systems-components-in-abu-dhabi/" },
  { name: "Piston rings", src: "/images/parts/piston-rings.png", alt: "Set of piston rings", href: pistonsHref },
  { name: "Piston pins", src: "/images/parts/piston-pins.png", alt: "Hollow steel piston pin", href: pistonsHref },
  { name: "Bearings", src: "/images/parts/bearings.png", alt: "Engine bearing shells", href: "/engine-bearings-in-abu-dhabi/" },
  { name: "Cylinder heads", src: "/images/parts/cylinder-heads.png", alt: "Diesel engine cylinder head", href: headsHref },
  { name: "Filter elements", src: "/images/parts/filter-elements.png", alt: "Pleated filter element", href: "/filters/" },
  { name: "Separators", src: "/images/parts/separators.png", alt: "Centrifugal separator" },
  { name: "Valve stems", src: "/images/parts/valve-stems.png", alt: "Engine valves with long stems", href: headsHref },
  { name: "Valve rotators", src: "/images/parts/valve-rotators.png", alt: "Valve rotator", href: headsHref },
  { name: "Liners", src: "/images/parts/liners.png", alt: "Cylinder liners in three sizes", href: "/liners-anti-polishing-rings-in-abu-dhabi/" },
];

export const referenceDisclaimer =
  "All manufacturers' names, part numbers, symbols and descriptions are used for reference purposes only and do not imply that any product offered by JRS is the product of these manufacturers.";

// Badges as shown on the previous site and in the company profile (p.8). Fact register: show the official badge
// images only; never restate the accreditation number printed on them.
export const certifications = [
  { code: "ISO 9001:2015", label: "Quality management systems", badge: { src: "/images/certifications/iso-9001-2015.png", width: 773, height: 300 } },
  { code: "ISO 14001:2015", label: "Environmental management systems", badge: { src: "/images/certifications/iso-14001-2015.png", width: 771, height: 300 } },
  { code: "ISO 45001:2018", label: "Occupational health & safety", badge: { src: "/images/certifications/iso-45001-2018.png", width: 775, height: 300 } },
  { code: "ICV", label: "In-Country Value programme", badge: { src: "/images/certifications/icv.png", width: 337, height: 300 } },
];

export const mission =
  "To deliver high-quality marine and industrial spare parts along with reliable repair solutions that minimize downtime, enhance performance, and build long-term trust with our clients.";
export const missionSupport =
  "We are dedicated to offering responsive support, technical expertise, and cost-effective services that meet the evolving needs of the maritime and industrial sectors.";
export const vision =
  "To become the region's leading provider of marine and industrial spares and services, recognized for our commitment to quality, innovation, and customer satisfaction.";
export const visionSupport =
  "We aim to set new benchmarks in the industry through continuous improvement and lasting partnerships.";
