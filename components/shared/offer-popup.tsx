"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { LeadForm } from "@/components/shared/lead-form";
import { offerForPath, masterOffer } from "@/lib/data/service-offers";

// Pages where an auto-popup would cover the primary task — never auto-fire here
// (an explicit CTA click can still open it via the `ppcg:open-offer` event).
const SUPPRESS_ON = ["/contact", "/results", "/tools"];
const K_DONE = "ppcg_offer_done";
const seen = (k: string) => { try { return !!localStorage.getItem(k); } catch { return false; } };
const mark = (k: string) => { try { localStorage.setItem(k, "1"); } catch { /* ignore */ } };

/**
 * Page-aware lead-capture slide-in. Picks the offer that matches the current
 * route (`lib/data/service-offers.ts`) so the copy is page-specific (Google Ads
 * audit, Meta lead-quality review, SEO visibility audit, …). Gentle bottom-right
 * card (bottom-sheet on mobile) after ~7s on service pages / ~14s elsewhere, OR
 * on deep scroll / desktop exit-intent — session-capped, easy to close. Any CTA
 * anywhere can open it instantly by dispatching `window` event `ppcg:open-offer`.
 */
export function OfferPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const forced = useRef(false); // opened by explicit CTA click (bypasses session cap)

  const offer = offerForPath(pathname);
  const suppressed = SUPPRESS_ON.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isService = pathname.startsWith("/services/");

  // Explicit open from a CTA anywhere on the page.
  useEffect(() => {
    const openNow = () => { forced.current = true; setSubmitted(false); setOpen(true); };
    window.addEventListener("ppcg:open-offer", openNow);
    return () => window.removeEventListener("ppcg:open-offer", openNow);
  }, []);

  // Auto-arm (dwell / scroll / exit-intent), once per session, not on task pages.
  useEffect(() => {
    if (typeof window === "undefined" || suppressed || seen(K_DONE)) return;
    let armed = false;
    const startedAt = Date.now();
    const MIN_DWELL = 6000;
    const dwell = isService ? 7000 : 14000;
    const scrollGate = isService ? 0.5 : 0.6;
    const fire = () => { if (armed || Date.now() - startedAt < MIN_DWELL) return; armed = true; setOpen(true); mark(K_DONE); cleanup(); };
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

  // Esc closes; flag the body so the floating CTA can hide while we're open.
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

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:p-0" role="dialog" aria-label={offer.popupTitle}>
      <div className="relative mx-auto w-full max-w-sm rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-tile">
        <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-faint)] hover:bg-[var(--color-surface-2)]"><X size={16} /></button>
        {submitted ? (
          <div className="py-6 text-center">
            <h3 className="text-xl font-bold">You&apos;re in 🎉</h3>
            <p className="mt-2 text-sm text-[var(--color-ink-dim)]">We&apos;ll review your details and reply within one business day.</p>
          </div>
        ) : (
          <>
            <span className="mono text-[11px] font-bold uppercase tracking-[.08em] text-[#5f6f17]">{eyebrow}</span>
            <h3 className="mt-2 text-lg font-bold leading-tight">{offer.popupTitle}</h3>
            <p className="mt-1.5 text-[13px] text-[var(--color-ink-dim)]">{offer.popupBody}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {masterOffer.riskReversal.map((r) => (
                <span key={r} className="mono rounded-full bg-[#eef2dd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.03em] text-[#5f6f17]">{r}</span>
              ))}
            </div>
            <div className="mt-4"><LeadForm source={offer.formSource} compact submitLabel={offer.ctaLabel} onDone={onDone} /></div>
            {offer.credit ? <p className="mt-2 text-[10.5px] text-[var(--color-ink-faint)]">{masterOffer.credit.fine}</p> : null}
          </>
        )}
      </div>
    </div>
  );
}
