import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-base)] focus-visible:ring-[var(--color-orange)] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        // Warm-white pill — the neutral primary, pops on near-black
        primary:
          "bg-[var(--color-ink)] text-[#0a0a0a] font-semibold hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(255,255,255,0.5)]",
        // Brand orange→gold neon pill — the saturated conversion CTA
        accent:
          "bg-[var(--color-orange)] text-[#120600] font-semibold hover:-translate-y-0.5 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-gold)_60%,transparent),0_14px_40px_-12px_var(--color-orange)] hover:shadow-[0_0_0_1px_var(--color-gold),0_18px_54px_-10px_var(--color-orange)]",
        solid:
          "bg-[var(--color-orange)] text-[#120600] font-semibold hover:bg-[var(--color-gold)]",
        // Hairline ghost pill on dark — visible, lifts on hover
        outline:
          "border border-[var(--color-border-bright)] bg-white/[0.02] text-[var(--color-ink)] hover:border-[var(--color-orange)] hover:bg-white/[0.05] hover:-translate-y-0.5",
        secondary:
          "border border-[var(--color-border-bright)] bg-white/[0.02] text-[var(--color-ink)] hover:border-[var(--color-orange)]",
        ghost: "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:bg-white/[0.04]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base py-3.5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export function Button({ className, variant, size, href, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href) {
    const isExternal = href.startsWith("http");
    const onClick = props.onClick as unknown as React.MouseEventHandler;
    if (isExternal) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" onClick={onClick}>
          {props.children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {props.children}
      </Link>
    );
  }
  return <button className={classes} {...props} />;
}

export { buttonVariants };
