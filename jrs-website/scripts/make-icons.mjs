// Builds the favicon (src/app/icon.png, 512×512) and Apple touch icon (src/app/apple-icon.png, 180×180):
// the brand-blue logo centred on white. Also trims the supplied WhatsApp badge (public/images/whatsapp-logo.webp,
// 1920px with a wide transparent margin) to public/images/whatsapp-badge.webp, 384×384, for the site's WhatsApp icons.
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

// WhatsApp badge: the supplied logo unchanged, with its transparent margin trimmed so the circle fills its box.
{
  const trimmed = await sharp("public/images/whatsapp-logo.webp").trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  const side = Math.max(trimmed.info.width, trimmed.info.height);
  await sharp(trimmed.data)
    .resize(384, 384, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: "lanczos3" })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile("public/images/whatsapp-badge.webp");
  console.log("public/images/whatsapp-badge.webp 384 (trimmed from", side, "px)");
}
