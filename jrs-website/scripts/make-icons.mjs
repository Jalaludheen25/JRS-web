// Builds the favicon (src/app/icon.png, 512×512) and Apple touch icon (src/app/apple-icon.png, 180×180):
// the brand-blue logo centred on white.
// Run from jrs-website/: node scripts/make-icons.mjs
import sharp from "sharp";

for (const [file, size] of [["src/app/icon.png", 512], ["src/app/apple-icon.png", 180]]) {
  const logo = await sharp("public/brand/jrs-logo-blue.png").resize({ width: Math.round(size * 0.86) }).toBuffer();
  const { width, height } = await sharp(logo).metadata();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } })
    .composite([{ input: logo, left: Math.round((size - width) / 2), top: Math.round((size - height) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(file);
  console.log(file, size);
}
