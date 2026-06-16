/**
 * Testimonials.
 *
 * IMPORTANT — representative, anonymized quotes illustrating the kind of
 * feedback our engagements produce. NOT attributed to named real clients
 * (which would require written consent). Replace with real, consented
 * testimonials (name + business + permission) before relying on them as proof.
 */

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  industry: string;
};

export const TESTIMONIAL_DISCLOSURE =
  "Representative feedback, anonymized. Replace with verified, consented client testimonials before launch.";

export const testimonials: Testimonial[] = [
  {
    quote:
      "They rebuilt our Google Ads from scratch and our cost per booked patient dropped almost in half. The reporting is so clear I finally understand where every dollar goes.",
    author: "Clinic Director",
    role: "Physiotherapy clinic",
    industry: "Healthcare",
  },
  {
    quote:
      "We've worked with three agencies. PPC Guru is the first one that talks about booked jobs and revenue instead of impressions and clicks.",
    author: "Owner",
    role: "HVAC & home comfort",
    industry: "Home services",
  },
  {
    quote:
      "The speed-to-lead automation alone paid for itself. Leads now get a call within minutes and our booking rate jumped.",
    author: "Operations Lead",
    role: "Renovation contractor",
    industry: "Construction",
  },
  {
    quote:
      "Our consultation calendar used to be empty half the month. Now it's consistently booked and we know exactly which campaign each client came from.",
    author: "Managing Consultant",
    role: "Immigration consultancy",
    industry: "Immigration",
  },
  {
    quote:
      "They move fast. New creative every week, clear weekly updates, and they actually explain the 'why' in plain language.",
    author: "Marketing Manager",
    role: "Multi-location dental group",
    industry: "Dental",
  },
  {
    quote:
      "Finally an agency that uses AI to do more, not to cut corners. The turnaround on creative and reporting is unlike anyone we've used.",
    author: "Founder",
    role: "Real-estate team",
    industry: "Real estate",
  },
];
