"use client";

import { CalendarCheck, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { track } from "@/lib/analytics";

/**
 * The GoHighLevel booking calendar, embedded on the landing thank-you pages so
 * a lead can pick a slot the moment the form is in — the shortest path from
 * submission to a meeting in the calendar.
 *
 * NB: GHL's own `form_embed.js` resizer is deliberately NOT loaded. Against this
 * calendar it treats the frame as a popup and parks it off-screen
 * (`opacity:0; visibility:hidden; left:-9999px`), i.e. an invisible calendar.
 * A fixed frame height plus internal scrolling is boring and works. The visible
 * link underneath is the fallback for anyone whose browser blocks third-party
 * frames.
 *
 * `name` (the ?n= first name already sanitised by the thank-you page) prefills
 * the booking form when GHL recognises the param; it is harmless if it doesn't.
 */
export function BookingCalendar({
  name,
  source,
  kicker = "Fastest next step",
  title = "Book your call now",
  copy = "Pick a time that suits you and we'll confirm it by email straight away.",
}: {
  name?: string;
  /** analytics source for the booking taps, e.g. "landing:100-leads:thank-you". */
  source: string;
  kicker?: string;
  title?: string;
  copy?: string;
}) {
  const { widgetId, url } = siteConfig.booking;
  const src = name ? `${url}?first_name=${encodeURIComponent(name)}` : url;
  // GHL's embed script expects the id its own snippet generates —
  // `<calendarId>_<timestamp>`. A bare calendar id makes form_embed.js treat the
  // frame as a popup and park it off-screen. The suffix is a literal (not
  // Date.now()) so server and client render the same id.
  const frameId = `${widgetId}_1758000000000`;

  return (
    <section className="thanks-booking" id="book" aria-labelledby="book-title">
      <div className="thanks-booking-head">
        <p className="section-kicker">
          <CalendarCheck aria-hidden="true" /> {kicker}
        </p>
        <h2 id="book-title">{title}</h2>
        <p>{copy}</p>
      </div>

      <div className="thanks-booking-frame">
        <iframe
          src={src}
          id={frameId}
          title="Book a meeting with PPC Guru"
          style={{ width: "100%", border: "none", display: "block" }}
        />
      </div>

      <p className="thanks-booking-fallback">
        Calendar not loading?{" "}
        <a href={src} target="_blank" rel="noopener noreferrer" onClick={() => track("booking_click", { source })}>
          Open the booking page <ExternalLink aria-hidden="true" />
        </a>
      </p>
    </section>
  );
}
