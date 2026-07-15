/**
 * Server-only email helpers. `leadRecipients()` is the single source of truth
 * for where contact / lead notifications are delivered.
 *
 * Default: the team distribution list (contact + sales + marketing). Override
 * with CONTACT_TO_EMAIL — a comma-separated list, e.g.
 *   CONTACT_TO_EMAIL="contact@ppcguru.ca,sales@ppcguru.ca"
 */

const DEFAULT_RECIPIENTS = [
  "contact@ppcguru.ca",
  "sales@ppcguru.ca",
  "marketing@ppcguru.ca",
];

/** Recipients for form-submission notification emails (always ≥1 address). */
export function leadRecipients(): string[] {
  const parsed = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parsed.length ? parsed : DEFAULT_RECIPIENTS;
}

/** The "from" address used on all outbound mail. For SMTP this must match the
 *  authenticated mailbox (e.g. "PPC Guru <hello@ppcguru.ca>"). */
export function fromAddress(): string {
  return process.env.CONTACT_FROM_EMAIL || "PPC Guru <hello@ppcguru.ca>";
}

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

/** True when at least one real delivery channel (SMTP or Resend) is configured. */
export function emailConfigured(): boolean {
  return smtpConfigured() || Boolean(process.env.RESEND_API_KEY);
}

export type MailInput = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

/**
 * Single outbound-mail entry point. Prefers Hostinger SMTP (nodemailer) when
 * configured, falls back to Resend, otherwise logs. Best-effort: never throws,
 * returns true only when a provider accepted the message.
 */
export async function sendMail(msg: MailInput): Promise<boolean> {
  const from = fromAddress();

  // 1) SMTP (Hostinger) — preferred.
  if (smtpConfigured()) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const port = Number(process.env.SMTP_PORT || 465);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        // 465 = implicit TLS; 587 = STARTTLS. SMTP_SECURE overrides if set.
        secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from,
        to: Array.isArray(msg.to) ? msg.to.join(", ") : msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        replyTo: msg.replyTo,
        headers: msg.headers,
      });
      return true;
    } catch (err) {
      console.error("[email] SMTP send failed:", err instanceof Error ? err.message : err);
      // fall through to Resend if available
    }
  }

  // 2) Resend fallback.
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from,
        to: Array.isArray(msg.to) ? msg.to : [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text ?? msg.subject,
        replyTo: msg.replyTo,
        headers: msg.headers,
      });
      return true;
    } catch (err) {
      console.error("[email] Resend send failed:", err instanceof Error ? err.message : err);
    }
  }

  return false;
}

/* ── Lead autoresponder (sent TO the person who filled a form) ──────────────
   CASL-compliant: identifies the sender, states why they're getting it, and
   carries an unsubscribe path + mailing address in the footer. Best-effort —
   never throws, so a delivery hiccup can't break form submission. */

const BUSINESS = {
  name: "PPC Guru",
  email: "hello@ppcguru.ca",
  site: "https://ppcguru.ca",
  // [VERIFY-client] confirm the real mailing address for the CASL footer.
  address: "Brampton, Ontario, Canada",
};

// Colours mirror the site (ink / lime / cream) so the email feels on-brand.
const C = { ink: "#14170e", lime: "#ceff3a", cream: "#f1efe3", olive: "#5f6f17", dim: "#54564a", faint: "#8a8c72" };

function autoresponderHtml(name: string): string {
  const first = (name || "there").trim().split(/\s+/)[0];
  const unsub = `mailto:${BUSINESS.email}?subject=Unsubscribe`;
  return `<!doctype html><html><body style="margin:0;background:${C.cream};font-family:Arial,Helvetica,sans-serif;color:${C.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e3e0d0;border-radius:18px;overflow:hidden;">
        <tr><td style="background:${C.ink};padding:22px 28px;">
          <span style="color:${C.lime};font-weight:800;font-size:19px;letter-spacing:-.02em;">PPC&nbsp;Guru</span>
          <span style="color:#a9aa97;font-size:12px;"> &nbsp;·&nbsp; Google &amp; Meta Ads, done right</span>
        </td></tr>
        <tr><td style="padding:32px 28px 8px;">
          <h1 style="margin:0 0 14px;font-size:23px;line-height:1.25;">Thanks, ${first} — we've got your request. ✅</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${C.dim};">
            A real strategist (not a bot) is already reviewing what you sent. Here's what happens next:
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
            <tr><td style="padding:6px 0;font-size:15px;color:${C.ink};">✅ &nbsp;We review your ads / site &amp; find where budget is leaking</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.ink};">📞 &nbsp;We reach out within <strong>1 business day</strong> with next steps</td></tr>
            <tr><td style="padding:6px 0;font-size:15px;color:${C.ink};">🚀 &nbsp;You get a clear plan to turn spend into booked jobs</td></tr>
          </table>
          <a href="${BUSINESS.site}/free-audit" style="display:inline-block;background:${C.lime};color:${C.ink};font-weight:700;font-size:14px;text-decoration:none;padding:14px 24px;border-radius:12px;">Book your free audit call →</a>
          <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:${C.dim};">
            In the meantime, our <a href="${BUSINESS.site}/tools" style="color:${C.olive};font-weight:700;">free calculators</a> and
            <a href="${BUSINESS.site}/blog" style="color:${C.olive};font-weight:700;">latest guides</a> are worth a look.
          </p>
          <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:${C.dim};">— The PPC Guru team</p>
        </td></tr>
        <tr><td style="padding:22px 28px;border-top:1px solid #eeece0;">
          <p style="margin:0 0 6px;font-size:11px;line-height:1.6;color:${C.faint};">
            You're receiving this because you submitted a form on <a href="${BUSINESS.site}" style="color:${C.faint};">ppcguru.ca</a>.
            ${BUSINESS.name} · ${BUSINESS.address} · <a href="mailto:${BUSINESS.email}" style="color:${C.faint};">${BUSINESS.email}</a>
          </p>
          <p style="margin:0;font-size:11px;color:${C.faint};">
            <a href="${unsub}" style="color:${C.faint};text-decoration:underline;">Unsubscribe</a> — you won't hear from us again.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function autoresponderText(name: string): string {
  const first = (name || "there").trim().split(/\s+/)[0];
  return [
    `Thanks, ${first} — we've got your request.`,
    ``,
    `A real strategist is already reviewing what you sent. What happens next:`,
    `  - We review your ads / site and find where budget is leaking`,
    `  - We reach out within 1 business day with next steps`,
    `  - You get a clear plan to turn spend into booked jobs`,
    ``,
    `Book your free audit call: ${BUSINESS.site}/free-audit`,
    `Free tools: ${BUSINESS.site}/tools  ·  Guides: ${BUSINESS.site}/blog`,
    ``,
    `— The PPC Guru team`,
    ``,
    `———`,
    `You're receiving this because you submitted a form on ppcguru.ca.`,
    `${BUSINESS.name} · ${BUSINESS.address} · ${BUSINESS.email}`,
    `Unsubscribe: reply "Unsubscribe" or email ${BUSINESS.email}.`,
  ].join("\n");
}

/**
 * Send the branded welcome/autoresponder to a lead. Fire-and-forget: returns
 * false (never throws) when Resend isn't configured or delivery fails, so it
 * can't affect the form-submission result.
 */
export async function sendLeadAutoresponder(lead: { name?: string; email?: string }): Promise<boolean> {
  if (!lead.email || !emailConfigured()) return false;
  const name = lead.name || "";
  return sendMail({
    to: lead.email,
    subject: "Thanks — here's what happens next 🚀",
    html: autoresponderHtml(name),
    text: autoresponderText(name),
    headers: {
      // Improves deliverability + gives inbox providers a one-click unsubscribe.
      "List-Unsubscribe": `<mailto:${BUSINESS.email}?subject=Unsubscribe>`,
    },
  });
}
