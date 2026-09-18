import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { sendOpenAiLeadCreated } from "../lib/openai-ads.ts";

const originalFetch = globalThis.fetch;
const originalWarn = console.warn;
const originalEnv = { ...process.env };
const calls: Array<{ url: string; init: RequestInit }> = [];
const warnings: string[] = [];
let statuses: number[] = [];

globalThis.fetch = async (input, init) => {
  calls.push({ url: String(input), init: init ?? {} });
  return new Response("{}", { status: statuses.shift() ?? 200 });
};
console.warn = (...values: unknown[]) => warnings.push(values.join(" "));

const hash = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");

try {
  process.env.OPENAI_ADS_CONVERSIONS_API_KEY = "offline-secret";
  process.env.OPENAI_ADS_PIXEL_ID = "offline-pixel";

  const event = {
    eventId: "lead-event-123",
    email: " LEAD@EXAMPLE.INVALID ",
    phone: "+1 (416) 555-0123",
    name: "Mary O'Connor",
    externalId: "lead-row-123",
    oppref: "opaque-click-reference",
    obref: "opaque-browser-reference",
    sourceUrl: "https://ppcguru.ca/100-leads/thank-you",
    ipAddress: "203.0.113.7",
    userAgent: "Offline browser",
    measurementConsent: "accepted" as const,
  };

  assert.equal(await sendOpenAiLeadCreated(event), true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://bzr.openai.com/v1/events?pid=offline-pixel");
  assert.equal((calls[0].init.headers as Record<string, string>).Authorization, "Bearer offline-secret");
  const request = JSON.parse(String(calls[0].init.body));
  assert.equal(request.integration_source, "ppc_guru_website");
  assert.equal(request.events[0].id, event.eventId);
  assert.equal(request.events[0].type, "lead_created");
  assert.equal(request.events[0].data.type, "customer_action");
  assert.equal(request.events[0].oppref, event.oppref);
  assert.equal(request.events[0].user.obref, event.obref);
  assert.deepEqual(request.events[0].user.emails_sha256, [hash("lead@example.invalid")]);
  assert.deepEqual(request.events[0].user.phone_numbers_sha256, [hash("14165550123")]);
  assert.deepEqual(request.events[0].user.first_names_sha256, [hash("mary")]);
  assert.deepEqual(request.events[0].user.last_names_sha256, [hash("oconnor")]);
  assert.deepEqual(request.events[0].user.external_ids_sha256, [hash("lead-row-123")]);
  assert.equal(JSON.stringify(request).includes("LEAD@EXAMPLE.INVALID"), false);
  assert.equal(JSON.stringify(request).includes("416) 555"), false);

  statuses = [503, 200];
  assert.equal(await sendOpenAiLeadCreated({ ...event, eventId: "retry-same-id" }), true);
  assert.equal(calls.length, 3);
  const firstRetry = JSON.parse(String(calls[1].init.body));
  const secondRetry = JSON.parse(String(calls[2].init.body));
  assert.equal(firstRetry.events[0].id, "retry-same-id");
  assert.equal(secondRetry.events[0].id, "retry-same-id");

  const beforeDecline = calls.length;
  assert.equal(await sendOpenAiLeadCreated({ ...event, measurementConsent: "declined" }), false);
  assert.equal(calls.length, beforeDecline, "declined consent must suppress the server event");

  delete process.env.OPENAI_ADS_CONVERSIONS_API_KEY;
  delete process.env.OPENAI_ADS_CAPI_KEY;
  delete process.env.OPENAI_ADS_API_KEY;
  delete process.env.OPENAI_CONVERSIONS_API_KEY;
  delete process.env.OPENAI_CAPI_KEY;
  assert.equal(await sendOpenAiLeadCreated(event), false);
  assert.equal(calls.length, beforeDecline, "missing credentials must fail closed without a request");
  assert.equal(warnings.some((warning) => warning.includes("offline-secret") || warning.includes("lead@example.invalid")), false);

  console.log("PASS: OpenAI Ads CAPI payload, normalization, dedup id, retry safety, consent suppression and private logging.");
} finally {
  globalThis.fetch = originalFetch;
  console.warn = originalWarn;
  for (const name of [
    "OPENAI_ADS_CONVERSIONS_API_KEY",
    "OPENAI_ADS_CAPI_KEY",
    "OPENAI_ADS_API_KEY",
    "OPENAI_CONVERSIONS_API_KEY",
    "OPENAI_CAPI_KEY",
    "OPENAI_ADS_PIXEL_ID",
    "NEXT_PUBLIC_OPENAI_ADS_PIXEL_ID",
  ]) {
    if (originalEnv[name] === undefined) delete process.env[name];
    else process.env[name] = originalEnv[name];
  }
}
