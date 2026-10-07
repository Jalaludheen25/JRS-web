// Healing fill for removing lettering from photographs and video frames (scripts/retouch-vessel-names.mjs,
// scripts/build-hero-video.mjs). heal(img, op, seed) works in place on raw pixels { data, w, h, c }:
//   op.rect [x, y, w, h] or op.poly [[x, y], ...]  region to remove (op.grow px added round it, default 2);
//   op.detail [dx, dy] (+ op.detailWindow [xmin, xmax])  borrow fine texture from an offset patch, else matched grain;
//   op.block [[x0, y0, x1, y1], ...]  pixels never used as fill sources.
// The region is filled with a harmonic (Laplace) interpolation of its border, then texture is added back.
// Returns the bounding box [x, y, w, h] that was touched.

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r) => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());

function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function heal(img, op, seed) {
  const { data, w, h, c } = img;
  const poly = op.poly ?? [[op.rect[0], op.rect[1]], [op.rect[0] + op.rect[2], op.rect[1]], [op.rect[0] + op.rect[2], op.rect[1] + op.rect[3]], [op.rect[0], op.rect[1] + op.rect[3]]];
  const grow = op.grow ?? 2;
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const pad = grow + 12;
  const x0 = Math.max(1, Math.floor(Math.min(...xs)) - pad), x1 = Math.min(w - 2, Math.ceil(Math.max(...xs)) + pad);
  const y0 = Math.max(1, Math.floor(Math.min(...ys)) - pad), y1 = Math.min(h - 2, Math.ceil(Math.max(...ys)) + pad);
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
  const at = (x, y) => (y - y0) * bw + (x - x0);
  // Mask, grown by `grow` px.
  let mask = new Uint8Array(bw * bh);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inPoly(x + 0.5, y + 0.5, poly)) mask[at(x, y)] = 1;
  for (let g = 0; g < grow; g++) {
    const m2 = mask.slice();
    for (let y = y0 + 1; y < y1; y++) for (let x = x0 + 1; x < x1; x++) if (!mask[at(x, y)] && (mask[at(x - 1, y)] || mask[at(x + 1, y)] || mask[at(x, y - 1)] || mask[at(x, y + 1)])) m2[at(x, y)] = 1;
    mask = m2;
  }
  const px = (x, y, k) => data[(y * w + x) * c + k];
  const blocked = new Uint8Array(bw * bh);
  for (const [bx0, by0, bx1, by1] of op.block ?? [])
    for (let y = Math.max(y0, by0); y <= Math.min(y1, by1); y++) for (let x = Math.max(x0, bx0); x <= Math.min(x1, bx1); x++) if (!mask[at(x, y)]) blocked[at(x, y)] = 1;
  // Working buffer per channel; initial guess = average of the nearest unmasked pixel in the four directions.
  const buf = Array.from({ length: c }, () => new Float32Array(bw * bh));
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const i = at(x, y);
      for (let k = 0; k < c; k++) buf[k][i] = px(x, y, k);
      if (!mask[i]) continue;
      const hits = [];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        let xx = x, yy = y, d = 0;
        while (xx >= x0 && xx <= x1 && yy >= y0 && yy <= y1 && mask[at(xx, yy)]) { xx += dx; yy += dy; d++; }
        if (xx >= x0 && xx <= x1 && yy >= y0 && yy <= y1 && !blocked[at(xx, yy)]) hits.push([xx, yy, 1 / d]);
      }
      const ws = hits.reduce((s, q) => s + q[2], 0) || 1;
      for (let k = 0; k < c; k++) buf[k][i] = hits.reduce((s, [xx, yy, wt]) => s + px(xx, yy, k) * wt, 0) / ws;
    }
  // Harmonic fill (successive over-relaxation of Laplace's equation inside the mask).
  const iters = Math.min(1500, 300 + 4 * Math.max(bw, bh));
  for (let it = 0; it < iters; it++)
    for (let y = y0 + 1; y < y1; y++)
      for (let x = x0 + 1; x < x1; x++) {
        const i = at(x, y);
        if (!mask[i]) continue;
        const nb = [i - 1, i + 1, i - bw, i + bw].filter((j) => !blocked[j]);
        if (!nb.length) continue;
        for (let k = 0; k < c; k++) {
          const b = buf[k];
          let avg = 0;
          for (const j of nb) avg += b[j];
          b[i] += 1.85 * (avg / nb.length - b[i]);
        }
      }
  // Texture: high-pass detail from an offset patch, or grain matched to the ring around the hole.
  const r = rng(seed);
  const lum = (x, y) => (c >= 3 ? 0.299 * px(x, y, 0) + 0.587 * px(x, y, 1) + 0.114 * px(x, y, 2) : px(x, y, 0));
  const local = (x, y, k, rad) => {
    let s = 0, n = 0;
    for (let yy = y - rad; yy <= y + rad; yy++) for (let xx = x - rad; xx <= x + rad; xx++) { s += px(Math.min(w - 1, Math.max(0, xx)), Math.min(h - 1, Math.max(0, yy)), k); n++; }
    return s / n;
  };
  let sigma = 0;
  if (!op.detail) {
    const res = [];
    for (let y = y0 + 1; y < y1; y++)
      for (let x = x0 + 1; x < x1; x++) {
        if (mask[at(x, y)] || blocked[at(x, y)]) continue;
        let near = false;
        for (let d = 1; d <= 6 && !near; d++) for (const [dx, dy] of [[d, 0], [-d, 0], [0, d], [0, -d]]) { const xx = x + dx, yy = y + dy; if (xx >= x0 && xx <= x1 && yy >= y0 && yy <= y1 && mask[at(xx, yy)]) near = true; }
        if (!near) continue;
        const l = lum(x, y);
        const m = (lum(x - 1, y) + lum(x + 1, y) + lum(x, y - 1) + lum(x, y + 1)) / 4;
        res.push(Math.abs(l - m));
      }
    res.sort((a, b) => a - b);
    // Median absolute residual → noise level; ignores edges, ropes and foliage at the ring. Capped so a busy
    // surround never turns into visible speckle.
    sigma = res.length ? Math.min(5, 1.4826 * res[res.length >> 1] * 0.9) : 0;
  }
  // Soft noise field: white noise through a [1 2 1] filter, renormalised to unit variance.
  const raw = new Float32Array(bw * bh).map(() => gauss(r));
  const grain = new Float32Array(bw * bh);
  for (let y = 1; y < bh - 1; y++)
    for (let x = 1; x < bw - 1; x++) {
      const i = y * bw + x;
      let v = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) v += raw[i + dy * bw + dx] * (2 - Math.abs(dx)) * (2 - Math.abs(dy));
      grain[i] = v / 16 / 0.375;
    }
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const i = at(x, y);
      if (!mask[i]) continue;
      if (op.detail) {
        let sx = x + op.detail[0];
        if (op.detailWindow) {
          const [wx0, wx1] = op.detailWindow, W = wx1 - wx0, t = (((sx - wx0) % (2 * W)) + 2 * W) % (2 * W);
          sx = t < W ? wx0 + t : wx0 + 2 * W - t - 1;
        }
        sx = Math.min(w - 1, Math.max(0, sx));
        const sy = Math.min(h - 1, Math.max(0, y + op.detail[1]));
        for (let k = 0; k < c; k++) buf[k][i] += px(sx, sy, k) - local(sx, sy, k, 3);
      } else {
        const n = grain[i] * sigma;
        for (let k = 0; k < c; k++) buf[k][i] += n;
      }
    }
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const i = at(x, y);
      if (!mask[i]) continue;
      for (let k = 0; k < c; k++) data[(y * w + x) * c + k] = Math.max(0, Math.min(255, Math.round(buf[k][i])));
    }
  return [x0, y0, bw, bh];
}
