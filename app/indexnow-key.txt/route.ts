import { indexNowKey } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves the IndexNow verification key at https://ppcguru.ca/indexnow-key.txt
 * (referenced as `keyLocation` in every ping). Returns 404 until `INDEXNOW_KEY`
 * is set, so nothing leaks before it's configured. The path contains a dot, so
 * proxy.ts skips it (its matcher excludes any path with an extension).
 */
export function GET() {
  const key = indexNowKey();
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
