/* ============================================================================
   BrandIcon — a recognizable brand mark for each platform / tool / AI we name.
   Self-contained inline SVGs (no third-party assets bundled): each mark is a
   simplified, original rendition of the brand in its own colours, drawn to fill
   a 24×24 box. Known brands get a real glyph; anything unmapped falls back to a
   brand-coloured tile with initials. Pure / server-safe. Used by the homepage
   stack section + the logo pills.

   Trademarks belong to their owners; these marks indicate the tools PPC Guru
   works in (nominative use), rendered on a light chip so they read on any bg.
   ========================================================================== */

type GlyphProps = { s: number };

const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Brand fill colours for the initials-tile fallback. */
const COLOR: Record<string, string> = {
  semrush: "#FF642D", ahrefs: "#054ADA", screamingfrog: "#34A853",
  surferseo: "#1A8CFF", frase: "#6C5CE7",
  optmyzr: "#1FA8E0", adalysis: "#2B6CB0", madgicx: "#6C2BD9", revealbot: "#0EA5E9",
  foreplay: "#111111", adcreativeai: "#7C3AED",
  midjourney: "#111111", adobefirefly: "#FF3366", firefly: "#FF3366",
  runway: "#111111", heygen: "#5B4DF5", elevenlabs: "#111111", capcut: "#111111", descript: "#2D6BFF",
  zapier: "#FF4F00", make: "#6D00CC", n8n: "#EA4B71", airtable: "#1F6FEB", supermetrics: "#EE4823",
  cursor: "#111111", v0: "#111111", bbbaccredited: "#0A5C99",
};

function initials(name: string) {
  const clean = name.replace(/[^A-Za-z0-9 ]/g, " ").split(" ").filter(Boolean);
  if (clean.length >= 2 && name.length > 5) return (clean[0][0] + clean[1][0]).toUpperCase();
  return name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
}

/* ── Brand glyphs (drawn to fill a 24×24 viewBox, brand colours) ──────────── */

const GoogleG = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
    <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z" />
    <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
  </svg>
);

const MetaInfinity = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <defs><linearGradient id="mi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0099FF" /><stop offset="1" stopColor="#0064E0" /></linearGradient></defs>
    <path fill="url(#mi)" d="M7 5C3.7 5 2 8.2 2 12c0 3.4 1.6 6 4.1 6 1.9 0 3.3-1.1 4.9-3.7l.5-.9.5.8C13.6 16.8 15 18 16.9 18 19.6 18 22 15.7 22 11.9 22 7.9 20 5 17 5c-2 0-3.6 1.3-5.2 4l-.4.6-.5-.8C9.2 6.1 8.4 5 7 5Zm.2 2.3c1 0 1.8.7 2.9 2.5l-1.4 2.3c-1.2 1.8-1.8 2.3-2.6 2.3-1.3 0-2.1-1.1-2.1-3 0-2.4 1.2-4.1 3.2-4.1Zm9.6 0c1.6 0 2.8 1.6 2.8 4 0 1.8-.7 3.1-2 3.1-.9 0-1.5-.5-2.6-2.3l-1.2-2c1.2-2 2-2.8 3-2.8Z" />
  </svg>
);

const YouTube = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <rect x="1" y="5" width="22" height="14" rx="4.6" fill="#FF0000" />
    <path d="M10 8.6 16.2 12 10 15.4Z" fill="#fff" />
  </svg>
);

const MicrosoftSquares = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <rect x="2" y="2" width="9" height="9" fill="#F25022" /><rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
    <rect x="2" y="13" width="9" height="9" fill="#00A4EF" /><rect x="13" y="13" width="9" height="9" fill="#FFB900" />
  </svg>
);

const TikTok = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <path fill="#25F4EE" d="M14.7 4h-2.2v13.3a2 2 0 1 1-1.7-2v-2.4a4.4 4.4 0 1 0 3.9 4.4V9.5A6 6 0 0 0 18 10.7V8.4c-1.8-.1-3.1-1.5-3.3-3.4z" transform="translate(-1.1 .5)" />
    <path fill="#FE2C55" d="M14.7 4h-2.2v13.3a2 2 0 1 1-1.7-2v-2.4a4.4 4.4 0 1 0 3.9 4.4V9.5A6 6 0 0 0 18 10.7V8.4c-1.8-.1-3.1-1.5-3.3-3.4z" transform="translate(1.1 -.5)" />
    <path fill="#111" d="M14.7 4h-2.2v13.3a2 2 0 1 1-1.7-2v-2.4a4.4 4.4 0 1 0 3.9 4.4V9.5A6 6 0 0 0 18 10.7V8.4c-1.8-.1-3.1-1.5-3.3-3.4z" />
  </svg>
);

const LinkedIn = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <rect width="24" height="24" rx="4.5" fill="#0A66C2" />
    <path fill="#fff" d="M5.5 9.6h2.4V18H5.5zM6.7 5.6a1.4 1.4 0 1 1 0 2.9 1.4 1.4 0 0 1 0-2.9zM10 9.6h2.3v1.15c.4-.7 1.3-1.4 2.7-1.4 2 0 3.1 1.15 3.1 3.65V18h-2.4v-4.4c0-1.1-.4-1.8-1.4-1.8s-1.6.7-1.6 1.9V18H10z" />
  </svg>
);

const Pinterest = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="11" fill="#E60023" />
    <path fill="#fff" d="M12.3 5.6c-3.6 0-5.6 2.3-5.6 4.9 0 1.2.6 2.7 1.7 3.2.2.1.3 0 .3-.1l.2-.8c0-.1 0-.2-.1-.3-.4-.5-.6-1.1-.6-1.8 0-2.3 1.7-4.2 4.4-4.2 2.4 0 3.7 1.5 3.7 3.4 0 2.6-1.1 4.7-2.8 4.7-.9 0-1.6-.8-1.4-1.7.3-1.1.8-2.3.8-3.1 0-.7-.4-1.3-1.2-1.3-1 0-1.7 1-1.7 2.3 0 .8.3 1.4.3 1.4l-1.1 4.7c-.3 1.4-.05 3.1 0 3.3 0 .1.1.1.2 0 .1-.1 1.4-1.7 1.8-3.3l.5-2.1c.4.8 1.5 1.4 2.6 1.4 3.5 0 5.8-3.1 5.8-7.3 0-3.1-2.7-6-6.7-6z" />
  </svg>
);

const PMaxSpark = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <defs><linearGradient id="pmx" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4285F4" /><stop offset=".5" stopColor="#34A853" /><stop offset="1" stopColor="#FBBC05" /></linearGradient></defs>
    <path fill="url(#pmx)" d="M12 1.5c.6 4.9 3.1 7.4 8 8-4.9.6-7.4 3.1-8 8-.6-4.9-3.1-7.4-8-8 4.9-.6 7.4-3.1 8-8z" />
  </svg>
);

const GA4 = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <rect x="15" y="3.5" width="5" height="17" rx="2.5" fill="#F9AB00" />
    <rect x="9" y="9" width="5" height="11.5" rx="2.5" fill="#E37400" />
    <circle cx="6.3" cy="17.6" r="2.9" fill="#E37400" />
  </svg>
);

const GTM = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <path fill="#8AB4F8" d="M12 1.8 22.2 12 12 22.2 1.8 12z" />
    <path fill="#4285F4" d="M12 1.8 17 6.8 6.8 17 1.8 12z" />
    <circle cx="12" cy="12" r="2.1" fill="#fff" />
  </svg>
);

const Looker = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <circle cx="9.5" cy="12" r="5.5" fill="#4285F4" />
    <path fill="#EA4335" d="M13.2 7a5.5 5.5 0 0 1 0 10 5.5 5.5 0 0 0 0-10z" />
    <circle cx="16.5" cy="6.5" r="2.4" fill="#FBBC05" />
  </svg>
);

const SearchConsole = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <rect x="3" y="15" width="3.4" height="5" rx="1" fill="#4285F4" />
    <rect x="8" y="12" width="3.4" height="8" rx="1" fill="#34A853" />
    <circle cx="15.5" cy="9.5" r="5" fill="none" stroke="#EA4335" strokeWidth="2.4" />
    <line x1="19.2" y1="13.2" x2="22" y2="16" stroke="#FBBC05" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const MerchantCenter = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M4 6h16l-1.2 4H5.2z" />
    <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" fill="#34A853" />
    <rect x="10" y="13.5" width="4" height="6.5" fill="#fff" />
  </svg>
);

const Clarity = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="11" fill="#1E88E5" />
    <path d="M3.5 12S7 6.5 12 6.5 20.5 12 20.5 12 17 17.5 12 17.5 3.5 12 3.5 12z" fill="none" stroke="#fff" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="2.5" fill="#fff" />
  </svg>
);

const OpenAI = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <g fill="none" stroke="#10A37F" strokeWidth="2.1">
      <ellipse cx="12" cy="12" rx="4.2" ry="8.4" />
      <ellipse cx="12" cy="12" rx="4.2" ry="8.4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="4.2" ry="8.4" transform="rotate(120 12 12)" />
    </g>
  </svg>
);

const Claude = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <g stroke="#D97757" strokeWidth="2.3" strokeLinecap="round">
      <line x1="12" y1="3.5" x2="12" y2="20.5" />
      <line x1="4.6" y1="7.75" x2="19.4" y2="16.25" />
      <line x1="4.6" y1="16.25" x2="19.4" y2="7.75" />
    </g>
  </svg>
);

const Gemini = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <defs><linearGradient id="gem" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#4285F4" /><stop offset=".55" stopColor="#9168F0" /><stop offset="1" stopColor="#D96570" /></linearGradient></defs>
    <path fill="url(#gem)" d="M12 1.5c0 5.6 4.9 10.5 10.5 10.5C16.9 12 12 16.9 12 22.5 12 16.9 7.1 12 1.5 12 7.1 12 12 7.1 12 1.5z" />
  </svg>
);

const Perplexity = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <rect width="24" height="24" rx="5" fill="#20808D" />
    <g stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round">
      <line x1="12" y1="5.5" x2="12" y2="18.5" />
      <path d="M12 7.5 6.5 11v3.2c0 .5.4.9.9.9H12" />
      <path d="M12 7.5 17.5 11v3.2c0 .5-.4.9-.9.9H12" />
    </g>
  </svg>
);

const Grok = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <rect width="24" height="24" rx="5" fill="#000" />
    <g fill="#fff">
      <path d="M7 18l7.4-9.2 1.9 1.5L9.4 18z" />
      <path d="M13.6 18l2.9-3.6 1.9 1.5L16.4 18z" />
      <path d="M14.4 7.6 16.7 5h1.6l-2.6 3z" />
    </g>
  </svg>
);

const DeepSeek = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <rect width="24" height="24" rx="5" fill="#4D6BFE" />
    <path fill="#fff" d="M4.5 11.5c2.2.1 3.4-1.9 5.6-1.9 1.6 0 2.3 1.4 4 1.4.9 0 1.6-.5 2.4-1.3-.2 1.1-.9 2-1.8 2.5.6.2 1.3.2 2.3-.1-1 1.9-3.3 3.3-6.1 3.3-3.2 0-5.9-1.6-6.4-3.8l1.4.3z" />
    <circle cx="9.2" cy="11.6" r=".9" fill="#4D6BFE" />
  </svg>
);

const Slack = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <path fill="#36C5F0" d="M9 3.5A2.5 2.5 0 1 0 6.5 6H9z" /><path fill="#2EB67D" d="M20.5 9A2.5 2.5 0 1 0 18 6.5V9z" />
    <path fill="#ECB22E" d="M15 20.5A2.5 2.5 0 1 0 17.5 18H15z" /><path fill="#E01E5A" d="M3.5 15A2.5 2.5 0 1 0 6 17.5V15z" />
  </svg>
);

const InstagramCam = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <defs><linearGradient id="ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FEDA75" /><stop offset=".5" stopColor="#FA7E1E" /><stop offset="1" stopColor="#D62976" /></linearGradient></defs>
    <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig)" />
    <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.4" fill="#fff" />
  </svg>
);

/** name → glyph. */
const GLYPH: Record<string, (s: number) => React.ReactNode> = {
  googleads: (s) => <GoogleG s={s} />, google: (s) => <GoogleG s={s} />, googlepartner: (s) => <GoogleG s={s} />,
  performancemax: (s) => <PMaxSpark s={s} />,
  metaads: (s) => <MetaInfinity s={s} />, metaadsmanager: (s) => <MetaInfinity s={s} />, metabusinesspartner: (s) => <MetaInfinity s={s} />,
  youtubeads: (s) => <YouTube s={s} />, youtube: (s) => <YouTube s={s} />,
  microsoftads: (s) => <MicrosoftSquares s={s} />,
  tiktokads: (s) => <TikTok s={s} />, tiktok: (s) => <TikTok s={s} />,
  linkedinads: (s) => <LinkedIn s={s} />, linkedin: (s) => <LinkedIn s={s} />,
  pinterestads: (s) => <Pinterest s={s} />, pinterest: (s) => <Pinterest s={s} />,
  googleanalytics4: (s) => <GA4 s={s} />, ga4: (s) => <GA4 s={s} />, googleanalytics: (s) => <GA4 s={s} />,
  googletagmanager: (s) => <GTM s={s} />, gtm: (s) => <GTM s={s} />, tagmanager: (s) => <GTM s={s} />,
  lookerstudio: (s) => <Looker s={s} />, looker: (s) => <Looker s={s} />,
  searchconsole: (s) => <SearchConsole s={s} />, googlesearchconsole: (s) => <SearchConsole s={s} />,
  merchantcenter: (s) => <MerchantCenter s={s} />, googlemerchantcenter: (s) => <MerchantCenter s={s} />,
  microsoftclarity: (s) => <Clarity s={s} />, clarity: (s) => <Clarity s={s} />,
  chatgpt: (s) => <OpenAI s={s} />, openai: (s) => <OpenAI s={s} />,
  claude: (s) => <Claude s={s} />, claudecode: (s) => <Claude s={s} />, anthropic: (s) => <Claude s={s} />,
  gemini: (s) => <Gemini s={s} />, googlegemini: (s) => <Gemini s={s} />,
  perplexity: (s) => <Perplexity s={s} />,
  grok: (s) => <Grok s={s} />, xai: (s) => <Grok s={s} />,
  deepseek: (s) => <DeepSeek s={s} />,
  slack: (s) => <Slack s={s} />,
  instagram: (s) => <InstagramCam s={s} />,
};

/** Brands whose glyph already carries its own coloured square — render edge to
 *  edge (no white chip padding). Everything else sits centered on a white chip. */
const FULL_BLEED = new Set([
  "linkedinads", "linkedin", "pinterestads", "pinterest", "tiktokads", "tiktok",
  "microsoftclarity", "clarity", "perplexity", "grok", "xai", "deepseek",
  "slack", "instagram",
]);

/**
 * Render a brand mark for `name` at `size` px. Known brands render their real
 * glyph on a light chip (or edge-to-edge when the glyph owns its background);
 * unknown tools fall back to a brand-coloured tile with initials.
 */
export function BrandIcon({ name, size = 20, radius = 6 }: { name: string; size?: number; radius?: number }) {
  const k = key(name);
  const glyph = GLYPH[k];

  if (glyph) {
    const fullBleed = FULL_BLEED.has(k);
    return (
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          borderRadius: radius,
          flexShrink: 0,
          background: fullBleed ? "transparent" : "#ffffff",
          border: fullBleed ? "none" : "1px solid rgba(20,23,14,.1)",
          overflow: "hidden",
        }}
      >
        {glyph(fullBleed ? size : Math.round(size * 0.72))}
      </span>
    );
  }

  const color = COLOR[k] ?? hashColor(k);
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: radius,
        flexShrink: 0,
        background: color,
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <span style={{ fontFamily: "var(--font-mono),monospace", fontWeight: 800, fontSize: Math.round(size * 0.4), lineHeight: 1 }}>{initials(name)}</span>
    </span>
  );
}

/** Deterministic pleasant colour for tools without a defined brand colour. */
function hashColor(k: string) {
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) % 360;
  return `hsl(${h} 55% 42%)`;
}
