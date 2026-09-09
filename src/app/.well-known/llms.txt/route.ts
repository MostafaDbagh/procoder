import { formatLlmsShort, getSiteBase } from "@/lib/llms-content";
import { getCatalogForLlms } from "@/lib/llms-catalog";
import { llmsHeadResponse, llmsOptionsResponse, llmsTextResponse } from "@/lib/llms-route";

// Mirror of /llms.txt at the .well-known path so LLM crawlers that probe either
// location get identical content and a 200 instead of a 404.
export const runtime = "edge";
export const dynamic = "force-dynamic";

function bodyBytesLength(text: string) {
 return new TextEncoder().encode(text).length;
}

export async function GET() {
 const base = getSiteBase();
 return llmsTextResponse(formatLlmsShort(base, await getCatalogForLlms()));
}

export async function HEAD() {
 const base = getSiteBase();
 const body = formatLlmsShort(base, await getCatalogForLlms());
 return llmsHeadResponse(bodyBytesLength(body));
}

export function OPTIONS() {
 return llmsOptionsResponse();
}
