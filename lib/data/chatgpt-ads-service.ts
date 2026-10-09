import { Bot } from "lucide-react";
import type { Service } from "./services";

/**
 * Original PPC Guru service copy. Platform facts checked 10 October 2026 against
 * official OpenAI documentation; availability and account features can change.
 * https://help.openai.com/en/articles/20001207-ads-in-chatgpt-the-basics
 * https://help.openai.com/en/articles/20001245-ads-manager-availability
 * https://help.openai.com/en/articles/20001210-create-campaigns-for-chatgpt-ads
 * https://help.openai.com/en/articles/20001521-write-context-hints-for-chatgpt-ads
 * https://help.openai.com/en/articles/20001409-conversion-measurement
 * https://help.openai.com/en/articles/20001412-create-ocpc-campaigns
 * This offer makes no OpenAI partnership, historical performance or approval claim.
 */
export const chatgptAdsService: Service = {
  slug: "chatgpt-ads",
  name: "ChatGPT Ads Management",
  short: "Relevant ads, a clear offer and a measurable path from conversation to enquiry.",
  hero: "Put your offer in front of people exploring their next decision. PPC Guru plans and manages ChatGPT Ads, connects the landing page and tracking, and reviews what happens after the click.",
  description: "ChatGPT Ads management for Canadian businesses. PPC Guru plans campaigns, creative, landing pages and conversion tracking around useful enquiries.",
  icon: Bot,
  featured: false,
  outcomes: [
    "A focused plan for testing a new advertising channel",
    "A clear connection between the ad and your offer",
    "Reporting that separates traffic from useful enquiries",
  ],
  symptoms: [
    "You want to explore ChatGPT Ads but need a practical starting point",
    "Your offer gets attention without enough worthwhile enquiries",
    "You cannot connect new-channel spend to your sales pipeline",
  ],
  whoFor: [
    "Eligible businesses with a clear offer and a working website",
    "Teams ready to follow up and assess lead quality",
    "Advertisers willing to test against agreed spending limits and success criteria",
  ],
  included: [
    "Account, offer and measurement readiness review",
    "Campaign structure and customer-need context hints",
    "Ad copy, creative direction and landing-page alignment",
    "Conversion setup and validation within the agreed scope",
    "Ongoing review of spend, performance and lead quality",
  ],
  deliverables: [
    { title: "A focused campaign plan", body: "Define the customer need, offer, supported objective and test budget. Check account access and available locations before committing to launch." },
    { title: "Creative with a clear next step", body: "Develop headlines, descriptions, image assets and context hints around relevant customer needs. Match each ad to a useful landing page." },
    { title: "Measurement that holds together", body: "Scope consent-aware OpenAI Pixel and Conversions API setup where appropriate. Preserve click references and deduplicate shared events when both methods are used." },
    { title: "Decisions based on the evidence", body: "Review delivery and conversion signals alongside your lead feedback. Recommend the next test, a controlled expansion or a pause when the evidence calls for it." },
  ],
  platforms: [
    { name: "ChatGPT Ads Manager", body: "Build around the objectives and controls available to your account. Features and eligibility are checked before setup." },
    { name: "Context and creative", body: "Describe relevant customer situations. Context hints guide matching; they are not exact-match keywords or reserved placements." },
    { name: "Your website and CRM", body: "Connect the enquiry journey and follow-up so campaign reporting has business context." },
  ],
  process: [
    { step: "01", title: "Check the fit", body: "Review eligibility, the offer, landing page and measurement gaps." },
    { step: "02", title: "Build the test", body: "Agree scope, spending limits, creative and what counts as a useful lead." },
    { step: "03", title: "Validate and submit", body: "Check assets, tracking and the enquiry path. Launch depends on platform review and account readiness." },
    { step: "04", title: "Review and improve", body: "Compare available campaign data with sales feedback and agree the next move." },
  ],
  metrics: [
    "Spend, impressions, clicks and click-through rate",
    "Reported conversions and attribution settings",
    "Valid enquiries and qualified leads from your CRM",
    "Cost per qualified lead when matching data is sufficient",
    "Bookings and revenue where reliably attributable",
  ],
  pricingFactors: [
    "Campaign scope, locations and ongoing management needs",
    "Creative production and landing-page work",
    "Tracking, consent and CRM integration requirements",
    "Advertising spend, billed separately from agency fees",
  ],
  faqs: [
    { q: "Can Canadian businesses advertise on ChatGPT?", a: "OpenAI currently lists Canada and the United States for self-service Ads Manager access. We still check your billing entity, account eligibility, offer and available campaign settings before proposing a launch." },
    { q: "Will paying for ads make ChatGPT recommend my business in its answers?", a: "No. Ads are separate from ChatGPT’s answers. This service manages paid campaigns; it does not buy organic recommendations, citations or a preferred position in an answer." },
    { q: "What will it cost?", a: "We agree the agency fee after reviewing the scope. Ad spend is separate and paid to the platform. Billing can be based on impressions or valid clicks; conversion optimization does not mean you pay only for a lead." },
    { q: "Can every business or offer run a campaign?", a: "No. Availability, account requirements and advertising policies apply. We review readiness and help prepare the campaign, but OpenAI controls eligibility, approval and delivery." },
    { q: "How do you measure lead quality?", a: "We agree your lead criteria, validate permitted conversion tracking and compare campaign data with CRM outcomes. A reported conversion is not automatically a qualified lead or sale. Attribution and consent can affect what is measurable." },
    { q: "What results can you show me?", a: "We are not publishing ChatGPT campaign results or performance benchmarks here. Once campaigns run, we report the data we can verify, with its period and measurement limits. Google or Meta results do not establish ChatGPT Ads performance." },
    { q: "Who owns the account and campaign assets?", a: "You retain your advertiser account and business data. We agree the access needed to manage campaigns and the ownership of commissioned creative and landing-page work before starting." },
  ],
  caseStudySlugs: [],
  proofStats: [],
  auditChecklist: [
    { category: "Readiness", items: ["Account eligibility and billing entity", "Offer, ad-policy fit and destination quality", "Lead handling and agreed test limits"] },
    { category: "Measurement", items: ["Meaningful conversion events", "Consent requirements and data permissions", "Click-reference continuity and duplicate-event checks", "CRM lead definitions and reporting access"] },
  ],
  optimizationCadence: {
    daily: ["Delivery, budget pacing and measurement checks while campaigns run"],
    weekly: ["Creative and context-hint review", "Lead-quality feedback and next-test decisions"],
    monthly: ["Scope, spend and outcomes review", "Continue, adjust or pause against the agreed criteria"],
  },
  first30Days: [
    { window: "Initial planning", title: "Establish the starting point", body: "Review access, policy fit and tracking. Timing depends on account readiness, approvals and the assets available." },
    { window: "Build phase", title: "Prepare a measured test", body: "Create the agreed assets, configure available settings and validate the enquiry journey before submitting campaigns." },
    { window: "After approval", title: "Learn from delivery", body: "Monitor the live test and review lead feedback as data arrives. The first month is a planning framework, not a promised launch or results deadline." },
  ],
  toolStack: [
    { group: "Campaign and measurement tools, where appropriate", tools: ["OpenAI Ads Manager", "OpenAI Pixel", "OpenAI Conversions API", "GA4", "Google Tag Manager", "Your CRM"] },
  ],
};
