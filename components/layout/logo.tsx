import { cn } from "@/lib/utils";

/**
 * PPC Guru brandmark — the "P" tile + wordmark from the Claude Design handoff.
 * A rounded square holds a bold "P"; the wordmark sits beside it. Tone-aware so
 * it reads on both the cream header (`light`) and the dark footer (`dark`):
 *  - light: ink tile, lime "P", ink wordmark
 *  - dark:  lime tile, ink "P", cream wordmark
 *
 * To use official artwork instead, drop it at /public/logo.svg and swap the
 * <PpcMark/> here for an <Image/>.
 */
export function PpcMark({ size = 34, tone = "light" }: { size?: number; tone?: "light" | "dark" }) {
  const bg = tone === "dark" ? "#ceff3a" : "#14170e";
  const fg = tone === "dark" ? "#14170e" : "#ceff3a";
  return (
    <span
      aria-hidden
      className="grotesk"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: bg,
        color: fg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: Math.round(size * 0.6),
        lineHeight: 1,
        letterSpacing: "-.03em",
        flexShrink: 0,
      }}
    >
      P
    </span>
  );
}

export function Logo({
  tone = "light",
  size = 34,
  className,
}: {
  tone?: "light" | "dark";
  size?: number;
  className?: string;
}) {
  const word = tone === "dark" ? "#f1efe3" : "#14170e";
  return (
    <span className={cn("inline-flex items-center", className)} style={{ gap: Math.round(size * 0.34) }}>
      <PpcMark size={size} tone={tone} />
      <span
        className="grotesk"
        style={{
          fontWeight: 900,
          fontSize: Math.round(size * 0.5),
          letterSpacing: "-.01em",
          textTransform: "uppercase",
          color: word,
          whiteSpace: "nowrap",
        }}
      >
        PPC&nbsp;Guru
      </span>
    </span>
  );
}
