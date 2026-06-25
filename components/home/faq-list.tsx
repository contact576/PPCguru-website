"use client";

import { useState } from "react";
import { homeFaqs } from "@/lib/data/home";

export function FaqList() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {homeFaqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} data-reveal style={{ background: "#fbfaf2", border: `1px solid ${isOpen ? "#ceff3a" : "#dddbc9"}`, borderRadius: 18, overflow: "hidden", transition: "border-color .2s" }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="head"
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: 24, fontSize: "clamp(17px,2vw,21px)", color: "#14170e" }}
            >
              {f.q}
              <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: isOpen ? "#ceff3a" : "transparent", color: isOpen ? "#14170e" : "#6f7d22", border: `1px solid ${isOpen ? "#ceff3a" : "#cfe39a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, transition: "transform .25s,background .2s", transform: `rotate(${isOpen ? "45deg" : "0deg"})` }}>+</span>
            </button>
            <div style={{ maxHeight: isOpen ? 280 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
              <p style={{ padding: "0 24px 24px", fontSize: 15, color: "#54564a", lineHeight: 1.65 }}>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
