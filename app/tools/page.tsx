import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Gauge, Sparkles, PenLine, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { CtaBlock } from "@/components/sections/cta-block";
import { ToolsArt } from "@/components/illustrations/hero-art";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free Marketing Tools — Ad Calculators & AI Audit",
  description:
    "Free interactive tools: Google Ads & Meta Ads ROI calculators, an instant AI website audit, and an AI ad-copy generator. See your potential in seconds.",
  path: "/tools",
});

const tools = [
  { href: "/tools/google-ads-calculator", icon: Calculator, name: "Google Ads ROI Calculator", desc: "Estimate clicks, leads, cost per lead and revenue from your Google Ads budget — by industry." },
  { href: "/tools/meta-ads-calculator", icon: Calculator, name: "Meta Ads ROI Calculator", desc: "See what Facebook & Instagram ads could produce for your industry and budget." },
  { href: "/tools/instant-audit", icon: Gauge, name: "Instant AI Website Audit", desc: "Enter your URL for an instant, AI-written audit of speed, SEO and tracking signals." },
  { href: "/tools/ad-copy-generator", icon: PenLine, name: "AI Ad Copy Generator", desc: "Generate Google & Meta ad headlines and descriptions for your offer in seconds." },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Free tools"
        title={<>Free tools to size up your <span className="text-gradient">growth potential</span></>}
        intro="No sign-up walls, no fluff. Use our calculators and AI tools to understand what your marketing could be doing — then book a free audit if you want help getting there."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }]}
        art={<ToolsArt />}
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={t.href} className="group flex items-start gap-5 rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-7 transition-all hover:-translate-y-1 hover:border-[var(--color-ink)]">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[15px] bg-[var(--color-ink)] text-[var(--color-lime)]"><Icon size={24} /></span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="head text-[19px]">{t.name}</h2>
                    <ArrowUpRight size={16} className="text-[var(--color-ink-faint)] group-hover:text-[var(--color-ink)]" />
                  </div>
                  <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{t.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-[var(--color-ink-faint)]">
          <Sparkles size={14} className="text-[var(--color-cyan-bright)]" /> AI tools run on Claude and work best with an API key configured — see setup notes.
        </p>
      </Section>
      <CtaBlock />
    </>
  );
}
