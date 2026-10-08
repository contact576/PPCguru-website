// Exercise the real tracker and analytics helper offline; never open a dialer or send a beacon.
// Run: node scripts/check-phone-tracking.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = path.resolve(import.meta.dirname, "..");
function load(file, imports = {}, globals = {}) {
  const code = ts.transpileModule(readFileSync(path.join(root, file), "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, ...globals, require(name) {
    assert.ok(Object.hasOwn(imports, name), `Unexpected import: ${name}`);
    return imports[name];
  } }, { filename: file, timeout: 5000 });
  return module.exports;
}
const config = load("lib/site-config.ts");

// Minimal element tree to cover delegated clicks on links, text wrappers and SVG paths.
class Element {
  constructor(tagName, attrs = {}, parent = null) {
    Object.assign(this, { tagName, attrs, parent, textContent: attrs.text || "" });
  }
  getAttribute(name) { return this.attrs[name] ?? null; }
  closest(selector) {
    if (selector.split(/,\s*/).some((s) => s === this.tagName.toLowerCase() || (s === "[data-track]" && this.attrs["data-track"]))) return this;
    return this.parent?.closest(selector) || null;
  }
}
class Anchor extends Element {
  constructor(href, attrs = {}, parent = null) { super("A", { href, text: "(519) 992-9567", ...attrs }, parent); }
}

function harness() {
  const storage = new Map();
  const beacons = [];
  const listeners = new Set();
  const effects = [];
  const win = { dataLayer: [{ event: "existing_event" }] };
  const location = { pathname: "/contact", search: "" };
  const globals = {
    window: win, location, Element, HTMLAnchorElement: Anchor, URLSearchParams,
    process: { env: { NODE_ENV: "production" } },
    crypto: { randomUUID: () => "offline-session" },
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    navigator: { sendBeacon: (_url, body) => { beacons.push(JSON.parse(body.text)); return true; } },
    Blob: class { constructor(parts) { this.text = parts.join(""); } },
    document: {
      referrer: "", title: "Offline phone tracking test",
      addEventListener: (name, handler) => { assert.equal(name, "click"); listeners.add(handler); },
      removeEventListener: (name, handler) => { assert.equal(name, "click"); listeners.delete(handler); },
    },
    fetch() { throw new Error("Network forbidden"); },
  };
  const analytics = load("lib/analytics.ts", { "@/lib/site-config": config }, globals);
  const tracker = load("components/analytics/tracker.tsx", {
    react: { useEffect: (effect) => effects.push(effect), useRef: (value) => ({ current: value }) },
    "next/navigation": { usePathname: () => location.pathname },
    "@/lib/analytics": analytics,
    "@/lib/data/landing-gta": { GTA_LANDING_THANK_YOU_PATH: "/gta/thank-you" },
    "@/lib/data/landing-google-meta": { GOOGLE_META_LANDING_THANK_YOU_PATH: "/google-meta/thank-you" },
  }, globals);
  tracker.VisitorTracker();
  const attach = effects.at(-1);
  const cleanup = attach();
  return { win, storage, beacons, location, listeners, attach, cleanup,
    click(target, detail = 1) {
      for (const listener of listeners) listener({ target, detail, preventDefault() { throw new Error("Dialing must not be blocked"); } });
    },
    events: () => win.dataLayer.filter((event) => event.event === "phone_click"),
  };
}

const h = harness();
const header = new Element("HEADER");
const phone = new Anchor("tel:5199929567", {}, header);
h.click(new Element("PATH", {}, new Element("SVG", {}, phone)));
assert.equal(h.events().length, 1, "Nested SVG tap emits one phone event");
assert.equal(h.beacons.length, 1, "Phone tap does not also emit a generic click");
assert.equal(h.beacons[0].event, "phone_click");
assert.deepEqual(JSON.parse(JSON.stringify(h.events()[0])), {
  event: "phone_click", click_url: "tel:5199929567", link_url: "tel:5199929567",
  phone_number: "5199929567", page_path: "/contact", link_text: "(519) 992-9567", source: "header",
});
assert.equal(h.win.dataLayer[0].event, "existing_event", "Existing data layer remains intact");
h.location.pathname = "/100-leads/thank-you";
h.click(new Anchor("tel:+1 (519) 992-9567", { "data-track-source": "landing:100-leads:thank-you" }), 0);
assert.equal(h.events().length, 2, "Keyboard-style click and international formatting work after navigation");
assert.equal(h.events()[1].source, "landing:100-leads:thank-you");
assert.equal(h.events()[1].page_path, "/100-leads/thank-you");

h.storage.set("ppcg_cookie_consent", "declined");
h.click(phone);
assert.equal(h.events().length, 2, "Declined consent suppresses the GTM event");
assert.equal(h.beacons.length, 2, "Declined consent suppresses the first-party event");
h.storage.set("ppcg_cookie_consent", "accepted");
h.click(new Anchor("tel:4165550132"));
h.click(new Anchor("mailto:contact@ppcguru.ca"));
h.click(null);
h.location.pathname = "/admin/leads";
h.click(phone);
assert.equal(h.events().length, 2, "Other numbers, non-phone links and admin pages do not emit phone conversions");
h.cleanup();
assert.equal(h.listeners.size, 0, "Unmount removes the delegated listener");
const cleanupAgain = h.attach();
h.location.pathname = "/";
h.click(phone);
assert.equal(h.events().length, 3, "Effect cleanup/remount does not duplicate events");
cleanupAgain();
const thanks = readFileSync(path.join(root, "components/landing/thank-you-actions.tsx"), "utf8");
assert.ok(!thanks.includes('track("phone_click"'), "Thank-you buttons do not have a second phone handler");
const dni = harness();
const forwardingLink = new Anchor("tel:+18005550123", { "data-phone-link": "business", text: "(800) 555-0123" });
dni.click(forwardingLink);
assert.equal(dni.events().length, 1, "Marked business links survive forwarding-number insertion");
assert.equal(dni.events()[0].click_url, "tel:+18005550123", "The actual forwarding URL is retained");
assert.equal(dni.events()[0].link_url, "tel:+18005550123");
assert.equal(dni.events()[0].phone_number, "5199929567", "The business identity remains stable");
dni.location.pathname = "/admin";
dni.click(forwardingLink);
assert.equal(dni.events().length, 1, "A marked link cannot bypass admin exclusion");
dni.cleanup();
for (const file of ["app/page.tsx", "app/contact/page.tsx", "app/overview/page.tsx", "components/layout/site-header.tsx", "components/layout/site-footer.tsx", "components/landing/leads-landing.tsx", "components/landing/gta-landing.tsx", "components/landing/google-meta-landing.tsx", "components/landing/google-meta-footer.tsx"]) {
  const source = readFileSync(path.join(root, file), "utf8");
  assert.ok(!/href=\{siteConfig\.contact\.phoneHref\}(?! data-phone-link="business")/.test(source), `${file} marks every business phone link`);
}
console.log("Phone tracking checks passed: link formats, delegated SVG/keyboard clicks, consent, exclusions, navigation, forwarding numbers and cleanup.");
