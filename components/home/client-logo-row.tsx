import { clientLogos, logoName } from "@/lib/data/landing-100-leads";
import { clientLogosWebp } from "@/lib/data/client-logos-webp";
import { LoadImagesNearView } from "@/components/shared/load-images-near-view";

const LOGOS = "/landing/logos";
const INK = "#14170e";
/** Smaller WebP where one exists (scripts/optimize-client-logos-webp.mjs), else the original. */
const logoSrc = (file: string) =>
  clientLogosWebp.has(file) ? `${LOGOS}/opt/${file.replace(/.[^.]+$/, ".webp")}` : `${LOGOS}/${file}`;
const CREAM = "#f1efe3";

/* eslint-disable @next/next/no-img-element -- client logos are tiny static assets */

/**
 * Homepage client proof: every client logo we have, in one continuous moving row.
 *
 * `.mq` (app/globals.css) animates translateX(-50%), so the track must hold the
 * list exactly twice — the second copy is aria-hidden. globals.css also carries
 * the prefers-reduced-motion guard that stops the animation.
 */
export function ClientLogoRow() {
  const all = clientLogos.map((file) => ({ file, name: logoName(file) }));
  // Two identical halves for the -50% loop; slow enough to actually read a logo.
  const track = [...all, ...all];
  const duration = Math.round(all.length * 2.4);

  return (
    <section
      id="clients"
      aria-labelledby="clients-title"
      className="pb-12 md:pb-16"
      style={{ background: CREAM, color: INK, borderBottom: "1px solid #e3e0d0", overflow: "hidden" }}
    >
      <div className="mx-auto max-w-[1480px] px-5 pt-12 md:px-8 md:pt-16">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <p
              className="mono"
              style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#6f7d22", marginBottom: 10 }}
            >
              Clients
            </p>
            <h2 id="clients-title" className="head" style={{ fontSize: "clamp(1.8rem,3.4vw,2.8rem)", lineHeight: 1.08 }}>
              Trusted across 200+ businesses
            </h2>
          </div>
          <p style={{ fontSize: 14.5, color: "#54564a", lineHeight: 1.55, maxWidth: 430 }}>
            {all.length} brands we run Google &amp; Meta Ads for — franchises, national names and local
            businesses.
          </p>
        </div>
      </div>

      {/* One row, full-bleed, faded at both edges so logos enter and leave cleanly. */}
      <LoadImagesNearView
        className="mt-9 md:mt-11"
        aria-label="Client logos"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
        }}
      >
        <div className="mq" style={{ animationDuration: `${duration}s`, alignItems: "center" }}>
          {track.map((item, i) => {
            const dupe = i >= all.length;
            return (
              <figure
                key={`${item.file}-${i}`}
                aria-hidden={dupe}
                title={dupe ? undefined : item.name}
                className="logo-tile"
              >
                <img
                  data-src={logoSrc(item.file)}
                  alt={dupe ? "" : item.name}
                  /* src is set by LoadImagesNearView just before the row scrolls in. */
                  decoding="async"
                />
              </figure>
            );
          })}
        </div>
      </LoadImagesNearView>
    </section>
  );
}
/* eslint-enable @next/next/no-img-element */
