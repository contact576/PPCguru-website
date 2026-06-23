import { cn } from "@/lib/utils";

export type BlockColor = "cream" | "coral" | "lime" | "lilac" | "mint" | "pink" | "navy" | "white";

const BG: Record<BlockColor, string> = {
  cream: "bg-[var(--color-cream)] text-[var(--color-ink)]",
  coral: "bg-[var(--color-coral)] text-[var(--color-ink)]",
  lime: "bg-[var(--color-lime)] text-[var(--color-ink)]",
  lilac: "bg-[var(--color-lilac)] text-[var(--color-ink)]",
  mint: "bg-[var(--color-mint)] text-[var(--color-ink)]",
  pink: "bg-[var(--color-pink)] text-[var(--color-ink)]",
  navy: "bg-[var(--color-navy)] text-[var(--color-navy-ink)]",
  white: "bg-white text-[var(--color-ink)]",
};

/**
 * Signature full-width pastel color-block section (Figma design system).
 * Rounded panel with generous interior padding; the white canvas returns
 * between blocks so each reads as deliberate. `id` enables anchor links.
 */
export function ColorBlock({
  color = "cream",
  children,
  className,
  id,
}: {
  color?: BlockColor;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className="py-6 md:py-8">
      <div className="container-page">
        <div className={cn("rounded-[var(--radius-lg)] px-6 py-12 md:px-14 md:py-16", BG[color], className)}>
          {children}
        </div>
      </div>
    </section>
  );
}

/** Whether a block color is dark (navy) — used to flip text treatment. */
export function isDarkBlock(color: BlockColor) {
  return color === "navy";
}
