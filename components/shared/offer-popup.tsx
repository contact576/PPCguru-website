"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { LeadForm } from "@/components/shared/lead-form";
import { offers } from "@/lib/data/offers";

// Pages where an arrival pop-up would cover the primary task — never interrupt these.
const SUPPRESS_ON = ["/contact", "/results", "/tools", "/admin"];

/**
 * Two-step lead-capture funnel:
 *   1. Arrival modal — free account audit (name/email/phone/website).
 *   2. On dismiss, a bottom-right slide-in — "$600 Google Ads credit".
 * Both are session-capped (localStorage), dismissible, never block content, and
 * render as bottom-sheets on mobile. Submissions route to the shared lead action.
 */
const K = { modal: "ppcg_lead_modal", slide: "ppcg_lead_slide", done: "ppcg_lead_done" };
const seen = (k: string) => { try { return !!localStorage.getItem(k); } catch { return false; } };
const mark = (k: string) => { try { localStorage.setItem(k, "1"); } catch { /* ignore */ } };

export function OfferPopup() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"none" | "modal" | "slide">("none");
  const [submitted, setSubmitted] = useState(false);

  const suppressed = SUPPRESS_ON.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Arm step 1 (modal): deep scroll (60%) OR 25s OR desktop exit-intent — but
  // never within the first 12s (so a first-time visitor reads the hero first),
  // and never on task pages (contact/results/tools).
  useEffect(() => {
    if (typeof window === "undefined" || suppressed || seen(K.done) || seen(K.modal)) return;
    let armed = false;
    const startedAt = Date.now();
    const MIN_DWELL = 12000;
    const fire = () => { if (armed || Date.now() - startedAt < MIN_DWELL) return; armed = true; setPhase("modal"); mark(K.modal); cleanup(); };
    const onScroll = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      if (p >= 0.6) fire();
    };
    const onExit = (e: MouseEvent) => { if (e.clientY <= 0) fire(); };
    const timer = setTimeout(fire, 25000);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onExit);
    function cleanup() { clearTimeout(timer); window.removeEventListener("scroll", onScroll); document.removeEventListener("mouseout", onExit); }
    return cleanup;
  }, [suppressed]);

  // Esc closes whatever is open.
  useEffect(() => {
    if (phase === "none") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCurrent(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  function closeCurrent() {
    if (phase === "modal") {
      // Dismissed the audit modal → arm the $600 slide-in (once).
      if (!seen(K.slide) && !seen(K.done)) {
        mark(K.slide);
        setTimeout(() => setPhase((p) => (p === "none" ? "slide" : p)), 600);
        setPhase("none");
        return;
      }
    }
    setPhase("none");
  }

  function onDone() { mark(K.done); setSubmitted(true); }

  if (suppressed) return null;
  if (phase === "none" && !submitted) return null;

  // Success toast (after either form submits)
  if (submitted && phase !== "none") {
    return (
      <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:items-center" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPhase("none")} />
        <div className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-7 text-center shadow-tile">
          <h3 className="text-2xl font-bold">You&apos;re in 🎉</h3>
          <p className="mt-3 text-[var(--color-ink-dim)]">We&apos;ll review your details and send your free audit shortly.</p>
          <button onClick={() => setPhase("none")} className="mt-5 rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold">Close</button>
        </div>
      </div>
    );
  }

  // Step 1 — modal (bottom sheet on mobile, centered on desktop)
  if (phase === "modal") {
    return (
      <div className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={offers.audit.title}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCurrent} />
        <div className="relative w-full max-w-md rounded-t-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-tile sm:rounded-[var(--radius-lg)] sm:p-7">
          <button onClick={closeCurrent} aria-label="Close" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-2)]"><X size={18} /></button>
          <span className="eyebrow text-[var(--color-orange)]">{offers.audit.eyebrow}</span>
          <h3 className="mt-3 text-2xl font-bold">{offers.audit.title}</h3>
          <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{offers.audit.body}</p>
          <div className="mt-5"><LeadForm source="popup:audit" submitLabel={offers.audit.cta} onDone={onDone} /></div>
        </div>
      </div>
    );
  }

  // Step 2 — bottom-right slide-in (full-width bottom sheet on mobile)
  return (
    <div className="fixed inset-x-0 bottom-0 z-[85] p-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:p-0" role="dialog" aria-label={offers.credit.title}>
      <div className="relative mx-auto w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-tile">
        <button onClick={() => setPhase("none")} aria-label="Close" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-2)]"><X size={16} /></button>
        <span className="eyebrow text-[var(--color-orange)]">{offers.credit.eyebrow}</span>
        <h3 className="mt-2 text-xl font-bold leading-tight">{offers.credit.title}</h3>
        <p className="mt-1.5 text-[13px] text-[var(--color-ink-dim)]">{offers.credit.body}</p>
        <div className="mt-4"><LeadForm source="popup:credit" compact submitLabel={offers.credit.cta} onDone={onDone} /></div>
        <p className="mt-2 text-[10.5px] text-[var(--color-ink-faint)]">{offers.credit.fine}</p>
      </div>
    </div>
  );
}
