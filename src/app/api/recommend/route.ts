import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function backendOrigin(): string | null {
 const fromEnv = process.env.BACKEND_URL?.trim().replace(/\/$/, "");
 if (fromEnv) return fromEnv;
 if (process.env.VERCEL) return null;
 return "http://127.0.0.1:5000";
}

/**
 * Proxies POST /api/recommend → stem-Express so the browser always talks to same-origin /api.
 * Rewrites alone are flaky in some Next 16 / Turbopack setups (404 HTML).
 */
export async function POST(req: NextRequest) {
 const origin = backendOrigin();
 if (!origin) {
 return NextResponse.json(
 {
 error: "BACKEND_URL is not set",
 hint: "On Vercel, set BACKEND_URL to your stem-Be API origin (e.g. https://api.example.com).",
 },
 { status: 503 }
 );
 }

 const body = await req.text();
 const url = `${origin}/api/recommend`;

 let res: Response;
 try {
 res = await fetch(url, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body,
 cache: "no-store",
 });
 } catch {
 return NextResponse.json(
 {
 error: "Backend unreachable",
 hint: "Start stem-Be (npm run dev) on port 5000, or set BACKEND_URL to your API.",
 },
 { status: 502 }
 );
 }

 const text = await res.text();
 const ct = res.headers.get("content-type") || "application/json";
 return new NextResponse(text, {
 status: res.status,
 headers: { "Content-Type": ct },
 });
}
