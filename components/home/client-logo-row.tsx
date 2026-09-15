import { clientLogos, logoName } from "@/lib/data/landing-100-leads";

const LOGOS = "/landing/logos";
const INK = "#14170e";
const CREAM = "#f1efe3";

/* eslint-disable @next/next/no-img-element -- client logos are tiny static assets */

/**
 * Homepage client proof: every client logo we have, in ONE continuous moving
 * row, with the brands spelled out underneath so the wall reads as proof
 * rather than decoration.
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
      <div
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
                className="transition-colors duration-300 hover:border-[#c3c1ae]"
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 92,
                  width: 184,
                  margin: "0 9px",
                  padding: "0 12px",
                  background: "#fff",
                  border: "1px solid #e1dfcf",
                  borderRadius: 18,
                }}
              >
                <img
                  src={`${LOGOS}/${item.file}`}
                  alt={dupe ? "" : item.name}
                  /* Eager but low-priority — lazy tiles pop in blank as the marquee moves. */
                  loading="eager"
                  fetchPriority="low"
                  decoding="async"
                  style={{ maxHeight: 72, maxWidth: 158, width: "auto", objectFit: "contain" }}
                />
              </figure>
            );
          })}
        </div>
      </div>

      {/* Every moving logo named, in one flat list — no industry grouping. */}
      <div className="mx-auto max-w-[1480px] px-5 pb-14 pt-10 md:px-8 md:pb-20 md:pt-12">
        <ul
          data-reveal
          className="flex flex-wrap justify-center gap-x-3 gap-y-3"
          style={{ borderTop: "1px solid #dddbc9", paddingTop: 26 }}
        >
          {[...all].sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
            <li
              key={item.file}
              style={{
                fontSize: 13,
                color: "#454737",
                background: "#fff",
                border: "1px solid #e1dfcf",
                borderRadius: 999,
                padding: "6px 13px",
                lineHeight: 1.2,
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
}
/* eslint-enable @next/next/no-img-element */
