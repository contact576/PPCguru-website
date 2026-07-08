import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/interactive";
import { BrandIcon } from "@/components/shared/brand-logos";
import { AccentCard, StepFlow, accentAt } from "@/components/ui/layout";
import type { Service } from "@/lib/data/services";

/** "What we audit before optimization" — grouped checklist (accent-edged cards). */
export function AuditChecklist({ serviceName, groups }: { serviceName: string; groups: NonNullable<Service["auditChecklist"]> }) {
  return (
    <Section>
      <SectionHeading align="left" eyebrow="Before we touch a dollar" title={<>What we <span className="text-gradient">audit first</span></>} intro={`Every ${serviceName} engagement starts with a structured audit — we quantify what's broken and what's wasting spend before we optimize anything.`} />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <Reveal key={g.category} delay={(i % 3) * 0.05}>
            <AccentCard index={i}>
              <h3 className="head text-[16px]">{g.category}</h3>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[13.5px] text-[var(--color-ink-dim)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft,#eef2dd)] text-[var(--accent-strong,#5f6f17)]"><Check size={11} /></span>
                    {it}
                  </li>
                ))}
              </ul>
            </AccentCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** "How we use AI & automation" — spotlight cards. */
export function AiAutomation({ items }: { items: NonNullable<Service["aiAutomation"]> }) {
  return (
    <Section>
      <SectionHeading align="left" eyebrow="AI-augmented, human-led" title={<>How we use <span className="text-gradient">AI & automation</span></>} intro="AI does the heavy lifting — clustering, drafting, anomaly detection — while our strategists own judgment, budgets and approvals." />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {items.map((d, i) => (
          <Reveal key={d.title} delay={(i % 2) * 0.05}>
            <SpotlightCard className="h-full rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-7">
              <span aria-hidden className="mb-4 block h-1 w-10 rounded-full" style={{ background: accentAt(i) }} />
              <h3 className="head text-[18px]">{d.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{d.body}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** "Our day-to-day optimization system" — daily/weekly/monthly, accent-edged. */
export function OptimizationCadence({ cadence }: { cadence: NonNullable<Service["optimizationCadence"]> }) {
  const cols: { label: string; items?: string[] }[] = [
    { label: "Daily", items: cadence.daily },
    { label: "Weekly", items: cadence.weekly },
    { label: "Monthly", items: cadence.monthly },
  ].filter((c) => c.items && c.items.length);
  return (
    <Section tone="cream">
      <SectionHeading align="left" eyebrow="No set-and-forget" title={<>Our day-to-day <span className="text-gradient">optimization system</span></>} intro="Most agencies log in monthly. We work the account on a daily, weekly and monthly cadence so problems are caught in hours, not billing cycles." />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {cols.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.05}>
            <AccentCard index={i} className="bg-white">
              <div className="mono text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: `color-mix(in srgb, ${accentAt(i)} 80%, #14170e)` }}>{c.label}</div>
              <ul className="mt-4 space-y-2.5">
                {c.items!.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[13.5px] text-[var(--color-ink-dim)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accentAt(i), boxShadow: `0 0 0 3px color-mix(in srgb, ${accentAt(i)} 22%, transparent)` }} />
                    {it}
                  </li>
                ))}
              </ul>
            </AccentCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** "What we fix in the first 30 days" — connected timeline. */
export function Timeline30Day({ items }: { items: NonNullable<Service["first30Days"]> }) {
  return (
    <Section>
      <SectionHeading align="left" eyebrow="Fast, visible progress" title={<>What we fix in the <span className="text-gradient">first 30 days</span></>} intro="The hard work most agencies postpone — tracking, audit, cleanup and restructuring — happens up front." />
      <StepFlow steps={items.map((p, i) => ({ step: i + 1, kicker: p.window, title: p.title, body: p.body }))} />
    </Section>
  );
}

/** Platform-specific tool stack, grouped pills. */
export function ToolStack({ groups }: { groups: NonNullable<Service["toolStack"]> }) {
  return (
    <Section tone="cream">
      <SectionHeading align="left" eyebrow="The stack we run" title={<>Tools behind <span className="text-gradient">the work</span></>} intro="A modern, AI-augmented stack — so we move faster and see more than a traditional agency." />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {groups.map((g, i) => (
          <Reveal key={g.group} delay={(i % 2) * 0.05}>
            <AccentCard index={i}>
              <div className="mono text-[11px] font-bold uppercase tracking-[.1em]" style={{ color: `color-mix(in srgb, ${accentAt(i)} 80%, #14170e)` }}>{g.group}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.tools.map((t) => (
                  <span key={t} className="mono inline-flex items-center gap-1.5 rounded-full border border-[#dddbc9] bg-[#fbfaf2] py-1 pl-1 pr-3 text-[11.5px] font-medium text-[var(--color-ink-dim)]">
                    <BrandIcon name={t} size={18} radius={5} />{t}
                  </span>
                ))}
              </div>
            </AccentCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
