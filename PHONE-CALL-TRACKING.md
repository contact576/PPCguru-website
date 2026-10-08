# Phone display and call tracking

All public business phone links use `siteConfig.contact`:

- Display: `(519) 992-9567`
- Native call link: `tel:5199929567`
- Structured business metadata: `+15199929567`
- WhatsApp: `https://wa.me/15199929567` (WhatsApp requires the country code)

The published `GTM-NRX9BRWF` container inspected on 2026-10-08 (version 6) has a Google Ads Calls from Website tag configured for exactly `(519) 992-9567`, plus its conversion linker, on all pages. The visible number now matches that setting. Google recommends national formatting without a plus sign for this GTM tag: https://support.google.com/google-ads/answer/6095883.

The shared visitor tracker also pushes one `phone_click` event for each public business-phone click, unless the visitor declined tracking. Its parameters are `click_url`, `link_url`, `phone_number`, `page_path`, `link_text` and `source`. `phone_number` identifies the business as `5199929567`; both URL fields retain the actual clicked link, including a Google forwarding number when present. `data-phone-link="business"` preserves recognition after number replacement. Admin/customer phone links are excluded.

The handler does not cancel navigation or delay dialing. This event measures a click to call, not a connected call or a completed lead. Google Ads' existing forwarding-number tag remains responsible for eligible website call conversions. No extra Google Ads or Meta conversion is fired by this handler.

The inspected GTM version does not have a GA4 tag listening to `phone_click`. To report this event in GA4, configure a Custom Event trigger named `phone_click` and a GA4 Event tag using that event name and the parameters above. Do not wire the same conversion to both that trigger and a Just Links trigger. Data-layer reference: https://developers.google.com/tag-platform/devguides/datalayer.

Validate implementation offline with `node scripts/check-phone-tracking.mjs`, then `npm run build`. Check displayed numbers and hrefs on the homepage, contact page, mobile menu, campaign landing pages and thank-you pages. A completed-call conversion requires a real eligible ad visit and call; a local click test does not establish that outcome.
