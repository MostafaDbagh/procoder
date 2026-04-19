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
