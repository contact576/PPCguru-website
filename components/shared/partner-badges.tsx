import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Google Partner + Meta Business Partner trust badges.
 * Uses styled text badges (no third-party logo assets shipped). Swap for the
 * official badge artwork from your partner dashboards before launch if desired.
 */
export function PartnerBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Badge title="Google Partner" sub="Verified" color="#4285F4" />
      <Badge title="Meta Business Partner" sub="Verified" color="#0866FF" />
    </div>
  );
}

function Badge({ title, sub, color }: { title: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}22`, color }}>
        <BadgeCheck size={16} />
      </span>
      <span className="leading-tight">
        <span className="block text-xs font-semibold text-[var(--color-ink)]">{title}</span>
        <span className="block text-[10px] uppercase tracking-wide text-[var(--color-ink-faint)]">{sub}</span>
      </span>
    </div>
  );
}
