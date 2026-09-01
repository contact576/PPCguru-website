import { NextResponse } from "next/server";
import matter from "gray-matter";
import { isAuthed } from "@/lib/admin-auth";
import { completeLong, hasAnthropicKey, MODELS } from "@/lib/ai/anthropic";
import { listRemoteSlugs } from "@/lib/blog-git";
import { services } from "@/lib/data/services";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// A full article takes longer than the platform's default function budget.
export const maxDuration = 300;

/**
 * POST /api/admin/blog/generate — a topic in, a full draft out.
 *
 * The draft is never committed here. It is returned to the editor, where a
 * human reads it, fixes it and decides when it publishes — the same gate a
 * scheduled-agent pull request goes through, minus the pull request.
 *
 * The system prompt is the writing half of AGENTS.md. Keep the two in step: a
 * rule that lives only in AGENTS.md is a rule this drafter will break, and the
 * lint gate will then reject its output at commit time.
 */

const SYSTEM = `You write long-form articles for the PPC Guru blog. PPC Guru is a real, AI-first Google and Meta Partner performance-marketing agency serving the Greater Toronto Area, Canada and the USA. You are writing for owners and marketing leads at local service businesses, not for other marketers.

Return ONE markdown file and nothing else — no preamble, no explanation, no code fence around the whole file. It must start with YAML frontmatter:

---
title: "The on-page H1. Say the whole thing; it is not the <title> tag."
seoTitle: "The <title> tag — 60 characters or fewer"
description: "Meta description, between 50 and 160 characters."
category: "One of: SEO, Google Ads, Meta Ads, Local SEO, AI Search, Marketing, CRO"
---

Then the body.

HARD RULES — output that breaks any of these is rejected by an automated gate:
- NO H1 anywhere in the body. The H1 is rendered from the frontmatter title. Start at "##".
- NEVER address a reviewer, an editor or the approval process. No TODO, TBD, FIXME, "[insert ...]", "placeholder", "XX%", "pending sign-off", "owner approval required", "staging package", "lorem ipsum", or any sentence about this article's own publication.
- DO NOT INVENT EVIDENCE. No fabricated statistics, client results, case studies, revenue figures, percentages or quotations. If a number would strengthen a point and you do not have a real, citable source for it, either cite the primary source by name (platform documentation — Google Ads Help, Meta Business Help, Google Search Central) or write the point without a number. An illustrative example must say in the sentence that it is illustrative. This is a marketing site for a real agency: an invented client outcome is a legal liability, not a stylistic choice.
- If you include a table of contents, every anchor must exactly match a heading in the body, slugified GitHub-style (lowercase, spaces to hyphens, punctuation dropped). "SEO vs AEO" becomes "#seo-vs-aeo". Get this exactly right or omit the table of contents.
- Internal links: ONLY the paths given in the prompt. Never guess a URL. External links must be to primary sources (official platform documentation), never to competitor blogs or content farms.

STYLE:
- Answer-first. Open with 2–4 sentences that answer the title's question outright, before any context.
- Concrete and specific. Prefer a worked example, a checklist, a decision rule or a comparison table over adjectives.
- Plain sentences. No "in today's fast-paced digital landscape", no "unlock", "leverage", "supercharge", "game-changer", "delve", "elevate". Do not open a paragraph with "Moreover" or "Furthermore".
- Canadian spelling and Canadian context (GTA cities, CAD, Canadian platform availability).
- Use "##" and "###" headings that read as real questions or real steps, short paragraphs, and markdown tables where a comparison is genuinely two-dimensional.
- Close with a short, honest call to action pointing at the free website audit — no pressure copy, no invented scarcity.`;

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasAnthropicKey()) {
    return NextResponse.json({ error: "No ANTHROPIC_API_KEY configured — AI drafting is off." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const topic = String(body.topic ?? "").trim();
  if (!topic) return NextResponse.json({ error: "Give the draft a topic." }, { status: 400 });

  const keyword = String(body.keyword ?? "").trim();
  const notes = String(body.notes ?? "").trim();
  const words = Math.min(Math.max(Number(body.words) || 1400, 600), 3000);

  // Real link targets, so the draft's internal links survive the lint gate.
  const slugs = await listRemoteSlugs().catch(() => new Set<string>());
  const relatedPosts = [...slugs].slice(0, 40).map((s) => `/blog/${s}`);
  const servicePaths = services.map((service) => `/services/${service.slug}`);

  const user = [
    `Topic: ${topic}`,
    keyword && `Primary keyword to rank for: ${keyword}`,
    notes && `Additional direction from the editor:\n${notes}`,
    `Target length: about ${words} words.`,
    "",
    "Internal links you may use (these are the ONLY internal paths that exist — use 2 to 5 of them, chosen for genuine relevance, and never link to a path not on this list):",
    ["/contact", "/free-audit", "/pricing", "/results", "/about", "/blog", "/tools", "/benchmarks", "/glossary", "/compare", ...servicePaths].join("\n"),
    "",
    "Existing blog posts you may link to as related reading:",
    relatedPosts.join("\n") || "(none yet)",
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await completeLong({ model: MODELS.writer, system: SYSTEM, user, maxTokens: 32000 });
  if (!raw) return NextResponse.json({ error: "The model did not return a draft. Try again." }, { status: 502 });

  // The model occasionally wraps the whole file in a fence despite being told
  // not to; unwrapping is cheaper than a retry.
  const cleaned = raw.replace(/^```(?:markdown|md)?\s*\n/, "").replace(/\n```\s*$/, "");
  const { data, content } = matter(cleaned);

  const title = typeof data.title === "string" ? data.title : topic;
  return NextResponse.json({
    draft: {
      title,
      seoTitle: typeof data.seoTitle === "string" ? data.seoTitle : "",
      description: typeof data.description === "string" ? data.description : "",
      category: typeof data.category === "string" ? data.category : "Marketing",
      slug: slugify(title),
      content: content.trim(),
    },
  });
}
