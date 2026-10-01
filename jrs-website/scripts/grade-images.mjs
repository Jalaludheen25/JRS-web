// Produces monochrome navy-graded variants of marine scenes for the dark editorial sections.
import sharp from 'sharp';
const jobs = [
  ['open-sea-panorama', 2400], ['port-vessel-aerial', 1800], ['vessel-aerial-2', 1800],
  ['diesel-engine-detail', 2000], ['electrical-wiring', 1800], ['injector-pump-repair', 1600],
  ['engine-parts-dark', 1200],
];
for (const [name, w] of jobs) {
  const src = `public/images/scenes/${name}.jpg`;
  const out = await sharp(src).resize({ width: w, withoutEnlargement: true })
    .grayscale().linear(1.12, -14).tint({ r: 70, g: 98, b: 150 })
    .jpeg({ quality: 82, mozjpeg: true }).toFile(`public/images/scenes/${name}-graded.jpg`);
  console.log(name, out.width + 'x' + out.height, (out.size / 1024 | 0) + 'KB');
}
