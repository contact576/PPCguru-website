# PPC Guru homepage revamp: content and search brief

This brief governs the separate homepage revamp, now being refined in the `ppcguru-revamp-compact` checkout. Changes here are not a release of the production `ppcguru.ca` homepage.

## Historical search evidence

The refreshed Google Search Console audit for July 10–October 7, 2026 records 238 homepage clicks and 32,854 impressions, with an average position of 7.8. The homepage is indexed with matching declared/selected canonical, `https://ppcguru.ca/`. Branded searches lead; `ppc agency toronto` and `ppc services toronto` also earn visibility. Detailed URL/query evidence and inspection results are in `SEO-REVAMP-PRESERVATION.md`. Search Console attributes performance to a URL, not individual sections; these figures do not establish that any particular block caused rankings.

Preserve the root URL and canonical, Toronto PPC wording, crawlable links to Google Ads, Meta Ads, SEO, industry and location pages, the LocalBusiness/WebSite/WebPage graph, contact details, credible partner references, and a concise answer section. Remove repeated audit pitches, generic AI-tool lists, illustrative dashboards, sample testimonials, and representative case-study metrics from the homepage. Do not render animated zero-valued proof as initial HTML.

The previous audit also recorded a stored `page_meta` override for `/` containing an unsupported `#1` title. The revamp makes the homepage's reviewed, source-authored title and description authoritative. This revision does not modify or re-audit the production database.

## Search and AI discovery principles

Write useful, first-hand, indexable HTML with descriptive headings, relevant internal links, clear ownership/contact information, and accurate evidence. Google says its normal Search fundamentals apply to AI Overviews/AI Mode; it does not require special AI files or schema. OpenAI says allowing OAI-SearchBot permits ChatGPT Search inclusion but does not guarantee citation. The existing robots policy allows it. Do not promise rankings, citations, or placement in ChatGPT/Gemini.

Primary references: [Google AI optimization](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Google helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

Google's current guidance does not prescribe an ideal page length or a special section count for AI search. A shorter homepage can retain useful service explanations, business facts and routes to deeper pages. Keep descriptive, crawlable links rather than relying only on images or click handlers. [Google AI optimization](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Google link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).

Meta visibility is a different topic: Meta describes personalized ranking of Feed, Reels and Stories, and selection of ads for audiences. Those are not Google-style homepage SEO rankings. The homepage should help visitors arriving from Meta understand the offer, verify the business and enquire; adding or keeping a website section does not establish a Meta ranking benefit. [Meta content-ranking explanation](https://about.fb.com/news/2023/06/how-ai-ranks-content-on-facebook-and-instagram/), [Meta's 2026 ads-ranking update](https://about.fb.com/news/2026/01/2026-ai-drives-performance/).

## Compact homepage order and rationale

The current order in `app/page.tsx` is:

1. Hero, Google Ads/Meta service logos and the illustrated customer journey.
2. Platform partner references.
3. Two moving selected-client logo rows, headed “Trusted by 200+ businesses.”
4. Google Ads and Meta Ads campaign-report rails, directly after the logos.
5. Five linked service cards.
6. Client testimonials.
7. Interactive growth choices.
8. Four-step working process and account-ownership reassurance.
9. Industry and location links.
10. Independent review and agency-profile links.
11. Frequently asked questions.
12. Three recent published articles.
13. Free-audit form, followed by the shared site footer.

**Keep:** Service descriptions and links, Toronto/business details, industry and location hubs, genuine review context, questions and article links. These help visitors understand the agency and navigate to relevant information; crawlable links also support discovery. Preserve the root canonical, accurate structured data and working contact/form paths. This is a content-preservation rationale, not a claim that each section independently ranks.

**Compact:** Reduce the oversized section gaps, heading scale and card padding while retaining the useful copy and link destinations. The general section rhythm now uses 48–72px vertical padding, with a 40px narrow-screen rule, instead of the previous 76–138px range. Section-heading bottom spacing drops from 48px to 26px. Growth choices, process, credibility and the audit remain distinct but more compact parts of the funnel.

**Remove/replace:** Remove the standalone “Search / Maps / Answers” organic-visibility section; its useful SEO description and service link already remain in the service cards. Replace the older `CampaignDeck` proof section with report rails after the client logos, avoiding two competing campaign galleries. Do not remove the SEO service page or location/industry links as part of this visual simplification.

## Approved homepage story

**Title:** Toronto PPC Agency for Google Ads, Meta Ads & SEO | PPC Guru

**Description:** PPC Guru is a Toronto PPC agency connecting Google Ads, Meta Ads, SEO, landing pages and tracking. See campaign evidence and get a free website and ads audit.

**Hero eyebrow:** Toronto PPC agency · Canada & the US

**H1:** Turn clicks into real conversions.

**Hero paragraph:** Reach the right people. Give them a reason to choose you. We connect Google Ads, Meta Ads, SEO and AI search with a website built to turn interest into enquiries worth following up.

**Primary action:** Get my free audit (scroll to the homepage audit form). **Secondary action:** See the work (scroll to the proof section). The homepage floating CTA leads to this same form and stays hidden while the hero or audit is visible. The homepage offer popup opens at 40% scroll, once per session, with a dismissible, keyboard-accessible audit form. It does not open from a timer or exit intent and waits while someone is typing in a form or viewing a campaign report.

**Services heading:** Everything your next customer needs to say yes. Describe Google Ads, Meta Ads, SEO/local search, landing pages/CRO, and tracking/CRM in plain English. Link each to its canonical service page.

**Evidence heading:** Real campaigns. Real results. `HomeCampaignReports` follows the client logos and retains the `#proof` anchor. It uses all 43 supplied images from `lib/data/landing-paid-ads-reports.ts`: 28 Google Ads reports in the upper rail and 15 Meta Ads reports below. The rows loop continuously in opposite directions, with compact floating images, manual browsing, a Pause/Resume control, an accessible full-image viewer, off-screen/background suspension and reduced-motion handling. Images preserve the supplied screenshot framing and redactions. Each report retains its own period and metrics; do not infer a shared date range or transcribe unsupported claims. Reports are supplied evidence, not independently verified account access or a forecast of future results. Homepage styles are isolated from the paid landing page.

**Growth choices:** After the services and testimonials, visitors choose more enquiries, better-fit leads or more from their website. Each choice shows a distinct starting plan, linked service priorities and an audit CTA. This is an explainer, not an automated audit or a promise of results. Selections are not submitted as lead data.

**Process heading:** A clear plan, then steady improvement. Audit the current site and tracking; agree priorities and measurement; build with account ownership and tracking intact; review enquiry quality and explain what changes.

**Organic visibility:** The separate “Be useful wherever customers search” section is removed. The SEO/local-search service card, its crawlable service link, industry/location links and accurate business information retain the useful subject matter without repeating it in a large decorative section.

**Trust:** Real partner-profile links, all 57 supplied client logos from the 100 Leads page in two opposite-moving rows at equal pixel speed, and named verbatim reviews from the documented Google review dataset, each linked to the public Business Profile. The owner confirmed the 200+ businesses wording on October 10, 2026; shared business-count copy now uses that same figure. Omit stale review counts and unverifiable result claims. Retain owner-confirmed directory profile links, using original platform artwork where available and plain text elsewhere.

**Visual update:** The hero shows discovery → landing page → enquiry → follow-up with animated connectors, a floating page preview and a pause control. It includes Google Ads, Meta Ads, Google Search and ChatGPT Search, with unchanged official OpenAI artwork. The actual PPC Guru `/100-leads` screenshot, captured locally on 2026-10-07, is a non-clickable illustration. Services use bundled platform artwork. Partner links retain the unboxed original Google/Meta marks and separate descriptive labels. Two transparent client logos with white lettering receive a dark backdrop for contrast. Review-platform asset provenance is recorded in `public/badges/reviews/SOURCES.md`. Scroll-triggered entrance motion and a page-progress line run top to bottom, respect reduced-motion preferences and never hide the server-rendered copy.

**Location/industry:** One compact set of existing industry links and Toronto/GTA service links. Preserve the hubs as well.

**Questions:** Which channel first? What is in the free audit? Who owns the ad accounts? How are fees handled? How is success measured? Where do you work? Can you help with AI search? Answer each directly in server-rendered text; any FAQ schema must match visible answers.

**Final action:** Know what to fix. Know what's next. The offer lists a website/enquiry-path review, tracking gaps, priorities for goals and budget, and a campaign review when account access is shared. The user keeps their accounts; scope and fees are agreed before paid work. Form copy says “Free · No obligation” and “Request my free audit” without an untested completion-time claim.

## Editorial constraints

- Do not present the representative `/results` scenarios or `homeTestimonials` as measured client results or Google reviews.
- Do not equate a Google Ads “conversion” with a sale or qualified lead without proof.
- Do not cite national-brand logos as current advertising clients without specific evidence.
- Keep platform-partner claims linked to profile or documentation and refrain from promising special platform treatment.
- Keep the form's offer aligned with `/free-audit`; avoid guarantees, fixed response times, or invented business counts.
