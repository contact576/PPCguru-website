"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";

/**
 * Slim promotional bar fixed above the header (h-9). Non-dismissible by design
 * to keep header offset math simple; copy promotes the current trial offer.
 */
export function AnnouncementBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center justify-center border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] px-4 text-center backdrop-blur-md">
      <p className="flex items-center justify-center truncate font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-dim)] sm:text-[11px]">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-orange)] shadow-[0_0_8px_var(--color-orange)]" />
        30-Day PPC Growth Sprint
        <span className="mx-2 hidden text-[var(--color-ink-faint)] sm:inline">·</span>
        <span className="hidden text-[var(--color-ink-faint)] sm:inline">Transparent reporting · No lock-in</span>
        <Link
          href="/contact"
          onClick={() => track("trial_offer_click", { source: "announcement_bar" })}
          className="ml-3 rounded-full bg-[var(--color-orange)] px-3 py-0.5 font-semibold text-[#120600] transition-colors hover:bg-[var(--color-gold)]"
        >
          Claim trial →
        </Link>
      </p>
    </div>
  );
}
