import { NextResponse } from "next/server";
import { complete, hasAnthropicKey, MODELS } from "@/lib/ai/anthropic";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 20;

type AdVariation = { headlines: string[]; descriptions: string[] };

/** Trim to a length limit on a word boundary — never mid-word, no dangling
 *  punctuation, no "..." stubs. */
function fit(text: string, max: number): string {
  const s = text.trim().replace(/\s+/g, " ");
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut;
  return trimmed.replace(/[\s,;:.!\-–—]+$/, "");
}

function fallbackCopy(business: string, offer: string, _platform: string): AdVariation[] {
  const b = business.trim() || "Your Business";
  const o = (offer.trim() || "our services").toLowerCase();
  const bShort = fit(b, 16);
  const H = (s: string) => fit(s, 30); // Google RSA headline limit
  const D = (s: string) => fit(s, 90); // Google RSA description limit
  return [
    {
      headlines: [H(`${bShort} — Book Today`), H("Trusted Local Experts"), H("Free Quote, Fast")],
      descriptions: [
        D(`Looking for ${o}? ${b} delivers reliable results. Free quote — book online or call today.`),
        D(`Top-rated and local. Friendly service, fair pricing, real results. Get started today.`),
      ],
    },
    {
      headlines: [H(`${bShort} Can Help`), H("Get a Free Quote"), H("Local & Trusted")],
      descriptions: [
        D(`${b} makes ${o} simple. Trusted by local customers. Request your free quote in minutes.`),
        D(`Fast, professional service from ${b}. No obligation — see why locals choose us.`),
      ],
    },
    {
      headlines: [H("Same-Week Service"), H(`${bShort} Near You`), H("Book Online Now")],
      descriptions: [
        D(`Quality work without the wait. ${b} — clear pricing, great reviews. Get your free estimate.`),
        D(`Skip the guesswork. ${b} delivers results you can count on. Book your appointment today.`),
      ],
    },
  ];
}

export async function POST(req: Request) {
  // Unauthenticated + spends model tokens → cap per IP to prevent cost abuse.
  const limited = rateLimit(`ad-copy:${clientIp(req)}`, 15, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }
  let body: { business?: string; offer?: string; platform?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const business = (body.business ?? "").slice(0, 120);
  const offer = (body.offer ?? "").slice(0, 200);
  const platform = body.platform === "meta" ? "meta" : "google";
  if (!business || !offer) {
    return NextResponse.json({ error: "Please enter your business and what you're advertising." }, { status: 400 });
  }

  if (hasAnthropicKey()) {
    const limits = platform === "google"
      ? "Google Responsive Search Ads: headlines MAX 30 characters, descriptions MAX 90 characters."
      : "Meta ads: primary text concise (~125 chars), punchy headlines (~30 chars).";
    const ai = await complete({
      model: MODELS.fast,
      maxTokens: 900,
      system: `You are a senior paid-ads copywriter at PPC Guru. Generate 3 distinct ad variations. ${limits} Respect character limits strictly. Return ONLY valid JSON, no prose, in this exact shape: {"variations":[{"headlines":["..","..",".."],"descriptions":["..",".."]}]} . Make copy specific, benefit-led and compliant — no guarantees, no superlatives you can't back, no "#1".`,
      user: `Business: ${business}\nAdvertising / offer: ${offer}\nPlatform: ${platform}`,
    });
    if (ai) {
      try {
        const jsonStart = ai.indexOf("{");
        const jsonEnd = ai.lastIndexOf("}");
        const parsed = JSON.parse(ai.slice(jsonStart, jsonEnd + 1));
        if (Array.isArray(parsed.variations) && parsed.variations.length) {
          return NextResponse.json({ variations: parsed.variations, aiPowered: true });
        }
      } catch {
        /* fall through to fallback */
      }
    }
  }

  return NextResponse.json({ variations: fallbackCopy(business, offer, platform), aiPowered: false });
}
