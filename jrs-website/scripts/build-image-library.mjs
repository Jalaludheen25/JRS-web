// Builds the site's image library so every page and homepage section has its own picture.
//  1. Brochure images (JRS Company / Product Profile PDFs, extracted by extract-pdf-images.mjs) → public/images/brochure/
//  2. CC0 / public-domain photos from Wikimedia Commons (found via Openverse) → public/images/stock/
//  3. Navy monochrome "-graded" variants for dark scene sections (docs/03-design-system.md)
//  4. ../docs/05-image-credits.md listing the source and licence of every third-party photo
// Idempotent: downloads are cached. Run from jrs-website/: node scripts/build-image-library.mjs
import fs from "fs";
import path from "path";
import sharp from "sharp";

const PDF = "../docs/source-pdf/extracted";
const BROCHURE = "public/images/brochure";
const STOCK = "public/images/stock";
const CACHE = "../docs/source-stock";
for (const d of [BROCHURE, STOCK, CACHE]) fs.mkdirSync(d, { recursive: true });

const UA = "JRS-website-build/1.0 (https://jrs-me.com)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Monochrome navy grade used across all scene photography.
const grade = (img) => img.grayscale().linear(1.12, -14).tint({ r: 70, g: 98, b: 150 });

// ── 1. Brochure images ──────────────────────────────────────────────────────
// [source name, output name, kind] — "cutout" keeps alpha (PNG), "photo" → JPEG, "scene" → JPEG + graded variant.
const brochure = [
  ["company-profile-p01-199", "container-ship-at-sea-aerial", "scene"],
  ["company-profile-p02-23", "container-ship-with-tug-aerial", "scene"],
  ["company-profile-p09-140", "container-ship-at-berth-dusk", "scene"],
  ["product-profile-p09-69", "engine-room-control-panel", "scene"],
  ["product-profile-p10-83", "governor-test-bench", "scene"],
  ["product-profile-p11-88", "marine-fuel-injector-service", "scene"],
  ["product-profile-p11-89", "alternator-repair", "scene"],
  ["product-profile-p08-63", "marine-diesel-engine", "photo"],
  ["product-profile-p08-64", "marine-turbocharger", "photo"],
  ["product-profile-p03-19", "engine-bearing-shells", "photo"],
  ["product-profile-p01-150", "generator-set", "cutout"],
  ["product-profile-p09-71", "rotary-fuel-injection-pump", "cutout"],
  ["product-profile-p07-56", "automatic-voltage-regulators", "cutout"],
  ["product-profile-p07-58", "genset-controllers-amf", "cutout"],
];

for (const [src, name, kind] of brochure) {
  if (kind === "cutout") {
    let img = sharp(path.join(PDF, `${src}.png`)).trim({ threshold: 1 });
    // The genset render carries a floor reflection below the unit; keep the machine only.
    if (name === "generator-set") {
      const m = await sharp(path.join(PDF, `${src}.png`)).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
      img = sharp(m.data).extract({ left: 0, top: 0, width: m.info.width, height: Math.round(m.info.height * 0.66) });
    }
    await img.resize({ width: 1600, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(path.join(BROCHURE, `${name}.png`));
  } else {
    let base = sharp(path.join(PDF, `${src}.jpg`)).resize({ width: 2400, withoutEnlargement: true });
    // Studio product shots sit on #EFEFEF; lift that backdrop to pure white so it disappears on white plates.
    if (kind === "photo") base = base.linear(255 / 239, 0);
    await base.clone().jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(BROCHURE, `${name}.jpg`));
    if (kind === "scene") await grade(base.clone()).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(BROCHURE, `${name}-graded.jpg`));
  }
  console.log("brochure", name);
}

// ── 2. CC0 / public-domain photography (Wikimedia Commons) ────────────────────
const stock = [
  { name: "offshore-platform-at-dusk", title: "Holstein at Dusk", creator: "GuavaTrain", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/2/25/Holstein_at_Dusk.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=144850842" },
  { name: "offshore-platform-crew-transfer", title: "Oil Platform Crew Transfer", creator: "GuavaTrain", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/2/27/Oil_Platform_Crew_Transfer.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=144849921" },
  { name: "offshore-supply-vessel", title: "OSV Connor Bordelon", creator: "GuavaTrain", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/OSV_Connor_Bordelon.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=158231747" },
  { name: "ship-diesel-generator", title: "M V GUARDO Diesel Generator for Shipboard Electricity", creator: "Gary Todd", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/M_V_GUARDO_Diesel_Generator_for_Shipboard_Electricity_%2810666621304%29.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=109099047" },
  { name: "ship-engine-room-machinery", title: "Engine room, Fragata Sarmiento, Buenos Aires", creator: "Hermann Luyken", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/0/02/2011.10.17.153541_Engine_room_Fragata_Sarmiento_Puerto_Madero_Buenos_Aires.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=19738954" },
  { name: "outboard-motor-fuel-system", title: "VST and fuel cooler of a Tohatsu MFS30B outboard motor", creator: "PtiBzh", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/VST_and_fuel_cooler_of_a_Tohatsu_MFS30B_outboard_motor.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=97814846" },
  { name: "boats-with-outboard-motors", title: "Outboard motors on boats in Norra Hamnen, Lysekil", creator: "W.carter", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Outboard_motors_on_boats_in_Norra_Hamnen%2C_Lysekil_2.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=87368274" },
  { name: "vessel-in-dry-dock", title: "Pacific Runner, dry dock Lyttelton", creator: "Bernard Spragg", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/1/10/Pacific_Runner._Dry_dock_Lyttelton_%2848377446646%29.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=103436370" },
  { name: "ship-propeller-in-dry-dock", title: "Union 5 in dry-dock of Antwerp", creator: "Alf van Beem", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Union_5_in_dry-dock_of_Antwerp_pic4.JPG", landing: "https://commons.wikimedia.org/w/index.php?curid=19187318" },
  { name: "engineering-machine-shop", title: "Nevada Northern Railway Museum Machine Shop", creator: "Thomas Farley", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/0/02/Nevada_Northern_Railway_Museum_Machine_Shop.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=89568271" },
  { name: "turbocharger-cutaway", title: "Mitsubishi twin-scroll turbo", creator: "DmitryKo", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Mitsubishi_twin-scroll_turbo.JPG", landing: "https://commons.wikimedia.org/w/index.php?curid=21007073" },
  { name: "cummins-generator-set", title: "Power generator of a hospital data center", creator: "Mikael Häggström", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Power_generator_of_a_hospital_data_center.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=154988894" },
  { name: "diesel-cylinder-head", title: "Cylinder head from Toyota Diesel Engine", creator: "Ll1324", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Cylinder_head_from_Toyota_Diesel_Engine_Coaster.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=39714000" },
  { name: "six-cylinder-diesel-engine", title: "Weichai WP12NG six-cylinder engine", creator: "Spielvogel", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Weichai_WP_12NG._6_cylinders_truck_engine._Spielvogel.JPG", landing: "https://commons.wikimedia.org/w/index.php?curid=25146066" },
  { name: "injection-pump-test-bench", title: "Old bench at the Den Hartog Ford museum", creator: "Alf van Beem", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/2/20/Old_bench_at_the_Den_Hartog_Ford_museum_pic2.JPG", landing: "https://commons.wikimedia.org/w/index.php?curid=24749887" },
  { name: "diesel-generator-engine", title: "Stadco diesel generator", creator: "Self-photographed (Wikimedia Commons)", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Pioneer_001_train_interior_-_Stadco_diesel_generator_%282%29.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=106850559" },
  { name: "tug-towing-container-ship", title: "Union Jade pulling Maersk Idaho, Port of Antwerp", creator: "Alf van Beem", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Union_Jade_%28tugboat%2C_2007%29_pulling_Maersk_Idaho_Port_of_Antwerp_pic2.JPG", landing: "https://commons.wikimedia.org/w/index.php?curid=46760545" },
  { name: "car-carrier-with-tug", title: "DREAM ORCHID, car carrier", creator: "Bernard Spragg", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/0/09/DREAM_ORCHID._Car_carrier.%2A_%2827921843029%29.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=138723139" },
  { name: "tugboats-under-way", title: "Tugboats Boss and Svitzer Hymer leaving Lahälla", creator: "W.carter", license: "CC0", url: "https://upload.wikimedia.org/wikipedia/commons/9/92/Tugboats_Boss_and_Svitzer_Hymer_leaving_Lah%C3%A4lla_4.jpg", landing: "https://commons.wikimedia.org/w/index.php?curid=60282857" },
];

for (const s of stock) {
  const original = path.join(CACHE, `${s.name}${path.extname(new URL(s.url).pathname).toLowerCase() || ".jpg"}`);
  if (!fs.existsSync(original)) {
    for (let attempt = 0; attempt < 5; attempt++) {
      await sleep(1500);
      const res = await fetch(s.url, { headers: { "user-agent": UA } });
      if (res.ok) {
        fs.writeFileSync(original, Buffer.from(await res.arrayBuffer()));
        break;
      }
      if (res.status !== 429) throw new Error(`${res.status} ${s.url}`);
      await sleep(8000 * (attempt + 1));
    }
  }
  const base = sharp(original).rotate().resize({ width: 2400, withoutEnlargement: true });
  await base.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(STOCK, `${s.name}.jpg`));
  await grade(base.clone()).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(STOCK, `${s.name}-graded.jpg`));
  const m = await sharp(path.join(STOCK, `${s.name}.jpg`)).metadata();
  s.size = `${m.width}×${m.height}`;
  console.log("stock", s.name, s.size);
}

// ── 4. Credits ───────────────────────────────────────────────────────────────
const rows = stock.map((s) => `| \`/images/stock/${s.name}.jpg\` | ${s.title} | ${s.creator} | ${s.license} | [Wikimedia Commons](${s.landing}) |`).join("\n");
fs.writeFileSync(
  "../docs/05-image-credits.md",
  `# 05 — Image Sources & Credits

Generated by \`jrs-website/scripts/build-image-library.mjs\`.

## JRS's own material
- \`/images/products/*\` and \`/images/legacy/*\`: images from the current jrs-me.com website.
- \`/images/brochure/*\`: images extracted from the JRS Company Profile and Product Profile PDFs (\`docs/source-pdf/\`).
- \`/images/makes/*\` (engine-maker logos) and \`/images/certifications/*\` (ISO / ICV badges, Interstate-McBee logo):
  from the previous jrs-me.com website and the company profile, processed by \`scripts/build-logo-assets.mjs\`. Originals
  and URLs: \`docs/source-logos/\`. Maker logos are reference marks only and are always shown with the reference-only
  disclaimer.
- \`/images/spare-parts/*\` (replacement spare-parts tiles): studio renders made for this site by
  \`scripts/render-parts.mjs\` from procedural 3D models (\`scripts/parts-3d/\`); no third-party rights. Illustrative of each
  part type, not photographs of specific stock.
- \`/images/turbo-makes/*\` (turbocharger-make logos): MAN from the previous site; ABB, IHI and Mitsubishi from Wikimedia
  Commons (public-domain logo files, trademarked); Napier and KBB from the manufacturers' own websites. Sources:
  \`docs/source-logos/sources.json\` → \`turbo\`. Shown as reference marks with the same disclaimer.

## Third-party photography (CC0 / public domain)
These photos are dedicated to the public domain (CC0). They may be used commercially without attribution. They are credited here for traceability.
They are **illustrative**: none of them shows JRS's own premises, staff or customers, and the site never captions them as such.
Replace them with JRS's own photography when it becomes available.

| File | Original title | Author | Licence | Source |
|---|---|---|---|---|
${rows}
`,
);
console.log("credits written");
