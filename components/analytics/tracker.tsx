"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sendEvent, trackBusinessPhoneClick, trackLead, trackPageViewed } from "@/lib/analytics";
import { GTA_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-gta";
import { GOOGLE_META_LANDING_THANK_YOU_PATH } from "@/lib/data/landing-google-meta";

/**
 * Site-wide, consent-aware visitor tracker. Mounted once in the root layout.
 *  - Records a `pageview` on every route change.
 *  - Records a `click` for any <a>, <button> or [data-track] element (this is the
 *    "any button/anything" capture) with a readable label.
 *  - Business telephone links emit `phone_click` once, to the first-party
 *    collector and GTM data layer, instead of the generic click event.
 * All sending is gated by the cookie-consent state inside sendEvent(). No PII is
 * gathered in the browser — the server adds IP/geo only when consent is granted.
 */
export function VisitorTracker() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  // Pageview on first load + every client navigation.
  useEffect(() => {
    sendEvent("pageview", { path: pathname });
    // Meta + OpenAI pixels: their base code already tracked the first load.
    if (firstLoad.current) firstLoad.current = false;
    else {
      (window as { fbq?: (...a: unknown[]) => void }).fbq?.("track", "PageView");
      trackPageViewed(pathname);
    }
    // The /100-leads and /seo-visibility actions redirect here on success.
    // Growth-plan funnels use ConfirmedLandingConversion with a server receipt.
    if (pathname.endsWith("/thank-you") && pathname !== GTA_LANDING_THANK_YOU_PATH && pathname !== GOOGLE_META_LANDING_THANK_YOU_PATH) trackLead({ requireId: true });
  }, [pathname]);

  // Delegated click capture across the whole document.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = e.target instanceof Element ? e.target.closest("a, button, [data-track]") : null;
      if (!el) return;
      const label =
        el.getAttribute("data-track") ||
        (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120) ||
        (el as HTMLAnchorElement).getAttribute("href") ||
        el.tagName.toLowerCase();
      if (el instanceof HTMLAnchorElement && trackBusinessPhoneClick({
        href: el.getAttribute("href") || "",
        linkText: label,
        isBusinessLink: el.getAttribute("data-phone-link") === "business",
        source: el.getAttribute("data-track-source") || (el.closest("header") ? "header" : el.closest("footer") ? "footer" : "website"),
      })) return;
      sendEvent("click", { target: label });
    }
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
  }, []);

  return null;
}
