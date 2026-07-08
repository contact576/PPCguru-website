import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "mono inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold uppercase tracking-[.06em] transition-all duration-200 active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-lime)] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        // Ink pill (primary) — dark olive on cream
        primary:
          "btn-shine bg-[var(--color-ink)] text-[#f1efe3] hover:-translate-y-0.5",
        // Lime CTA — the saturated conversion button (ink text on lime)
        accent:
          "btn-shine bg-[var(--color-lime)] text-[var(--color-ink)] hover:-translate-y-0.5 shadow-[0_12px_34px_rgba(206,255,58,.3)]",
        solid:
          "btn-shine bg-[var(--color-lime)] text-[var(--color-ink)] hover:-translate-y-0.5",
        // Cream/hairline outline pill on cream
        outline:
          "border border-[var(--color-border-bright)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:-translate-y-0.5",
        secondary:
          "border border-[var(--color-border-bright)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)]",
        ghost: "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]",
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
