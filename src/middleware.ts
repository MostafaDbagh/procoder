import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // See next-intl docs: match all page routes so unprefixed paths (e.g. /courses) get a locale redirect.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
