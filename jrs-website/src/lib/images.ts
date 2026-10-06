// One registry for every image on the site, so each picture has exactly one job.
//
// Rules (checked by scripts/audit-images.mjs against the built site):
//  - Every page hero and every homepage section uses its own image; none is reused elsewhere.
//  - A card that links to a page shows that page's image (its "identity"). This is the only
//    intentional reuse: like a catalogue thumbnail, it tells you where the link goes.
//  - No picture appears twice on the same screen.
//
// Sources and licences: docs/05-image-credits.md. Stock photos are illustrative only and are never
// captioned as JRS premises, staff or customers.

export type Img = {
  src: string;
  alt: string;
  /** "cover": photograph filling its frame. "contain": product/cut-out on a light plate. */
  fit?: "cover" | "contain";
  /** Small source photo: show it framed instead of full-bleed. */
  framed?: boolean;
};

const scene = (src: string, alt: string, framed?: boolean): Img => ({ src, alt, fit: "cover", ...(framed && { framed }) });
const plate = (src: string, alt: string): Img => ({ src, alt, fit: "contain" });

export const images = {
  // ── Products: page identity, also used by every card linking to the product ──
  engineBearings: plate("/images/brochure/engine-bearing-shells.jpg", "Main, thrust and connecting rod engine bearing shells"),
  cylinderHeads: plate("/images/products/cylinder-heads-components.jpg", "Cylinder head components: valves, valve springs and valve seats"),
  fuelInjection: plate("/images/products/fuel-injection-systems.jpg", "Fuel injection pump elements and injector nozzles"),
  pistons: plate("/images/products/pistons-piston-rings.jpg", "Marine engine pistons with piston rings"),
  liners: plate("/images/products/liners-anti-polishing-rings.jpg", "Centrifugally cast cylinder liners in three sizes"),
  filters: plate("/images/products/marine-filters.jpg", "Marine oil, fuel and air filter elements"),
  turbochargers: plate("/images/products/turbocharger-cartridge.jpg", "Turbocharger cartridge with turbine wheel"),
  coolers: plate("/images/products/coolers-heat-exchangers.jpg", "Shell-and-tube and plate heat exchangers"),
  avr: plate("/images/brochure/automatic-voltage-regulators.png", "Generator automatic voltage regulator units"),
  gensetControllers: plate("/images/brochure/genset-controllers-amf.png", "Genset controllers and automatic mains failure (AMF) modules"),

  // ── Services ─────────────────────────────────────────────────────────────────
  engineOverhaul: scene("/images/scenes/diesel-engine-detail-graded.jpg", "Diesel engine front end with fan and belt drive"),
  turbochargerOverhaul: scene("/images/scenes/turbine-rotor-machining.jpg", "Turbine rotor mounted for balancing"),
  outboardRepair: scene("/images/stock/outboard-motor-fuel-system-graded.jpg", "Fuel system of an outboard motor with the cowling removed"),
  routineMaintenance: scene("/images/scenes/injector-pump-repair-graded.jpg", "Technician connecting test leads to an engine"),
  boatsMaintenance: scene("/images/stock/boats-with-outboard-motors-graded.jpg", "Small boats with outboard motors moored in a harbour"),
  ultrasonicCleaning: scene("/images/scenes/engine-parts-dark-graded.jpg", "Precision gears and machined engine components", true),
  performanceTuning: scene("/images/stock/turbocharger-cutaway-graded.jpg", "Cutaway of a twin-scroll turbocharger"),
  fuelPumpOverhaul: plate("/images/brochure/rotary-fuel-injection-pump.png", "Rotary diesel fuel injection pump"),
  marineInjectorService: scene("/images/brochure/marine-fuel-injector-service-graded.jpg", "Fuel injectors being serviced on an engine", true),
  electricalInstrumentation: scene("/images/brochure/engine-room-control-panel-graded.jpg", "Engine room control and instrumentation panel", true),
  governors: scene("/images/brochure/governor-test-bench-graded.jpg", "Governor on a test bench with pressure gauges", true),
  reconditioning: scene("/images/stock/diesel-cylinder-head-graded.jpg", "Combustion face of a diesel cylinder head with its valves"),
  starterAlternator: scene("/images/brochure/alternator-repair-graded.jpg", "Technician repairing an alternator", true),

  // ── Industries ───────────────────────────────────────────────────────────────
  marine: scene("/images/brochure/container-ship-at-sea-aerial-graded.jpg", "Container ship under way, seen from above"),
  powerGeneration: scene("/images/stock/ship-diesel-generator-graded.jpg", "Diesel generator sets producing a ship's electrical power"),
  industrial: scene("/images/stock/engineering-machine-shop-graded.jpg", "Engineering machine shop with lathes and workbenches"),
  offshore: scene("/images/stock/offshore-platform-at-dusk-graded.jpg", "Offshore production platform at dusk"),

  // ── Brands (illustrative, reference only) ────────────────────────────────────
  cummins: scene("/images/stock/cummins-generator-set-graded.jpg", "Cummins generator set in a plant room"),
  wartsila: scene("/images/stock/car-carrier-with-tug-graded.jpg", "Ocean-going car carrier escorted by a tug"),
  yanmar: scene("/images/stock/tugboats-under-way-graded.jpg", "Two harbour tugboats under way"),

  // ── Hubs ─────────────────────────────────────────────────────────────────────
  aboutHero: scene("/images/brochure/container-ship-with-tug-aerial-graded.jpg", "Container ship with a tug alongside, seen from above"),
  aboutStory: scene("/images/scenes/port-vessel-aerial-graded.jpg", "Container vessel leaving a busy port"),
  servicesHub: scene("/images/stock/vessel-in-dry-dock-graded.jpg", "Vessel in dry dock for maintenance"),
  industriesHub: scene("/images/brochure/container-ship-at-berth-dusk-graded.jpg", "Container ship at berth under gantry cranes at dusk"),

  // ── Homepage sections ────────────────────────────────────────────────────────
  // Poster of the hero film (scripts/build-hero-video.mjs): first frame of the reel, art-directed in HeroMedia.
  homeHero: scene("/images/hero/hero-poster.jpg", "Aerial view of a container terminal, with ship-to-shore cranes working a vessel"),
  homeAbout: scene("/images/scenes/vessel-aerial-2-graded.jpg", "Container vessel berthed under ship-to-shore cranes"),
  // The large 1536px render carries the homepage feature; the smaller brochure shot is the product page identity.
  homeBearings: plate("/images/products/engine-bearings.jpg", "Marine engine bearings: main, thrust and connecting rod bearing shells"),
  homeOverhaul: scene("/images/stock/ship-engine-room-machinery-graded.jpg", "Engine room machinery with gauges and valve gear"),
  capEngineSpares: scene("/images/stock/six-cylinder-diesel-engine-graded.jpg", "Six-cylinder diesel engine"),
  capTurbochargers: plate("/images/brochure/marine-turbocharger.jpg", "Marine turbocharger"),
  capEngineOverhauls: plate("/images/brochure/marine-diesel-engine.jpg", "Marine diesel engine"),
  capFuelSystems: scene("/images/stock/injection-pump-test-bench-graded.jpg", "Fuel injection pump test bench with pressure gauges"),
  capPowerGeneration: plate("/images/brochure/generator-set.png", "Diesel generator set"),
  capTechnicalServices: scene("/images/stock/ship-propeller-in-dry-dock-graded.jpg", "Ship's ducted propeller in dry dock"),
} satisfies Record<string, Img>;
