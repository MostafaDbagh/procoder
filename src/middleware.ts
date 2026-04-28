import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";
import { resolveArabicSlug, isArabicSlug } from "./lib/arabicSlugs";

const intlMiddleware = createMiddleware(routing);

// Match /courses/<slug> or /ar/courses/<slug>
const ARABIC_COURSE_RE = /^(\/ar)?\/courses\/([^/?#]+)/;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect Arabic course slugs (e.g. /ar/courses/بايثون → /ar/courses/python)
  // before next-intl processes the request, so Google receives a proper 308.
  const m = pathname.match(ARABIC_COURSE_RE);
  if (m) {
    const rawSlug = decodeURIComponent(m[2]);
    if (isArabicSlug(rawSlug)) {
      const englishSlug = resolveArabicSlug(rawSlug);
      const localePart = m[1] ?? "";
      const target = new URL(`${localePart}/courses/${englishSlug}`, request.url);
      return NextResponse.redirect(target, { status: 308 });
    }
  }

  const response = await intlMiddleware(request);

  // next-intl emits 307 (temporary) for locale redirects.
  // Upgrade to 308 (permanent) so Google consolidates non-locale URLs
  // (e.g. /about → /en/about) and stops treating them as separate pages.
  if (response?.status === 307) {
    const location = response.headers.get("location");
    if (location) {
      return NextResponse.redirect(location, { status: 308 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|admin|og|.*\\..*).*)"],
};
