"use client";

import { useState } from "react";
import { homeFaqs } from "@/lib/data/home";

/** Compact two-column FAQ accordion (1 column on mobile). One item open at a time. */
export function FaqList() {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid items-start gap-2.5 md:grid-cols-2 md:gap-x-4 md:gap-y-2.5">
      {homeFaqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} data-reveal style={{ background: "#fbfaf2", border: `1px solid ${isOpen ? "#ceff3a" : "#dddbc9"}`, borderRadius: 14, overflow: "hidden", transition: "border-color .2s", alignSelf: "start" }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="head"
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "16px 18px", fontSize: 15.5, lineHeight: 1.25, color: "#14170e" }}
            >
              {f.q}
              <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 7, background: isOpen ? "#ceff3a" : "transparent", color: isOpen ? "#14170e" : "#6f7d22", border: `1px solid ${isOpen ? "#ceff3a" : "#cfe39a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "transform .25s,background .2s", transform: `rotate(${isOpen ? "45deg" : "0deg"})` }}>+</span>
            </button>
            <div style={{ maxHeight: isOpen ? 360 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
              <p style={{ padding: "0 18px 18px", fontSize: 13.5, color: "#54564a", lineHeight: 1.6 }}>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
