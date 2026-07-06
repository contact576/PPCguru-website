// Playwright-based full-site link crawler & broken-link checker.
// Crawls every internal route reachable from "/", records HTTP status of
// every internal link, and HEAD-checks external links. Reports anything
// that is not OK, with the source page(s) that link to it.
//
// Usage: node scripts/link-crawl.mjs [baseUrl]
//   default baseUrl = http://localhost:3000

import { request } from 'playwright';

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const origin = new URL(BASE).origin;

const internalStatus = new Map();   // url -> status (number | 'ERR')
const externalStatus = new Map();   // url -> status
const linkSources = new Map();      // url -> Set(sourcePage)   (who links to it)
const queue = [];
const enqueued = new Set();

function addSource(url, from) {
  if (!linkSources.has(url)) linkSources.set(url, new Set());
  if (from) linkSources.get(url).add(from);
}

function normalize(href, fromUrl) {
  try {
    if (!href) return null;
    href = href.trim();
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      href.startsWith('data:')
    ) return null;
    const u = new URL(href, fromUrl);
    u.hash = '';               // drop anchors — same page
    return u.toString();
  } catch {
    return null;
  }
}

function extractLinks(html, fromUrl) {
  const links = [];
  // <a href>, plus src for internal asset sanity
  const re = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const n = normalize(m[1], fromUrl);
    if (n) links.push(n);
  }
  return links;
}

function isInternal(url) {
  try { return new URL(url).origin === origin; } catch { return false; }
}

const ctx = await request.newContext({
  ignoreHTTPSErrors: true,
  timeout: 30000,
  extraHTTPHeaders: { 'User-Agent': 'link-crawler/1.0 (+playwright)' },
});

async function checkExternal(url) {
  if (externalStatus.has(url)) return;
  try {
    let res = await ctx.head(url, { timeout: 15000, maxRedirects: 5 });
    let status = res.status();
    // Some servers reject HEAD — retry with GET
    if (status === 405 || status === 403 || status === 501) {
      res = await ctx.get(url, { timeout: 15000, maxRedirects: 5 });
      status = res.status();
    }
    externalStatus.set(url, status);
  } catch (e) {
    externalStatus.set(url, 'ERR:' + (e.message || 'failed').split('\n')[0].slice(0, 80));
  }
}

// Seed
queue.push(BASE + '/');
enqueued.add(BASE + '/');

let processed = 0;
while (queue.length) {
  const url = queue.shift();
  processed++;
  let res, status, ct = '', body = '';
  try {
    res = await ctx.get(url, { timeout: 30000, maxRedirects: 5 });
    status = res.status();
    ct = (res.headers()['content-type'] || '').toLowerCase();
    if (ct.includes('text/html')) body = await res.text();
  } catch (e) {
    status = 'ERR:' + (e.message || 'failed').split('\n')[0].slice(0, 80);
  }
  internalStatus.set(url, status);
  process.stdout.write(`[${processed}] ${status}  ${url}\n`);

  if (body) {
    for (const link of extractLinks(body, url)) {
      addSource(link, url);
      if (isInternal(link)) {
        if (!enqueued.has(link)) { enqueued.add(link); queue.push(link); }
      } else {
        // external — queue a check (dedup handled inside)
        await checkExternal(link);
      }
    }
  }
}

await ctx.dispose();

// ---- Report ----
const brokenInternal = [...internalStatus.entries()].filter(
  ([, s]) => typeof s === 'string' ? s.startsWith('ERR') : (s >= 400 || s === 0)
);
const brokenExternal = [...externalStatus.entries()].filter(
  ([, s]) => typeof s === 'string' ? s.startsWith('ERR') : (s >= 400 || s === 0)
);

console.log('\n' + '='.repeat(70));
console.log(`CRAWL COMPLETE`);
console.log(`  Internal pages crawled : ${internalStatus.size}`);
console.log(`  External links checked  : ${externalStatus.size}`);
console.log(`  Broken internal        : ${brokenInternal.length}`);
console.log(`  Broken external        : ${brokenExternal.length}`);
console.log('='.repeat(70));

function dumpBroken(label, list) {
  if (!list.length) { console.log(`\n✅ ${label}: none`); return; }
  console.log(`\n❌ ${label}:`);
  for (const [url, status] of list) {
    console.log(`  ${status}  ${url}`);
    const srcs = [...(linkSources.get(url) || [])].slice(0, 6);
    for (const s of srcs) console.log(`        ← linked from: ${s}`);
  }
}

dumpBroken('BROKEN INTERNAL LINKS', brokenInternal);
dumpBroken('BROKEN EXTERNAL LINKS', brokenExternal);

// Machine-readable summary
console.log('\nJSON_SUMMARY_START');
console.log(JSON.stringify({
  internalCrawled: internalStatus.size,
  externalChecked: externalStatus.size,
  brokenInternal: brokenInternal.map(([u, s]) => ({ url: u, status: s, from: [...(linkSources.get(u) || [])] })),
  brokenExternal: brokenExternal.map(([u, s]) => ({ url: u, status: s, from: [...(linkSources.get(u) || [])] })),
}, null, 2));
console.log('JSON_SUMMARY_END');

process.exit(brokenInternal.length ? 1 : 0);
