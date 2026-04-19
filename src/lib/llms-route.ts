import { NextResponse } from "next/server";

/** Public, cacheable plain text — safe for any origin (LLM fetchers, assistants, crawlers). */
const BASE_HEADERS: Record<string, string> = {
 "Content-Type": "text/plain; charset=utf-8",
 "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
 "Access-Control-Allow-Origin": "*",
 "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
 "Access-Control-Allow-Headers": "Accept, Accept-Language, User-Agent, Cache-Control, Range",
 "Access-Control-Max-Age": "86400",
 "Cross-Origin-Resource-Policy": "cross-origin",
};

export function llmsPlainHeaders(extra?: Record<string, string>) {
 return { ...BASE_HEADERS, ...extra };
}

export function llmsTextResponse(body: string, status = 200) {
 return new NextResponse(body, {
 status,
 headers: llmsPlainHeaders(),
 });
}

export function llmsHeadResponse(byteLength: number) {
 return new NextResponse(null, {
 status: 200,
 headers: llmsPlainHeaders({ "Content-Length": String(byteLength) }),
 });
}

const OPTIONS_HEADERS: Record<string, string> = {
 "Access-Control-Allow-Origin": "*",
 "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
 "Access-Control-Allow-Headers": "Accept, Accept-Language, User-Agent, Cache-Control, Range",
 "Access-Control-Max-Age": "86400",
 "Cross-Origin-Resource-Policy": "cross-origin",
};

export function llmsOptionsResponse() {
 return new NextResponse(null, { status: 204, headers: OPTIONS_HEADERS });
}
