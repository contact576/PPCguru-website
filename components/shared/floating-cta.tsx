"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * The homepage pill leads to its audit form and stays out of the way while
 * the hero or form is visible. Other pages retain their page-specific popup.
 * All routes hide the pill while that popup is open.
 */
export function FloatingCta() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  // Start hidden until both homepage sections have been observed.
  const [homeSectionsVisible, setHomeSectionsVisible] = useState(true);

  useEffect(() => {
    const sync = () => setHidden(document.body.hasAttribute("data-offer-open"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-offer-open"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setHomeSectionsVisible(true);
    if (!isHome) return;

    const sections = Array.from(document.querySelectorAll(".home-hero, #audit"));
    if (sections.length === 0) return;
    const visibility = new Map(sections.map((section) => [section, true]));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) visibility.set(entry.target, entry.isIntersecting);
      setHomeSectionsVisible(Array.from(visibility.values()).some(Boolean));
    });
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      setHomeSectionsVisible(true);
    };
  }, [isHome, pathname]);

  if (hidden || (isHome && homeSectionsVisible)) return null;

  const style: React.CSSProperties = {
    position: "fixed", right: 22, bottom: 22, zIndex: 70,
    background: "#ceff3a", color: "#14170e", fontWeight: 700, fontSize: 12.5,
    letterSpacing: ".05em", textTransform: "uppercase", padding: "15px 22px",
    borderRadius: 999, boxShadow: "0 12px 34px rgba(206,255,58,.4)",
    display: "inline-flex", alignItems: "center", gap: 9, border: "none", cursor: "pointer",
    animation: isHome ? undefined : "ppcShake 4.5s ease-in-out 2s infinite", transformOrigin: "center",
    textDecoration: "none",
  };
  const contents = <><span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: "#14170e", animation: isHome ? undefined : "ppcPulse 2.2s infinite" }} />Free Audit</>;

  if (isHome) {
    return <a href="#audit" aria-label="Get a free audit" className="mono home-floating-cta" style={style}>{contents}</a>;
  }

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("ppcg:open-offer"))}
      aria-label="Get a free audit"
      className="mono ppc-shake"
      style={style}
    >
      {contents}
    </button>
  );
}
