import { NextResponse } from "next/server";
import { complete, hasAnthropicKey, MODELS } from "@/lib/ai/anthropic";

export const runtime = "nodejs";
export const maxDuration = 20;

type AdVariation = { headlines: string[]; descriptions: string[] };

function fallbackCopy(business: string, offer: string, platform: string): AdVariation[] {
  const b = business.trim() || "Your Business";
  const o = offer.trim() || "our services";
  const cap = (s: string) => s.length > 30 ? s.slice(0, 27) + "..." : s;
  return [
    {
      headlines: [cap(`${b} — Book Today`), cap(`Get ${o} Fast`), cap(`Trusted Local Experts`)],
      descriptions: [
        `Looking for ${o}? ${b} delivers fast, reliable results. Free quote — book online or call today.`.slice(0, 90),
        `Top-rated ${o} near you. Friendly service, fair pricing, real results. Get started now.`.slice(0, 90),
      ],
    },
    {
      headlines: [cap(`Need ${o}?`), cap(`${b} Can Help`), cap(`Free Quote Today`)],
      descriptions: [
        `${b} makes ${o} easy. Trusted by local customers. Request your free quote in minutes.`.slice(0, 90),
        `Fast, professional ${o} from ${b}. No obligation. See why locals choose us — book now.`.slice(0, 90),
      ],
    },
    {
      headlines: [cap(`${o} Done Right`), cap(`Same-Week Service`), cap(`Call ${b} Now`)],
      descriptions: [
        `Quality ${o} without the wait. ${b} — clear pricing, great reviews. Get your free estimate.`.slice(0, 90),
        `Skip the guesswork. ${b} delivers ${o} you can count on. Book your appointment today.`.slice(0, 90),
      ],
    },
  ];
}

export async function POST(req: Request) {
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
