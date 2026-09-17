/**
 * Third-party analytics: Google Tag Manager + Microsoft Clarity + Meta Pixel +
 * OpenAI (ChatGPT Ads) Measurement Pixel.
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
 *   NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_CLARITY_ID / NEXT_PUBLIC_META_PIXEL_ID
 *
 * Meta: the Pixel sends PageView (first load here, client navigations from
 * <VisitorTracker>); the Lead goes server-side via the Conversions API
 * (lib/meta-capi.ts), so each lead is counted once.
 */

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-NRX9BRWF";
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "xpxkvrbt7j";
/** "PPC Pixels" dataset in the PPC Guru business (ad account 978235853371610). */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "813865793503374";
/** ChatGPT Ads Measurement Pixel. It does NOT auto-track: page_viewed is sent
 *  here (first load) + <VisitorTracker> (navigations), lead_created by trackLead(). */
export const OPENAI_PIXEL_ID = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID || "VaW8hbc5GLhy5y8FWYNcYt";

/** GTM + Clarity + Meta Pixel + OpenAI pixel loaders. Render inside <head>. */
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

      {/*
        Clarity, deferred off the critical path.

        The vendor snippet injects the tag immediately, which on mobile costs a
        ~50KB download plus its recorder setup while the page is still trying to
        paint and hydrate — for a session recorder, the least time-critical tag
        on the page. This is the same snippet with the injection moved behind
        whichever comes first: window load (+ a beat), or the visitor's first
        real interaction. Nothing is lost — the `clarity()` stub is installed
        synchronously exactly as before, so calls made before the tag arrives
        (notably ConsentSignal's opt-out) queue and replay on load, and any
        session with an interaction is still recorded from its start.
      */}
      {CLARITY_ID && (
        <script
          id="clarity-init"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
var loaded=0,load=function(){if(loaded)return;loaded=1;
var t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
var y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);};
var idle=function(){if(c.requestIdleCallback){c.requestIdleCallback(load,{timeout:3000});}else{c.setTimeout(load,1200);}};
if(l.readyState==="complete"){idle();}else{c.addEventListener("load",idle,{once:true});}
["pointerdown","keydown","touchstart"].forEach(function(e){c.addEventListener(e,load,{once:true,passive:true});});
})(window,document,"clarity","script","${CLARITY_ID}");`,
          }}
        />
      )}
      {/*
        Meta Pixel: Meta's standard base code, loaded immediately — NOT deferred
        like Clarity. Meta Pixel Helper and Events Manager's website check look
        right after load, and a deferred fbevents.js made them report "No pixel
        found" on the landing pages. A visitor who declined the cookie notice
        gets consent revoked before init, so nothing is sent.
      */}
      {META_PIXEL_ID && (
        <script
          id="meta-pixel-init"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
try{if(localStorage.getItem('ppcg_cookie_consent')==='declined'){fbq('consent','revoke');}}catch(e){}
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`,
          }}
        />
      )}

      {/* OpenAI Measurement Pixel: vendor snippet verbatim, then consent + page_viewed. */}
      {OPENAI_PIXEL_ID && (
        <script
          id="openai-pixel-init"
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
try{if(localStorage.getItem('ppcg_cookie_consent')==='declined'){oaiq("consent",false);}}catch(e){}
oaiq("init",{pixelId:"${OPENAI_PIXEL_ID}",debug:true});
oaiq("measure","page_viewed",{type:"contents",contents:[{id:location.pathname,name:document.title,content_type:"page"}]});`,
          }}
        />
      )}
    </>
  );
}

/** GTM + Meta Pixel <noscript> fallbacks — must be the first element inside <body>. */
export function GtmNoScript() {
  return (
    <noscript>
      {META_PIXEL_ID && (
        // eslint-disable-next-line @next/next/no-img-element -- Meta's standard noscript beacon
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
      )}
      {GTM_ID && (
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      )}
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
function mark(x){document.cookie='ppcg_consent='+x+';path=/;max-age=31536000;SameSite=Lax';}
function deny(){
  gtag('consent','update',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
  if(window.clarity){window.clarity('consent',false);}
  if(window.fbq){window.fbq('consent','revoke');}
  if(window.oaiq){window.oaiq('consent',false);}
  mark('declined');
}
if(v==='declined'){deny();}
window.addEventListener('ppcg:consent',function(e){
  if(e.detail==='declined'){deny();}
  else{gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
       if(window.clarity){window.clarity('consent');}
       if(window.fbq){window.fbq('consent','grant');}
       if(window.oaiq){window.oaiq('consent',true);}
       mark('accepted');}
});
}catch(e){}})();`;
  return <script id="ppcg-consent-signal" dangerouslySetInnerHTML={{ __html: js }} />;
}
