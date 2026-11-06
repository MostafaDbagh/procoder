import { formatLlmsFull, getSiteBase } from "@/lib/llms-content";
import { getCatalogForLlms } from "@/lib/llms-catalog";
import { llmsHeadResponse, llmsOptionsResponse } from "@/lib/llms-route";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function bodyBytesLength(text: string) {
 return new TextEncoder().encode(text).length;
}

export async function GET() {
 const base = getSiteBase();
 const catalog = await getCatalogForLlms();
 const body = formatLlmsFull(base, catalog);
 return new Response(body, {
 headers: {
 "Content-Type": "text/plain; charset=utf-8",
 "X-Catalog-State": catalog ? "populated" : "fallback",
 "X-Catalog-Count": String(catalog?.length ?? 0),
 "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=60",
 },
 });
}

export async function HEAD() {
 const base = getSiteBase();
 const catalog = await getCatalogForLlms();
 const body = formatLlmsFull(base, catalog);
 return llmsHeadResponse(bodyBytesLength(body));
}

export function OPTIONS() {
 return llmsOptionsResponse();
}
