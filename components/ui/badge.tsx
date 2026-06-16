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
        "inline-flex items-center gap-2 rounded-full border border-[--color-border-bright] bg-[--color-surface] px-3.5 py-1.5 text-xs font-medium text-[--color-ink-dim]",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Small accent-dot eyebrow label used above section headings. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-medium tracking-wide text-[--color-cyan-bright] uppercase", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-[--color-cyan] shadow-[0_0_10px_var(--color-cyan)]" />
      {children}
    </span>
  );
}
