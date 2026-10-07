# PPC Guru homepage revamp: content and search brief

This brief governs the new `/` page on `ppc-guru-website-revamp`. Production is unchanged until a later, explicitly requested release.

## What the existing homepage is earning

Google Search Console reports the homepage indexed with a successful mobile crawl and the same declared/selected canonical, `https://ppcguru.ca/`. In the July 8–October 5, 2026 window it received 225 clicks and 32,698 impressions. Branded searches lead, but `ppc agency toronto`, `ppc services toronto`, and `toronto ppc company` also bring visibility. Search Console attributes performance to a URL, not to a section; no individual block can be called a ranking factor from these figures.

Preserve the root URL and canonical, Toronto PPC wording, crawlable links to Google Ads, Meta Ads, SEO, industry and location pages, the LocalBusiness/WebSite/WebPage graph, contact details, credible partner references, and a concise answer section. Remove repeated audit pitches, generic AI-tool lists, illustrative dashboards, sample testimonials, and representative case-study metrics from the homepage. Do not render animated zero-valued proof as initial HTML.

The currently stored `page_meta` record for `/` overrides source metadata with an unsupported `#1` title. The revamp makes the homepage's reviewed, source-authored title and description authoritative when this branch is eventually released. This does not modify the production database now.

## Search and AI discovery principles

Write useful, first-hand, indexable HTML with descriptive headings, relevant internal links, clear ownership/contact information, and accurate evidence. Google says its normal Search fundamentals apply to AI Overviews/AI Mode; it does not require special AI files or schema. OpenAI says allowing OAI-SearchBot permits ChatGPT Search inclusion but does not guarantee citation. The existing robots policy allows it. Do not promise rankings, citations, or placement in ChatGPT/Gemini.

Primary references: [Google AI optimization](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Google helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [OpenAI publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq).

## Approved homepage story

**Title:** Toronto PPC Agency for Google Ads, Meta Ads & SEO | PPC Guru

**Description:** PPC Guru is a Toronto PPC agency connecting Google Ads, Meta Ads, SEO, landing pages and tracking. See campaign evidence and get a free website and ads audit.

**Hero eyebrow:** Toronto PPC agency · Canada & the US

**H1:** Turn clicks into real conversations.

**Hero paragraph:** Reach the right people. Give them a reason to choose you. We connect Google Ads, Meta Ads, SEO and your website to turn interest into enquiries worth following up.

**Primary action:** Get my free audit (scroll to the homepage audit form). **Secondary action:** See the work (scroll to the proof section). The homepage floating CTA leads to this same form and stays hidden while the hero or audit is visible; the automatic offer popup is suppressed on the homepage.

**Services heading:** Everything your next customer needs to say yes. Describe Google Ads, Meta Ads, SEO/local search, landing pages/CRO, and tracking/CRM in plain English. Link each to its canonical service page.

**Evidence heading:** Less guesswork. More to go on. Rotate all 23 PPC Guru-supplied, styled and redacted Google and Meta campaign report visuals with manual controls, pause, off-screen suspension and reduced-motion handling. Call Google outcomes “conversions” and Meta outcomes “leads,” as the visuals do. Say explicitly that figures were transcribed from these materials, not independently verified in the ad accounts; they are not a forecast of sales.

**Growth choices:** After the partner section and enlarged 57-logo client strip, visitors choose more enquiries, better-fit leads or more from their website. Each choice shows a distinct starting plan, linked service priorities and an audit CTA. This is an explainer, not an automated audit or a promise of results. Selections are not submitted as lead data.

**Process heading:** A clear plan, then steady improvement. Audit the current site and tracking; agree priorities and measurement; build with account ownership and tracking intact; review enquiry quality and explain what changes.

**Organic visibility heading:** Be useful wherever customers search. Explain local SEO, clear service/location content, and accurate business facts without claiming guaranteed placement in AI answers.

**Trust:** Real partner-profile links, all 57 supplied client logos from the 100 Leads page in one uniform moving strip, and named verbatim reviews from the documented Google review dataset, each linked to the public Business Profile. Omit stale review counts and unverifiable aggregate client/result claims. Restore all existing owner-confirmed directory profile links, using original platform artwork where available and plain text elsewhere.

**Visual update:** The hero shows an illustrated discovery → landing page → enquiry → follow-up journey with animated connectors, a floating page preview and a pause control. It uses the bundled Google Ads, Meta and Google logo assets and the actual PPC Guru `/100-leads` screenshot captured locally on 2026-10-07. It is explicitly labeled as an illustration and a PPC Guru landing page, not a live dashboard or client website work. The previous generic principle section is removed to avoid repeating this story. Services use the bundled platform artwork. Partner links retain the unboxed original Google/Meta marks and separate descriptive labels. Two transparent client logos with white lettering receive a dark backdrop for contrast. Review-platform asset provenance is recorded in `public/badges/reviews/SOURCES.md`.

**Location/industry:** One compact set of existing industry links and Toronto/GTA service links. Preserve the hubs as well.

**Questions:** Which channel first? What is in the free audit? Who owns the ad accounts? How are fees handled? How is success measured? Where do you work? Answer each directly in server-rendered text; any FAQ schema must match visible answers.

**Final action:** Know what to fix. Know what's next. The offer lists a website/enquiry-path review, tracking gaps, priorities for goals and budget, and a campaign review when account access is shared. The user keeps their accounts; scope and fees are agreed before paid work. Form copy says “Free · No obligation” and “Request my free audit” without an untested completion-time claim.

## Editorial constraints

- Do not present the representative `/results` scenarios or `homeTestimonials` as measured client results or Google reviews.
- Do not equate a Google Ads “conversion” with a sale or qualified lead without proof.
- Do not cite national-brand logos as current advertising clients without specific evidence.
- Keep platform-partner claims linked to profile or documentation and refrain from promising special platform treatment.
- Keep the form's offer aligned with `/free-audit`; avoid guarantees, fixed response times, or invented business counts.
