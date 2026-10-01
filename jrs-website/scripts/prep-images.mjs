import sharp from 'sharp';
const S = process.argv[2], P='public/images';
const map = {
 'marine-engine-bearing-compressed.jpg':'products/engine-bearings.jpg',
 'cylinder-heads-and-components-compressed.jpg':'products/cylinder-heads-components.jpg',
 'marine-fuel-injection-systems-compressed.jpg':'products/fuel-injection-systems.jpg',
 'marine-pistons-and-piston-rings-compressed.jpg':'products/pistons-piston-rings.jpg',
 'Liners-and-Anti-Polishing-rings-compressed.jpg':'products/liners-anti-polishing-rings.jpg',
 'marine-filters-compressed.jpg':'products/marine-filters.jpg',
 'marine-turbochargers-and-cartridges-compressed.jpg':'products/turbocharger-cartridge.jpg',
 'marine-coolers-and-exchangers-compressed.jpg':'products/coolers-heat-exchangers.jpg',
 'Automatic-Voltage-Regulator-AVR.jpg':'products/automatic-voltage-regulators.jpg',
 'marine-engine-overhauls-compressed.jpg':'scenes/turbine-rotor-machining.jpg',
 '1374.jpg':'scenes/port-vessel-aerial.jpg',
 '1380-1-1-rotated.jpg':'scenes/vessel-aerial-2.jpg',
 'panoramic-view-sea-against-sky.jpg':'scenes/open-sea-panorama.jpg',
 'Untitled-design-14-scaled.jpg':'scenes/diesel-engine-detail.jpg',
 'Untitled-design-11-scaled.jpg':'scenes/banner-11.jpg',
 'Untitled-design-80-scaled.png':'scenes/banner-80.jpg',
 'man-connecting-engine-wiring_100kb.jpg':'scenes/electrical-wiring.jpg',
 'compressed_100kb.jpg':'scenes/compressed-100kb.jpg',
 'LOrange-Injectors-and-Pumps-Repair.jpg':'scenes/injector-pump-repair.jpg',
 'WhatsApp-Image-2025-01-24-at-11.24.52_cf8974d3.jpg':'scenes/workshop-1.jpg',
 'WhatsApp-Image-2025-01-24-at-11.24.51_447186f7.jpg':'scenes/workshop-2.jpg',
};
for (const [src,dst] of Object.entries(map)) {
  const m = await sharp(`${S}/img/${src}`).resize({width:2400,withoutEnlargement:true}).jpeg({quality:86,mozjpeg:true}).toFile(`${P}/${dst}`);
  console.log(dst, m.width+'x'+m.height, (m.size/1024|0)+'KB');
}
await sharp(`${S}/img/jrs-logo-1.png`).resize({width:720}).png().toFile('public/brand/jrs-logo.png');
await sharp(`${S}/img/jrs-logo.png`).resize({width:512}).png().toFile('public/brand/jrs-mark-square.png');
