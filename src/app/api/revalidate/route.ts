import { after, NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { backendOrigin } from "@/lib/api-proxy";

type AuthUserResponse = {
 role?: unknown;
};

async function isAuthorizedRevalidationRequest(req: NextRequest) {
 const cronSecret = process.env.CRON_SECRET;
 const suppliedSecret =
 req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret");
 if (cronSecret && suppliedSecret === cronSecret) {
 return true;
 }

 const authorization = req.headers.get("authorization");
 if (!authorization) {
 return false;
 }

 try {
 const res = await fetch(`${backendOrigin()}/api/auth/me`, {
 method: "GET",
 headers: { authorization },
 cache: "no-store",
 });
 if (!res.ok) return false;
 const user = (await res.json()) as AuthUserResponse;
 return user.role === "admin";
 } catch {
 return false;
 }
}

function normalizeRevalidationPaths(paths: unknown): string[] {
 if (!Array.isArray(paths)) return [];
 return paths
 .map((p) => String(p).trim())
 .filter((p) => /^\/(?!\/)/.test(p) && !p.includes("\\"))
 .slice(0, 20);
}

/**
 * POST /api/revalidate
 * Body: { "paths": ["/en", "/ar", "/en/courses", ...] }
 *
 * Called by the admin dashboard after saving categories, courses, blog, etc.
 * Purges the Next.js ISR cache for the given paths so changes appear immediately.
 */
export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorizedRevalidationRequest(req))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { paths?: string[] };
    const paths = normalizeRevalidationPaths(body.paths);

    // CMS records appear across listings, detail pages, navigation, and guides.
    // Invalidating the locale layout covers old slugs as well as renamed records.
    revalidatePath("/[locale]", "layout");
    for (const p of paths) revalidatePath(p);
    for (const p of ["/sitemap.xml", "/llms.txt", "/llms-full.txt"]) revalidatePath(p);

    // Keep notification work alive after the response on supported Next hosts.
    const site = (process.env.SITE_URL || "https://www.stemtechlab.com").replace(/\/$/, "");
    const secret = process.env.CRON_SECRET;
    if (secret) {
      after(async () => {
        try {
          const response = await fetch(`${site}/api/indexnow`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-cron-secret": secret },
            body: JSON.stringify(paths.length > 0 ? { urls: paths.map(p => `${site}${p}`) } : {}),
            signal: AbortSignal.timeout(10000),
          });
          if (!response.ok) console.error("IndexNow notification failed", response.status);
        } catch { console.error("IndexNow notification unavailable"); }
      });
    }

    return NextResponse.json({ revalidated: true, paths });
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
