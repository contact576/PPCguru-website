import { Marquee } from "@/components/magicui/marquee";
import { logosByGroup, type Logo, type LogoGroup } from "@/lib/data/logos";
import { BrandIcon } from "@/components/shared/brand-logos";
import { cn } from "@/lib/utils";

/**
 * Monochrome logo pill. Renders the real asset when `src` is set (drop official
 * SVG/PNGs into /public and set `logo.src`), otherwise a clean text-pill — so
 * the wall looks intentional with zero bundled third-party assets.
 */
export function LogoPill({ logo, className }: { logo: Logo; className?: string }) {
  if (logo.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo.src}
        alt={logo.name}
        className={cn("h-7 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#dddbc9] bg-white/60 py-1.5 pl-1.5 pr-4 text-[12px] font-semibold tracking-[.02em] text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
        className
      )}
    >
      <BrandIcon name={logo.name} size={22} />
      {logo.abbr ?? logo.name}
    </span>
  );
}

/** Static wrapped grid of pills for the given groups ("platforms we work with"). */
export function LogoWall({ groups, className }: { groups: LogoGroup[]; className?: string }) {
  const items = groups.flatMap(logosByGroup);
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2.5", className)}>
      {items.map((l) => (
        <LogoPill key={l.name} logo={l} />
      ))}
    </div>
  );
}

/** Auto-scrolling carousel of client/brand logos (footer "brands we work with"). */
export function BrandMarquee({ className }: { className?: string }) {
  const clients = logosByGroup("client");
  if (clients.length === 0) return null;
  return (
    <Marquee pauseOnHover className={cn("[--duration:38s]", className)}>
      {clients.map((l) => (
        <span
          key={l.name}
          className="mono mx-3 inline-flex items-center whitespace-nowrap text-[15px] font-semibold tracking-[.02em] text-[#75766a] transition-colors hover:text-[#f1efe3]"
        >
          {l.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={l.src} alt={l.name} className="h-6 w-auto opacity-60 grayscale transition hover:opacity-100" />
          ) : (
            l.name
          )}
        </span>
      ))}
    </Marquee>
  );
}
