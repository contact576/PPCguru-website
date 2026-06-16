import { siteConfig } from "@/lib/site-config";
import { Search, Wrench, Rocket, LineChart, type LucideIcon } from "lucide-react";

/** Named methodology shown on the homepage and service pages. */
export const methodology: { name: string; steps: { step: string; title: string; body: string; icon: LucideIcon }[] } = {
  name: "The Guru Growth Loop",
  steps: [
    { step: "01", title: "Audit", icon: Search, body: "We start with a deep, AI-augmented audit of your accounts, tracking, website and competitors — and quantify exactly where money is leaking." },
    { step: "02", title: "Build", icon: Wrench, body: "We rebuild campaigns, creative and landing pages around your most profitable services and the metric that matters: cost per booked job." },
    { step: "03", title: "Optimize", icon: Rocket, body: "Weekly testing and optimization. Our AI workflow lets us test more creative, keywords and audiences than a traditional agency." },
    { step: "04", title: "Scale", icon: LineChart, body: "We reinvest savings into what works, report on revenue (not vanity metrics), and compound results month over month." },
  ],
};

/** Headline performance stats shown in the homepage results band. */
export const headlineStats: { value: number; prefix?: string; suffix?: string; label: string; decimals?: number }[] = [
  { value: 10, prefix: "$", suffix: "M+", label: "Ad spend managed" },
  { value: 4.2, suffix: "x", label: "Average return on ad spend", decimals: 1 },
  { value: 120, suffix: "k+", label: "Leads generated for clients" },
  { value: 35, suffix: "+", label: "Active service-business clients" },
];

/** Why-us differentiators. */
export const differentiators: { title: string; body: string }[] = [
  {
    title: "Google Partner & Meta Business Partner",
    body: "Official platform credentials and direct access to platform support, betas and reps — not a generalist guessing.",
  },
  {
    title: "AI-augmented, human-directed",
    body: "We use a proprietary AI workflow to produce audits, creative and content faster and test more — every output reviewed by a human strategist.",
  },
  {
    title: "Built for local service businesses",
    body: "Repeatable playbooks for healthcare, home services, construction, immigration and real estate — niche depth beats generalist agencies for local lead-gen.",
  },
  {
    title: "Accountable to revenue, not vanity metrics",
    body: "We report on leads, booked jobs and ROAS — and tie ad spend to revenue in one dashboard. No hiding behind impressions.",
  },
  {
    title: "Founder-led and hands-on",
    body: "Small enough that the people running your account actually care; structured enough to deliver consistently.",
  },
  {
    title: "No long-term lock-in",
    body: "We earn the relationship month to month. Clients stay because the numbers work.",
  },
];

/** Homepage / sitewide FAQ. */
export const companyFaqs: { q: string; a: string }[] = [
  { q: "What does PPC Guru actually do?", a: `${siteConfig.name} is a ${siteConfig.trust.serviceArea} digital marketing agency. We manage Google Ads, Meta (Facebook & Instagram) ads, SEO, creative and the CRM/automation that turns leads into booked jobs — for local service businesses.` },
  { q: "Are you really a Google and Meta partner?", a: "Yes — we're a Google Partner and a Meta Business Partner, which means verified platform expertise and direct access to platform support and betas." },
  { q: "What's the 'AI-first' part really mean for me?", a: "It means faster turnaround, more creative and keyword testing, and sharper reporting — because we use AI to do the heavy lifting, with human strategists directing and reviewing everything. You get the benefit (more output, lower cost); we own the tooling." },
  { q: "Which industries do you specialize in?", a: "Healthcare and physiotherapy, home services (HVAC, plumbing, electrical), construction and renovation, immigration, real estate, and adjacent local service verticals." },
  { q: "Where are you based and who do you serve?", a: `We're based in the Greater Toronto Area (${siteConfig.contact.addressLocality}, ON) and serve clients across Canada and the USA, with deep local expertise in the GTA.` },
  { q: "How do I get started?", a: "Book a free audit. We'll review your accounts, tracking and competitors and show you exactly where the opportunity is — no obligation." },
];
