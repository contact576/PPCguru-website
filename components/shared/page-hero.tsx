import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/badge";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-ink-faint)]">
      {items.map((item, i) => (
        <span key={item.path} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} />}
          {i === items.length - 1 ? (
            <span className="text-[var(--color-ink-dim)]">{item.name}</span>
          ) : (
            <Link href={item.path} className="hover:text-[var(--color-ink)]">{item.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Standard inner-page hero with subtle grid + glow, eyebrow, title and intro. */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-base)] pt-32 pb-16 md:pt-40 md:pb-20">
      <div
        className="pointer-events-none absolute -right-24 -top-32 h-[460px] w-[460px]"
        style={{ background: "radial-gradient(circle,rgba(206,255,58,.16),transparent 65%)" }}
      />
      <div className="container-page relative">
        {breadcrumbs ? <div className="mb-6"><Breadcrumbs items={breadcrumbs} /></div> : null}
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="head mt-5 max-w-4xl text-[clamp(2.6rem,5.5vw,4.6rem)] text-balance">{title}</h1>
        {intro ? <p className="mt-6 max-w-2xl text-lg text-[var(--color-ink-dim)] md:text-xl">{intro}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
