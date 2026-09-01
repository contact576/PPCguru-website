import fs from "node:fs";
import path from "node:path";

/**
 * The two lint checks that need a filesystem: does this internal link match an
 * App Router route, and does this asset exist in public/.
 *
 * `npm run blog:check` always has both directories. A deployed server may have
 * neither — a standalone build ships compiled routes, not the `app/` tree. So
 * these are returned as optional callbacks: present, they are enforced; absent,
 * lintPost skips those two rules rather than reporting links that are fine.
 */

const APP_DIR = path.join(process.cwd(), "app");
const PUBLIC_DIR = path.join(process.cwd(), "public");

let cachedRoutes: string[][] | null = null;

function routePatterns(): string[][] {
  if (cachedRoutes) return cachedRoutes;
  const out: string[][] = [];
  const walk = (dir: string, segments: string[]) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      const next = name.startsWith("(") || name.startsWith("_") ? segments : [...segments, name];
      const child = path.join(dir, name);
      if (fs.existsSync(path.join(child, "page.tsx")) || fs.existsSync(path.join(child, "page.ts"))) out.push(next);
      walk(child, next);
    }
  };
  walk(APP_DIR, []);
  cachedRoutes = out;
  return out;
}

export function fsLintCheckers() {
  const hasApp = fs.existsSync(APP_DIR);
  const hasPublic = fs.existsSync(PUBLIC_DIR);
  return {
    routeExists: hasApp
      ? (segments: string[]) =>
          routePatterns().some(
            (route) =>
              route.length === segments.length &&
              route.every((part, i) => part.startsWith("[") || part === segments[i]),
          )
      : undefined,
    publicFileExists: hasPublic ? (pathname: string) => fs.existsSync(path.join(PUBLIC_DIR, pathname)) : undefined,
  };
}
