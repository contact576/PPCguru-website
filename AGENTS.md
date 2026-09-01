# AGENTS.md

Instructions for automated agents working in this repository. Humans should read
`CLAUDE.md` for the architecture; this file covers the rules that automation
keeps getting wrong.

## Blog automation

Scheduled agents write blog posts here. The pipeline is:

```
agent writes content/blog/<slug>.md
  → branch codex/schedule-<slug>-<YYYY-MM-DD>
  → draft PR for human review
  → merge to master
  → Hostinger auto-deploys
  → the post appears on its own at `publishAt`
```

A human writing in `/admin` takes the same route with the review step collapsed —
the editor commits the identical file straight to `master` (see "The `/admin`
blog editor writes to Git" below). Either way the artefact is one markdown file
and `publishAt` decides when it shows.

### The three rules that matter

**1. Branch from `origin/master`, and only ever from `origin/master`.**
Two scheduled PRs were cut from a months-old base and each re-implemented
`publishAt` and `seoTitle` from scratch, because from that base the features
looked missing. They were not — they were already on `master`, implemented
differently. Merging either PR would have reverted the newer implementation.

**2. A blog PR changes exactly one file: `content/blog/<slug>.md`.**
No `lib/`, no `app/`, no `components/`. If a post seems to need a code change,
say so in the PR description and leave the code alone — a human decides. A
content PR that touches code cannot be merged without a full review, which
defeats the point of scheduling it.

**3. Run `npm run blog:check` before opening the PR, and fix every error.**
It is fast and needs no environment variables or network access.

### Frontmatter

```yaml
---
title: "The on-page H1. Say the whole thing; it is not the <title> tag."
seoTitle: "The <title> tag — aim for 60 characters"   # optional, falls back to title
description: "Meta description, 50–160 characters."
date: "2026-08-28"                                     # sorts the blog listing
publishAt: "2026-08-28T09:00:00+05:30"                 # optional; when it goes live
category: "SEO"
author: "PPC Guru"
coverImage: "/blog/some-image.jpg"                     # optional, must exist in public/
draft: true                                            # optional; holds the post back on any date
---
```

`publishAt` is a real embargo, not a label. `lib/blog.ts` filters out any post
whose `publishAt` is in the future, and blog routes use `revalidate = 60` with
`dynamicParams = true`, so a post merged days early stays invisible — no 404,
not in the listing, not in the sitemap — and appears within a minute of its
timestamp with no second deploy. Merging ahead of the date is the intended flow.

Omit `publishAt` and the post is live the moment it is merged.

### Writing rules

- **No body H1.** The H1 is rendered from frontmatter `title`; a `#` heading in
  the body produces a second one.
- **Never address the reviewer in the body.** Notes like "owner approval is
  still required" or "included in the staging package" are written for a human
  reviewing the draft and read as nonsense to a visitor. Put them in the PR
  description. `blog:check` fails on the common phrasings.
- **Table-of-contents anchors must match rendered heading ids** (`rehype-slug`,
  GitHub rules). A ToC entry reading "SEO, AEO and GEO in plain English" over a
  heading of "SEO vs AEO vs GEO in plain English" is a dead link that no proof-
  read catches. `blog:check` verifies every anchor.
- **Internal links must resolve.** `blog:check` matches them against the App
  Router tree and against real files in `content/blog/`.
- **Do not invent evidence.** No fabricated statistics, client results, case
  studies or quotations. An illustrative example must say it is illustrative.
  This is a marketing site for a real agency; an invented client outcome is a
  liability, not a stylistic choice.
- Cite primary sources (platform documentation) rather than secondary blogs.

### The `/admin` blog editor writes to Git, not to a database

`/admin` is the blog queue: scheduled, drafts, live. Saving a post there does
not create a database row — it commits `content/blog/<slug>.md` to `master`
through the GitHub Contents API (`lib/blog-git.ts`, token in
`BLOG_GITHUB_TOKEN`), producing the same file a pull request would have added.
So both paths — a scheduled agent's PR and a human in `/admin` — write the same
artefact, and Git stays the single source of truth.

Rules that follow from that:

- **The editor refuses to commit a post with lint errors.** The rules live in
  `lib/blog-lint.ts`, shared by the editor and `npm run blog:check` so the two
  cannot drift. If you add a rule, add it there, not in the script.
- **Scheduling is a commit, not a deploy.** Setting `publishAt` in the future
  commits the post now and it appears on its own at that timestamp. `draft: true`
  holds a post back regardless of its dates.
- **A stale edit is refused, not merged.** The editor sends the blob sha it
  loaded; GitHub rejects a write against a superseded version.
- **The legacy Supabase CMS is at `/admin/legacy`, still read-only** (its
  create/update/delete routes return 409 — `lib/blog-source.ts`). A committed
  markdown file wins over the database row of the same slug, so an edit saved
  there would not change the published page; it would be shadowed by the file.
- **AI drafting exists** (`/api/admin/blog/generate`) and its system prompt is
  the writing rules below. Keep the two in step — a rule that lives only here is
  a rule the drafter will break.

## General repository rules

- `npm run build` is the validation gate — there is no test framework, and
  `npm run lint` is broken on Next 16. `npm run typecheck` is fast and useful.
- If a build fails on a generated `.next/dev/types/validator.ts` error, delete
  `.next` and rebuild. It rots after a `next dev` session.
- Never commit secrets. `.env.local` and `.env.hostinger.local` are real
  credentials and are git-ignored — keep it that way.
- Do not edit source files through PowerShell `Get-Content -Raw` →
  `Set-Content`: on Windows PowerShell 5.1 it re-encodes UTF-8 as ANSI and turns
  every em dash into mojibake.
- A push to GitHub is not a deploy of `ppcguru.ca` by itself; the live site is
  on Hostinger and picks up `master`. Vercel serves a separate, degraded copy.
