import { NextResponse, type NextRequest } from "next/server";

const SITE = (process.env.SITE_URL || "https://www.stemtechlab.com").replace(/\/$/, "");
const HOST = new URL(SITE).hostname;
const KEY = "dccf1b07a60e4356883d6c6788540d35";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

const STATIC_PATHS = [
  "",
  "/courses",
  "/recommend",
  "/free-trial",
  "/parents",
  "/blogs",
  "/about",
  "/contact",
  "/faq",
  "/challenge",
  "/privacy",
  "/terms",
];

const COURSE_SLUGS = [
  "scratch",
  "python",
  "webdev",
  "gamedev",
  "robot-basics",
  "robot-advanced",
  "algo-intro",
  "algo-competitive",
  "arabic-reading",
  "arabic-grammar",
  "arabic-recitation",
  "arabic-memorization",
];

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
        ...["en", "ar"].flatMap((locale) =>
          STATIC_PATHS.map((path) => `${SITE}/${locale}${path}`)
        ),
        ...["en", "ar"].flatMap((locale) =>
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
