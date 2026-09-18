"use client";

import { useEffect } from "react";

/**
 * Per-navigation fade. `template.tsx` re-mounts on every route change, so each
 * new page fades in. Opacity-only on purpose — a transform/translate here would
 * create a containing block and break position:fixed children (scroll-progress
 * bar) and ScrollTrigger pinning.
 *
 * ⚠ Never on the FIRST load. This used to be a motion.div with
 * `initial={{ opacity: 0 }}`, which server-rendered `style="opacity:0"` around
 * the whole of <main>: every page was blank until React + motion had
 * downloaded and hydrated (~12s LCP on a mid-range phone). Now the server HTML
 * is untouched and the fade is a CSS animation (`.page-enter` in globals.css)
 * applied only to client-side navigations, after the first mount.
 */
let hasMounted = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hasMounted;
  useEffect(() => {
    hasMounted = true;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
