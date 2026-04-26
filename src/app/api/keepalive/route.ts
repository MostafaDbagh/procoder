import { NextResponse } from "next/server";
import { serverApiRoot } from "@/lib/server-api";

// Called by an external cron (e.g. cron-job.org every 13 min) to keep Render backend warm.
export async function GET() {
  try {
    const res = await fetch(`${serverApiRoot()}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ ok: res.ok, backend: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
