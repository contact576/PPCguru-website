import { CalendarCheck, KeyRound, Search, LayoutGrid, RefreshCw, MapPin } from "lucide-react";

/*
  Non-numeric proof strip. We deliberately avoid public aggregate metrics until
  they're verified — no invented numbers, and nothing that renders as "$0M+".
  [VERIFY]: When real, audited figures exist, a numeric variant can replace this
  (e.g. "[VERIFY] ad spend audited", "[VERIFY] average rating from [VERIFY] reviews").
*/
const proof = [
  { icon: CalendarCheck, label: "Weekly reporting", sub: "See what changed every week" },
  { icon: KeyRound, label: "You own your account", sub: "Your data, history & billing" },
  { icon: Search, label: "Audit-first onboarding", sub: "We find the leaks before scaling" },
  { icon: LayoutGrid, label: "One team, every channel", sub: "Google, Meta, SEO & CRM" },
  { icon: RefreshCw, label: "Month-to-month", sub: "No long-term lock-in" },
  { icon: MapPin, label: "GTA-based support", sub: "Brampton / Greater Toronto" },
];

export function StatBand() {
  return (
    <section className="py-6 md:py-8">
      <div className="container-page">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-6 py-10 md:px-12 md:py-12">
          <p className="text-center font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">
            What you can count on
          </p>
          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
            {proof.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="flex flex-col items-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--color-ink)] text-[var(--color-lime)]">
                    <Icon size={20} />
                  </span>
                  <p className="mt-3 text-sm font-bold text-[var(--color-ink)]">{p.label}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-dim)]">{p.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
