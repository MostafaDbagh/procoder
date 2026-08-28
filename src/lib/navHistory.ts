/**
 * Tracks whether this tab has an in-app page to go back to.
 *
 * `document.referrer` alone is not enough: App Router navigations are
 * client-side, so it keeps naming whatever loaded the tab (often a search
 * engine). Every LocalizedLink click drops this flag instead, so a back button
 * can tell "the user walked here from another page of ours" apart from "the
 * user landed straight on this URL".
 */
const KEY = "stl:in-app-nav";

export function markInAppNavigation(): void {
 try {
 sessionStorage.setItem(KEY, "1");
 } catch {
 /* private mode / storage disabled — fall back to the referrer check below */
 }
}

/** True when history.back() would land on a page of this site. */
export function canGoBackInApp(): boolean {
 if (typeof window === "undefined") return false;
 if (window.history.length <= 1) return false;
 try {
 if (sessionStorage.getItem(KEY) === "1") return true;
 } catch {
 /* ignore */
 }
 if (!document.referrer) return false;
 try {
 return new URL(document.referrer).origin === window.location.origin;
 } catch {
 return false;
 }
}
