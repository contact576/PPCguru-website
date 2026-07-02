import Link from "next/link";
import { Check, X } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { StatCounter } from "@/components/ui/stat-counter";
import { Reveal } from "@/components/ui/reveal";
import { getServiceStats, serviceCredentials } from "@/lib/data/service-stats";
import { trustFacts } from "@/lib/data/performance-stats";

/**
 * Answer-first definitional block — the FIRST body section on a service page.
 * A question-shaped H2 + a quotable 40–70-word definition that names the entity
 * (PPC Guru) + the primary keyword + the geography up front. This is the single
 * biggest AEO/LLM-citation win: it gives answer engines a self-contained passage
 * to lift for "what is X" / "best X agency in Canada" queries.
 */
export function ServiceIntro({ name, definition, heading }: { name: string; definition: string; heading?: string }) {
  return (
    <Section className="!pb-0">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="head text-[clamp(1.5rem,3vw,2rem)] text-[var(--color-ink)]">{heading ?? `What is ${name}?`}</h2>
        <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-ink-dim)]">{definition}</p>
      </div>
    </Section>
  );
}

/**
 * Geo / local-relevance body paragraph. Weaves Canadian city + citation signals into
 * the page body so Google's local algorithm reads geographic relevance from real copy,
 * not just footer links. Renders ONLY when a `geoBlurb` is authored for the service,
 * so pages without one are unchanged (no layout/design impact).
 */
export function ServiceGeo({ blurb, label }: { blurb: string; label?: string }) {
  return (
    <Section className="!pt-8 !pb-0">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mono text-[11px] uppercase tracking-[.14em] text-[var(--accent-strong)]">{label ?? "Across the GTA & Canada"}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-dim)]">{blurb}</p>
      </div>
    </Section>
  );
}

/** Slim credentials strip near the top of every service page (not just the footer). */
export function TrustBadgeBar() {
  void serviceCredentials; // canonical credential labels live alongside the stats
  const items = [
    trustFacts.googlePartner ? "Google Partner" : null,
    trustFacts.metaBusinessPartner ? "Meta Business Partner" : null,
    `${trustFacts.founderExperienceYears} yrs combined founder experience`,
    `${trustFacts.clientsServed} businesses served`,
    `${trustFacts.adSpendManaged} ad spend managed`,
  ].filter(Boolean) as string[];
  return (
    <div className="border-y border-[var(--color-border)] bg-[var(--color-surface-2)]">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 py-4 text-center">
        {items.map((it, i) => (
          <span key={it} className="mono inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.06em] text-[var(--color-ink-dim)]">
            {i > 0 && <span className="text-[var(--accent)]">·</span>}
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

/** "Numbers that speak louder than promises" — per-service stat band (reference-image style). */
export function ServiceStatBand({ slug }: { slug: string }) {
  const block = getServiceStats(slug);
  if (!block) return null;
  return (
    <Section>
      <div className="rounded-[var(--radius-lg)] border border-[var(--accent-line)] bg-[var(--accent-tint)] px-6 py-10 md:px-12 md:py-12">
        <p className="mono text-center text-[11px] uppercase tracking-[.14em] text-[var(--accent-strong)]">By the numbers</p>
        <h2 className="head mx-auto mt-2 max-w-2xl text-center text-[clamp(1.5rem,3.2vw,2.2rem)] text-[var(--color-ink)]">
          Numbers that speak louder than promises
        </h2>
        <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {block.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <div className="head text-[clamp(2rem,5vw,3rem)] leading-none text-[var(--accent-strong)]">
                <StatCounter value={s.value} />
              </div>
              <div className="mt-2 text-[13px] text-[var(--color-ink-dim)]">{s.label}</div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-[11px] text-[var(--color-ink-faint)]">{block.basis}</p>
      </div>
    </Section>
  );
}

const METROS = ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Ottawa", "Hamilton"];

/** Canadian-metro callout — puts geo signals in body copy (reference SEO image). */
export function CityCallout({ serviceName }: { serviceName?: string }) {
  return (
    <Section className="!pt-0">
      <div className="rounded-[20px] border border-[var(--color-border)] bg-white px-6 py-8 text-center md:px-10">
        <p className="mono text-[11px] uppercase tracking-[.14em] text-[var(--accent-strong)]">Across the GTA &amp; Canada</p>
        <p className="head mt-2 text-[clamp(1.2rem,2.6vw,1.6rem)] text-[var(--color-ink)]">
          {serviceName ? `${serviceName} ` : "Marketing "}for businesses in Toronto, the GTA and across Canada
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {METROS.map((m) => (
            <span key={m} className="mono rounded-full border border-[var(--color-border-bright)] bg-[var(--color-base)] px-4 py-1.5 text-[11px] uppercase tracking-[.04em] text-[var(--color-ink)]">{m}</span>
          ))}
          <Link href="/locations" className="mono rounded-full border border-[var(--accent-line)] bg-[var(--accent-tint)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[.04em] text-[var(--accent-strong)]">All locations →</Link>
        </div>
      </div>
    </Section>
  );
}

// Honest content-freshness signal. [VERIFY-client]: bump when content is materially revised.
const CONTENT_UPDATED = "June 2026";

/** Small visible "Last reviewed" line — a freshness signal for search + LLMs. */
export function LastReviewed() {
  return (
    <p className="container-page pb-3 text-center text-[11px] text-[var(--color-ink-faint)]">
      Last reviewed {CONTENT_UPDATED} by the PPC Guru team.
    </p>
  );
}

/** Decision content — a semantic comparison table (PPC Guru vs a typical agency). */
export function ComparisonTable({ rows, serviceName }: { rows?: { dimension: string; us: string; typical: string }[]; serviceName: string }) {
  if (!rows?.length) return null;
  return (
    <Section tone="cream">
      <SectionHeading
        align="left"
        eyebrow="How we compare"
        title={<>PPC Guru vs a <span className="text-gradient">typical agency</span></>}
        intro={`What you actually get with ${serviceName} at PPC Guru — line by line.`}
      />
      <div className="mt-10 overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{serviceName}: PPC Guru vs a typical agency, compared</caption>
          <thead>
            <tr className="bg-[var(--color-ink)] text-[var(--color-navy-ink)]">
              <th scope="col" className="mono py-3.5 pl-5 pr-4 text-[10.5px] uppercase tracking-[.06em]">What matters</th>
              <th scope="col" className="mono px-4 py-3.5 text-[10.5px] uppercase tracking-[.06em] text-[var(--color-lime)]">PPC Guru</th>
              <th scope="col" className="mono py-3.5 pr-5 pl-4 text-[10.5px] uppercase tracking-[.06em] text-[#b8bda6]">Typical agency</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.dimension} className="border-b border-[var(--color-border)] align-top transition-colors odd:bg-[#faf9f0] hover:bg-[var(--color-base-2)]">
                <th scope="row" className="py-4 pl-5 pr-4 text-left text-sm font-semibold text-[var(--color-ink)]">{r.dimension}</th>
                <td className="px-4 py-4 text-sm text-[var(--color-ink)]">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-soft)] align-middle text-[var(--accent-strong)]"><Check size={12} /></span>
                  {r.us}
                </td>
                <td className="py-4 pr-5 pl-4 text-sm text-[var(--color-ink-dim)]">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(242,106,43,.12)] align-middle text-[var(--color-coral)]"><X size={12} /></span>
                  {r.typical}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <Link href="/compare" className="mono mt-6 inline-block text-xs font-bold uppercase tracking-[.06em] text-[var(--accent-strong)] hover:text-[var(--color-ink)]">
        See more comparisons — Google Ads vs Meta, agency vs DIY, PPC vs SEO →
      </Link>
    </Section>
  );
}
