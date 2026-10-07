// Removes vessel names, IMO numbers and port-of-registry lettering from the ship photographs the site uses, so no
// real, identifiable vessel appears on jrs-me.com. Each region is filled from its surroundings (a smooth harmonic fill
// across the hole, plus either matching film grain or the hull's own texture borrowed from a nearby patch), so the
// plating, shading and grain carry on unbroken. Both the colour file and its "-graded" twin are processed.
//
// Input: the files scripts/build-image-library.mjs generates (names as in its tables). Output: the cleaned image under
// a new name (`out`), which is what the site uses; the input is then deleted from public/, so no original with a
// legible name is deployed. The new names also mean no browser or CDN can keep serving a cached original.
// Re-run this script whenever build-image-library.mjs has regenerated the images; with nothing to do it does nothing.
// The hero film is handled separately (frame-by-frame healing of the port shot in scripts/build-hero-video.mjs).
//
// Run from jrs-website/: node scripts/retouch-vessel-names.mjs [--preview outDir]
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { heal } from "./lib/heal.mjs";

const args = process.argv.slice(2);
const pIdx = args.indexOf("--preview");
const preview = pIdx >= 0 ? args[pIdx + 1] : null;

// Regions in image pixels. rect: [x, y, w, h]; poly: [[x, y], ...]. grow: px added round the mask (letter edges).
// detail: [dx, dy] borrows fine texture from that offset (detailWindow: [xmin, xmax] keeps the source columns inside a
// clean strip, mirrored); otherwise grain matched to the surroundings is added.
// block: [[x0, y0, x1, y1], ...] pixels never used as fill sources (trees behind a hull edge, other lettering).
// Keys are generated file names; `out` is the cleaned file the site references.
const jobs = {
  // Insights / blog cards: harbour tug.
  "stock/tug-towing-container-ship": { out: "stock/harbour-tug-at-terminal", ops: [
    { poly: [[949, 1311], [1188, 1286], [1188, 1376], [949, 1376]], grow: 1, note: "name on bulwark" },
    { rect: [1290, 1052, 202, 27], note: "IMO number" },
    { poly: [[2050, 1288], [2090, 1288], [2147, 1394], [2098, 1394]], grow: 1, note: "name on bow" },
    { rect: [1742, 969, 44, 19], grow: 1, note: "name on life-raft canister" },
  ] },
  // Offshore supply vessel.
  "stock/offshore-supply-vessel": { out: "stock/offshore-supply-vessel-at-sea", ops: [
    { rect: [2000, 1216, 158, 38], note: "name and port on stern" },
    { rect: [366, 1000, 36, 20], grow: 1, note: "name on bow" },
    { rect: [446, 888, 68, 44], note: "operator emblem" },
  ] },
  // Car carrier with tug.
  "stock/car-carrier-with-tug": { out: "stock/car-carrier-and-tug", ops: [
    { poly: [[1024, 1024], [1198, 1016], [1198, 1060], [1024, 1068]], note: "name on bow" },
    { rect: [1410, 582, 68, 16], grow: 1, note: "name on bridge front" },
  ] },
  // Two tugs under way.
  "stock/tugboats-under-way": { out: "stock/harbour-tugs-under-way", ops: [
    { rect: [551, 1440, 132, 19], grow: 1, note: "IMO number" },
    { poly: [[1064, 1420], [1110, 1420], [1110, 1458], [1121, 1460], [1121, 1487], [1066, 1487]], grow: 0, note: "name and port" },
    { poly: [[1290, 1411], [1403, 1408], [1405, 1470], [1292, 1475]], note: "operator name on bow" },
  ] },
  // Vessel in dry dock.
  "stock/vessel-in-dry-dock": { out: "stock/vessel-bow-in-dry-dock", ops: [
    // Masks stop a pixel or two inside the hull edge so the fill takes the hull colour, not the trees behind.
    { rect: [484, 941, 69, 38], grow: 1, block: [[0, 900, 485, 1020]], note: "name, port side" },
    { poly: [[1086, 944], [1122, 944], [1133, 980], [1086, 980]], note: "name, starboard (left of mooring line)" },
    { poly: [[1129, 944], [1161, 944], [1161, 980], [1140, 980]], grow: 1, block: [[1161, 900, 1300, 1020]], note: "name, starboard (right of mooring line)" },
  ] },
  // Supply vessel beside the offshore platform.
  "stock/offshore-platform-crew-transfer": { out: "stock/supply-vessel-at-platform", ops: [
    { rect: [1865, 1476, 74, 11], grow: 1, note: "name on orange band" },
    { rect: [1774, 1506, 156, 62], detail: [160, 0], detailWindow: [1934, 2026], note: "fleet name and hull number" },
  ] },
  // Container ship at berth (Industries hub).
  "brochure/container-ship-at-berth-dusk": { out: "brochure/container-ship-under-cranes-dusk", ops: [
    { poly: [[680, 755], [1117, 794], [1117, 848], [680, 811]], note: "name on bow" },
    { rect: [1968, 990, 152, 70], detail: [-160, 0], note: "line name on hull" },
    { rect: [98, 680, 40, 18], grow: 1, note: "bow name board" },
    { rect: [166, 683, 50, 20], grow: 1, note: "bow name board" },
  ] },
};

// ── run ─────────────────────────────────────────────────────────────────────────────────────────
if (preview) fs.mkdirSync(preview, { recursive: true });
let done = 0, skipped = 0;
for (const [base, { out, ops }] of Object.entries(jobs)) {
  for (const variant of ["", "-graded"]) {
    const file = path.join("public/images", `${base}${variant}.jpg`);
    const dest = path.join("public/images", `${out}${variant}.jpg`);
    if (!fs.existsSync(file)) {
      if (fs.existsSync(dest)) skipped++;
      continue;
    }
    const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const before = preview ? Buffer.from(data) : null;
    const img = { data, w: info.width, h: info.height, c: info.channels };
    const boxes = ops.map((op, n) => heal(img, op, 1000 + n));
    await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
      .jpeg({ quality: 90, mozjpeg: true, progressive: true })
      .toFile(dest);
    fs.rmSync(file);
    done++;
    console.log(`${dest.padEnd(58)} ${ops.length} region(s)`);
    if (preview && !variant) {
      // Before/after crops of every region, side by side, for review.
      const raw = { raw: { width: info.width, height: info.height, channels: info.channels } };
      const tiles = [];
      for (const [x, y, bw, bh] of boxes) {
        const box = { left: Math.max(0, x - 30), top: Math.max(0, y - 30), width: Math.min(info.width - Math.max(0, x - 30), bw + 60), height: Math.min(info.height - Math.max(0, y - 30), bh + 60) };
        const k = Math.max(1, Math.min(4, Math.floor(520 / box.width)));
        const a = await sharp(before, raw).extract(box).resize(box.width * k, box.height * k, { kernel: "nearest" }).png().toBuffer();
        const b = await sharp(data, raw).extract(box).resize(box.width * k, box.height * k, { kernel: "nearest" }).png().toBuffer();
        tiles.push([a, b, box.width * k, box.height * k]);
      }
      const W = Math.max(...tiles.map((t) => t[2])) * 2 + 30, H = tiles.reduce((s, t) => s + t[3] + 10, 10);
      let yy = 10;
      const comps = [];
      for (const [a, b, tw, th] of tiles) { comps.push({ input: a, left: 10, top: yy }, { input: b, left: 20 + tw, top: yy }); yy += th + 10; }
      await sharp({ create: { width: W, height: H, channels: 3, background: "#ff00ff" } }).composite(comps).png().toFile(path.join(preview, `${path.basename(base)}.png`));
    }
  }
}
console.log(`${done} file(s) retouched, ${skipped} already done`);
