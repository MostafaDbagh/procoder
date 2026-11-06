import { serverApiRoot } from "./server-api";
import type { LlmsCourse } from "./llms-content";

/** Reject a malformed snapshot as a whole, rather than publishing partial facts. */
export function validLlmsCatalog(value: unknown): value is LlmsCourse[] {
 if (!Array.isArray(value) || !value.length) return false;
 const slugs = new Set<string>();
 return value.every((item) => {
  if (!item || typeof item !== "object" || typeof item.slug !== "string" || !/^[a-z0-9][a-z0-9-]*$/i.test(item.slug) || slugs.has(item.slug)) return false;
  slugs.add(item.slug);
  for (const key of ["category", "level"]) if (item[key] !== undefined && typeof item[key] !== "string") return false;
  for (const key of ["ageMin", "ageMax", "lessons", "durationWeeks"]) if (item[key] !== undefined && (typeof item[key] !== "number" || !Number.isFinite(item[key]) || item[key] < 0)) return false;
  for (const key of ["title", "description"]) if (item[key] !== undefined && (!item[key] || typeof item[key] !== "object" || (item[key].en !== undefined && typeof item[key].en !== "string"))) return false;
  if (item.skills !== undefined && (!item.skills || typeof item.skills !== "object" || (item.skills.en !== undefined && (!Array.isArray(item.skills.en) || !item.skills.en.every((s: unknown) => typeof s === "string"))))) return false;
  return true;
 });
}

/**
 * Live catalogue for the llms.txt family. Kept separate from the ISR helpers in
 * server-api.ts because these routes run on the edge and must never fail: if the
 * API is unreachable the formatters fall back to linking /courses rather than
 * printing a stale list, which is how llms.txt ended up naming eight deleted
 * courses and pointing AI assistants at 404s.
 */
export async function getCatalogForLlms(): Promise<LlmsCourse[] | null> {
 try {
  const res = await fetch(`${serverApiRoot()}/courses`, {
   next: { revalidate: 300 },
   signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) return null;
  const list: unknown = await res.json();
  return validLlmsCatalog(list) ? list : null;
 } catch {
  return null;
 }
}
