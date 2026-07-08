/* ============================================================================
   BrandIcon — a compact, recognizable mark for each platform / tool we name.
   No third-party assets are bundled: the most iconic brands get a hand-built
   SVG glyph; everything else renders a brand-coloured rounded tile with its
   initials. Pure (server-safe). Used by the homepage stack + the logo pills.
   ========================================================================== */

type GlyphProps = { s: number };

/** Brand fill colours (accurate-ish) for the tile fallback + some glyphs. */
const COLOR: Record<string, string> = {
  googleads: "#ffffff", google: "#ffffff", googlepartner: "#ffffff",
  googleanalytics4: "#E8710A", ga4: "#E8710A",
  googletagmanager: "#246FDB", gtm: "#246FDB",
  lookerstudio: "#4285F4", searchconsole: "#4285F4", merchantcenter: "#34A853",
  performancemax: "#4285F4",
  metaads: "#0866FF", metaadsmanager: "#0866FF", metabusinesspartner: "#0866FF",
  facebook: "#1877F2", instagram: "#ffffff",
  youtubeads: "#FF0000", youtube: "#FF0000",
  microsoftads: "#ffffff", microsoftclarity: "#0078D4", clarity: "#0078D4",
  tiktokads: "#000000", tiktok: "#010101",
  linkedinads: "#0A66C2", linkedin: "#0A66C2",
  pinterestads: "#E60023", pinterest: "#E60023",
  semrush: "#FF642D", ahrefs: "#054ADA", screamingfrog: "#34A853",
  surferseo: "#1A8CFF", frase: "#6C5CE7",
  optmyzr: "#1FA8E0", adalysis: "#2B6CB0", madgicx: "#6C2BD9", revealbot: "#0EA5E9",
  foreplay: "#111111", adcreativeai: "#7C3AED",
  chatgpt: "#10A37F", openai: "#10A37F", claude: "#D97757", claudecode: "#D97757",
  gemini: "#1C69FF", perplexity: "#20808D", grok: "#111111", deepseek: "#4D6BFE",
  midjourney: "#111111", adobefirefly: "#FF3366", firefly: "#FF3366",
  runway: "#111111", heygen: "#5B4DF5", elevenlabs: "#111111", capcut: "#111111", descript: "#2D6BFF",
  zapier: "#FF4F00", make: "#6D00CC", n8n: "#EA4B71", airtable: "#1F6FEB", supermetrics: "#EE4823", slack: "#ffffff",
  claudecode2: "#D97757", cursor: "#111111", v0: "#111111", github: "#181717", vercel: "#111111", nextjs: "#111111",
  bbbaccredited: "#0A5C99",
};

const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

function initials(name: string) {
  const clean = name.replace(/[^A-Za-z0-9 ]/g, " ").split(" ").filter(Boolean);
  if (clean.length >= 2 && name.length > 5) return (clean[0][0] + clean[1][0]).toUpperCase();
  return name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
}

/* ── Iconic brand glyphs (white tile or coloured tile) ────────────────────── */
const GoogleG = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
    <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z" />
    <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
  </svg>
);
const MicrosoftSquares = ({ s }: GlyphProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
    <rect x="2" y="2" width="9" height="9" fill="#F25022" /><rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
    <rect x="2" y="13" width="9" height="9" fill="#00A4EF" /><rect x="13" y="13" width="9" height="9" fill="#FFB900" />
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

/** name → glyph node (rendered centered on the tile). */
const GLYPH: Record<string, (s: number) => React.ReactNode> = {
  googleads: (s) => <GoogleG s={s} />, google: (s) => <GoogleG s={s} />, googlepartner: (s) => <GoogleG s={s} />,
  performancemax: (s) => <GoogleG s={s} />,
  microsoftads: (s) => <MicrosoftSquares s={s} />,
  slack: (s) => <Slack s={s} />,
  instagram: (s) => <InstagramCam s={s} />,
};

/** Simple white letter/symbol glyphs drawn on a coloured tile. */
const SYMBOL: Record<string, string> = {
  facebook: "f", linkedinads: "in", linkedin: "in", pinterestads: "P", pinterest: "P",
  youtubeads: "▶", youtube: "▶", tiktokads: "♪", tiktok: "♪", metaads: "∞", metaadsmanager: "∞", metabusinesspartner: "∞",
  vercel: "▲", nextjs: "N", github: "GH", claude: "✳", claudecode: "✳", openai: "✦", chatgpt: "✦", gemini: "✦",
};

/**
 * Render a brand mark for `name` at `size` px. White-tile brands (Google,
 * Microsoft, Instagram, Slack) keep a light tile; everything else gets a
 * brand-coloured tile with a white glyph / initials.
 */
export function BrandIcon({ name, size = 20, radius = 6 }: { name: string; size?: number; radius?: number }) {
  const k = key(name);
  const glyph = GLYPH[k];
  const color = COLOR[k] ?? hashColor(k);
  const lightTile = color === "#ffffff";
  const inner = Math.round(size * 0.66);

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
        background: lightTile ? "#ffffff" : color,
        border: lightTile ? "1px solid rgba(20,23,14,.12)" : "none",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {glyph ? (
        glyph(inner)
      ) : SYMBOL[k] ? (
        <span style={{ fontFamily: "var(--font-display),sans-serif", fontWeight: 800, fontSize: Math.round(size * 0.5), lineHeight: 1 }}>{SYMBOL[k]}</span>
      ) : (
        <span style={{ fontFamily: "var(--font-mono),monospace", fontWeight: 800, fontSize: Math.round(size * 0.4), lineHeight: 1, letterSpacing: 0 }}>{initials(name)}</span>
      )}
    </span>
  );
}

/** Deterministic pleasant colour for tools without a defined brand colour. */
function hashColor(k: string) {
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) % 360;
  return `hsl(${h} 55% 42%)`;
}
