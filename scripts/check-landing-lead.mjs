// Real action/delivery/analytics behavior with every external boundary mocked.
// Run: node scripts/check-landing-lead.mjs — no credentials, network or real email.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";

const repo = process.cwd();
const require = createRequire(path.join(repo, "package.json"));
const ts = require("typescript");
const zod = require("zod");
let checks = 0;

function load(file, imports = {}, globals = {}) {
  const filename = path.join(repo, file);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module, exports: module.exports, FormData, URL, Date,
    process: { env: { NODE_ENV: "test" } },
    console: { warn() {}, error() {}, info() {}, log() {} },
    fetch() { throw new Error("Live network forbidden"); },
    require(name) {
      assert.ok(Object.hasOwn(imports, name), `Unmocked import refused: ${name}`);
      return imports[name];
    },
    ...globals,
  }, { filename, timeout: 5000 });
  return module.exports;
}

const fields = load("lib/landing-lead-fields.ts");
const hundred = load("lib/data/landing-100-leads.ts", { "@/lib/landing-lead-fields": fields });
const gta = load("lib/data/landing-gta.ts");
const googleMeta = load("lib/data/landing-google-meta.ts");
const conversion = load("lib/conversion-context.ts");
const LEAD_ID = "00000000-0000-4000-8000-000000000001";
const EVENT_ID = "offline-event-0001";
class Redirect extends Error { constructor(url) { super(url); this.url = url; } }

function validForm(source = gta.GTA_LANDING_SOURCE) {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    source, company: "Offline Heating", location: "Toronto", website: "example.invalid",
    business_type: "home-services", budget: "2500-5000", channel: "both",
    name: "Test Person", email: "test.person@example.invalid", phone: "+1 (416) 555-0132",
    renderedAt: String(Date.now() - 30_000), session_id: "offline-session", event_id: EVENT_ID,
    utm: JSON.stringify({ utm_source: "google", gclid: "google-click", fbclid: "meta-click", gbraid: "google-braid", junk: "drop-this" }),
  })) form.set(key, value);
  if (source === hundred.LANDING_SOURCE) form.delete("channel");
  return form;
}

function harness(overrides = {}) {
  const config = { supabase: true, storedId: LEAD_ID, rate: true, turnstile: true, spam: false, ghl: true, ghlResult: true, email: true, emailResult: true, structuredId: "landing-row", declined: false, ...overrides };
  const calls = { store: [], landing: [], identify: [], ghl: [], zoho: [], email: [], autoresponder: [], meta: [], openai: [], receipt: [] };
  const after = [];
  const spy = (name, value) => async (...args) => {
    calls[name].push(structuredClone(args.map((arg) => {
      if (!arg?.onAccepted) return arg;
      const { onAccepted, ...recorded } = arg;
      return recorded;
    })));
    return typeof value === "function" ? value(...args) : value;
  };
  const deps = {
    "zod": zod,
    "next/navigation": { redirect: (url) => { throw new Redirect(url); } },
    "next/server": { after: (fn) => after.push(fn) },
    "@/lib/data/landing-100-leads": hundred,
    "@/lib/data/landing-gta": gta,
    "@/lib/data/landing-google-meta": googleMeta,
    "@/lib/landing-lead-fields": fields,
    "@/lib/landing-conversion": { setLandingConversionReceipt: spy("receipt", undefined) },
    "@/lib/supabase": { hasSupabase: () => config.supabase, saveLeadReturning: spy("store", config.storedId) },
    "@/lib/landing-leads": { saveLandingLead: spy("landing", config.structuredId) },
    "@/lib/identity": { identifyVisitor: spy("identify", undefined) },
    "@/lib/turnstile": { verifyTurnstile: async () => ({ ok: config.turnstile }), turnstileConfigured: () => true },
    "@/lib/spam-filter": { scoreSubmission: () => ({ spam: config.spam, score: config.spam ? 8 : 0, reasons: [] }), logBlocked() {} },
    "@/lib/rate-limit": { clientIpFromHeaders: async () => "192.0.2.1", rateLimit: () => ({ ok: config.rate }) },
    "@/lib/email": { emailConfigured: () => config.email, leadRecipients: () => ["sales@ppcguru.ca", "contact@ppcguru.ca", "marketing@ppcguru.ca"], sendMail: spy("email", (msg) => {
      if (config.acceptedRecipients) msg.onAccepted?.(config.acceptedRecipients);
      if (config.emailThrows) throw new Error("Mock email rejection");
      return config.emailResult;
    }), sendLeadAutoresponder: spy("autoresponder", true) },
    "@/lib/gohighlevel": { ghlConfigured: () => config.ghl, sendLeadToGhl: spy("ghl", () => {
      if (config.ghlThrows) throw new Error("Mock GHL rejection");
      return config.ghlResult;
    }) },
    "@/lib/zoho": { zohoConfigured: () => false, sendLeadToZoho: spy("zoho", false) },
    "@/lib/meta-capi": { sendMetaLead: spy("meta", true) },
    "@/lib/openai-capi": { sendOpenAiLead: spy("openai", true) },
    "@/lib/conversion-context": { cleanEventId: conversion.cleanEventId, readConversionContext: async () => ({ declined: config.declined, sourceUrl: "https://example.invalid/gta-marketing-agency" }) },
  };
  deps["@/lib/google-meta-submission"] = load("lib/google-meta-submission.ts", { ...deps, "node:crypto": require("node:crypto") });
  deps["@/lib/lead-delivery"] = load("lib/lead-delivery.ts", deps);
  const action = load("app/actions/landing-lead.ts", deps).submitLandingLead;
  return { config, calls, after, run: (form = validForm()) => action({ ok: false, message: "" }, form), flush: async () => { for (const job of after) await job(); } };
}

async function check(name, run) {
  await run();
  checks++;
  console.log(`PASS ${name}`);
}

async function expectRedirect(h, form, target) {
  await assert.rejects(h.run(form), (error) => error instanceof Redirect && error.url === target);
}

function noAcceptedLead(h) {
  for (const key of ["store", "landing", "identify", "ghl", "zoho", "email", "autoresponder", "meta", "openai", "receipt"]) assert.equal(h.calls[key].length, 0, key);
  assert.equal(h.after.length, 0);
}

await check("GTA saves every qualification answer and attribution before redirecting without PII", async () => {
  const h = harness();
  const form = validForm();
  form.set("name", "  Test Person  ");
  form.set("company", "  Offline Heating  ");
  form.set("email", "  test.person@example.invalid  ");
  await expectRedirect(h, form, gta.GTA_LANDING_THANK_YOU_PATH);
  const record = h.calls.store[0][0];
  assert.equal(record.name, "Test Person");
  assert.equal(record.company, "Offline Heating");
  assert.equal(record.email, "test.person@example.invalid");
  assert.equal(record.website, "https://example.invalid/");
  assert.equal(record.source, gta.GTA_LANDING_SOURCE);
  assert.match(record.message, /Preferred channel: Google \+ Meta/);
  assert.equal(h.calls.landing[0][0].answers.channel, "both");
  assert.equal(h.calls.landing[0][0].utm.gbraid, "google-braid");
  assert.equal(h.calls.landing[0][0].utm.junk, undefined);
  assert.equal(h.calls.receipt[0][0], EVENT_ID);
  assert.equal(h.calls.receipt[0][1], gta.GTA_LANDING_SOURCE);
  assert.equal(h.calls.ghl.length, 0, "delivery is deferred until response");
  await h.flush();
  assert.equal(h.calls.ghl[0][0].submissionId, LEAD_ID);
  assert.equal(h.calls.meta[0][0].eventId, EVENT_ID);
  assert.match(h.calls.email[0][0].text, /Preferred channel: Google \+ Meta/);
});

await check("100-leads accepts the original question set and keeps its offer routing", async () => {
  const h = harness();
  await expectRedirect(h, validForm(hundred.LANDING_SOURCE), `${hundred.LANDING_THANK_YOU_PATH}?n=Test&c=Offline%20Heating`);
  assert.equal(h.calls.store[0][0].service, hundred.LANDING_SERVICE_LABEL);
  assert.equal(h.calls.receipt.length, 0);
});

await check("declined consent still delivers a Google + Meta enquiry but never stitches its stale session", async () => {
  const h = harness({ declined: true });
  await expectRedirect(h, validForm(googleMeta.GOOGLE_META_LANDING_SOURCE), googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  assert.equal(h.calls.store.length, 1);
  assert.equal(h.calls.identify.length, 0, "no identity cookie or browsing-history linking after opt-out");
  await h.flush();
  assert.equal(h.calls.ghl.length, 1);
  assert.equal(h.calls.email.length, 1);
  assert.equal(h.calls.meta[0][1].declined, true, "CAPI boundary receives the opt-out");
});

await check("Google + Meta keeps its own accepted lead, source, receipt and PII-free thank-you route", async () => {
  const h = harness();
  const form = validForm(googleMeta.GOOGLE_META_LANDING_SOURCE);
  await expectRedirect(h, form, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  const record = h.calls.store[0][0];
  assert.equal(record.source, googleMeta.GOOGLE_META_LANDING_SOURCE);
  assert.equal(record.service, googleMeta.GOOGLE_META_LANDING_SERVICE_LABEL);
  assert.match(record.message, /Preferred channel: Google \+ Meta/);
  assert.equal(h.calls.landing[0][0].landing, googleMeta.GOOGLE_META_LANDING_ID);
  assert.equal(h.calls.landing[0][0].answers.channel, "both");
  assert.equal(h.calls.landing[0][0].utm.gclid, "google-click");
  assert.deepEqual(h.calls.receipt[0], [EVENT_ID, googleMeta.GOOGLE_META_LANDING_SOURCE]);
  await h.flush();
  assert.equal(h.calls.ghl[0][0].source, googleMeta.GOOGLE_META_LANDING_SOURCE);
  assert.match(h.calls.email[0][0].subject, /Google \+ Meta growth-plan lead/);
  assert.equal(h.calls.meta[0][0].eventId, EVENT_ID);
});

for (const business of fields.GTA_EXTRA_BUSINESS_TYPES) {
  await check(`Google + Meta accepts ${business.label} with budget guidance`, async () => {
    const h = harness();
    const form = validForm(googleMeta.GOOGLE_META_LANDING_SOURCE);
    form.set("business_type", business.id);
    form.set("budget", "recommend");
    form.set("channel", "recommend");
    await expectRedirect(h, form, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
    assert.equal(h.calls.landing[0][0].businessType, business.id);
    assert.equal(h.calls.landing[0][0].budget, "recommend");
    assert.equal(h.calls.landing[0][0].answers.channel, "recommend");
    await h.flush();
    assert.ok(h.calls.email[0][0].text.includes(`Business type: ${business.label}`));
    assert.match(h.calls.email[0][0].text, /Monthly ad budget: Help me set a budget/);
  });
}

await check("Google + Meta requires a supported channel before any delivery or conversion", async () => {
  for (const channel of ["", "unsupported"]) {
    const h = harness();
    const form = validForm(googleMeta.GOOGLE_META_LANDING_SOURCE);
    form.set("channel", channel);
    const result = await h.run(form);
    assert.equal(result.ok, false);
    assert.ok(result.errors.channel);
    noAcceptedLead(h);
  }
});

await check("Google + Meta rejected spam cannot issue a success receipt or send a conversion", async () => {
  const h = harness({ spam: true });
  assert.equal((await h.run(validForm(googleMeta.GOOGLE_META_LANDING_SOURCE))).ok, false);
  noAcceptedLead(h);
});

await check("Google + Meta cannot report success when neither storage nor delivery accepts it", async () => {
  const h = harness({ supabase: false, storedId: null, emailResult: false, ghlResult: false });
  assert.equal((await h.run(validForm(googleMeta.GOOGLE_META_LANDING_SOURCE))).ok, false);
  assert.equal(h.calls.receipt.length, 0);
  assert.equal(h.calls.meta.length, 0);
  assert.equal(h.calls.autoresponder.length, 0);
  assert.equal(h.after.length, 0);
});

for (const [label, overrides] of [
  ["email rejects", { emailResult: false }],
  ["GHL rejects", { ghlResult: false }],
  ["email throws", { emailThrows: true }],
  ["GHL throws", { ghlThrows: true }],
  ["email is unconfigured", { email: false }],
  ["GHL is unconfigured", { ghl: false }],
]) {
  await check(`stored Google + Meta lead stays recoverable without a success receipt when ${label}`, async () => {
    const h = harness(overrides);
    const result = await h.run(validForm(googleMeta.GOOGLE_META_LANDING_SOURCE));
    assert.equal(result.ok, false);
    assert.match(result.message, /couldn't complete delivery/);
    assert.equal(h.calls.store.length, 1, "keep the recovery copy");
    assert.equal(h.calls.zoho.length, 0, "Zoho must not silently stand in for GHL");
    for (const key of ["receipt", "meta", "openai", "autoresponder"]) assert.equal(h.calls[key].length, 0, key);
    assert.equal(h.after.length, 0, "no deferred false acknowledgment or conversion");
  });
}

await check("Google + Meta starts email and GHL together and waits for both acknowledgments", async () => {
  let resolveMail;
  let resolveGhl;
  const h = harness({ emailResult: new Promise((resolve) => { resolveMail = resolve; }), ghlResult: new Promise((resolve) => { resolveGhl = resolve; }) });
  const submission = h.run(validForm(googleMeta.GOOGLE_META_LANDING_SOURCE));
  const redirected = assert.rejects(submission, (error) => error instanceof Redirect);
  for (let i = 0; i < 30; i++) await Promise.resolve();
  assert.equal(h.calls.email.length, 1);
  assert.equal(h.calls.ghl.length, 1);
  assert.equal(h.calls.receipt.length, 0);
  resolveMail(true);
  for (let i = 0; i < 10; i++) await Promise.resolve();
  assert.equal(h.calls.receipt.length, 0, "email alone must not confirm");
  resolveGhl(true);
  await redirected;
  assert.equal(h.calls.receipt.length, 1);
});

await check("retry after GHL failure reuses the saved row and accepted email", async () => {
  const h = harness({ ghlResult: false });
  const form = validForm(googleMeta.GOOGLE_META_LANDING_SOURCE);
  assert.equal((await h.run(form)).ok, false);
  h.config.ghlResult = true;
  await expectRedirect(h, form, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  assert.equal(h.calls.store.length, 1);
  assert.equal(h.calls.landing.length, 1);
  assert.equal(h.calls.email.length, 1);
  assert.equal(h.calls.ghl.length, 2);
  assert.equal(h.calls.ghl[0][0].submissionId, h.calls.ghl[1][0].submissionId);
  assert.equal(h.calls.ghl[0][0].submissionId, LEAD_ID, "retain the canonical marker for manual backfill");
  await h.flush();
  assert.equal(h.calls.autoresponder.length, 1);
  assert.equal(h.calls.meta.length, 1);
});

await check("retry after partial email failure sends only unacknowledged inboxes and skips accepted GHL", async () => {
  const h = harness({ emailResult: false, acceptedRecipients: ["sales@ppcguru.ca"] });
  const form = validForm(googleMeta.GOOGLE_META_LANDING_SOURCE);
  assert.equal((await h.run(form)).ok, false);
  h.config.emailResult = true;
  h.config.acceptedRecipients = ["contact@ppcguru.ca", "marketing@ppcguru.ca"];
  await expectRedirect(h, form, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  assert.equal(h.calls.store.length, 1);
  assert.equal(h.calls.ghl.length, 1);
  assert.deepEqual(h.calls.email[1][0].to, ["contact@ppcguru.ca", "marketing@ppcguru.ca"]);
});

await check("a repeated accepted Google + Meta submission never resends notifications or conversions", async () => {
  const h = harness();
  const form = validForm(googleMeta.GOOGLE_META_LANDING_SOURCE);
  await expectRedirect(h, form, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  await expectRedirect(h, form, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  await h.flush();
  for (const key of ["store", "landing", "ghl", "email", "autoresponder", "meta", "openai"]) assert.equal(h.calls[key].length, 1, key);
});

await check("concurrent Google + Meta retries share one save and delivery attempt", async () => {
  const h = harness();
  await Promise.all([1, 2].map(() => expectRedirect(h, validForm(googleMeta.GOOGLE_META_LANDING_SOURCE), googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH)));
  await h.flush();
  for (const key of ["store", "landing", "ghl", "email", "autoresponder", "meta"]) assert.equal(h.calls[key].length, 1, key);
});

await check("edited Google + Meta answers are delivered afresh even with the same browser event id", async () => {
  const h = harness({ ghlResult: false });
  const form = validForm(googleMeta.GOOGLE_META_LANDING_SOURCE);
  assert.equal((await h.run(form)).ok, false);
  form.set("channel", "google");
  h.config.ghlResult = true;
  await expectRedirect(h, form, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  assert.equal(h.calls.store.length, 2);
  assert.equal(h.calls.email.length, 2);
  assert.match(h.calls.ghl[1][0].message, /Preferred channel: Google Ads/);
});

await check("without a database the fallback GHL submission marker survives a process restart", async () => {
  const first = harness({ supabase: false, storedId: null });
  const second = harness({ supabase: false, storedId: null });
  const form = validForm(googleMeta.GOOGLE_META_LANDING_SOURCE);
  await expectRedirect(first, form, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  await expectRedirect(second, form, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  assert.equal(first.calls.ghl[0][0].submissionId, second.calls.ghl[0][0].submissionId);
  assert.match(first.calls.ghl[0][0].submissionId, /^google-meta-[a-f0-9]{64}$/);
});

await check("100-leads choices remain its original four businesses and four budget tiers", () => {
  assert.deepEqual(Array.from(hundred.BUSINESS_TYPE_IDS), ["home-services", "construction", "healthcare", "professional"]);
  assert.deepEqual(Array.from(hundred.LANDING_BUDGET_IDS), ["under-2500", "2500-5000", "5000-10000", "10000-plus"]);
});

for (const business of fields.GTA_EXTRA_BUSINESS_TYPES) {
  await check(`GTA ${business.label} and budget guidance persist with readable CRM/email/admin labels`, async () => {
    const h = harness();
    const form = validForm();
    form.set("business_type", business.id);
    form.set("budget", "recommend");
    await expectRedirect(h, form, gta.GTA_LANDING_THANK_YOU_PATH);
    assert.equal(h.calls.landing[0][0].businessType, business.id);
    assert.equal(h.calls.landing[0][0].budget, "recommend");
    assert.equal(h.calls.store[0][0].budget, "Help me set a budget");
    assert.ok(h.calls.store[0][0].message.includes(`Business type: ${business.label}`));
    assert.equal(hundred.businessTypeLabel(business.id), business.label);
    assert.equal(hundred.budgetLabel("recommend"), "Help me set a budget");
    await h.flush();
    assert.ok(h.calls.email[0][0].text.includes(`Business type: ${business.label}`));
    assert.match(h.calls.email[0][0].text, /Monthly ad budget: Help me set a budget/);
    assert.equal(h.calls.ghl[0][0].budget, "Help me set a budget");
  });
}

for (const [key, value] of [["business_type", "retail-ecommerce"], ["business_type", "other"], ["budget", "recommend"]]) {
  await check(`100-leads rejects GTA-only ${key}=${value}`, async () => {
    const h = harness();
    const form = validForm(hundred.LANDING_SOURCE);
    form.set(key, value);
    const result = await h.run(form);
    assert.equal(result.ok, false);
    assert.ok(result.errors[key]);
    noAcceptedLead(h);
  });
}

await check("omitting the source cannot bypass GTA-only option validation", async () => {
  const h = harness();
  const form = validForm();
  form.delete("source");
  form.set("business_type", "other");
  form.set("budget", "recommend");
  const result = await h.run(form);
  assert.equal(result.ok, false);
  assert.ok(result.errors.business_type);
  assert.ok(result.errors.budget);
  noAcceptedLead(h);
});

for (const [key, value] of [
  ["company", "  "], ["location", " x "], ["name", "  "], ["email", "invalid"],
  ["phone", "call-me-later"], ["phone", "123"], ["website", "javascript:alert(1)"],
  ["website", "not a website"], ["channel", ""], ["channel", "tiktok"],
  ["business_type", "invented"], ["budget", "invented"], ["source", "untrusted-source"],
]) {
  await check(`invalid ${key} (${value || "missing"}) never reaches storage or conversions`, async () => {
    const h = harness();
    const form = validForm();
    form.set(key, value);
    const result = await h.run(form);
    assert.equal(result.ok, false);
    assert.ok(result.errors[key]);
    noAcceptedLead(h);
  });
}

for (const [name, overrides, modify] of [
  ["honeypot", {}, (form) => form.set("company_website", "trap")],
  ["rate limit", { rate: false }], ["spam filter", { spam: true }], ["Turnstile rejection", { turnstile: false }],
]) {
  await check(`${name} shows a recoverable failure without visiting the conversion page`, async () => {
    const h = harness(overrides);
    const form = validForm();
    modify?.(form);
    const result = await h.run(form);
    assert.equal(result.ok, false);
    assert.ok(result.message);
    noAcceptedLead(h);
  });
}

await check("failed configured database write cannot send email, CRM or conversion", async () => {
  const h = harness({ storedId: null });
  assert.equal((await h.run()).ok, false);
  assert.equal(h.calls.store.length, 1);
  for (const key of ["ghl", "email", "meta", "receipt", "landing"]) assert.equal(h.calls[key].length, 0);
});

await check("a saved lead survives structured-table and notification failures", async () => {
  const h = harness({ structuredId: null, ghlResult: false, emailResult: false });
  await expectRedirect(h, validForm(), gta.GTA_LANDING_THANK_YOU_PATH);
  await h.flush();
  assert.equal(h.calls.meta.length, 1);
});

for (const configured of [true, false]) {
  await check(`no database and ${configured ? "failed" : "unconfigured"} delivery cannot report success or convert`, async () => {
    const h = harness({ supabase: false, storedId: null, email: configured, ghl: configured, emailResult: false, ghlResult: false });
    assert.equal((await h.run()).ok, false);
    assert.equal(h.calls.receipt.length, 0);
    assert.equal(h.calls.meta.length, 0);
    assert.equal(h.calls.openai.length, 0);
    assert.equal(h.calls.autoresponder.length, 0, "failed delivery cannot email a receipt to the visitor");
    assert.equal(h.after.length, 0);
  });
}

await check("without a database, CRM must acknowledge before the receipt and conversion", async () => {
  const h = harness({ supabase: false, storedId: null, emailResult: false });
  await expectRedirect(h, validForm(), gta.GTA_LANDING_THANK_YOU_PATH);
  assert.equal(h.calls.ghl.length, 1);
  assert.equal(h.calls.meta.length, 0);
  assert.equal(h.calls.autoresponder.length, 0);
  await h.flush();
  assert.equal(h.calls.meta[0][0].eventId, EVENT_ID);
  assert.equal(h.calls.autoresponder.length, 1);
});

for (const attribution of ["not-json", "x".repeat(9000)]) {
  await check("malformed/oversized optional attribution cannot lose a valid request", async () => {
    const h = harness();
    const form = validForm();
    form.set("utm", attribution);
    await expectRedirect(h, form, gta.GTA_LANDING_THANK_YOU_PATH);
    assert.equal(Object.keys(h.calls.landing[0][0].utm).length, 0);
  });
}

await check("website handles, international phones and extensions retain valid details", () => {
  assert.equal(fields.normaliseWebOrSocial("@my.business"), "https://instagram.com/my.business");
  assert.equal(fields.normaliseWebOrSocial(""), "");
  assert.equal(fields.normaliseWebOrSocial("https://user:password@example.invalid"), null);
  assert.equal(fields.isValidLeadPhone("+44 20 7946 0000"), true);
  assert.equal(fields.isValidLeadPhone("(416) 555-0132 ext. 42"), true);
});

function browserHarness(consent = "accepted", googleTagReady = false) {
  const storage = new Map();
  const events = [];
  const listeners = new Set();
  const cleanups = [];
  const window = {
    oaiq: (...args) => events.push(["openai", ...args]), fbq: (...args) => events.push(["meta", ...args]), clarity: (...args) => events.push(["clarity", ...args]), dataLayer: [],
    addEventListener: (name, fn) => { assert.equal(name, "ppcg:consent"); listeners.add(fn); },
    removeEventListener: (name, fn) => { assert.equal(name, "ppcg:consent"); listeners.delete(fn); },
  };
  if (googleTagReady) window.gtag = (...args) => events.push(["gtag", ...args]);
  const sessionStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) };
  const globals = { window, sessionStorage, localStorage: { getItem: () => consent } };
  const analytics = load("lib/analytics.ts", {
    "@/lib/site-config": { siteConfig: { contact: { phoneHref: "tel:5199929567" } } },
  }, globals);
  const react = { useEffect: (fn) => { const cleanup = fn(); if (cleanup) cleanups.push(cleanup); } };
  const googleMetaAnalytics = load("components/landing/google-meta-analytics.tsx", {
    react, "@/lib/analytics": analytics,
  }, globals);
  const Confirmed = load("components/landing/confirmed-conversion.tsx", {
    react,
    "@/lib/analytics": { ...analytics, sendEvent: (...args) => events.push(["first-party", ...args]) },
    "@/lib/data/landing-gta": gta,
    "@/lib/data/landing-google-meta": googleMeta,
    "@/components/landing/google-meta-analytics": googleMetaAnalytics,
  }, globals).ConfirmedLandingConversion;
  return {
    storage, events, window, listeners,
    mountLanding: googleMetaAnalytics.GoogleMetaAnalytics,
    unmount: () => cleanups.forEach((cleanup) => cleanup()),
    setConsent: (value) => { consent = value; for (const listener of listeners) listener(); },
    commands: () => [...window.dataLayer.filter((item) => item[0]).map((item) => Array.from(item)), ...events.filter(([name]) => name === "gtag").map(([, ...args]) => args)],
    run: (eventId, source) => Confirmed({ eventId, source }),
  };
}

function assertConfirmedGoogleCommands(h) {
  const commands = h.commands();
  assert.deepEqual(structuredClone(commands), [
    ["config", "AW-18496471261"],
    ["event", "generate_lead", { form_name: "google_meta_growth_plan", source: googleMeta.GOOGLE_META_LANDING_SOURCE, event_id: EVENT_ID, send_to: "G-MKBLW76L2Z" }],
    ["event", "conversion", { send_to: "AW-18496471261/CysrCNTKlZMdEN2B5_NE", transaction_id: EVENT_ID }],
  ], "only the verified destinations and non-PII event id are sent; no contact fields or invented value");
  assert.equal(h.window.dataLayer.filter((item) => item.event === "generate_lead").length, 0, "no second raw event for a parallel GA4 tag");
}

await check("visiting a form or directly opening thank-you never fires a lead", () => {
  const h = browserHarness();
  h.storage.set("ppcg_lead_eid", EVENT_ID);
  h.run(undefined);
  h.run("different-receipt");
  assert.equal(h.events.length, 0);
  assert.equal(h.window.dataLayer.length, 0);
  assert.equal(h.storage.get("ppcg_lead_eid"), EVENT_ID);
});

await check("confirmed conversion emits Google/Meta events once with the server event id", () => {
  const h = browserHarness();
  h.storage.set("ppcg_lead_eid", EVENT_ID);
  h.run(EVENT_ID);
  h.run(EVENT_ID);
  assert.equal(h.events.filter(([name]) => name === "meta").length, 1);
  assert.equal(h.events.find(([name]) => name === "meta")[4].eventID, EVENT_ID);
  assert.equal(h.window.dataLayer.length, 1);
  assert.equal(h.window.dataLayer[0].event, "generate_lead");
  assert.equal(h.window.dataLayer[0].event_id, EVENT_ID);
  assert.equal(h.events.filter(([name]) => name === "clarity").length, 0, "legacy funnel keeps its original event path");
  assert.equal(h.storage.has("ppcg_lead_eid"), false);
});

await check("declined consent blocks confirmed browser conversion events", () => {
  const h = browserHarness("declined");
  h.storage.set("ppcg_lead_eid", EVENT_ID);
  h.run(EVENT_ID);
  assert.equal(h.events.length, 0);
  assert.equal(h.window.dataLayer.length, 0);
});

await check("Google + Meta queues separate GA4 and Ads conversions once only after confirmed delivery", () => {
  const h = browserHarness();
  h.storage.set("ppcg_lead_eid", EVENT_ID);
  h.run(EVENT_ID, googleMeta.GOOGLE_META_LANDING_SOURCE);
  h.run(EVENT_ID, googleMeta.GOOGLE_META_LANDING_SOURCE);
  assert.equal(h.window.dataLayer.length, 3);
  assertConfirmedGoogleCommands(h);
  assert.deepEqual(h.events.filter(([name]) => name === "clarity"), [["clarity", "event", "google_meta_lead_submitted"]]);
  assert.equal(h.events.filter(([name]) => name === "meta").length, 1);
  const meta = h.events.find(([name]) => name === "meta");
  assert.equal(meta[3].content_name, "Google + Meta growth plan");
  assert.equal(meta[4].eventID, EVENT_ID);
  assert.equal(h.storage.has("ppcg_lead_eid"), false);
});

await check("Google + Meta uses an installed gtag without a duplicate data-layer event", () => {
  const h = browserHarness("accepted", true);
  h.storage.set("ppcg_lead_eid", EVENT_ID);
  h.run(EVENT_ID, googleMeta.GOOGLE_META_LANDING_SOURCE);
  h.run(EVENT_ID, googleMeta.GOOGLE_META_LANDING_SOURCE);
  const commands = h.events.filter(([name]) => name === "gtag");
  assert.equal(commands.length, 3);
  assertConfirmedGoogleCommands(h);
  assert.equal(h.window.dataLayer.length, 0);
  assert.equal(h.events.filter(([name]) => name === "clarity").length, 1);
});

await check("Google + Meta preserves the existing queue while vendor libraries are loading", () => {
  const h = browserHarness();
  const queue = h.window.dataLayer;
  const queuedPageview = { event: "gtm.js" };
  queue.push(queuedPageview);
  delete h.window.clarity;
  h.storage.set("ppcg_lead_eid", EVENT_ID);
  h.run(EVENT_ID, googleMeta.GOOGLE_META_LANDING_SOURCE);
  assert.equal(h.window.dataLayer, queue);
  assert.equal(queue[0], queuedPageview);
  assert.equal(queue.length, 4);
  assertConfirmedGoogleCommands(h);
  assert.equal(h.events.filter(([name]) => name === "meta").length, 1);
});

await check("Google + Meta landing configures Ads for click attribution once without reporting a lead", () => {
  for (const ready of [false, true]) {
    const h = browserHarness("accepted", ready);
    h.mountLanding();
    h.mountLanding();
    assert.deepEqual(structuredClone(h.commands()), [["config", "AW-18496471261"]]);
    assert.equal(h.events.filter(([name]) => name !== "gtag").length, 0);
    assert.equal(h.listeners.size, 1);
    h.unmount();
    assert.equal(h.listeners.size, 0);
  }
});

await check("Google + Meta confirmed navigation reuses its landing configuration and sends no PII", () => {
  for (const ready of [false, true]) {
    const h = browserHarness("accepted", ready);
    h.mountLanding();
    h.storage.set("ppcg_lead_eid", EVENT_ID);
    h.run(undefined, googleMeta.GOOGLE_META_LANDING_SOURCE);
    assert.equal(h.commands().length, 1, "configuration is not a conversion");
    h.run(EVENT_ID, googleMeta.GOOGLE_META_LANDING_SOURCE);
    h.run(EVENT_ID, googleMeta.GOOGLE_META_LANDING_SOURCE);
    assertConfirmedGoogleCommands(h);
  }
});

await check("Google + Meta Ads setup waits through declined consent and handles acceptance without a lead", () => {
  for (const ready of [false, true]) {
    const h = browserHarness("declined", ready);
    h.mountLanding();
    assert.equal(h.commands().length, 0);
    h.setConsent("accepted");
    h.setConsent("accepted");
    assert.deepEqual(structuredClone(h.commands()), [["config", "AW-18496471261"]]);
    assert.equal(h.events.filter(([name]) => name !== "gtag").length, 0);
  }
});

await check("declining after landing setup still blocks every confirmed Google + Meta conversion", () => {
  for (const ready of [false, true]) {
    const h = browserHarness("accepted", ready);
    h.mountLanding();
    h.setConsent("declined");
    h.storage.set("ppcg_lead_eid", EVENT_ID);
    h.run(EVENT_ID, googleMeta.GOOGLE_META_LANDING_SOURCE);
    assert.deepEqual(structuredClone(h.commands()), [["config", "AW-18496471261"]]);
    assert.equal(h.events.filter(([name]) => name !== "gtag").length, 0);
    assert.equal(h.storage.get("ppcg_lead_eid"), EVENT_ID);
  }
});

await check("Google + Meta direct, mismatched and declined visits never emit a confirmed conversion", () => {
  for (const [consent, receipt] of [["accepted", undefined], ["accepted", "other-receipt"], ["declined", EVENT_ID]]) {
    for (const ready of [false, true]) {
      const h = browserHarness(consent, ready);
      h.storage.set("ppcg_lead_eid", EVENT_ID);
      h.run(receipt, googleMeta.GOOGLE_META_LANDING_SOURCE);
      assert.equal(h.events.length, 0);
      assert.equal(h.window.dataLayer.length, 0);
    }
  }
});

await check("sitewide tracker leaves confirmed funnels to their receipts and preserves legacy conversion", () => {
  for (const pathname of [gta.GTA_LANDING_THANK_YOU_PATH, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH, hundred.LANDING_THANK_YOU_PATH]) {
    const leads = [];
    const VisitorTracker = load("components/analytics/tracker.tsx", {
      react: { useEffect: (fn) => fn(), useRef: (value) => ({ current: value }) },
      "next/navigation": { usePathname: () => pathname },
      "@/lib/analytics": { sendEvent() {}, trackPageViewed() {}, trackLead: (...args) => leads.push(args) },
      "@/lib/data/landing-gta": gta,
      "@/lib/data/landing-google-meta": googleMeta,
    }, { document: { addEventListener() {}, removeEventListener() {} } }).VisitorTracker;
    VisitorTracker();
    assert.equal(leads.length, pathname === hundred.LANDING_THANK_YOU_PATH ? 1 : 0);
  }
});

await check("receipt is a scoped httpOnly non-PII event id with a short expiry", async () => {
  const writes = [];
  const receipt = load("lib/landing-conversion.ts", {
    "next/headers": { cookies: async () => ({ set: (...args) => writes.push(args), get: () => ({ value: EVENT_ID }) }) },
    "@/lib/conversion-context": conversion,
    "@/lib/data/landing-gta": gta,
    "@/lib/data/landing-google-meta": googleMeta,
  });
  await receipt.setLandingConversionReceipt("invalid value with spaces");
  assert.equal(writes.length, 0);
  await receipt.setLandingConversionReceipt(EVENT_ID);
  assert.equal(writes[0][1], EVENT_ID);
  assert.equal(writes[0][2].httpOnly, true);
  assert.equal(writes[0][2].path, gta.GTA_LANDING_THANK_YOU_PATH);
  assert.equal(writes[0][2].maxAge, 300);
  assert.equal(await receipt.readLandingConversionReceipt(), EVENT_ID);
});

await check("Google + Meta receipt is isolated from GTA and scoped to its own thank-you page", async () => {
  const values = new Map();
  const writes = [];
  const receipt = load("lib/landing-conversion.ts", {
    "next/headers": { cookies: async () => ({
      set: (name, value, options) => { values.set(name, value); writes.push({ name, value, options }); },
      get: (name) => values.has(name) ? { value: values.get(name) } : undefined,
    }) },
    "@/lib/conversion-context": conversion,
    "@/lib/data/landing-gta": gta,
    "@/lib/data/landing-google-meta": googleMeta,
  });
  await receipt.setLandingConversionReceipt(EVENT_ID);
  assert.equal(await receipt.readLandingConversionReceipt(googleMeta.GOOGLE_META_LANDING_SOURCE), undefined);
  await receipt.setLandingConversionReceipt("offline-event-0002", googleMeta.GOOGLE_META_LANDING_SOURCE);
  assert.notEqual(writes[0].name, writes[1].name);
  assert.equal(writes[1].options.path, googleMeta.GOOGLE_META_LANDING_THANK_YOU_PATH);
  assert.equal(writes[1].options.httpOnly, true);
  assert.equal(writes[1].options.sameSite, "lax");
  assert.equal(writes[1].options.maxAge, 300);
  assert.equal(await receipt.readLandingConversionReceipt(), EVENT_ID);
  assert.equal(await receipt.readLandingConversionReceipt(googleMeta.GOOGLE_META_LANDING_SOURCE), "offline-event-0002");
});

const jsxRuntime = {
  Fragment: "fragment",
  jsx: (type, props) => ({ type, props }),
  jsxs: (type, props) => ({ type, props }),
};
function descendants(node) {
  if (!node || typeof node !== "object") return [];
  return [node, ...[].concat(node.props?.children ?? []).flatMap(descendants)];
}

await check("session field responds to consent changes and removes its listeners on unmount", () => {
  let consent = "accepted";
  let stateIndex = 0;
  let first = true;
  const states = [];
  const listeners = new Map();
  let cleanup;
  const SessionField = load("components/shared/session-field.tsx", {
    "react/jsx-runtime": jsxRuntime,
    react: {
      useState: (initial) => {
        const index = stateIndex++;
        if (!(index in states)) states[index] = initial;
        return [states[index], (value) => { states[index] = value; }];
      },
      useEffect: (fn) => { if (first) cleanup = fn(); },
    },
    "@/lib/analytics": { consentState: () => consent, sessionId: () => "offline-session", leadEventId: () => EVENT_ID },
  }, { window: { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: (name) => listeners.delete(name) } }).SessionField;
  const render = () => { stateIndex = 0; const tree = SessionField(); first = false; return descendants(tree).filter((n) => n.type === "input"); };
  render();
  assert.equal(render().find((n) => n.props.name === "session_id").props.value, "offline-session");
  consent = "declined";
  listeners.get("ppcg:consent")();
  assert.equal(render().find((n) => n.props.name === "session_id").props.value, "");
  assert.equal(render().find((n) => n.props.name === "event_id").props.value, EVENT_ID);
  consent = "accepted";
  listeners.get("storage")();
  assert.equal(render().find((n) => n.props.name === "session_id").props.value, "offline-session");
  cleanup();
  assert.equal(listeners.size, 0);
});

for (const receipt of [undefined, EVENT_ID]) {
  await check(`Google + Meta ${receipt ? "confirmed" : "direct/email"} thank-you retains booking without a false receipt claim`, async () => {
    const page = load("app/google-ads-and-meta-ads/thank-you/page.tsx", {
      "react/jsx-runtime": jsxRuntime,
      "lucide-react": { CalendarCheck: "CalendarCheck", ClipboardList: "ClipboardList", Rocket: "Rocket" },
      "../../100-leads/landing.css": {}, "../google-meta.css": {},
      "@/components/landing/landing-thank-you": { LandingThankYou: "LandingThankYou" },
      "@/components/landing/google-meta-footer": { GoogleMetaFooter: "GoogleMetaFooter" },
      "@/components/landing/confirmed-conversion": { ConfirmedLandingConversion: "ConfirmedLandingConversion" },
      "@/lib/landing-conversion": { readLandingConversionReceipt: async (source) => { assert.equal(source, googleMeta.GOOGLE_META_LANDING_SOURCE); return receipt; } },
      "@/lib/data/landing-google-meta": googleMeta,
    }).default;
    const tree = await page();
    const props = descendants(tree).find((n) => n.type === "LandingThankYou").props;
    assert.equal(props.confirmed, Boolean(receipt));
    assert.equal(props.kicker, receipt ? "Eligibility review requested" : "Book your eligibility review");
    assert.equal(props.whatsappOpener.includes("I just requested"), Boolean(receipt));
    const shared = load("components/landing/landing-thank-you.tsx", {
      "react/jsx-runtime": jsxRuntime,
      "next/link": "Link",
      "lucide-react": { Check: "Check", CalendarCheck: "CalendarCheck" },
      "@/lib/site-config": { siteConfig: { contact: { whatsapp: "https://example.invalid/chat", phone: "offline-phone", phoneHref: "tel:000", email: "team@example.invalid" } } },
      "@/components/landing/landing-chrome": { LandingFooter: "LandingFooter", LandingHeader: "LandingHeader" },
      "@/components/landing/thank-you-actions": { ThankYouActions: "ThankYouActions" },
      "@/components/landing/booking-calendar": { BookingCalendar: "BookingCalendar" },
      "@/components/landing/trust": { PartnerBadges: "PartnerBadges", GoogleReviewsBlock: "GoogleReviewsBlock" },
    }).LandingThankYou;
    const rendered = descendants(shared(props));
    assert.equal(rendered.filter((n) => n.type === "BookingCalendar").length, 1);
    const statusMark = descendants(rendered.find((n) => n.props?.className === "success-mark"));
    assert.equal(statusMark.filter((n) => n.type === "Check").length, receipt ? 1 : 0);
    assert.equal(statusMark.filter((n) => n.type === "CalendarCheck").length, receipt ? 0 : 1);
  });
}

await check("server error focus is consumed once and never steals focus after correction or Back", () => {
  const slots = [];
  const focus = [];
  let cursor = 0;
  let effects = [];
  let dirty = true;
  let tree;
  let response;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === "function" ? initial() : initial;
      return [slots[index], (next) => {
        const value = typeof next === "function" ? next(slots[index]) : next;
        if (!Object.is(value, slots[index])) { slots[index] = value; dirty = true; }
      }];
    },
    useRef(initial) { const index = cursor++; return slots[index] ??= { current: initial }; },
    useEffect(fn, dependencies) {
      const index = cursor++;
      if (!slots[index] || dependencies.some((value, i) => !Object.is(value, slots[index][i]))) {
        slots[index] = dependencies;
        effects.push(fn);
      }
    },
    useActionState: (_action, initial) => [response ?? initial, () => {}, false],
  };
  const Form = load("components/landing/leads-landing.tsx", {
    react, "react/jsx-runtime": jsxRuntime, "next/link": "Link", "next/navigation": { unstable_rethrow() {} },
    "lucide-react": new Proxy({}, { get: (_target, name) => String(name) }),
    "@/app/actions/landing-lead": { submitLandingLead() { throw new Error("No real submission in UI check"); } },
    "@/components/shared/turnstile-field": { TurnstileField: "TurnstileField" },
    "@/components/shared/session-field": { SessionField: "SessionField" },
    "@/lib/analytics": { track() {} }, "@/lib/data/landing-100-leads": hundred,
    "@/components/shared/partner-pair": {}, "@/components/landing/landing-chrome": {},
    "@/components/landing/hero-marks": {}, "@/components/landing/trust": {},
    "@/lib/landing-lead-fields": fields, "@/lib/data/landing-gta": gta,
    "@/lib/data/landing-google-meta": googleMeta,
    "@/lib/site-config": { siteConfig: { contact: { phone: "offline", phoneHref: "tel:000", email: "team@example.invalid" } } },
  }, { window: { location: { search: "", pathname: googleMeta.GOOGLE_META_LANDING_PATH } }, document: { referrer: "" }, URLSearchParams }).QualificationForm;
  const textOf = (node) => typeof node === "string" ? node : [].concat(node?.props?.children ?? []).map(textOf).join("");
  const nodes = () => descendants(tree);
  function render() {
    dirty = true;
    let cycles = 0;
    while (dirty) {
      assert.ok(cycles++ < 12, "effects must settle without an update loop");
      dirty = false; cursor = 0; effects = [];
      tree = Form({ copy: { source: googleMeta.GOOGLE_META_LANDING_SOURCE, collectChannel: true, topline: "Plan", stepTwoLede: "Plan", submitLabel: "Send" } });
      for (const node of nodes().filter((item) => item.props?.ref)) {
        node.props.ref.current = node.type === "form" ? {
          querySelector(selector) {
            const name = selector.match(/name="([^"]+)"/)?.[1];
            const visibleInput = nodes().find((item) => item.type === "input" && item.props.name === name && item.props.type !== "hidden");
            return visibleInput ? { focus: () => focus.push(name) } : null;
          },
        } : { focus: () => focus.push(node.type === "h2" ? `heading:${textOf(node)}` : "summary") };
      }
      for (const effect of effects) effect();
    }
  }
  const fill = (name, value) => { nodes().find((n) => n.type === "input" && n.props.name === name).props.onChange({ target: { name, value } }); render(); };
  const next = () => { nodes().find((n) => n.type === "button" && n.props.className === "primary-button").props.onClick(); render(); };
  render();
  fill("company", "Offline Test"); fill("location", "Toronto"); fill("website", "example.invalid"); next();
  for (const field of ["business_type", "budget", "channel"]) {
    const group = nodes().find((n) => n.props?.["data-field"] === field);
    descendants(group).find((n) => n.props?.role === "radio").props.onClick(); render();
  }
  next();
  response = { ok: false, message: "Please fix the highlighted fields.", errors: { website: "Please check this website." } };
  render();
  assert.equal(focus.at(-1), "website", "new server error returns to and focuses its visible field");
  fill("website", "fixed.example.invalid");
  const afterCorrection = focus.length;
  next();
  assert.deepEqual(focus.slice(afterCorrection), ["heading:What best describes Offline Test?"], "old failure cannot override the next panel's heading focus");
  next();
  response = { ok: false, message: "Please try again." };
  render();
  assert.equal(focus.at(-1), "summary");
  const afterFailure = focus.length;
  nodes().find((n) => n.type === "button" && n.props.className === "secondary-button").props.onClick(); render();
  assert.deepEqual(focus.slice(afterFailure), ["heading:What best describes Offline Test?"], "Back cannot replay a consumed summary focus");
  response = { ok: false, message: "Please try again." };
  render();
  assert.equal(focus.at(-1), "summary", "a new failure with the same text still receives focus");
});

console.log(`\n${checks} offline landing form, delivery and conversion checks passed. No credentials or real services used.`);
