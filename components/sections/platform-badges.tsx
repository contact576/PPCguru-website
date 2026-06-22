/*
  Platform / tooling strip. These are the ad & analytics platforms PPC Guru
  works in — shown as neutral capability badges, NOT as official partner logos.
  [VERIFY]: Confirm Google Partner / Meta Business Partner / Microsoft Advertising
  certification status and logo-usage rights before displaying official badges.
*/
const platforms = [
  "Google Ads", "Meta Ads", "Microsoft Advertising", "Google Analytics 4",
  "Google Tag Manager", "Looker Studio", "Semrush", "HubSpot",
];

export function PlatformBadges() {
  return (
    <section className="border-y border-[var(--color-border)] bg-white py-8">
      <div className="container-page">
        <p className="text-center font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">
          Platforms &amp; tools we work in every day
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {platforms.map((p) => (
            <span key={p} className="text-sm font-semibold text-[var(--color-ink-dim)]">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
