import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, PUBLIC_STATIC_PATHS } from "@/lib/seo";
import { getCoursesISR, serverApiRoot } from "@/lib/server-api";

export async function GET() {
  return NextResponse.json({ ok: true, info: "Use POST with x-cron-secret header to submit URLs." });
}

const SITE = (process.env.SITE_URL || "https://www.stemtechlab.com").replace(/\/$/, "");
const HOST = new URL(SITE).hostname;
// Generated in Bing Webmaster Tools — must match the key file hosted at /<KEY>.txt
const KEY = "86d963b1569d44d5bbd3e189c6fa2157";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

const STATIC_PATHS = PUBLIC_STATIC_PATHS.map((page) => page.path);

const MAX_URLS = 10_000;

async function liveBlogSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page += 1) {
    const res = await fetch(`${serverApiRoot()}/blog?limit=50&page=${page}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error("Blog catalog unavailable");
    const data = await res.json();
    if (!Array.isArray(data.items) || !Number.isInteger(data.totalPages) ||
        data.totalPages < 1 || data.totalPages > MAX_URLS / 50 ||
        (page > 1 && data.totalPages !== totalPages) ||
        (page < data.totalPages && data.items.length !== 50) ||
        data.items.length > 50 || (page > 1 && data.items.length === 0)) {
      throw new Error("Incomplete blog catalog");
    }
    totalPages = data.totalPages;
    for (const item of data.items) {
      if (typeof item?.slug !== "string" || !item.slug.trim()) {
        throw new Error("Invalid blog slug");
      }
      slugs.push(item.slug);
    }
  }
  return slugs;
}

function validatedUrls(values: unknown): string[] {
  if (!Array.isArray(values) || values.length === 0 || values.length > MAX_URLS) {
    throw new Error("Provide between 1 and 10000 URLs");
  }
  const origin = new URL(SITE).origin;
  return [...new Set(values.map((value: unknown) => {
    if (typeof value !== "string") throw new Error("Invalid URL");
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin ||
        url.username || url.password || url.hash) {
      throw new Error("URLs must belong to the configured site origin and have no credentials or fragments");
    }
    return url.href;
  }))];
}

/**
 * POST /api/indexnow
 * Submits all site URLs to IndexNow (Bing, Yandex, etc.)
 * Optionally accepts { urls: string[] } body to submit specific URLs only.
 * Protected by CRON_SECRET to prevent abuse.
 */
export async function POST(req: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: "IndexNow submission is not configured" }, { status: 503 });
  }
  const secret = req.headers.get("x-cron-secret") ?? req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    const text = await req.text();
    body = text.trim() ? JSON.parse(text) : {};
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  let urlList: string[];
  if ("urls" in (body as object)) {
    try {
      urlList = validatedUrls((body as { urls: unknown }).urls);
    } catch {
      return NextResponse.json({ error: "Provide 1–10000 valid URLs on the configured site origin, without credentials or fragments" }, { status: 400 });
    }
  } else {
    try {
      const [courses, blogSlugs] = await Promise.all([getCoursesISR(), liveBlogSlugs()]);
      if (!courses || courses.some((course) => typeof course.slug !== "string" || !course.slug.trim())) {
        throw new Error("Course catalog unavailable");
      }
      urlList = validatedUrls([
        ...LOCALES.flatMap((locale) => STATIC_PATHS.map((path) => `${SITE}/${locale}${path}`)),
        ...LOCALES.flatMap((locale) => courses.map(({ slug }) => `${SITE}/${locale}/courses/${encodeURIComponent(slug)}`)),
        ...LOCALES.flatMap((locale) => blogSlugs.map((slug) => `${SITE}/${locale}/blogs/${encodeURIComponent(slug)}`)),
      ]);
    } catch {
      return NextResponse.json({ error: "Unable to prepare a complete catalog submission within the 10000 URL limit" }, { status: 502 });
    }
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    return NextResponse.json(
      { submitted: urlList.length, indexnowStatus: res.status },
      { status: res.ok ? 200 : 502 }
    );
  } catch {
    return NextResponse.json({ error: "IndexNow unavailable" }, { status: 502 });
  }
}
