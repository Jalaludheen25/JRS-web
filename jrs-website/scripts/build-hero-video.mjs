// Builds the homepage hero reel from the CC0 / public-domain clips in ../docs/source-video/
// (fetched by fetch-hero-footage.mjs).
//
//  1. Cuts each shot, normalises it to 30 fps, applies the site's cool navy grade, crops for the target orientation.
//  2. Dissolves the shots together and makes the loop seamless (the last shot dissolves back into the first).
//  3. Encodes landscape 1080p / 720p and portrait 720×1280 in AV1 (smallest) and H.264 (universal fallback),
//     plus matching poster stills (the reel's first frame) for instant first paint and as the no-video fallback.
//  4. Writes src/content/hero-reel.json (scene timings for the on-screen caption) and ../docs/06-hero-film.md
//     (sources, licences, deliverables).
//
// Run from jrs-website/: node scripts/build-hero-video.mjs [--preview | --doc]
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import sharp from "sharp";

const SRC = "../docs/source-video";
// Intermediates (graded shots, lossless masters) are large and reproducible: kept in a git-ignored cache.
const TMP = ".cache/hero-build";
const OUT = "public/video";
const POSTERS = "public/images/hero";
for (const d of [TMP, OUT, POSTERS]) fs.mkdirSync(d, { recursive: true });

const sources = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(SRC, "sources.json"), "utf8")).map((s) => [s.id, s]));
sources["jrs-port"] = { file: "public/video/hero-colour.mp4" };

// Story: ocean → port → vessel machinery → engine → precision machining → fabrication → (loops to ocean).
// in = source second, dur = seconds on screen, speed < 1 = slowed, fx = horizontal focus for portrait crops.
// "jrs-port" is the aerial port montage supplied by JRS (public/video/hero-colour.mp4, five 1.5 s shots);
// its shots are slowed to half speed with motion-compensated interpolation to match the reel's pace.
const shots = [
  { id: "cargo-ship-at-sea", in: 1.0, dur: 4.0, speed: 1, fx: 0.47, caption: "Vessel under way" },
  { id: "jrs-port", in: 1.55, dur: 2.8, speed: 0.5, interp: true, fx: 0.55, caption: "Container terminal" },
  { id: "jrs-port", in: 3.05, dur: 2.8, speed: 0.5, interp: true, fx: 0.42, caption: "Port & harbour" },
  { id: "jrs-port", in: 4.55, dur: 2.8, speed: 0.5, interp: true, fx: 0.5, caption: "Port logistics" },
  { id: "lpg-carrier", in: 60.0, dur: 3.8, speed: 1, fx: 0.45, caption: "Deck machinery" },
  { id: "ship-engine-motion", in: 12.0, dur: 3.8, speed: 0.8, fx: 0.5, caption: "Marine engine" },
  { id: "ship-engine-crankshaft", in: 2.0, dur: 3.8, speed: 0.8, fx: 0.55, caption: "Crankshaft & connecting rods" },
  { id: "lathe-drilling-gear", in: 8.0, dur: 3.8, speed: 0.85, fx: 0.34, caption: "Precision machining" },
  // The NASA machine-shop source has a magenta cast; 'fix' neutralises it before the grade.
  { id: "cnc-milling", in: 63.0, dur: 3.8, speed: 1, fx: 0.55, caption: "CNC milling", fix: "colorbalance=rs=-0.05:gs=0.06:bs=-0.03:rm=-0.07:gm=0.07:bm=-0.03:rh=-0.04:gh=0.04:bh=-0.02" },
  { id: "welding-sparks", in: 9.0, dur: 3.6, speed: 1, fx: 0.48, caption: "Fabrication & repair" },
];
const XF = 0.9; // dissolve length (s)
const FPS = 30;

// Bright, natural-colour grade: the film is the hero and is shown fully clear, with no overlay or mask.
// A touch more contrast and saturation, a slight lift in the midtones, and light sharpening so the
// 720p sources hold up at full screen. No tint, desaturation, vignette or darkening.
const GRADE = [
  "eq=contrast=1.06:saturation=1.12:gamma=1.04",
  "unsharp=5:5:0.3:5:5:0",
].join(",");

const run = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: ["ignore", "inherit", "inherit"] });

function cutShot(s, i, orientation) {
  const src = sources[s.id];
  const out = path.join(TMP, `${orientation}-${String(i).padStart(2, "0")}.mkv`);
  const srcDur = s.dur * s.speed + 0.1;
  const frame =
    orientation === "landscape"
      ? "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080"
      : // 9:16 window from the 16:9 frame, positioned on the shot's subject, then scaled to 1080×1920 master.
        `scale=-2:1920:flags=lanczos,crop=1080:1920:'max(0,min(iw-1080,iw*${s.fx}-540))':0`;
  run([
    "-ss", String(s.in), "-t", srcDur.toFixed(2), "-i", src.file, "-an",
    // Interpolated shots are framed first (cheaper), then motion-interpolated to keep slow motion smooth.
    "-vf", s.interp
      ? `${frame},minterpolate=fps=${FPS / s.speed}:mi_mode=mci:mc_mode=aobmc:vsbmc=1,setpts=${(1 / s.speed).toFixed(4)}*PTS,fps=${FPS},${s.fix ? s.fix + "," : ""}${GRADE},setsar=1,format=yuv420p,trim=duration=${s.dur}`
      : `setpts=${(1 / s.speed).toFixed(4)}*PTS,fps=${FPS},${frame},${s.fix ? s.fix + "," : ""}${GRADE},setsar=1,format=yuv420p,trim=duration=${s.dur}`,
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "12", "-g", "15", out,
  ]);
  return out;
}

function reel(orientation) {
  const parts = shots.map((s, i) => cutShot(s, i, orientation));
  // Append the first shot again so the final dissolve lands back on the opening frame.
  const inputs = [...parts, parts[0]];
  const durs = [...shots.map((s) => s.dur), shots[0].dur];
  let filter = "";
  let prev = "[0:v]";
  let acc = durs[0];
  for (let k = 1; k < inputs.length; k++) {
    const offset = acc - XF;
    const label = k === inputs.length - 1 ? "[chain]" : `[x${k}]`;
    filter += `${prev}[${k}:v]xfade=transition=fade:duration=${XF}:offset=${offset.toFixed(3)}${label};`;
    prev = label;
    acc = offset + durs[k];
  }
  // Seamless loop: start one dissolve-length in, end exactly where the appended copy reaches that same frame.
  const loopLen = shots.reduce((t, s) => t + s.dur, 0) - shots.length * XF;
  filter += `[chain]trim=start=${XF}:duration=${loopLen.toFixed(3)},setpts=PTS-STARTPTS[v]`;
  const master = path.join(TMP, `${orientation}-master.mkv`);
  run([...inputs.flatMap((p) => ["-i", p]), "-filter_complex", filter, "-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "10", master]);
  return { master, loopLen };
}

function encode(master, name, size) {
  // Very light temporal denoise: trims codec-unfriendly shimmer while keeping the film crisp.
  const scale = `scale=${size}:flags=lanczos,hqdn3d=1.5:1.5:4:4`;
  // H.264 High: plays everywhere. Keyframe every 2 s keeps looping and seeking smooth.
  run(["-i", master, "-an", "-vf", scale, "-c:v", "libx264", "-preset", "slow", "-crf", name.includes("1080") ? "32" : "33", "-tune", "film",
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-g", String(FPS * 2), "-movflags", "+faststart", path.join(OUT, `${name}.mp4`)]);
  // AV1: ~40–50% smaller where supported (Chrome, Firefox, Edge, Safari on AV1 hardware).
  run(["-i", master, "-an", "-vf", scale, "-c:v", "libsvtav1", "-preset", "5", "-crf", name.includes("1080") ? "46" : "47",
    "-g", String(FPS * 2), "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(OUT, `${name}-av1.mp4`)]);
}

async function poster(master, name, width) {
  const png = path.join(TMP, `${name}.png`);
  run(["-i", master, "-frames:v", "1", png]);
  await sharp(png).resize({ width }).jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(path.join(POSTERS, `${name}.jpg`));
}

function writeDoc() {
  const used = [...new Set(shots.map((s) => s.id))];
  const rows = used
    .map((id) => {
      const s = sources[id];
      const captions = shots.filter((x) => x.id === id).map((x) => x.caption).join(", ");
      if (id === "jrs-port") return `| JRS-supplied aerial port montage (\`public/video/hero-colour.mp4\`) | ${captions} | Supplied by JRS | — |`;
      return `| ${s.title.replace("File:", "")} | ${captions} | ${s.license} | [Wikimedia Commons](${s.page}) |`;
    })
    .join("\n");
  const files = fs.existsSync(OUT)
    ? fs.readdirSync(OUT).filter((f) => f.startsWith("hero-") && f !== "hero-colour.mp4").map((f) => `| \`/video/${f}\` | ${(fs.statSync(path.join(OUT, f)).size / 1e6).toFixed(2)} MB |`).join("\n")
    : "";
  fs.writeFileSync(
    "../docs/06-hero-film.md",
    `# 06 — Homepage Hero Film

Generated by \`jrs-website/scripts/build-hero-video.mjs\`. Component: \`src/components/home/HeroVideo.tsx\`.

A ${shots.length}-scene, ${(shots.reduce((t, s) => t + s.dur, 0) - shots.length * XF).toFixed(1)}-second seamless loop. The story runs open sea → port → deck machinery → marine engine →
crankshaft → precision machining → CNC milling → fabrication, then dissolves back to the open sea. Every shot gets the
same bright, natural-colour grade (slightly lifted contrast, saturation and midtones, light sharpening). No audio.

## Readability without an overlay

Only a light overlay sits over the film: a thin heritage-navy (#021343) wash, ~34% at the top, ~8–10% through the
middle and ~46% at the bottom. There is no vignette, grain, grid or frosted layer. Text stays legible through:
- \`.text-legible\` / \`.text-legible-strong\` (globals.css): a tight contact shadow plus a soft halo on the headline, label, copy, phone link and transparent navigation;
- solid, opaque controls: the yellow "Request a quote" and white "Explore solutions" buttons, plus the film-control pill (pause/play, scene caption, progress).

## Sources

All third-party footage is **CC0 or public domain**, so the site has no attribution obligation; it is listed here for
traceability. The footage is illustrative: none of it shows JRS premises, staff or customers, and the on-screen captions
only describe what is visible.

| Source | Scenes | Licence | Link |
|---|---|---|---|
${rows}

## Deliverables

| File | Size |
|---|---|
${files}
| \`/images/hero/hero-poster.jpg\` (landscape poster, first frame) | — |
| \`/images/hero/hero-poster-portrait.jpg\` (portrait poster, first frame) | — |

## Loading and playback

- The poster still is server-rendered with \`fetchpriority="high"\`; it is the LCP element and the no-video fallback.
- The video is requested only after the \`load\` event, when the browser is idle. It fades in once it is playing.
- Portrait screens get the 720×1280 cut (re-framed per shot). Landscape screens under 1280px get 720p; larger ones get 1080p.
  AV1 is offered first and H.264 second.
- No video at all for \`prefers-reduced-motion\`, Save-Data or 2G-class connections. If autoplay is refused (e.g. iOS
  Low Power Mode), the poster stays.
- Playback pauses when the hero is off-screen or the tab is hidden. A pause/play control (WCAG 2.2.2) and a scene caption with
  a progress line sit in the hero's bottom bar.
- \`/video/*\` is served with \`Cache-Control: public, max-age=604800, stale-while-revalidate=86400\` and byte-range support.
`,
  );
}

if (process.argv.includes("--doc")) {
  writeDoc();
  console.log("wrote ../docs/06-hero-film.md");
  process.exit(0);
}

if (process.argv.includes("--preview")) {
  // Graded mid-frame of every shot in both orientations, for checking crops and grade before a full build.
  const tiles = [];
  for (const [i, s] of shots.entries()) {
    for (const o of ["landscape", "portrait"]) {
      const clip = cutShot({ ...s, dur: Math.min(1.2, s.dur) }, i, o);
      const png = path.join(TMP, `prev-${o}-${i}.png`);
      run(["-i", clip, "-frames:v", "1", png]);
      tiles.push(await sharp(png).resize(o === "landscape" ? { width: 480, height: 270 } : { width: 152, height: 270 }).toBuffer());
    }
  }
  const W = 480 + 152 + 8;
  await sharp({ create: { width: W * 2, height: 278 * Math.ceil(shots.length / 2), channels: 3, background: "#222" } })
    .composite(tiles.map((t, j) => {
      const shot = Math.floor(j / 2), col = shot % 2, row = Math.floor(shot / 2), portrait = j % 2;
      return { input: t, left: col * W + (portrait ? 488 : 0), top: row * 278 };
    }))
    .jpeg({ quality: 82 }).toFile(path.join(TMP, "preview.jpg"));
  console.log("preview:", path.resolve(TMP, "preview.jpg"));
  process.exit(0);
}

const L = reel("landscape");
const P = reel("portrait");
encode(L.master, "hero-1080", "1920:1080");
encode(L.master, "hero-720", "1280:720");
encode(P.master, "hero-portrait", "720:1280");
await poster(L.master, "hero-poster", 1920);
await poster(P.master, "hero-poster-portrait", 900);

// Scene timings for the caption ticker (start time of each shot within the looped reel).
let t = -XF;
const scenes = shots.map((s, i) => {
  const start = i === 0 ? 0 : t;
  t += s.dur - XF;
  return { start: Number(Math.max(0, start + (i === 0 ? 0 : XF / 2)).toFixed(2)), caption: s.caption };
});
fs.writeFileSync("src/content/hero-reel.json", JSON.stringify({ duration: Number(L.loopLen.toFixed(3)), scenes }, null, 1) + "\n");

for (const f of fs.readdirSync(OUT)) console.log(f.padEnd(26), (fs.statSync(path.join(OUT, f)).size / 1e6).toFixed(2), "MB");
for (const f of fs.readdirSync(POSTERS)) console.log(f.padEnd(26), (fs.statSync(path.join(POSTERS, f)).size / 1e3).toFixed(0), "KB");
console.log("loop length", L.loopLen.toFixed(2), "s");
writeDoc();
