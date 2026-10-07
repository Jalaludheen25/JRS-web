// Product-shot studio for the spare-parts renders (driven by scripts/render-parts.mjs in headless Chrome).
// Transparent background, soft contact shadow, a studio environment with white softboxes and a heritage-blue
// panel (so polished metal picks up the site's blue), and automatic framing so every part fills the frame alike.
import * as THREE from "three";
import { parts } from "/parts.js";

export const W = 1200;
export const H = 900;
const SS = 2; // supersampling: rendered at 2× and downscaled by the driver

let renderer, envMap;

function getRenderer() {
  if (renderer) return renderer;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W * SS, H * SS);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  document.body.appendChild(renderer.domElement);
  envMap = makeEnvironment(renderer);
  return renderer;
}

function makeEnvironment(r) {
  const scene = new THREE.Scene();
  // Surrounding dome: a light studio sweep (blue-grey below the horizon, near white above).
  const dome = new THREE.SphereGeometry(60, 64, 32);
  const pos = dome.attributes.position;
  const cols = [];
  const low = new THREE.Color("#5b6b86"), horizon = new THREE.Color("#c3cede"), high = new THREE.Color("#eef2f8");
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getY(i) / 60; // -1 … 1
    const c = t < 0 ? horizon.clone().lerp(low, Math.min(1, -t * 1.5)) : horizon.clone().lerp(high, Math.min(1, t * 1.8));
    cols.push(c.r, c.g, c.b);
  }
  dome.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  scene.add(new THREE.Mesh(dome, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));

  const panel = (w, h, color, k, position) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...position);
    m.lookAt(0, 0, 0);
    scene.add(m);
  };
  panel(46, 46, "#ffffff", 5.5, [0, 42, 6]); // overhead softbox
  panel(12, 40, "#ffffff", 8, [-40, 10, 18]); // key strip, front left
  panel(10, 40, "#ffffff", 5, [40, 10, 10]); // strip, right
  panel(50, 20, "#ffffff", 1.8, [0, 4, 45]); // broad, behind the camera
  panel(50, 14, "#2a56d1", 6, [8, 6, -44]); // heritage-blue rim panel behind
  panel(18, 10, "#3f6fe8", 3, [-40, -2, -30]); // low blue accent, back left

  const pmrem = new THREE.PMREMGenerator(r);
  const tex = pmrem.fromScene(scene, 0.035).texture;
  pmrem.dispose();
  return tex;
}

// Fit the camera so the part's actual vertices fill `fill` of the frame, centred.
function frame(camera, root, { az = 32, el = 24, fov = 24, fill = 0.82 } = {}) {
  const pts = [];
  const v = new THREE.Vector3();
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isMesh || o.userData.ignoreFit) return;
    const p = o.geometry.attributes.position;
    const step = Math.max(1, Math.floor(p.count / 6000));
    for (let i = 0; i < p.count; i += step) pts.push(v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).clone());
  });
  const box = new THREE.Box3().setFromPoints(pts);
  const target = box.getCenter(new THREE.Vector3());
  const a = THREE.MathUtils.degToRad(az), e = THREE.MathUtils.degToRad(el);
  const dir = new THREE.Vector3(Math.cos(e) * Math.sin(a), Math.sin(e), Math.cos(e) * Math.cos(a));
  camera.fov = fov;
  camera.aspect = W / H;
  camera.near = 1;
  camera.far = 20000;
  let dist = box.getSize(new THREE.Vector3()).length() * 2;
  const q = new THREE.Vector3();
  for (let it = 0; it < 8; it++) {
    camera.position.copy(target).addScaledVector(dir, dist);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of pts) {
      q.copy(p).project(camera);
      x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y);
    }
    const halfH = Math.tan(THREE.MathUtils.degToRad(fov / 2)) * dist, halfW = halfH * camera.aspect;
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    target.addScaledVector(right, ((x0 + x1) / 2) * halfW).addScaledVector(up, ((y0 + y1) / 2) * halfH);
    dist *= Math.max((x1 - x0) / 2 / fill, (y1 - y0) / 2 / fill);
  }
  camera.position.copy(target).addScaledVector(dir, dist);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  return box;
}

export async function renderPart(id) {
  const r = getRenderer();
  const def = parts[id];
  if (!def) throw new Error(`unknown part ${id}`);
  const scene = new THREE.Scene();
  scene.environment = envMap;
  scene.environmentIntensity = def.envIntensity ?? 1;

  const root = await def.build();
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  scene.add(root);

  const camera = new THREE.PerspectiveCamera();
  const box = frame(camera, root, def.view);
  const size = box.getSize(new THREE.Vector3());
  const span = Math.max(size.x, size.z) * 1.6 + size.y;

  // Key light for the contact shadow (from above, slightly front-left), plus a cool blue rim.
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(box.min.x - size.y * 0.35, box.max.y + span * 1.6, box.max.z + size.y * 0.5);
  key.target.position.copy(box.getCenter(new THREE.Vector3())).setY(box.min.y);
  key.castShadow = true;
  key.shadow.mapSize.set(4096, 4096);
  key.shadow.radius = 14;
  key.shadow.blurSamples = 24;
  key.shadow.bias = -0.0004;
  const sc = key.shadow.camera;
  sc.left = -span; sc.right = span; sc.top = span; sc.bottom = -span; sc.near = 1; sc.far = span * 6;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x6e93ff, 1.1);
  rim.position.set(box.max.x + span, box.max.y + span * 0.4, box.min.z - span);
  scene.add(rim);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(span * 8, span * 8), new THREE.ShadowMaterial({ opacity: def.shadow ?? 0.3, color: 0x0a1836 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = box.min.y;
  ground.receiveShadow = true;
  ground.userData.ignoreFit = true;
  scene.add(ground);

  r.render(scene, camera);
  const url = r.domElement.toDataURL("image/png");
  scene.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
  return url;
}
