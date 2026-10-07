// Procedural models of the replacement spare parts (millimetre units, Y up, parts resting on y = 0).
// Each entry: build() → THREE.Group, view → camera azimuth / elevation for studio.js.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";

const SEG = 192;

// ── materials ───────────────────────────────────────────────────────────────────────────────────
const metal = (color, roughness, extra = {}) => new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness, ...extra });
const M = {
  aluminium: () => metal(0xd3d8df, 0.24),
  polished: () => metal(0xdfe3e9, 0.1),
  steel: () => metal(0xb9bfc8, 0.22),
  satin: () => metal(0xa9b0ba, 0.34),
  darkSteel: () => metal(0x50565f, 0.3),
  blackOxide: () => metal(0x2f343b, 0.34),
  bore: () => metal(0x8c939d, 0.38),
  castIron: () => metal(0x6c727b, 0.5),
  heatTint: () => metal(0x9a8f88, 0.3),
  bronze: () => metal(0xc0915f, 0.28),
  zinc: () => metal(0xc9ced4, 0.3),
  paint: (c = 0x3d4a5e) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.15, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.35 }),
  media: () => new THREE.MeshPhysicalMaterial({ color: 0xe9e6dd, metalness: 0, roughness: 0.82, sheen: 0.4, sheenColor: 0xffffff }),
  rubber: () => new THREE.MeshPhysicalMaterial({ color: 0x1c1f24, metalness: 0, roughness: 0.62 }),
};

// ── geometry helpers ────────────────────────────────────────────────────────────────────────────
// Lathe from "strips": each strip is smooth-shaded along its own points; strips meet at sharp creases.
function lathe(strips, { segments = SEG, phiStart = 0, phiLength = Math.PI * 2 } = {}) {
  const geos = strips.map((s) => new THREE.LatheGeometry(s.map(([r, y]) => new THREE.Vector2(Math.max(r, 0), y)), segments, phiStart, phiLength));
  return mergeGeometries(geos.map((g) => g.toNonIndexed()));
}
// Profile helper: a polyline of [r, y] points becomes strips, one per segment (all creases sharp).
const sharp = (pts) => pts.slice(1).map((p, i) => [pts[i], p]);
const cyl = (r, h, seg = 96) => new THREE.CylinderGeometry(r, r, h, seg, 1).toNonIndexed();
const box = (x, y, z) => new THREE.BoxGeometry(x, y, z).toNonIndexed();

const evaluator = new Evaluator();
evaluator.attributes = ["position", "normal", "uv"];
evaluator.useGroups = true;
function brush(geo, mat, fn) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const b = new Brush(g, mat);
  fn?.(b);
  b.updateMatrixWorld();
  return b;
}
// Subtract cutters (array of {geo, mat?, at:[x,y,z], rot:[x,y,z]}) from a mesh geometry.
function cut(geo, mat, cutters, cutMat) {
  let a = brush(geo, mat);
  for (const c of cutters) {
    const b = brush(c.geo, c.mat ?? cutMat ?? mat, (m) => {
      if (c.at) m.position.set(...c.at);
      if (c.rot) m.rotation.set(...c.rot);
    });
    a = evaluator.evaluate(a, b, SUBTRACTION);
  }
  return a;
}
function mesh(geo, mat, { at, rot, scale } = {}) {
  const m = geo.isObject3D ? geo : new THREE.Mesh(geo, mat);
  if (at) m.position.set(...at);
  if (rot) m.rotation.set(...rot);
  if (scale) m.scale.setScalar(scale);
  return m;
}
const deg = THREE.MathUtils.degToRad;

// ── pistons ─────────────────────────────────────────────────────────────────────────────────────
function pistonProfile() {
  const grooves = [[62, 68, 45.6], [74, 77.2, 45.4], [82.5, 85.7, 45.3], [91, 94.4, 45.2]];
  const pts = [[0, 0], [46, 0], [49.2, 2.2], [49.45, 62]];
  const lands = [49.3, 49.2, 49.1, 48.9];
  grooves.forEach(([y0, y1, r], i) => {
    if (i > 0) pts.push([lands[i - 1], y0]);
    pts.push([r, y0], [r, y1], [lands[i], y1]);
  });
  pts.push([48.7, 106.5], [47.2, 108], [33, 108]);
  const strips = sharp(pts);
  strips.push([[33, 108], [32, 107.2], [30.5, 105.2], [28, 102.6], [24, 100.3], [19, 99], [14, 98.9], [10, 99.6], [6, 100.8], [3, 101.5], [0, 101.7]]);
  return strips;
}
function piston(mat) {
  const body = lathe(pistonProfile());
  const cutters = [{ geo: cyl(15, 140, 96), at: [0, 40, 0], rot: [0, 0, Math.PI / 2] }];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
    cutters.push({ geo: cyl(1.5, 14, 24), at: [Math.cos(a) * 46, 65, Math.sin(a) * 46], rot: [0, -a, Math.PI / 2] });
  }
  // Pin-boss relief: shallow counterbore around the pin bore on both sides.
  cutters.push({ geo: cyl(19, 10, 96), at: [54.5, 40, 0], rot: [0, 0, Math.PI / 2] }, { geo: cyl(19, 10, 96), at: [-54.5, 40, 0], rot: [0, 0, Math.PI / 2] });
  return cut(body, mat, cutters, M.bore());
}

// ── valves ──────────────────────────────────────────────────────────────────────────────────────
function valve(headMat, stemMat, s = 1) {
  const head = [
    [[0, 0], [20, 0.4], [28, 0.9]],
    [[28, 0.9], [31.5, 2.2]],
    [[31.5, 2.2], [31.5, 5]],
    [[31.5, 5], [27, 9.5]],
    [[27, 9.5], [23, 11.2], [18, 13.6], [14, 16.5], [10.8, 20.5], [8.6, 25.5], [7.3, 31], [6.7, 36.5], [6.5, 42]],
  ];
  const stem = sharp([[6.5, 42], [6.5, 196], [5.3, 197.2], [5.3, 200], [6.5, 201.2], [6.5, 204], [5.3, 205.2], [5.3, 208], [6.5, 209.2], [6.5, 213], [5.6, 214.2], [0, 214.2]]);
  const g = new THREE.Group();
  g.add(mesh(lathe(head), headMat), mesh(lathe(stem, { segments: 96 }), stemMat));
  g.scale.setScalar(s);
  return g;
}

// ── springs ─────────────────────────────────────────────────────────────────────────────────────
// Helical spring along +Y: coil radius r, height h, `turns` coils, wire radius w; end coils closed.
function spring(r, h, turns, w, mat) {
  const curve = new THREE.Curve();
  const flat = 0.5 / turns; // a closed half-coil at each end
  curve.getPoint = (t, target = new THREE.Vector3()) => {
    const a = t * turns * Math.PI * 2;
    const y = t < flat ? (t / flat) * w * 1.1 : t > 1 - flat ? h - 2 * w - ((1 - t) / flat) * w * 1.1 + w * 1.1 : w * 1.1 + ((t - flat) / (1 - 2 * flat)) * (h - 2 * w - w * 1.1);
    return target.set(r * Math.cos(a), y + w, r * Math.sin(a));
  };
  return new THREE.Mesh(new THREE.TubeGeometry(curve, Math.round(turns * 64), w, 14, false), mat);
}

// ── rings, pins, circlips ───────────────────────────────────────────────────────────────────────
// Flat ring (annulus sector with an end gap), lying in the XZ plane on y = 0.
function ringGeo(R, radial, h, gapDeg = 5, bevel = 0.35) {
  const g = deg(gapDeg) / 2;
  const s = new THREE.Shape();
  s.absarc(0, 0, R, g, Math.PI * 2 - g, false);
  s.absarc(0, 0, R - radial, Math.PI * 2 - g, g, true);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: h - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 220 });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, bevel, 0);
  return geo;
}
function oilRing(R, mat, slotMat) {
  const body = ringGeo(R, 4.2, 5, 4, 0.3);
  const groove = lathe(sharp([[R - 1.4, 1.8], [R + 2, 1.8], [R + 2, 3.2], [R - 1.4, 3.2], [R - 1.4, 1.8]]), { segments: 160 });
  const cutters = [{ geo: groove }];
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 2 + 0.11;
    cutters.push({ geo: box(9, 1.2, 3.2), at: [Math.cos(a) * (R - 2), 2.5, -Math.sin(a) * (R - 2)], rot: [0, a, 0] });
  }
  return cut(body, mat, cutters, slotMat);
}
function pin(len, R, r, mat, boreMat) {
  const g = new THREE.Group();
  g.add(mesh(lathe(sharp([[r + 0.6, 0], [R - 1.2, 0], [R, 1.2], [R, len - 1.2], [R - 1.2, len], [r + 0.6, len]])), mat));
  g.add(mesh(lathe(sharp([[r + 0.6, len], [r, len - 0.6], [r, 0.6], [r + 0.6, 0]])), boreMat));
  return g;
}
function circlip(R, wire, mat) {
  const geo = new THREE.TorusGeometry(R, wire, 14, 160, Math.PI * 2 * 0.88);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, wire, 0);
  return new THREE.Mesh(geo, mat);
}

// ── bearing shells ──────────────────────────────────────────────────────────────────────────────
// Half shell (arc over the top, axis along Z) standing on its split faces at y = 0; inner running layer bronze.
function shell(Ro, t, width, { lug = true } = {}) {
  const s = new THREE.Shape();
  s.absarc(0, 0, Ro, 0, Math.PI, false);
  s.absarc(0, 0, Ro - t, Math.PI, 0, true);
  s.closePath();
  const b = 0.4;
  const geo = new THREE.ExtrudeGeometry(s, { depth: width - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b * 0.6, bevelSegments: 2, curveSegments: 200 });
  geo.translate(0, 0, -width / 2 + b);
  const ri = Ro - t;
  const groove = lathe(sharp([[ri - 3, -2.2], [ri + 0.8, -2.2], [ri + 0.8, 2.2], [ri - 3, 2.2], [ri - 3, -2.2]]), { segments: 200 });
  groove.rotateX(Math.PI / 2);
  const res = cut(geo, M.steel(), [{ geo: groove }, { geo: cyl(3.4, 30, 40), at: [0, Ro, 0] }]);
  // Colour per triangle: the inner running surface (and groove) bronze; steel back and edges.
  const g = res.geometry.index ? res.geometry.toNonIndexed() : res.geometry;
  const p = g.attributes.position, n = g.attributes.normal;
  const col = new Float32Array(p.count * 3);
  const steel = new THREE.Color(0xb7bdc6), bronze = new THREE.Color(0xc89a66);
  for (let i = 0; i < p.count; i += 3) {
    let rr = 0, inward = 0;
    for (let k = 0; k < 3; k++) {
      const x = p.getX(i + k), y = p.getY(i + k);
      const len = Math.hypot(x, y) || 1;
      rr += len / 3;
      inward += -(n.getX(i + k) * x + n.getY(i + k) * y) / len / 3;
    }
    const c = rr < ri + 0.9 && inward > 0.3 ? bronze : steel;
    for (let k = 0; k < 3; k++) c.toArray(col, (i + k) * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const grp = new THREE.Group();
  grp.add(new THREE.Mesh(g, metal(0xffffff, 0.24, { vertexColors: true })));
  if (lug) grp.add(mesh(new RoundedBoxGeometry(5, 3.5, 6, 2, 0.8), M.steel(), { at: [-(Ro - t / 2), 1.6, width / 2 - 7] }));
  return grp;
}
function thrustWasher(Ro, Ri, t) {
  const s = new THREE.Shape();
  s.absarc(0, 0, Ro, 0, Math.PI, false);
  s.absarc(0, 0, Ri, Math.PI, 0, true);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: t - 0.6, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.3, bevelSegments: 2, curveSegments: 160 });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0.3, 0);
  const mid = (Ri + Ro) / 2;
  const cutters = [-60, -20, 20, 60].map((a) => ({ geo: box(Ro - Ri + 6, 2, 4), at: [Math.cos(deg(90 + a)) * mid, t, -Math.sin(deg(90 + a)) * mid], rot: [0, deg(90 + a), 0] }));
  return cut(geo, M.bronze(), cutters, M.bronze());
}

// ── cylinder head (single-cylinder head of a medium-speed engine) ──────────────────────────────
function cylinderHead() {
  const g = new THREE.Group();
  const paint = M.paint(0x34425a), machined = M.satin(), dark = M.blackOxide();
  const block = new RoundedBoxGeometry(240, 100, 240, 5, 14).toNonIndexed();
  block.translate(0, 50, 0);
  const port = (x, z, rot) => ({ geo: new RoundedBoxGeometry(90, 52, 60, 4, 16).toNonIndexed(), at: [x, 52, z], rot: [0, rot, 0] });
  const cutters = [port(122, 0, 0), port(0, -122, Math.PI / 2)];
  for (const [x, z] of [[-96, 30], [-96, -30], [30, 96], [-30, 96]]) cutters.push({ geo: cyl(7, 30, 32), at: [x, 100, z] });
  g.add(mesh(cut(block, paint, cutters, M.castIron()), null));
  // Machined pads under the stud nuts and around the injector.
  for (const [x, z] of [[-84, -84], [84, -84], [-84, 84], [84, 84]]) {
    g.add(mesh(cyl(26, 8, 96), machined, { at: [x, 104, z] }));
    g.add(mesh(new THREE.CylinderGeometry(21, 21, 24, 6, 1), M.zinc(), { at: [x, 120, z], rot: [0, Math.PI / 6, 0] }));
    g.add(mesh(lathe(sharp([[0, 0], [11, 0], [11, 12], [9.5, 14], [0, 14]])), machined, { at: [x, 128, z] }));
  }
  g.add(mesh(cyl(34, 10, 96), machined, { at: [0, 105, 0] }));
  // Fuel injector in the centre, with its clamp.
  g.add(mesh(lathe(sharp([[0, 0], [13, 0], [13, 46], [16, 48], [16, 60], [13, 62], [11, 62], [11, 74], [9, 76], [0, 76]])), dark, { at: [0, 110, 0] }));
  g.add(mesh(new RoundedBoxGeometry(84, 12, 22, 3, 4), machined, { at: [0, 136, 0], rot: [0, Math.PI / 4, 0] }));
  // Four valves: guide boss, double springs, retainer and stem tip.
  for (const [x, z] of [[-52, -52], [52, -52], [-52, 52], [52, 52]]) {
    g.add(mesh(cyl(22, 6, 96), machined, { at: [x, 103, z] }));
    g.add(mesh(spring(18, 50, 6.5, 2.6, dark), null, { at: [x, 106, z] }));
    g.add(mesh(spring(11.5, 50, 8, 1.8, dark), null, { at: [x, 106, z] }));
    g.add(mesh(lathe(sharp([[6, 0], [23, 0], [24, 1], [24, 7], [22, 9], [10, 9], [6, 6], [6, 0]])), M.steel(), { at: [x, 156, z] }));
    g.add(mesh(lathe(sharp([[0, 0], [6.4, 0], [6.4, 12], [5.6, 13], [0, 13]]), { segments: 64 }), M.polished(), { at: [x, 159, z] }));
  }
  return g;
}

// ── fuel injection: nozzle holder, pump element (barrel + plunger), delivery valve holder ──────
function hexPrism(r, h, mat) {
  const geo = new THREE.CylinderGeometry(r, r, h, 6, 1);
  geo.translate(0, h / 2, 0);
  const m = new THREE.Mesh(geo, mat);
  m.rotation.y = Math.PI / 6;
  return m;
}
function injector() {
  const g = new THREE.Group();
  g.add(mesh(lathe([[[0, 0], [1.4, 1.2]], [[1.4, 1.2], [2.4, 9]], ...sharp([[2.4, 9], [5, 12], [5, 26], [7, 28]])], { segments: 96 }), M.polished()));
  const nut = hexPrism(14, 22, M.zinc());
  nut.position.y = 28;
  g.add(nut);
  g.add(mesh(lathe(sharp([[0, 50], [11, 50], [11, 118], [12.5, 120]])), M.blackOxide()));
  const hex2 = hexPrism(16, 18, M.zinc());
  hex2.position.y = 120;
  g.add(hex2);
  g.add(mesh(lathe(sharp([[0, 138], [9, 138], [9, 141], [7.6, 142], [9, 143], [7.6, 144], [9, 145], [7.6, 146], [9, 147], [7.6, 148], [9, 149], [9, 156], [7.5, 158], [0, 158]]), { segments: 96 }), M.steel()));
  // Inlet connector on the side.
  const inlet = new THREE.Group();
  inlet.add(mesh(lathe(sharp([[0, 0], [6.5, 0], [6.5, 26], [5.5, 27], [0, 27]]), { segments: 64 }), M.steel()));
  const ih = hexPrism(10, 10, M.zinc());
  ih.position.y = 14;
  inlet.add(ih);
  inlet.rotation.z = -Math.PI / 2;
  inlet.position.set(9, 100, 0);
  g.add(inlet);
  return g;
}
function pumpBarrel() {
  const outer = lathe(sharp([[5.2, 0], [14, 0], [14, 46], [18, 48], [18, 58], [16.5, 60], [11.5, 60], [11.5, 72], [10.5, 73], [5.2, 73], [5.2, 0]]));
  return cut(outer, M.satin(), [{ geo: cyl(2.6, 40, 32), at: [0, 38, 0], rot: [0, 0, Math.PI / 2] }], M.bore());
}
function plunger() {
  const g = new THREE.Group();
  g.add(mesh(lathe(sharp([[0, 0], [9, 0], [9, 5], [5, 6], [5, 50], [4.2, 51], [4.2, 55], [5, 56], [5, 92], [4.4, 93], [0, 93]]), { segments: 96 }), M.polished()));
  g.add(mesh(new RoundedBoxGeometry(26, 4, 5, 2, 1), M.polished(), { at: [0, 2.5, 0] }));
  return g;
}
function deliveryValveHolder() {
  const g = new THREE.Group();
  g.add(hexPrism(15, 16, M.zinc()));
  g.add(mesh(lathe(sharp([[6, 16], [10, 16], [10, 34], [8.5, 36], [6, 36]]), { segments: 96 }), M.steel()));
  return g;
}

// ── filter elements ─────────────────────────────────────────────────────────────────────────────
function pleatedElement(R, H, pleats, depth, mediaMat, capMat) {
  const g = new THREE.Group();
  const seg = pleats * 2;
  const geo = new THREE.CylinderGeometry(R, R, H - 20, seg, 1, true);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const a = Math.atan2(z, x);
    const k = Math.round(((a + Math.PI) / (Math.PI * 2)) * seg);
    const r = k % 2 === 0 ? R : R - depth;
    p.setXYZ(i, Math.cos(a) * r, p.getY(i), Math.sin(a) * r);
  }
  const flat = geo.toNonIndexed();
  flat.computeVertexNormals();
  flat.translate(0, H / 2, 0);
  g.add(new THREE.Mesh(flat, mediaMat));
  const ri = R * 0.55;
  g.add(mesh(lathe(sharp([[ri, 0], [R + 1, 0], [R + 2, 1], [R + 2, 10], [ri, 10], [ri, 0]])), capMat));
  g.add(mesh(lathe(sharp([[ri, H - 10], [R + 2, H - 10], [R + 2, H - 1], [R + 1, H], [ri + 1, H], [ri, H - 1], [ri, H - 10]])), capMat));
  g.add(mesh(lathe(sharp([[ri + 2, H], [R * 0.78, H], [R * 0.78, H + 4], [ri + 2, H + 4], [ri + 2, H]])), M.rubber()));
  // Perforated core, seen through the top opening.
  g.add(mesh(lathe(sharp([[ri, H - 10], [ri, 10]])), M.blackOxide()));
  return g;
}

// ── separator: bowl body and disc stack ─────────────────────────────────────────────────────────
function discStack(n, ri, ro, rise, gap, mat) {
  const g = new THREE.Group();
  const t = 0.7;
  const disc = lathe(sharp([[ri, -t], [ro, -rise - t], [ro, -rise], [ri, 0], [ri, -t]]), { segments: 200 });
  for (let i = 0; i < n; i++) g.add(mesh(disc, mat, { at: [0, rise + t + i * gap, 0] }));
  const top = rise + t + n * gap;
  // Top disc with its neck, and the distributor through the middle.
  g.add(mesh(lathe(sharp([[ri - 6, top - 3], [ro + 2, top - rise - 3], [ro + 2, top - rise], [ri + 4, top + 1], [ri + 4, top + 26], [ri + 2, top + 28], [ri - 6, top + 28], [ri - 6, top - 3]])), mat));
  g.add(mesh(lathe(sharp([[ri - 14, 0], [ri - 2, 0], [ri - 2, top + 34], [ri - 4, top + 36], [ri - 14, top + 36], [ri - 14, 0]])), M.satin()));
  // Distributor base cone the stack sits on.
  g.add(mesh(lathe(sharp([[0, 0], [ro - 4, 0], [ro - 4, 3], [ri - 2, rise + 2], [0, rise + 2]])), M.satin()));
  return g;
}
function bowlBody() {
  return lathe([
    ...sharp([[0, 0], [70, 0], [96, 22], [100, 40], [100, 76], [104, 78], [104, 92], [100, 94], [92, 94]]),
    [[92, 94], [90, 70], [84, 40], [62, 16], [30, 10], [0, 10]],
  ]);
}

// ── valve rotators ──────────────────────────────────────────────────────────────────────────────
function rotatorBody(withPockets) {
  const body = lathe(sharp([[12, 0], [26, 0], [28, 1.5], [28, 10], [32, 10], [32, 16.5], [30.5, 18], [19, 18], [14, 13], [12, 13], [12, 0]]));
  if (!withPockets) return mesh(body, M.steel());
  const cutters = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    cutters.push({ geo: new THREE.SphereGeometry(3.6, 32, 16).toNonIndexed(), at: [Math.cos(a) * 24.8, 18, Math.sin(a) * 24.8] });
  }
  return cut(body, M.steel(), cutters, M.bore());
}
function rotator(open) {
  const g = new THREE.Group();
  g.add(rotatorBody(open));
  if (open) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.add(mesh(new THREE.SphereGeometry(3.1, 48, 24), M.polished(), { at: [Math.cos(a) * 24.8, 17.6, Math.sin(a) * 24.8] }));
      // Tangential return spring beside each ball.
      const holder = new THREE.Group();
      holder.add(spring(1.5, 7.5, 5, 0.42, M.steel()));
      holder.rotation.set(Math.PI / 2, 0, 0);
      const outer = new THREE.Group();
      outer.add(holder);
      outer.position.set(Math.cos(a + 0.24) * 24.8, 17.9, Math.sin(a + 0.24) * 24.8);
      outer.rotation.y = -a;
      g.add(outer);
    }
  } else {
    g.add(mesh(lathe(sharp([[13, 18.4], [31, 19.4], [31, 20.8], [29.5, 21.6], [14.5, 20.2], [13, 19.6], [13, 18.4]])), M.blackOxide()));
  }
  return g;
}

// ── cylinder liners ─────────────────────────────────────────────────────────────────────────────
function liner(s = 1) {
  const g = new THREE.Group();
  const outer = sharp([[48, 0], [52, 0], [52, 18], [49.5, 18], [49.5, 22], [52, 22], [52, 28], [49.5, 28], [49.5, 32], [52, 32], [52, 40], [54, 42], [54, 160], [62, 162], [62, 180], [60.5, 182], [50, 182]]);
  g.add(mesh(lathe(outer), metal(0x8d939c, 0.32)));
  // Honed bore (down the inside), then the anti-polishing ring seated at the top of the bore.
  g.add(mesh(lathe(sharp([[50, 182], [48.6, 180.6], [48.6, 166], [48, 165.4], [48, 1.2], [48.6, 0.6], [48, 0]])), metal(0x6f757e, 0.28)));
  g.add(mesh(lathe(sharp([[47.2, 166], [48.6, 166], [48.6, 180.4], [47.2, 180.4], [47.2, 166]])), M.polished()));
  g.scale.setScalar(s);
  return g;
}

export const parts = {
  pistons: {
    view: { az: 28, el: 26 },
    build() {
      const g = new THREE.Group();
      g.add(mesh(piston(M.aluminium()), null, { at: [-34, 0, 22], rot: [0, deg(-48), 0] }));
      g.add(mesh(piston(M.darkSteel()), null, { at: [72, 0, -54], rot: [0, deg(-28), 0], scale: 0.92 }));
      return g;
    },
  },
  "fuel-injection-systems": {
    view: { az: 26, el: 30, fill: 0.76 },
    build() {
      const g = new THREE.Group();
      const inj = injector();
      inj.rotation.set(0, deg(-24), deg(-86));
      inj.position.set(-84, 16.5, 40);
      g.add(inj);
      g.add(mesh(pumpBarrel(), null, { at: [-14, 0, -46] }));
      g.add(mesh(plunger(), null, { at: [24, 0, -30], rot: [0, deg(-30), 0] }));
      g.add(mesh(deliveryValveHolder(), null, { at: [54, 0, -40] }));
      return g;
    },
  },
  "piston-rings": {
    view: { az: 20, el: 34 },
    build() {
      const g = new THREE.Group();
      [[M.polished(), 0, 0, 10], [M.blackOxide(), 7, -5, 70], [M.darkSteel(), 3, 6, 140]].forEach(([mat, x, z, rot], i) =>
        g.add(mesh(ringGeo(50, 4, 3.4), mat, { at: [x - 30, i * 3.6, z + 10], rot: [0, deg(rot), 0] })));
      g.add(mesh(oilRing(50, M.satin(), M.bore()), null, { at: [78, 0, 34], rot: [0, deg(200), 0] }));
      const sg = new THREE.Group();
      sg.add(mesh(ringGeo(52, 4.2, 3.6), M.darkSteel(), { rot: [deg(90), 0, deg(16)] }));
      sg.position.set(40, 52, -70);
      sg.rotation.y = deg(-20);
      g.add(sg);
      return g;
    },
  },
  "piston-pins": {
    view: { az: 24, el: 26 },
    build() {
      const g = new THREE.Group();
      const lying = pin(92, 17, 9, M.polished(), M.bore());
      lying.rotation.set(0, deg(-28), deg(-90));
      lying.position.set(-46, 17, 30);
      g.add(lying);
      g.add(mesh(pin(84, 15.5, 8, M.polished(), M.bore()), null, { at: [38, 0, -40] }));
      g.add(mesh(circlip(15.5, 1.15, M.blackOxide()), null, { at: [40, 0, 40], rot: [0, deg(30), 0] }));
      g.add(mesh(circlip(15.5, 1.15, M.blackOxide()), null, { at: [76, 0, 12], rot: [0, deg(160), 0] }));
      return g;
    },
  },
  bearings: {
    view: { az: 30, el: 24 },
    build() {
      const g = new THREE.Group();
      g.add(mesh(shell(52, 3.2, 40), null, { at: [-62, 0, -10], rot: [0, deg(32), 0] }));
      g.add(mesh(shell(44, 2.8, 34), null, { at: [60, 0, -50], rot: [0, deg(-18), 0] }));
      const lying = shell(52, 3.2, 40, { lug: false });
      lying.rotation.set(0, deg(-10), Math.PI);
      lying.position.set(28, 52, 74);
      g.add(lying);
      g.add(mesh(thrustWasher(58, 44, 3.4), null, { at: [-50, 0, 92], rot: [0, deg(150), 0] }));
      return g;
    },
  },
  "cylinder-heads": {
    view: { az: 34, el: 28 },
    build: () => cylinderHead(),
  },
  "filter-elements": {
    view: { az: 22, el: 22 },
    build() {
      const g = new THREE.Group();
      g.add(mesh(pleatedElement(46, 190, 52, 6, M.media(), M.zinc()), null, { at: [-62, 0, -30] }));
      g.add(mesh(pleatedElement(52, 120, 60, 6, metal(0xb3b9c2, 0.42), M.zinc()), null, { at: [58, 0, -10] }));
      g.add(mesh(pleatedElement(34, 140, 40, 5, M.media(), M.blackOxide()), null, { at: [-2, 0, 72] }));
      return g;
    },
  },
  separators: {
    view: { az: 26, el: 26 },
    build() {
      const g = new THREE.Group();
      const ss = metal(0xd2d7de, 0.18);
      g.add(mesh(bowlBody(), ss, { at: [-92, 0, -46] }));
      g.add(mesh(lathe(sharp([[0, 10], [22, 10], [22, 104], [19, 107], [0, 107]])), M.satin(), { at: [-92, 0, -46] }));
      g.add(mesh(discStack(22, 30, 78, 38, 3.2, ss), null, { at: [70, 0, -20] }));
      // A loose disc resting on its rim, showing the single cone the stack is built from.
      const disc = lathe(sharp([[30, -0.7], [78, -38.7], [78, -38], [30, 0], [30, -0.7]]), { segments: 200 });
      g.add(mesh(disc, ss, { at: [-24, 38.7, 124] }));
      return g;
    },
  },
  "valve-stems": {
    view: { az: 24, el: 20 },
    build() {
      const g = new THREE.Group();
      const hm = M.heatTint(), sm = M.polished();
      [[-70, -30, 1], [-5, -70, 1.08], [62, -38, 0.94]].forEach(([x, z, s]) => g.add(mesh(valve(hm, sm, s), null, { at: [x, 0, z] })));
      // One valve lying in front, resting on its head margin and stem tip.
      const lying = valve(hm, sm, 1);
      lying.rotation.set(0, deg(-24), deg(-96.7));
      lying.position.set(-40, 31.5, 70);
      g.add(lying);
      return g;
    },
  },
  "valve-rotators": {
    view: { az: 22, el: 40 },
    build() {
      const g = new THREE.Group();
      g.add(mesh(rotator(true), null, { at: [-30, 0, 24] }));
      g.add(mesh(rotator(false), null, { at: [44, 0, -34] }));
      return g;
    },
  },
  liners: {
    view: { az: 26, el: 22 },
    build() {
      const g = new THREE.Group();
      g.add(mesh(liner(1), null, { at: [-58, 0, -42] }));
      g.add(mesh(liner(0.8), null, { at: [62, 0, -30] }));
      // A small liner lying in front, resting on its collar.
      const small = liner(0.68);
      small.rotation.set(0, deg(-35), deg(-87.8));
      small.position.set(-30, 62 * 0.68, 78);
      g.add(small);
      return g;
    },
  },
};
