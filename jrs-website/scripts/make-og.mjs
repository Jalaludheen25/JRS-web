// Builds the default 1200x630 Open Graph image from the graded hero photo and the logo.
import sharp from 'sharp';
const logo = await sharp('public/brand/jrs-logo-white.png').resize({ width: 300 }).toBuffer();
const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<rect width="1200" height="630" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#060a14" stop-opacity=".95"/><stop offset=".7" stop-color="#060a14" stop-opacity=".2"/></linearGradient></defs>
<rect x="66" y="372" width="56" height="4" fill="#f2c230"/>
<text x="64" y="470" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="76" letter-spacing="-3" fill="#fff">ENGINEERED FOR <tspan fill="#f2c230">UPTIME.</tspan></text>
<text x="66" y="530" font-family="Courier New, monospace" font-size="19" letter-spacing="3" fill="#b6bfcb">MARINE ENGINE SPARE PARTS &amp; TECHNICAL SOLUTIONS — ABU DHABI</text>
</svg>`);
await sharp('public/images/scenes/open-sea-panorama-graded.jpg').resize(1200, 630, { fit: 'cover', position: 'right' })
  .composite([{ input: text }, { input: logo, top: 56, left: 56 }]).jpeg({ quality: 84 }).toFile('public/images/og/jrs-og.jpg');
console.log('og ok');
