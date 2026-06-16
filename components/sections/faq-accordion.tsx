"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  faqs,
  heading = true,
  title = "Questions, answered",
}: {
  faqs: { q: string; a: string }[];
  heading?: boolean;
  title?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section>
      <JsonLd data={faqSchema(faqs)} />
      <div className="mx-auto max-w-3xl">
        {heading ? <SectionHeading eyebrow="FAQ" title={title} /> : null}
        <div className="mt-12 divide-y divide-[--color-border] border-y border-[--color-border]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-medium text-[--color-ink]">{f.q}</span>
                  <Plus
                    size={20}
                    className={cn("shrink-0 text-[--color-cyan-bright] transition-transform duration-300", isOpen && "rotate-45")}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300",
                    isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                  )}
                >
                  <p className="min-h-0 text-[--color-ink-dim]">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
