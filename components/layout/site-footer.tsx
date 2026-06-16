import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { InstagramIcon, LinkedinIcon, FacebookIcon } from "@/components/shared/social-icons";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import { cities } from "@/lib/data/locations";
import { Logo } from "@/components/layout/logo";
import { PartnerBadges } from "@/components/shared/partner-badges";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[--color-border] bg-[--color-base-2]">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-sm text-[--color-ink-dim]">{siteConfig.description}</p>
            <PartnerBadges />
            <div className="flex gap-3 pt-1">
              <SocialIcon href={siteConfig.social.instagram} label="Instagram"><InstagramIcon /></SocialIcon>
              <SocialIcon href={siteConfig.social.linkedin} label="LinkedIn"><LinkedinIcon /></SocialIcon>
              <SocialIcon href={siteConfig.social.facebook} label="Facebook"><FacebookIcon /></SocialIcon>
            </div>
          </div>

          <FooterCol title="Services" links={services.map((s) => ({ label: s.name, href: `/services/${s.slug}` }))} />
          <FooterCol title="Industries" links={industries.slice(0, 8).map((i) => ({ label: i.name, href: `/industries/${i.slug}` }))} />

          <div className="flex flex-col gap-6">
            <FooterCol
              title="Free Tools"
              links={[
                { label: "Google Ads Calculator", href: "/tools/google-ads-calculator" },
                { label: "Meta Ads Calculator", href: "/tools/meta-ads-calculator" },
                { label: "Instant AI Audit", href: "/tools/instant-audit" },
                { label: "AI Ad Copy Generator", href: "/tools/ad-copy-generator" },
              ]}
            />
            <div className="flex flex-col gap-2.5 text-sm text-[--color-ink-dim]">
              <a href={siteConfig.contact.phoneHref} className="flex items-center gap-2 hover:text-[--color-ink]"><Phone size={15} /> {siteConfig.contact.phone}</a>
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 hover:text-[--color-ink]"><Mail size={15} /> {siteConfig.contact.email}</a>
              <span className="flex items-center gap-2"><MapPin size={15} /> {siteConfig.contact.addressLocality}, {siteConfig.contact.addressRegion}</span>
            </div>
          </div>
        </div>

        {/* Local SEO link row */}
        <div className="mt-12 border-t border-[--color-border] pt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[--color-ink-faint]">Areas we serve</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[--color-ink-dim]">
            {cities.map((c) => (
              <Link key={c.slug} href={`/${c.slug}/google-ads`} className="hover:text-[--color-cyan-bright]">
                Google Ads {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[--color-border] pt-8 text-sm text-[--color-ink-faint] md:flex-row md:items-center">
          <p>© {year} {siteConfig.legalName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[--color-ink]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[--color-ink]">Terms</Link>
            <Link href="/contact" className="hover:text-[--color-ink]">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[--color-ink-faint]">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-[--color-ink-dim] transition-colors hover:text-[--color-ink]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[--color-border] text-[--color-ink-dim] transition-colors hover:border-[--color-violet] hover:text-[--color-ink]"
    >
      {children}
    </a>
  );
}
