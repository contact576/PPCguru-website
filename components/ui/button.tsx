import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-orange)] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        // Editorial black pill (Figma primary)
        primary:
          "bg-[var(--color-ink)] text-white hover:bg-[#262622] hover:-translate-y-0.5",
        // Brand orange pill — the saturated conversion CTA
        accent:
          "bg-[var(--color-orange)] text-white font-semibold hover:bg-[var(--color-orange-deep)] hover:-translate-y-0.5 shadow-[0_8px_24px_-10px_var(--color-orange)]",
        solid:
          "bg-[var(--color-orange)] text-white hover:bg-[var(--color-orange-deep)]",
        // White pill with hairline border
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
