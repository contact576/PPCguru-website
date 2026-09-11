"use client";

import { usePathname } from "next/navigation";

/** Hides marketing chrome (header/footer/floating CTA) on CMS routes (/admin) and standalone landing pages (/100-leads). */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  // Paid-traffic landing pages carry their own header/footer (components/landing).
  if (pathname === "/100-leads" || pathname.startsWith("/100-leads/")) return null;
  if (pathname === "/seo-visibility" || pathname.startsWith("/seo-visibility/")) return null;
  return <>{children}</>;
}
