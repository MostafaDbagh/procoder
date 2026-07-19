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
const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i;

/**
 * Returns a cover-image URL only if it is actually renderable — a same-origin
 * `/uploads/...` path, an allow-listed remote host (so next/image won't 400), or
 * a URL that clearly points at an image file. Anything else (e.g. a pasted
 * `share.google/...` share link) returns undefined so callers can fall back
 * instead of shipping a broken image and a bad og:image.
 */
export function safeCoverImage(url: string | undefined | null): string | undefined {
 const s = String(url || "").trim();
 if (!s) return undefined;
 if (s.startsWith("/")) return s; // same-origin (/uploads/... is proxied)
 if (!/^https?:\/\//i.test(s)) return undefined;
 try {
 const host = new URL(s).hostname.toLowerCase();
 if (ALLOWED_IMAGE_HOSTS.has(host)) return s;
 if (IMAGE_EXT_RE.test(s)) return s;
 return undefined;
 } catch {
 return undefined;
 }
}
