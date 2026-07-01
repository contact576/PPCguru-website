import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/badge";
import { StatCounter } from "@/components/ui/stat-counter";

/* ============================================================================
   Layout-variant toolkit — reusable section shells that break the site's
   default "grid of bordered boxes" so no two sections read the same. All are
   server components (Reveal/StatCounter draw their own client boundary), theme
   via the cream/lime/ink tokens, and honour the per-vertical `--accent`.
   ========================================================================== */

/** Rotating accent so stacked cards/sections don't all read identical. */
const ACCENTS = ["var(--accent, #6f7d22)", "#6f7d22", "#c4632a", "#2f6db0"] as const;
export const accentAt = (i: number) => ACCENTS[i % ACCENTS.length];

/* ── BigQuote — full-bleed editorial pull-quote break ──────────────────────
   Inserted BETWEEN box-grids on long templates to create rhythm and reuse the
   signature DM-Serif italic at scale. Dark (ink) or tinted variants. */
export function BigQuote({
  children,
  attribution,
  variant = "tint",
  className,
}: {
  children: ReactNode;
  attribution?: string;
  variant?: "tint" | "ink" | "lime";
  className?: string;
}) {
  const skin =
    variant === "ink"
      ? "bg-[var(--color-ink)] text-[var(--color-navy-ink)]"
      : variant === "lime"
        ? "bg-[var(--color-lime)] text-[var(--color-ink)]"
        : "bg-[#eef2dd] text-[var(--color-ink)]";
  const mark = variant === "ink" ? "text-[var(--color-lime)]" : "text-[var(--accent-strong,#5f6f17)]";
  return (
    <section className={cn("py-6 md:py-9", className)}>
      <div className="container-page">
        <Reveal>
          <figure className={cn("relative overflow-hidden rounded-[var(--radius-lg)] px-7 py-14 md:px-16 md:py-20", skin)}>
            <span aria-hidden className={cn("head absolute -top-6 left-6 select-none text-[120px] leading-none opacity-20 md:text-[180px]", mark)}>&ldquo;</span>
            <blockquote className="relative mx-auto max-w-4xl text-center">
              <p className="text-[clamp(1.5rem,3.6vw,2.6rem)] font-medium leading-[1.25] tracking-[-0.01em]" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontStyle: "italic" }}>
                {children}
              </p>
              {attribution ? (
                <figcaption className="mono mt-7 text-[12px] uppercase tracking-[.12em] opacity-70">— {attribution}</figcaption>
              ) : null}
            </blockquote>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ── AccentCard — card with a coloured edge that rotates by index ──────────
   Drop-in for the plain bordered `<div>` box; the left accent bar + tinted
   number breaks grid uniformity cheaply everywhere it's used. */
export function AccentCard({
  children,
  index = 0,
  accent,
  className,
}: {
  children: ReactNode;
  index?: number;
  accent?: string;
  className?: string;
}) {
  const c = accent ?? accentAt(index);
  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--edge)_50%,var(--color-border))] hover:shadow-tile",
        className
      )}
      style={{ ["--edge" as string]: c }}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--edge)] opacity-70 transition-all duration-300 group-hover:w-[5px] group-hover:opacity-100" />
      {children}
    </div>
  );
}

/* ── SplitFeature — sticky asymmetric two-column ───────────────────────────
   Left: sticky eyebrow/title/intro/cta. Right: the content (list, visual,
   cards). `flip` alternates the side so consecutive splits differ. */
export function SplitFeature({
  eyebrow,
  title,
  intro,
  children,
  aside,
  flip = false,
  tone = "plain",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  flip?: boolean;
  tone?: "plain" | "soft";
  className?: string;
}) {
  return (
    <section className={cn("relative py-16 md:py-24", tone === "soft" && "bg-[var(--color-base-2)]", className)}>
      <div className="container-page">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className={cn("lg:sticky lg:top-28", flip && "lg:order-2")}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h2 className="head mt-5 text-[clamp(1.9rem,4vw,3rem)] text-balance">{title}</h2>
            {intro ? <p className="mt-5 max-w-md text-lg text-[var(--color-ink-dim)] text-pretty">{intro}</p> : null}
            {aside ? <div className="mt-7">{aside}</div> : null}
          </div>
          <div className={cn(flip && "lg:order-1")}>{children}</div>
        </div>
      </div>
    </section>
  );
}

/* ── StepFlow — connected numbered timeline (replaces 4-col numbered grids) ─
   A vertical connector line joins the steps; each node lights its accent as it
   reveals. Reads as a journey, not a set of identical boxes. */
export function StepFlow({
  steps,
  className,
}: {
  steps: { step?: string | number; kicker?: string; title: string; body: string; icon?: React.ComponentType<{ size?: number | string }> }[];
  className?: string;
}) {
  return (
    <div className={cn("relative mt-14", className)}>
      {/* connector */}
      <span aria-hidden className="absolute left-[26px] top-3 bottom-3 w-px bg-[var(--color-border)] md:left-1/2 md:-translate-x-1/2" />
      <ol className="space-y-6 md:space-y-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const edge = accentAt(i);
          return (
            <Reveal key={s.title} delay={(i % 4) * 0.06}>
              <li className={cn("relative grid grid-cols-[54px_1fr] items-start gap-5 md:grid-cols-2 md:gap-12", i % 2 === 1 && "md:[&>*:first-child]:order-2")}>
                {/* node + rule (mobile: left rail; desktop: centre) */}
                <div className={cn("relative flex md:justify-end", i % 2 === 1 && "md:justify-start")}>
                  <span className="relative z-[1] flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[16px] bg-[var(--color-ink)] text-[var(--color-lime)] shadow-tile" style={{ boxShadow: `0 0 0 4px color-mix(in srgb, ${edge} 22%, transparent)` }}>
                    {Icon ? <Icon size={22} /> : <span className="head text-[20px]">{s.step ?? i + 1}</span>}
                  </span>
                </div>
                <div className={cn("rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:p-6", i % 2 === 1 && "md:text-right")}>
                  {s.kicker ? <div className="mono text-[11px] font-bold uppercase tracking-[.1em] text-[color-mix(in_srgb,var(--edge)_78%,#14170e)]" style={{ ["--edge" as string]: edge }}>{s.kicker}</div> : null}
                  <h3 className="head mt-1 text-[19px]">{s.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{s.body}</p>
                </div>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}

/* ── StatStrip — a row of count-up stats on a dark or tinted band ───────────
   Motion where the eye lands; reused by stat bands so numbers animate in. */
export function StatStrip({
  stats,
  variant = "ink",
  className,
}: {
  stats: { value: string; label: string }[];
  variant?: "ink" | "tint";
  className?: string;
}) {
  const dark = variant === "ink";
  return (
    <div
      className={cn(
        "grid gap-x-6 gap-y-8 rounded-[var(--radius-lg)] px-6 py-10 md:px-12 md:py-12",
        dark ? "bg-[var(--color-ink)] text-[var(--color-navy-ink)]" : "border border-[var(--accent-line,#dddbc9)] bg-[var(--accent-tint,#f7f5ea)]",
        stats.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : `grid-cols-1 sm:grid-cols-${stats.length}`,
        className
      )}
    >
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.06} className="text-center">
          <div className={cn("head text-[clamp(2rem,5vw,3rem)] leading-none", dark ? "text-[var(--color-lime)]" : "text-[var(--accent-strong,#5f6f17)]")}>
            <StatCounter value={s.value} />
          </div>
          <div className={cn("mt-2 text-[13px]", dark ? "text-[#b8bda6]" : "text-[var(--color-ink-dim)]")}>{s.label}</div>
        </Reveal>
      ))}
    </div>
  );
}
