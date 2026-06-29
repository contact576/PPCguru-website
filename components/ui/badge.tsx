import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--color-border-bright)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink-dim)]",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Signature mark: a wasted-spend "leak" (dashed coral) sealed at the ink node
 *  and recovered into a rising olive→lime line. Encodes the brand's whole pitch
 *  — wasted spend becoming booked jobs — at every section label. */
function LeakMark() {
  return (
    <svg width="44" height="12" viewBox="0 0 44 12" fill="none" aria-hidden className="shrink-0">
      <line x1="1" y1="7" x2="13" y2="7" stroke="var(--color-coral)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
      {/* recovered line + sealed node take the page's accent when one is set */}
      <path d="M17 7 H34 l 5 -4.5" stroke="var(--accent, var(--color-olive,#6f7d22))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15" cy="7" r="2.8" fill="var(--color-ink)" />
      <circle cx="40" cy="2.5" r="3" fill="var(--accent, var(--color-lime))" stroke="var(--accent-strong, var(--color-olive,#6f7d22))" strokeWidth="1" />
    </svg>
  );
}

/** Mono uppercase eyebrow label used above section headings. The leak→sealed
 *  mark is the page's recurring structural signature; the label + recovered line
 *  inherit the page's --accent so every section reads in the vertical's colour. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2.5 text-[var(--accent-strong,var(--color-orange-deep))]", className)}>
      <LeakMark />
      {children}
    </span>
  );
}
