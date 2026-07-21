"use client";

/**
 * Third-party analytics: Google Tag Manager + Microsoft Clarity.
 *
 * Mounted once in the root layout, so both load on EVERY page.
 *
 * Consent model (matches lib/analytics.ts + components/shared/cookie-consent.tsx):
 * if the visitor explicitly DECLINED the cookie notice we load neither script.
 * Before a choice, or after "Accept", both load — the same posture as the
 * first-party beacon, and disclosed in /privacy.
 *
 * IDs come from env so staging/preview can run without polluting production data:
 *   NEXT_PUBLIC_GTM_ID      (defaults to the live container)
 *   NEXT_PUBLIC_CLARITY_ID  (defaults to the live Clarity project)
 */

import { useEffect, useState } from "react";
import Script from "next/script";

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NRX9BRWF";
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "xpxkvrbt7j";

const CONSENT_KEY = "ppcg_cookie_consent";

export function ThirdPartyAnalytics() {
  const [declined, setDeclined] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        setDeclined(localStorage.getItem(CONSENT_KEY) === "declined");
      } catch {
        /* localStorage unavailable — fall through and load */
      }
    };
    read();
    setReady(true);

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setDeclined(detail === "declined");
    };
    window.addEventListener("ppcg:consent", onConsent);
    return () => window.removeEventListener("ppcg:consent", onConsent);
  }, []);

  if (!ready || declined) return null;

  return (
    <>
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}
    </>
  );
}

/** GTM's <noscript> fallback. Static markup — safe to render server-side. */
export function GtmNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
