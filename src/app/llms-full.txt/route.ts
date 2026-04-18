import { NextResponse } from "next/server";
import { formatLlmsFull, getSiteBase } from "@/lib/llms-content";

export const dynamic = "force-dynamic";

export function GET() {
 const base = getSiteBase();
 const body = formatLlmsFull(base);
 return new NextResponse(body, {
 status: 200,
 headers: {
 "Content-Type": "text/plain; charset=utf-8",
 "Cache-Control": "public, max-age=3600, s-maxage=86400",
 },
 });
}
