import { Marquee } from "@/components/ui/marquee";

/*
  Platform / tooling strip. These are the ad & analytics platforms PPC Guru
  works in — shown as neutral capability badges, NOT as official partner logos.
  [VERIFY]: Confirm Google Partner / Meta Business Partner / Microsoft Advertising
  certification status and logo-usage rights before displaying official badges.
*/
const platforms = [
  "Google Ads", "Meta Ads", "Microsoft Advertising", "Google Analytics 4",
  "Google Tag Manager", "Looker Studio", "Semrush", "HubSpot", "Search Console",
  "Merchant Center", "CallRail", "GoHighLevel",
];

export function PlatformBadges() {
  return (
    <section className="relative border-y border-[var(--color-border)] bg-[var(--color-base-2)] py-7">
      <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)]">
        Platforms &amp; tools we run every day
      </p>
      {/* Edge fades so the marquee dissolves into the canvas */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--color-base-2)] to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--color-base-2)] to-transparent md:w-40" />
      <Marquee speed={44}>
        {platforms.map((p) => (
          <span
            key={p}
            className="flex items-center gap-3 text-base font-semibold text-[var(--color-ink-dim)]"
          >
            <span className="h-1 w-1 rounded-full bg-[var(--color-orange)]" />
            {p}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
