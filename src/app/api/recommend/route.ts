import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;
const privateHeaders = { "Cache-Control": "no-store" };

function backendOrigin(): string | null {
 const fromEnv = process.env.BACKEND_URL?.trim().replace(/\/+$/, "").replace(/\/api$/, "");
 if (fromEnv) return fromEnv;
 if (process.env.VERCEL) return null;
 return "http://127.0.0.1:5000";
}

/** Same-origin proxy: bounded dependencies and no cached child profiles. */
export async function POST(req: NextRequest) {
 const origin = backendOrigin();
 if (!origin) return NextResponse.json({ error: "Recommendation service is temporarily unavailable" }, { status: 503, headers: privateHeaders });
 const body = await req.text();
 if (new TextEncoder().encode(body).length > 65536) {
  return NextResponse.json({ error: "Request is too large" }, { status: 413, headers: privateHeaders });
 }
 try {
  const res = await fetch(`${origin}/api/recommend`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body,
   cache: "no-store",
   signal: AbortSignal.any([req.signal, AbortSignal.timeout(20000)]),
  });
  if (!res.headers.get("content-type")?.includes("application/json")) {
   return NextResponse.json({ error: "Recommendation service is temporarily unavailable" }, { status: 502, headers: privateHeaders });
  }
  const text = await res.text();
  const headers: Record<string, string> = { ...privateHeaders, "Content-Type": "application/json" };
  const retryAfter = res.headers.get("retry-after");
  if (retryAfter) headers["Retry-After"] = retryAfter;
  return new NextResponse(text, { status: res.status, headers });
 } catch {
  return NextResponse.json({ error: "Recommendation service is temporarily unavailable. Please try again shortly." }, { status: 503, headers: privateHeaders });
 }
}
