import { NextResponse } from "next/server";
import { complete, hasAnthropicKey, MODELS } from "@/lib/ai/anthropic";

export const runtime = "nodejs";
export const maxDuration = 30;

type Signal = { label: string; ok: boolean; detail: string };

function normalizeUrl(input: string): string | null {
  try {
    const u = new URL(input.startsWith("http") ? input : `https://${input}`);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** Fetch the page and extract real, defensible on-page signals (no AI). */
async function gatherSignals(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  const started = Date.now();
  let html = "";
  let status = 0;
  let isHttps = url.startsWith("https://");
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "PPCGuru-Audit/1.0 (+https://ppcguru.ca)" },
      redirect: "follow",
    });
    status = res.status;
    isHttps = res.url.startsWith("https://");
    html = await res.text();
  } finally {
    clearTimeout(timeout);
  }
  const ttfbish = Date.now() - started;

  const lower = html.toLowerCase();
  const has = (re: RegExp) => re.test(html);
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const h1Count = (html.match(/<h1[\b>]/gi) || []).length;

  const signals: Signal[] = [
    { label: "HTTPS secure", ok: isHttps, detail: isHttps ? "Served over HTTPS." : "Not served over HTTPS — a trust and SEO risk." },
    { label: "Page title", ok: !!titleMatch?.[1]?.trim(), detail: titleMatch?.[1]?.trim() ? `“${titleMatch[1].trim().slice(0, 70)}”` : "Missing <title> tag." },
    { label: "Meta description", ok: !!descMatch?.[1]?.trim(), detail: descMatch?.[1]?.trim() ? "Present." : "Missing meta description — hurts click-through from search." },
    { label: "Single H1", ok: h1Count === 1, detail: h1Count === 1 ? "Exactly one H1." : `${h1Count} H1 tags found (ideal: 1).` },
    { label: "Mobile viewport", ok: has(/<meta[^>]+name=["']viewport["']/i), detail: has(/viewport/i) ? "Responsive viewport set." : "No viewport meta — likely not mobile-optimized." },
    { label: "Structured data (schema)", ok: lower.includes("application/ld+json"), detail: lower.includes("application/ld+json") ? "JSON-LD schema detected." : "No schema markup — missing rich-result opportunities." },
    { label: "Google Analytics / Tag", ok: /gtag\(|googletagmanager|google-analytics/i.test(html), detail: /gtag\(|googletagmanager|google-analytics/i.test(html) ? "Google tag detected." : "No Google Analytics/Tag detected — you may be flying blind." },
    { label: "Google Ads conversion", ok: /aw-\d|google_conversion|gtag\([^)]*aw-/i.test(html), detail: /aw-\d|google_conversion/i.test(html) ? "Google Ads tag detected." : "No Google Ads conversion tag detected." },
    { label: "Meta Pixel", ok: /fbq\(|connect\.facebook\.net/i.test(html), detail: /fbq\(|connect\.facebook\.net/i.test(html) ? "Meta Pixel detected." : "No Meta Pixel detected — Meta ads can't optimize without it." },
    { label: "Lead capture form", ok: /<form[\b>]/i.test(html), detail: /<form/i.test(html) ? "A form is present." : "No form detected on the page." },
    { label: "Fast initial response", ok: ttfbish < 1200, detail: `Server responded in ~${ttfbish}ms${ttfbish < 1200 ? "." : " — consider performance work."}` },
  ];

  const passed = signals.filter((s) => s.ok).length;
  const score = Math.round((passed / signals.length) * 100);
  return { status, score, signals, title: titleMatch?.[1]?.trim() ?? "" };
}

function fallbackNarrative(score: number, signals: Signal[]) {
  const wins = signals.filter((s) => s.ok).map((s) => s.label);
  const gaps = signals.filter((s) => !s.ok);
  const lines = [
    `Your page scored ${score}/100 on our quick on-page check.`,
    wins.length ? `Strengths: ${wins.slice(0, 4).join(", ")}.` : "",
    gaps.length
      ? `Top opportunities: ${gaps.slice(0, 4).map((g) => g.label.toLowerCase()).join(", ")}. ${gaps.find((g) => /pixel|conversion|analytics/i.test(g.label)) ? "Missing tracking is the most urgent — without it, your ad platforms can't optimize and you can't measure ROI." : "Fixing these improves how both users and search engines experience your site."}`
      : "No major on-page issues detected.",
    "This is a fast, directional check. A full audit reviews your live ad accounts, Quality Score, wasted spend and conversion tracking in depth.",
  ];
  return lines.filter(Boolean).join(" ");
}

export async function POST(req: Request) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const url = normalizeUrl(body.url ?? "");
  if (!url) return NextResponse.json({ error: "Please enter a valid website URL." }, { status: 400 });

  let data;
  try {
    data = await gatherSignals(url);
  } catch {
    return NextResponse.json({ error: "We couldn't reach that URL. Check the address and try again." }, { status: 422 });
  }

  let narrative: string;
  let aiPowered = false;
  if (hasAnthropicKey()) {
    const ai = await complete({
      model: MODELS.audit,
      maxTokens: 700,
      system:
        "You are a senior performance-marketing auditor at PPC Guru. You will be given REAL on-page signals measured from a prospect's website. Write a concise, plain-English audit (120–180 words) for a non-technical business owner. ONLY reference the signals provided — do NOT invent metrics, ad-account data, wasted-spend figures, or Quality Scores you cannot see. Prioritize the most business-critical gaps (especially missing conversion tracking/pixels). End by noting a full audit reviews their live ad accounts. Be direct and helpful, not salesy.",
      user: `Measured signals for ${url} (score ${data.score}/100):\n${data.signals.map((s) => `- ${s.label}: ${s.ok ? "OK" : "ISSUE"} — ${s.detail}`).join("\n")}`,
    });
    if (ai) {
      narrative = ai;
      aiPowered = true;
    } else {
      narrative = fallbackNarrative(data.score, data.signals);
    }
  } else {
    narrative = fallbackNarrative(data.score, data.signals);
  }

  return NextResponse.json({ url, score: data.score, title: data.title, signals: data.signals, narrative, aiPowered });
}
