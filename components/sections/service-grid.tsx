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
                className="group relative flex h-full flex-col gap-4 rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-ink)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-[54px] w-[54px] items-center justify-center rounded-[15px] bg-[var(--color-ink)] text-[var(--color-lime)]">
                    <Icon size={23} />
                  </span>
                  <ArrowUpRight size={20} className="text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-ink)]" />
                </div>
                <h3 className="head text-[20px]">{s.name}</h3>
                <p className="text-sm text-[var(--color-ink-dim)]">{s.short}</p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
