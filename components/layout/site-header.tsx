"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Header — handoff design. Sticky below the announcement bar, transparent over
 * the cream hero and frosting to cream once scrolled. Links resolve to real
 * routes (and home anchors) so it works site-wide.
 */
const NAV = [
  { label: "Services", href: "/services" },
  { label: "Results", href: "/results" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Tools", href: "/tools" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 80,
        transition: "background .3s,box-shadow .3s,border-color .3s",
        background: scrolled ? "rgba(247,245,234,0.88)" : "rgba(247,245,234,0)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "#e3e0d0" : "rgba(20,23,14,0)"}`,
      }}
    >
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "0 32px", height: 78, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <Link href="/" aria-label="PPC Guru" style={{ display: "flex", flexDirection: "column", lineHeight: 0.8 }}>
          <span className="serif" style={{ fontSize: 21, color: "#14170e", letterSpacing: ".02em" }}>PPC</span>
          <span className="grotesk" style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-.01em", color: "#14170e", textTransform: "uppercase" }}>Guru<span style={{ color: "#6f7d22" }}>.ca</span></span>
        </Link>

        <nav className="mono hidden lg:flex" style={{ alignItems: "center", gap: 28, fontSize: 12.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#3a3a36" }}>
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className="transition-colors hover:text-[#6f7d22]">{n.label}</Link>
          ))}
        </nav>

        <div className="hidden lg:flex" style={{ alignItems: "center", gap: 10 }}>
          <Link href="/contact" className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#3a3a36", padding: "11px 13px", border: "1px solid #d8d6c6", borderRadius: 12 }}>WhatsApp</Link>
          <Link href="/#audit" className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ceff3a", color: "#14170e", fontWeight: 700, fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", padding: "12px 18px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: "0 6px 20px rgba(206,255,58,.28)" }}>Free PPC Audit</Link>
        </div>

        <button onClick={() => setOpen((v) => !v)} aria-label="Open menu" className="lg:hidden" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, border: "1px solid #c4c2b0", background: "transparent", cursor: "pointer", color: "#14170e", borderRadius: 13 }}>
          <span style={{ display: "block", width: 18, height: 2, background: "#14170e", boxShadow: "0 6px 0 #14170e,0 -6px 0 #14170e" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(10,12,7,.6)", backdropFilter: "blur(4px)" }} onClick={() => setOpen(false)}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "min(88vw,360px)", height: "100%", background: "#f1efe3", borderLeft: "1px solid #dddbc9", padding: "26px 24px", display: "flex", flexDirection: "column", gap: 4 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ lineHeight: 0.8 }}>
                <div className="serif" style={{ fontSize: 20 }}>PPC</div>
                <div className="grotesk" style={{ fontWeight: 900, fontSize: 17, textTransform: "uppercase" }}>Guru<span style={{ color: "#6f7d22" }}>.ca</span></div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close menu" style={{ border: "1px solid #c4c2b0", background: "transparent", width: 42, height: 42, borderRadius: 12, fontSize: 17, cursor: "pointer", color: "#14170e" }}>✕</button>
            </div>
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="head" style={{ fontSize: 30, padding: "11px 0", borderBottom: "1px solid #e3e0d0" }}>{n.label}</Link>
            ))}
            <Link href="/#audit" onClick={() => setOpen(false)} className="mono" style={{ marginTop: 18, textAlign: "center", background: "#ceff3a", color: "#14170e", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", padding: 15, borderRadius: 13 }}>Get Free PPC Audit</Link>
          </div>
        </div>
      )}
    </header>
  );
}
