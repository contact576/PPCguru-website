import { logoIndustries, logoName } from "@/lib/data/landing-100-leads";

const LOGOS = "/landing/logos";
const INK = "#14170e";
const CREAM = "#f1efe3";

/* eslint-disable @next/next/no-img-element -- client logos are tiny static assets */

/**
 * Homepage client proof: every client logo we have, in ONE continuous moving
 * row (the landing pages split the same set across one row per industry — here
 * it's a single band), with the industries and the brands inside each spelled
 * out underneath so the wall reads as proof rather than decoration.
 *
 * `.mq` (app/globals.css) animates translateX(-50%), so the track must hold the
 * list exactly twice — the second copy is aria-hidden. globals.css also carries
 * the prefers-reduced-motion guard that stops the animation.
 */
export function ClientLogoRow() {
  const all = logoIndustries.flatMap((group) =>
    group.logos.map((file) => ({ file, industry: group.label }))
  );
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
            {all.length} brands we run Google &amp; Meta Ads for, across {logoIndustries.length} industries — franchises,
            national names and local businesses.
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
                title={dupe ? undefined : `${logoName(item.file)} — ${item.industry}`}
                className="transition-colors duration-300 hover:border-[#c3c1ae]"
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 84,
                  width: 176,
                  margin: "0 9px",
                  padding: "0 20px",
                  background: "#fff",
                  border: "1px solid #e1dfcf",
                  borderRadius: 18,
                }}
              >
                <img
                  src={`${LOGOS}/${item.file}`}
                  alt={dupe ? "" : logoName(item.file)}
                  loading="lazy"
                  decoding="async"
                  style={{ maxHeight: 48, maxWidth: 136, width: "auto", objectFit: "contain" }}
                />
              </figure>
            );
          })}
        </div>
      </div>

      {/* The mention list: every moving logo named, under the industry it belongs to. */}
      <div className="mx-auto max-w-[1480px] px-5 pb-14 pt-10 md:px-8 md:pb-20 md:pt-12">
        <ul data-reveal className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {logoIndustries.map((group) => (
            <li key={group.id}>
              <p
                className="mono"
                style={{
                  fontSize: 10.5,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: INK,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingBottom: 9,
                  marginBottom: 10,
                  borderBottom: "1px solid #dddbc9",
                }}
              >
                <span>{group.label}</span>
                <span style={{ color: "#8a8c7c", fontWeight: 600 }}>{group.logos.length}</span>
              </p>
              <p style={{ fontSize: 13.5, color: "#54564a", lineHeight: 1.65 }}>
                {group.logos.map(logoName).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
/* eslint-enable @next/next/no-img-element */
