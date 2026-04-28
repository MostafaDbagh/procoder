import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";
import { resolveArabicSlug, isArabicSlug } from "./lib/arabicSlugs";

const intlMiddleware = createMiddleware(routing);

// Match /en/courses/<slug> or /ar/courses/<slug>
const ARABIC_COURSE_RE = /^\/(en|ar)\/courses\/([^/?#]+)/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect Arabic course slugs (e.g. /ar/courses/بايثون → /ar/courses/python)
  // before next-intl processes the request, so Google receives a proper 308.
  const m = pathname.match(ARABIC_COURSE_RE);
  if (m) {
    const rawSlug = decodeURIComponent(m[2]);
    if (isArabicSlug(rawSlug)) {
      const englishSlug = resolveArabicSlug(rawSlug);
      const localePart = m[1]; // "en" or "ar"
      const target = new URL(`/${localePart}/courses/${englishSlug}`, request.url);
      return NextResponse.redirect(target, { status: 308 });
    }
  }

  const response = await intlMiddleware(request);

  // Keep next-intl's 307 redirects as-is (temporary) so browsers don't
  // permanently cache locale redirects. Permanent caching breaks locale switching
  // when routing config changes.

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|admin|og|.*\\..*).*)"],
};
