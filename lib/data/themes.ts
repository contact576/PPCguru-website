import type { CSSProperties } from "react";

/**
 * Per-vertical accent map. Each service / industry / city gets a distinct,
 * on-brand secondary accent so its page reads as its own — the accent washes the
 * hero, tints the hero illustration, recolours section eyebrows + emphasis words,
 * CTAs and small details, while the core cream/lime/ink system stays primary.
 * Falls back to olive.
 */
const OLIVE = "#6f7d22";

const ACCENTS: Record<string, string> = {
  // ---- Services ----
  "google-ads": "#2f6db0",
  "meta-ads": "#5b6cc0",
  "seo": "#2f8f6b",
  "creative": "#c4632a",
  "web-design": "#6f7d22",
  "crm": "#8a6d1f",
  "linkedin-ads": "#2d6f9e",
  "tiktok-ads": "#2f9e98",
  "microsoft-ads": "#4a7a3f",
  "pinterest-ads": "#b0413e",
  "youtube-ads": "#b5443a",
  "ai-automation": "#5b6cc0",
  "cro-landing-pages": "#c4632a",

  // ---- Industries ----
  "physiotherapy": "#2f8f6b",
  "healthcare-clinics": "#2f8f9e",
  "dental": "#2f6db0",
  "hvac": "#2d7fb0",
  "plumbing": "#2f6db0",
  "electrical": "#c79a1f",
  "construction-renovation": "#b5722a",
  "roofing": "#8a4b2a",
  "immigration": "#2f6db0",
  "law-firms": "#6b5b8a",
  "real-estate": "#2f7d6b",
  "home-improvement": "#b5722a",
  "fitness-gyms": "#c4632a",
  "med-spa": "#b06a8a",
  "professional-services": "#5b6cc0",
};

export function getAccent(slug?: string): string {
  return (slug && ACCENTS[slug]) || OLIVE;
}

/** A light wash of the accent over the cream canvas, for hero backgrounds. */
export function accentTint(accent: string): string {
  return `color-mix(in srgb, ${accent} 11%, var(--color-base))`;
}

/**
 * Page-level CSS custom properties for a vertical. Spread onto the wrapper around
 * a whole page so the accent cascades into every shared section (eyebrows,
 * `.text-gradient` emphasis words, CTAs, icon tiles, dividers) without prop
 * drilling. Index/home pages that don't set these fall back to the lime/olive
 * defaults baked into each component, so nothing regresses.
 *
 * - `--accent`        the vivid accent (icon tiles, CTAs, rules)
 * - `--accent-strong` darkened for legible text/emphasis on cream
 * - `--accent-soft`   tint for soft fills / chips
 * - `--accent-line`   border tint for cards/dividers
 * - `--accent-tint`   faint hero/section wash
 */
export function accentVars(slug?: string): CSSProperties {
  return accentVarsFor(getAccent(slug));
}

/** Same cascade as accentVars, but from an explicit accent (used by flagship
 *  pages that hardcode their hero colour). */
export function accentVarsFor(accent: string): CSSProperties {
  return {
    "--accent": accent,
    "--accent-strong": `color-mix(in srgb, ${accent} 78%, #14170e)`,
    "--accent-soft": `color-mix(in srgb, ${accent} 16%, var(--color-base))`,
    "--accent-line": `color-mix(in srgb, ${accent} 34%, #dddbc9)`,
    "--accent-tint": `color-mix(in srgb, ${accent} 11%, var(--color-base))`,
  } as CSSProperties;
}
