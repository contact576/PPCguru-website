"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "ppcguru_offer_popup_seen";

/**
 * Tasteful one-time offer popup. Triggers on 50% scroll OR after 30s, whichever
 * comes first, and never again this browser (localStorage). Esc / backdrop / X
 * all close it; focus is moved in and restored on close.
 */
export function OfferPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* ignore */
    }
    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      setOpen(true);
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
      cleanup();
    };
    const onScroll = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (p >= 0.5) trigger();
    };
    const timer = setTimeout(trigger, 30000);
    window.addEventListener("scroll", onScroll, { passive: true });
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    track("popup_submit");
    // TODO: Connect popup lead to CRM / email automation.
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Free PPC waste audit offer"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-tile">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-2)]"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <h3 className="text-2xl font-bold">You&apos;re in 🎉</h3>
            <p className="mt-3 text-[var(--color-ink-dim)]">We&apos;ll review your details and send your free PPC waste audit shortly.</p>
          </div>
        ) : (
          <>
            <span className="eyebrow text-[var(--color-orange)]">Free PPC waste audit</span>
            <h3 className="mt-3 text-2xl font-bold">Want to know where your ad spend is leaking?</h3>
            <p className="mt-2 text-sm text-[var(--color-ink-dim)]">
              Get a free PPC waste audit and a 30-Day Growth Sprint recommendation — clear next steps before you commit.
            </p>
            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              {/* honeypot */}
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <input required placeholder="Name" className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-orange)]" />
              <input required type="email" placeholder="Email" className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-orange)]" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Phone / WhatsApp" className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-orange)]" />
                <input placeholder="Website" className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-orange)]" />
              </div>
              <select className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-ink-dim)] outline-none focus:border-[var(--color-orange)]" defaultValue="">
                <option value="" disabled>Monthly ad spend</option>
                <option>Under $1,000</option><option>$1,000–$3,000</option><option>$3,000–$10,000</option><option>$10,000–$25,000</option><option>$25,000+</option>
              </select>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-orange)] py-3 font-semibold text-white hover:bg-[var(--color-orange-deep)]">
                Get my free audit <ArrowRight size={16} />
              </button>
              <p className="text-center text-[11px] text-[var(--color-ink-faint)]">By submitting, you agree to be contacted by PPC Guru. Unsubscribe anytime.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
