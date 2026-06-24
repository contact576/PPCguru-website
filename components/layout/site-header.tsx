"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Logo } from "@/components/layout/logo";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed top-9 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-base)_82%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label={siteConfig.name} className="relative z-50">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Magnetic strength={0.3}>
            <Button href={siteConfig.cta.primaryHref} size="sm" variant="accent" data-cursor="Book">
              {siteConfig.cta.primaryLabel}
            </Button>
          </Magnetic>
        </div>

        <button
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-ink)] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 origin-top bg-[var(--color-base)] transition-all duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="container-page flex h-full flex-col justify-center gap-2 pt-16">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-[var(--color-border)] py-4 text-2xl font-semibold text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
          <Button href={siteConfig.cta.primaryHref} size="lg" variant="accent" className="mt-6 w-full">
            {siteConfig.cta.primaryLabel}
          </Button>
        </div>
      </div>
    </header>
  );
}
