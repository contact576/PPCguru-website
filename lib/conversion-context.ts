/**
 * Request-scoped signals the ad platforms' server-side conversion APIs match on
 * (Meta CAPI — lib/meta-capi.ts, OpenAI Conversions API — lib/openai-capi.ts).
 *
 * Must be read during the server action, NOT inside `after()`: headers() and
 * cookies() are gone once the response has been sent.
 */
export type ConversionContext = {
  ip?: string;
  userAgent?: string;
  sourceUrl?: string;
  /** Meta Pixel cookies. */
  fbp?: string;
  fbc?: string;
  /** OpenAI pixel: click reference + browser reference cookies. */
  oppref?: string;
  obref?: string;
  /** Visitor clicked "Decline" on the cookie notice (cookie set by ConsentSignal). */
  declined: boolean;
};

export async function readConversionContext(): Promise<ConversionContext> {
  try {
    const { headers, cookies } = await import("next/headers");
    const [h, c] = await Promise.all([headers(), cookies()]);
    const sourceUrl = h.get("referer") || undefined;
    let fbc = c.get("_fbc")?.value;
    if (!fbc && sourceUrl) {
      const fbclid = new URL(sourceUrl).searchParams.get("fbclid");
      if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    }
    return {
      ip: h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || undefined,
      userAgent: h.get("user-agent") || undefined,
      sourceUrl,
      fbp: c.get("_fbp")?.value,
      fbc,
      oppref: c.get("__oppref")?.value,
      obref: c.get("__obref")?.value,
      declined: c.get("ppcg_consent")?.value === "declined",
    };
  } catch {
    return { declined: false };
  }
}

/** Browser-generated conversion event id, shared by pixel + server so each lead counts once. */
export function cleanEventId(v: unknown): string | undefined {
  return typeof v === "string" && /^[\w-]{8,64}$/.test(v) ? v : undefined;
}
