"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { useState } from "react";
import { FunnelPoints } from "./funnel-scene";

/** The WebGL canvas. Loaded only via next/dynamic({ssr:false}). */
export default function FunnelCanvas({ isMobile = false }: { isMobile?: boolean }) {
  const [dpr, setDpr] = useState<number>(isMobile ? 1 : 1.5);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.5))}
        onIncline={() => setDpr((d) => Math.min(2, d + 0.5))}
      >
        <FunnelPoints isMobile={isMobile} />
      </PerformanceMonitor>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
