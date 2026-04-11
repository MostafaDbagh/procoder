import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** stem-Be origin only: no /api path, no trailing slash (e.g. http://127.0.0.1:5000). */
export function backendOrigin(): string {
  const raw = (process.env.BACKEND_URL || "http://127.0.0.1:5000").trim();
  let s = raw.replace(/\/+$/, "");
  if (s.endsWith("/api")) {
    s = s.slice(0, -4).replace(/\/+$/, "");
  }
  return s;
}

/**
 * Forward to stem-Be: GET /api/foo/bar → `${origin}/api/foo/bar` + search.
 * @param pathSegments parts after `/api/` (e.g. ["categories", "admin", "list"])
 */
export async function forwardStemBeApi(
  req: NextRequest,
  pathSegments: string[]
): Promise<Response> {
  const path = pathSegments.filter(Boolean).join("/");
  if (!path) {
    return NextResponse.json(
      { message: "Missing API path after /api/" },
      { status: 400 }
    );
  }

  const BACKEND = backendOrigin();
  const url = `${BACKEND}/api/${path}${req.nextUrl.search}`;

  const headers = new Headers();
  const ct = req.headers.get("content-type");
  if (ct) headers.set("content-type", ct);
  const auth = req.headers.get("authorization");
  if (auth) headers.set("authorization", auth);

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    const body = await req.arrayBuffer();
    if (body.byteLength) init.body = body;
  }

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json(
      {
        message: `Cannot reach stem-Be at ${BACKEND} (${msg}). Start the API on port 5000 or fix BACKEND_URL in stem-Fe .env.local.`,
      },
      { status: 502 }
    );
  }

  const outHeaders = new Headers();
  const outCt = res.headers.get("content-type");
  if (outCt) outHeaders.set("content-type", outCt);

  return new NextResponse(await res.arrayBuffer(), {
    status: res.status,
    headers: outHeaders,
  });
}

/** When `params.path` is missing (some Next versions), derive segments from the URL. */
export function segmentsFromPathnameOrParams(
  req: NextRequest,
  paramsPath: string | string[] | undefined
): string[] {
  let segments: string[] = [];
  if (paramsPath != null) {
    segments = Array.isArray(paramsPath) ? paramsPath : [paramsPath];
  }
  if (segments.length > 0) return segments.filter(Boolean);

  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/api/")) {
    return pathname.slice("/api/".length).split("/").filter(Boolean);
  }
  return [];
}
