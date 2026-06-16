import { Counter } from "@/components/ui/counter";
import { headlineStats } from "@/lib/data/company";

export function StatBand() {
  return (
    <section className="relative border-y border-[--color-border] bg-[--color-base-2] py-14">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {headlineStats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold text-gradient md:text-5xl">
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <p className="mt-2 text-sm text-[--color-ink-dim]">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[--color-ink-faint]">
          Representative aggregate figures across client engagements. Verify current numbers before launch.
        </p>
      </div>
    </section>
  );
}
