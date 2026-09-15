/**
 * Archive every published Client Service Terms version.
 *
 *   npm run terms:archive
 *
 * Writes the EXACT HTML that /client-service-terms/<version> serves to
 * legal-archive/client-service-terms/<version>.html and records its SHA-256,
 * byte length and publication timestamp in manifest.json. That manifest is the
 * evidence trail: given a signed agreement citing a version, you can prove what
 * the page said when it was signed.
 *
 * Re-running is safe and idempotent: an unchanged version keeps its original
 * `publishedAt`. If a version's bytes CHANGE after publication the script fails
 * loudly — published terms are immutable, and a change means someone edited a
 * version instead of adding one.
 *
 * `--force` overwrites the recorded hash for a version deliberately being
 * corrected BEFORE anyone has signed against it.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CLIENT_TERMS_VERSIONS,
  clientTermsUrl,
  renderClientTermsDocument,
} from "../lib/legal/client-service-terms.ts";

type ManifestEntry = {
  version: string;
  url: string;
  effectiveDate: string;
  file: string;
  sha256: string;
  bytes: number;
  publishedAt: string;
  lastVerifiedAt: string;
};

const OUT_DIR = path.join(process.cwd(), "legal-archive", "client-service-terms");
const MANIFEST = path.join(OUT_DIR, "manifest.json");
const force = process.argv.includes("--force");

async function readManifest(): Promise<Record<string, ManifestEntry>> {
  try {
    return JSON.parse(await readFile(MANIFEST, "utf8")) as Record<string, ManifestEntry>;
  } catch {
    return {};
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = await readManifest();
  const now = new Date().toISOString();
  let changed = 0;
  let failed = false;

  for (const version of Object.values(CLIENT_TERMS_VERSIONS)) {
    const html = renderClientTermsDocument(version);
    const bytes = Buffer.byteLength(html, "utf8");
    const sha256 = createHash("sha256").update(html, "utf8").digest("hex");
    const file = `${version.id}.html`;
    const previous = manifest[version.id];

    if (previous && previous.sha256 !== sha256 && !force) {
      console.error(
        [
          `\n  ✖ ${version.id} CHANGED after publication.`,
          `    archived sha256: ${previous.sha256}`,
          `    current  sha256: ${sha256}`,
          `    Published terms are immutable — agreements already reference these words.`,
          `    Publish a NEW version id instead, or re-run with --force if nothing has been signed yet.\n`,
        ].join("\n")
      );
      failed = true;
      continue;
    }

    await writeFile(path.join(OUT_DIR, file), html, "utf8");
    const publishedAt = previous && previous.sha256 === sha256 ? previous.publishedAt : now;
    manifest[version.id] = {
      version: version.id,
      url: clientTermsUrl(version.id),
      effectiveDate: version.effectiveDateIso,
      file,
      sha256,
      bytes,
      publishedAt,
      lastVerifiedAt: now,
    };
    if (!previous || previous.sha256 !== sha256) changed += 1;
    else manifest[version.id].lastVerifiedAt = previous.lastVerifiedAt; // keep verify runs diff-free
    console.log(`  ${previous ? (previous.sha256 === sha256 ? "=" : "~") : "+"} ${version.id}  ${sha256}  ${bytes} bytes  published ${publishedAt}`);
  }

  // Only rewrite the manifest when something actually changed, so a pure
  // verification run leaves the working tree clean and can serve as a CI gate.
  if (changed > 0) await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\n  manifest: ${path.relative(process.cwd(), MANIFEST)} (${changed} new or updated)\n`);
  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
