/**
 * Whether `images.remotePatterns` (next.config.ts) can serve this source.
 *
 * next/image THROWS on a remote host it hasn't been configured for, which would
 * take the whole page down — so anything unrecognised has to fall back to a
 * plain <img>. Blog covers come from two places: local /images paths written by
 * the Git editor, and Supabase storage URLs left by the legacy CMS. Keep this
 * in step with `images.remotePatterns` whenever a new host appears.
 */
export function canOptimizeImage(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const { protocol, hostname, pathname } = new URL(src);
    return (
      protocol === "https:" &&
      hostname.endsWith(".supabase.co") &&
      pathname.startsWith("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
