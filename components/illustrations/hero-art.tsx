import type { LucideIcon } from "lucide-react";

/* ============================================================================
   Hero illustrations — bespoke flat-vector scenes in the handoff palette.
   Pure SVG (no client JS), so they stay out of the client bundle and render on
   the server. Palette: cream #f1efe3 / ink #14170e linework / lime #ceff3a /
   olive #6f7d22 / coral #f26a2b (waste only). Each scene is content-specific so
   every page's hero "goes with" its subject while blending with the theme.
   ========================================================================== */

const INK = "#14170e", LIME = "#ceff3a", OLIVE = "#6f7d22", CORAL = "#f26a2b";
const CARD = "#fbfaf2", LINE = "#dcdac8", DIM = "#83856f";

/** Shared responsive SVG frame. */
function Art({ children, label, vb = "0 0 560 460" }: { children: React.ReactNode; label: string; vb?: string }) {
  return (
    <svg viewBox={vb} role="img" aria-label={label} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="limeFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={LIME} stopOpacity=".5" />
          <stop offset="1" stopColor={LIME} stopOpacity="0" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="22" stdDeviation="26" floodColor="#14170e" floodOpacity="0.14" />
        </filter>
      </defs>
      {children}
    </svg>
  );
}

/** Small floating stat chip (cream, ink text) reused across scenes. */
function Chip({ x, y, label, value, accent = OLIVE }: { x: number; y: number; label: string; value: string; accent?: string }) {
  return (
    <g transform={`translate(${x} ${y})`} filter="url(#softShadow)">
      <rect width="156" height="58" rx="15" fill="#f1efe3" />
      <text x="16" y="24" fontFamily="var(--font-mono),monospace" fontSize="9" fontWeight="600" letterSpacing="1" fill="#6a6c5a" style={{ textTransform: "uppercase" }}>{label}</text>
      <text x="16" y="46" fontFamily="var(--font-display),sans-serif" fontSize="22" fontWeight="900" fill={INK}>{value}</text>
      <circle cx="140" cy="20" r="5" fill={accent} />
    </g>
  );
}

/* ── Google Ads — search results + sponsored ad + rising bars ─────────────── */
export function GoogleAdsArt() {
  return (
    <Art label="Google search results with a sponsored ad and rising performance">
      <rect x="40" y="40" width="430" height="360" rx="26" fill={CARD} stroke={LINE} filter="url(#softShadow)" />
      {/* search bar */}
      <rect x="68" y="72" width="374" height="46" rx="23" fill="#fff" stroke={LINE} />
      <circle cx="96" cy="95" r="9" fill="none" stroke={INK} strokeWidth="2.5" />
      <line x1="103" y1="102" x2="111" y2="110" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="124" y="89" width="150" height="12" rx="6" fill={INK} opacity=".8" />
      {/* sponsored ad result */}
      <rect x="68" y="140" width="374" height="92" rx="16" fill="#eef2dd" stroke="#cfe39a" />
      <rect x="86" y="158" width="40" height="16" rx="8" fill={LIME} />
      <text x="106" y="170" textAnchor="middle" fontFamily="var(--font-mono),monospace" fontSize="9" fontWeight="700" fill={INK}>AD</text>
      <rect x="136" y="159" width="150" height="13" rx="6" fill={OLIVE} />
      <rect x="86" y="188" width="320" height="9" rx="4.5" fill={INK} opacity=".35" />
      <rect x="86" y="205" width="250" height="9" rx="4.5" fill={INK} opacity=".22" />
      {/* organic results */}
      {[252, 300].map((y) => (
        <g key={y}>
          <rect x="86" y={y} width="170" height="11" rx="5.5" fill={INK} opacity=".5" />
          <rect x="86" y={y + 20} width="320" height="8" rx="4" fill={INK} opacity=".18" />
        </g>
      ))}
      {/* cursor */}
      <g transform="translate(372 196)">
        <path d="M0 0 L0 26 L7 19 L12 30 L17 28 L12 17 L22 17 Z" fill={INK} stroke="#fff" strokeWidth="1.5" />
      </g>
      {/* rising bars chip */}
      <g transform="translate(360 296)" filter="url(#softShadow)">
        <rect width="150" height="118" rx="18" fill={INK} />
        <text x="18" y="30" fontFamily="var(--font-mono),monospace" fontSize="9" fontWeight="600" letterSpacing="1" fill="#9a9b88" style={{ textTransform: "uppercase" }}>Conversions</text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={18 + i * 32} y={94 - (18 + i * 16)} width="20" height={18 + i * 16} rx="4" fill={i === 3 ? LIME : "#3a4127"} />
        ))}
      </g>
      <Chip x={300} y={28} label="Cost / lead" value="↓ 38%" accent={LIME} />
    </Art>
  );
}

/* ── Meta Ads — phone with social post + engagement ───────────────────────── */
export function MetaAdsArt() {
  return (
    <Art label="Facebook and Instagram ad on a phone with engagement">
      {/* ambient card behind */}
      <rect x="250" y="90" width="250" height="300" rx="22" fill={CARD} stroke={LINE} />
      <rect x="276" y="118" width="120" height="11" rx="5.5" fill={INK} opacity=".3" />
      <rect x="276" y="142" width="200" height="8" rx="4" fill={INK} opacity=".16" />
      <rect x="276" y="160" width="180" height="8" rx="4" fill={INK} opacity=".16" />
      <rect x="276" y="210" width="200" height="120" rx="14" fill="#eef2dd" />
      {/* phone */}
      <g filter="url(#softShadow)">
        <rect x="70" y="56" width="210" height="352" rx="30" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <rect x="118" y="70" width="114" height="14" rx="7" fill={INK} />
        {/* post header */}
        <circle cx="104" cy="120" r="16" fill={LIME} />
        <rect x="128" y="110" width="80" height="10" rx="5" fill={INK} opacity=".7" />
        <rect x="128" y="126" width="50" height="8" rx="4" fill={INK} opacity=".3" />
        <rect x="200" y="108" width="44" height="16" rx="8" fill="#eef2dd" />
        <text x="222" y="120" textAnchor="middle" fontFamily="var(--font-mono),monospace" fontSize="8" fontWeight="700" fill={OLIVE}>SPON</text>
        {/* image */}
        <rect x="88" y="150" width="174" height="140" rx="12" fill={INK} />
        <circle cx="175" cy="220" r="26" fill="none" stroke={LIME} strokeWidth="3" />
        <path d="M168 207 L168 233 L190 220 Z" fill={LIME} />
        {/* reactions */}
        <path d="M104 318 c -8 -9 -22 -2 -16 9 c 3 6 16 14 16 14 c 0 0 13 -8 16 -14 c 6 -11 -8 -18 -16 -9 z" fill={CORAL} />
        <rect x="128" y="318" width="40" height="10" rx="5" fill={INK} opacity=".4" />
        <rect x="88" y="344" width="174" height="38" rx="10" fill={LIME} />
        <text x="175" y="368" textAnchor="middle" fontFamily="var(--font-display),sans-serif" fontSize="13" fontWeight="800" fill={INK}>Get a free quote</text>
      </g>
      <Chip x={356} y={40} label="Cost / lead" value="$18.40" accent={LIME} />
      <Chip x={360} y={332} label="Leads / week" value="64" accent={OLIVE} />
    </Art>
  );
}

/* ── SEO — SERP ranking climb + local pack ────────────────────────────────── */
export function SeoArt() {
  return (
    <Art label="Search rankings climbing with local map pack">
      <rect x="40" y="48" width="340" height="364" rx="24" fill={CARD} stroke={LINE} filter="url(#softShadow)" />
      {/* ranking rows, #1 highlighted */}
      {[{ y: 80, r: "1", on: true }, { y: 148, r: "2", on: false }, { y: 216, r: "3", on: false }, { y: 284, r: "4", on: false }].map((p) => (
        <g key={p.r}>
          <rect x="66" y={p.y} width="288" height="56" rx="14" fill={p.on ? "#eef2dd" : "#fff"} stroke={p.on ? "#cfe39a" : LINE} />
          <circle cx="92" cy={p.y + 28} r="13" fill={p.on ? LIME : "#eceadb"} />
          <text x="92" y={p.y + 33} textAnchor="middle" fontFamily="var(--font-display),sans-serif" fontSize="13" fontWeight="900" fill={INK}>{p.r}</text>
          <rect x="116" y={p.y + 16} width={p.on ? 150 : 120} height="10" rx="5" fill={INK} opacity={p.on ? ".7" : ".4"} />
          <rect x="116" y={p.y + 34} width="200" height="7" rx="3.5" fill={INK} opacity=".18" />
        </g>
      ))}
      {/* climb arrow */}
      <path d="M330 300 C 360 250, 360 150, 330 96" fill="none" stroke={OLIVE} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9" />
      <path d="M330 96 l -9 12 l 18 0 z" fill={OLIVE} />
      {/* local pack pin card */}
      <g transform="translate(360 250)" filter="url(#softShadow)">
        <rect width="160" height="150" rx="18" fill={INK} />
        <rect x="16" y="16" width="128" height="74" rx="10" fill="#2a3019" />
        {/* mini map roads */}
        <path d="M16 60 H144 M70 16 V90" stroke="#3f472a" strokeWidth="3" />
        <path d="M80 56 c 0 -16 24 -16 24 0 c 0 12 -12 22 -12 22 c 0 0 -12 -10 -12 -22 z" fill={LIME} />
        <circle cx="92" cy="56" r="4" fill={INK} />
        <text x="16" y="116" fontFamily="var(--font-mono),monospace" fontSize="9" fontWeight="600" letterSpacing="1" fill="#9a9b88" style={{ textTransform: "uppercase" }}>Map pack</text>
        <text x="16" y="136" fontFamily="var(--font-display),sans-serif" fontSize="17" fontWeight="900" fill={LIME}>#1 local</text>
      </g>
      <Chip x={250} y={28} label="Organic clicks" value="↑ 3.2x" accent={LIME} />
    </Art>
  );
}

/* ── Creative — stacked media frames + variants ───────────────────────────── */
export function CreativeArt() {
  return (
    <Art label="Stacked ad creative variants — static, carousel and video">
      {/* back frames */}
      <rect x="120" y="70" width="250" height="300" rx="20" fill="#eef2dd" stroke="#cfe39a" transform="rotate(-7 245 220)" />
      <rect x="170" y="80" width="250" height="300" rx="20" fill={CARD} stroke={LINE} transform="rotate(5 295 230)" />
      {/* front frame */}
      <g filter="url(#softShadow)">
        <rect x="150" y="70" width="260" height="320" rx="22" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <rect x="174" y="94" width="212" height="150" rx="12" fill={INK} />
        {/* play */}
        <circle cx="280" cy="169" r="30" fill="none" stroke={LIME} strokeWidth="3.5" />
        <path d="M271 153 L271 185 L298 169 Z" fill={LIME} />
        <rect x="174" y="262" width="150" height="13" rx="6.5" fill={INK} opacity=".75" />
        <rect x="174" y="286" width="212" height="9" rx="4.5" fill={INK} opacity=".25" />
        <rect x="174" y="304" width="180" height="9" rx="4.5" fill={INK} opacity=".25" />
        <rect x="174" y="332" width="100" height="34" rx="10" fill={LIME} />
        <text x="224" y="354" textAnchor="middle" fontFamily="var(--font-display),sans-serif" fontSize="12" fontWeight="800" fill={INK}>Shop now</text>
        {/* sparkle */}
        <path d="M372 326 l 5 14 l 14 5 l -14 5 l -5 14 l -5 -14 l -14 -5 l 14 -5 z" fill={OLIVE} />
      </g>
      <Chip x={350} y={40} label="Variants / week" value="24" accent={LIME} />
      <Chip x={60} y={300} label="Win rate" value="↑ 2.4x" accent={OLIVE} />
    </Art>
  );
}

/* ── Web design — browser wireframe + mobile + conversion ─────────────────── */
export function WebDesignArt() {
  return (
    <Art label="Conversion-focused landing page on desktop and mobile">
      {/* browser */}
      <g filter="url(#softShadow)">
        <rect x="40" y="64" width="376" height="320" rx="20" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <rect x="40" y="64" width="376" height="40" rx="20" fill={CARD} />
        <rect x="40" y="92" width="376" height="12" fill={CARD} />
        <circle cx="64" cy="84" r="5" fill={CORAL} /><circle cx="82" cy="84" r="5" fill={OLIVE} /><circle cx="100" cy="84" r="5" fill={LIME} />
        <rect x="128" y="77" width="260" height="14" rx="7" fill="#fff" stroke={LINE} />
        {/* hero content */}
        <rect x="68" y="130" width="150" height="16" rx="8" fill={INK} opacity=".8" />
        <rect x="68" y="156" width="120" height="16" rx="8" fill={OLIVE} />
        <rect x="68" y="188" width="200" height="9" rx="4.5" fill={INK} opacity=".22" />
        <rect x="68" y="204" width="170" height="9" rx="4.5" fill={INK} opacity=".22" />
        <rect x="68" y="232" width="116" height="38" rx="11" fill={LIME} />
        <text x="126" y="256" textAnchor="middle" fontFamily="var(--font-display),sans-serif" fontSize="12" fontWeight="800" fill={INK}>Book now</text>
        <rect x="288" y="130" width="104" height="140" rx="12" fill="#eef2dd" stroke="#cfe39a" />
        <circle cx="340" cy="172" r="20" fill={LIME} />
        <path d="M331 172 l 7 7 l 12 -14" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="300" y="206" width="80" height="9" rx="4.5" fill={INK} opacity=".3" />
        <rect x="300" y="222" width="60" height="9" rx="4.5" fill={INK} opacity=".2" />
        {/* footer row */}
        <rect x="68" y="300" width="324" height="60" rx="12" fill={CARD} stroke={LINE} />
        <rect x="86" y="318" width="80" height="9" rx="4.5" fill={INK} opacity=".25" />
        <rect x="86" y="336" width="120" height="9" rx="4.5" fill={INK} opacity=".18" />
      </g>
      {/* mobile */}
      <g filter="url(#softShadow)">
        <rect x="388" y="180" width="120" height="220" rx="22" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <rect x="408" y="200" width="80" height="50" rx="8" fill={INK} />
        <rect x="408" y="262" width="80" height="8" rx="4" fill={INK} opacity=".3" />
        <rect x="408" y="278" width="56" height="8" rx="4" fill={INK} opacity=".2" />
        <rect x="408" y="300" width="80" height="30" rx="9" fill={LIME} />
      </g>
      <Chip x={300} y={36} label="Conv. rate" value="↑ 2.1x" accent={LIME} />
    </Art>
  );
}

/* ── CRM — pipeline + automation + speed-to-lead ──────────────────────────── */
export function CrmArt() {
  return (
    <Art label="CRM pipeline with automated lead follow-up">
      <rect x="40" y="56" width="480" height="350" rx="24" fill={CARD} stroke={LINE} filter="url(#softShadow)" />
      <text x="66" y="92" fontFamily="var(--font-mono),monospace" fontSize="10" fontWeight="700" letterSpacing="1.5" fill={DIM} style={{ textTransform: "uppercase" }}>Lead pipeline</text>
      {/* 3 columns */}
      {[{ x: 66, t: "New", n: 3, on: false }, { x: 226, t: "Contacted", n: 2, on: false }, { x: 386, t: "Booked", n: 1, on: true }].map((col) => (
        <g key={col.t}>
          <rect x={col.x} y={108} width="134" height="278" rx="14" fill={col.on ? "#eef2dd" : "#fff"} stroke={col.on ? "#cfe39a" : LINE} />
          <text x={col.x + 16} y={132} fontFamily="var(--font-mono),monospace" fontSize="9" fontWeight="700" letterSpacing="1" fill={col.on ? OLIVE : DIM} style={{ textTransform: "uppercase" }}>{col.t}</text>
          <circle cx={col.x + 118} cy={128} r="9" fill={col.on ? LIME : "#eceadb"} />
          <text x={col.x + 118} y={132} textAnchor="middle" fontFamily="var(--font-display),sans-serif" fontSize="10" fontWeight="900" fill={INK}>{col.n}</text>
          {Array.from({ length: col.n }).map((_, i) => (
            <g key={i} transform={`translate(${col.x + 14} ${148 + i * 56})`}>
              <rect width="106" height="44" rx="10" fill="#fff" stroke={LINE} />
              <circle cx="20" cy="22" r="10" fill={col.on ? LIME : "#eef2dd"} />
              <rect x="38" y="13" width="54" height="8" rx="4" fill={INK} opacity=".5" />
              <rect x="38" y="27" width="38" height="6" rx="3" fill={INK} opacity=".25" />
            </g>
          ))}
        </g>
      ))}
      {/* automation bolt between cols */}
      <g transform="translate(196 220)"><path d="M14 0 L0 20 L10 20 L4 38 L22 14 L12 14 Z" fill={CORAL} /></g>
      <g transform="translate(356 220)"><path d="M14 0 L0 20 L10 20 L4 38 L22 14 L12 14 Z" fill={CORAL} /></g>
      <Chip x={360} y={30} label="Speed to lead" value="< 5 min" accent={LIME} />
    </Art>
  );
}

/* ── Services index — toolkit dashboard ───────────────────────────────────── */
export function ServicesArt() {
  return (
    <Art label="One accountable team across every channel">
      <g filter="url(#softShadow)">
        <rect x="80" y="60" width="400" height="340" rx="24" fill={INK} />
        <text x="108" y="100" fontFamily="var(--font-mono),monospace" fontSize="10" fontWeight="700" letterSpacing="1.5" fill="#9a9b88" style={{ textTransform: "uppercase" }}>Full-funnel growth</text>
        {/* metric row */}
        {[{ x: 108, l: "Leads", v: "312" }, { x: 246, l: "Booked", v: "148" }, { x: 384, l: "ROAS", v: "4.8x" }].map((m) => (
          <g key={m.l}>
            <rect x={m.x - 4} y={114} width="84" height="58" rx="12" fill="#222717" />
            <text x={m.x + 12} y={138} fontFamily="var(--font-mono),monospace" fontSize="8" fontWeight="600" letterSpacing=".5" fill="#8a8b78" style={{ textTransform: "uppercase" }}>{m.l}</text>
            <text x={m.x + 12} y={160} fontFamily="var(--font-display),sans-serif" fontSize="20" fontWeight="900" fill={LIME}>{m.v}</text>
          </g>
        ))}
        {/* chart */}
        <rect x="104" y="190" width="352" height="120" rx="14" fill="#222717" />
        <path d="M124 286 L176 274 L228 278 L280 248 L332 232 L384 206 L436 178 L436 290 L124 290 Z" fill="url(#limeFade)" />
        <path d="M124 286 L176 274 L228 278 L280 248 L332 232 L384 206 L436 178" fill="none" stroke={LIME} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* channel tags */}
        {["Google", "Meta", "SEO", "CRM"].map((t, i) => (
          <g key={t} transform={`translate(${104 + i * 90} 326)`}>
            <rect width="80" height="46" rx="11" fill="#222717" />
            <circle cx="18" cy="23" r="7" fill={LIME} />
            <text x="32" y="27" fontFamily="var(--font-mono),monospace" fontSize="9" fontWeight="600" fill="#e7e6d6">{t}</text>
          </g>
        ))}
      </g>
      <Chip x={20} y={92} label="Wasted spend" value="↓ 41%" accent={LIME} />
      <Chip x={384} y={350} label="One team" value="Every channel" accent={OLIVE} />
    </Art>
  );
}

/* ── Industries index — storefronts ───────────────────────────────────────── */
export function IndustriesArt() {
  return (
    <Art label="Local service-business storefronts across industries">
      <line x1="40" y1="360" x2="520" y2="360" stroke={INK} strokeWidth="2" opacity=".5" />
      {[{ x: 60, h: 150, on: false }, { x: 200, h: 200, on: true }, { x: 360, h: 170, on: false }].map((b, i) => (
        <g key={i} filter="url(#softShadow)">
          <rect x={b.x} y={360 - b.h} width="120" height={b.h} rx="10" fill={b.on ? "#eef2dd" : CARD} stroke={b.on ? "#cfe39a" : LINE} />
          {/* awning */}
          <path d={`M${b.x - 6} ${360 - b.h} h132 v22 l -22 14 v-14 h-22 v14 l-22 -14 v14 h-22 v-14 l-22 14 z`} fill={b.on ? LIME : "#e3e1d2"} />
          {/* door + windows */}
          <rect x={b.x + 44} y={360 - 70} width="32" height="70" rx="4" fill={b.on ? OLIVE : "#cfcdba"} />
          <rect x={b.x + 14} y={360 - b.h + 56} width="28" height="28" rx="4" fill="#fff" stroke={LINE} />
          <rect x={b.x + 78} y={360 - b.h + 56} width="28" height="28" rx="4" fill="#fff" stroke={LINE} />
          {b.on && <circle cx={b.x + 60} cy={360 - b.h - 30} r="16" fill={LIME} stroke={INK} strokeWidth="2" />}
          {b.on && <path d={`M${b.x + 52} ${360 - b.h - 30} l 6 6 l 12 -12`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
        </g>
      ))}
      <Chip x={350} y={60} label="Playbooks for" value="15 verticals" accent={LIME} />
      <Chip x={40} y={70} label="Niche depth" value="Local lead-gen" accent={OLIVE} />
    </Art>
  );
}

/* ── Locations index — map with pins ──────────────────────────────────────── */
export function LocationsArt() {
  return (
    <Art label="Service-area map across the GTA and Ontario">
      <g filter="url(#softShadow)">
        <rect x="50" y="56" width="460" height="348" rx="24" fill="#eef2dd" stroke="#cfe39a" />
        {/* roads */}
        <path d="M50 200 H510 M50 300 H510 M170 56 V404 M330 56 V404" stroke="#cfe39a" strokeWidth="6" />
        <path d="M50 130 C 200 150, 320 110, 510 150" stroke="#fff" strokeWidth="8" fill="none" />
        {/* pins */}
        {[{ x: 170, y: 200, on: true }, { x: 330, y: 130 }, { x: 250, y: 300 }, { x: 410, y: 240 }, { x: 110, y: 330 }].map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <ellipse cx="0" cy="6" rx="10" ry="4" fill={INK} opacity=".15" />
            <path d="M0 -34 C -16 -34 -22 -20 -14 -8 C -8 0 0 6 0 6 C 0 6 8 0 14 -8 C 22 -20 16 -34 0 -34 Z" fill={p.on ? LIME : INK} stroke={INK} strokeWidth={p.on ? 2 : 0} />
            <circle cx="0" cy="-20" r="6" fill={p.on ? INK : LIME} />
          </g>
        ))}
      </g>
      <Chip x={350} y={40} label="GTA + Ontario" value="Local + national" accent={LIME} />
      <Chip x={66} y={330} label="Toronto" value="Live now" accent={OLIVE} />
    </Art>
  );
}

/* ── Tools index — calculator + gauge ─────────────────────────────────────── */
export function ToolsArt() {
  return (
    <Art label="Free ROI calculators and AI marketing tools">
      {/* calculator */}
      <g filter="url(#softShadow)">
        <rect x="70" y="70" width="200" height="320" rx="22" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <rect x="92" y="92" width="156" height="56" rx="10" fill={INK} />
        <text x="234" y="130" textAnchor="end" fontFamily="var(--font-display),sans-serif" fontSize="24" fontWeight="900" fill={LIME}>4.8x</text>
        {Array.from({ length: 12 }).map((_, i) => {
          const r = Math.floor(i / 3), c = i % 3; const on = i === 11;
          return <rect key={i} x={92 + c * 54} y={170 + r * 50} width="44" height="40" rx="9" fill={on ? LIME : "#f1efe3"} stroke={LINE} />;
        })}
      </g>
      {/* gauge */}
      <g filter="url(#softShadow)">
        <rect x="290" y="120" width="220" height="220" rx="24" fill={CARD} stroke={LINE} />
        <path d="M330 290 A 70 70 0 1 1 470 290" fill="none" stroke="#e3e1d2" strokeWidth="16" strokeLinecap="round" />
        <path d="M330 290 A 70 70 0 0 1 446 238" fill="none" stroke={LIME} strokeWidth="16" strokeLinecap="round" />
        <circle cx="400" cy="290" r="9" fill={INK} />
        <line x1="400" y1="290" x2="446" y2="244" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <text x="400" y="324" textAnchor="middle" fontFamily="var(--font-mono),monospace" fontSize="9" fontWeight="600" letterSpacing="1" fill={DIM} style={{ textTransform: "uppercase" }}>ROI score</text>
      </g>
      <Chip x={360} y={70} label="No sign-up" value="Free tools" accent={LIME} />
    </Art>
  );
}

/* ── Results index — big upward chart + before/after ──────────────────────── */
export function ResultsArt() {
  return (
    <Art label="Results that show up in revenue — before and after">
      <g filter="url(#softShadow)">
        <rect x="50" y="60" width="460" height="340" rx="24" fill={CARD} stroke={LINE} />
        <text x="78" y="98" fontFamily="var(--font-mono),monospace" fontSize="10" fontWeight="700" letterSpacing="1.5" fill={DIM} style={{ textTransform: "uppercase" }}>Revenue vs wasted spend</text>
        <path d="M78 320 L138 308 L198 312 L258 280 L318 262 L378 224 L438 176 L482 150 L482 330 L78 330 Z" fill="url(#limeFade)" />
        <path d="M78 320 L138 308 L198 312 L258 280 L318 262 L378 224 L438 176 L482 150" fill="none" stroke={LIME} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M78 326 L138 325 L198 326 L258 323 L318 324 L378 325 L438 326 L482 326" fill="none" stroke={CORAL} strokeWidth="2" strokeDasharray="5 5" opacity=".7" />
        {/* before/after bars */}
        <rect x="92" y="250" width="34" height="76" rx="6" fill="#cfcdba" />
        <rect x="134" y="178" width="34" height="148" rx="6" fill={LIME} />
        <text x="109" y="344" textAnchor="middle" fontFamily="var(--font-mono),monospace" fontSize="8" fill={DIM} style={{ textTransform: "uppercase" }}>Before</text>
        <text x="151" y="344" textAnchor="middle" fontFamily="var(--font-mono),monospace" fontSize="8" fontWeight="700" fill={OLIVE} style={{ textTransform: "uppercase" }}>After</text>
      </g>
      <Chip x={356} y={36} label="Avg. ROAS" value="4.8x" accent={LIME} />
      <Chip x={360} y={324} label="Booked jobs" value="↑ 2.6x" accent={OLIVE} />
    </Art>
  );
}

/* ── Blog index — article sheet + insight ─────────────────────────────────── */
export function BlogArt() {
  return (
    <Art label="Practical marketing guides and resources">
      <g filter="url(#softShadow)">
        <rect x="70" y="56" width="330" height="350" rx="20" fill="#fff" stroke={LINE} />
        <rect x="100" y="86" width="60" height="16" rx="8" fill={LIME} />
        <rect x="100" y="118" width="240" height="18" rx="9" fill={INK} opacity=".8" />
        <rect x="100" y="144" width="180" height="18" rx="9" fill={INK} opacity=".55" />
        <rect x="100" y="184" width="270" height="96" rx="12" fill="#eef2dd" />
        <path d="M140 256 L180 224 L210 244 L250 208 L290 236" fill="none" stroke={OLIVE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {[300, 318, 336, 354].map((y, i) => <rect key={y} x="100" y={y} width={i === 3 ? 160 : 270} height="8" rx="4" fill={INK} opacity=".18" />)}
      </g>
      {/* insight bulb chip */}
      <g transform="translate(338 300)" filter="url(#softShadow)">
        <circle cx="40" cy="40" r="40" fill={INK} />
        <path d="M40 18 a 16 16 0 0 1 10 28 v 6 h -20 v -6 a 16 16 0 0 1 10 -28 z" fill={LIME} />
        <rect x="33" y="56" width="14" height="6" rx="3" fill={LIME} />
      </g>
      <Chip x={300} y={36} label="No fluff" value="Practical guides" accent={LIME} />
    </Art>
  );
}

/* ── About — founders + principles ────────────────────────────────────────── */
export function AboutArt() {
  return (
    <Art label="Founder-led, AI-augmented, accountable team">
      <g filter="url(#softShadow)">
        <rect x="60" y="70" width="300" height="320" rx="22" fill={CARD} stroke={LINE} />
        {/* two founder coins */}
        {[{ x: 110, n: "JP" }, { x: 230, n: "DP" }].map((f) => (
          <g key={f.n}>
            <circle cx={f.x} cy={140} r="38" fill={INK} />
            <text x={f.x} y={150} textAnchor="middle" fontFamily="var(--font-display),sans-serif" fontSize="22" fontWeight="900" fill={LIME}>{f.n}</text>
          </g>
        ))}
        {/* principles list */}
        {[210, 252, 294, 336].map((y, i) => (
          <g key={y}>
            <circle cx="92" cy={y} r="11" fill={i === 0 ? LIME : "#eef2dd"} />
            <path d={`M86 ${y} l 5 5 l 8 -9`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="116" y={y - 6} width={[190, 150, 170, 130][i]} height="12" rx="6" fill={INK} opacity={i === 0 ? ".6" : ".3"} />
          </g>
        ))}
      </g>
      {/* partner badges */}
      <g transform="translate(360 110)" filter="url(#softShadow)">
        <rect width="150" height="64" rx="16" fill={INK} />
        <circle cx="34" cy="32" r="16" fill={LIME} /><text x="34" y="37" textAnchor="middle" fontFamily="var(--font-display),sans-serif" fontSize="12" fontWeight="900" fill={INK}>G</text>
        <text x="62" y="30" fontFamily="var(--font-mono),monospace" fontSize="9" fill="#9a9b88" style={{ textTransform: "uppercase" }}>Google</text>
        <text x="62" y="44" fontFamily="var(--font-mono),monospace" fontSize="9" fontWeight="700" fill={LIME}>Partner</text>
      </g>
      <Chip x={360} y={300} label="AI-augmented" value="Human-led" accent={LIME} />
    </Art>
  );
}

/* ── Contact — chat + calendar slot ───────────────────────────────────────── */
export function ContactArt() {
  return (
    <Art label="Book a free audit — chat and calendar">
      {/* chat */}
      <g filter="url(#softShadow)">
        <rect x="60" y="70" width="250" height="320" rx="22" fill={CARD} stroke={LINE} />
        <rect x="86" y="104" width="150" height="40" rx="14" fill="#fff" stroke={LINE} />
        <rect x="100" y="118" width="110" height="9" rx="4.5" fill={INK} opacity=".3" />
        <rect x="134" y="164" width="150" height="40" rx="14" fill={INK} />
        <rect x="150" y="178" width="110" height="9" rx="4.5" fill="#9a9b88" />
        <rect x="86" y="224" width="120" height="40" rx="14" fill="#fff" stroke={LINE} />
        <rect x="100" y="238" width="80" height="9" rx="4.5" fill={INK} opacity=".3" />
        <rect x="86" y="320" width="224" height="46" rx="14" fill={LIME} />
        <text x="198" y="349" textAnchor="middle" fontFamily="var(--font-display),sans-serif" fontSize="14" fontWeight="800" fill={INK}>Send message</text>
      </g>
      {/* calendar */}
      <g filter="url(#softShadow)">
        <rect x="320" y="120" width="190" height="220" rx="20" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <rect x="320" y="120" width="190" height="44" rx="20" fill={INK} />
        <rect x="320" y="148" width="190" height="16" fill={INK} />
        <text x="340" y="150" fontFamily="var(--font-mono),monospace" fontSize="10" fontWeight="700" letterSpacing="1" fill={LIME} style={{ textTransform: "uppercase" }}>Book a call</text>
        {Array.from({ length: 12 }).map((_, i) => {
          const r = Math.floor(i / 4), c = i % 4; const on = i === 6;
          return (
            <g key={i}>
              <rect x={340 + c * 42} y={184 + r * 46} width="32" height="32" rx="8" fill={on ? LIME : "#f1efe3"} stroke={on ? INK : LINE} strokeWidth={on ? 2 : 1} />
              {on && <path d={`M${348 + c * 42} ${200 + r * 46} l 5 5 l 9 -10`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
            </g>
          );
        })}
      </g>
      <Chip x={350} y={70} label="Reply within" value="1 business day" accent={LIME} />
    </Art>
  );
}

/* ── Parametric: industry hero (icon + ambient + stat) ────────────────────── */
export function IndustryArt({ icon: Icon, name, accent = OLIVE }: { icon: LucideIcon; name: string; accent?: string }) {
  return (
    <Art label={`${name} marketing`}>
      {/* ambient rings (accent-tinted) */}
      <g fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity=".22">
        <ellipse cx="280" cy="220" rx="190" ry="150" />
        <ellipse cx="280" cy="220" rx="130" ry="100" />
      </g>
      <g filter="url(#softShadow)">
        <rect x="120" y="96" width="320" height="250" rx="26" fill={CARD} stroke={LINE} />
        {/* big lime icon tile */}
        <rect x="160" y="132" width="96" height="96" rx="24" fill={INK} />
        <g transform="translate(184 156)" stroke={LIME} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <Icon size={48} color={LIME} absoluteStrokeWidth />
        </g>
        {/* label lines */}
        <rect x="276" y="146" width="130" height="14" rx="7" fill={INK} opacity=".75" />
        <rect x="276" y="170" width="96" height="10" rx="5" fill={accent} />
        <rect x="276" y="196" width="130" height="8" rx="4" fill={INK} opacity=".2" />
        {/* mini chart (accent line) */}
        <rect x="160" y="252" width="246" height="68" rx="14" fill="#eef2dd" />
        <path d="M180 304 L222 296 L264 300 L306 280 L348 268 L388 246" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {[180, 222, 264, 306, 348, 388].map((x, i) => <circle key={x} cx={x} cy={[304, 296, 300, 280, 268, 246][i]} r="3.5" fill={accent} />)}
      </g>
      <Chip x={360} y={70} label="Qualified leads" value="↑ booked jobs" accent={LIME} />
      <Chip x={70} y={300} label="Built for" value={name.length > 14 ? name.slice(0, 12) + "…" : name} accent={accent} />
    </Art>
  );
}

/* ── Parametric: city × service hero (map pin signpost + service icon) ─────── */
export function CityServiceArt({ icon: Icon, city, accent = OLIVE }: { icon: LucideIcon; city: string; accent?: string }) {
  return (
    <Art label={`Marketing in ${city}`}>
      <g filter="url(#softShadow)">
        <rect x="60" y="60" width="320" height="330" rx="24" fill="#eef2dd" stroke="#cfe39a" />
        <circle cx="220" cy="225" r="150" fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity=".25" />
        <path d="M60 250 H380 M150 60 V390 M270 60 V390" stroke="#cfe39a" strokeWidth="6" />
        <path d="M60 150 C 160 170, 280 130, 380 165" stroke="#fff" strokeWidth="8" fill="none" />
        {/* secondary pins */}
        {[{ x: 270, y: 150 }, { x: 150, y: 320 }, { x: 330, y: 300 }].map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <path d="M0 -26 C -12 -26 -17 -15 -11 -6 C -6 0 0 5 0 5 C 0 5 6 0 11 -6 C 17 -15 12 -26 0 -26 Z" fill={INK} />
            <circle cx="0" cy="-15" r="4.5" fill={LIME} />
          </g>
        ))}
        {/* primary pin with city sign */}
        <g transform="translate(150 220)">
          <ellipse cx="0" cy="10" rx="14" ry="5" fill={INK} opacity=".15" />
          <path d="M0 -52 C -22 -52 -30 -28 -18 -12 C -10 -2 0 8 0 8 C 0 8 10 -2 18 -12 C 30 -28 22 -52 0 -52 Z" fill={LIME} stroke={INK} strokeWidth="2.5" />
          <circle cx="0" cy="-32" r="9" fill={INK} />
        </g>
      </g>
      {/* service icon tile */}
      <g filter="url(#softShadow)">
        <rect x="340" y="120" width="170" height="120" rx="20" fill={INK} />
        <rect x="360" y="142" width="52" height="52" rx="14" fill="#222717" />
        <g transform="translate(372 154)"><Icon size={28} color={LIME} absoluteStrokeWidth /></g>
        <text x="360" y="220" fontFamily="var(--font-mono),monospace" fontSize="10" fontWeight="700" letterSpacing="1" fill={LIME} style={{ textTransform: "uppercase" }}>{city}</text>
      </g>
      <Chip x={350} y={280} label="Local market" value="On the ground" accent={LIME} />
    </Art>
  );
}
