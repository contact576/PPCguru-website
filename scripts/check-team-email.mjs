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
const team = ["sales@ppcguru.ca", "contact@ppcguru.ca"];

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

await check("sales and contact cannot be omitted by CONTACT_TO_EMAIL", async () => {
  for (const configured of [undefined, "", "marketing@ppcguru.ca", " Marketing@ppcguru.ca, SALES@ppcguru.ca, sales@ppcguru.ca ", "owner@ppcguru.ca"]) {
    const h = harness({ env: { CONTACT_TO_EMAIL: configured } });
    const recipients = Array.from(h.mail.leadRecipients());
    assert.ok(team.every((recipient) => recipients.includes(recipient)));
    assert.equal(recipients.length, new Set(recipients).size);
    assert.ok(recipients.includes(configured === "owner@ppcguru.ca" ? "owner@ppcguru.ca" : "marketing@ppcguru.ca"));
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

await check("explicit Resend selection without key never falls back to suspended SMTP", async () => {
  const h = harness({ env: { EMAIL_PROVIDER: "resend" } });
  assert.equal(h.mail.emailConfigured(), false);
  assert.equal(await h.mail.sendMail({ to: team, subject: "Offline" }), false);
  assert.equal(h.calls.smtp.length, 0);
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
  assert.deepEqual(Array.from(h.calls.resend[0].to), ["contact@ppcguru.ca"]);
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
    accepted: team,
    env: { RESEND_API_KEY: "offline" },
    resendErrors: [{ message: "domain is not verified" }, null],
  });
  assert.equal(await h.mail.sendMail({ to: [...team, "marketing@ppcguru.ca"], subject: "Offline", rescue: true }), true);
});

console.log(`${checks} offline team email checks passed. No real emails sent.`);
