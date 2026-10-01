// The supplied logo PNG is blue artwork on an opaque white box. Derive a real alpha channel
// (blue #21409A on white ⇒ alpha ∝ 255 - R) and export transparent white and brand-blue versions.
import sharp from 'sharp';
const SRC = process.argv[2] ?? 'public/brand/jrs-logo.png';
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const alpha = Buffer.alloc(info.width * info.height);
for (let i = 0; i < alpha.length; i++) {
  const r = data[i * 3];
  alpha[i] = Math.max(0, Math.min(255, Math.round(((255 - r) * 255) / 222)));
}
const mk = (bg, out) =>
  sharp({ create: { width: info.width, height: info.height, channels: 3, background: bg } })
    .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
    .trim()
    .png({ compressionLevel: 9 })
    .toFile(out);
console.log(await mk('#ffffff', 'public/brand/jrs-logo-white.png'));
console.log(await mk('#21409a', 'public/brand/jrs-logo-blue.png'));
