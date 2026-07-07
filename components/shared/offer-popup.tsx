"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Zap } from "lucide-react";
import { LeadForm } from "@/components/shared/lead-form";
import { offerForPath, masterOffer } from "@/lib/data/service-offers";

// Pages where an auto-popup would cover the primary task — never auto-fire here
// (an explicit CTA click can still open it via the `ppcg:open-offer` event).
// `/admin` is included so the CMS is never interrupted by the offer popup.
const SUPPRESS_ON = ["/contact", "/results", "/tools", "/admin"];
const K_DONE = "ppcg_offer_done";
const seen = (k: string) => { try { return !!localStorage.getItem(k); } catch { return false; } };
const mark = (k: string) => { try { localStorage.setItem(k, "1"); } catch { /* ignore */ } };

/**
 * Page-aware lead-capture popup. Picks the offer matching the current route
 * (`lib/data/service-offers.ts`) so the copy is page-specific. On **service
 * pages** it opens as a **centre-screen modal ~4s after landing** (catchy hook);
 * elsewhere it's a gentle bottom-right slide-in after longer. Once per session
 * (the shaking floating button reopens it), dismissible (X / Esc / backdrop),
 * and any CTA can open it by dispatching `window` event `ppcg:open-offer`.
 */
export function OfferPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const forced = useRef(false);

  const offer = offerForPath(pathname);
  const suppressed = SUPPRESS_ON.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isService = pathname.startsWith("/services/");
  // Centre modal for service pages + any explicit open; gentle corner card elsewhere.
  const [centered, setCentered] = useState(isService);

  useEffect(() => {
    const openNow = () => { forced.current = true; setCentered(true); setSubmitted(false); setOpen(true); };
    window.addEventListener("ppcg:open-offer", openNow);
    return () => window.removeEventListener("ppcg:open-offer", openNow);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || suppressed || seen(K_DONE)) return;
    let armed = false;
    const startedAt = Date.now();
    const MIN_DWELL = isService ? 3500 : 8000;
    const dwell = isService ? 4000 : 14000;
    const scrollGate = isService ? 0.45 : 0.6;
    const fire = () => {
      if (armed || Date.now() - startedAt < MIN_DWELL) return;
      armed = true; setCentered(isService); setOpen(true); mark(K_DONE); cleanup();
    };
    const onScroll = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      if (p >= scrollGate) fire();
    };
    const onExit = (e: MouseEvent) => { if (e.clientY <= 0) fire(); };
    const timer = setTimeout(fire, dwell);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onExit);
    function cleanup() { clearTimeout(timer); window.removeEventListener("scroll", onScroll); document.removeEventListener("mouseout", onExit); }
    return cleanup;
  }, [suppressed, isService, pathname]);

  useEffect(() => {
    if (!open) { document.body.removeAttribute("data-offer-open"); return; }
    document.body.setAttribute("data-offer-open", "1");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.removeAttribute("data-offer-open"); };
  }, [open]);

  function onDone() { mark(K_DONE); setSubmitted(true); }
  if (!open) return null;

  const eyebrow = offer.trial ? "30-day free trial + free audit" : masterOffer.audit.label;

  const inner = (
    <div className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-tile sm:p-7">
      <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-2)]"><X size={18} /></button>
      {submitted ? (
        <div className="py-6 text-center">
          <h3 className="text-2xl font-bold">You&apos;re in 🎉</h3>
          <p className="mt-2 text-sm text-[var(--color-ink-dim)]">We&apos;ll review your details and reply within one business day.</p>
        </div>
      ) : (
        <>
          <span className="mono inline-flex items-center gap-1.5 rounded-full bg-[var(--color-lime)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[.05em] text-[var(--color-ink)]"><Zap size={13} /> {eyebrow}</span>
          <h3 className="head mt-4 text-[clamp(1.5rem,4vw,2rem)] leading-[1.05]">{offer.popupTitle}</h3>
          <p className="mt-2.5 text-[14px] text-[var(--color-ink-dim)]">{offer.popupBody}</p>
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {masterOffer.riskReversal.map((r) => (
              <span key={r} className="mono rounded-full bg-[#eef2dd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.03em] text-[#5f6f17]">{r}</span>
            ))}
          </div>
          <div className="mt-4"><LeadForm source={offer.formSource} compact submitLabel={offer.ctaLabel} onDone={onDone} /></div>
          {offer.credit ? <p className="mt-2 text-[10.5px] text-[var(--color-ink-faint)]">{masterOffer.credit.fine}</p> : null}
        </>
      )}
    </div>
  );

  if (centered || forced.current) {
    return (
      <div className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={offer.popupTitle}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className="relative w-full max-w-md">{inner}</div>
      </div>
    );
  }
  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:p-0" role="dialog" aria-label={offer.popupTitle}>
      {inner}
    </div>
  );
}
