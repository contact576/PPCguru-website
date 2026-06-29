"use client";

import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 36 },
  right: { x: -36 },
  none: {},
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Scroll-reveal wrapper: fades + lifts (+ optional scale) content into view as
 *  it enters the viewport — once, per element. `hover` adds a lift micro-
 *  interaction (for cards). Respects prefers-reduced-motion (renders static). */
export function Reveal({
  children,
  delay = 0,
  className,
  y,
  direction = "up",
  scale = false,
  hover = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  direction?: Direction;
  scale?: boolean;
  hover?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger a touch before the element is fully on-screen, once.
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  const o = y != null ? { y } : offset[direction];
  const variants: Variants = {
    hidden: { opacity: 0, ...o, ...(scale ? { scale: 0.94 } : {}) },
    shown: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(scale ? { scale: 1 } : {}),
      transition: { duration: 0.6, delay, ease: EASE },
    },
    hover: { y: -6, transition: { duration: 0.25, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "shown" : "hidden"}
      whileHover={hover ? "hover" : undefined}
    >
      {children}
    </motion.div>
  );
}

/* ── Stagger container + item ───────────────────────────────────────────────
   Wrap a grid in <Stagger> and each cell in <StaggerItem> for an orchestrated
   cascade (cleaner than per-item delays). */
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
  hover: { y: -6, transition: { duration: 0.25, ease: "easeOut" } },
};

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div className={className} variants={itemVariants} whileHover={hover ? "hover" : undefined}>
      {children}
    </motion.div>
  );
}
