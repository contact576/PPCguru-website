import { cn } from "@/lib/utils";
import { Eyebrow } from "./badge";

export type Tone = "white" | "soft" | "cream" | "lime" | "lilac" | "mint" | "coral" | "pink" | "navy";

const COLORED: Record<string, string> = {
  cream: "bg-[var(--color-cream)] text-[var(--color-ink)]",
  lime: "bg-[var(--color-lime)] text-[var(--color-ink)]",
  lilac: "bg-[var(--color-lilac)] text-[var(--color-ink)]",
  mint: "bg-[var(--color-mint)] text-[var(--color-ink)]",
  coral: "bg-[var(--color-coral)] text-[var(--color-ink)]",
  pink: "bg-[var(--color-pink)] text-[var(--color-ink)]",
  navy: "bg-[var(--color-navy)] text-[var(--color-navy-ink)]",
};

/**
 * Standard section wrapper. With a tonal `tone` it renders a rounded
 * instrument-panel (dark tint + hairline border + faint inner grid); with
 * white/soft it's a plain band on the canvas.
 */
export function Section({
  children,
  className,
  id,
  tone = "white",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: Tone;
}) {
  if (tone in COLORED) {
    return (
      <section id={id} className="py-6 md:py-9">
        <div className="container-page">
          <div
            className={cn(
              "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] px-6 py-16 md:px-14 md:py-24",
              COLORED[tone],
              className
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-40" />
            <div className="relative">{children}</div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28", tone === "soft" && "bg-[var(--color-base-2)]", className)}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

/** Centered (or left) section heading with eyebrow + intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center mx-auto max-w-3xl" : "items-start text-left max-w-2xl",
        className
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-[2.1rem] leading-[0.98] md:text-[3.4rem] font-bold text-balance tracking-[-0.02em]">{title}</h2>
      {intro ? <p className="text-lg text-[var(--color-ink-dim)] text-pretty md:text-xl">{intro}</p> : null}
    </div>
  );
}
