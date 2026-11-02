/**
 * Full URL for browser display: passes through http(s), prefixes API origin for `/uploads/...`.
 */
export function publicOrAbsoluteAssetUrl(url: string | undefined | null): string {
 const s = String(url || "").trim();
 if (!s) return "";
 if (s.startsWith("http://") || s.startsWith("https://")) return s;
 // Relative paths like /uploads/courses/... are proxied to the backend
 // via next.config.ts rewrites, so they work as-is in the browser.
 if (s.startsWith("/")) return s;
 return `/${s}`;
}

/** Remote image hosts configured in next.config.ts `images.remotePatterns`. */
const ALLOWED_IMAGE_HOSTS = new Set(["res.cloudinary.com", "images.unsplash.com"]);

/** Return only URLs supported by next/image's configured remote patterns. */
export function safeCoverImage(url: string | undefined | null): string | undefined {
 const s = String(url || "").trim();
 if (!s || s.includes("\\")) return undefined;
 if (s.startsWith("/") && !s.startsWith("//")) return s;
 try {
  const parsed = new URL(s);
  if (parsed.protocol !== "https:" || parsed.port || parsed.username || parsed.password) return undefined;
  return ALLOWED_IMAGE_HOSTS.has(parsed.hostname.toLowerCase()) ? s : undefined;
 } catch {
  return undefined;
 }
}
