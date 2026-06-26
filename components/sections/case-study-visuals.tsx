import type { CaseStudy } from "@/lib/data/case-studies";

const INK = "#14170e";
const LIME = "#ceff3a";
const OLIVE = "#6f7d22";
const CORAL = "#f26a2b";

/** Before → after comparison bars. */
export function BeforeAfter({ rows }: { rows: NonNullable<CaseStudy["beforeAfter"]> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.metric} className="rounded-[18px] border border-[#dddbc9] bg-white p-6">
          <div className="mono text-[11px] font-bold uppercase tracking-[.08em] text-[var(--color-ink-dim)]">{r.metric}</div>
          <div className="mt-4 flex items-end gap-4">
            <div className="flex-1">
              <div className="mono text-[10px] uppercase tracking-[.06em] text-[var(--color-ink-faint)]">Before</div>
              <div className="mt-1 rounded-t-md bg-[#e3e0d0]" style={{ height: 26 }} />
              <div className="head mt-2 text-[22px] text-[var(--color-ink-dim)]">{r.before}</div>
            </div>
            <div className="flex-1">
              <div className="mono text-[10px] uppercase tracking-[.06em]" style={{ color: OLIVE }}>After</div>
              <div className="mt-1 rounded-t-md" style={{ height: 46, background: LIME }} />
              <div className="head mt-2 text-[22px] text-[var(--color-ink)]">{r.after}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** ROAS-over-time trend chart (pure SVG). */
export function RoiTrend({ data }: { data: number[] }) {
  if (!data || data.length < 2) return null;
  const w = 600, h = 200, pad = 28;
  const max = Math.max(...data) * 1.1;
  const min = Math.min(0, ...data);
  const x = (i: number) => pad + (i * (w - pad * 2)) / (data.length - 1);
  const y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${h - pad} L${x(0).toFixed(1)},${h - pad} Z`;
  return (
    <div className="rounded-[18px] border border-[#dddbc9] bg-white p-6">
      <div className="mono text-[11px] font-bold uppercase tracking-[.08em] text-[var(--color-ink-dim)]">Return on ad spend, by month</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full" style={{ height: "auto" }}>
        <defs><linearGradient id="roiFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={OLIVE} stopOpacity=".25" /><stop offset="1" stopColor={OLIVE} stopOpacity="0" /></linearGradient></defs>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#e3e0d0" strokeWidth="1" />
        <path d={area} fill="url(#roiFill)" />
        <path d={line} fill="none" stroke={OLIVE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="4.5" fill={INK} />
            <text x={x(i)} y={y(v) - 12} textAnchor="middle" fontFamily="var(--font-mono),monospace" fontSize="12" fontWeight="700" fill={INK}>{v.toFixed(1)}x</text>
            <text x={x(i)} y={h - pad + 18} textAnchor="middle" fontFamily="var(--font-mono),monospace" fontSize="10" fill="#83856f">M{i + 1}</text>
          </g>
        ))}
      </svg>
      <p className="mt-2 text-[11px] text-[var(--color-ink-faint)]">Representative progression — individual results vary.</p>
    </div>
  );
}

export { CORAL };
