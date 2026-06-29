"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { LeadForm } from "@/components/shared/lead-form";

/**
 * Short "free account audit" contact band — embedded on service / industry /
 * location pages so every page is a conversion point (submit in place, no
 * navigation). Mirrors the homepage audit offer.
 */
export function LeadBand({
  source,
  title = "Get a free account audit",
  blurb = "We'll review your account, tracking and competitors and show you exactly where the opportunity is — no obligation, no lock-in.",
  points = ["Wasted-spend & tracking review", "Benchmark vs your industry", "A prioritized 30-day action plan"],
}: {
  source: string;
  title?: string;
  blurb?: string;
  points?: string[];
}) {
  const [done, setDone] = useState(false);
  return (
    <Section tone="cream">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <SectionHeading align="left" eyebrow="Free account audit" title={<>{title.split(" ").slice(0, -1).join(" ")} <span className="text-gradient">{title.split(" ").slice(-1)}</span></>} intro={blurb} />
          <ul className="mt-7 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15px] text-[var(--color-ink)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[var(--color-ink)] text-[var(--color-lime)]"><Check size={13} /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[22px] border border-[#dddbc9] bg-white p-6 md:p-7">
          {done ? (
            <div className="py-8 text-center">
              <h3 className="text-2xl font-bold">Thanks 🎉</h3>
              <p className="mt-3 text-[var(--color-ink-dim)]">We&apos;ve got your details and will send your free audit shortly.</p>
            </div>
          ) : (
            <>
              <div className="mono mb-4 text-[11px] font-bold uppercase tracking-[.1em] text-[#5f6f17]">Send your details</div>
              <LeadForm source={source} submitLabel="Get my free audit" onDone={() => setDone(true)} />
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
