"use client";

import { useEffect, useRef, useState } from "react";
import { heroSampleModel as M } from "@/lib/data/performance-stats";

/** Count-up that eases 0→value once on mount (respects reduced-motion). */
function useCountUp(value: number, duration = 1500) {
  const [n, setN] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(value); return; }
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      setN(value * ease(t));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return n;
}

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const num = (n: number) => Math.round(n).toLocaleString("en-US");

const card = "rgba(241,239,227,.04)";
const cardBorder = "rgba(241,239,227,.08)";
const muted = "#8a8b78";

export function HeroDashboard() {
  const [dash, setDash] = useState(420);
  useEffect(() => { const t = setTimeout(() => setDash(0), 150); return () => clearTimeout(t); }, []);

  // All numbers derive from one consistent sample model so nothing contradicts.
  const spend = useCountUp(M.spend);
  const waste = useCountUp(M.wasteRecovered);
  const leads = useCountUp(M.qualifiedLeads);
  const booked = useCountUp(M.booked);
  const roas = useCountUp(M.roas);
  const health = useCountUp(M.trackingHealth);
  const costPerLead = leads > 0 ? spend / leads : 0; // ratio stays constant = spend/leads

  return (
    <div style={{ position: "relative" }} data-herodash="1">
      {/* floating: wasted spend found */}
      <div style={{ position: "absolute", top: 30, right: -12, zIndex: 3, background: "#f1efe3", color: "#14170e", borderRadius: 16, padding: "14px 17px", boxShadow: "0 18px 50px rgba(0,0,0,.5)", animation: "ppcFloat 6s ease-in-out infinite", minWidth: 168 }}>
        <div className="mono" style={{ fontSize: 10, color: "#6a6c5a", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>Wasted spend found</div>
        <div className="head" style={{ fontSize: 26, marginTop: 4, color: "#14170e" }}>{money(waste)}</div>
        <div className="mono" style={{ fontSize: 11, color: "#3f7d18", fontWeight: 600, marginTop: 2 }}>↓ recovered this month</div>
      </div>

      {/* main dashboard */}
      <div style={{ background: "#1b1f12", border: "1px solid rgba(206,255,58,.2)", borderRadius: 24, padding: 24, boxShadow: "0 40px 90px rgba(0,0,0,.55)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="grotesk" style={{ width: 30, height: 30, borderRadius: 9, background: "#ceff3a", color: "#14170e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13 }}>◢</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#f1efe3" }}>Performance Dashboard</div>
              <div className="mono" style={{ fontSize: 9, color: "#7d7e6c", letterSpacing: ".08em", textTransform: "uppercase" }}>Sample · illustrative</div>
            </div>
          </div>
          <span className="mono" style={{ fontSize: 9.5, color: "#ceff3a", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: ".1em", textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ceff3a", animation: "ppcPulse 2.2s infinite" }} />Live
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { l: "Ad spend", v: money(spend), c: "#f1efe3" },
            { l: "Qual. leads", v: num(leads), c: "#ceff3a" },
            { l: "Booked", v: num(booked), c: "#ceff3a" },
          ].map((m) => (
            <div key={m.l} style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 14, padding: 13 }}>
              <div className="mono" style={{ fontSize: 9, color: muted, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>{m.l}</div>
              <div className="head" style={{ fontSize: 20, color: m.c, marginTop: 4 }}>{m.v}</div>
            </div>
          ))}
        </div>

        <div style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 15, marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
            <div>
              <div className="mono" style={{ fontSize: 9, color: muted, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Return on ad spend</div>
              <div className="head" style={{ fontSize: 23, color: "#f1efe3" }}>{roas.toFixed(1)}x</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="mono" style={{ fontSize: 9, color: muted, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Cost / qual. lead</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#f1efe3" }}>{money(costPerLead)}</div>
            </div>
          </div>
          <svg viewBox="0 0 300 80" style={{ width: "100%", height: 62, display: "block" }} preserveAspectRatio="none">
            <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ceff3a" stopOpacity=".35" /><stop offset="1" stopColor="#ceff3a" stopOpacity="0" /></linearGradient></defs>
            <path d="M0,64 L40,58 L80,60 L120,46 L160,40 L200,30 L240,20 L300,8 L300,80 L0,80 Z" fill="url(#hg)" />
            <path d="M0,64 L40,58 L80,60 L120,46 L160,40 L200,30 L240,20 L300,8" fill="none" stroke="#ceff3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 420, strokeDashoffset: dash, transition: "stroke-dashoffset 1.6s ease" }} />
          </svg>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 9, color: muted, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>Budget allocation</div>
            <div style={{ display: "flex", height: 9, borderRadius: 999, overflow: "hidden", gap: 2 }}>
              <span style={{ width: "52%", background: "#ceff3a", borderRadius: 999 }} />
              <span style={{ width: "26%", background: "#8fbf24", borderRadius: 999 }} />
              <span style={{ width: "16%", background: "#f1efe3", borderRadius: 999 }} />
              <span style={{ width: "6%", background: "#f26a2b", borderRadius: 999 }} />
            </div>
          </div>
          <span className="mono" style={{ fontSize: 9.5, color: "#ceff3a", background: "rgba(206,255,58,.14)", padding: "6px 10px", borderRadius: 8, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>● Scaling</span>
        </div>
      </div>

      {/* floating: tracking health */}
      <div style={{ position: "absolute", bottom: -24, left: -16, zIndex: 3, background: "#f1efe3", color: "#14170e", borderRadius: 16, padding: "13px 16px", boxShadow: "0 18px 50px rgba(0,0,0,.5)", animation: "ppcFloat2 7s ease-in-out infinite", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: "#14170e", display: "flex", alignItems: "center", justifyContent: "center", color: "#ceff3a", fontSize: 17 }}>✓</span>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "#6a6c5a", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Tracking health</div>
          <div className="head" style={{ fontSize: 18, color: "#14170e" }}>{Math.round(health)}%</div>
        </div>
      </div>
    </div>
  );
}
