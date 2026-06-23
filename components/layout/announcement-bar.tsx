"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Slim promotional bar fixed above the header (h-9). Non-dismissible by design
 * to keep header offset math simple; copy promotes the current trial offer.
 */
export function AnnouncementBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center justify-center bg-[var(--color-navy)] px-4 text-center">
      <p className="truncate font-mono text-[11px] uppercase tracking-wide text-white/85 sm:text-xs">
        30-Day PPC Growth Sprint available
        <span className="mx-2 hidden text-white/30 sm:inline">·</span>
        <span className="hidden sm:inline">Transparent reporting · No long-term lock-in</span>
        <Link
          href="/contact"
          onClick={() => track("trial_offer_click", { source: "announcement_bar" })}
          className="ml-3 rounded-full bg-[var(--color-orange)] px-3 py-0.5 font-semibold text-white hover:bg-[var(--color-orange-deep)]"
        >
          Claim trial
        </Link>
      </p>
    </div>
  );
}
