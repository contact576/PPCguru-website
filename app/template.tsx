"use client";

import { motion } from "motion/react";

/**
 * Route template — remounts on every navigation, so this gives each page a
 * brief cinematic fade/rise-in. Kept subtle (and instant under reduced-motion
 * via the global CSS that zeroes transition/animation durations).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
