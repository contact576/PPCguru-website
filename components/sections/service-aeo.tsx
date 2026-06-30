import Link from "next/link";
import { Section } from "@/components/ui/section";
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
          {block.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="head text-[clamp(2rem,5vw,3rem)] leading-none text-[var(--accent-strong)]">{s.value}</div>
              <div className="mt-2 text-[13px] text-[var(--color-ink-dim)]">{s.label}</div>
            </div>
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
