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

/** Mono uppercase eyebrow label used above section headings (Figma taxonomy style). */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2 text-[var(--color-orange-deep)]", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-orange)]" />
      {children}
    </span>
  );
}
