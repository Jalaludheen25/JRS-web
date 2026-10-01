"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Meridional profile of a centrifugal compressor wheel (unit radius), axial inlet at top, radial exit at the rim.
const hub = (t: number) => ({ r: 0.16 + 0.84 * Math.pow(t, 2.2), z: 0.92 * Math.pow(1 - t, 1.5) + 0.04 });
const shroud = (t: number) => ({ r: 0.58 + 0.42 * Math.pow(t, 2.4), z: 1.0 - 0.8 * Math.pow(t, 1.2) });

function bladeGeometry(base: number, tStart: number) {
  const tSeg = 36;
  const sSeg = 8;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= tSeg; i++) {
    const t = tStart + (1 - tStart) * (i / tSeg);
    const h = hub(t);
    const s0 = shroud(t);
    for (let j = 0; j <= sSeg; j++) {
      const s = j / sSeg;
      const r = h.r + (s0.r - h.r) * s;
      const z = h.z + (s0.z - h.z) * s;
      // Inducer wrap towards the inlet, backsweep towards the exit.
      const theta = base - 1.1 * Math.pow(1 - t, 2) * (0.6 + 0.4 * s) - 0.35 * Math.pow(t, 3);
      pos.push(r * Math.cos(theta), z, r * Math.sin(theta));
    }
  }
  for (let i = 0; i < tSeg; i++) {
    for (let j = 0; j < sSeg; j++) {
      const a = i * (sSeg + 1) + j;
      const b = a + sSeg + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function hubGeometry() {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, 1.08), new THREE.Vector2(0.08, 1.06), new THREE.Vector2(0.13, 1.0)];
  for (let i = 0; i <= 40; i++) {
    const p = hub(i / 40);
    pts.push(new THREE.Vector2(p.r, p.z));
  }
  pts.push(new THREE.Vector2(1.0, -0.02), new THREE.Vector2(0.95, -0.08), new THREE.Vector2(0.45, -0.1), new THREE.Vector2(0.18, -0.14), new THREE.Vector2(0, -0.14));
  return new THREE.LatheGeometry(pts, 96);
}

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Wheel({ progress }: { progress?: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const BLADES = 9;

  const { blades, splitters, hubGeo } = useMemo(() => {
    const step = (Math.PI * 2) / BLADES;
    return {
      blades: Array.from({ length: BLADES }, (_, i) => bladeGeometry(i * step, 0)),
      splitters: Array.from({ length: BLADES }, (_, i) => bladeGeometry(i * step + step / 2, 0.38)),
      hubGeo: hubGeometry(),
    };
  }, []);

  const bladeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d3d9e2", metalness: 1, roughness: 0.3, side: THREE.DoubleSide }), []);
  const hubMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#9aa4b1", metalness: 1, roughness: 0.38 }), []);

  useEffect(
    () => () => {
      [...blades, ...splitters, hubGeo].forEach((g) => g.dispose());
      bladeMat.dispose();
      hubMat.dispose();
    },
    [blades, splitters, hubGeo, bladeMat, hubMat],
  );

  useFrame((state, delta) => {
    if (!spin.current || !group.current) return;
    // Idle rotation plus scroll-linked spin: scrolling through the section "spools up" the wheel.
    const p = progress?.get() ?? 0;
    spin.current.rotation.y = state.clock.elapsedTime * 0.35 + p * Math.PI * 4;
    const { x, y } = state.pointer;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.55 - y * 0.12, 3, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -0.18 + x * 0.12, 3, delta);
  });

  return (
    <group ref={group} position={[0, -0.42, 0]}>
      <group ref={spin}>
        <mesh geometry={hubGeo} material={hubMat} />
        {blades.map((g, i) => (
          <mesh key={`b${i}`} geometry={g} material={bladeMat} />
        ))}
        {splitters.map((g, i) => (
          <mesh key={`s${i}`} geometry={g} material={bladeMat} />
        ))}
        <mesh position={[0, 1.1, 0]} material={hubMat}>
          <cylinderGeometry args={[0.085, 0.085, 0.09, 6]} />
        </mesh>
        <mesh position={[0, -0.45, 0]} material={hubMat}>
          <cylinderGeometry args={[0.07, 0.07, 0.65, 32]} />
        </mesh>
      </group>
    </group>
  );
}

export default function TurboWheel({ progress, active, onReady }: { progress?: MotionValue<number>; active: boolean; onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.35, 3.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      aria-hidden
    >
      <Environment />
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 2]} intensity={1.4} />
      <directionalLight position={[-3, -1, -3]} intensity={2.2} color="#7dd8f5" />
      <Wheel progress={progress} />
    </Canvas>
  );
}
