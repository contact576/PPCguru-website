import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { blogGitConfig, tokenFingerprint } from "@/lib/blog-git";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/blog/check — why isn't the blog editor connecting?
 *
 * "Bad credentials" from the write path says nothing about WHICH link is
 * broken, and the three candidates need three different fixes: a mangled token
 * value, a token that can't see the repo, and a token without write permission.
 * This walks them in order and stops at the first failure, so the answer is the
 * step that broke rather than a status code.
 *
 * It never returns the token — only its kind and length (see tokenFingerprint).
 */

type Step = { step: string; ok: boolean; detail: string };

async function gh(path: string, token: string) {
  return fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "ppcguru-blog-admin",
    },
    cache: "no-store",
  });
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { repo, branch, token } = blogGitConfig();
  const fp = tokenFingerprint();
  const steps: Step[] = [];
  const finish = (fix: string) => NextResponse.json({ repo, branch, token: fp, steps, fix });

  // 1 — is there a token, and does it even look like one?
  if (!fp.present) {
    steps.push({ step: "Token present", ok: false, detail: "BLOG_GITHUB_TOKEN is not set in this environment." });
    return finish("Set BLOG_GITHUB_TOKEN on the server (Hostinger env, not .env.local) and restart the app.");
  }
  steps.push({
    step: "Token present",
    ok: true,
    detail: `${fp.kind}, ${fp.length} characters.${fp.note ? ` Note: ${fp.note}.` : ""}`,
  });

  if (!fp.looksValid) {
    steps.push({ step: "Token shape", ok: false, detail: fp.note ?? "The value does not look like a GitHub token." });
    return finish("Re-copy the token from GitHub and paste it with no quotes, no spaces and no line break.");
  }
  steps.push({ step: "Token shape", ok: true, detail: "Looks like a well-formed GitHub token." });

  // 2 — does GitHub accept it at all?
  let who: Response;
  try {
    who = await gh("/user", token);
  } catch {
    steps.push({ step: "Reach GitHub", ok: false, detail: "Could not reach api.github.com from the server." });
    return finish("The server has no outbound HTTPS to api.github.com — check the host's egress/firewall.");
  }
  if (who.status === 401) {
    steps.push({ step: "GitHub accepts the token", ok: false, detail: "401 Bad credentials — GitHub does not recognise this token." });
    return finish(
      "The token value is wrong, not its permissions. Re-issue it on GitHub and paste the raw value (no quotes/whitespace); " +
        "if it was created a while ago, check it hasn't expired or been revoked.",
    );
  }
  if (!who.ok) {
    steps.push({ step: "GitHub accepts the token", ok: false, detail: `GitHub responded ${who.status}.` });
    return finish("Unexpected response from GitHub — see the status above.");
  }
  const user = (await who.json().catch(() => ({}))) as { login?: string };
  steps.push({ step: "GitHub accepts the token", ok: true, detail: `Authenticated as ${user.login ?? "an unknown account"}.` });

  // 3 — can it see this repo, and may it write to it?
  const repoRes = await gh(`/repos/${repo}`, token);
  if (repoRes.status === 404) {
    steps.push({ step: `Can see ${repo}`, ok: false, detail: "404 — the repository is invisible to this token." });
    return finish(
      `A fine-grained token only covers repositories owned by the account that created it AND selected under "Repository access". ` +
        `${repo} is owned by contact576, so either sign in as contact576 to create the token, or use a classic token with the \`repo\` scope from an account with push access.`,
    );
  }
  if (!repoRes.ok) {
    steps.push({ step: `Can see ${repo}`, ok: false, detail: `GitHub responded ${repoRes.status}.` });
    return finish("Unexpected response reading the repository — see the status above.");
  }
  const repoJson = (await repoRes.json().catch(() => ({}))) as { permissions?: { push?: boolean } };
  steps.push({ step: `Can see ${repo}`, ok: true, detail: "Repository is visible." });

  if (!repoJson.permissions?.push) {
    steps.push({ step: "Write permission", ok: false, detail: "The token can read the repo but not write to it." });
    return finish("Grant the token `Contents: Read and write` (fine-grained) or the `repo` scope (classic).");
  }
  steps.push({ step: "Write permission", ok: true, detail: "Contents: write is granted." });

  // 4 — does the branch the editor commits to exist?
  const branchRes = await gh(`/repos/${repo}/branches/${encodeURIComponent(branch)}`, token);
  if (!branchRes.ok) {
    steps.push({ step: `Branch ${branch}`, ok: false, detail: `Could not read branch ${branch} (${branchRes.status}).` });
    return finish(`The editor commits to \`${branch}\`. Set BLOG_BRANCH to a branch that exists, or create it.`);
  }
  steps.push({ step: `Branch ${branch}`, ok: true, detail: "Exists and is readable." });

  return finish("All checks passed — the blog editor should be able to read and commit posts.");
}
