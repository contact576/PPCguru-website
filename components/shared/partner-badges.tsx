import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { logosByGroup } from "@/lib/data/logos";

/**
 * Credential / accreditation badges (Google Partner, Meta Business Partner, BBB
 * Accredited, awards). Each badge renders the official artwork when its `src`
 * asset is present in /public; until then it shows a styled text badge reflecting
 * the company's stated status. No badge claims certification it can't back with
 * an asset.
 *
 * [VERIFY] BEFORE LAUNCH: drop official badge artwork into /public and set the
 * matching `src` in lib/data/logos.ts to display real certification marks.
 */
const ACCENT: Record<string, string> = {
  "Google Partner": "#4285F4",
  "Meta Business Partner": "#0866FF",
  "BBB Accredited": "#1a7fc1",
};

export function PartnerBadges({ className }: { className?: string }) {
  const creds = logosByGroup("credential");
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {creds.map((c) => {
        const mark = c.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.src} alt={c.name} className="h-10 w-auto" />
        ) : (
          <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT[c.name] ?? "#6f7d22"}22`, color: ACCENT[c.name] ?? "#6f7d22" }}>
              <BadgeCheck size={16} />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-semibold text-[var(--color-ink)]">{c.name}</span>
              {c.sub ? <span className="block text-[10px] uppercase tracking-wide text-[var(--color-ink-faint)]">{c.sub}</span> : null}
            </span>
          </div>
        );
        // Linked to the public profile so the credential can be verified at source.
        return c.url ? (
          <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex rounded-xl transition-opacity hover:opacity-80" aria-label={`${c.name} — view profile`}>
            {mark}
          </a>
        ) : (
          <span key={c.name} className="inline-flex">{mark}</span>
        );
      })}
    </div>
  );
}
