"use client";

import { useState } from "react";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const num = (n: number) => Math.round(n).toLocaleString("en-US");
const muted = "#8a8b78";

type Risk = { t: string; c: string; bg: string };
const risk = (s: number): Risk =>
  s >= 66 ? { t: "High", c: "#ef4444", bg: "rgba(239,68,68,.14)" }
  : s >= 34 ? { t: "Medium", c: "#f26a2b", bg: "rgba(242,106,43,.14)" }
  : { t: "Low", c: "#9bd227", bg: "rgba(206,255,58,.16)" };

const labelStyle: React.CSSProperties = { fontSize: 10, color: muted, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" };
const fieldStyle: React.CSSProperties = { width: "100%", background: "#0f1109", border: "1px solid rgba(241,239,227,.18)", color: "#f1efe3", fontSize: 14, padding: 12, borderRadius: 12, fontFamily: "inherit" };

export function WasteCalculator() {
  const [industry, setIndustry] = useState("HVAC & Home Services");
  const [platform, setPlatform] = useState("Google Ads");
  const [spend, setSpend] = useState(4000);
  const [cpc, setCpc] = useState(4);
  const [conv, setConv] = useState(4);
  const [leadValue, setLeadValue] = useState(600);

  const clicks = spend / Math.max(0.1, cpc);
  const leads = clicks * (conv / 100);
  const wastePct = conv < 2 ? 0.26 : conv < 4 ? 0.16 : conv < 6 ? 0.1 : 0.07;
  const wasted = spend * wastePct;
  const wastedClicks = wasted / Math.max(0.1, cpc);
  const liftLeads = leads * 0.25;
  const potentialRev = liftLeads * leadValue;
  const lostLeads = wastedClicks * (conv / 100) + liftLeads;
  const missedRev = lostLeads * leadValue;
  const track = risk(conv < 2 ? 78 : conv < 4 ? 52 : 28);
  const lp = risk(conv < 2.5 ? 70 : conv < 5 ? 45 : 22);
  const auditPriority = wastePct >= 0.2 ? "High — book audit this week" : wastePct >= 0.12 ? "Medium — within 2 weeks" : "Healthy — fine-tune & scale";
  const firstFix = conv < 2 ? "Conversion tracking + search-term cleanup" : conv < 4 ? "Search-term waste & ad relevance" : "Landing-page CRO & bid strategy";
  const apColor = wastePct >= 0.2 ? "#ef4444" : wastePct >= 0.12 ? "#f26a2b" : "#ceff3a";

  const slider = (
    label: string, value: string, min: number, max: number, step: number, v: number, set: (n: number) => void, full = false
  ) => (
    <div style={full ? { gridColumn: "1 / -1" } : undefined}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
        <label className="mono" style={labelStyle}>{label}</label>
        <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "#ceff3a" }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} style={{ width: "100%", accentColor: "#ceff3a" }} />
    </div>
  );

  return (
    <div data-reveal style={{ background: "#1b1f12", border: "1px solid rgba(241,239,227,.12)", borderRadius: 26, padding: 30, boxShadow: "0 40px 90px rgba(0,0,0,.4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 22px" }}>
        <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <label className="mono" style={{ ...labelStyle, display: "block", marginBottom: 8 }}>Industry</label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={fieldStyle}>
              {["HVAC & Home Services", "Healthcare & Dental", "Construction & Renovation", "Real Estate", "Immigration Consulting", "Other Local Service"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="mono" style={{ ...labelStyle, display: "block", marginBottom: 8 }}>Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={fieldStyle}>
              {["Google Ads", "Meta Ads", "Microsoft Ads", "Multi-channel"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        {slider("Monthly ad spend", money(spend), 500, 50000, 500, spend, setSpend, true)}
        {slider("Avg CPC", "$" + cpc.toFixed(2), 0.5, 25, 0.5, cpc, setCpc)}
        {slider("Conversion rate", conv + "%", 0.5, 15, 0.5, conv, setConv)}
        {slider("Avg lead / sale value", money(leadValue), 100, 5000, 100, leadValue, setLeadValue, true)}
      </div>

      <div style={{ height: 1, background: "rgba(241,239,227,.12)", margin: "24px 0" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 16, padding: 16 }}>
          <div className="mono" style={{ fontSize: 9.5, color: "#fca5a5", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Wasted / mo</div>
          <div className="head" style={{ fontSize: 23, color: "#f1efe3", marginTop: 5 }}>{money(wasted)}</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{num(wastedClicks)} wasted clicks</div>
        </div>
        <div style={{ background: "rgba(242,106,43,.1)", border: "1px solid rgba(242,106,43,.3)", borderRadius: 16, padding: 16 }}>
          <div className="mono" style={{ fontSize: 9.5, color: "#fdba74", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Missed revenue</div>
          <div className="head" style={{ fontSize: 23, color: "#f1efe3", marginTop: 5 }}>{money(missedRev)}</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>leaks + lost leads</div>
        </div>
        <div style={{ background: "rgba(206,255,58,.1)", border: "1px solid rgba(206,255,58,.3)", borderRadius: 16, padding: 16 }}>
          <div className="mono" style={{ fontSize: 9.5, color: "#ceff3a", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Lift / mo</div>
          <div className="head" style={{ fontSize: 23, color: "#f1efe3", marginTop: 5 }}>{money(potentialRev)}</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>+{num(liftLeads)} extra leads</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16, alignItems: "center" }}>
        <span className="mono" style={labelStyle}>Risk:</span>
        <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: track.c, background: track.bg, padding: "6px 11px", borderRadius: 8 }}>Tracking · {track.t}</span>
        <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: lp.c, background: lp.bg, padding: "6px 11px", borderRadius: 8 }}>Landing · {lp.t}</span>
      </div>

      <div style={{ background: "rgba(206,255,58,.08)", border: "1px solid rgba(206,255,58,.3)", borderRadius: 16, padding: "16px 18px", marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div>
          <div className="mono" style={{ fontSize: 9.5, color: "#ceff3a", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Recommended first fix</div>
          <div className="head" style={{ fontSize: 15, marginTop: 4, color: "#f1efe3" }}>{firstFix}</div>
          <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: apColor }}>Audit priority: {auditPriority}</div>
        </div>
        <a href="#audit" className="mono" style={{ background: "#ceff3a", color: "#14170e", fontWeight: 700, fontSize: 12, letterSpacing: ".05em", textTransform: "uppercase", padding: "13px 18px", borderRadius: 12, whiteSpace: "nowrap" }}>Get my report →</a>
      </div>
    </div>
  );
}
