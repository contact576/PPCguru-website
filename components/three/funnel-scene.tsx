"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-store";

const COUNT_DESKTOP = 20000;
const COUNT_MOBILE = 6000;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFill;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aSpeed;
  attribute float aAngle;
  varying float vStage;   // 0=spend (top) .. 1=revenue (basin)
  varying float vAlpha;
  varying float vActive;

  void main() {
    // continuous descent 0..1 driven by time + per-particle phase
    float t = fract(uTime * aSpeed * 0.055 + aSeed);

    // vertical position: top (+3.4) down to basin (-3.4)
    float y = mix(3.4, -3.4, t);

    // funnel radius profile: wide mouth -> narrow neck (t~0.7) -> basin
    float neck = 0.7;
    float topR = 3.25;
    float neckR = 0.22;
    float basinR = 1.7;
    float radius;
    if (t < neck) {
      radius = mix(topR, neckR, pow(t / neck, 1.35));
    } else {
      radius = mix(neckR, basinR, pow((t - neck) / (1.0 - neck), 0.85));
    }

    // swirl — accelerates through the neck for a "drawn-in" feel
    float angle = aAngle + uTime * 0.28 + t * 6.2831 * 1.6;
    float x = cos(angle) * radius;
    float z = sin(angle) * radius;

    // slight turbulence so the stream breathes
    x += sin(uTime * 0.6 + aSeed * 12.0) * 0.06 * (1.0 - t);
    z += cos(uTime * 0.5 + aSeed * 9.0) * 0.06 * (1.0 - t);

    vec3 pos = vec3(x, y, z);
    vStage = t;

    // particles only "active" up to the fill line set by scroll
    float activated = smoothstep(uFill + 0.06, uFill - 0.03, t);
    vActive = activated;
    // inactive ones are faint embers near the mouth (keeps it alive pre-scroll)
    vAlpha = mix(0.07, 1.0, activated);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z) * (0.55 + activated * 0.9);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying float vStage;
  varying float vAlpha;
  varying float vActive;

  void main() {
    // soft round sprite with a hot core
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.18, 0.0, d);

    // brand ramp: deep ember (spend) -> orange (leads) -> gold (revenue)
    vec3 ember  = vec3(0.72, 0.15, 0.04);
    vec3 orange = vec3(1.0, 0.42, 0.12);
    vec3 gold   = vec3(1.0, 0.74, 0.26);
    vec3 col = mix(ember, orange, smoothstep(0.0, 0.7, vStage));
    col = mix(col, gold, smoothstep(0.7, 1.0, vStage));

    // active particles get a white-hot center — like accumulating revenue
    col += core * vActive * vec3(0.9, 0.7, 0.45);

    gl_FragColor = vec4(col, soft * vAlpha);
  }
`;

export function FunnelPoints({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? COUNT_MOBILE : COUNT_DESKTOP;
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { positions, seeds, speeds, angles } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const speeds = new Float32Array(count);
    const angles = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      seeds[i] = Math.random();
      speeds[i] = 0.6 + Math.random() * 0.9;
      angles[i] = Math.random() * Math.PI * 2;
    }
    return { positions, seeds, speeds, angles };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFill: { value: 0.15 },
      uSize: { value: isMobile ? 26 : 34 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
    }),
    [isMobile]
  );

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05); // clamp so tab-refocus doesn't jump
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += d;
      // lerp fill toward scroll-driven target (never setState per frame)
      const target = 0.12 + scrollState.funnelProgress * 0.9;
      const u = matRef.current.uniforms.uFill;
      u.value += (target - u.value) * Math.min(1, d * 3);
    }
    if (groupRef.current) {
      // gentle idle rotation + pronounced pointer parallax (reacts to cursor)
      groupRef.current.rotation.y += d * 0.05;
      const targetX = scrollState.pointerY * 0.18;
      const targetY = scrollState.pointerX * 0.32;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.position.x += (targetY * 0.5 - groupRef.current.position.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
          <bufferAttribute attach="attributes-aAngle" args={[angles, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
