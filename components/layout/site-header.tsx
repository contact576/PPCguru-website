"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { nav, type NavItem } from "@/lib/site-config";
import { Logo } from "@/components/shared/logo";

/**
 * Header — sticky, frosts to cream on scroll. Dropdown-aware: parents with
 * children open on hover AND keyboard focus (focus-within), Esc closes, every
 * item is a real link. Mobile menu mirrors the structure as accordions.
 */
function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") return pathname === "/";
  if (pathname === item.href || pathname.startsWith(item.href + "/")) return true;
  return item.children?.some((c) => c.href !== item.href && pathname.startsWith(c.href)) ?? false;
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        (document.activeElement as HTMLElement | null)?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 80,
        transition: "background .3s,box-shadow .3s,border-color .3s",
        background: scrolled ? "rgba(247,245,234,0.92)" : "rgba(247,245,234,0)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "#e3e0d0" : "rgba(20,23,14,0)"}`,
      }}
    >
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "0 20px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <Logo href="/" variant="dark" size={38} />

        {/* Desktop nav */}
        <nav className="mono hidden lg:flex" aria-label="Primary" style={{ alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase" }}>
          {nav.map((item) => {
            const active = isActive(pathname, item);
            const color = active ? "#6f7d22" : "#3a3a36";
            if (!item.children) {
              return (
                <Link key={item.label} href={item.href} className="nav-underline transition-colors hover:text-[#6f7d22]" style={{ color, padding: "10px 12px", borderRadius: 10 }}>
                  {item.label}
                </Link>
              );
            }
            return (
              <div key={item.label} className="group relative" style={{ display: "inline-flex" }}>
                <Link
                  href={item.href}
                  aria-haspopup="true"
                  className="nav-underline transition-colors hover:text-[#6f7d22] group-focus-within:text-[#6f7d22]"
                  style={{ color, padding: "10px 12px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 5 }}
                >
                  {item.label}
                  <ChevronDown size={13} className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                </Link>
                {/* Dropdown: shown on hover or keyboard focus within the group */}
                <div
                  className="invisible translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  style={{ position: "absolute", top: "100%", left: 0, paddingTop: 8, minWidth: 248 }}
                >
                  <div style={{ background: "#fff", border: "1px solid #e3e0d0", borderRadius: 16, padding: 8, boxShadow: "0 18px 50px rgba(20,23,14,.12)" }}>
                    {item.children.map((c) =>
                      c.heading ? (
                        <div key={c.label} className="mono" style={{ padding: "11px 12px 4px", fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#9a9b88" }}>{c.label}</div>
                      ) : (
                        <Link key={c.label} href={c.href} className="hover:bg-[#f4f2e6]" style={{ display: "block", padding: "9px 12px", borderRadius: 10, color: "#2c2e22", textTransform: "none", letterSpacing: 0, fontWeight: 500, fontSize: 13.5 }}>
                          {c.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:flex" style={{ alignItems: "center", gap: 10 }}>
          <Link href="/contact" className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: "#3a3a36", padding: "10px 13px", border: "1px solid #d8d6c6", borderRadius: 12 }}>Message us</Link>
          <Link href="/contact" className="mono btn-shine transition-transform hover:-translate-y-0.5" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ceff3a", color: "#14170e", fontWeight: 700, fontSize: 11.5, letterSpacing: ".05em", textTransform: "uppercase", padding: "12px 18px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: "0 6px 20px rgba(206,255,58,.28)" }}>Book a Growth Audit</Link>
        </div>

        <button onClick={() => setOpen((v) => !v)} aria-label="Open menu" aria-expanded={open} className="lg:hidden" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, border: "1px solid #c4c2b0", background: "transparent", cursor: "pointer", color: "#14170e", borderRadius: 13 }}>
          <span style={{ display: "block", width: 18, height: 2, background: "#14170e", boxShadow: "0 6px 0 #14170e,0 -6px 0 #14170e" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ position: "fixed", inset: 0, height: "100dvh", zIndex: 90, background: "rgba(10,12,7,.6)", backdropFilter: "blur(4px)" }} onClick={() => setOpen(false)}>
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(92vw,380px)", height: "100dvh", background: "#f1efe3", borderLeft: "1px solid #dddbc9", padding: "22px 20px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <Logo variant="dark" size={36} />
              <button onClick={() => setOpen(false)} aria-label="Close menu" style={{ border: "1px solid #c4c2b0", background: "transparent", width: 44, height: 44, borderRadius: 12, fontSize: 17, cursor: "pointer", color: "#14170e" }}>✕</button>
            </div>

            {nav.map((item) => (
              <div key={item.label} style={{ borderBottom: "1px solid #e3e0d0" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="head" style={{ flex: 1, fontSize: 22, padding: "12px 0" }}>{item.label}</Link>
                  {item.children && (
                    <button
                      onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                      aria-label={`Toggle ${item.label} submenu`}
                      aria-expanded={expanded === item.label}
                      style={{ width: 44, height: 44, border: "none", background: "transparent", cursor: "pointer", color: "#14170e" }}
                    >
                      <ChevronDown size={20} style={{ transform: expanded === item.label ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                    </button>
                  )}
                </div>
                {item.children && expanded === item.label && (
                  <div style={{ display: "flex", flexDirection: "column", paddingBottom: 10 }}>
                    {item.children.map((c) =>
                      c.heading ? (
                        <div key={c.label} className="mono" style={{ padding: "10px 0 3px 12px", fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#9a9b88" }}>{c.label}</div>
                      ) : (
                        <Link key={c.label} href={c.href} onClick={() => setOpen(false)} style={{ padding: "9px 0 9px 12px", fontSize: 15, color: "#54564a" }}>{c.label}</Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            <Link href="/contact" onClick={() => setOpen(false)} className="mono" style={{ marginTop: 16, textAlign: "center", background: "#ceff3a", color: "#14170e", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", padding: 15, borderRadius: 13 }}>Book a Growth Audit</Link>
          </div>
        </div>
      )}
    </header>
  );
}
