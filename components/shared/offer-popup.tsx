"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { X, Zap, CircleCheck } from "lucide-react";
import { LeadForm } from "@/components/shared/lead-form";
import { offerForPath, masterOffer } from "@/lib/data/service-offers";

// Pages where an auto-popup would cover the primary task — never auto-fire here
// (an explicit CTA click can still open it via the `ppcg:open-offer` event).
// `/admin` is included so the CMS is never interrupted by the offer popup.
// `/100-leads` is a paid landing page with its own funnel — a second offer would compete with it.
const SUPPRESS_ON = ["/contact", "/results", "/tools", "/admin", "/100-leads", "/seo-visibility", "/gta-marketing-agency", "/google-ads-and-meta-ads", "/overview", "/blog/what-does-an-seo-audit-include-toronto"];
const K_DONE = "ppcg_offer_done";
// Suppression is SESSION-scoped: once shown/dismissed it stays quiet for the rest
// of this visit, but a returning visitor on a new session sees the offer again.
const seen = (k: string) => { try { return !!sessionStorage.getItem(k); } catch { return false; } };
const mark = (k: string) => { try { sessionStorage.setItem(k, "1"); } catch { /* ignore */ } };

/**
 * Page-aware lead-capture popup. Picks the offer matching the current route
 * (`lib/data/service-offers.ts`) so the copy is page-specific. On **service
 * pages** it opens as a **centre-screen modal ~4s after landing**;
 * the homepage opens only after 40% scroll. Other pages keep the corner card.
 * Once per session
 * (the shaking floating button reopens it), dismissible (X / Esc / backdrop),
 * and any CTA can open it by dispatching `window` event `ppcg:open-offer`.
 */
export function OfferPopup() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const forced = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const isHome = pathname === "/";
  const pageOffer = offerForPath(pathname);
  const offer = isHome ? {
    ...pageOffer,
    popupTitle: "Find what’s holding back your conversions.",
    popupBody: "Get a free review of your website, ads and enquiry path. We’ll identify the gaps and recommend what to improve first. No obligation.",
    formSource: "offer:homepage",
  } : pageOffer;
  const suppressed = SUPPRESS_ON.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isService = pathname.startsWith("/services/");
  // Centre modal for service pages + any explicit open; gentle corner card elsewhere.
  const [centered, setCentered] = useState(isService);

  useEffect(() => {
    if (submitted) successRef.current?.focus({ preventScroll: true });
  }, [submitted]);

  useEffect(() => {
    const openNow = () => { forced.current = true; mark(K_DONE); setCentered(true); setSubmitted(false); setOpen(true); };
    window.addEventListener("ppcg:open-offer", openNow);
    return () => window.removeEventListener("ppcg:open-offer", openNow);
  }, []);

  useEffect(() => {
    // Do not carry an already-open offer into the homepage on client navigation.
    // A later explicit open event still works normally.
    if (pathname === "/") {
      setOpen(false);
      setSubmitted(false);
      forced.current = false;
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || suppressed || seen(K_DONE)) return;
    let armed = false;
    const startedAt = Date.now();
    const MIN_DWELL = isHome ? 0 : isService ? 3500 : 8000;
    const dwell = isService ? 4000 : 14000;
    const scrollGate = isHome ? 0.4 : isService ? 0.45 : 0.6;
    const fire = () => {
      if (armed || seen(K_DONE) || Date.now() - startedAt < MIN_DWELL) return;
      // Do not interrupt someone already typing or inspecting a campaign report.
      if (document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]') || document.activeElement?.closest("form")) return;
      armed = true; setCentered(isHome || isService); setOpen(true); mark(K_DONE); cleanup();
      if (isHome) {
        const trackedWindow = window as typeof window & { dataLayer?: Record<string, unknown>[] };
        (trackedWindow.dataLayer ??= []).push({ event: "offer_popup_view", source: "homepage_scroll", scroll_threshold: 40, page_path: pathname });
      }
    };
    const onScroll = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      if (p >= scrollGate) fire();
    };
    const onExit = (e: MouseEvent) => { if (e.clientY <= 0) fire(); };
    // The homepage has no timer or exit-intent shortcut: 40% scroll is the trigger.
    const timer = isHome ? null : setTimeout(fire, dwell);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!isHome) document.addEventListener("mouseout", onExit);
    function cleanup() { if (timer !== null) clearTimeout(timer); window.removeEventListener("scroll", onScroll); document.removeEventListener("mouseout", onExit); }
    onScroll();
    return cleanup;
  }, [suppressed, isService, isHome, pathname]);

  // Centre-modal for service pages, any explicit CTA open, and the submitted state.
  const isModal = centered || forced.current;

  useEffect(() => {
    if (!open) { document.body.removeAttribute("data-offer-open"); return; }
    document.body.setAttribute("data-offer-open", "1");
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = isModal ? window.requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true })) : 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (!isModal || e.key !== "Tab") return;
      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
      ) ?? []).filter((element) => element.getClientRects().length > 0 && element.tabIndex >= 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && (document.activeElement === first || !panelRef.current?.contains(document.activeElement))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !panelRef.current?.contains(document.activeElement))) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // Lock the page behind the MODAL only, so a swipe/wheel inside the card
    // scrolls the form instead of chaining to the page underneath. The gentle
    // corner card is non-blocking, so it never locks the page.
    const prev = isModal ? { overflow: document.body.style.overflow, pad: document.body.style.paddingRight } : null;
    if (isModal) {
      // Pause Lenis (it drives the page scroll) and lock the body, padding by the
      // scrollbar width so hiding it doesn't shift the page behind the modal.
      lenis?.stop();
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(focusFrame);
      document.body.removeAttribute("data-offer-open");
      if (prev) {
        document.body.style.overflow = prev.overflow;
        document.body.style.paddingRight = prev.pad;
        lenis?.start();
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open, isModal, lenis]);

  function onDone() { mark(K_DONE); setSubmitted(true); }
  if (!open) return null;

  const eyebrow = masterOffer.audit.label;

  const inner = (
    // The capture form asks for services + budget now, so the card is capped and
    // split into a fixed close bar + an INNER scroll region — the X stays pinned
    // at the top while the form scrolls, so the submit button is always reachable
    // and the popup is always closable on short viewports.
    <div ref={panelRef} className="relative flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-tile">
      <button
        ref={closeRef}
        onClick={() => setOpen(false)}
        aria-label="Close"
        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/95 text-[var(--color-ink)] shadow-sm backdrop-blur transition-colors hover:bg-[var(--color-surface-2)]"
      >
        <X size={19} />
      </button>
      {/* `data-lenis-prevent` is REQUIRED: Lenis (root smooth scroll) swallows
          wheel/touch events document-wide, so a nested scroll container stays
          frozen without it — this is what made the popup form unscrollable. */}
      <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 sm:p-7">
        {submitted ? (
          <div className="py-6 text-center" role="status" aria-live="polite">
            <CircleCheck aria-hidden className="mx-auto mb-3 h-11 w-11 text-[#6f7d22]" />
            <h3 ref={successRef} tabIndex={-1} className="text-2xl font-bold">You&apos;re in</h3>
            <p className="mt-2 text-sm text-[var(--color-ink-dim)]">We&apos;ll review your details and reply within one business day.</p>
          </div>
        ) : (
          <>
            <span className="mono inline-flex max-w-[calc(100%-2.75rem)] items-center gap-1.5 rounded-full bg-[var(--color-lime)] px-3 py-1.5 text-[11px] font-black uppercase tracking-[.05em] text-[var(--color-ink)]"><Zap size={13} /> {eyebrow}</span>
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
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[95] flex items-end justify-center p-3 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={offer.popupTitle}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className="relative flex w-full max-w-md justify-center">{inner}</div>
      </div>
    );
  }
  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[420px] sm:p-0" role="dialog" aria-label={offer.popupTitle}>
      {inner}
    </div>
  );
}
