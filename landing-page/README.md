# PPC Guru 100 Qualified Leads Landing Page

This folder contains the standalone, mobile-first Google Ads and Meta Ads landing page prepared for PPC Guru's paid campaigns.

## Local preview

```powershell
npm install
npm run dev
```

## Production build

```powershell
npm run build
```

The build creates the static client in `dist/client` and the Sites-compatible server entry in `dist/server`.

## Included proof assets

- 57 supplied client logos, presented as a selection from 200+ businesses served.
- Seven supplied Meta Ads campaign screenshots.
- Responsive three-step lead qualification flow.
- Swipeable and auto-rotating campaign-result gallery.

## Developer handoff notes

The landing page is intentionally self-contained so it can be reviewed without changing the production Next.js app. It can be deployed as its own static route or ported into an App Router route in the main website.

Before sending paid traffic, connect the form to the approved CRM/form endpoint and add consent storage, spam protection, Meta Pixel, Google Ads conversion tracking, analytics, the booking destination, and approved written guarantee terms. The current form success state is front-end only.
