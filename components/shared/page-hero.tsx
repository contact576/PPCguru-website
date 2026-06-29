import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/badge";
import { accentTint } from "@/lib/data/themes";
import { HeroVectors } from "@/components/shared/hero-vectors";
import { Reveal } from "@/components/ui/reveal";
import { SplitHeading } from "@/components/ui/split-heading";
import { ScrollParallax } from "@/components/shared/scroll-parallax";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-ink-faint)]">
      {items.map((item, i) => (
        <span key={item.path} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} />}
          {i === items.length - 1 ? (
            <span className="text-[var(--color-ink-dim)]">{item.name}</span>
          ) : (
            <Link href={item.path} className="hover:text-[var(--color-ink)]">{item.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Standard inner-page hero with subtle grid + glow, eyebrow, title and intro.
 *  Pass `art` (a hero illustration) to render the two-column editorial layout. */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  children,
  art,
  accent,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  children?: React.ReactNode;
  art?: React.ReactNode;
  /** Per-vertical accent — washes the hero, colours the glow + top rule. */
  accent?: string;
}) {
  const glow = accent
    ? `radial-gradient(circle, color-mix(in srgb, ${accent} 32%, transparent), transparent 64%)`
    : "radial-gradient(circle,rgba(206,255,58,.16),transparent 65%)";
  // Bolder, directional wash so each vertical's hero clearly reads in its colour.
  const heroBg = accent
    ? `linear-gradient(165deg, color-mix(in srgb, ${accent} 20%, var(--color-base)) 0%, ${accentTint(accent)} 42%, var(--color-base) 78%)`
    : undefined;
  return (
    <section
      className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-base)] pt-32 pb-16 md:pt-40 md:pb-20"
      style={heroBg ? { background: heroBg } : undefined}
    >
      {accent ? <div className="pointer-events-none absolute inset-x-0 top-0 h-[4px]" style={{ background: accent }} /> : null}
      {/* layered vector backdrop — accent-aware, animated, GSAP parallax, reduced-motion safe */}
      <ScrollParallax speed={18} className="pointer-events-none absolute inset-x-0 -inset-y-[14%]">
        <HeroVectors accent={accent} animate idSeed="page-hero" />
      </ScrollParallax>
      <div
        className="pointer-events-none absolute -right-24 -top-32 h-[460px] w-[460px]"
        style={{ background: glow }}
      />
      <div className="container-page relative">
        <div className={art ? "grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14" : ""}>
          <div>
            {breadcrumbs ? <Reveal className="mb-6"><Breadcrumbs items={breadcrumbs} /></Reveal> : null}
            {eyebrow ? <Reveal delay={0.05}><Eyebrow>{eyebrow}</Eyebrow></Reveal> : null}
            <SplitHeading as="h1" className="head mt-5 max-w-4xl text-[clamp(2.6rem,5.5vw,4.6rem)] text-balance">{title}</SplitHeading>
            {intro ? <Reveal delay={0.2}><p className="mt-6 max-w-2xl text-lg text-[var(--color-ink-dim)] md:text-xl">{intro}</p></Reveal> : null}
            {children ? <Reveal delay={0.28}><div className="mt-8">{children}</div></Reveal> : null}
          </div>
          {art ? <Reveal delay={0.18} scale className="relative mx-auto w-full max-w-[560px] lg:mx-0">{art}</Reveal> : null}
        </div>
      </div>
    </section>
  );
}
