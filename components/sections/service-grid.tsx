import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { services as allServices } from "@/lib/data/services";

export function ServiceGrid({
  heading = true,
  only,
}: {
  heading?: boolean;
  only?: string[];
}) {
  const list = only ? allServices.filter((s) => only.includes(s.slug)) : allServices;
  return (
    <Section id="services">
      {heading ? (
        <SectionHeading
          eyebrow="What we do"
          title={<>Full-funnel growth, <span className="text-gradient">one accountable team</span></>}
          intro="Paid ads, SEO, creative and the systems that turn leads into booked jobs — all measured against revenue."
        />
      ) : null}
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.slug} delay={i * 0.05}>
              <Link
                href={`/services/${s.slug}`}
                className="group relative flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-violet)] hover:bg-[var(--color-surface-2)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-violet)_18%,transparent)] text-[var(--color-cyan-bright)]">
                    <Icon size={22} />
                  </span>
                  <ArrowUpRight size={20} className="text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-cyan-bright)]" />
                </div>
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="text-sm text-[var(--color-ink-dim)]">{s.short}</p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
