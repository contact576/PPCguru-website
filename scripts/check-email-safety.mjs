// Offline regression checks: all providers, database calls and network are mocked.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const zod = require("zod");
let checks = 0;

function load(file, imports, globals = {}) {
  const compiled = ts.transpileModule(readFileSync(file, "utf8"), {
    fileName: file,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module, exports: module.exports, URLSearchParams, AbortSignal,
    process: { env: {} },
    console: { warn() {}, error() {}, info() {}, log() {} },
    fetch() { throw new Error("Live network forbidden"); },
    require(name) {
      assert.ok(Object.hasOwn(imports, name), `Unmocked import refused: ${name}`);
      return imports[name];
    },
    ...globals,
  }, { filename: file, timeout: 5000 });
  return module.exports;
}

function mailHarness(overrides = {}) {
  const calls = { smtp: [], resend: [], claim: [], verify: 0 };
  const claimed = new Set();
  const env = { SMTP_HOST: "smtp.example.invalid", SMTP_USER: "hello@ppcguru.ca", SMTP_PASS: "offline", CONTACT_TO_EMAIL: "contact@ppcguru.ca", ...overrides.env };
  const clock = { now: Date.now() };
  class Clock extends Date { static now() { return clock.now; } }
  const config = { smtpError: null, database: true, claimError: null, ...overrides };
  const mail = load("lib/email.ts", {
    zod,
    "@/lib/supabase": { supabaseAdmin: () => config.database ? {
      async rpc(name, params) {
        assert.equal(name, "claim_lead_autoresponder");
        calls.claim.push(params.recipient);
        if (config.claimError) return { data: null, error: config.claimError };
        if (claimed.has(params.recipient)) return { data: false, error: null };
        claimed.add(params.recipient);
        return { data: true, error: null };
      },
    } : null },
    nodemailer: { createTransport: () => ({
      async sendMail(message) {
        calls.smtp.push(message);
        if (config.smtpError) throw config.smtpError;
        return { accepted: [message.to], rejected: [] };
      },
      async verify() { calls.verify++; return true; },
    }) },
    resend: { Resend: class {
      emails = { send: async (message) => { calls.resend.push(message); return { error: null }; } };
    } },
  }, { process: { env }, Date: Clock });
  return { mail, calls, config, clock, env };
}

async function check(name, test) {
  await test();
  checks++;
  console.log(`PASS ${name}`);
}

const message = { to: "contact@ppcguru.ca", subject: "Offline test", text: "No network allowed" };

await check("reserved, malformed and mixed recipients never reach any provider", async () => {
  const h = mailHarness({ env: { RESEND_API_KEY: "offline" } });
  for (const to of ["conversion-test@example.com", "x@a.example.net", "x@example.org", "happy@foundly.invalid", "x@a.test", "x@localhost", "x@a.example", "bad-address", "", ["contact@ppcguru.ca", "x@example.com"]]) {
    assert.equal(await h.mail.sendMail({ ...message, to }), false);
  }
  assert.equal(h.calls.smtp.length + h.calls.resend.length, 0);
});

await check("normal internal notifications still use SMTP", async () => {
  const h = mailHarness();
  assert.equal(await h.mail.sendMail(message), true);
  assert.equal(h.calls.smtp.length, 1);
  assert.equal(h.calls.smtp[0].to, message.to);
});

await check("operator pause skips SMTP while preserving configured fallback", async () => {
  const h = mailHarness({ env: { SMTP_ENABLED: "false", RESEND_API_KEY: "offline" } });
  assert.equal(await h.mail.sendMail(message), true);
  const result = await h.mail.sendTestNotification();
  assert.match(result.detail, /SMTP remains paused/);
  const health = await h.mail.probeEmailHealth();
  assert.equal(h.calls.smtp.length + h.calls.verify, 0);
  assert.equal(h.calls.resend.length, 2);
  assert.equal(health[0].ok, false);
  assert.match(health[0].detail, /SMTP_ENABLED=false/);
});

await check("fallback success cannot report SMTP suspension as recovered", async () => {
  const h = mailHarness({
    smtpError: { responseCode: 554, toString: () => "554 5.7.1 Outbound sending is disabled for this account" },
    env: { RESEND_API_KEY: "offline" },
  });
  const result = await h.mail.sendTestNotification();
  assert.equal(result.ok, true);
  assert.match(result.detail, /SMTP still rejected/);
  assert.match(result.detail, /fallback may have accepted/);
});

for (const blocked of ["554 5.7.1 Outbound sending is disabled for this account", "550 5.7.1 [ESA] Sender blocked"]) {
  await check(`${blocked}: no automatic retry after ten minutes; explicit test recovers`, async () => {
    const h = mailHarness({ smtpError: { responseCode: 554, message: blocked, toString: () => blocked } });
    assert.equal(await h.mail.sendMail(message), false);
    h.clock.now += 24 * 60 * 60_000;
    assert.equal(await h.mail.sendMail(message), false);
    const health = await h.mail.probeEmailHealth();
    assert.equal(health[0].ok, false);
    assert.equal(h.calls.smtp.length, 1);
    assert.equal(h.calls.verify, 0);
    h.config.smtpError = null;
    assert.equal((await h.mail.sendTestNotification()).ok, true);
    assert.equal(h.calls.smtp.length, 2);
  });
}

await check("concurrent repeated submissions receive only one claimed autoresponse", async () => {
  const h = mailHarness();
  const results = await Promise.all(Array.from({ length: 5 }, () => h.mail.sendLeadAutoresponder({ name: "Lead", email: " Lead@ppcguru.ca " })));
  assert.equal(results.filter(Boolean).length, 1);
  assert.equal(h.calls.smtp.length, 1);
  assert.equal(h.calls.smtp[0].to, "lead@ppcguru.ca");
});

await check("unavailable durable claim suppresses only the optional receipt", async () => {
  for (const options of [{ database: false }, { claimError: { code: "missing-migration" } }]) {
    const h = mailHarness(options);
    assert.equal(await h.mail.sendLeadAutoresponder({ email: "lead@ppcguru.ca" }), false);
    assert.equal(h.calls.smtp.length, 0);
    assert.equal(await h.mail.sendMail(message), true);
  }
});

await check("reserved lead addresses do not claim or send receipts", async () => {
  const h = mailHarness();
  assert.equal(await h.mail.sendLeadAutoresponder({ email: "conversion-test@example.com" }), false);
  assert.equal(h.calls.claim.length + h.calls.smtp.length, 0);
});

await check("submitted name cannot inject autoresponder HTML", async () => {
  const h = mailHarness();
  await h.mail.sendLeadAutoresponder({ name: '<b>Lead&"</b>', email: "lead@ppcguru.ca" });
  assert.ok(h.calls.smtp[0].html.includes("&lt;b&gt;Lead&amp;&quot;&lt;/b&gt;"));
  assert.ok(!h.calls.smtp[0].html.includes('<b>Lead&"</b>'));
});

await check("visitor follow-up requires explicit opt-in even with working mail and identity", async () => {
  for (const flag of [undefined, "false", "", "true"]) {
    const journeys = load("lib/journeys.ts", {
      "node:crypto": require("node:crypto"),
      "@/lib/supabase": { supabaseAdmin: () => { throw new Error("Database forbidden"); } },
      "@/lib/email": { emailConfigured: () => true },
      "@/lib/site-config": { siteConfig: { url: "https://ppcguru.ca" } },
    }, { process: { env: { IDENTITY_SECRET: "offline", JOURNEYS_ENABLED: flag } } });
    assert.equal(journeys.journeysEnabled(), flag === "true");
    if (flag !== "true") {
      assert.equal(await journeys.runJourneys({ event: "pageview", visitor: { email: "lead@ppcguru.ca" } }), null);
    }
  }
});

console.log(`${checks} offline email safety checks passed. No real emails sent.`);
