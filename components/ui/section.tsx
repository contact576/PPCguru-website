import { cn } from "@/lib/utils";
import { Eyebrow } from "./badge";

/** Standard vertical section wrapper with consistent rhythm. */
export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/** Centered (or left) section heading with eyebrow + intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center mx-auto max-w-3xl" : "items-start text-left max-w-2xl",
        className
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-3xl md:text-5xl font-bold text-balance">{title}</h2>
      {intro ? <p className="text-lg text-[--color-ink-dim] text-pretty">{intro}</p> : null}
    </div>
  );
}
