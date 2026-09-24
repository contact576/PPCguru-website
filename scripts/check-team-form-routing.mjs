// Exercise every lead action through the real shared delivery and recipient code.
// Run: node scripts/check-team-form-routing.mjs
// Provider/CRM/database boundaries are mocked; no secrets or network are used.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";

const repo = process.cwd();
const require = createRequire(path.join(repo, "package.json"));
const ts = require("typescript");
const zod = require("zod");
const LEAD_ID = "00000000-0000-4000-8000-000000000001";
const EMAIL = "routing-check@example.invalid";
const EXPECTED_RECIPIENTS = ["sales@ppcguru.ca", "contact@ppcguru.ca", "marketing@ppcguru.ca"];
let checks = 0;

function load(file, imports = {}, env = {}) {
  const filename = path.join(repo, file);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module, exports: module.exports, FormData, URL, Date,
    process: { env: { NODE_ENV: "test", ...env } },
    console: { warn() {}, error() {}, info() {}, log() {} },
    fetch() { throw new Error("Live network forbidden in offline form-routing checks"); },
    require(name) {
      assert.ok(Object.hasOwn(imports, name), `Unmocked import refused: ${name}`);
      return imports[name];
    },
  }, { filename, timeout: 5000 });
  return module.exports;
}

const options = load("lib/data/form-options.ts");
const fields = load("lib/landing-lead-fields.ts");
const hundred = load("lib/data/landing-100-leads.ts", { "@/lib/landing-lead-fields": fields });
const gta = load("lib/data/landing-gta.ts");
const seo = load("lib/data/landing-seo.ts");
const conversion = load("lib/conversion-context.ts");
class Redirect extends Error {
  constructor(url) { super(url); this.url = url; }
}

const routes = [
  { label: "captureLead", file: "app/actions/lead.ts", action: "captureLead", source: "tool:roas-calculator", kind: "shared" },
  { label: "submitContact", file: "app/contact/actions.ts", action: "submitContact", source: "contact", kind: "contact" },
  { label: "submitLandingLead:100-leads", file: "app/actions/landing-lead.ts", action: "submitLandingLead", source: hundred.LANDING_SOURCE, kind: "landing", thankYou: hundred.LANDING_THANK_YOU_PATH },
  { label: "submitLandingLead:GTA", file: "app/actions/landing-lead.ts", action: "submitLandingLead", source: gta.GTA_LANDING_SOURCE, kind: "landing", thankYou: gta.GTA_LANDING_THANK_YOU_PATH },
  { label: "submitSeoLead", file: "app/actions/seo-lead.ts", action: "submitSeoLead", source: seo.SEO_LANDING_SOURCE, kind: "seo", thankYou: seo.SEO_LANDING_THANK_YOU_PATH },
];

function formFor(route) {
  const values = {
    name: "Offline Test Person", email: EMAIL, phone: "+1 (416) 555-0132",
    company: "Offline Routing Test", source: route.source,
    session_id: "offline-session", event_id: "offline-routing-event",
    renderedAt: String(Date.now() - 30_000), turnstileToken: "offline-token",
  };
  if (route.kind === "shared" || route.kind === "contact") {
    Object.assign(values, {
      budget: options.BUDGET_OPTIONS[0],
      [route.kind === "contact" ? "site_url" : "website"]: "https://example.invalid",
      [route.kind === "contact" ? "message" : "detail"]: "Please help us improve our lead capture.",
    });
  } else if (route.kind === "landing") {
    Object.assign(values, {
      website: "example.invalid", location: "Toronto", business_type: "home-services", budget: "2500-5000",
      utm: JSON.stringify({ utm_source: "google", utm_campaign: "offline-campaign" }),
    });
    if (route.source === gta.GTA_LANDING_SOURCE) values.channel = "both";
  } else {
    Object.assign(values, {
      website: "example.invalid", search: "heating services Toronto", goal: "all", investment: "1500-3000",
      utm: JSON.stringify({ utm_source: "google", utm_campaign: "offline-campaign" }),
    });
  }
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  if (route.kind === "shared" || route.kind === "contact") {
    form.append("services", options.SERVICE_OPTIONS[0]);
    form.append("services", options.SERVICE_OPTIONS[1]);
  }
  return form;
}

function harness(route, stored) {
  const calls = { store: [], landing: [], identify: [], mail: [], autoresponder: [], crm: [], meta: [], openai: [], receipt: [] };
  const jobs = [];
  const spy = (name, result) => async (...args) => {
    calls[name].push(structuredClone(args));
    return result;
  };
  // Load the real helper against a deliberately incomplete old configuration.
  // Neither SMTP nor Resend receives credentials or is imported by this script.
  const email = load("lib/email.ts", {}, { CONTACT_TO_EMAIL: "marketing@ppcguru.ca" });
  const imports = {
    zod,
    "next/navigation": { redirect: (url) => { throw new Redirect(url); } },
    "next/server": { after: (job) => jobs.push(job) },
    "@/lib/data/form-options": options,
    "@/lib/landing-lead-fields": fields,
    "@/lib/data/landing-100-leads": hundred,
    "@/lib/data/landing-gta": gta,
    "@/lib/data/landing-seo": seo,
    "@/lib/landing-conversion": { setLandingConversionReceipt: spy("receipt", undefined) },
    "@/lib/supabase": { hasSupabase: () => stored, saveLeadReturning: spy("store", stored ? LEAD_ID : null) },
    "@/lib/landing-leads": { saveLandingLead: spy("landing", "offline-landing-row") },
    "@/lib/identity": { identifyVisitor: spy("identify", undefined) },
    "@/lib/turnstile": { verifyTurnstile: async () => ({ ok: true }), turnstileConfigured: () => true },
    "@/lib/spam-filter": { scoreSubmission: () => ({ spam: false, score: 0, reasons: [] }), logBlocked() {} },
    "@/lib/rate-limit": { clientIpFromHeaders: async () => "192.0.2.1", rateLimit: () => ({ ok: true }) },
    "@/lib/email": {
      leadRecipients: email.leadRecipients,
      emailConfigured: () => true,
      sendMail: spy("mail", true),
      sendLeadAutoresponder: spy("autoresponder", true),
    },
    "@/lib/gohighlevel": { ghlConfigured: () => true, sendLeadToGhl: spy("crm", false) },
    "@/lib/zoho": { zohoConfigured: () => false, sendLeadToZoho() { throw new Error("Unexpected Zoho delivery"); } },
    "@/lib/meta-capi": { sendMetaLead: spy("meta", true) },
    "@/lib/openai-capi": { sendOpenAiLead: spy("openai", true) },
    "@/lib/conversion-context": {
      cleanEventId: conversion.cleanEventId,
      readConversionContext: async () => ({ declined: false, sourceUrl: "https://example.invalid/form" }),
    },
  };
  imports["@/lib/lead-delivery"] = load("lib/lead-delivery.ts", imports);
  const action = load(route.file, imports)[route.action];
  return {
    calls, jobs,
    run: () => action({ ok: false, message: "" }, formFor(route)),
    flush: async () => { for (const job of jobs) await job(); },
  };
}

for (const route of routes) {
  for (const stored of [true, false]) {
    const h = harness(route, stored);
    if (route.thankYou) {
      await assert.rejects(h.run(), (error) => error instanceof Redirect && error.url.split("?")[0] === route.thankYou);
    } else {
      assert.equal((await h.run()).ok, true);
    }
    assert.equal(h.calls.mail.length, stored ? 0 : 1, "only stored leads may defer team delivery");
    await h.flush();
    assert.equal(h.calls.mail.length, 1, "one internal notification per form submission");
    const notification = h.calls.mail[0][0];
    assert.deepEqual(notification.to, EXPECTED_RECIPIENTS, "mandatory sales/contact pair and existing marketing extra must receive every form");
    assert.equal(notification.replyTo, EMAIL, "team replies must still go to the submitting visitor");
    assert.equal(notification.rescue, true);
    for (const value of ["Offline Test Person", "Offline Routing Test", EMAIL, "+1 (416) 555-0132"]) {
      assert.ok(notification.text.includes(value), `notification lost ${value}`);
    }
    assert.equal(h.calls.store.length, 1);
    assert.equal(h.calls.store[0][0].source, route.source);
    assert.equal(h.calls.crm.length, 1);
    assert.equal(h.calls.crm[0][0].source, route.source);
    assert.equal(h.calls.crm[0][0].submissionId, stored ? LEAD_ID : undefined);
    assert.equal(h.calls.autoresponder.length, 1);
    assert.deepEqual(h.calls.autoresponder[0][0], { name: "Offline Test Person", email: EMAIL });
    for (const api of ["meta", "openai"]) {
      assert.equal(h.calls[api].length, 1);
      assert.equal(h.calls[api][0][0].source, route.source);
    }
    if (route.kind !== "contact") assert.ok(notification.text.includes(`Source: ${route.source}`));
    if (route.kind === "shared" || route.kind === "contact") {
      assert.ok(notification.text.includes("Google Ads, Meta Ads"));
      assert.ok(notification.text.includes("Please help us improve our lead capture."));
    } else {
      assert.equal(h.calls.landing.length, 1);
      assert.ok(notification.text.includes("utm_campaign=offline-campaign"));
      assert.equal(h.calls.landing[0][0].utm.utm_campaign, "offline-campaign");
    }
    if (route.source === gta.GTA_LANDING_SOURCE) assert.ok(notification.text.includes("Preferred channel: Google + Meta"));
    if (route.kind === "seo") assert.ok(notification.text.includes("Target search: heating services Toronto"));
    checks++;
    console.log(`PASS ${route.label}: ${stored ? "deferred stored" : "immediate email-only"} delivery preserves recipients, Reply-To and source data`);
  }
}

console.log(`\n${checks} offline form-routing checks passed. No credentials loaded; no network or real email used.`);
