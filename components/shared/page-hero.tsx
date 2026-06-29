import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/badge";
import { accentTint } from "@/lib/data/themes";

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
      {/* contour lines — mirrors the homepage hero backdrop */}
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.5 }} aria-hidden>
        <g fill="none" stroke="#14170e" strokeWidth="1" strokeOpacity=".05">
          <path d="M-50 180 C 200 120, 380 260, 560 200 S 920 90, 1260 220" />
          <path d="M-50 280 C 220 220, 400 360, 600 300 S 940 190, 1260 320" />
          <path d="M-50 380 C 240 320, 420 460, 640 400 S 980 290, 1260 420" />
          <ellipse cx="640" cy="340" rx="360" ry="210" strokeOpacity=".05" />
        </g>
      </svg>
      <div
        className="pointer-events-none absolute -right-24 -top-32 h-[460px] w-[460px]"
        style={{ background: glow }}
      />
      <div className="container-page relative">
        <div className={art ? "grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14" : ""}>
          <div>
            {breadcrumbs ? <div className="mb-6"><Breadcrumbs items={breadcrumbs} /></div> : null}
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h1 className="head mt-5 max-w-4xl text-[clamp(2.6rem,5.5vw,4.6rem)] text-balance">{title}</h1>
            {intro ? <p className="mt-6 max-w-2xl text-lg text-[var(--color-ink-dim)] md:text-xl">{intro}</p> : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </div>
          {art ? <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">{art}</div> : null}
        </div>
      </div>
    </section>
  );
}
