// Content for pages that do not exist on the live site. Every statement is taken from the
// Company Profile / Product Profile PDFs or existing live-site copy (docs/04-fact-register.md).
import type { Block } from "@/lib/blocks";

export type AuthoredPage = {
  h1: string;
  lead: string;
  blocks: Block[];
};

export const authored: Record<string, AuthoredPage> = {
  // ── New product ───────────────────────────────────────────────────────────
  "genset-controllers-amf-in-abu-dhabi": {
    h1: "Genset Controllers & Automatic Mains Failure in Abu Dhabi",
    lead: "High-reliability generator control units as OEM, universal and aftermarket replacements, suitable for a wide range of generator and engine types.",
    blocks: [
      { type: "h2", text: "Generator Control Units" },
      { type: "p", text: "JRS generator control units are high-reliability OEM, universal, and aftermarket replacements suitable for a wide range of generator and engine types. They support power-generation operators who need dependable control and protection for their generator sets." },
      { type: "list", items: ["OEM replacements", "Universal controllers", "Aftermarket replacements", "Suitable for a wide range of generator and engine types"] },
      { type: "h2", text: "Automatic Mains Failure (AMF) Module" },
      { type: "p", text: "The JRS Auto Mains Failure (AMF) module provides complete genset control and protection, while also functioning as a monitoring and control controller for the Automatic Transfer Switch (ATS)." },
      { type: "list", items: ["Complete genset control", "Genset protection", "Monitoring and control of the Automatic Transfer Switch (ATS)"] },
      { type: "h2", text: "Part of a Complete Power Generation Package" },
      { type: "p", text: "Genset controllers sit alongside JRS automatic voltage regulators and the engine spare parts that keep generator sets online, from fuel injection systems and filters to turbochargers and coolers." },
      { type: "p", text: "Contact JRS for availability and specifications. Share the generator make, model and existing controller details, and our team will advise on a suitable replacement." },
    ],
  },

  // ── New services ──────────────────────────────────────────────────────────
  "services/fuel-pump-overhaul": {
    h1: "Fuel Pump Overhaul Service",
    lead: "Complete fuel pump overhaul solutions that ensure reliable performance and extended service life for marine and industrial fuel pumps.",
    blocks: [
      { type: "h2", text: "Our Overhaul Process" },
      { type: "p", text: "Our expert team handles a wide range of marine and industrial fuel pumps with care, ensuring optimum efficiency, reduced downtime and cost-effective operation." },
      { type: "list", ordered: true, items: ["Thorough inspection – assessing the pump’s condition and performance", "Dismantling – complete disassembly of the pump", "Ultrasonic cleaning – removing deposits from every component", "Replacement of worn-out or damaged parts", "Precision calibration – setting the pump to specification", "Final testing under standard conditions"] },
      { type: "h2", text: "Why It Matters" },
      { type: "p", text: "The fuel pump meters and pressurises fuel for every combustion cycle. A worn or poorly calibrated pump affects combustion, fuel consumption and engine performance. A professional overhaul restores reliable performance and extends service life." },
      { type: "h2", text: "Related Fuel System Support" },
      { type: "p", text: "JRS also supplies fuel injection systems and components, including injectors, pumps, nozzles and complete system assemblies, and services marine fuel pumps and injectors for main, auxiliary, fire-fighting and bow-thruster engines." },
    ],
  },
  "services/marine-fuel-pump-injector-service": {
    h1: "Marine Fuel Pump & Injector Service",
    lead: "Inspection, cleaning, calibration and repair of fuel pumps and injectors that restores them to OEM standards for reliable engine performance and fuel efficiency.",
    blocks: [
      { type: "h2", text: "Restoring Pumps and Injectors to OEM Standards" },
      { type: "p", text: "Our Marine Fuel Pump and Injector Service ensures reliable engine performance and fuel efficiency for your vessels. We provide complete inspection, cleaning, calibration and repair of fuel pumps and injectors to restore them to OEM standards." },
      { type: "p", text: "Using advanced testing equipment and genuine parts, we remove carbon deposits, repair worn components and optimise spray patterns for precise fuel delivery. Regular servicing helps reduce fuel consumption, lower emissions and extend engine life, ensuring smooth operations at sea." },
      { type: "h2", text: "Engines We Service" },
      { type: "list", items: ["Main Engine Fuel Pumps & Injectors", "Auxiliary Engine Pumps & Injectors", "Fire Fighting Engine Pumps & Injectors", "Bow Thruster Fuel Pumps & Injectors"] },
      { type: "h2", text: "What the Service Covers" },
      { type: "list", items: ["Inspection – testing condition and spray pattern", "Cleaning – removing carbon deposits", "Repair – replacing worn components with genuine parts", "Calibration – optimising spray patterns for precise fuel delivery"] },
    ],
  },
  "services/electrical-instrumentation": {
    h1: "Electrical & Instrumentation Services",
    lead: "Comprehensive electrical and instrumentation solutions for industrial and marine applications.",
    blocks: [
      { type: "h2", text: "Electrical and Instrumentation Solutions" },
      { type: "p", text: "We provide comprehensive electrical and instrumentation solutions for industrial and marine applications. With skilled technicians and precise diagnostic tools, we ensure optimal system performance, safety compliance and minimal downtime for your operations." },
      { type: "h2", text: "Our Services Include" },
      { type: "list", items: ["Installation – electrical systems and instrumentation devices", "Maintenance – keeping systems in reliable working order", "Calibration – sensors, transmitters and instrumentation", "Troubleshooting – precise diagnostics of electrical faults", "Repair – electrical systems, control panels and devices"] },
      { type: "h2", text: "Systems We Work On" },
      { type: "list", items: ["Electrical systems", "Control panels", "Sensors", "Transmitters", "Other instrumentation devices"] },
    ],
  },
  "services/governors": {
    h1: "Governor & Actuator Service",
    lead: "Governors and actuators are vital components in power generation and process equipment. JRS supplies and services units from leading brands.",
    blocks: [
      { type: "h2", text: "Brands We Supply and Service" },
      { type: "p", text: "We supply and service governors and actuators from leading brands, including:" },
      { type: "list", items: ["Woodward", "Regulateurs Europa", "Zexel", "Yanmar", "Heinzmann"] },
      { type: "h2", text: "Our Governor Service Process" },
      { type: "list", ordered: true, items: ["Initial test run on a test bench to assess condition & performance", "Complete disassembly, ultrasonic cleaning, and inspection", "Documentation & quotation of required spare parts for approval", "Reassembly with new parts and repair kits, followed by protective recoating", "Final adjustment and testing as per manufacturer’s specifications and checklist", "Secure packaging and preparation for shipment"] },
      { type: "p", text: "Manufacturers’ names are used for reference purposes only and do not imply that any product offered by JRS is the product of these manufacturers." },
    ],
  },
  "services/reconditioning-engine-parts": {
    h1: "Reconditioning of Engine Parts",
    lead: "High-quality reconditioning services that often exceed OEM standards, starting with a detailed examination of every component.",
    blocks: [
      { type: "h2", text: "Examination Before Reconditioning" },
      { type: "p", text: "Our process begins with a detailed examination to identify causes of damage and evaluate engine health, ensuring reliability and early detection of potential issues." },
      { type: "h2", text: "Key Services" },
      { type: "list", ordered: true, items: ["Reconditioning of main engine exhaust valve spindles & seats", "Reconditioning of piston crowns & cylinder heads", "Turbocharger crack repair and reconditioning", "Repair and overhaul of electrical motors of all capacities"] },
      { type: "h2", text: "Engines We Support" },
      { type: "p", text: "JRS gladly supports MAN, Mitsubishi, Wärtsilä, MaK, Deutz, Akasaka, Caterpillar, Yanmar, Daihatsu, Hanshin, Wichmann, Rolls-Royce Bergen, Detroit and Niigata primary engines." },
      { type: "p", text: "All manufacturers’ names are used for reference purposes only and do not imply that any product offered by JRS is the product of these manufacturers." },
    ],
  },
  "services/starter-motor-alternator-service": {
    h1: "Starter Motor & Alternator Service",
    lead: "Expert servicing, repair and replacement of starter motors and alternators for reliable engine starting and efficient power supply.",
    blocks: [
      { type: "h2", text: "Reliable Starting, Consistent Charging" },
      { type: "p", text: "We provide expert servicing, repair and replacement of starter motors and alternators to ensure reliable engine performance and efficient power supply. Our services include complete inspection, cleaning, testing and overhauling of components to restore optimal functionality." },
      { type: "p", text: "With skilled technicians and quality parts, we deliver smooth engine starting, consistent charging and long-lasting performance." },
      { type: "h2", text: "Our Services" },
      { type: "list", items: ["Diesel engine starter motor repairing", "Bosch / Delphi alternator service"] },
      { type: "h2", text: "What Every Service Includes" },
      { type: "list", items: ["Inspection", "Cleaning", "Testing", "Overhauling of components"] },
    ],
  },

  // ── New industry pages ────────────────────────────────────────────────────
  "industries/industrial": {
    h1: "Industrial Engine Spare Parts & Repair Solutions",
    lead: "Engine spare parts and dependable repair solutions for industrial engines and generators, supplied from Abu Dhabi.",
    blocks: [
      { type: "h2", text: "Supporting Industrial Operations" },
      { type: "p", text: "JRS supplies high-quality marine and industrial spare parts along with reliable repair solutions that minimise downtime, enhance performance and build long-term trust with our clients. Our product line is sourced from trusted manufacturers to ensure reliability across industrial and marine applications." },
      { type: "h2", text: "Applications" },
      { type: "list", items: ["Industrial generators", "Construction equipment", "Heavy equipment machinery", "Commercial transport fleets", "Oil and gas industry operations"] },
      { type: "h2", text: "Industrial Spare Parts Range" },
      { type: "list", items: ["Fuel injection systems", "Pistons and piston rings", "Cylinder liners", "Turbochargers", "Bearings and seals", "Pumps and filters"] },
      { type: "p", text: "Whether for scheduled maintenance, emergency breakdowns or long-term supply contracts, we deliver tailored solutions that meet the critical demands of your operations." },
    ],
  },
  "industries/offshore": {
    h1: "Offshore Engine Spare Parts Supply",
    lead: "OEM engine spare parts for the offshore sector, supplied from Abu Dhabi for scheduled maintenance, emergency breakdowns and long-term supply.",
    blocks: [
      { type: "h2", text: "Engine Support for Offshore Operations" },
      { type: "p", text: "Headquartered in Abu Dhabi, JRS specialises in sourcing and supplying a comprehensive range of OEM engine spare parts for the marine, offshore and industrial power sectors. Whether for ships, industrial generators or offshore platforms, we supply parts from trusted global brands." },
      { type: "h2", text: "Offshore Applications" },
      { type: "list", items: ["Offshore support vessels", "Offshore platforms", "Commercial marine fleets", "Utility marine crafts"] },
      { type: "h2", text: "What We Supply" },
      { type: "p", text: "Our stock includes turbochargers, pistons, fuel pumps, filters, gaskets and more, alongside engine bearings, cylinder head components, liners, and coolers and heat exchangers." },
      { type: "p", text: "Offshore operations demand engine components suited to saltwater conditions and long operating hours. JRS supports planned maintenance, emergency sourcing and long-term operational support." },
    ],
  },
};
