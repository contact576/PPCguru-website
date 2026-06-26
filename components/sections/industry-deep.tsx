import { Lightbulb } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/interactive";
import type { Industry } from "@/lib/data/industries";

/** Industry reality + expected benchmarks / lead economics. */
export function IndustryReality({ name, reality, benchmarks }: { name: string; reality?: string; benchmarks?: Industry["benchmarks"] }) {
  if (!reality && !(benchmarks && benchmarks.length)) return null;
  return (
    <Section tone="cream">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {reality && (
          <div>
            <SectionHeading align="left" eyebrow="The reality" title={<>What growth really looks like in <span className="text-gradient">{name.toLowerCase()}</span></>} />
            <p className="mt-6 whitespace-pre-line text-[var(--color-ink-dim)] leading-relaxed">{reality}</p>
          </div>
        )}
        {benchmarks && benchmarks.length > 0 && (
          <div>
            <SectionHeading align="left" eyebrow="Lead economics" title="Expected benchmarks" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {benchmarks.map((b) => (
                <div key={b.label} className="rounded-[16px] border border-[#dddbc9] bg-white p-5">
                  <div className="head text-[22px] text-[var(--accent-strong,var(--color-ink))]">{b.value}</div>
                  <div className="mono mt-1 text-[11px] uppercase tracking-[.04em] text-[var(--color-ink-dim)]">{b.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--color-ink-faint)]">Representative industry ranges — actual results vary by market, offer and tracking.</p>
          </div>
        )}
      </div>
    </Section>
  );
}

/** Per-channel strategy. */
export function IndustryPlaybook({ name, playbook }: { name: string; playbook: NonNullable<Industry["playbook"]> }) {
  return (
    <Section>
      <SectionHeading align="left" eyebrow="The playbook" title={<>How we grow <span className="text-gradient">{name.toLowerCase()}</span></>} intro="A channel-by-channel plan built around how your customers actually search, choose and book." />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {playbook.map((p, i) => (
          <Reveal key={p.channel} delay={(i % 2) * 0.05}>
            <SpotlightCard className="h-full rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-7">
              <h3 className="head text-[17px]">{p.channel}</h3>
              <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{p.body}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** Industry "hacks" / hard-won tactics. */
export function IndustryHacks({ name, hacks }: { name: string; hacks: NonNullable<Industry["hacks"]> }) {
  return (
    <Section tone="cream">
      <SectionHeading align="left" eyebrow="Hard-won tactics" title={<><span className="text-gradient">{name}</span> growth hacks</>} intro="Specific, tested moves that move the needle in this vertical — not generic advice." />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {hacks.map((h, i) => (
          <Reveal key={h} delay={(i % 2) * 0.05}>
            <div className="flex h-full items-start gap-3.5 rounded-[18px] border border-[#dddbc9] bg-white p-5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft,#eef2dd)] text-[var(--accent-strong,#5f6f17)]"><Lightbulb size={14} /></span>
              <p className="text-[14.5px] text-[var(--color-ink-dim)]">{h}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** Sample 90-day growth plan. */
export function IndustryPlan90({ items }: { items: NonNullable<Industry["plan90"]> }) {
  return (
    <Section>
      <SectionHeading align="left" eyebrow="The first 90 days" title={<>A sample <span className="text-gradient">90-day growth plan</span></>} />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.window} delay={i * 0.05}>
            <div className="h-full rounded-[22px] border border-[var(--color-border)] bg-white p-6">
              <div className="mono text-[11px] font-bold uppercase tracking-[.08em] text-[#83856f]">{p.window}</div>
              <h3 className="head mt-2 text-[18px]">{p.title}</h3>
              <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
