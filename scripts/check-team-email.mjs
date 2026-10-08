// Offline checks. All SMTP/Resend calls are mocked; no credentials or network.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const compiled = ts.transpileModule(readFileSync("lib/email.ts", "utf8"), {
  fileName: "lib/email.ts",
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
});
let checks = 0;
const team = ["sales@ppcguru.ca", "contact@ppcguru.ca", "marketing@ppcguru.ca"];

function harness(overrides = {}) {
  const env = { SMTP_HOST: "smtp.example.invalid", SMTP_USER: "hello@ppcguru.ca", SMTP_PASS: "offline", ...overrides.env };
  const config = { accepted: null, resendErrors: [], ...overrides };
  const calls = { smtp: [], resend: [], verify: 0 };
  const imports = {
    nodemailer: { createTransport: () => ({
      async sendMail(message) {
        calls.smtp.push(message);
        return { accepted: config.accepted ?? message.to.split(", "), rejected: [] };
      },
      async verify() { calls.verify++; return true; },
    }) },
    resend: { Resend: class {
      emails = { send: async (message) => {
        calls.resend.push(message);
        return { error: config.resendErrors.shift() ?? null };
      } };
    } },
  };
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module, exports: module.exports, process: { env },
    console: { warn() {}, error() {}, info() {}, log() {} },
    fetch() { throw new Error("Live network forbidden"); },
    require(name) {
      assert.ok(Object.hasOwn(imports, name), `Unmocked import refused: ${name}`);
      return imports[name];
    },
  }, { timeout: 5000 });
  return { mail: module.exports, calls, env, config };
}

async function check(name, run) {
  await run(); checks++; console.log(`PASS ${name}`);
}

await check("all team inboxes cannot be omitted by CONTACT_TO_EMAIL", async () => {
  for (const configured of [undefined, "", "marketing@ppcguru.ca", " Marketing@ppcguru.ca, SALES@ppcguru.ca, sales@ppcguru.ca ", "owner@ppcguru.ca"]) {
    const h = harness({ env: { CONTACT_TO_EMAIL: configured } });
    const recipients = Array.from(h.mail.leadRecipients());
    assert.ok(team.every((recipient) => recipients.includes(recipient)));
    assert.equal(recipients.length, new Set(recipients).size);
    if (configured === "owner@ppcguru.ca") assert.ok(recipients.includes("owner@ppcguru.ca"));
  }
});

await check("explicit Resend selection sends complete team list without SMTP", async () => {
  const h = harness({ env: { EMAIL_PROVIDER: "resend", RESEND_API_KEY: "offline", CONTACT_TO_EMAIL: "marketing@ppcguru.ca" } });
  const to = h.mail.leadRecipients();
  assert.equal(await h.mail.sendMail({ to, subject: "Offline team notification", replyTo: "lead@ppcguru.ca" }), true);
  await h.mail.probeEmailHealth();
  assert.equal(h.calls.smtp.length + h.calls.verify, 0);
  assert.deepEqual(Array.from(h.calls.resend[0].to), Array.from(to));
  assert.equal(h.calls.resend[0].replyTo, "lead@ppcguru.ca");
});

await check("every lead source includes all three team inboxes", () => {
  for (const configured of ["", "sales@ppcguru.ca,Contact@ppcguru.ca", "owner@ppcguru.ca", "MARKETING@ppcguru.ca,contact@ppcguru.ca"]) {
    const h = harness({ env: { CONTACT_TO_EMAIL: configured } });
    const recipients = Array.from(h.mail.leadRecipients("landing:google-meta-ads"));
    assert.ok(team.every((address) => recipients.includes(address)));
    assert.equal(recipients.length, new Set(recipients).size);
    if (configured === "sales@ppcguru.ca,Contact@ppcguru.ca") {
      for (const source of [undefined, "contact", "landing:100-leads", "landing:gta-marketing-agency", "landing:seo-visibility"]) {
        assert.deepEqual(Array.from(h.mail.leadRecipients(source)), team);
      }
    }
  }
});

await check("recipient progress records only SMTP acknowledgments on partial failure", async () => {
  const h = harness({ accepted: ["sales@ppcguru.ca"] });
  const accepted = [];
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline", onAccepted: (addresses) => accepted.push(...addresses) }), false);
  assert.deepEqual(accepted, ["sales@ppcguru.ca"]);
});

await check("recipient progress combines SMTP and fallback acknowledgment without duplicates", async () => {
  const h = harness({ accepted: ["sales@ppcguru.ca"], env: { RESEND_API_KEY: "offline" } });
  const accepted = [];
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline", onAccepted: (addresses) => accepted.push(...addresses) }), true);
  assert.deepEqual(accepted, team);
});

await check("rescue acknowledges marketing only and cannot imply other inboxes succeeded", async () => {
  const h = harness({ env: { EMAIL_PROVIDER: "resend", RESEND_API_KEY: "offline" }, resendErrors: [{ message: "domain is not verified" }, null] });
  const accepted = [];
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline", rescue: true, onAccepted: (addresses) => accepted.push(...addresses) }), false);
  assert.deepEqual(accepted, ["marketing@ppcguru.ca"]);
});

await check("explicit Resend selection without key never falls back to suspended SMTP", async () => {
  const h = harness({ env: { EMAIL_PROVIDER: "resend" } });
  assert.equal(h.mail.emailConfigured(), false);
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline" }), false);
  assert.equal(h.calls.smtp.length, 0);
});

await check("production never authenticates to SMTP even with legacy credentials", async () => {
  const h = harness({ env: { NODE_ENV: "production", RESEND_API_KEY: "offline" } });
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline" }), true);
  await h.mail.probeEmailHealth();
  assert.equal(h.calls.smtp.length + h.calls.verify, 0);
  assert.deepEqual(Array.from(h.calls.resend[0].to), team);
});

await check("default SMTP transport still succeeds when every recipient is accepted", async () => {
  const h = harness();
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline" }), true);
  assert.equal(h.calls.smtp.length, 1);
});

await check("partial SMTP acceptance cannot claim full delivery", async () => {
  const h = harness({ accepted: ["sales@ppcguru.ca"] });
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline" }), false);
});

await check("Resend fallback retries only the SMTP-rejected recipients", async () => {
  const h = harness({ accepted: [{ address: "SALES@ppcguru.ca" }], env: { RESEND_API_KEY: "offline" } });
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline" }), true);
  assert.deepEqual(Array.from(h.calls.resend[0].to), ["contact@ppcguru.ca", "marketing@ppcguru.ca"]);
});

await check("owner-only rescue cannot claim sales and contact received notification", async () => {
  const h = harness({
    env: { EMAIL_PROVIDER: "resend", RESEND_API_KEY: "offline", CONTACT_TO_EMAIL: "marketing@ppcguru.ca" },
    resendErrors: [{ message: "The ppcguru.ca domain is not verified" }, null],
  });
  const result = await h.mail.sendTestNotification();
  assert.equal(result.ok, false);
  assert.match(result.detail, /Not all intended recipients/);
  assert.deepEqual(Array.from(h.calls.resend[1].to), ["marketing@ppcguru.ca"]);
  assert.ok(team.every((recipient) => h.calls.resend[0].to.includes(recipient)));
});

await check("a rescue can complete delivery only when owner is the sole remaining recipient", async () => {
  const h = harness({
    accepted: team.slice(0, 2),
    env: { RESEND_API_KEY: "offline" },
    resendErrors: [{ message: "domain is not verified" }, null],
  });
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline", rescue: true }), true);
});

await check("Google + Meta acknowledgement matches the growth plan and links directly to booking", async () => {
  const h = harness();
  assert.equal(await h.mail.sendLeadAutoresponder(
    { name: "Offline Person", email: "offline.person@example.invalid" },
    { source: "landing:google-meta-ads" },
  ), true);
  const message = h.calls.smtp[0];
  const bookingUrl = "https://ppcguru.ca/google-ads-and-meta-ads/thank-you#book";
  assert.ok(message.html.includes(`href="${bookingUrl}"`));
  assert.ok(message.text.includes(`Book your strategy call: ${bookingUrl}`));
  for (const body of [message.html, message.text]) {
    assert.ok(body.includes("Google Ads + Meta Ads growth-plan request"));
    assert.ok(body.includes("Book your strategy call"));
    assert.ok(body.includes("Google Ads and Meta Ads growth plan"));
    assert.ok(body.includes("We review your goals, offer and current setup"));
    assert.ok(!body.includes("where budget is leaking"));
    assert.ok(!body.includes("/free-audit"));
    assert.doesNotMatch(body, /100[ -](qualified[ -])?leads|guarantee/i);
  }
  const url = new URL(bookingUrl);
  assert.equal(url.search, "", "booking link must not carry contact details or tracking identifiers");
  assert.equal(url.hash, "#book");
});

await check("existing and unknown sources retain the original acknowledgement and audit CTA", async () => {
  const lead = { name: "Offline Person", email: "offline.person@example.invalid" };
  const baseline = harness();
  await baseline.mail.sendLeadAutoresponder(lead);
  const original = baseline.calls.smtp[0];
  assert.ok(original.html.includes('href="https://ppcguru.ca/free-audit"'));
  assert.ok(original.text.includes("Book your free audit call: https://ppcguru.ca/free-audit"));
  assert.ok(original.text.includes("Thanks, Offline — we've got your request."));
  assert.ok(original.text.includes("You get a clear plan to turn spend into booked jobs"));
  assert.ok(original.html.includes("We review your ads / site &amp; find where budget is leaking"));
  assert.ok(original.text.includes("We review your ads / site and find where budget is leaking"));
  for (const source of ["contact", "landing:100-leads", "landing:gta-marketing-agency", "landing:seo-visibility", "https://untrusted.invalid/booking"]) {
    const h = harness();
    await h.mail.sendLeadAutoresponder(lead, { source, bookingUrl: "https://untrusted.invalid/booking" });
    assert.equal(h.calls.smtp[0].html, original.html, source);
    assert.equal(h.calls.smtp[0].text, original.text, source);
    assert.equal(h.calls.smtp[0].subject, original.subject, source);
  }
});

await check("names are HTML-escaped while the text acknowledgement remains plain", async () => {
  for (const source of [undefined, "landing:google-meta-ads"]) {
    const h = harness();
    const firstName = `<b>Sam&'"</b>`;
    await h.mail.sendLeadAutoresponder({ name: `${firstName} Person`, email: "offline.person@example.invalid" }, { source });
    const message = h.calls.smtp[0];
    assert.ok(message.html.includes("&lt;b&gt;Sam&amp;&#39;&quot;&lt;/b&gt;"));
    assert.ok(!message.html.includes(firstName));
    assert.ok(message.text.includes(firstName));
  }
});

console.log(`${checks} offline team email checks passed. No real emails sent.`);
