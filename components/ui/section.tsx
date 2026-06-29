import { cn } from "@/lib/utils";
import { Eyebrow } from "./badge";

export type Tone = "white" | "soft" | "cream" | "lime" | "lilac" | "mint" | "coral" | "pink" | "navy";

// Tonal panels remapped to the handoff palette: soft cream/sage bands + one
// dark feature panel. (Bright lime/coral are reserved for small accents, never
// full sections.)
const COLORED: Record<string, string> = {
  cream: "bg-[#f7f5ea] text-[var(--color-ink)]",
  lime: "bg-[#eef2dd] text-[var(--color-ink)]",
  lilac: "bg-[#eef2dd] text-[var(--color-ink)]",
  mint: "bg-[#eef2dd] text-[var(--color-ink)]",
  coral: "bg-[#f6e6db] text-[var(--color-ink)]",
  pink: "bg-[#f6e6db] text-[var(--color-ink)]",
  navy: "bg-[var(--color-navy)] text-[var(--color-navy-ink)]",
};

/**
 * Standard section wrapper. With a pastel/navy `tone` it renders the Figma-style
 * full-width rounded color-block panel; with white/soft it's a plain band.
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
      <section id={id} className="py-5 md:py-7">
        <div className="container-page">
          <div className={cn("rounded-[var(--radius-lg)] px-6 py-16 md:px-14 md:py-20", COLORED[tone], className)}>
            {children}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section
      id={id}
      className={cn("relative py-16 md:py-24", tone === "soft" && "bg-[var(--color-base-2)]", className)}
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
      <h2 className="head text-[clamp(2rem,4.6vw,3.4rem)] text-balance">{title}</h2>
      {intro ? <p className="text-lg text-[var(--color-ink-dim)] text-pretty">{intro}</p> : null}
    </div>
  );
}
