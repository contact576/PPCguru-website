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
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
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
  const config = { supabase: true, storedId: LEAD_ID, rate: true, turnstile: true, spam: false, ghl: true, ghlResult: true, email: true, emailResult: true, structuredId: "landing-row", ...overrides };
  const calls = { store: [], landing: [], identify: [], ghl: [], zoho: [], email: [], autoresponder: [], meta: [], openai: [], receipt: [] };
  const after = [];
  const spy = (name, value) => async (...args) => { calls[name].push(structuredClone(args)); return value; };
  const deps = {
    "zod": zod,
    "next/navigation": { redirect: (url) => { throw new Redirect(url); } },
    "next/server": { after: (fn) => after.push(fn) },
    "@/lib/data/landing-100-leads": hundred,
    "@/lib/data/landing-gta": gta,
    "@/lib/landing-lead-fields": fields,
    "@/lib/landing-conversion": { setLandingConversionReceipt: spy("receipt", undefined) },
    "@/lib/supabase": { hasSupabase: () => config.supabase, saveLeadReturning: spy("store", config.storedId) },
    "@/lib/landing-leads": { saveLandingLead: spy("landing", config.structuredId) },
    "@/lib/identity": { identifyVisitor: spy("identify", undefined) },
    "@/lib/turnstile": { verifyTurnstile: async () => ({ ok: config.turnstile }), turnstileConfigured: () => true },
    "@/lib/spam-filter": { scoreSubmission: () => ({ spam: config.spam, score: config.spam ? 8 : 0, reasons: [] }), logBlocked() {} },
    "@/lib/rate-limit": { clientIpFromHeaders: async () => "192.0.2.1", rateLimit: () => ({ ok: config.rate }) },
    "@/lib/email": { emailConfigured: () => config.email, leadRecipients: () => ["team@example.invalid"], sendMail: spy("email", config.emailResult), sendLeadAutoresponder: spy("autoresponder", true) },
    "@/lib/gohighlevel": { ghlConfigured: () => config.ghl, sendLeadToGhl: spy("ghl", config.ghlResult) },
    "@/lib/zoho": { zohoConfigured: () => false, sendLeadToZoho: spy("zoho", false) },
    "@/lib/meta-capi": { sendMetaLead: spy("meta", true) },
    "@/lib/openai-capi": { sendOpenAiLead: spy("openai", true) },
    "@/lib/conversion-context": { cleanEventId: conversion.cleanEventId, readConversionContext: async () => ({ declined: false, sourceUrl: "https://example.invalid/gta-marketing-agency" }) },
  };
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

function browserHarness(consent = "accepted") {
  const storage = new Map();
  const events = [];
  const window = { oaiq: (...args) => events.push(["openai", ...args]), fbq: (...args) => events.push(["meta", ...args]), dataLayer: [] };
  const sessionStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) };
  const globals = { window, sessionStorage, localStorage: { getItem: () => consent } };
  const analytics = load("lib/analytics.ts", {}, globals);
  const Confirmed = load("components/landing/confirmed-conversion.tsx", {
    react: { useEffect: (fn) => fn() },
    "@/lib/analytics": { ...analytics, sendEvent: (...args) => events.push(["first-party", ...args]) },
    "@/lib/data/landing-gta": gta,
  }, globals).ConfirmedLandingConversion;
  return { storage, events, window, run: (eventId) => Confirmed({ eventId }) };
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
  assert.equal(h.storage.has("ppcg_lead_eid"), false);
});

await check("declined consent blocks confirmed browser conversion events", () => {
  const h = browserHarness("declined");
  h.storage.set("ppcg_lead_eid", EVENT_ID);
  h.run(EVENT_ID);
  assert.equal(h.events.length, 0);
  assert.equal(h.window.dataLayer.length, 0);
});

await check("receipt is a scoped httpOnly non-PII event id with a short expiry", async () => {
  const writes = [];
  const receipt = load("lib/landing-conversion.ts", {
    "next/headers": { cookies: async () => ({ set: (...args) => writes.push(args), get: () => ({ value: EVENT_ID }) }) },
    "@/lib/conversion-context": conversion,
    "@/lib/data/landing-gta": gta,
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

console.log(`\n${checks} offline landing form, delivery and conversion checks passed. No credentials or real services used.`);
