import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const next = createRequire(import.meta.url).resolve("next/dist/bin/next");

// Next reads its default worker count before it loads site configuration.
// CIRCLE_NODE_TOTAL is Next's CPU override; it reserves one CPU itself.
const env = {
  ...process.env,
  CIRCLE_NODE_TOTAL: "3",
  TURBO_TASKS_AVAILABLE_PARALLELISM: "2",
};

const build = spawnSync(process.execPath, [next, "build", "--webpack", ...process.argv.slice(2)], {
  env,
  stdio: "inherit",
});

if (build.error) throw build.error;
process.exitCode = build.status ?? 1;
