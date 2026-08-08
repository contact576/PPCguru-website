import { NextRequest, NextResponse } from "next/server";
import { verifyUnsubscribeToken, unsubscribeEmail } from "@/lib/journeys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-click opt-out for behavioural journey emails (lib/journeys.ts).
 *
 * The token is an HMAC of the address, so honouring it needs no session and no
 * lookup — which is exactly what CASL and RFC 8058 want: the link must work
 * from a cold click in any mail client, with no login and no confirmation step.
 *
 *   GET  → human clicked the footer link  → opt out, show a confirmation page
 *   POST → inbox provider's one-click     → opt out, 204, no body
 *
 * Opting out applies to the ADDRESS, so every device we've merged under it goes
 * quiet — not just the browser the click came from.
 */

async function optOut(req: NextRequest): Promise<{ ok: boolean; email: string | null }> {
  const token = req.nextUrl.searchParams.get("t");
  const email = verifyUnsubscribeToken(token);
  if (!email) return { ok: false, email: null };
  const ok = await unsubscribeEmail(email);
  return { ok, email };
}

function page(title: string, body: string, status: number) {
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} · PPC Guru</title></head>
<body style="margin:0;background:#f1efe3;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#14170e;">
<div style="max-width:520px;margin:12vh auto;padding:0 20px;text-align:center;">
  <div style="background:#fff;border:1px solid #e3e0d0;border-radius:18px;padding:36px 28px;">
    <div style="font-weight:800;font-size:19px;letter-spacing:-.02em;">PPC&nbsp;Guru</div>
    <h1 style="font-size:22px;line-height:1.3;margin:18px 0 10px;">${title}</h1>
    <p style="font-size:15px;line-height:1.6;color:#54564a;margin:0;">${body}</p>
    <a href="https://ppcguru.ca" style="display:inline-block;margin-top:22px;background:#ceff3a;color:#14170e;font-weight:700;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:12px;">Back to ppcguru.ca</a>
  </div>
</div></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: NextRequest) {
  const { ok, email } = await optOut(req);
  if (!email) {
    return page(
      "That link didn't work",
      "This unsubscribe link is invalid or has been altered. Email <a href=\"mailto:contact@ppcguru.ca?subject=Unsubscribe\" style=\"color:#5f6f17;font-weight:700;\">contact@ppcguru.ca</a> and we'll take you off manually — same day.",
      400
    );
  }
  if (!ok) {
    return page(
      "We couldn't complete that",
      "Something went wrong on our end. Email <a href=\"mailto:contact@ppcguru.ca?subject=Unsubscribe\" style=\"color:#5f6f17;font-weight:700;\">contact@ppcguru.ca</a> and we'll remove you manually.",
      500
    );
  }
  return page(
    "You're unsubscribed ✅",
    "We won't send you any more automated emails. A real person may still reply if you contact us directly — that's it.",
    200
  );
}

/**
 * RFC 8058 one-click, triggered by Gmail/Outlook's own unsubscribe button.
 *
 * 400 is reserved for a genuinely bad token. A valid token we failed to honour
 * is a 500 — mail providers retry those, and reporting our own outage as a
 * malformed request would silently drop a real opt-out.
 */
export async function POST(req: NextRequest) {
  const { ok, email } = await optOut(req);
  if (!email) return new NextResponse(null, { status: 400 });
  return new NextResponse(null, { status: ok ? 204 : 500 });
}
