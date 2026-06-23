import { Counter } from "@/components/ui/counter";
import { headlineStats } from "@/lib/data/company";

export function StatBand() {
  return (
    <section className="py-6 md:py-8">
      <div className="container-page">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-6 py-12 md:px-12 md:py-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {headlineStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl font-extrabold text-gradient md:text-6xl">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </div>
                <p className="mt-2 text-sm font-medium text-[var(--color-ink-dim)]">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">
            Representative aggregate figures across client engagements · verify before launch
          </p>
        </div>
      </div>
    </section>
  );
}
