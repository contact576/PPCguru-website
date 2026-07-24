import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Check } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";
import { PartnerBadges } from "@/components/shared/partner-badges";
import { ContactArt } from "@/components/illustrations/hero-art";
import { buildMetadata } from "@/lib/seo";
import { withMetaOverride } from "@/lib/page-meta";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  return withMetaOverride(buildMetadata({
  title: "Contact — Book a Free Audit",
  description:
    "Book a free, no-obligation audit of your Google Ads, Meta Ads and tracking. We'll show you exactly where the opportunity is. Based in the GTA, serving Canada & the USA.",
  path: "/contact",
}), "/contact");
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get started"
        title={<>Book your <span className="text-gradient">free audit</span></>}
        intro="Tell us about your business and we'll review your accounts, tracking and competitors — then show you a realistic plan to turn ad spend into booked jobs. No obligation."
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
        art={<ContactArt />}
      />
      <Section className="!pt-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <ContactForm />

          <aside className="space-y-5">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="font-semibold">What happens next</h2>
              <ul className="mt-4 space-y-3 text-sm text-[var(--color-ink-dim)]">
                {["We review your accounts, tracking & competitors", "We build a realistic projection for your business", "We show you the plan on a free strategy call", "No pressure, no long-term contracts"].map((s) => (
                  <li key={s} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]"><Check size={12} /></span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="font-semibold">Reach us directly</h2>
              <div className="mt-4 space-y-3 text-sm">
                {/* Phone shown only when a real number is configured. [VERIFY] add phone + WhatsApp. */}
                {siteConfig.contact.phone ? (
                  <a href={siteConfig.contact.phoneHref} className="flex items-center gap-3 text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"><Phone size={16} className="text-[var(--color-cyan-bright)]" /> {siteConfig.contact.phone}</a>
                ) : null}
                {siteConfig.contact.whatsapp ? (
                  <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"><Phone size={16} className="text-[var(--color-cyan-bright)]" /> WhatsApp</a>
                ) : null}
                <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-3 text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"><Mail size={16} className="text-[var(--color-cyan-bright)]" /> {siteConfig.contact.email}</a>
                <span className="flex items-center gap-3 text-[var(--color-ink-dim)]"><MapPin size={16} className="text-[var(--color-cyan-bright)]" /> {siteConfig.contact.addressLocality}, {siteConfig.contact.addressRegion} · {siteConfig.trust.serviceArea}</span>
                <span className="flex items-center gap-3 text-[var(--color-ink-dim)]"><Clock size={16} className="text-[var(--color-cyan-bright)]" /> {siteConfig.contact.hours}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <PartnerBadges />
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
