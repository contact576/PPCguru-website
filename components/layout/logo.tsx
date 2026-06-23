import { cn } from "@/lib/utils";

/**
 * PPC Guru brandmark — recreated as vector from the supplied logo: a smiling
 * guru in an orange/gold turban formed as a lightbulb, plus the "PPC GURU.CA"
 * wordmark. To use the official artwork instead, drop it at /public/logo.svg
 * and swap <LogoMark/> for an <Image/>.
 */
export function LogoMark({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * (56 / 48)}
      viewBox="0 0 48 56"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* bulb base */}
      <rect x="18" y="47.5" width="12" height="2.6" rx="1.3" fill="#2b2b2b" />
      <rect x="19.6" y="51.6" width="8.8" height="2.6" rx="1.3" fill="#2b2b2b" />
      {/* face / bulb glass */}
      <path d="M24 6C13.5 6 7 14 7 23c0 7 4.4 12 8.4 17.5h17.2C36.6 35 41 30 41 23 41 14 34.5 6 24 6Z" fill="#f6cbb0" />
      {/* turban — gold side band */}
      <path d="M9.2 20.5C12 11.8 17 6 24 6c-4 3.2-7.6 8-9.6 15.6-2 .2-3.8-.3-5.2-1.1Z" fill="#f4a100" />
      {/* turban — orange crown */}
      <path d="M24 6c7 0 12.8 5.6 15 13.4-5.6-3.8-10.8-3.6-15-1.2C21.8 13 21.8 9 24 6Z" fill="#e8612a" />
      {/* turban — front wrap */}
      <path d="M14.4 21.6c4-4.6 14.4-5.4 19.2-1-3 3.8-15 4.6-19.2 1Z" fill="#e8612a" />
      {/* smiling eyes */}
      <path d="M15.5 30.5q3.2-3 6.4 0" stroke="#2b2b2b" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      <path d="M26 30.5q3.2-3 6.4 0" stroke="#2b2b2b" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      {/* mustache */}
      <path d="M15.5 36c3.2 4.2 6.2 4.2 8.5 2 2.3 2.2 5.3 2.2 8.5-2-3 5-15 5-17 0Z" fill="#2b2b2b" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={30} />
      <span className="font-display text-lg font-extrabold tracking-tight text-[var(--color-ink)]">
        PPC&nbsp;GURU<span className="text-[var(--color-orange)]">.CA</span>
      </span>
    </span>
  );
}
