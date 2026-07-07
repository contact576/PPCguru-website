"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Service } from "@/lib/data/services";
import { Counter } from "@/components/ui/counter";

const num = (n: number) => Math.round(n).toLocaleString("en-US");

/**
 * Platform-specific sample dashboard. Every figure is DERIVED from one spend
 * input using the same arithmetic as the calculator, so it can never show a
 * contradictory funnel. Always labelled "Sample". Numbers count up and the
 * revenue line draws upward when scrolled into view (reduced-motion → static).
 */
export function DashboardMock({ data }: { data: NonNullable<Service["dashboardMock"]> }) {
  const reduce = useReducedMotion();
  const { platformLabel, spend, cpc, ctr, cvr, closeRate, avgTicket } = data;
  const clicks = cpc > 0 ? spend / cpc : 0;
  const impressions = ctr > 0 ? clicks / ctr : 0;
  const leads = clicks * cvr;
  const customers = leads * closeRate;
  const revenue = customers * avgTicket;
  const roas = spend > 0 ? revenue / spend : 0;
  const cpl = leads > 0 ? spend / leads : 0;

  const metrics: { l: string; val: number; prefix?: string; suffix?: string; decimals?: number; c: string }[] = [
    { l: "Spend", val: Math.round(spend), prefix: "$", c: "#f1efe3" },
    { l: "Clicks", val: Math.round(clicks), c: "#f1efe3" },
    { l: "Leads", val: Math.round(leads), c: "#ceff3a" },
    { l: "Cost / lead", val: Math.round(cpl), prefix: "$", c: "#f1efe3" },
    { l: "Customers", val: Math.round(customers), c: "#ceff3a" },
    { l: "ROAS", val: roas, decimals: 1, suffix: "x", c: "#ceff3a" },
  ];

  return (
    <div style={{ background: "#1b1f12", border: "1px solid rgba(206,255,58,.2)", borderRadius: 22, padding: 22, boxShadow: "0 30px 70px rgba(0,0,0,.4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#f1efe3" }}>{platformLabel} — Performance</div>
          <div className="mono" style={{ fontSize: 9, color: "#7d7e6c", letterSpacing: ".08em", textTransform: "uppercase" }}>Sample · illustrative</div>
        </div>
        <span className="mono" style={{ fontSize: 9.5, color: "#14170e", background: "#ceff3a", padding: "5px 9px", borderRadius: 7, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>Sample</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
        {metrics.map((m) => (
          <div key={m.l} style={{ background: "rgba(241,239,227,.04)", border: "1px solid rgba(241,239,227,.08)", borderRadius: 12, padding: 11 }}>
            <div className="mono" style={{ fontSize: 8.5, color: "#8a8b78", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>{m.l}</div>
            <div className="head" style={{ fontSize: 17, color: m.c, marginTop: 3 }}>
              <Counter value={m.val} prefix={m.prefix ?? ""} suffix={m.suffix ?? ""} decimals={m.decimals ?? 0} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(241,239,227,.04)", border: "1px solid rgba(241,239,227,.08)", borderRadius: 14, padding: 13, marginTop: 9 }}>
        <div className="mono" style={{ fontSize: 8.5, color: "#8a8b78", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>Revenue from {num(impressions)} impressions</div>
        <svg viewBox="0 0 300 60" style={{ width: "100%", height: 48, display: "block" }} preserveAspectRatio="none">
          <defs><linearGradient id="dm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ceff3a" stopOpacity=".35" /><stop offset="1" stopColor="#ceff3a" stopOpacity="0" /></linearGradient></defs>
          <motion.path
            d="M0,48 L50,44 L100,46 L150,34 L200,26 L250,16 L300,6 L300,60 L0,60 Z"
            fill="url(#dm)"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.path
            d="M0,48 L50,44 L100,46 L150,34 L200,26 L250,16 L300,6"
            fill="none" stroke="#ceff3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={reduce ? undefined : { pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="head" style={{ fontSize: 20, color: "#f1efe3", marginTop: 6 }}>
          <Counter value={Math.round(revenue)} prefix="$" /> <span style={{ fontSize: 12, color: "#8a8b78" }}>projected revenue</span>
        </div>
      </div>
    </div>
  );
}
