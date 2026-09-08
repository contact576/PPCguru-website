/**
 * Where the expensive entrance animations are allowed to run.
 *
 * GSAP's SplitText rewrites a heading into one <span> per word (or per
 * character), then animates each of them on scroll. On a desktop that is a
 * nice reveal. On a phone it is a DOM explosion plus a layout pass, on the
 * device with the least headroom, at exactly the moment the page is hydrating
 * — and the payoff is an effect that is barely legible at 390px anyway.
 *
 * So the split/parallax effects are treated like reduced-motion on a coarse
 * pointer: skipped entirely. Every component that calls this renders its
 * children normally regardless — only the animation is dropped, never content.
 *
 * Client-only: call it inside an effect / useGSAP, never during render, or SSR
 * and the first client paint will disagree.
 */
export function skipHeavyMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}
