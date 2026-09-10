"use client";

import { MessageCircle, Phone } from "lucide-react";
import { track } from "@/lib/analytics";

/**
 * The two conversion buttons on /100-leads/thank-you. Client-only so the taps
 * can be tracked (`phone_click` / `whatsapp_click` are the existing first-party
 * events — GTM can pick them up as ad-platform conversions).
 */
export function ThankYouActions({
  phoneLabel,
  phoneHref,
  whatsappHref,
}: {
  phoneLabel: string;
  phoneHref: string;
  whatsappHref: string | null;
}) {
  return (
    <div className="thanks-actions">
      <a className="thanks-button thanks-call" href={phoneHref} onClick={() => track("phone_click", { source: "landing:100-leads:thank-you" })}>
        <Phone aria-hidden="true" />
        <span>
          <strong>Call us now</strong>
          <small>{phoneLabel}</small>
        </span>
      </a>
      {whatsappHref ? (
        <a
          className="thanks-button thanks-whatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { source: "landing:100-leads:thank-you" })}
        >
          <MessageCircle aria-hidden="true" />
          <span>
            <strong>WhatsApp us</strong>
            <small>Fastest reply · usually within minutes</small>
          </span>
        </a>
      ) : null}
    </div>
  );
}
