import { NextResponse, type NextRequest } from "next/server";
import { courses as staticCourses } from "@/data/courses";
import { LOCALES, PUBLIC_STATIC_PATHS } from "@/lib/seo";

export async function GET() {
  return NextResponse.json({ ok: true, info: "Use POST with x-cron-secret header to submit URLs." });
}

const SITE = (process.env.SITE_URL || "https://www.stemtechlab.com").replace(/\/$/, "");
const HOST = new URL(SITE).hostname;
// Generated in Bing Webmaster Tools — must match the key file hosted at /<KEY>.txt
const KEY = "86d963b1569d44d5bbd3e189c6fa2157";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

const STATIC_PATHS = PUBLIC_STATIC_PATHS.map((page) => page.path);
const COURSE_SLUGS = staticCourses.map((course) => course.id);

/**
 * POST /api/indexnow
 * Submits all site URLs to IndexNow (Bing, Yandex, etc.)
 * Optionally accepts { urls: string[] } body to submit specific URLs only.
 * Protected by CRON_SECRET to prevent abuse.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let urlList: string[];

  try {
    const body = await req.json().catch(() => ({})) as { urls?: string[] };
    if (Array.isArray(body.urls) && body.urls.length > 0) {
      urlList = body.urls;
    } else {
      urlList = [
        ...LOCALES.flatMap((locale) =>
          STATIC_PATHS.map((path) => `${SITE}/${locale}${path}`)
        ),
        ...LOCALES.flatMap((locale) =>
          COURSE_SLUGS.map((slug) => `${SITE}/${locale}/courses/${slug}`)
        ),
      ];
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json(
    { submitted: urlList.length, indexnowStatus: res.status },
    { status: res.ok ? 200 : 502 }
  );
}
