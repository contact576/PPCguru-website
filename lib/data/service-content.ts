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

export type ServiceContent = {
  definition: string;
  /** Question-shaped H2 for the definition block. Defaults to "What is {name}?" */
  definitionHeading?: string;
  /** "Us vs typical agency" comparison rows (rendered as a semantic table). */
  comparison?: { dimension: string; us: string; typical: string }[];
  /** Geo paragraph for body copy. */
  geoBlurb?: string;
  /** Expanded FAQ set — replaces the thin service.faqs when present. */
  faqs?: { q: string; a: string }[];
};

export const serviceContent: Record<string, ServiceContent> = {
  "google-ads": {
    definitionHeading: "What is Google Ads management?",
    definition:
      "Google Ads management is the ongoing service of planning, building and optimizing paid Search, Performance Max and Shopping campaigns so a business gets more qualified leads at a lower cost per acquisition. PPC Guru is a Canadian Google Ads agency based in the Greater Toronto Area that manages campaigns for local service businesses across Ontario, Canada and the USA — engineering every account around booked jobs and revenue, not clicks.",
  },
  "meta-ads": {
    definitionHeading: "What is Meta Ads management?",
    definition:
      "Meta Ads management is the service of running and optimizing paid Facebook and Instagram campaigns — creative, audience targeting and conversion tracking — to turn social browsers into leads and customers. PPC Guru is a Canadian Meta Business Partner agency in the Greater Toronto Area that builds scroll-stopping creative and lead-gen funnels for service businesses across Canada and the USA, measured against booked jobs, not vanity metrics.",
  },
  seo: {
    definitionHeading: "What is SEO & local search?",
    definition:
      "SEO (search engine optimization) is the practice of improving a website's technical health, content and local presence so it ranks higher on Google and AI search for the terms customers actually use. PPC Guru is a Greater Toronto Area SEO agency that helps service businesses across Canada — Toronto, Mississauga, Brampton, Ottawa and beyond — rank in local search, the Google Business Profile map pack and AI answers to generate organic leads that compound over time.",
  },
  creative: {
    definitionHeading: "What is creative production?",
    definition:
      "Creative production is the service of concepting, designing and producing the static, carousel and short-form video ad creative that paid campaigns run on. PPC Guru is a Canadian, AI-accelerated creative team in the Greater Toronto Area that ships fresh, on-brand, conversion-focused creative every week for service businesses across Canada and the USA — testing concepts continuously so ads keep performing as audiences fatigue.",
  },
  "web-design": {
    definitionHeading: "What are conversion-focused websites & landing pages?",
    definition:
      "A conversion-focused website or landing page is one engineered from the ground up to load fast, rank in search, and turn visitors into booked leads — not just look good. PPC Guru designs and builds high-performance websites and landing pages for service businesses across the Greater Toronto Area, Canada and the USA, wired with clean tracking and SEO from day one, and owned entirely by the client.",
  },
  crm: {
    definitionHeading: "What is CRM & marketing operations?",
    definition:
      "CRM and marketing operations is the system that captures every lead, routes it to the right place, and follows up automatically so none slip through the cracks. PPC Guru builds GoHighLevel pipelines, lead routing, speed-to-lead automation and closed-loop reporting for service businesses across the Greater Toronto Area, Canada and the USA — connecting ad spend to booked jobs and revenue.",
  },
  "linkedin-ads": {
    definitionHeading: "What is LinkedIn Ads management?",
    definition:
      "LinkedIn Ads management is the service of running paid B2B campaigns that target decision-makers by role, company, industry and seniority to generate qualified business leads. PPC Guru is a Canadian LinkedIn Ads agency in the Greater Toronto Area that builds precise account-based and lead-gen campaigns for B2B and professional-services firms across Canada and the USA, measured against pipeline and revenue.",
  },
  "tiktok-ads": {
    definitionHeading: "What is TikTok Ads management?",
    definition:
      "TikTok Ads management is the service of producing native, hook-first short-form video and running paid campaigns that turn attention into leads and sales. PPC Guru is a Canadian TikTok Ads agency in the Greater Toronto Area that creates platform-native creative and full-funnel campaigns for service and local businesses across Canada and the USA — built to convert, not just go viral.",
  },
  "microsoft-ads": {
    definitionHeading: "What is Microsoft (Bing) Ads management?",
    definition:
      "Microsoft Advertising (Bing Ads) management is the service of running paid Search campaigns across Bing, Yahoo and the Microsoft Audience Network — often at a lower cost per click than Google. PPC Guru is a Canadian Microsoft Ads agency in the Greater Toronto Area that helps service businesses across Canada and the USA capture the high-intent, lower-competition search demand most competitors ignore.",
  },
  "pinterest-ads": {
    definitionHeading: "What is Pinterest Ads management?",
    definition:
      "Pinterest Ads management is the service of running paid campaigns that reach high-intent planners discovering products, services and ideas to buy. PPC Guru is a Canadian Pinterest Ads agency in the Greater Toronto Area that builds visual, intent-driven campaigns for home, lifestyle, retail and service brands across Canada and the USA — turning inspiration into measurable leads and sales.",
  },
  "youtube-ads": {
    definitionHeading: "What is YouTube Ads management?",
    definition:
      "YouTube Ads management is the service of producing hook-first video and running paid YouTube campaigns that build demand and feed every stage of the funnel. PPC Guru is a Canadian YouTube Ads agency in the Greater Toronto Area that creates skippable, bumper and demand-gen video campaigns for service businesses across Canada and the USA — measured against leads and revenue, not just views.",
  },
  "ai-automation": {
    definitionHeading: "What is AI marketing automation?",
    definition:
      "AI marketing automation is the use of custom AI workflows to capture, qualify and follow up with leads instantly — around the clock — without adding headcount. PPC Guru builds AI-powered automations for service businesses across the Greater Toronto Area, Canada and the USA: instant lead response, qualification, routing and reporting, with every output reviewed by a human strategist.",
  },
  "cro-landing-pages": {
    definitionHeading: "What is conversion rate optimization (CRO)?",
    definition:
      "Conversion rate optimization (CRO) is the practice of using structured A/B testing and landing-page improvements to get more leads from the traffic you already pay for. PPC Guru is a Canadian CRO agency in the Greater Toronto Area that runs data-backed experiments on landing pages and funnels for service businesses across Canada and the USA — lowering cost per lead without raising ad spend.",
  },
};

export function getServiceContent(slug: string): ServiceContent | undefined {
  return serviceContent[slug];
}
