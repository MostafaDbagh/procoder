import { formatLlmsFull, getSiteBase } from "@/lib/llms-content";
import { llmsHeadResponse, llmsOptionsResponse } from "@/lib/llms-route";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function bodyBytesLength(text: string) {
 return new TextEncoder().encode(text).length;
}

export function GET() {
 const base = getSiteBase();
 const body = formatLlmsFull(base);
 return new Response(body, {
 headers: {
 "Content-Type": "text/plain; charset=utf-8",
 "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
 },
 });
}

export function HEAD() {
 const base = getSiteBase();
 const body = formatLlmsFull(base);
 return llmsHeadResponse(bodyBytesLength(body));
}

export function OPTIONS() {
 return llmsOptionsResponse();
}
