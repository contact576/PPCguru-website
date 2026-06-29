"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Per-navigation transition. `template.tsx` re-mounts on every route change, so
 * this fades each new page in. Opacity-only on purpose — a transform/translate
 * here would create a containing block and break position:fixed children
 * (scroll-progress bar) and ScrollTrigger pinning.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
