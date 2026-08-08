/**
 * Regression check for `lib/spam-filter.ts`.
 *
 *   npm run check:spam
 *
 * The repo has no test framework, so this is a standalone assertion script
 * (Node 22 type-stripping, no build step). The "real:" cases matter more than
 * the "spam:" ones — a blocked plumber costs a client, a leaked spam email
 * costs an inbox. Add a case here whenever you touch a scoring rule.
 */
import { scoreSubmission } from "../lib/spam-filter.ts";

const now = Date.now();
const human = String(now - 45_000); // filled over 45 seconds

const cases: Array<[string, boolean, Parameters<typeof scoreSubmission>[0]]> = [
  // ── Legitimate leads that MUST get through ──────────────────────────────
  ["real: plumber, gmail", false, { name: "Dave Thompson", email: "dave.thompson@gmail.com", phone: "416-555-0199", website: "https://thompsonplumbing.ca", message: "We spend about $4,000/month on Google Ads and leads got expensive. Want an audit.", renderedAt: human }],
  ["real: clinic owner, own domain", false, { name: "Priya Raghunathan", email: "priya@northyorkphysio.com", phone: "(905) 555-0142", message: "Looking for help with Meta ads for our physio clinic. Site is https://northyorkphysio.com", renderedAt: human }],
  ["real: short message, no phone", false, { name: "Sam Lee", email: "sam@leehvac.ca", message: "Need more booked jobs this winter.", renderedAt: human }],
  ["real: long business name, all caps company", false, { name: "MARCO DI STEFANO", email: "marco@distefanoroofing.ca", phone: "6475550188", message: "Roofing company in Vaughan. Currently paying $180 per lead, too high.", renderedAt: human }],
  ["real: outlook + numbers in email", false, { name: "Jen Okafor", email: "jenokafor88@outlook.com", phone: "289-555-0110", message: "Can you look at our account?", renderedAt: human }],
  ["real: no renderedAt (cached page)", false, { name: "Chris Bell", email: "chris@bellmoving.ca", message: "Interested in the free audit please." }],

  // ── Spam that MUST be blocked ───────────────────────────────────────────
  ["spam: SEO backlink pitch", true, { name: "Rahul", email: "seoexpert4529@gmail.com", message: "I came across your website and noticed your website is not ranking. We offer seo services and quality backlink packages to get you on the first page of google.", renderedAt: human }],
  ["spam: link drop", true, { name: "buy now", email: "x@mailinator.com", message: "check http://a.co and http://b.co and www.c.co", renderedAt: human }],
  ["spam: URL in name", true, { name: "https://cheap-pills.ru", email: "a@b.com", message: "hello", renderedAt: human }],
  ["spam: casino", true, { name: "Agen Slot", email: "slot@x.com", message: "judi bola slot online terpercaya", renderedAt: human }],
  ["spam: instant submit (bot speed)", true, { name: "John Smith", email: "john@example.com", message: "Great website! Contact me.", renderedAt: String(now - 300) }],
  ["spam: BBCode", true, { name: "Viktor", email: "v@mail.ru", message: "[url=http://x.ru]click[/url]", renderedAt: human }],
  ["spam: cyrillic + pitch", true, { name: "Алексей Петров", email: "temp@yopmail.com", message: "we are a leading offshore outsourcing company, hire developers cheap", renderedAt: human }],
  ["spam: keyboard mash + disposable", true, { name: "asdfghjkl", email: "zzz@guerrillamail.com", message: "test test", renderedAt: human }],
  // Stale timestamp alone is deliberately NOT fatal — a real visitor can leave a
  // tab open overnight. It only blocks with a corroborating signal.
  ["real: tab left open overnight", false, { name: "Bot Runner", email: "bot@example.org", message: "Replayed post", renderedAt: String(now - 20 * 60 * 60 * 1000) }],
  ["spam: stale replay + disposable", true, { name: "Bot Runner", email: "bot@yopmail.com", message: "Replayed post", renderedAt: String(now - 20 * 60 * 60 * 1000) }],
];

let failures = 0;
for (const [label, shouldBlock, input] of cases) {
  const v = scoreSubmission(input);
  const pass = v.spam === shouldBlock;
  if (!pass) failures++;
  console.log(
    `${pass ? "PASS" : "FAIL"}  ${label.padEnd(42)} score=${String(v.score).padStart(2)} blocked=${String(v.spam).padEnd(5)} ${v.reasons.join("; ")}`,
  );
}
console.log(`\n${cases.length - failures}/${cases.length} passed`);
process.exit(failures ? 1 : 0);
