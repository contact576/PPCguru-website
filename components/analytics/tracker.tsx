"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sendEvent } from "@/lib/analytics";

/**
 * Site-wide, consent-aware visitor tracker. Mounted once in the root layout.
 *  - Records a `pageview` on every route change.
 *  - Records a `click` for any <a>, <button> or [data-track] element (this is the
 *    "any button/anything" capture) with a readable label.
 * All sending is gated by the cookie-consent state inside sendEvent(). No PII is
 * gathered in the browser — the server adds IP/geo only when consent is granted.
 */
export function VisitorTracker() {
  const pathname = usePathname();

  // Pageview on first load + every client navigation.
  useEffect(() => {
    sendEvent("pageview", { path: pathname });
  }, [pathname]);

  // Delegated click capture across the whole document.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest("a, button, [data-track]");
      if (!el) return;
      const label =
        el.getAttribute("data-track") ||
        (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120) ||
        (el as HTMLAnchorElement).getAttribute("href") ||
        el.tagName.toLowerCase();
      sendEvent("click", { target: label });
    }
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
  }, []);

  return null;
}
