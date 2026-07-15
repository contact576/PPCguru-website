"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Inbox, Users, Settings, ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Posts", icon: FileText },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/visitors", label: "Visitors", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/**
 * Shared chrome for every admin page: brand + tabbed nav (Posts / Leads /
 * Visitors / Settings) + view-site + log-out. Client so log-out can POST.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-[var(--color-base)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo variant="dark" size={32} />
            <span className="text-sm text-[var(--color-ink-dim)]">· Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
              <ExternalLink size={14} /> View site
            </Link>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3">
          {TABS.map((t) => {
            const active = t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-[var(--color-ink)] text-[var(--color-ink)]"
                    : "border-transparent text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                )}
              >
                <t.icon size={15} /> {t.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </main>
  );
}
