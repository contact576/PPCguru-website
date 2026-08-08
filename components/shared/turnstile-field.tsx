"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The "I'm not a robot" check, as a drop-in form field.
 *
 * Renders the Cloudflare Turnstile widget and posts its result as the hidden
 * `turnstileToken` field, plus a `renderedAt` stamp the server uses as a
 * time-trap (see `lib/spam-filter.ts`). Drop it inside any <form> above the
 * submit button — no other wiring needed.
 *
 * Uses **explicit** rendering rather than the `cf-turnstile` auto-scan class:
 * our forms mount inside modals and pop-ups, several can exist on one page, and
 * auto-scan only sweeps the DOM once at script load, so widgets in a
 * later-mounted modal would silently never render.
 *
 * Degrades safely: with no `NEXT_PUBLIC_TURNSTILE_SITE_KEY` the widget is
 * skipped and only the timestamp is posted, so forms keep working.
 */

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loader: Promise<TurnstileApi> | null = null;

/** Load the Turnstile script once per page, shared by every widget instance. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (loader) return loader;

  loader = new Promise<TurnstileApi>((resolve, reject) => {
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    // Poll rather than listen for `load`: the script tag may already have loaded
    // (another instance added it), in which case a late listener never fires.
    const started = Date.now();
    const tick = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(tick);
        resolve(window.turnstile);
      } else if (Date.now() - started > 12_000) {
        window.clearInterval(tick);
        loader = null; // allow a retry on the next mount
        reject(new Error("turnstile script timeout"));
      }
    }, 120);
  });
  return loader;
}

export function TurnstileField({
  /** Change this value to force a fresh challenge (tokens are single-use). */
  resetKey,
  className = "",
  action,
  /** For forms that build FormData by hand instead of posting the DOM form. */
  onToken,
}: {
  resetKey?: string | number;
  className?: string;
  action?: string;
  onToken?: (token: string) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [failed, setFailed] = useState(false);
  // Stamped on mount, in the browser — a bot POSTing the raw HTML never has it.
  const [renderedAt] = useState(() => String(Date.now()));
  // Held in a ref so a caller's inline arrow doesn't re-run the render effect.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!siteKey || !hostRef.current) return;
    let cancelled = false;

    loadTurnstile()
      .then((ts) => {
        if (cancelled || !hostRef.current || widgetId.current) return;
        widgetId.current = ts.render(hostRef.current, {
          sitekey: siteKey,
          // Cloudflare only accepts /^[a-zA-Z0-9_-]{1,32}$/ here; sources like
          // "popup:audit" would make render() throw, so normalise centrally.
          action: action ? action.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 32) : undefined,
          theme: "light",
          callback: (t: string) => { setToken(t); setFailed(false); onTokenRef.current?.(t); },
          // Turnstile tokens expire after ~5 min; clear ours so a stale one is
          // never posted (Cloudflare would reject it and we'd block a real lead).
          "expired-callback": () => { setToken(""); onTokenRef.current?.(""); },
          "timeout-callback": () => { setToken(""); onTokenRef.current?.(""); },
          "error-callback": () => { setToken(""); setFailed(true); onTokenRef.current?.(""); },
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      const id = widgetId.current;
      widgetId.current = null;
      if (id && window.turnstile) {
        try { window.turnstile.remove(id); } catch { /* already gone */ }
      }
    };
  }, [siteKey, action]);

  // A consumed token can't be reused — refresh the challenge when the form does.
  useEffect(() => {
    if (resetKey === undefined || !widgetId.current || !window.turnstile) return;
    try {
      window.turnstile.reset(widgetId.current);
      setToken("");
      onTokenRef.current?.("");
    } catch { /* widget unmounted */ }
  }, [resetKey]);

  const hidden = (
    <>
      <input type="hidden" name="turnstileToken" value={token} />
      <input type="hidden" name="renderedAt" value={renderedAt} />
    </>
  );

  // With no site key there's nothing visible to lay out — return the hidden
  // fields bare so we don't leave an empty box eating a `space-y-*` gap.
  if (!siteKey) return hidden;

  return (
    <div className={className}>
      <div ref={hostRef} />
      {failed && (
        <p className="text-[11px] text-[var(--color-ink-faint)]">
          Couldn&apos;t load the robot check. You can still submit — or email us directly.
        </p>
      )}
      {hidden}
    </div>
  );
}
