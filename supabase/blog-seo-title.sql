-- ─────────────────────────────────────────────────────────────────────────────
-- Blog: dedicated SEO title
--
-- Splits the <title>/OG tag from the on-page H1 so a post can carry a long,
-- specific headline for readers AND a short (<60 char) title for search
-- results. Markdown posts get this from `seoTitle` in the frontmatter; this
-- column is the /admin CMS equivalent.
--
-- RUN THIS BEFORE DEPLOYING the matching code: the admin save path writes
-- `seo_title`, so a save against a table without the column fails outright.
--
-- Safe to re-run. Existing rows get NULL, which falls back to `title` —
-- no post changes appearance.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.posts
  add column if not exists seo_title text;
