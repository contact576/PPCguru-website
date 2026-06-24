"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Line-mask reveal — each line rises out of a clipped mask with a stagger.
 * This is the cinematic page-load move for big display headings. Lines are
 * passed in explicitly so the caller controls breaks and inline styling
 * (e.g. a gradient word).
 */
export function KineticHeading({
  lines,
  className,
  delay = 0,
  stagger = 0.09,
  as: Tag = "h1",
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={{ y: "115%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Same mask reveal, but triggered when scrolled into view (for section heads). */
export function KineticReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={{ y: "115%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}
