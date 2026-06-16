"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-store";

const COUNT_DESKTOP = 9000;
const COUNT_MOBILE = 2600;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFill;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aSpeed;
  attribute float aAngle;
  varying float vStage;   // 0=clicks (top) .. 1=jobs (basin)
  varying float vAlpha;

  void main() {
    // continuous descent 0..1 driven by time + per-particle phase
    float t = fract(uTime * aSpeed * 0.06 + aSeed);

    // vertical position: top (+3.2) down to basin (-3.2)
    float y = mix(3.2, -3.2, t);

    // funnel radius profile: wide mouth -> narrow neck (at t~0.72) -> basin
    float neck = 0.72;
    float topR = 3.0;
    float neckR = 0.28;
    float basinR = 1.5;
    float radius;
    if (t < neck) {
      radius = mix(topR, neckR, pow(t / neck, 1.3));
    } else {
      radius = mix(neckR, basinR, (t - neck) / (1.0 - neck));
    }

    // swirl
    float angle = aAngle + uTime * 0.25 + t * 6.2831 * 1.5;
    float x = cos(angle) * radius;
    float z = sin(angle) * radius;

    // subtle pointer parallax handled on the group; keep particle local here
    vec3 pos = vec3(x, y, z);

    vStage = t;

    // particles only "active" up to the fill line set by scroll
    float activated = smoothstep(uFill + 0.08, uFill - 0.02, t);
    // even inactive ones faintly visible near the mouth for life
    vAlpha = mix(0.12, 1.0, activated);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z) * (0.6 + activated * 0.8);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying float vStage;
  varying float vAlpha;

  void main() {
    // soft round sprite
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);

    // color ramp: cyan (clicks) -> violet (leads) -> gold (jobs)
    vec3 cyan   = vec3(0.36, 0.84, 0.96);
    vec3 violet = vec3(0.49, 0.36, 1.0);
    vec3 gold   = vec3(1.0, 0.81, 0.36);
    vec3 col = mix(cyan, violet, smoothstep(0.0, 0.72, vStage));
    col = mix(col, gold, smoothstep(0.72, 1.0, vStage));

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
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      // lerp fill toward scroll-driven target (never setState per frame)
      const target = 0.12 + scrollState.funnelProgress * 0.9;
      const u = matRef.current.uniforms.uFill;
      u.value += (target - u.value) * Math.min(1, delta * 3);
    }
    if (groupRef.current) {
      // gentle pointer parallax + idle rotation
      groupRef.current.rotation.y += delta * 0.04;
      const targetX = scrollState.pointerY * 0.12;
      const targetY = scrollState.pointerX * 0.2;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
      groupRef.current.position.x += (targetY * 0.4 - groupRef.current.position.x) * 0.04;
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
