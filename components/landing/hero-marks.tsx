/**
 * The two hero-assurance marks on /100-leads: a dimensional lime "100" tile and
 * a matching ink "$0" tile. They replace the generic lucide target / shield
 * icons — the promise IS the two numbers, so the numbers are the artwork.
 *
 * Pure SVG (no images, no JS): an extruded side face, a gradient front face and
 * a soft top highlight give the depth. `id` keeps the gradient ids unique when
 * both marks render on the same page.
 */

function Tile({
  id,
  label,
  front,
  frontLight,
  side,
  text,
  ink,
  size = 46,
}: {
  id: string;
  label: string;
  front: string;
  frontLight: string;
  side: string;
  text: string;
  /** Colour of the number on the front face. */
  ink: string;
  size?: number;
}) {
  return (
    <svg
      className="hero-mark"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
      style={{ flex: `0 0 ${size}px` }}
    >
      <defs>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0.55" y2="1">
          <stop offset="0" stopColor={frontLight} />
          <stop offset="1" stopColor={front} />
        </linearGradient>
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="33" cy="58.5" rx="21" ry="3.4" fill="#14170e" opacity="0.14" />

      {/* extruded side + bottom face, offset down-right from the front face */}
      <path
        d="M12 15.5h34a7.5 7.5 0 0 1 7.5 7.5v24a7.5 7.5 0 0 1-7.5 7.5H12A7.5 7.5 0 0 1 4.5 47V23A7.5 7.5 0 0 1 12 15.5Z"
        transform="translate(6 4.5)"
        fill={side}
      />

      {/* front face */}
      <rect x="4.5" y="9.5" width="49" height="39" rx="7.5" fill={`url(#${id}-face)`} />
      <rect x="4.5" y="9.5" width="49" height="19" rx="7.5" fill={`url(#${id}-gloss)`} />
      <rect x="4.5" y="9.5" width="49" height="39" rx="7.5" fill="none" stroke="#14170e" strokeOpacity="0.14" strokeWidth="1.5" />

      <text
        x="29"
        y="35.5"
        textAnchor="middle"
        fontFamily="'Arial Black', Inter, Aptos, sans-serif"
        fontSize={text.length > 2 ? 19 : 21}
        fontWeight="900"
        letterSpacing="-1"
        fill={ink}
      >
        {text}
      </text>
    </svg>
  );
}

/** Lime "100" — the lead target. */
export function HundredMark({ size = 46 }: { size?: number }) {
  return <Tile id="m100" label="100" text="100" front="#c3f02a" frontLight="#e9ffa0" side="#86a417" ink="#14170e" size={size} />;
}

/** Ink "$0" — the management fee if the target is missed. */
export function ZeroFeeMark({ size = 46 }: { size?: number }) {
  return <Tile id="mzero" label="$0" text="$0" front="#1e2317" frontLight="#4a5539" side="#12150d" ink="#e9ffa0" size={size} />;
}
