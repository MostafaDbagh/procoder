import { formatLlmsShort, getSiteBase } from "@/lib/llms-content";
import { llmsHeadResponse, llmsOptionsResponse, llmsTextResponse } from "@/lib/llms-route";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function bodyBytesLength(text: string) {
 return new TextEncoder().encode(text).length;
}

export function GET() {
 const base = getSiteBase();
 return llmsTextResponse(formatLlmsShort(base));
}

export function HEAD() {
 const base = getSiteBase();
 const body = formatLlmsShort(base);
 return llmsHeadResponse(bodyBytesLength(body));
}

export function OPTIONS() {
 return llmsOptionsResponse();
}
