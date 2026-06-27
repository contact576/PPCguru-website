import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { team } from "@/lib/data/team";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

/** "Meet the team" — data-driven (lib/data/team.ts), scales to any roster.
 *  Headshots when `photo` is set, otherwise the signature ink/lime monogram. */
export function TeamSection() {
  if (!team.length) return null;
  // Center smaller rosters; let larger ones fill 3 across.
  const cols = team.length <= 2 ? "sm:grid-cols-2 max-w-4xl" : "sm:grid-cols-2 lg:grid-cols-3 max-w-6xl";
  return (
    <Section className="bg-[var(--color-base-2)]">
      <SectionHeading
        eyebrow="The team"
        title="The people behind your account"
        intro="Founder-led and senior — small enough to care, structured enough to deliver."
      />
      <div className={`mx-auto mt-12 grid gap-6 ${cols}`}>
        {team.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.06}>
            <div className="flex h-full flex-col rounded-[22px] border border-[#dddbc9] bg-[#fbfaf2] p-7">
              <div className="flex items-center gap-4">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="h-14 w-14 shrink-0 rounded-[16px] object-cover"
                  />
                ) : (
                  <span className="head flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-[var(--color-ink)] text-lg text-[var(--color-lime)]">
                    {initials(m.name)}
                  </span>
                )}
                <div>
                  <p className="head text-[17px] text-[var(--color-ink)]">{m.name}</p>
                  <p className="mono text-xs uppercase tracking-[.08em] text-[#5f6f17]">{m.role}</p>
                </div>
              </div>

              <p className="mt-5 text-sm text-[var(--color-ink-dim)]">{m.bio}</p>

              {m.focus && m.focus.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {m.focus.map((f) => (
                    <span
                      key={f}
                      className="mono rounded-full border border-[#cfe39a] bg-[#eef2dd] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[.04em] text-[#5f6f17]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {m.linkedin && (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.06em] text-[var(--color-ink)] hover:text-[#5f6f17]"
                >
                  Connect on LinkedIn →
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
