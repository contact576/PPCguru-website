/**
 * AEO/GEO content layer for service pages — kept separate from services.ts so the
 * answer-first definitions, comparison tables, geo blurbs and expanded FAQs can be
 * authored and extended in one place without touching the core Service objects.
 *
 * `definition` is the highest-leverage field: a self-contained 40–70-word answer that
 * names the entity (PPC Guru) + the primary keyword + the geography (GTA / Canada) in
 * the first sentence, so LLMs and AI Overviews can lift it for "what is X" queries.
 *
 * comparison / geoBlurb / faqs are populated in later waves; all optional.
 */

import { serviceFaq } from "./service-faq";

export type ServiceContent = {
  definition: string;
  /** Question-shaped H2 for the definition block. Defaults to "What is {name}?" */
  definitionHeading?: string;
  /** "Us vs typical agency" comparison rows (rendered as a semantic table). */
  comparison?: { dimension: string; us: string; typical: string }[];
  /** Geo paragraph for body copy (unique per service — avoids duplicate-content). */
  geoBlurb?: string;
  /** Keyword-rich eyebrow for the geo block. Defaults to "Across the GTA & Canada". */
  geoHeading?: string;
  /** Expanded FAQ set — replaces the thin service.faqs when present. */
  faqs?: { q: string; a: string }[];
};

export const serviceContent: Record<string, ServiceContent> = {
  "google-ads": {
    definitionHeading: "What is Google Ads management?",
    definition:
      "Google Ads management is the ongoing service of planning, building and optimizing paid Search, Performance Max and Shopping campaigns so a business gets more qualified leads at a lower cost per acquisition. PPC Guru is a Canadian Google Ads agency based in the Greater Toronto Area that manages campaigns for local service businesses across Ontario, Canada and the USA — engineering every account around booked jobs and revenue, not clicks.",
    geoHeading: "Google Ads across the GTA & Canada",
    geoBlurb:
      "We manage Google Ads for service businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham, Hamilton and Ottawa, plus clients in the USA. Canadian Search auctions are competitive and CPCs run high in the GTA, so we win on tight geo-targeting, airtight conversion tracking and landing pages that turn expensive local clicks into booked jobs — not by simply outspending the firm next door.",
  },
  "meta-ads": {
    definitionHeading: "What is Meta Ads management?",
    definition:
      "Meta Ads management is the service of running and optimizing paid Facebook and Instagram campaigns — creative, audience targeting and conversion tracking — to turn social browsers into leads and customers. PPC Guru is a Canadian Meta Business Partner agency in the Greater Toronto Area that builds scroll-stopping creative and lead-gen funnels for service businesses across Canada and the USA, measured against booked jobs, not vanity metrics.",
    geoHeading: "Meta Ads across the GTA & Canada",
    geoBlurb:
      "We run Facebook and Instagram campaigns for local and service businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients coast to coast and in the USA. Reaching a Canadian audience is about local creative and precise radius, interest and lookalike targeting around each service area, so your budget reaches nearby buyers ready to book — not cheap, irrelevant clicks far outside your market.",
  },
  seo: {
    definitionHeading: "What is SEO & local search?",
    definition:
      "SEO (search engine optimization) is the practice of improving a website's technical health, content and local presence so it ranks higher on Google and AI search for the terms customers actually use. PPC Guru is a Greater Toronto Area SEO agency that helps service businesses across Canada — Toronto, Mississauga, Brampton, Ottawa and beyond — rank in local search, the Google Business Profile map pack and AI answers to generate organic leads that compound over time.",
    geoHeading: "Local SEO across the GTA & Canada",
    geoBlurb:
      "We run SEO and local search for service businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham, Hamilton, Etobicoke, North York and Ottawa, plus clients coast to coast. Ranking in a Canadian market is won on local relevance: a fully optimized Google Business Profile, consistent NAP and citations across Canadian directories (Yelp, Yellow Pages, Canada411, the BBB and industry listings), genuinely useful location and service pages, and a review profile that builds map-pack authority in your own city — not generic, country-agnostic SEO.",
  },
  creative: {
    definitionHeading: "What is creative production?",
    definition:
      "Creative production is the service of concepting, designing and producing the static, carousel and short-form video ad creative that paid campaigns run on. PPC Guru is a Canadian, AI-accelerated creative team in the Greater Toronto Area that ships fresh, on-brand, conversion-focused creative every week for service businesses across Canada and the USA — testing concepts continuously so ads keep performing as audiences fatigue.",
    geoHeading: "Creative for GTA & Canadian audiences",
    geoBlurb:
      "We produce ad creative for brands across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients in the USA. Creative that converts a Canadian audience speaks to local context, seasons and neighbourhoods, so we ship fresh, on-brand concepts tuned to your market — and refresh them continuously as local audiences fatigue, keeping cost per result down.",
  },
  "web-design": {
    definitionHeading: "What are conversion-focused websites & landing pages?",
    definition:
      "A conversion-focused website or landing page is one engineered from the ground up to load fast, rank in search, and turn visitors into booked leads — not just look good. PPC Guru designs and builds high-performance websites and landing pages for service businesses across the Greater Toronto Area, Canada and the USA, wired with clean tracking and SEO from day one, and owned entirely by the client.",
    geoHeading: "Websites for GTA & Canadian businesses",
    geoBlurb:
      "We design and build websites and landing pages for service businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients in the USA. Every build ships with local SEO foundations, location and service pages, and clean tracking, so your site ranks in your own city and converts nearby visitors into booked leads — and you own it outright.",
  },
  crm: {
    definitionHeading: "What is CRM & marketing operations?",
    definition:
      "CRM and marketing operations is the system that captures every lead, routes it to the right place, and follows up automatically so none slip through the cracks. PPC Guru builds GoHighLevel pipelines, lead routing, speed-to-lead automation and closed-loop reporting for service businesses across the Greater Toronto Area, Canada and the USA — connecting ad spend to booked jobs and revenue.",
    geoHeading: "Marketing operations for GTA & Canadian teams",
    geoBlurb:
      "We build CRM and marketing-ops systems for service businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients in the USA. Speed-to-lead decides who wins a local job, so we wire instant follow-up, routing and closed-loop reporting that connect every enquiry from your market straight to a booked appointment and revenue.",
  },
  "linkedin-ads": {
    definitionHeading: "What is LinkedIn Ads management?",
    definition:
      "LinkedIn Ads management is the service of running paid B2B campaigns that target decision-makers by role, company, industry and seniority to generate qualified business leads. PPC Guru is a Canadian LinkedIn Ads agency in the Greater Toronto Area that builds precise account-based and lead-gen campaigns for B2B and professional-services firms across Canada and the USA, measured against pipeline and revenue.",
    geoHeading: "B2B LinkedIn Ads across Canada & the GTA",
    geoBlurb:
      "We run LinkedIn Ads for B2B and professional-services firms across the Greater Toronto Area and Canada — Toronto, Mississauga, Vaughan, Markham and Ottawa and the wider corporate corridor, plus clients in the USA. Canadian B2B buying is relationship-led, so we target decision-makers by role, company and region and build account-based campaigns that generate qualified pipeline in your market — measured against revenue, not clicks.",
  },
  "tiktok-ads": {
    definitionHeading: "What is TikTok Ads management?",
    definition:
      "TikTok Ads management is the service of producing native, hook-first short-form video and running paid campaigns that turn attention into leads and sales. PPC Guru is a Canadian TikTok Ads agency in the Greater Toronto Area that creates platform-native creative and full-funnel campaigns for service and local businesses across Canada and the USA — built to convert, not just go viral.",
    geoHeading: "TikTok Ads across the GTA & Canada",
    geoBlurb:
      "We produce and run TikTok campaigns for service and local businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients in the USA. Reaching a Canadian audience on TikTok is about native, culturally-relevant creative and tight geo-targeting around each service area, so attention turns into local leads and bookings — not just views from outside your market.",
  },
  "microsoft-ads": {
    definitionHeading: "What is Microsoft (Bing) Ads management?",
    definition:
      "Microsoft Advertising (Bing Ads) management is the service of running paid Search campaigns across Bing, Yahoo and the Microsoft Audience Network — often at a lower cost per click than Google. PPC Guru is a Canadian Microsoft Ads agency in the Greater Toronto Area that helps service businesses across Canada and the USA capture the high-intent, lower-competition search demand most competitors ignore.",
    geoHeading: "Bing Ads across the GTA & Canada",
    geoBlurb:
      "We manage Microsoft (Bing) Ads for service businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients in the USA. Bing's audience skews older and higher-income and competition is lighter than Google, so in many Canadian markets it captures high-intent local demand at a lower cost per click — demand most competitors in your city ignore entirely.",
  },
  "pinterest-ads": {
    definitionHeading: "What is Pinterest Ads management?",
    definition:
      "Pinterest Ads management is the service of running paid campaigns that reach high-intent planners discovering products, services and ideas to buy. PPC Guru is a Canadian Pinterest Ads agency in the Greater Toronto Area that builds visual, intent-driven campaigns for home, lifestyle, retail and service brands across Canada and the USA — turning inspiration into measurable leads and sales.",
    geoHeading: "Pinterest Ads across the GTA & Canada",
    geoBlurb:
      "We run Pinterest campaigns for home, lifestyle, retail and service brands across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients in the USA. Canadian planners use Pinterest to research seasonal and local projects before they buy, so we build visual, intent-driven campaigns and geo-target the buyers in your service area — turning inspiration into measurable local leads.",
  },
  "youtube-ads": {
    definitionHeading: "What is YouTube Ads management?",
    definition:
      "YouTube Ads management is the service of producing hook-first video and running paid YouTube campaigns that build demand and feed every stage of the funnel. PPC Guru is a Canadian YouTube Ads agency in the Greater Toronto Area that creates skippable, bumper and demand-gen video campaigns for service businesses across Canada and the USA — measured against leads and revenue, not just views.",
    geoHeading: "YouTube Ads across the GTA & Canada",
    geoBlurb:
      "We produce and run YouTube campaigns for service businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients in the USA. Building demand in a Canadian market means video that speaks to local context and precise geo and audience targeting, so your spend builds awareness and leads in the cities you actually serve — measured against revenue, not views.",
  },
  "ai-automation": {
    definitionHeading: "What is AI marketing automation?",
    definition:
      "AI marketing automation is the use of custom AI workflows to capture, qualify and follow up with leads instantly — around the clock — without adding headcount. PPC Guru builds AI-powered automations for service businesses across the Greater Toronto Area, Canada and the USA: instant lead response, qualification, routing and reporting, with every output reviewed by a human strategist.",
    geoHeading: "AI automation for GTA & Canadian businesses",
    geoBlurb:
      "We build AI automations for service businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients in the USA. In competitive local markets the fastest responder wins the job, so we deploy round-the-clock AI that instantly captures, qualifies, routes and follows up with every lead from your area — with a human strategist reviewing the output.",
  },
  "cro-landing-pages": {
    definitionHeading: "What is conversion rate optimization (CRO)?",
    definition:
      "Conversion rate optimization (CRO) is the practice of using structured A/B testing and landing-page improvements to get more leads from the traffic you already pay for. PPC Guru is a Canadian CRO agency in the Greater Toronto Area that runs data-backed experiments on landing pages and funnels for service businesses across Canada and the USA — lowering cost per lead without raising ad spend.",
    geoHeading: "CRO for GTA & Canadian campaigns",
    geoBlurb:
      "We run CRO and landing-page experiments for service businesses across the Greater Toronto Area and Canada — Toronto, Mississauga, Brampton, Vaughan, Markham and Ottawa, plus clients in the USA. Local traffic is expensive in Canadian markets, so we test the pages, offers and messaging that turn more of your existing GTA and Canada-wide visitors into booked leads — lowering cost per lead without raising ad spend.",
  },
};

export function getServiceContent(slug: string): ServiceContent | undefined {
  const base = serviceContent[slug];
  if (!base) return undefined;
  const faqData = serviceFaq[slug];
  return faqData ? { ...base, ...faqData } : base;
}
