"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/** Scroll-reveal wrapper: fades + lifts content into view once.
 *  Safety net: if `whileInView` never fires (slow JS, odd scroll/observer
 *  conditions), a mount timeout forces the content visible so a section can
 *  never get stuck blank — matching the homepage RevealInit fallback. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForceShow(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={forceShow ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
