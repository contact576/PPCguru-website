"use client";

import { CalendarCheck, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/landing/whatsapp-icon";
import { track } from "@/lib/analytics";

/**
 * The conversion buttons on the landing thank-you pages. Client-only so the
 * booking and WhatsApp taps can be tracked. The site-wide VisitorTracker owns
 * phone_click, including its GTM event, so a call-button tap is counted once.
 * The WhatsApp button carries the real WhatsApp mark, not a generic chat icon.
 *
 * "Book a meeting" leads because a booked slot beats a callback; it scrolls to
 * the embedded GHL calendar (#book) rather than leaving the page.
 */
export function ThankYouActions({
  phoneLabel,
  phoneHref,
  whatsappHref,
  bookHref = "#book",
  source = "landing:100-leads:thank-you",
}: {
  phoneLabel: string;
  phoneHref: string;
  whatsappHref: string | null;
  /** Anchor of the embedded calendar (or a full URL if it ever lives elsewhere). */
  bookHref?: string;
  source?: string;
}) {
  return (
    <div className="thanks-actions">
      <a className="thanks-button thanks-book" href={bookHref} onClick={() => track("booking_click", { source })}>
        <CalendarCheck aria-hidden="true" />
        <span>
          <strong>Book a meeting</strong>
          <small>Pick a time that works — takes 30 seconds</small>
        </span>
      </a>
      <a className="thanks-button thanks-call" href={phoneHref} data-phone-link="business" data-track-source={source}>
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
