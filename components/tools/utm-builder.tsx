"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/** Pure-client UTM URL builder with copy-to-clipboard. */
export function UtmBuilder() {
  const [url, setUrl] = useState("https://ppcguru.ca");
  const [source, setSource] = useState("google");
  const [medium, setMedium] = useState("cpc");
  const [campaign, setCampaign] = useState("spring-sale");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams();
  if (source) params.set("utm_source", source.trim());
  if (medium) params.set("utm_medium", medium.trim());
  if (campaign) params.set("utm_campaign", campaign.trim());
  if (term) params.set("utm_term", term.trim());
  if (content) params.set("utm_content", content.trim());
  const qs = params.toString();
  const base = url.trim().replace(/\?.*$/, "");
  const full = qs ? `${base}${base.includes("?") ? "&" : "?"}${qs}` : base;

  async function copy() {
    try { await navigator.clipboard.writeText(full); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* ignore */ }
  }

  const field = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-violet)]";
  const Item = ({ label, value, set, ph, req }: { label: string; value: string; set: (s: string) => void; ph?: string; req?: boolean }) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-dim)]">{label}{req ? <span className="text-[var(--color-coral)]"> *</span> : null}</span>
      <input value={value} onChange={(e) => set(e.target.value)} placeholder={ph} className={field} />
    </label>
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Item label="Website URL" value={url} set={setUrl} ph="https://example.com/page" req /></div>
        <Item label="Campaign source (utm_source)" value={source} set={setSource} ph="google, facebook, newsletter" req />
        <Item label="Campaign medium (utm_medium)" value={medium} set={setMedium} ph="cpc, email, social" req />
        <Item label="Campaign name (utm_campaign)" value={campaign} set={setCampaign} ph="spring-sale" req />
        <Item label="Campaign term (utm_term)" value={term} set={setTerm} ph="optional — paid keyword" />
        <div className="sm:col-span-2"><Item label="Campaign content (utm_content)" value={content} set={setContent} ph="optional — a/b variant" /></div>
      </div>

      <div className="mt-6">
        <span className="mb-2 block text-sm font-medium text-[var(--color-ink-dim)]">Your tagged URL</span>
        <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-base)] p-4">
          <code className="flex-1 break-all text-sm text-[var(--color-ink)]">{full}</code>
          <button onClick={copy} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3.5 py-2 text-xs font-semibold text-[var(--color-lime)]">
            {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>
      </div>
    </div>
  );
}
