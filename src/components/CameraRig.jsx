import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
   The lens element. A shader standing in for what the studio actually
   does: an aperture that breathes, circuit traces routing outward,
   a design grid, and pixel blocks resolving in and out.
------------------------------------------------------------------ */
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float r = length(uv);
    float ang = atan(uv.y, uv.x);
    float t = uTime;

    vec3 deep  = vec3(0.043, 0.078, 0.098);
    vec3 gold  = vec3(0.784, 0.596, 0.259);
    vec3 green = vec3(0.114, 0.545, 0.412);
    vec3 col   = deep;

    // design grid, drifting
    vec2 g = fract((uv * 9.0) + vec2(t * 0.08, -t * 0.05));
    float grid = smoothstep(0.94, 1.0, max(g.x, g.y));
    col += green * grid * 0.30;

    // circuit traces routing out from the centre
    float spokes = abs(sin(ang * 4.0 + t * 0.35));
    float trace = smoothstep(0.985, 1.0, spokes) * smoothstep(0.46, 0.10, r);
    col += gold * trace * 0.55;

    // pixel blocks resolving in and out
    vec2 cell = floor((uv + 0.5) * 16.0);
    float seed = hash(cell);
    float blink = step(0.86, fract(seed + t * 0.16));
    col += mix(green, gold, seed) * blink * 0.34 * smoothstep(0.5, 0.16, r);

    // aperture rings, breathing
    float open = 0.10 + 0.035 * sin(t * 0.8) + uHover * 0.05;
    for (int i = 0; i < 3; i++) {
      float rr = open + float(i) * 0.085;
      col += gold * smoothstep(0.010, 0.0, abs(r - rr)) * (0.85 - float(i) * 0.2);
    }

    // hot centre — where the light gets through
    col += mix(gold, vec3(1.0, 0.95, 0.82), 0.55) * smoothstep(open, 0.0, r) * (0.75 + uHover * 0.5);

    // shutter sweep
    float sweep = smoothstep(0.02, 0.0, abs(uv.y - sin(t * 0.5) * 0.4));
    col += gold * sweep * 0.12;

    // glass falloff and a specular hint
    col *= smoothstep(0.5, 0.30, r);
    col += vec3(1.0) * smoothstep(0.14, 0.0, length(uv - vec2(-0.16, 0.17))) * 0.32;

    float mask = smoothstep(0.5, 0.487, r);
    gl_FragColor = vec4(col, mask);
  }
`;

function LensGlass({ hover }) {
  const mat = useRef();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uHover: { value: 0 } }),
    []
  );
  useFrame((_, dt) => {
    if (!mat.current) return;
    uniforms.uTime.value += dt;
    uniforms.uHover.value = THREE.MathUtils.lerp(
      uniforms.uHover.value,
      hover ? 1 : 0,
      0.08
    );
  });
  return (
    <mesh position={[0, 0, 1.045]}>
      <circleGeometry args={[0.62, 64]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------
   The camera body. Built from primitives rather than a downloaded
   model so it ships with no asset pipeline — swap in a GLTF later
   with useGLTF if you want a photoreal body.
------------------------------------------------------------------ */
export default function CameraRig({ onShoot, disabled }) {
  const group = useRef();
  const [hover, setHover] = useState(false);
  const { viewport } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  const shell = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#241c16", roughness: 0.62, metalness: 0.35 }),
    []
  );
  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#b98a25", roughness: 0.28, metalness: 0.95 }),
    []
  );
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#12100e", roughness: 0.45, metalness: 0.6 }),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
    // idle drift plus a gentle look-toward-cursor
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.current.x * 0.4 + Math.sin(t * 0.3) * 0.06,
      0.05
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.current.y * 0.26 + Math.sin(t * 0.4) * 0.03,
      0.05
    );
    group.current.position.y = Math.sin(t * 0.7) * 0.05;
    const target = hover ? 1.06 : 1;
    group.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);
  });

  const scale = viewport.width < 6 ? 0.72 : 1;

  return (
    <group ref={group} scale={scale}>
      {/* body */}
      <RoundedBox args={[3.1, 1.9, 1.15]} radius={0.16} smoothness={5} material={shell} />

      {/* pentaprism */}
      <mesh position={[0, 1.12, 0]} material={shell}>
        <boxGeometry args={[1.15, 0.55, 0.9]} />
      </mesh>
      <mesh position={[0, 1.44, 0]} material={dark}>
        <boxGeometry args={[0.62, 0.14, 0.5]} />
      </mesh>

      {/* hand grip */}
      <mesh position={[1.42, -0.06, 0.06]} material={shell}>
        <capsuleGeometry args={[0.36, 1.15, 6, 18]} />
      </mesh>

      {/* mode dial + shutter */}
      <mesh position={[-1.02, 1.02, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={dark}>
        <cylinderGeometry args={[0.34, 0.34, 0.24, 28]} />
      </mesh>
      <mesh position={[1.16, 1.0, 0.12]} rotation={[Math.PI / 2, 0, 0]} material={metal}>
        <cylinderGeometry args={[0.16, 0.18, 0.16, 24]} />
      </mesh>

      {/* lens barrel — clickable */}
      <group
        position={[0, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!disabled) {
            setHover(true);
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHover(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            document.body.style.cursor = "";
            onShoot?.();
          }
        }}
      >
        <mesh position={[0, 0, 0.72]} rotation={[Math.PI / 2, 0, 0]} material={dark}>
          <cylinderGeometry args={[0.86, 0.94, 0.9, 48]} />
        </mesh>
        {/* focus + zoom rings */}
        {[0.55, 0.92].map((z, i) => (
          <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} material={shell}>
            <cylinderGeometry args={[0.9, 0.9, 0.16, 48]} />
          </mesh>
        ))}
        {/* front bezel */}
        <mesh position={[0, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]} material={metal}>
          <torusGeometry args={[0.78, 0.055, 14, 60]} />
        </mesh>
        {/* inner barrel wall */}
        <mesh position={[0, 0, 0.98]} rotation={[Math.PI / 2, 0, 0]} material={dark}>
          <cylinderGeometry args={[0.76, 0.76, 0.14, 48, 1, true]} />
        </mesh>

        <LensGlass hover={hover} />

        {/* halo when the lens is live */}
        <pointLight
          position={[0, 0, 1.6]}
          intensity={hover ? 5 : 2.4}
          distance={5}
          color="#e4c077"
        />
      </group>

      {/* badge bar */}
      <mesh position={[-0.95, -0.62, 0.58]} material={metal}>
        <boxGeometry args={[0.72, 0.08, 0.02]} />
      </mesh>
    </group>
  );
}
