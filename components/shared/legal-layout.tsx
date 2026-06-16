import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/ui/section";

/** Shared layout + typography for long-form legal pages. */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={title}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: title, path: "#" }]}
      />
      <Section className="!pt-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 text-sm text-[--color-ink-faint]">Last updated: {updated}</p>
          <div className="space-y-6 text-[--color-ink-dim] [&_a]:text-[--color-cyan-bright] [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[--color-ink] [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed">
            {children}
          </div>
        </div>
      </Section>
    </>
  );
}
