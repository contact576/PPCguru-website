"use client";

import type { ReactNode } from "react";

/**
 * Seamless marquee. Renders the children twice and translates -50% so the loop
 * is gapless. Pauses on hover. Pure CSS animation (defined in globals).
 */
export function Marquee({
  children,
  className,
  reverse = false,
  speed = 38,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: number;
}) {
  return (
    <div className={`group/marquee relative flex overflow-hidden ${className ?? ""}`}>
      <div
        className="flex shrink-0 items-center gap-12 pr-12 group-hover/marquee:[animation-play-state:paused]"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 items-center gap-12 pr-12 group-hover/marquee:[animation-play-state:paused]"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
      </div>
    </div>
  );
}
