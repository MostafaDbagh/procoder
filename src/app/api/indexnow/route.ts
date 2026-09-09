import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, PUBLIC_STATIC_PATHS } from "@/lib/seo";
import { getCourseSlugsISR, serverApiRoot } from "@/lib/server-api";

export async function GET() {
  return NextResponse.json({ ok: true, info: "Use POST with x-cron-secret header to submit URLs." });
}

const SITE = (process.env.SITE_URL || "https://www.stemtechlab.com").replace(/\/$/, "");
const HOST = new URL(SITE).hostname;
// Generated in Bing Webmaster Tools — must match the key file hosted at /<KEY>.txt
const KEY = "86d963b1569d44d5bbd3e189c6fa2157";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

const STATIC_PATHS = PUBLIC_STATIC_PATHS.map((page) => page.path);

/**
 * Course and blog URLs come from the live catalogue. They used to come from the
 * static fallback in @/data/courses, which was emptied on 2026-08-24 — since
 * then every "submit all URLs" run silently pinged only the static pages, so no
 * course or article was ever announced to Bing/Yandex.
 */
async function liveBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${serverApiRoot()}/blog?limit=500`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: { slug: string }[] };
    return (data.items ?? []).map((p) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}

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
      const [courseSlugs, blogSlugs] = await Promise.all([
        getCourseSlugsISR(),
        liveBlogSlugs(),
      ]);
      urlList = [
        ...LOCALES.flatMap((locale) =>
          STATIC_PATHS.map((path) => `${SITE}/${locale}${path}`)
        ),
        ...LOCALES.flatMap((locale) =>
          courseSlugs.map((slug) => `${SITE}/${locale}/courses/${slug}`)
        ),
        ...LOCALES.flatMap((locale) =>
          blogSlugs.map((slug) => `${SITE}/${locale}/blogs/${slug}`)
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
