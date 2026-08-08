/**
 * Server-only heuristic spam scoring for form submissions.
 *
 * Second line of defence behind Cloudflare Turnstile (`lib/turnstile.ts`) — and
 * the ONLY line while the Turnstile keys are unset. Every rule here is chosen to
 * be near-zero-false-positive for a GTA/Canada/USA small-business audience:
 * a real plumber filling in the audit form must never be blocked.
 *
 * Rules are additive; `SPAM_THRESHOLD` decides. Blocked submissions are dropped
 * silently (returned as success) so bots don't learn what tripped the filter.
 */

export const SPAM_THRESHOLD = 5;

/** Minimum time a human plausibly needs between the form rendering and submitting. */
const MIN_FILL_MS = 2_500;
/**
 * Beyond this the page was almost certainly scraped and replayed rather than
 * filled in a live session. Scored as a *contributing* signal, never fatal on
 * its own — a real visitor can leave a tab open overnight and submit next day.
 */
const MAX_FILL_MS = 12 * 60 * 60 * 1000;

/** Bodies that pitch services AT us — the classic agency-inbox spam. */
const PITCH_PHRASES = [
  "seo services", "seo service", "backlink", "back link", "guest post", "link building",
  "improve your ranking", "rank your website", "first page of google", "top 10 ranking",
  "we are a leading", "we are an offshore", "outsourcing", "white label", "web design services",
  "app development", "software development company", "dedicated developers", "hire developers",
  "increase your traffic", "domain expiration", "domain listing", "seo audit report attached",
  "i am writing to you", "i hope this email finds you", "i came across your website",
  "noticed your website", "your website is not ranking", "free trial of our", "unsubscribe here",
];

/** Off-topic verticals that never legitimately contact a PPC agency via the audit form. */
const OFFTOPIC_TERMS = [
  "casino", "betting", "bet365", "slot online", "judi", "togel", "poker online", "gambling",
  "crypto investment", "bitcoin investment", "forex signals", "binary option", "trading bot",
  "escort", "viagra", "cialis", "porn", "xxx", "payday loan", "loan offer", "essay writing",
  "replica watch", "counterfeit", "hacking service", "recover your lost", "bulk email",
  "cheap followers", "buy followers", "telegram @", "whatsapp +7", "sex",
];

/** Throwaway-mailbox domains. Not fatal on their own — just a strong signal. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com", "temp-mail.org",
  "yopmail.com", "trashmail.com", "getnada.com", "dispostable.com", "sharklasers.com",
  "throwawaymail.com", "maildrop.cc", "fakeinbox.com", "mailnesia.com", "spam4.me",
  "grr.la", "guerrillamailblock.com", "mytemp.email", "moakt.com", "emailondeck.com",
]);

const URL_RE = /(https?:\/\/|www\.)/gi;
const BBCODE_RE = /\[(url|link|b|i|img)[\s\]=]/i;
const HTML_LINK_RE = /<a\s|<\/a>|href\s*=/i;
/** Cyrillic / CJK / Arabic in a name or a short free-text field. */
const NON_LATIN_RE = /[Ѐ-ӿ一-鿿؀-ۿ぀-ヿ]/;
/** Adjacent-key runs a bot types when a field just needs *something*. */
const KEYBOARD_RUN_RE = /(asdf|sdfg|dfgh|fghj|ghjk|hjkl|qwer|wert|erty|rtyu|tyui|zxcv|xcvb|cvbn|wasd|qazwsx|1234|2345|abcde)/i;

export type SpamInput = {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  message?: string;
  /** Client-stamped form-render time (ms since epoch) from `<TurnstileField />`. */
  renderedAt?: string;
};

export type SpamVerdict = { spam: boolean; score: number; reasons: string[] };

/** Score a submission. Higher = more likely spam; `spam` is score >= SPAM_THRESHOLD. */
export function scoreSubmission(input: SpamInput): SpamVerdict {
  const reasons: string[] = [];
  let score = 0;
  const add = (n: number, why: string) => { score += n; reasons.push(why); };

  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim().toLowerCase();
  const message = (input.message ?? "").trim();
  const phone = (input.phone ?? "").trim();
  const website = (input.website ?? "").trim();
  const haystack = `${name} ${message} ${website}`.toLowerCase();

  /* ── Timing: humans don't fill a form in under 2.5s ─────────────────────── */
  if (input.renderedAt) {
    const started = Number(input.renderedAt);
    if (Number.isFinite(started) && started > 0) {
      const elapsed = Date.now() - started;
      if (elapsed >= 0 && elapsed < MIN_FILL_MS) add(5, `submitted in ${elapsed}ms`);
      if (elapsed > MAX_FILL_MS) add(4, "stale form timestamp (replay)");
    }
  }

  /* ── Links where links don't belong ─────────────────────────────────────── */
  const nameLinks = (name.match(URL_RE) ?? []).length;
  if (nameLinks > 0) add(6, "URL in the name field");
  if (BBCODE_RE.test(name) || BBCODE_RE.test(message)) add(6, "BBCode markup");
  if (HTML_LINK_RE.test(name) || HTML_LINK_RE.test(message)) add(6, "HTML anchor markup");

  const msgLinks = (message.match(URL_RE) ?? []).length;
  // One link is normal ("here's my site"). Three+ is a link-drop.
  if (msgLinks >= 3) add(5, `${msgLinks} URLs in the message`);
  else if (msgLinks === 2) add(2, "2 URLs in the message");

  /* ── Content ────────────────────────────────────────────────────────────── */
  const offtopic = OFFTOPIC_TERMS.filter((t) => haystack.includes(t));
  if (offtopic.length) add(6, `off-topic term: ${offtopic[0]}`);

  const pitches = PITCH_PHRASES.filter((t) => haystack.includes(t));
  if (pitches.length >= 2) add(5, `agency pitch: ${pitches.slice(0, 2).join(", ")}`);
  else if (pitches.length === 1) add(3, `agency pitch: ${pitches[0]}`);

  /* ── Name shape ─────────────────────────────────────────────────────────── */
  if (name && NON_LATIN_RE.test(name)) add(4, "non-Latin script in name");
  // Keyboard runs ("asdfgh", "qwerty", "zxcvbn") — never a real name, and the
  // vowel test alone misses them because most runs contain a vowel.
  if (KEYBOARD_RUN_RE.test(name)) add(4, "keyboard-mash name");
  // A long single token with no vowel at all ("hjklxz", "bcdfgh").
  if (/^[a-z]{7,}$/i.test(name) && !/[aeiouy]/i.test(name)) add(4, "vowel-less name");
  if (name && name === name.toUpperCase() && name.length > 12) add(1, "all-caps name");

  /* ── Email shape ────────────────────────────────────────────────────────── */
  const domain = email.split("@")[1] ?? "";
  const local = email.split("@")[0] ?? "";
  if (domain && DISPOSABLE_DOMAINS.has(domain)) add(4, `disposable domain: ${domain}`);
  // Random-string mailboxes: 12+ chars, no separator, mixed digits+letters.
  if (local.length >= 12 && !/[._-]/.test(local) && /\d/.test(local) && /[a-z]/.test(local)
      && !/^[a-z]+\d{1,4}$/i.test(local)) add(2, "random-looking email local part");
  // A "business email" that is literally our own address is a spoof attempt.
  if (domain === "ppcguru.ca") add(4, "spoofed own-domain email");

  /* ── Phone ──────────────────────────────────────────────────────────────── */
  const digits = phone.replace(/\D/g, "");
  if (digits && /^(\d)\1{6,}$/.test(digits)) add(3, "repeated-digit phone");
  if (digits && /^1?2345678/.test(digits)) add(3, "sequential phone");

  return { spam: score >= SPAM_THRESHOLD, score, reasons };
}

/** Log a blocked submission so real drops stay auditable in Vercel logs. */
export function logBlocked(where: string, verdict: SpamVerdict, input: SpamInput) {
  console.warn(
    `[spam] blocked ${where} (score ${verdict.score}): ${verdict.reasons.join(" | ")}`,
    { name: input.name, email: input.email, website: input.website },
  );
}
