/** Page presentation only. Service definitions, metadata and FAQ content stay canonical. */
export const servicePresentation: Record<string, { headline: string; emphasis: string; focus: string; logo?: string; logoAlt?: string }> = {
  "chatgpt-ads": { headline: "Reach customers", emphasis: "while they decide.", focus: "Conversation intent → relevant ad → measurable enquiry", logo: "/platforms/openai.svg", logoAlt: "OpenAI" },
  "google-ads": { headline: "Be there when", emphasis: "they’re ready to buy.", focus: "Search intent → relevant page → qualified enquiry", logo: "/platforms/google-ads.svg", logoAlt: "Google Ads" },
  "meta-ads": { headline: "Turn the next scroll into", emphasis: "your next conversation.", focus: "Creative → audience → lead quality", logo: "/platforms/meta.svg", logoAlt: "Meta" },
  seo: { headline: "Be the business", emphasis: "they find first.", focus: "Technical foundations → useful content → local visibility", logo: "/platforms/google.svg", logoAlt: "Google" },
  creative: { headline: "Give people a reason", emphasis: "to stop. And act.", focus: "Audience insight → creative concept → structured testing", logo: "/platforms/figma.svg", logoAlt: "Figma" },
  "web-design": { headline: "A better first impression.", emphasis: "A clearer next step.", focus: "Clear message → credible proof → easy enquiry", logo: "/platforms/wordpress.svg", logoAlt: "WordPress" },
  crm: { headline: "The lead came in.", emphasis: "Make the follow-up count.", focus: "Capture → route → follow up → measure", logo: "/platforms/zoho.svg", logoAlt: "Zoho" },
  "linkedin-ads": { headline: "Reach the people", emphasis: "who make the decisions.", focus: "Ideal customer → relevant offer → sales conversation" },
  "tiktok-ads": { headline: "Make your next customer", emphasis: "stop scrolling.", focus: "Native video → creative testing → conversion tracking", logo: "/platforms/tiktok.svg", logoAlt: "TikTok" },
  "microsoft-ads": { headline: "Find the demand", emphasis: "you’re missing.", focus: "Search intent → targeted campaigns → measured enquiries" },
  "pinterest-ads": { headline: "Turn their next idea into", emphasis: "a reason to choose you.", focus: "Inspiration → consideration → action" },
  "youtube-ads": { headline: "Show them why", emphasis: "you’re worth choosing.", focus: "Strong opening → relevant audience → next step", logo: "/platforms/youtube.svg", logoAlt: "YouTube" },
  "ai-automation": { headline: "Less chasing tasks.", emphasis: "More moving things forward.", focus: "Map the work → connect the tools → keep people in control" },
  "cro-landing-pages": { headline: "You earned the click.", emphasis: "Make it count.", focus: "Message match → friction removal → measured experiments", logo: "/platforms/google-analytics.svg", logoAlt: "Google Analytics" },
};

export const paidServicePlatforms = {
  "google-ads": "google-search", "meta-ads": "meta", "youtube-ads": "youtube",
  "microsoft-ads": "microsoft", "tiktok-ads": "tiktok", "linkedin-ads": "linkedin", "pinterest-ads": "pinterest",
} as const;
