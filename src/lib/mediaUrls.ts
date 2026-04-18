/**
 * Full URL for browser display: passes through http(s), prefixes API origin for `/uploads/...`.
 */
export function publicOrAbsoluteAssetUrl(url: string | undefined | null): string {
 const s = String(url || "").trim();
 if (!s) return "";
 if (s.startsWith("http://") || s.startsWith("https://")) return s;
 const base =
 (typeof process !== "undefined"
 ? process.env.NEXT_PUBLIC_API_ORIGIN?.replace(/\/$/, "")
 : "") || "";
 const origin = base || "http://127.0.0.1:5000";
 return `${origin.replace(/\/$/, "")}${s.startsWith("/") ? s : `/${s}`}`;
}
