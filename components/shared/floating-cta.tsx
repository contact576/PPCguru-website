"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

/**
 * Desktop: a bottom-right floating "Free PPC Audit" button that appears after
 * the user scrolls past the hero. Mobile: a bottom sticky action bar.
 * Both are unobtrusive and only render after scroll.
 */
export function FloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop floating button */}
      <Link
        href="/contact"
        onClick={() => track("cta_click", { source: "floating_cta" })}
        className={`fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-[var(--color-orange)] px-5 py-3.5 font-semibold text-white shadow-tile transition-all duration-300 hover:bg-[var(--color-orange-deep)] md:inline-flex ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        Free PPC Audit <ArrowRight size={17} />
      </Link>

      {/* Mobile sticky bottom bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-[var(--color-border)] bg-white/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {siteConfig.contact.phone ? (
          <a
            href={siteConfig.contact.phoneHref}
            onClick={() => track("phone_click", { source: "mobile_bar" })}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-bright)] py-3 text-sm font-medium text-[var(--color-ink)]"
          >
            <Phone size={16} /> Call
          </a>
        ) : (
          <Link
            href="/contact"
            onClick={() => track("cta_click", { source: "mobile_bar_call" })}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-bright)] py-3 text-sm font-medium text-[var(--color-ink)]"
          >
            <Phone size={16} /> Book a call
          </Link>
        )}
        <Link
          href="/contact"
          onClick={() => track("cta_click", { source: "mobile_bar" })}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-orange)] py-3 text-sm font-semibold text-white"
        >
          Free PPC Audit
        </Link>
      </div>
    </>
  );
}
