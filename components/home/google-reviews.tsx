"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BrandIcon } from "@/components/shared/brand-logos";
import { reviewsWidget, reviewsWidgetConfigured, googleProfile } from "@/lib/data/reviews-widget";

const ink = "#14170e";

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5`} style={{ display: "inline-flex", gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"
            fill={i < Math.round(rating) ? "#FBBC05" : "#e3e0d0"}
          />
        </svg>
      ))}
    </span>
  );
}

/**
 * Loads the configured third-party Google-reviews widget once, client-side.
 * Each provider has its own embed shape (script URL + target markup), handled
 * below. When no widget is configured, `fallback` is rendered instead.
 */
function WidgetEmbed() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { provider, id } = reviewsWidget;
    const host = ref.current;
    if (!host) return;

    // Build the provider-specific target element + script URL.
    let scriptSrc = "";
    if (provider === "elfsight") {
      host.innerHTML = `<div class="elfsight-app-${id}" data-elfsight-app-lazy></div>`;
      scriptSrc = "https://static.elfsight.com/platform/platform.js";
    } else if (provider === "trustindex") {
      // Trustindex's loader renders in place of its own <script> tag.
      scriptSrc = `https://cdn.trustindex.io/loader.js?${id}`;
    } else if (provider === "featurable") {
      host.innerHTML = `<div id="${id}" data-featurable-async></div>`;
      scriptSrc = "https://featurable.com/assets/bundle.js";
    } else {
      return;
    }

    const marker = `data-reviews-loaded-${provider}`;
    if (document.querySelector(`script[${marker}]`)) return; // load once per page
    const s = document.createElement("script");
    s.src = scriptSrc;
    s.async = true;
    s.defer = true;
    s.setAttribute(marker, "1");
    (provider === "trustindex" ? host : document.body).appendChild(s);
  }, []);

  return <div ref={ref} style={{ minHeight: 200 }} />;
}

/**
 * "Original Reviews from Google" homepage section body: a Google-branded header
 * + the live reviews widget (or the representative testimonials `fallback`
 * until a widget id is configured).
 */
export function GoogleReviews({ fallback }: { fallback: ReactNode }) {
  const configured = reviewsWidgetConfigured();

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 34 }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#fff", border: "1px solid #e3e0d0", borderRadius: 999,
            padding: "9px 16px", boxShadow: "0 6px 20px rgba(20,23,14,.06)",
          }}
        >
          <BrandIcon name="Google" size={22} />
          <span className="head" style={{ fontSize: 15, color: ink }}>Original Reviews from Google</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Stars rating={googleProfile.rating} />
          <span className="head" style={{ fontSize: 17, color: ink }}>{googleProfile.rating.toFixed(1)}</span>
          {googleProfile.count ? (
            <span style={{ fontSize: 13, color: "#8a8c72" }}>· {googleProfile.count} reviews</span>
          ) : null}
        </div>
        <a
          href={googleProfile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mono"
          style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#4f5f14", borderBottom: "1px solid #cfe39a", paddingBottom: 2 }}
        >
          See all reviews on Google →
        </a>
      </div>

      {configured ? <WidgetEmbed /> : fallback}
    </div>
  );
}
