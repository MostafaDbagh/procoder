import { serverApiRoot } from "./server-api";
import type { LlmsCourse } from "./llms-content";

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
  const list = (await res.json()) as LlmsCourse[];
  return Array.isArray(list) && list.length > 0 ? list : null;
 } catch {
  return null;
 }
}
