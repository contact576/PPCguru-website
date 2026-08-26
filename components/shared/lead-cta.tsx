"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import { LeadForm } from "@/components/shared/lead-form";

/**
 * A CTA button that opens a lead-capture popup (instead of navigating). Reused
 * anywhere a button should convert in-place — pricing tiers, section CTAs, etc.
 * `className`/`style` style the trigger so it can match existing buttons.
 */
export function LeadCtaButton({
  label,
  source,
  title = "Get your free audit",
  blurb = "Tell us where to send it and we'll review your account and reply within one business day.",
  submitLabel = "Send my details",
  className,
  style,
}: {
  label: React.ReactNode;
  source: string;
  title?: string;
  blurb?: string;
  submitLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // Pause Lenis + lock the page so a swipe/wheel inside the card scrolls the
    // form, not the page behind it (padded by the scrollbar width, no jump).
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} style={style}>{label}</button>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          {/* Capped height + inner scroll region: the X stays pinned at the top
              while the form scrolls, so the submit button is always reachable. */}
          <div className="relative flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-tile sm:rounded-[var(--radius-lg)]">
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/95 text-[var(--color-ink)] shadow-sm backdrop-blur transition-colors hover:bg-[var(--color-surface-2)]"><X size={19} /></button>
            {/* `data-lenis-prevent`: Lenis root smooth-scroll swallows wheel/touch
                events document-wide, freezing nested scroll containers without it. */}
            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 sm:p-7">
              {done ? (
                <div className="py-6 text-center">
                  <h3 className="text-2xl font-bold">You&apos;re in 🎉</h3>
                  <p className="mt-3 text-[var(--color-ink-dim)]">We&apos;ll review your details and be in touch shortly.</p>
                  <button onClick={() => setOpen(false)} className="mt-5 rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold">Close</button>
                </div>
              ) : (
                <>
                  <span className="eyebrow text-[var(--color-orange)]">PPC Guru</span>
                  <h3 className="mt-3 max-w-[calc(100%-2.5rem)] text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{blurb}</p>
                  <div className="mt-5"><LeadForm source={source} submitLabel={submitLabel} onDone={() => setDone(true)} /></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
