import { clearAdminToken, getAdminToken } from "@/lib/admin-api";

/** 30 minutes — parent, instructor, and admin sessions */
export const SESSION_IDLE_MS = 30 * 60 * 1000;

const MEMBER_TOKEN_KEY = "token";

export function hasAnySession(): boolean {
 if (typeof window === "undefined") return false;
 return Boolean(localStorage.getItem(MEMBER_TOKEN_KEY) || getAdminToken());
}

export function clearAllSessionTokens(): void {
 if (typeof window === "undefined") return;
 localStorage.removeItem(MEMBER_TOKEN_KEY);
 clearAdminToken();
}

const IDLE_QS = "?idle=1";

/** Pure helper — used by tests and {@link redirectAfterIdleLogout}. */
export function getIdleLogoutHref(pathname: string): string {
 if (pathname.startsWith("/admin")) {
 return `/admin/login${IDLE_QS}`;
 }

 const localeMatch = pathname.match(/^\/(en|ar)(\/|$)/);
 const locale = localeMatch ? localeMatch[1] : "en";

 if (pathname.includes("/instructor")) {
 return `/${locale}/instructor/login${IDLE_QS}`;
 }

 return `/${locale}/parent/login${IDLE_QS}`;
}

/**
 * Send the user to the correct login screen after idle logout.
 */
export function redirectAfterIdleLogout(): void {
 if (typeof window === "undefined") return;
 window.location.assign(getIdleLogoutHref(window.location.pathname));
}
