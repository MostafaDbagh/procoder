import { unstable_cache } from "next/cache";
import type { APICourse } from "./api";
import { safeCoverImage } from "./mediaUrls";

/**
 * The API was unreachable or returned an error — the resource's existence is
 * unknown. Callers that render a single entity must let this propagate so the
 * route responds 5xx ("retry later") instead of calling notFound(), which tells
 * Google the page is permanently gone and de-indexes it. Fetch caching can reuse available data; dynamic routes must still handle
 * upstream failures rather than assuming a cached HTML page exists.
 */
export class ApiUnavailableError extends Error {
 constructor(resource: string, cause?: unknown) {
  super(`Upstream API unavailable while loading ${resource}`);
  this.name = "ApiUnavailableError";
  this.cause = cause;
 }
}

/** Server-side base for Express JSON API (not the browser origin). */
export function serverApiRoot(): string {
 const backend = process.env.BACKEND_URL?.replace(/\/$/, "");
 if (backend) {
 return backend.endsWith("/api") ? backend : `${backend}/api`;
 }
 return "http://127.0.0.1:5000/api";
}

/** API origin without trailing slash (for absolutizing `/uploads/...` paths). */
export function apiOriginFromServerApiRoot(): string {
 return serverApiRoot().replace(/\/api\/?$/, "");
}

export interface APITeamMember {
 _id: string;
 name: { en: string; ar: string };
 role: { en: string; ar: string };
 avatar: string;
 /** Absolute URL (set by getTeamPublicISR) or omitted when no photo. */
 photoUrl?: string;
 color: string;
 headerColor?: string;
 linkedin?: string;
 facebook?: string;
 instagram?: string;
 order?: number;
 rating?: number;
 reviews?: number;
 experienceYears?: number;
 skillsEn?: string[];
 skillsAr?: string[];
 locationEn?: string;
 locationAr?: string;
 flag?: string;
 bio?: { en?: string; ar?: string };
}

// Keep uploads on the public frontend origin; /uploads is proxied to the API.
function publicAssetPath(value: string | undefined | null): string | undefined {
 const raw = value?.trim();
 if (!raw) return undefined;
 if (/^https?:\/\//i.test(raw)) return raw;
 return `/${raw.replace(/^\/+/, "")}`;
}

function normalizeTeamMembersForPublic(members: APITeamMember[]): APITeamMember[] {
 return members.map((m) => {
  const clone = { ...m } as APITeamMember & { photoPublicId?: string };
  delete clone.photoPublicId;
  return { ...clone, photoUrl: publicAssetPath(clone.photoUrl) };
 });
}

function normalizeCourseImage(course: APICourse): APICourse {
 return { ...course, imageUrl: safeCoverImage(publicAssetPath(course.imageUrl)) };
}

export interface PublicMonthlyChallenge {
 _id: string;
 slug: string;
 monthKey: string;
 badgeEn: string;
 badgeAr: string;
 titleEn: string;
 titleAr: string;
 subtitleEn: string;
 subtitleAr: string;
 steps: {
 titleEn: string;
 titleAr: string;
 bodyEn: string;
 bodyAr: string;
 }[];
 hintBodyEn: string;
 hintBodyAr: string;
 formTitleEn?: string;
 formTitleAr?: string;
 formSubtitleEn?: string;
 formSubtitleAr?: string;
}

/**
 * Server-side fetch for courses with ISR caching.
 * Returns null if the API is unreachable (graceful fallback).
 */
/** Public category row from GET /api/categories (active only, sorted on BE). */
export interface APICategory {
 _id: string;
 slug: string;
 title: { en: string; ar: string };
 /** Shown on the homepage; optional for legacy rows (fallback to i18n). */
 description?: { en: string; ar: string };
 sortOrder: number;
 isActive: boolean;
}

/**
 * Server-side fetch for homepage category grid — ISR (same revalidate window as courses).
 * Returns null if the API is unreachable (caller may fall back to static labels).
 */
export async function getCategoriesPublicISR(): Promise<APICategory[] | null> {
 try {
 const res = await fetch(`${serverApiRoot()}/categories`, {
 next: { revalidate: 60 },
 signal: AbortSignal.timeout(8000),
 });
 if (!res.ok) return null;
 return (await res.json()) as APICategory[];
 } catch {
 return null;
 }
}

/**
 * SSR fetch — no caching. Every request hits the API for fresh data.
 * Use for pages where admin changes (price, active status) must reflect immediately.
 */
export async function getCoursesSSR(): Promise<APICourse[] | null> {
 try {
 const res = await fetch(`${serverApiRoot()}/courses`, {
 cache: "no-store",
 signal: AbortSignal.timeout(8000),
 });

 if (!res.ok) return null;
 const list = (await res.json()) as APICourse[];
 return list.map(normalizeCourseImage);
 } catch {
 return null;
 }
}

async function fetchCoursesSnapshot(): Promise<APICourse[] | null> {
 try {
 const res = await fetch(`${serverApiRoot()}/courses`, {
 cache: "no-store",
 signal: AbortSignal.timeout(8000),
 });

 if (!res.ok) return null;
 const list = (await res.json()) as APICourse[];
 return list.map(normalizeCourseImage);
 } catch {
 return null;
 }
}

export async function getCourseSlugsISR(): Promise<string[]> {
 const list = await getCoursesISR();
 if (list && list.length > 0) {
 return list.map((c) => c.slug);
 }
 return [];
}

/**
 * Returns null only when the course genuinely does not exist (upstream 404).
 * Throws {@link ApiUnavailableError} when the API is unreachable or errored, so
 * a sleeping backend can never be mistaken for a deleted course.
 */
async function fetchCourseSnapshot(slug: string): Promise<APICourse | null> {
 let res: Response;
 try {
 res = await fetch(`${serverApiRoot()}/courses/${encodeURIComponent(slug)}`, {
 cache: "no-store",
 signal: AbortSignal.timeout(8000),
 });
 } catch (e) {
 throw new ApiUnavailableError(`course "${slug}"`, e);
 }

 if (res.status === 404) return null;
 if (!res.ok) throw new ApiUnavailableError(`course "${slug}" (HTTP ${res.status})`);

 const c = (await res.json()) as APICourse;
 if (!c || typeof c.slug !== "string" || !c.title || !c.description) throw new ApiUnavailableError(`invalid course "${slug}"`);
 return normalizeCourseImage(c);
}

export async function getTeamPublicISR(): Promise<APITeamMember[] | null> {
 try {
 const res = await fetch(`${serverApiRoot()}/team`, {
 next: { revalidate: 60 },
 signal: AbortSignal.timeout(8000),
 });
 if (!res.ok) return null;
 const data = (await res.json()) as APITeamMember[];
 if (!Array.isArray(data)) return null;
 return normalizeTeamMembersForPublic(data);
 } catch {
 return null;
 }
}

// --- Blog ---

export interface APIBlogPost {
 _id: string;
 slug: string;
 title: { en: string; ar: string };
 excerpt: { en: string; ar: string };
 body: { en: string; ar: string };
 coverImage?: string;
 category: string;
 tags: string[];
 targetRegions: string[];
 metaTitle?: { en: string; ar: string };
 metaDescription?: { en: string; ar: string };
 author: { name: string; avatar?: string; role?: string };
 isPublished: boolean;
 publishedAt?: string;
 updatedAt?: string;
 viewCount: number;
 readTimeMinutes: number;
 relatedCourses: string[];
}

export interface BlogListResponse {
 items: APIBlogPost[];
 total: number;
 page: number;
 limit: number;
 totalPages: number;
}

export async function getBlogPostsSSR(params?: { category?: string; region?: string; page?: number; limit?: number }): Promise<BlogListResponse | null> {
 try {
 const query = new URLSearchParams();
 if (params?.category) query.set("category", params.category);
 if (params?.region) query.set("region", params.region);
 if (params?.page) query.set("page", String(params.page));
 query.set("limit", String(params?.limit ?? 50));
 const qs = query.toString();
 const res = await fetch(`${serverApiRoot()}/blog${qs ? `?${qs}` : ""}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
 if (!res.ok) return null;
 return await res.json();
 } catch {
 return null;
 }
}

export async function getBlogPostsISR(params?: { category?: string; region?: string; page?: number; limit?: number }): Promise<BlogListResponse | null> {
 try {
 const query = new URLSearchParams();
 if (params?.category) query.set("category", params.category);
 if (params?.region) query.set("region", params.region);
 if (params?.page) query.set("page", String(params.page));
 query.set("limit", String(params?.limit ?? 50));
 const qs = query.toString();
 const res = await fetch(`${serverApiRoot()}/blog${qs ? `?${qs}` : ""}`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
 if (!res.ok) return null;
 return await res.json();
 } catch {
 return null;
 }
}

/**
 * Returns null only when the post genuinely does not exist (upstream 404).
 * Throws {@link ApiUnavailableError} on transport/server failure — see the note
 * on {@link getCourseISR} for why this must not collapse into a 404.
 */
async function fetchBlogSnapshot(slug: string): Promise<APIBlogPost | null> {
 let res: Response;
 try {
 res = await fetch(`${serverApiRoot()}/blog/${encodeURIComponent(slug)}`, {
   cache: "no-store",
   signal: AbortSignal.timeout(8000),
 });
 } catch (e) {
 throw new ApiUnavailableError(`blog post "${slug}"`, e);
 }

 if (res.status === 404) return null;
 if (!res.ok) throw new ApiUnavailableError(`blog post "${slug}" (HTTP ${res.status})`);
 const post = (await res.json()) as APIBlogPost;
 if (!post || typeof post.slug !== "string" || !post.title || !post.body || !post.author) throw new ApiUnavailableError(`invalid blog post "${slug}"`);
 return post;
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export interface LocalizedStr { en: string; ar: string }

export interface APIPricingPlan {
  _id: string;
  key: string;
  name: LocalizedStr;
  priceDisplay: LocalizedStr;
  period: LocalizedStr;
  description: LocalizedStr;
  features: LocalizedStr[];
  highlighted: boolean;
  badge: LocalizedStr;
  ctaHref: string;
  ctaLabel: LocalizedStr;
  order: number;
}

export interface APIPricingDiscount {
  _id: string;
  key: string;
  title: LocalizedStr;
  value: LocalizedStr;
  description: LocalizedStr;
  iconColor: string;
  order: number;
}

export interface APIPricingFaq {
  _id: string;
  question: LocalizedStr;
  answer: LocalizedStr;
  order: number;
}

export interface APIPricingData {
  plans: APIPricingPlan[];
  discounts: APIPricingDiscount[];
  faqs: APIPricingFaq[];
}

export async function getPricingISR(): Promise<APIPricingData | null> {
  try {
    const res = await fetch(`${serverApiRoot()}/pricing`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getChallengePublicLatestISR(): Promise<PublicMonthlyChallenge | null> {
 try {
 const res = await fetch(`${serverApiRoot()}/challenges/public/latest`, {
 next: { revalidate: 60 },
 signal: AbortSignal.timeout(8000),
 });
 if (res.status === 404) return null;
 if (!res.ok) return null;
 return (await res.json()) as PublicMonthlyChallenge;
 } catch {
 return null;
 }
}

// Preserve successful public data during temporary upstream errors. Empty catalogs
// and explicit 404s are successful responses and replace withdrawn content normally.
const cachedCourses = unstable_cache(async () => {
 const courses = await fetchCoursesSnapshot();
 if (!courses) throw new ApiUnavailableError("course catalog");
 return courses;
}, ["public-courses-v1", serverApiRoot()], { revalidate: 60, tags: ["public-catalog"] });
const cachedCourse = unstable_cache(fetchCourseSnapshot, ["public-course-v1", serverApiRoot()], {
 revalidate: 60, tags: ["public-catalog"],
});
const cachedBlog = unstable_cache(fetchBlogSnapshot, ["public-blog-v1", serverApiRoot()], {
 revalidate: 300, tags: ["public-blog"],
});

export async function getCoursesISR(): Promise<APICourse[] | null> {
 try { return await cachedCourses(); }
 catch { return null; }
}
export async function getCourseISR(slug: string): Promise<APICourse | null> {
 return cachedCourse(slug);
}
export async function getBlogPostISR(slug: string): Promise<APIBlogPost | null> {
 return cachedBlog(slug);
}
