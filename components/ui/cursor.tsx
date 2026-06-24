"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom HUD cursor — a precise dot + a lagging reticle ring that expands and
 * shows a label over interactive elements. This is the "reacts to everything"
 * feel from the reference sites, tuned to the mission-control concept.
 *
 * - Only active on fine-pointer, hover-capable devices (real mouse).
 * - Disabled for prefers-reduced-motion.
 * - Reads pointer in a ref and lerps in a single rAF loop (no per-move state).
 * - Add data-cursor="Label" to any element to set the reticle label on hover;
 *   data-cursor-variant="view|drag" tweaks the style.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let hovering = false;
    let down = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const dot = dotRef.current;
      if (dot) dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      // Resolve hover intent from the element under the pointer.
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor], input, textarea, select, [role='button']"
      );
      const ringEl = ringRef.current;
      const labelEl = labelRef.current;
      if (el) {
        if (!hovering) hovering = true;
        const label = el.getAttribute("data-cursor");
        if (labelEl) {
          labelEl.textContent = label ?? "";
          labelEl.style.opacity = label ? "1" : "0";
        }
        ringEl?.setAttribute("data-active", "true");
      } else {
        hovering = false;
        ringEl?.setAttribute("data-active", "false");
        if (labelEl) {
          labelEl.style.opacity = "0";
          labelEl.textContent = "";
        }
      }
    };
    const onDown = () => { down = true; ringRef.current?.setAttribute("data-down", "true"); };
    const onUp = () => { down = false; ringRef.current?.setAttribute("data-down", "false"); };
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    const loop = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      const ringEl = ringRef.current;
      if (ringEl) {
        const scale = (hovering ? 1.9 : 1) * (down ? 0.82 : 1);
        ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[10000] hidden md:block">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[var(--color-orange)]"
        style={{ transition: "opacity .2s" }}
      />
      <div
        ref={ringRef}
        data-active="false"
        className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-bright)] transition-[border-color,background-color] duration-200 data-[active=true]:border-[var(--color-orange)] data-[active=true]:bg-[color-mix(in_srgb,var(--color-orange)_12%,transparent)]"
        style={{ willChange: "transform" }}
      >
        <span
          ref={labelRef}
          className="whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-[var(--color-orange)] opacity-0 transition-opacity duration-200"
        />
      </div>
    </div>
  );
}
