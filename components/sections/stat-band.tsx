import { CalendarCheck, KeyRound, Search, LayoutGrid, RefreshCw, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/*
  Non-numeric proof strip. We deliberately avoid public aggregate metrics until
  they're verified — no invented numbers, and nothing that renders as "$0M+".
  [VERIFY]: When real, audited figures exist, a numeric variant can replace this
  (e.g. "[VERIFY] ad spend audited", "[VERIFY] average rating from [VERIFY] reviews").
*/
const proof = [
  { icon: CalendarCheck, label: "Weekly reporting", sub: "See what changed every week" },
  { icon: KeyRound, label: "You own your accounts", sub: "Your data, history & billing" },
  { icon: Search, label: "Audit-first onboarding", sub: "Find the leaks before scaling" },
  { icon: LayoutGrid, label: "One team, every channel", sub: "Google, Meta, SEO & CRM" },
  { icon: RefreshCw, label: "Month-to-month", sub: "No long-term lock-in" },
  { icon: MapPin, label: "GTA-based support", sub: "Brampton / Greater Toronto" },
];

export function StatBand() {
  return (
    <section className="py-8 md:py-12">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 md:px-12 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-50" />
          <div className="relative flex items-center justify-between border-b border-[var(--color-border)] pb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-orange)]">
              // What you can count on
            </p>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-faint)] sm:block">
              Operating standards · v1
            </p>
          </div>
          <div className="relative mt-9 grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-3 lg:grid-cols-6">
            {proof.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.label} delay={(i % 6) * 0.05}>
                  <div className="group flex flex-col items-start text-left">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-orange)_12%,transparent)] text-[var(--color-orange)] transition-all duration-300 group-hover:border-[var(--color-orange)] group-hover:shadow-glow">
                      <Icon size={20} />
                    </span>
                    <p className="mt-4 text-sm font-bold leading-snug text-[var(--color-ink)]">{p.label}</p>
                    <p className="mt-1 text-xs text-[var(--color-ink-dim)]">{p.sub}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
