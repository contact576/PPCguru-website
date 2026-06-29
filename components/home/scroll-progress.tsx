"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/** Thin lime progress bar pinned to the top, tracking page scroll. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: "0%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 100,
        background: "linear-gradient(90deg,#ceff3a,#9bd227,#6f7d22)",
      }}
    />
  );
}
