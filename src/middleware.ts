import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
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
