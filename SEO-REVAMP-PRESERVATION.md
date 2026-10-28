# PPC Guru revamp: search preservation audit

Audited 10 October 2026 in the separate `ppcguru-revamp-compact` checkout. This document records read-only production Search Console evidence and source-code findings. It is not a production deployment or a promise of ranking preservation. The live indexed site and the local revamp are different versions.

## Fresh Search Console evidence

Source: the connected PPC Guru Search Console tools, verified property `sc-domain:ppcguru.ca`. The complete 90-day reporting window is **10 July–7 October 2026**; the connector excludes the most recent incomplete days. Site totals are **344 clicks, 68,276 impressions, 0.50% CTR and 31.3 average position**. Positions below are period averages, not fixed current rankings. Page and query totals differ because Search Console does not expose every query.

| Existing URL | Clicks | Impressions | Average position |
| --- | ---: | ---: | ---: |
| `/` | 238 | 32,854 | 7.8 |
| `/services/seo` | 2 | 4,245 | 64.8 |
| `/toronto/google-ads` | 5 | 2,988 | 58.7 |
| `/services/google-ads` | 3 | 2,985 | 66.3 |
| `/services/meta-ads` | 5 | 2,039 | 50.6 |
| `/brampton/google-ads` | 4 | 1,703 | 36.1 |
| `/blog/seo-toronto-cost` | 6 | 1,638 | 24.4 |
| `/vaughan/google-ads` | 4 | 1,211 | 38.5 |
| `/services/web-design` | 2 | 360 | 10.4 |

Other service routes also have impressions: LinkedIn Ads 637, YouTube Ads 401, TikTok Ads 332, CRM 290, AI automation 246, creative 165, landing-page/CRO 161, Microsoft Ads 158 and Pinterest Ads 143. Do not remove or rename these routes simply because the homepage presents fewer service cards.

The homepage appears for branded queries and relevant Toronto PPC searches:

| Homepage query | Clicks | Impressions | Average position |
| --- | ---: | ---: | ---: |
| `ppc guru` | 146 | 1,087 | 2.4 |
| `ppc agency toronto` | 3 | 3,758 | 4.5 |
| `ppc services toronto` | 4 | 673 | 4.9 |
| `toronto ppc management` | 1 | 704 | 11.5 |
| `toronto ppc company` | 1 | 382 | 8.9 |

Focused service-query samples include `google ads management service mississauga` for the Google Ads page, `meta ads agency toronto` for the Meta Ads page, and `hire local seo expert` for SEO. These support keeping relevant service and geographic language, not repeating every query verbatim.

Search Console attributes performance to URLs and queries, not to individual page sections. This evidence cannot establish that a carousel, logo strip, FAQ block or any other single section caused a ranking. The earlier 8 July–5 October snapshot had 225 homepage clicks and 32,698 impressions. It must not be described as this refreshed window or as a controlled before/after comparison; the homepage brief now references the refreshed figures above.

## Current indexing checks

URL Inspection reports **Submitted and indexed**, successful fetches, allowed crawling/indexing and matching declared/Google-selected canonicals for:

- `/` — last crawl 8 October 2026.
- `/services/google-ads` — 6 October.
- `/services/meta-ads` — 2 October.
- `/services/seo` — 7 October.
- `/toronto/google-ads` — 6 October.
- `/blog/seo-toronto-cost` — 29 September.

These are Google's last indexed inspections, not live tests of the revamp. Two historical report entries were also checked: `https://www.ppcguru.ca/compare` is a redirect to the non-www canonical, and `/3-minimum-deposit-slots-canada` is reported not found. Their old impressions are not evidence that those variants are currently indexed.

## What the implementation should preserve

| Source / route family | Preserve while redesigning |
| --- | --- |
| `app/page.tsx` | Root URL/canonical, accurate Toronto PPC positioning, crawlable service and location links, business identity, useful answers, honest evidence and working enquiry route. |
| `app/services/[slug]/page.tsx`, `lib/data/services.ts` | All 13 existing service slugs and unique metadata; do not replace organic service pages with the noindexed paid-ad funnel. |
| `lib/data/service-content.ts` | Clear service definitions, relevant geographic scope and contextual links, particularly Google Ads → `/toronto/google-ads`. Preserve meaning while improving readability. |
| Service data and `lib/data/service-faq.ts` | Specific deliverables, suitable clients, account ownership, tracking, reporting, pricing factors, onboarding/process and genuine questions. These explain the service beyond the headline. |
| Service-industry and city/service routes | Existing destinations, helpful distinctions and ordinary HTML links. Do not collapse them into unlinked marketing labels or generate new thin pages for every keyword variation. |
| `lib/seo.ts` | Stable organization identity, Service/WebPage/Breadcrumb relationships and factual schema that matches visible copy. SEO service-area schema names Toronto, Mississauga, Brampton and Ottawa; keep the body consistent. |
| `lib/page-meta.ts` | Existing service metadata override behavior. Code defaults can be superseded by CMS values; this audit did not read or change the database. Check rendered metadata during release QA. |
| `app/robots.ts`, `app/sitemap.ts` | Production crawl access, canonical URLs and route coverage. Keep paid landing pages/thank-you pages out of the organic sitemap and preserve their intentional noindex. |

Compact repeated CTAs, oversized gaps and duplicate sales sections. The removed Search/Maps/Answers block is not an indexing requirement. Retain its useful SEO service explanation and link elsewhere. Use supplied reports as readable evidence with their original periods; conversions, enquiries, qualified leads and sales are different metrics.

## Concrete consistency work

1. **Business count:** the owner confirms **200+ businesses**. At audit start, `trustFacts.clientsServed`, business-count entries in `service-stats.ts` and Meta/SEO/creative/CRM/web-design FAQs still used 500+. The implementation is correcting these. Also check shared industry copy and `public/llms.txt` for the same business-count claim. Do not replace unrelated 500+ creative tests, keyword counts or monetary examples.
2. **Proof:** source-code `verified: true` flags are not an independent audit of the older $100M, 1M or 6.3x aggregates. Do not turn legacy representative statistics or sample dashboards into fresh measured evidence. The new service presentation should use the supplied Google/Meta reports with their scope intact.
3. **Dates:** the inspected sitemap dates service pages June 30 and the homepage October 7; shared schema and the old LastReviewed component still refer to June. Use an accurate fixed revision date for materially revised routes, without claiming every untouched page was reviewed or setting all dates to the current time on every request.
4. **Preview isolation:** `next.config.ts` already applies `X-Robots-Tag: noindex, nofollow` specifically to `revamp.ppcguru.ca`, while production canonicals remain `ppcguru.ca`. Preserve this host-specific boundary. Localhost work needs no indexing submission.

## Current primary-source guidance

**Google:** AI Overviews and AI Mode use core Search systems. Indexability, snippet eligibility, useful first-hand information and good technical foundations remain relevant. Google does not require an ideal word count, special AI markup, `llms.txt`, or rewriting solely for AI. Compact pages can work if they still answer visitors' needs. No implementation guarantees indexing or inclusion. [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

Google's current Search Console documentation describes a Search generative AI inclusion control, with inclusion the default. The connected API tools do not expose this property's setting or the dedicated AI performance report, so neither was verified. Allowing Googlebot alone does not prove the account setting or actual AI visibility. [Search generative AI control](https://support.google.com/webmasters/answer/16908024).

Keep useful FAQs for visitors. Google stopped showing FAQ rich results on 7 May 2026; do not sell the FAQ section or its markup as a guaranteed rich-result benefit. Existing accurate FAQPage markup does not establish AI citations either. [Google documentation updates](https://developers.google.com/search/updates).

**OpenAI:** OAI-SearchBot is the crawler for ChatGPT search. GPTBot concerns model training and is controlled independently; ChatGPT-User is not the search inclusion control. The repo already allows these agents, but server/WAF access was not independently tested in this audit. Permission to crawl is not a promise of citation. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

**Bing:** clear headings, useful answers, supporting evidence and consistent business details help make content understandable. Its AI Performance report measures citations and cited pages; those are not ranking positions or clicks. The Bing connector is not configured here, so no PPC Guru Bing/Copilot metrics were retrieved. [Bing AI Performance documentation](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/).

**Meta:** personalized Facebook/Instagram Feed, Reels and Stories ranking is separate from a website's Google organic visibility. Improving this website helps visitors understand and convert after arriving; adding a section does not establish a Meta ranking benefit. [Meta's content-ranking explanation](https://about.fb.com/news/2023/06/how-ai-ranks-content-on-facebook-and-instagram/).

## Verification boundary

This is a focused read-only audit, not a full crawl, a Core Web Vitals assessment, a backlink audit, a live form test or an audit of every indexed URL. No settings, index submissions, database rows or production files were changed. Before a separately authorized production release, compare rendered titles/canonicals/robots/schema and important internal links, validate mobile readability and forms, then monitor the same URLs and country/device segments against a recorded baseline. Ranking changes cannot be attributed solely to the redesign without considering other changes and search conditions.
