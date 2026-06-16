/**
 * Mutable scroll state shared between the DOM scroll rig (Lenis + GSAP) and the
 * R3F render loop. Read/written via refs only — NEVER through React state — to
 * avoid per-frame re-renders (the #1 cause of jank in scroll-driven 3D).
 */
export const scrollState = {
  /** Whole-page scroll progress 0→1. */
  pageProgress: 0,
  /** Hero/funnel section progress 0→1 (drives particle fill). */
  funnelProgress: 0,
  /** Smoothed pointer position, normalized -1→1, for subtle parallax. */
  pointerX: 0,
  pointerY: 0,
};

export type ScrollState = typeof scrollState;
