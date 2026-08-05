import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { sendMail, leadRecipients, emailConfigured } from "@/lib/email";
import type { KnownVisitor } from "@/lib/identity";
import { siteConfig } from "@/lib/site-config";

/**
 * Behaviour-triggered email journeys — the "they came back, so they got a mail"
 * layer, and the reason identity stitching exists at all.
 *
 * WHO CAN BE MAILED
 *   Only people who handed us their email through a form. That submission is
 *   the consent (CASL implied consent from a business enquiry), and it expires:
 *   after IMPLIED_CONSENT_DAYS we stop mailing them automatically. Anyone who
 *   clicks the one-click unsubscribe is excluded permanently, across every
 *   device we've merged under their address.
 *
 * FREQUENCY
 *   Every send is logged to `journey_sends` and each rule declares a cooldown.
 *   A visitor refreshing /pricing twenty times gets at most one email.
 *
 * COST
 *   Runs inside `after()` from the track endpoint, so none of this is on the
 *   visitor's critical path. Three indexed queries per identified pageview.
 */

/** CASL: an enquiry gives implied consent for 6 months. After that, silence. */
const IMPLIED_CONSENT_DAYS = 180;

/** Pages that signal buying intent rather than casual reading. */
const MONEY_PAGES = [/^\/pricing/, /^\/free-audit/, /^\/contact/, /^\/services\//, /^\/compare/, /^\/benchmarks/];

function isMoneyPage(path: string | null | undefined): boolean {
  if (!path) return false;
  return MONEY_PAGES.some((re) => re.test(path));
}

const DAY_MS = 86_400_000;

export type JourneyName = "return_visit" | "high_intent";

type JourneyRule = {
  name: JourneyName;
  /** Minimum days between two sends of THIS journey to the same person. */
  cooldownDays: number;
};

const RULES: Record<JourneyName, JourneyRule> = {
  // They went quiet for a few days, then came back — a real re-engagement signal.
  return_visit: { name: "return_visit", cooldownDays: 21 },
  // Repeatedly circling pricing/services in a short window — sales should call.
  high_intent: { name: "high_intent", cooldownDays: 10 },
};

/** Return-visit fires only after a genuine gap, not on a second tab. */
const RETURN_GAP_DAYS = 3;
/** High intent = this many money-page views inside the window. */
const HIGH_INTENT_HITS = 3;
const HIGH_INTENT_WINDOW_DAYS = 7;

/**
 * Master kill switch — set JOURNEYS_ENABLED=false to silence all automation.
 *
 * Also hard-requires a signing secret: without one every unsubscribe link we
 * send would be rejected on click (see `unsubConfigured`), and mailing someone
 * an opt-out that cannot work is a CASL breach. Staying silent is the safe
 * failure mode.
 */
export function journeysEnabled(): boolean {
  return process.env.JOURNEYS_ENABLED !== "false" && emailConfigured() && unsubConfigured();
}

/* ── Unsubscribe tokens ─────────────────────────────────────────────────── */

/**
 * True once real secret material exists. Without it `unsubSecret()` collapses to
 * the bare constant below — which is public (this file is on GitHub), so anyone
 * could mint a valid token for any address and mass-unsubscribe the list. Both
 * signing and verification refuse to operate in that state rather than trusting
 * a key everyone knows.
 */
function unsubConfigured(): boolean {
  return Boolean(process.env.IDENTITY_SECRET || process.env.ADMIN_PASSWORD);
}

function unsubSecret(): string {
  return `ppcguru-unsub::${process.env.IDENTITY_SECRET || process.env.ADMIN_PASSWORD || ""}`;
}

/** Signed, self-contained opt-out token — no DB lookup needed to honour it. */
export function unsubscribeToken(email: string): string {
  const e = email.trim().toLowerCase();
  const mac = crypto.createHmac("sha256", unsubSecret()).update(e).digest("hex").slice(0, 32);
  return `${Buffer.from(e).toString("base64url")}.${mac}`;
}

/** Verify an opt-out token and recover the email it was issued for. */
export function verifyUnsubscribeToken(token: string | null | undefined): string | null {
  if (!token || !unsubConfigured()) return null;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  try {
    const email = Buffer.from(token.slice(0, idx), "base64url").toString("utf8").trim().toLowerCase();
    const mac = token.slice(idx + 1);
    const expected = crypto.createHmac("sha256", unsubSecret()).update(email).digest("hex").slice(0, 32);
    const a = Buffer.from(mac);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    return email;
  } catch {
    return null;
  }
}

function unsubscribeUrl(email: string): string {
  return `${siteConfig.url.replace(/\/$/, "")}/api/journeys/unsubscribe?t=${unsubscribeToken(email)}`;
}

/** Mark every device under this email as opted out. Returns true on success. */
export async function unsubscribeEmail(email: string): Promise<boolean> {
  const sb = supabaseAdmin();
  if (!sb) return false;
  try {
    const { error } = await sb
      .from("visitor_identities")
      .update({ unsubscribed_at: new Date().toISOString() })
      .ilike("email", email.trim().toLowerCase());
    return !error;
  } catch {
    return false;
  }
}

/* ── Email templates ────────────────────────────────────────────────────── */

const C = { ink: "#14170e", lime: "#ceff3a", cream: "#f1efe3", olive: "#5f6f17", dim: "#54564a", faint: "#8a8c72" };
const SITE = siteConfig.url.replace(/\/$/, "");

function shell(inner: string, email: string): string {
  return `<!doctype html><html><body style="margin:0;background:${C.cream};font-family:Arial,Helvetica,sans-serif;color:${C.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e3e0d0;border-radius:18px;overflow:hidden;">
        <tr><td style="background:${C.ink};padding:22px 28px;">
          <span style="color:${C.lime};font-weight:800;font-size:19px;letter-spacing:-.02em;">PPC&nbsp;Guru</span>
          <span style="color:#a9aa97;font-size:12px;"> &nbsp;·&nbsp; Google &amp; Meta Ads, done right</span>
        </td></tr>
        <tr><td style="padding:32px 28px 8px;">${inner}</td></tr>
        <tr><td style="padding:22px 28px;border-top:1px solid #eeece0;">
          <p style="margin:0 0 6px;font-size:11px;line-height:1.6;color:${C.faint};">
            You're receiving this because you asked us to look at your ads on
            <a href="${SITE}" style="color:${C.faint};">ppcguru.ca</a>.
            PPC Guru · Toronto, Ontario, Canada · <a href="mailto:contact@ppcguru.ca" style="color:${C.faint};">contact@ppcguru.ca</a>
          </p>
          <p style="margin:0;font-size:11px;color:${C.faint};">
            <a href="${unsubscribeUrl(email)}" style="color:${C.faint};text-decoration:underline;">Unsubscribe</a> — one click, no questions.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function cta(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${C.lime};color:${C.ink};font-weight:700;font-size:14px;text-decoration:none;padding:14px 24px;border-radius:12px;">${label}</a>`;
}

function firstName(name: string | null): string {
  return (name || "there").trim().split(/\s+/)[0] || "there";
}

/* ── The rules ──────────────────────────────────────────────────────────── */

type EventLite = { path: string | null; created_at: string; event: string };

type Trigger = {
  journey: JourneyName;
  subject: string;
  html: string;
  text: string;
  /** Why sales should care — used in the internal alert. */
  alert: string;
  meta: Record<string, unknown>;
};

function returnVisitTrigger(v: KnownVisitor, path: string, daysAway: number): Trigger {
  const first = firstName(v.name);
  const inner = `
    <h1 style="margin:0 0 14px;font-size:23px;line-height:1.25;">Welcome back, ${first} 👋</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${C.dim};">
      You were just back on our site after a little while away. If you're still weighing up your ads,
      the offer we made you hasn't gone anywhere — a free, no-obligation account audit where we show you
      exactly where budget is leaking before you spend another dollar.
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.dim};">
      It takes 20 minutes and you keep the findings either way.
    </p>
    ${cta(`${SITE}/free-audit`, "Book your free audit →")}
    <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:${C.dim};">
      Or just reply to this email with what you're stuck on — a strategist reads it, not a bot.
    </p>
    <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:${C.dim};">— The PPC Guru team</p>`;
  return {
    journey: "return_visit",
    subject: `Welcome back, ${first} — your free audit is still open`,
    html: shell(inner, v.email),
    text: [
      `Welcome back, ${first}.`,
      ``,
      `You were just back on ppcguru.ca after a little while away. If you're still weighing`,
      `up your ads, your free no-obligation account audit is still open — we show you exactly`,
      `where budget is leaking before you spend another dollar. 20 minutes, findings are yours`,
      `either way.`,
      ``,
      `Book it: ${SITE}/free-audit`,
      ``,
      `Or just reply to this email with what you're stuck on.`,
      ``,
      `— The PPC Guru team`,
      ``,
      `———`,
      `You're receiving this because you asked us to look at your ads on ppcguru.ca.`,
      `PPC Guru · Toronto, Ontario, Canada · contact@ppcguru.ca`,
      `Unsubscribe: ${unsubscribeUrl(v.email)}`,
    ].join("\n"),
    alert: `Returned after ${daysAway} day${daysAway === 1 ? "" : "s"} away — landed on ${path}`,
    meta: { daysAway, path },
  };
}

function highIntentTrigger(v: KnownVisitor, path: string, hits: number): Trigger {
  const first = firstName(v.name);
  const inner = `
    <h1 style="margin:0 0 14px;font-size:23px;line-height:1.25;">Still comparing, ${first}?</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${C.dim};">
      You've been through our pricing and services a few times this week — which usually means you're
      close, but something hasn't been answered yet.
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.dim};">
      Rather than guess, let's just talk. Bring the account, we'll tell you straight whether we'd
      actually beat what you've got. If we wouldn't, we'll say so.
    </p>
    ${cta(`${SITE}/contact`, "Grab a 20-minute call →")}
    <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:${C.dim};">
      Prefer numbers first? Our <a href="${SITE}/tools" style="color:${C.olive};font-weight:700;">free calculators</a>
      and <a href="${SITE}/benchmarks" style="color:${C.olive};font-weight:700;">industry benchmarks</a> are open, no form.
    </p>
    <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:${C.dim};">— The PPC Guru team</p>`;
  return {
    journey: "high_intent",
    subject: `${first} — want us to just look at the account?`,
    html: shell(inner, v.email),
    text: [
      `Still comparing, ${first}?`,
      ``,
      `You've been through our pricing and services a few times this week — which usually`,
      `means you're close, but something hasn't been answered yet.`,
      ``,
      `Rather than guess, let's talk. Bring the account and we'll tell you straight whether`,
      `we'd actually beat what you've got. If we wouldn't, we'll say so.`,
      ``,
      `Book a 20-minute call: ${SITE}/contact`,
      `Free calculators: ${SITE}/tools  ·  Benchmarks: ${SITE}/benchmarks`,
      ``,
      `— The PPC Guru team`,
      ``,
      `———`,
      `You're receiving this because you asked us to look at your ads on ppcguru.ca.`,
      `PPC Guru · Toronto, Ontario, Canada · contact@ppcguru.ca`,
      `Unsubscribe: ${unsubscribeUrl(v.email)}`,
    ].join("\n"),
    alert: `${hits} money-page views in ${HIGH_INTENT_WINDOW_DAYS} days — latest ${path}`,
    meta: { hits, path, windowDays: HIGH_INTENT_WINDOW_DAYS },
  };
}

/* ── Engine ─────────────────────────────────────────────────────────────── */

/** Newest send of `journey` for this person, or null. */
async function lastSent(email: string, journey: JourneyName): Promise<Date | null> {
  const sb = supabaseAdmin();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("journey_sends")
      .select("created_at")
      .ilike("email", email)
      .eq("journey", journey)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.created_at ? new Date(data.created_at as string) : null;
  } catch {
    return null;
  }
}

async function logSend(t: Trigger, v: KnownVisitor, path: string): Promise<void> {
  const sb = supabaseAdmin();
  if (!sb) return;
  try {
    await sb.from("journey_sends").insert({
      journey: t.journey,
      lead_id: v.leadId,
      email: v.email,
      path,
      meta: t.meta,
    });
  } catch {
    /* the send already happened; losing the log only risks an early repeat */
  }
}

/** Tell the team a known lead is live on the site right now. */
async function alertSales(t: Trigger, v: KnownVisitor): Promise<void> {
  await sendMail({
    to: leadRecipients(),
    replyTo: v.email,
    subject: `🔥 ${v.name || v.email} is back on the site — ${t.journey.replace("_", " ")}`,
    text: [
      `A known lead is active on ppcguru.ca right now.`,
      ``,
      `Name:    ${v.name || "—"}`,
      `Email:   ${v.email}`,
      `Signal:  ${t.alert}`,
      ``,
      `They've been sent the "${t.journey}" email automatically.`,
      `Full history: ${SITE}/admin/people`,
    ].join("\n"),
  });
}

/**
 * Evaluate every journey for one identified pageview. Safe to call on every
 * event — it exits in microseconds for anonymous or ineligible traffic.
 *
 * Call inside `after()`: it does real I/O and must never delay the response.
 */
export async function runJourneys(input: {
  visitor: KnownVisitor;
  event: string;
  path?: string | null;
}): Promise<JourneyName | null> {
  if (!journeysEnabled()) return null;
  if (input.event !== "pageview") return null; // clicks are noise for this

  const sb = supabaseAdmin();
  if (!sb) return null;
  const v = input.visitor;
  const path = input.path || "/";
  const now = Date.now();

  try {
    // 1) Consent gate — opted out, or implied consent has aged out.
    const { data: ident } = await sb
      .from("visitor_identities")
      .select("identified_at, unsubscribed_at")
      .ilike("email", v.email)
      .order("identified_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (ident?.unsubscribed_at) return null;
    if (ident?.identified_at) {
      const age = (now - new Date(ident.identified_at as string).getTime()) / DAY_MS;
      if (age > IMPLIED_CONSENT_DAYS) return null;
    }

    // 2) Their recent history (the current pageview is already written).
    const since = new Date(now - HIGH_INTENT_WINDOW_DAYS * DAY_MS).toISOString();
    const { data: recent } = await sb
      .from("visitor_events")
      .select("path, created_at, event")
      .eq("lead_id", v.leadId)
      .order("created_at", { ascending: false })
      .limit(200);
    const events = (recent ?? []) as EventLite[];

    // 3) Rules, most valuable first — at most one email per pageview.
    let trigger: Trigger | null = null;

    // return_visit: gap between this visit and the one before it.
    const prior = events.slice(1).find((e) => e.created_at);
    if (prior) {
      const gapDays = (now - new Date(prior.created_at).getTime()) / DAY_MS;
      if (gapDays >= RETURN_GAP_DAYS) {
        trigger = returnVisitTrigger(v, path, Math.round(gapDays));
      }
    }

    // high_intent outranks it — a hot lead beats a re-engagement nudge.
    const moneyHits = events.filter((e) => e.event === "pageview" && e.created_at >= since && isMoneyPage(e.path)).length;
    if (moneyHits >= HIGH_INTENT_HITS) {
      trigger = highIntentTrigger(v, path, moneyHits);
    }

    if (!trigger) return null;

    // 4) Frequency cap.
    const rule = RULES[trigger.journey];
    const last = await lastSent(v.email, trigger.journey);
    if (last && now - last.getTime() < rule.cooldownDays * DAY_MS) return null;

    // 5) Send — visitor first, then the team. Log regardless of the alert.
    const sent = await sendMail({
      to: v.email,
      subject: trigger.subject,
      html: trigger.html,
      text: trigger.text,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl(v.email)}>, <mailto:contact@ppcguru.ca?subject=Unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (!sent) return null;

    await logSend(trigger, v, path);
    await alertSales(trigger, v);
    return trigger.journey;
  } catch (err) {
    console.error("[journeys] failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
