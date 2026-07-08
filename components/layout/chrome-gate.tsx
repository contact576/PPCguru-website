"use client";

import { usePathname } from "next/navigation";

/** Hides marketing chrome (header/footer/floating CTA) on CMS routes (/admin). */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
