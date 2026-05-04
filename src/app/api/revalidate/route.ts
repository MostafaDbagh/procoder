import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * POST /api/revalidate
 * Body: { "paths": ["/en", "/ar", "/en/courses", ...] }
 *
 * Called by the admin dashboard after saving categories, courses, blog, etc.
 * Purges the Next.js ISR cache for the given paths so changes appear immediately.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { paths?: string[] };
    const paths = Array.isArray(body.paths) ? body.paths : [];

    if (paths.length === 0) {
      // Default: revalidate all locale home pages + courses
      revalidatePath("/en");
      revalidatePath("/ar");
      revalidatePath("/en/courses");
      revalidatePath("/ar/courses");
    } else {
      for (const p of paths.slice(0, 20)) {
        revalidatePath(String(p));
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
