/**
 * Third-party analytics: Google Tag Manager + Microsoft Clarity.
 *
 * Rendered once in the root layout, so both load on EVERY page.
 *
 * These are deliberately PLAIN inline <script> tags in the server-rendered HTML
 * — the standard vendor snippets, byte for byte. Both Google Tag Assistant and
 * Clarity's "is it installed?" check read the raw HTML, so a client-injected
 * tag (next/script in a client component) reports as NOT INSTALLED even though
 * it works in a real browser. Don't move these behind a client component.
 *
 * Consent: the cookie notice is a notice, not a gate — tags load for everyone,
 * which is the PIPEDA-aligned implied-consent posture already used by the
 * first-party beacon (lib/analytics.ts) and disclosed in /privacy. If a visitor
 * explicitly DECLINES, <ConsentSignal> tells both vendors to stop (Consent Mode
 * v2 denial for GTM, clarity('consent', false) for Clarity).
 *
 * IDs are env-overridable so a staging deploy can point elsewhere:
 *   NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_CLARITY_ID
 */

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NRX9BRWF";
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "xpxkvrbt7j";

/** GTM + Clarity loaders. Render inside <head>. */
export function AnalyticsScripts() {
  return (
    <>
      {GTM_ID && (
        <script
          id="gtm-init"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      )}

      {CLARITY_ID && (
        <script
          id="clarity-init"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${CLARITY_ID}");`,
          }}
        />
      )}
    </>
  );
}

/** GTM's <noscript> fallback — must be the first element inside <body>. */
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

/**
 * Honours an explicit "Decline" on the cookie notice: denies GTM's Consent Mode
 * v2 storage signals and revokes Clarity's cookie consent. Runs before the
 * loaders above have finished fetching, so a returning visitor who previously
 * declined is covered on first paint.
 */
export function ConsentSignal() {
  const js = `(function(){try{
var v=localStorage.getItem('ppcg_cookie_consent');
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
function deny(){
  gtag('consent','update',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
  if(window.clarity){window.clarity('consent',false);}
}
if(v==='declined'){deny();}
window.addEventListener('ppcg:consent',function(e){
  if(e.detail==='declined'){deny();}
  else{gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
       if(window.clarity){window.clarity('consent');}}
});
}catch(e){}})();`;
  return <script id="ppcg-consent-signal" dangerouslySetInnerHTML={{ __html: js }} />;
}
