import { formatLlmsFull, getSiteBase } from "@/lib/llms-content";
import { getCatalogForLlms } from "@/lib/llms-catalog";
import { llmsHeadResponse, llmsOptionsResponse, llmsTextResponse } from "@/lib/llms-route";

// Mirror of /llms-full.txt at the .well-known path.
export const runtime = "edge";
export const dynamic = "force-dynamic";

function bodyBytesLength(text: string) {
 return new TextEncoder().encode(text).length;
}

export async function GET() {
 const base = getSiteBase();
 return llmsTextResponse(formatLlmsFull(base, await getCatalogForLlms()));
}

export async function HEAD() {
 const base = getSiteBase();
 const body = formatLlmsFull(base, await getCatalogForLlms());
 return llmsHeadResponse(bodyBytesLength(body));
}

export function OPTIONS() {
 return llmsOptionsResponse();
}
