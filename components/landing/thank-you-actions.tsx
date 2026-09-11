"use client";

import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/landing/whatsapp-icon";
import { track } from "@/lib/analytics";

/**
 * The two conversion buttons on the landing thank-you pages. Client-only so the
 * taps can be tracked (`phone_click` / `whatsapp_click` are the existing
 * first-party events — GTM can pick them up as ad-platform conversions).
 * The WhatsApp button carries the real WhatsApp mark, not a generic chat icon.
 */
export function ThankYouActions({
  phoneLabel,
  phoneHref,
  whatsappHref,
  source = "landing:100-leads:thank-you",
}: {
  phoneLabel: string;
  phoneHref: string;
  whatsappHref: string | null;
  source?: string;
}) {
  return (
    <div className="thanks-actions">
      <a className="thanks-button thanks-call" href={phoneHref} onClick={() => track("phone_click", { source })}>
        <Phone aria-hidden="true" />
        <span>
          <strong>Call us now</strong>
          <small>{phoneLabel}</small>
        </span>
      </a>
      {whatsappHref ? (
        <a className="thanks-button thanks-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { source })}>
          <WhatsAppIcon size={34} />
          <span>
            <strong>WhatsApp us</strong>
            <small>Fastest reply · usually within minutes</small>
          </span>
        </a>
      ) : null}
    </div>
  );
}
