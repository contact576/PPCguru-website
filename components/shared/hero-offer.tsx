import { Zap } from "lucide-react";

/**
 * Bold, unmissable hero offer banner — the flagship 30-day-free-trial hook.
 * A lime card with an ink badge, meant to STAND OUT in the hero (not a subtle
 * chip row). Use `badge` + `line`; `credit` appends the Google Ads credit.
 */
export function HeroOffer({
  badge,
  line,
  credit = false,
  className = "",
}: {
  badge: string;
  line: string;
  credit?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-[16px] border-2 border-[var(--color-ink)] bg-[var(--color-lime)] p-4 shadow-[0_5px_0_0_var(--color-ink)] sm:flex-row sm:items-center sm:gap-4 ${className}`}
    >
      <span className="mono inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2.5 text-[13px] font-black uppercase tracking-[.05em] text-[var(--color-lime)]">
        <Zap size={15} /> {badge}
      </span>
      <p className="text-[14.5px] font-semibold leading-snug text-[var(--color-ink)]">
        {line}
        {credit ? <> Plus <span className="underline decoration-2 underline-offset-2">up to $3,600 in Google Ads credit</span>.</> : null}
      </p>
    </div>
  );
}
