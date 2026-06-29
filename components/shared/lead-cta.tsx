"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} style={style}>{label}</button>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-t-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-tile sm:rounded-[var(--radius-lg)] sm:p-7">
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-2)]"><X size={18} /></button>
            {done ? (
              <div className="py-6 text-center">
                <h3 className="text-2xl font-bold">You&apos;re in 🎉</h3>
                <p className="mt-3 text-[var(--color-ink-dim)]">We&apos;ll review your details and be in touch shortly.</p>
                <button onClick={() => setOpen(false)} className="mt-5 rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold">Close</button>
              </div>
            ) : (
              <>
                <span className="eyebrow text-[var(--color-orange)]">PPC Guru</span>
                <h3 className="mt-3 text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{blurb}</p>
                <div className="mt-5"><LeadForm source={source} submitLabel={submitLabel} onDone={() => setDone(true)} /></div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
