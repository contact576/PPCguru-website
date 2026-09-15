/**
 * PPC Guru Client Service Terms — the versioned, immutable legal document.
 *
 * WHY THIS IS A SELF-CONTAINED DOCUMENT AND NOT A NORMAL PAGE
 * A signed agreement points at ONE exact URL, and the terms at that URL must
 * never change — not when the marketing site is redesigned, not when a font or
 * a layout component moves. So this module owns the whole document: its text,
 * its CSS and its markup, with no imports, no external fonts and no analytics.
 * `renderClientTermsDocument()` returns the complete HTML that is BOTH served at
 * /client-service-terms/<version> and archived byte-for-byte with its SHA-256
 * (scripts/archive-terms.mts), so the archived hash stays meaningful forever.
 *
 * TO PUBLISH A REVISION
 * Add a NEW entry to CLIENT_TERMS_VERSIONS with a new id (vYYYY-MM-DD), point
 * CURRENT_CLIENT_TERMS_VERSION at it, and run `npm run terms:archive`. NEVER
 * edit a published version: contracts already reference it, and the old URL has
 * to keep serving the words that were signed.
 *
 * No `@/` path aliases on purpose — scripts/archive-terms.mts imports this file
 * directly under `node --experimental-strip-types`, which does not resolve them.
 */

export type TermsClause = {
  /** Clause number as printed, e.g. "1.1". Omitted where the section is one unnumbered paragraph. */
  n?: string;
  text: string;
};

export type TermsSection = {
  /** Section number as printed, e.g. "1". Omitted for the closing note. */
  n?: string;
  title: string;
  /** Anchor id — stable, so a clause can be linked to from an email or a contract note. */
  id: string;
  clauses: TermsClause[];
};

export type ClientTermsVersion = {
  /** Version identifier, e.g. "v2026-09-15". Also the last URL segment. */
  id: string;
  /** Effective date as printed. */
  effectiveDate: string;
  /** Effective date, machine-readable (for <time> and the archive manifest). */
  effectiveDateIso: string;
  /** Document title exactly as handed off. */
  title: string;
  owner: string;
  contactEmail: string;
  intro: string;
  sections: TermsSection[];
};

export const CLIENT_TERMS_BASE_PATH = "/client-service-terms";
export const CURRENT_CLIENT_TERMS_VERSION = "v2026-09-15";
export const CLIENT_TERMS_ORIGIN = "https://ppcguru.ca";

const V2026_09_15: ClientTermsVersion = {
  id: "v2026-09-15",
  effectiveDate: "September 15, 2026",
  effectiveDateIso: "2026-09-15",
  title: "Client Service Terms",
  owner: "PPC Guru Inc.",
  contactEmail: "contact@ppcguru.ca",
  intro:
    "These Client Service Terms form part of each service summary, proposal, order form, or agreement that refers to them (the Service Summary). They are between PPC Guru Inc. (PPC Guru, we, us, or the Supplier) and the client identified in the Service Summary (the Client). The Service Summary and these Client Service Terms together form the Agreement.",
  sections: [
    {
      n: "1",
      title: "Terms and services",
      id: "terms-and-services",
      clauses: [
        {
          n: "1.1",
          text: "If the Service Summary conflicts with these Client Service Terms, the Service Summary controls only for the specific commercial term or service detail stated there. Any other change must be agreed in writing by both parties.",
        },
        {
          n: "1.2",
          text: "The Client accepts the Agreement by electronically signing the Service Summary. PPC Guru will provide the services described in the Service Summary, which may include Google Ads, Meta Ads, website or landing-page work, Google Business Profile services, search engine optimization, social-media services, or related marketing work.",
        },
      ],
    },
    {
      n: "2",
      title: "Fees and expenses",
      id: "fees-and-expenses",
      clauses: [
        {
          n: "2.1",
          text: "The Client will pay the one-time, recurring, usage-based, and other fees stated in the Service Summary. Commercial pricing is client-specific and is not fixed by these Client Service Terms.",
        },
        {
          n: "2.2",
          text: "Work outside the agreed scope requires written agreement on scope and price. Unless the Service Summary states otherwise, approved additional work may be billed at $70 CAD per hour.",
        },
        {
          n: "2.3",
          text: "The Client is responsible for third-party costs, including advertising-platform spend, hosting, domains, software, printing, or other approved expenses, unless the Service Summary states otherwise.",
        },
        {
          n: "2.4",
          text: "Unless the Service Summary states otherwise, prices are in Canadian dollars and exclude HST and other applicable taxes. Fees paid are non-refundable except where required by law or expressly stated in the Service Summary.",
        },
      ],
    },
    {
      n: "3",
      title: "Payment",
      id: "payment",
      clauses: [
        {
          n: "3.1",
          text: "One-time setup, creative, research, and similar fees are due when the Agreement is signed or on the invoice due date. The first monthly retainer is due before the advertising account or recurring service goes live, unless the Service Summary states otherwise.",
        },
        {
          n: "3.2",
          text: "Recurring fees are charged on the schedule stated in the Service Summary. By entering a payment method in the secure checkout, the Client authorizes PPC Guru and its payment processor to charge the agreed amounts and applicable taxes according to that schedule.",
        },
        {
          n: "3.3",
          text: "PPC Guru does not request that card numbers or security codes be entered into this terms page or sent by email. Payment information must be submitted through the approved secure checkout.",
        },
        {
          n: "3.4",
          text: "If a payment fails, PPC Guru may pause services after notifying the Client. The Client will provide a valid alternative payment method within three business days. Outstanding amounts remain payable.",
        },
        {
          n: "3.5",
          text: "Overdue amounts may accrue interest at two percent per month or the maximum rate permitted by law, whichever is lower, calculated daily and compounded monthly.",
        },
      ],
    },
    {
      n: "4",
      title: "Changes to services",
      id: "changes-to-services",
      clauses: [
        {
          text: "The Client may request changes in writing. PPC Guru may accept or decline a change after considering scope, timing, capacity, and cost. Any accepted change and related fees will be confirmed in writing. If circumstances outside PPC Guru's reasonable control require a change, PPC Guru will notify the Client and make reasonable efforts to preserve the original purpose of the work.",
        },
      ],
    },
    {
      n: "5",
      title: "Term renewal and early termination",
      id: "term-renewal-and-early-termination",
      clauses: [
        {
          n: "5.1",
          text: "The Agreement begins on the commencement date in the Service Summary and continues for the stated term. To end the Agreement at the conclusion of that term, the Client must email contact@ppcguru.ca at least thirty days before expiry. If timely written notice is not received, the Agreement automatically renews for a term equal to the original term, unless the Service Summary states otherwise.",
        },
        {
          n: "5.2",
          text: "If the Client ends the Agreement before the agreed term ends, 100 percent of the remaining Agency Retainer fees for the balance of the term become payable. Services end when the early termination takes effect.",
        },
        {
          n: "5.3",
          text: "If the Client requests a pause of fewer than ten days for website maintenance or another reason unrelated to PPC Guru's performance, monthly fees remain payable. A pause longer than forty-five consecutive days is treated as termination under section 5.2 unless both parties agree otherwise in writing.",
        },
      ],
    },
    {
      n: "6",
      title: "Campaign ownership and buyout",
      id: "campaign-ownership-and-buyout",
      clauses: [
        {
          n: "6.1",
          text: "Unless the Service Summary expressly states otherwise, advertising campaigns, structures, configurations, copy, strategy, and other campaign assets created or optimized by PPC Guru remain PPC Guru's intellectual property until an applicable buyout is paid in full.",
        },
        {
          n: "6.2",
          text: "Campaign buyout fees are: Level 1: $5,000 for monthly ad spend below $4,999; Level 2: $10,000 for monthly ad spend from $5,000 to $9,999; and Level 3: $20,000 for monthly ad spend of $10,000 or more.",
        },
        {
          n: "6.3",
          text: "A buyout transfers only the campaign ownership expressly identified in writing. It does not transfer PPC Guru's general methods, templates, reporting systems, software, or confidential know-how.",
        },
      ],
    },
    {
      n: "7",
      title: "Client cooperation",
      id: "client-cooperation",
      clauses: [
        {
          text: "The Client will provide accurate information, timely approvals, access, materials, budgets, and instructions reasonably required for the services. The Client remains responsible for its products, services, prices, claims, sales process, lead follow-up, legal compliance, and business decisions. Delays caused by missing Client input may change delivery dates.",
        },
      ],
    },
    {
      n: "8",
      title: "Third-party platforms and delays",
      id: "third-party-platforms-and-delays",
      clauses: [
        {
          n: "8.1",
          text: "The services may depend on Google, Meta, hosting providers, software vendors, payment processors, and other third parties. PPC Guru will use reasonable care in working with those providers but does not control their policies, reviews, outages, approvals, suspensions, rankings, or availability.",
        },
        {
          n: "8.2",
          text: "Neither party is responsible for delay or failure caused by circumstances beyond its reasonable control, including third-party outages, government action, internet failures, labour disruption, natural disaster, war, terrorism, or civil unrest.",
        },
      ],
    },
    {
      n: "9",
      title: "Advertising performance",
      id: "advertising-performance",
      clauses: [
        {
          text: "Advertising, SEO, and marketing results vary. PPC Guru does not guarantee a specific number of leads, calls, bookings, sales, revenue, profit, ranking, cost per result, or return on advertising spend unless a specific written guarantee appears in the Service Summary. Results may be affected by budget, market demand, competition, platform decisions, the Client's offer, pricing, response time, sales performance, and other factors outside PPC Guru's control.",
        },
      ],
    },
    {
      n: "10",
      title: "Client materials",
      id: "client-materials",
      clauses: [
        {
          text: "The Client confirms that it has the necessary rights and permissions for all text, images, trademarks, logos, data, and other materials it provides. The Client grants PPC Guru a non-exclusive, royalty-free licence to use and modify those materials only as reasonably required to perform the services during the Agreement. PPC Guru may decline material that reasonably appears unlawful, misleading, infringing, defamatory, obscene, or inconsistent with platform policy.",
        },
      ],
    },
    {
      n: "11",
      title: "Account access and reporting",
      id: "account-access-and-reporting",
      clauses: [
        {
          text: "Where campaigns are created or managed within PPC Guru's master-account infrastructure, those accounts and their access remain under PPC Guru's control unless the Service Summary states otherwise. PPC Guru will provide reasonable performance visibility through reports, summaries, dashboards, or meetings, as applicable to the service.",
        },
      ],
    },
    {
      n: "12",
      title: "Subcontractors",
      id: "subcontractors",
      clauses: [
        {
          text: "PPC Guru may use qualified employees and subcontractors to perform the services. PPC Guru remains responsible for the work it delegates and will require those persons to follow confidentiality and data-protection obligations appropriate to their role.",
        },
      ],
    },
    {
      n: "13",
      title: "Confidentiality and privacy",
      id: "confidentiality-and-privacy",
      clauses: [
        {
          n: "13.1",
          text: "Each party will protect the other party's non-public business, technical, commercial, and personal information and will use it only to perform or receive the services, exercise rights, meet legal obligations, or as otherwise agreed.",
        },
        {
          n: "13.2",
          text: "PPC Guru will handle personal information in accordance with its published Privacy Policy and applicable law. The Client will not provide sensitive personal information unless it is necessary, authorized, and transferred through an approved secure method.",
        },
      ],
    },
    {
      n: "14",
      title: "Liability",
      id: "liability",
      clauses: [
        {
          n: "14.1",
          text: "To the fullest extent permitted by law, PPC Guru is not liable for indirect, incidental, special, consequential, punitive, or exemplary damages, including lost profit, lost revenue, lost data, loss of use, business interruption, or lost savings.",
        },
        {
          n: "14.2",
          text: "PPC Guru's total aggregate liability for direct compensatory loss arising from the Agreement is limited to the fees actually paid by the Client to PPC Guru during the three months immediately before the event giving rise to the claim.",
        },
      ],
    },
    {
      n: "15",
      title: "Indemnity",
      id: "indemnity",
      clauses: [
        {
          text: "The Client will indemnify and hold PPC Guru harmless from third-party claims, losses, and reasonable legal costs arising from the Client's unlawful conduct, breach of the Agreement, infringement by Client-provided materials, or inaccurate or misleading Client claims, except to the extent caused by PPC Guru's own breach, negligence, or wilful misconduct.",
        },
      ],
    },
    {
      n: "16",
      title: "Termination by PPC Guru",
      id: "termination-by-ppc-guru",
      clauses: [
        {
          text: "PPC Guru may terminate or suspend the Agreement by written notice for material breach, non-payment, unlawful conduct, insolvency, business closure, or serious interference with the delivery of services. Where a breach can reasonably be cured, PPC Guru may provide a reasonable opportunity to cure before termination. Amounts already earned and outstanding remain payable.",
        },
      ],
    },
    {
      n: "17",
      title: "Notices",
      id: "notices",
      clauses: [
        {
          text: "Notices must be in writing and may be delivered personally, by prepaid registered mail, or by email. An email notice is received on confirmed transmission. Notices to PPC Guru must be sent to contact@ppcguru.ca. Notices to the Client will be sent to the contact information in the Service Summary.",
        },
      ],
    },
    {
      n: "18",
      title: "Dispute resolution and governing law",
      id: "dispute-resolution-and-governing-law",
      clauses: [
        {
          text: "The parties will first attempt to resolve a dispute through good-faith discussions. If it is not resolved within thirty days, the parties will attempt non-binding mediation before starting court proceedings, except where urgent injunctive relief is reasonably required. The Agreement is governed by Ontario law, and the parties submit to the exclusive jurisdiction of the courts of Ontario. Each party bears its own professional fees unless a court or binding decision orders otherwise; the prevailing party may seek reasonable costs where permitted.",
        },
      ],
    },
    {
      n: "19",
      title: "Non-solicitation",
      id: "non-solicitation",
      clauses: [
        {
          text: "During the Agreement and for twelve months after it ends, the Client will not knowingly solicit for employment or engagement a PPC Guru employee or contractor who materially worked on the Client's services. If this obligation is breached, PPC Guru may seek damages reflecting its actual loss and any other remedy available by law.",
        },
      ],
    },
    {
      n: "20",
      title: "General",
      id: "general",
      clauses: [
        {
          n: "20.1",
          text: "The parties are independent contractors. Nothing creates an employment, agency, partnership, joint venture, or fiduciary relationship.",
        },
        {
          n: "20.2",
          text: "If a provision is invalid or unenforceable, it will be severed or limited to the minimum extent necessary, and the rest of the Agreement remains effective.",
        },
        {
          n: "20.3",
          text: "Headings are for convenience only. A waiver is effective only in writing and only for the specific instance. Delay in exercising a right is not a waiver.",
        },
        {
          n: "20.4",
          text: "The Agreement benefits and binds the parties and their successors and permitted assigns. PPC Guru may assign the Agreement as part of a reorganization, sale, or transfer of its business or assets. The Client may not assign it without PPC Guru's written consent.",
        },
        {
          n: "20.5",
          text: "Sections concerning payment, ownership, confidentiality, liability, indemnity, dispute resolution, and any obligations intended by their nature to continue will survive expiry or termination.",
        },
        {
          n: "20.6",
          text: "The Service Summary, these Client Service Terms, and any written schedules or amendments form the entire agreement concerning the services and replace earlier discussions about the same subject.",
        },
      ],
    },
    {
      n: "21",
      title: "Electronic acceptance",
      id: "electronic-acceptance",
      clauses: [
        {
          text: "The parties consent to using electronic documents, signatures, communications, and payment processes. The Client may download or print these terms before signing. The electronic signature, required acknowledgement checkbox, associated audit trail, and completed signed document are intended to record the Client's acceptance of the Agreement.",
        },
      ],
    },
    {
      title: "Questions and accessible formats",
      id: "questions-and-accessible-formats",
      clauses: [
        {
          text: "Questions about these terms may be sent to contact@ppcguru.ca. PPC Guru will work with a person who requests these terms in an accessible format or with communication support.",
        },
      ],
    },
  ],
};

/** Every published version. Published versions are NEVER edited — add, don't change. */
export const CLIENT_TERMS_VERSIONS: Record<string, ClientTermsVersion> = {
  [V2026_09_15.id]: V2026_09_15,
};

export const CLIENT_TERMS_VERSION_IDS = Object.keys(CLIENT_TERMS_VERSIONS);

export function clientTermsPath(versionId: string) {
  return `${CLIENT_TERMS_BASE_PATH}/${versionId}`;
}

export function clientTermsUrl(versionId: string, origin: string = CLIENT_TERMS_ORIGIN) {
  return `${origin}${clientTermsPath(versionId)}`;
}

export function getClientTermsVersion(versionId: string): ClientTermsVersion | null {
  return CLIENT_TERMS_VERSIONS[versionId] ?? null;
}

/* ─────────────────────────────── rendering ─────────────────────────────── */

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Turn the contact address into a mailto link. The wording is untouched — only
 * the address becomes clickable, so "copied, searched, printed" still matches
 * the signed text exactly.
 */
function linkEmail(html: string, email: string) {
  return html.split(esc(email)).join(`<a href="mailto:${esc(email)}">${esc(email)}</a>`);
}

function clauseHtml(clause: TermsClause, email: string) {
  const body = linkEmail(esc(clause.text), email);
  return clause.n
    ? `<p class="clause"><span class="cn">${esc(clause.n)}</span><span>${body}</span></p>`
    : `<p class="clause"><span>${body}</span></p>`;
}

function sectionHtml(section: TermsSection, email: string) {
  const heading = section.n ? `<span class="sn">${esc(section.n)}</span>${esc(section.title)}` : esc(section.title);
  return [
    `<section class="sec" id="${esc(section.id)}" aria-labelledby="h-${esc(section.id)}">`,
    `<h2 id="h-${esc(section.id)}">${heading}</h2>`,
    section.clauses.map((c) => clauseHtml(c, email)).join("\n"),
    `</section>`,
  ].join("\n");
}

/**
 * The complete, standalone HTML document for one version.
 *
 * Deliberately carries NO analytics, advertising pixel, session-replay tool,
 * external font, or third-party request of any kind — a contract page has to be
 * readable, printable and archivable on its own terms.
 */
export function renderClientTermsDocument(version: ClientTermsVersion, origin: string = CLIENT_TERMS_ORIGIN): string {
  const url = clientTermsUrl(version.id, origin);
  const pageTitle = "PPC Guru Client Service Terms";
  const description = `${pageTitle}, version ${version.id}, effective ${version.effectiveDate}. The service terms that form part of every PPC Guru Inc. service summary.`;
  const email = version.contactEmail;

  const toc = version.sections
    .map(
      (s) =>
        `<li><a href="#${esc(s.id)}">${s.n ? `<span class="tn">${esc(s.n)}</span>` : ""}${esc(s.title)}</a></li>`
    )
    .join("\n");

  const body = version.sections.map((s) => sectionHtml(s, email)).join("\n\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="PPC Guru">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="/icon.png" type="image/png">
<style>
  :root {
    --ink: #14170e;
    --body: #24281c;
    --muted: #5c6151;
    --line: #dcdccb;
    --paper: #ffffff;
    --shell: #f4f2e6;
    --lime: #ceff3a;
    --accent: #4b5f10;
  }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    background: var(--shell);
    color: var(--body);
    font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, system-ui, -apple-system, sans-serif;
    font-size: 17px;
    line-height: 1.62;
  }
  .wrap { width: min(100% - 32px, 880px); margin-inline: auto; }
  a { color: var(--accent); text-underline-offset: 2px; }
  a:hover { color: var(--ink); }
  a:focus-visible, button:focus-visible {
    outline: 3px solid var(--ink);
    outline-offset: 2px;
    border-radius: 3px;
  }
  .skip {
    position: absolute; left: -9999px; top: 0;
    background: var(--ink); color: #fff; padding: 12px 18px; border-radius: 0 0 8px 0; z-index: 10;
  }
  .skip:focus { left: 0; }

  header.doc {
    background: var(--paper);
    border-bottom: 1px solid var(--line);
    padding: 26px 0 30px;
  }
  .brandline { display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
  .brandline img { height: 42px; width: auto; display: block; }
  .doctype {
    font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: var(--muted);
  }
  h1 {
    margin: 22px 0 0;
    font-size: clamp(28px, 4.6vw, 42px);
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--ink);
  }
  .owner { margin: 6px 0 0; font-size: 15px; color: var(--muted); }
  .stamp {
    margin: 20px 0 0; padding: 14px 16px;
    border: 1.5px solid var(--line); border-left: 5px solid var(--lime); border-radius: 10px;
    background: #fbfaf2;
    display: flex; flex-wrap: wrap; gap: 6px 26px;
    font-size: 15px;
  }
  .stamp b { color: var(--ink); }
  .actions { margin: 18px 0 0; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
  .btn {
    appearance: none; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    min-height: 46px; padding: 0 20px;
    border: 2px solid var(--ink); border-radius: 999px;
    background: var(--ink); color: #fff;
    font: inherit; font-size: 15px; font-weight: 700;
  }
  .btn:hover { background: #000; }
  .btn.secondary { background: var(--paper); color: var(--ink); }
  .btn.secondary:hover { background: var(--shell); }

  main { padding: 34px 0 10px; }
  .intro {
    background: var(--paper); border: 1px solid var(--line); border-radius: 14px;
    padding: 20px 22px; margin: 0 0 30px;
  }
  .intro p { margin: 0; }

  nav.toc {
    background: var(--paper); border: 1px solid var(--line); border-radius: 14px;
    padding: 20px 22px; margin: 0 0 32px;
  }
  nav.toc h2 { margin: 0 0 12px; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
  nav.toc ol { margin: 0; padding: 0; list-style: none; columns: 2; column-gap: 32px; }
  nav.toc li { break-inside: avoid; margin: 0 0 7px; font-size: 15px; }
  nav.toc a { text-decoration: none; }
  nav.toc a:hover { text-decoration: underline; }
  .tn { display: inline-block; min-width: 26px; color: var(--muted); font-variant-numeric: tabular-nums; }

  .sec { margin: 0 0 30px; scroll-margin-top: 16px; }
  .sec h2 {
    margin: 0 0 12px;
    font-size: clamp(19px, 2.4vw, 23px);
    line-height: 1.25;
    color: var(--ink);
    letter-spacing: -0.01em;
  }
  .sn { display: inline-block; min-width: 34px; color: var(--accent); font-variant-numeric: tabular-nums; }
  .clause { display: flex; gap: 10px; margin: 0 0 12px; break-inside: avoid; }
  .cn { flex: 0 0 auto; min-width: 38px; color: var(--muted); font-weight: 700; font-variant-numeric: tabular-nums; }

  footer.doc {
    margin-top: 26px;
    border-top: 1px solid var(--line);
    background: var(--paper);
    padding: 26px 0 40px;
    font-size: 14.5px;
    color: var(--muted);
  }
  footer.doc p { margin: 0 0 8px; }
  footer.doc .v { color: var(--ink); font-weight: 700; }
  .flinks { display: flex; flex-wrap: wrap; gap: 6px 20px; margin-top: 12px; }

  .print-only { display: none; }

  @media (max-width: 640px) {
    body { font-size: 16px; }
    nav.toc ol { columns: 1; }
    .clause { display: block; }
    .cn { display: inline; margin-right: 6px; }
  }

  @media print {
    :root { --shell: #fff; --paper: #fff; }
    body { background: #fff; color: #000; font-size: 11pt; line-height: 1.45; }
    .wrap { width: 100%; }
    .no-print { display: none !important; }
    .print-only { display: block; }
    header.doc, footer.doc, .intro, nav.toc { border: 0; padding-left: 0; padding-right: 0; }
    .intro, nav.toc { background: #fff; padding: 0; margin-bottom: 18px; }
    .stamp { border: 1px solid #000; border-left-width: 1px; background: #fff; }
    a { color: #000; text-decoration: underline; }
    .sec, .clause, h1, h2 { break-inside: avoid; }
    h2 { break-after: avoid; }
    @page { margin: 16mm 14mm; }
  }
</style>
</head>
<body>
<a class="skip" href="#main">Skip to the terms</a>

<header class="doc">
  <div class="wrap">
    <div class="brandline">
      <img src="/brand/ppc-guru-logo-720.png" alt="PPC Guru" width="720" height="251">
      <span class="doctype">Client agreement document</span>
    </div>
    <p class="doctype" style="margin:24px 0 0">${esc(version.owner)}</p>
    <h1>${esc(pageTitle)}</h1>
    <p class="owner">These terms form part of every PPC Guru service summary that refers to them.</p>
    <div class="stamp">
      <span>Version <b>${esc(version.id)}</b></span>
      <span>Effective <b><time datetime="${esc(version.effectiveDateIso)}">${esc(version.effectiveDate)}</time></b></span>
      <span class="print-only">${esc(url)}</span>
    </div>
    <div class="actions no-print">
      <button type="button" class="btn" onclick="window.print()">Print or save as PDF</button>
      <a class="btn secondary" href="mailto:${esc(email)}?subject=${encodeURIComponent(`Question about Client Service Terms ${version.id}`)}">Ask a question</a>
    </div>
  </div>
</header>

<main id="main">
  <div class="wrap">
    <div class="intro">
      <p>${linkEmail(esc(version.intro), email)}</p>
    </div>

    <nav class="toc no-print" aria-label="Contents">
      <h2>Contents</h2>
      <ol>
${toc}
      </ol>
    </nav>

${body}
  </div>
</main>

<footer class="doc">
  <div class="wrap">
    <p><span class="v">${esc(version.owner)} — ${esc(pageTitle)}</span></p>
    <p>Version <span class="v">${esc(version.id)}</span> · Effective <span class="v">${esc(version.effectiveDate)}</span> · <a href="${esc(url)}">${esc(url)}</a></p>
    <p>This version is permanent. If the terms change, a new version is published at its own address and this page keeps serving the words referenced by agreements already signed.</p>
    <div class="flinks">
      <a href="/privacy">Privacy Policy</a>
      <a href="mailto:${esc(email)}">${esc(email)}</a>
      <a href="/">ppcguru.ca</a>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

/** Convenience: render by version id. Returns null for an unpublished version. */
export function renderClientTerms(versionId: string, origin: string = CLIENT_TERMS_ORIGIN): string | null {
  const v = getClientTermsVersion(versionId);
  return v ? renderClientTermsDocument(v, origin) : null;
}
