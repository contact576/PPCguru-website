/**
 * BrandLogo — real, recognizable brand marks for the platforms, tools and AI
 * models we work with. Ported from the approved Claude Design handoff, which
 * swapped grey letter-monograms for proper brand-coloured marks.
 *
 * Two tiers:
 *  1. `BRAND` — hand-built vector marks for the marquee-worthy platforms
 *     (Google, Meta, YouTube, Microsoft, TikTok, GA4, Tag Manager, Zapier…).
 *  2. `tile()` — a clean brand-coloured lettered square for everything else,
 *     so every tool reads as a real logo rather than a grey blob.
 *
 * HONESTY: these are recognisable *product* marks used to show the stack we
 * operate in — NOT official partner badges or a claim of endorsement. Partner
 * accreditation art is handled separately and only shown once verified.
 */

/** Inner SVG markup for real brand marks (viewBox is always 0 0 24 24). */
const BRAND: Record<string, string> = {
  google:
    "<path fill='#4285F4' d='M23.5 12.3c0-.9-.1-1.7-.2-2.5H12v4.7h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z'/><path fill='#34A853' d='M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z'/><path fill='#FBBC05' d='M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z'/><path fill='#EA4335' d='M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1C6.2 6.8 8.9 4.8 12 4.8z'/>",
  youtube:
    "<rect x='1' y='5' width='22' height='14' rx='4.2' fill='#FF0000'/><path d='M9.8 8.2l6.4 3.8-6.4 3.8z' fill='#fff'/>",
  microsoft:
    "<rect x='2' y='2' width='9.2' height='9.2' fill='#F25022'/><rect x='12.8' y='2' width='9.2' height='9.2' fill='#7FBA00'/><rect x='2' y='12.8' width='9.2' height='9.2' fill='#00A4EF'/><rect x='12.8' y='12.8' width='9.2' height='9.2' fill='#FFB900'/>",
  ga4:
    "<rect x='16.4' y='2.4' width='5.2' height='19.2' rx='2.6' fill='#F9AB00'/><rect x='9.4' y='8.4' width='5.2' height='13.2' rx='2.6' fill='#E37400'/><circle cx='5' cy='18.6' r='3' fill='#E37400'/>",
  tagmanager:
    "<path d='M12 1.6 22.4 12 12 22.4 1.6 12z' fill='#8AB4F8'/><path d='M12 6.8 17.2 12 12 17.2 6.8 12z' fill='#246FDB'/>",
  tiktok:
    "<path d='M15.3 3.2h2.6c.3 1.9 1.4 3.3 3.5 3.6v2.6c-1.4 0-2.7-.4-3.6-1.1v6a5.4 5.4 0 1 1-5.4-5.4c.3 0 .5 0 .8.1v2.8c-.3-.1-.5-.1-.8-.1a2.6 2.6 0 1 0 2.6 2.6z' fill='#25F4EE' transform='translate(-1 -.8)'/><path d='M15.3 3.2h2.6c.3 1.9 1.4 3.3 3.5 3.6v2.6c-1.4 0-2.7-.4-3.6-1.1v6a5.4 5.4 0 1 1-5.4-5.4c.3 0 .5 0 .8.1v2.8c-.3-.1-.5-.1-.8-.1a2.6 2.6 0 1 0 2.6 2.6z' fill='#FE2C55' transform='translate(1 .8)'/><path d='M15.3 3.2h2.6c.3 1.9 1.4 3.3 3.5 3.6v2.6c-1.4 0-2.7-.4-3.6-1.1v6a5.4 5.4 0 1 1-5.4-5.4c.3 0 .5 0 .8.1v2.8c-.3-.1-.5-.1-.8-.1a2.6 2.6 0 1 0 2.6 2.6z' fill='#111'/>",
  zapier:
    "<g stroke='#FF4F00' stroke-width='3.4' stroke-linecap='round'><path d='M12 3.2v17.6'/><path d='M4.4 7.6l15.2 8.8'/><path d='M4.4 16.4l15.2-8.8'/></g>",
  claude:
    "<g stroke='#D97757' stroke-width='2.3' stroke-linecap='round'><path d='M12 2.6v18.8'/><path d='M2.6 12h18.8'/><path d='M5.3 5.3l13.4 13.4'/><path d='M18.7 5.3 5.3 18.7'/></g>",
  meta:
    "<rect width='24' height='24' rx='6' fill='#0668E1'/><path d='M5.5 15c0-3.1 1.5-6.3 3.6-6.3 2.7 0 3.4 6.3 6.3 6.3 1.7 0 3-1.4 3-3.1s-1.3-3.1-3-3.1c-3 0-3.7 6.3-6.4 6.3' fill='none' stroke='#fff' stroke-width='1.7' stroke-linecap='round'/>",
  airtable:
    "<path d='M12 3.2 3.4 6.6l8.6 3.4 8.6-3.4z' fill='#FCB400'/><path d='M3.1 8.2v7.9l8.3 3.3v-8z' fill='#18BFFF'/><path d='M13 11.4v8.1l7.9-3.2V8.2z' fill='#F82B60'/>",
  gemini:
    "<path d='M12 2c.5 5.2 4.3 8.9 9.5 9.5C16.3 12.1 12.5 15.8 12 21c-.5-5.2-4.3-8.9-9.5-9.5C7.7 10.9 11.5 7.2 12 2z' fill='#3186FF'/>",
  linkedin:
    "<rect width='24' height='24' rx='5' fill='#0A66C2'/><path fill='#fff' d='M7.2 9.3h2.6v8.4H7.2zM8.5 5.4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM11.6 9.3h2.5v1.15h.04c.35-.63 1.2-1.3 2.46-1.3 2.63 0 3.12 1.6 3.12 3.7v4.85h-2.6v-4.3c0-1.03-.02-2.35-1.5-2.35-1.5 0-1.73 1.12-1.73 2.28v4.37h-2.6z'/>",
  pinterest:
    "<rect width='24' height='24' rx='6' fill='#E60023'/><path fill='#fff' d='M12 5.2c-3.8 0-5.9 2.5-5.9 5.1 0 1.2.7 2.7 1.8 3.2.17.08.26.04.3-.13l.12-.5c.04-.15.02-.2-.09-.34-.4-.47-.63-1.06-.63-1.7 0-2.2 1.65-4.17 4.3-4.17 2.34 0 3.63 1.43 3.63 3.35 0 2.52-1.12 4.65-2.77 4.65-.92 0-1.6-.76-1.38-1.68.26-1.1.77-2.29.77-3.08 0-.71-.38-1.3-1.17-1.3-.93 0-1.68.96-1.68 2.25 0 .82.28 1.37.28 1.37l-1.11 4.72c-.33 1.4-.05 3.11-.03 3.28.01.1.14.13.2.05.08-.11 1.15-1.43 1.51-2.75.1-.37.59-2.3.59-2.3.29.55 1.14 1.04 2.04 1.04 2.69 0 4.51-2.45 4.51-5.73 0-2.48-2.1-4.8-5.29-4.8z'/>",
  slack:
    "<path fill='#36C5F0' d='M9 2.6a1.9 1.9 0 1 0 0 3.8h1.9V4.5A1.9 1.9 0 0 0 9 2.6z'/><path fill='#2EB67D' d='M14.9 9a1.9 1.9 0 1 0-3.8 0v4.8a1.9 1.9 0 1 0 3.8 0z'/><path fill='#ECB22E' d='M15 21.4a1.9 1.9 0 1 0 0-3.8h-1.9v1.9A1.9 1.9 0 0 0 15 21.4z'/><path fill='#E01E5A' d='M9.1 15a1.9 1.9 0 1 0 3.8 0v-4.8a1.9 1.9 0 1 0-3.8 0z'/>",
  github:
    "<path fill='#24292E' d='M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z'/>",
  vercel: "<path fill='#111' d='M12 3 22 20H2z'/>",
  nextjs:
    "<circle cx='12' cy='12' r='11' fill='#111'/><path fill='#fff' d='M9.2 7.4h1.5l6.1 8.9-1.5 1L9.9 9.9v6.7H8.4V7.4zm6 0h1.5v6.2l-1.5-2.2z'/>",
};

/** Brand-coloured lettered tiles for tools without a bespoke mark. */
const TILE: Record<string, { bg: string; text: string; fg?: string }> = {
  "Looker Studio": { bg: "#4285F4", text: "L" },
  Semrush: { bg: "#FF642D", text: "Se" },
  Ahrefs: { bg: "#0A5AEF", text: "ah" },
  HubSpot: { bg: "#FF7A59", text: "H" },
  ChatGPT: { bg: "#10A37F", text: "AI" },
  Perplexity: { bg: "#20808D", text: "P" },
  Grok: { bg: "#111827", text: "x" },
  DeepSeek: { bg: "#4D6BFE", text: "D" },
  Midjourney: { bg: "#111827", text: "M" },
  Firefly: { bg: "#E4553B", text: "F" },
  "Adobe Firefly": { bg: "#E4553B", text: "F" },
  Runway: { bg: "#111827", text: "R" },
  HeyGen: { bg: "#7C3AED", text: "H" },
  ElevenLabs: { bg: "#0B0B0B", text: "11" },
  CapCut: { bg: "#111827", text: "C" },
  Descript: { bg: "#111827", text: "D" },
  Optmyzr: { bg: "#F26B21", text: "O" },
  Adalysis: { bg: "#2563EB", text: "A" },
  Madgicx: { bg: "#6C5CE7", text: "M" },
  Revealbot: { bg: "#2D7FF9", text: "R" },
  Foreplay: { bg: "#111827", text: "F" },
  "AdCreative.ai": { bg: "#6D28D9", text: "Ad" },
  "Screaming Frog": { bg: "#17A34A", text: "SF" },
  "Surfer SEO": { bg: "#E8663B", text: "S" },
  Frase: { bg: "#5B34DA", text: "Fr" },
  "Microsoft Clarity": { bg: "#276EF1", text: "C" },
  Clarity: { bg: "#276EF1", text: "C" },
  Make: { bg: "#6D00CC", text: "M" },
  n8n: { bg: "#EA4B71", text: "n8" },
  Supermetrics: { bg: "#E8532F", text: "S" },
  "Merchant Center": { bg: "#4285F4", text: "MC" },
  "Claude Code": { bg: "#D97757", text: "CC" },
  Cursor: { bg: "#111827", text: "Cu" },
  v0: { bg: "#111827", text: "v0" },
};

function tileInner(bg: string, text: string, fg = "#fff") {
  const size = text.length > 1 ? 8.5 : 12;
  return (
    `<rect width='24' height='24' rx='6' fill='${bg}'/>` +
    `<text x='12' y='12.4' font-family='Archivo,Arial,sans-serif' font-size='${size}' font-weight='800' fill='${fg}' text-anchor='middle' dominant-baseline='central'>${text}</text>`
  );
}

/** Map an arbitrary tool/platform name to its inner SVG markup. */
function innerFor(name: string): string {
  const n = name.toLowerCase();

  // Real brand marks (order matters — most specific first).
  if (n.includes("analytics")) return BRAND.ga4;
  if (n.includes("tag manager")) return BRAND.tagmanager;
  if (n.includes("clarity")) return tileInner("#276EF1", "C");
  if (n.includes("microsoft")) return BRAND.microsoft;
  if (n.includes("youtube")) return BRAND.youtube;
  if (n.includes("tiktok")) return BRAND.tiktok;
  if (n.includes("meta")) return BRAND.meta;
  if (n.includes("linkedin")) return BRAND.linkedin;
  if (n.includes("pinterest")) return BRAND.pinterest;
  if (n.includes("zapier")) return BRAND.zapier;
  if (n === "claude") return BRAND.claude;
  if (n.includes("gemini")) return BRAND.gemini;
  if (n.includes("airtable")) return BRAND.airtable;
  if (n.includes("slack")) return BRAND.slack;
  if (n.includes("github")) return BRAND.github;
  if (n.includes("vercel")) return BRAND.vercel;
  if (n.includes("next.js")) return BRAND.nextjs;
  if (
    n.includes("google") || // Google Ads, Search Console, Google Partner, Google Business
    n.includes("performance max") ||
    n.includes("search console")
  )
    return BRAND.google;

  // Explicit lettered tiles.
  const t = TILE[name];
  if (t) return tileInner(t.bg, t.text, t.fg);

  // Generic fallback — clean dark tile with the first significant character.
  const ch = (name.replace(/[^A-Za-z0-9]/g, "")[0] ?? "•").toUpperCase();
  return tileInner("#3a3c30", ch);
}

/**
 * Render a brand mark at `size` px. Purely presentational (aria-hidden); pair
 * it with the tool name as visible text so screen readers get the label.
 */
export function BrandLogo({
  name,
  size = 22,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ flexShrink: 0, display: "block", ...style }}
      aria-hidden
      // Inner markup is a trusted static string built above — no user input.
      dangerouslySetInnerHTML={{ __html: innerFor(name) }}
    />
  );
}
