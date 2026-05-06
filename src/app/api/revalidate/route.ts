import { NextResponse, type NextRequest } from "next/server";
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

    if (paths.length === 0) {
      // Default: revalidate all locale home pages + courses
      revalidatePath("/en");
      revalidatePath("/ar");
      revalidatePath("/en/courses");
      revalidatePath("/ar/courses");
    } else {
      for (const p of paths) {
        revalidatePath(p);
      }
    }

    // Notify IndexNow after revalidation — fire-and-forget
    const site = (process.env.SITE_URL || "https://www.stemtechlab.com").replace(/\/$/, "");
    const secret = process.env.CRON_SECRET;
    if (secret) {
      fetch(`${site}/api/indexnow`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-cron-secret": secret },
        body: JSON.stringify(
          paths.length > 0
            ? { urls: paths.map((p) => `${site}${p}`) }
            : {}
        ),
      }).catch(() => {});
    }

    return NextResponse.json({ revalidated: true, paths });
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
