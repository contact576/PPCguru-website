import { cn } from "@/lib/utils";

/** Inline SVG wordmark — a funnel glyph + "PPC Guru" in the display font. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9b7bff" />
            <stop offset="1" stopColor="#5ee7f7" />
          </linearGradient>
        </defs>
        <path
          d="M4 5h24l-8 11v8l-8 4v-12L4 5z"
          stroke="url(#logoGrad)"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="color-mix(in srgb, #7c5cff 14%, transparent)"
        />
        <circle cx="16" cy="9" r="1.6" fill="#5ee7f7" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight text-[--color-ink]">
        PPC<span className="text-gradient">Guru</span>
      </span>
    </span>
  );
}
