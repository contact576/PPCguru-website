// Offline behavior checks against the real TypeScript form actions.
// Run: npm run check:lead-routing
// Only Zod and TypeScript are loaded from installed dependencies. Every action
// import that could read credentials, send email, or access a network is mocked.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';

const repo = path.resolve(process.argv[2] || process.cwd());
const repoRequire = createRequire(path.join(repo, 'package.json'));
const ts = repoRequire('typescript');
const zod = repoRequire('zod');
let checks = 0;

function compileModule(relativePath, imports = {}) {
  const filename = path.join(repo, relativePath);
  const source = readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  });
  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require(specifier) {
      if (!Object.hasOwn(imports, specifier)) {
        throw new Error(`Unmocked import refused in offline test: ${specifier}`);
      }
      return imports[specifier];
    },
    FormData,
    Date,
    console: { warn() {}, info() {}, error() {}, log() {} },
    fetch() { throw new Error('Network access forbidden in offline action checks'); },
  };
  vm.runInNewContext(compiled.outputText, sandbox, { filename, timeout: 5000 });
  return module.exports;
}

const options = compileModule('lib/data/form-options.ts');
const leadId = '10000000-0000-4000-8000-000000000007';

function harness(action, overrides = {}) {
  const config = {
    supabaseConfigured: true,
    storedId: leadId,
    ghlConfigured: true,
    ghlResult: true,
    zohoConfigured: true,
    zohoResult: true,
    rateAllowed: true,
    turnstileOk: true,
    spam: false,
    ...overrides,
  };
  const calls = { store: [], ghl: [], zoho: [], identify: [], mail: [], autoresponder: [] };
  const persisted = new Map();
  const events = [];
  const spy = (key, result) => async (value) => {
    calls[key].push(structuredClone(value));
    events.push(key);
    return result;
  };
  const imports = {
    zod,
    '@/lib/data/form-options': options,
    '@/lib/email': {
      leadRecipients: () => ['offline-only@example.invalid'],
      emailConfigured: () => false,
      sendMail: spy('mail', false),
      sendLeadAutoresponder: spy('autoresponder', false),
    },
    '@/lib/supabase': {
      hasSupabase: () => config.supabaseConfigured,
      saveLeadReturning: async (record) => {
        calls.store.push(structuredClone(record));
        events.push('save-start');
        await Promise.resolve();
        if (config.storedId) persisted.set(config.storedId, structuredClone(record));
        events.push('save-complete');
        return config.storedId;
      },
    },
    '@/lib/zoho': {
      zohoConfigured: () => config.zohoConfigured,
      sendLeadToZoho: spy('zoho', config.zohoResult),
    },
    '@/lib/gohighlevel': {
      ghlConfigured: () => config.ghlConfigured,
      sendLeadToGhl: spy('ghl', config.ghlResult),
    },
    '@/lib/identity': { identifyVisitor: spy('identify', undefined) },
    '@/lib/turnstile': {
      verifyTurnstile: async () => ({ ok: config.turnstileOk }),
      turnstileConfigured: () => true,
    },
    '@/lib/spam-filter': {
      scoreSubmission: () => ({ spam: config.spam, score: config.spam ? 10 : 0, reasons: [] }),
      logBlocked() {},
    },
    '@/lib/rate-limit': {
      rateLimit: () => ({ ok: config.rateAllowed }),
      clientIpFromHeaders: async () => '192.0.2.1',
    },
  };
  const fn = compileModule(action.file, imports)[action.exportName];
  return { config, calls, persisted, events, run: (form) => fn({ ok: false, message: '' }, form) };
}

function validForm(action) {
  const form = new FormData();
  const fields = {
    name: 'Offline Test Person',
    email: 'routing-check@example.invalid',
    phone: '+14165550123',
    company: 'Offline Routing Test',
    budget: options.BUDGET_OPTIONS[0],
    source: 'test:shared-action',
    session_id: 'offline-session-id',
    turnstileToken: 'offline-token',
    renderedAt: String(Date.now() - 20_000),
    [action.websiteField]: 'https://example.invalid',
    [action.messageField]: 'Please help us measure and improve our lead capture.',
  };
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  form.append('services', options.SERVICE_OPTIONS[0]);
  form.append('services', options.SERVICE_OPTIONS[1]);
  return form;
}

function noOutbound(h) {
  for (const key of ['ghl', 'zoho', 'identify', 'mail', 'autoresponder']) {
    assert.equal(h.calls[key].length, 0, `${key} must not run`);
  }
}

async function check(action, label, test) {
  await test();
  checks++;
  console.log(`PASS ${action.exportName}: ${label}`);
}

const actions = [
  { file: 'app/actions/lead.ts', exportName: 'captureLead', websiteField: 'website', messageField: 'detail', honeypot: 'company_website' },
  { file: 'app/contact/actions.ts', exportName: 'submitContact', websiteField: 'site_url', messageField: 'message', honeypot: 'website' },
];

for (const action of actions) {
  await check(action, 'GHL replaces Zoho and receives the persisted submission id and full form data', async () => {
    const h = harness(action);
    const result = await h.run(validForm(action));
    assert.equal(result.ok, true);
    assert.equal(h.calls.store.length, 1);
    assert.equal(h.calls.ghl.length, 1);
    assert.equal(h.calls.zoho.length, 0);
    assert.ok(h.events.indexOf('save-complete') < h.events.indexOf('ghl'), 'save must complete before CRM');
    const { submissionId, createdAt, ...crmRecord } = h.calls.ghl[0];
    assert.equal(submissionId, leadId);
    assert.ok(Number.isFinite(Date.parse(createdAt)));
    assert.deepEqual(crmRecord, h.persisted.get(leadId));
    assert.equal(crmRecord.service, `${options.SERVICE_OPTIONS[0]}, ${options.SERVICE_OPTIONS[1]}`);
    assert.equal(crmRecord.website, 'https://example.invalid');
    assert.equal(crmRecord.message, 'Please help us measure and improve our lead capture.');
    assert.equal(crmRecord.source, action.exportName === 'submitContact' ? 'contact' : 'test:shared-action');
    assert.equal(h.calls.identify[0].leadId, leadId);
    assert.equal(h.calls.identify[0].sessionId, 'offline-session-id');
  });

  await check(action, 'Zoho remains active until GHL is configured', async () => {
    const h = harness(action, { ghlConfigured: false });
    assert.equal((await h.run(validForm(action))).ok, true);
    assert.equal(h.calls.ghl.length, 0);
    assert.equal(h.calls.zoho.length, 1);
    assert.deepEqual(h.calls.zoho[0], h.persisted.get(leadId));
    assert.ok(h.events.indexOf('save-complete') < h.events.indexOf('zoho'));
  });

  for (const activeGhl of [true, false]) {
    await check(action, `failed configured Supabase write stops all outbound (${activeGhl ? 'GHL' : 'Zoho'} selected)`, async () => {
      const h = harness(action, { storedId: null, ghlConfigured: activeGhl });
      const result = await h.run(validForm(action));
      assert.equal(result.ok, false);
      assert.match(result.message, /save/i);
      assert.equal(h.calls.store.length, 1);
      assert.equal(h.persisted.size, 0);
      noOutbound(h);
    });
  }

  await check(action, 'GHL failure preserves the saved lead and returns success without falling back to Zoho', async () => {
    const h = harness(action, { ghlResult: false });
    const result = await h.run(validForm(action));
    assert.equal(result.ok, true, 'DB success must preserve the accepted submission even when email and GHL fail');
    assert.equal(h.persisted.size, 1);
    assert.equal(h.calls.ghl.length, 1);
    assert.equal(h.calls.zoho.length, 0);
    assert.equal(h.calls.ghl[0].submissionId, leadId);
  });

  for (const invalidField of ['email', 'services', 'honeypot']) {
    await check(action, `invalid ${invalidField} cannot write a lead or call any outbound service`, async () => {
      const h = harness(action);
      const form = validForm(action);
      if (invalidField === 'email') form.set('email', 'not-an-email');
      if (invalidField === 'services') form.set('services', 'unrecognized-service');
      if (invalidField === 'honeypot') form.set(action.honeypot, 'automated-trap-value');
      assert.equal((await h.run(form)).ok, false);
      assert.equal(h.calls.store.length, 0);
      noOutbound(h);
    });
  }

  for (const [label, config, expectedOk] of [
    ['heuristic spam', { spam: true }, true],
    ['rate-limited request', { rateAllowed: false }, true],
    ['failed Turnstile', { turnstileOk: false }, false],
  ]) {
    await check(action, `${label} cannot write a lead or call any outbound service`, async () => {
      const h = harness(action, config);
      assert.equal((await h.run(validForm(action))).ok, expectedOk);
      assert.equal(h.calls.store.length, 0);
      noOutbound(h);
    });
  }
}

console.log(`\n${checks} offline action behavior checks passed. No credentials loaded; no network or real email used.`);
