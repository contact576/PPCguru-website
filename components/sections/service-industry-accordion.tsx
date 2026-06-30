"use client";

import { useState } from "react";
import Link from "next/link";
import type { ServiceIndustryAngle } from "@/lib/data/service-industry";

type Row = { industrySlug: string; label: string; href: string; angle: ServiceIndustryAngle };

const BLOCKS: { key: keyof ServiceIndustryAngle; title: string }[] = [
  { key: "goodPractices", title: "What good looks like" },
  { key: "bestPractices", title: "Best practices we apply" },
  { key: "industryStandards", title: "Typical industry benchmarks" },
  { key: "whatToExpect", title: "What to expect with us" },
];

/**
 * Collapsed menu of "[Service] for [Industry]" rows that expand on click — clones the
 * FaqAccordion grid-rows disclosure so the full content stays in the DOM (SSR/crawlable)
 * even when collapsed. Each row links to its dedicated /services/[slug]/[industry] page.
 */
export function ServiceIndustryAccordion({ rows }: { rows: Row[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!rows.length) return null;
  return (
    <div className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {rows.map((r, i) => {
        const isOpen = open === i;
        return (
          <div key={r.industrySlug}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="head text-[17px] text-[var(--color-ink)]">{r.label}</span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[var(--accent-strong)] transition-transform duration-300 ${isOpen ? "rotate-45 border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--accent-line)]"}`}
              >
                +
              </span>
            </button>
            <div className={`grid overflow-hidden transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
              <div className="min-h-0">
                <div className="grid gap-5 sm:grid-cols-2">
                  {BLOCKS.map((b) => (
                    <div key={b.key} className="rounded-[16px] border border-[var(--accent-line)] bg-[#fbfaf2] p-5">
                      <p className="mono text-[11px] uppercase tracking-[.06em] text-[var(--accent-strong)]">{b.title}</p>
                      <ul className="mt-3 space-y-2">
                        {r.angle[b.key].map((it) => (
                          <li key={it} className="flex gap-2 text-[13.5px] leading-relaxed text-[var(--color-ink-dim)]">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link
                  href={r.href}
                  className="mono mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--accent-strong)] hover:text-[var(--color-ink)]"
                >
                  See the full {r.label} playbook →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
