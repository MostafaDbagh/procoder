import type { APICourse } from "./api";

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

function absolutizeTeamPhotoUrl(
  photoUrl: string | undefined | null,
  apiOrigin: string
): string | undefined {
  const s = photoUrl?.trim();
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const base = apiOrigin.replace(/\/$/, "");
  return `${base}${s.startsWith("/") ? s : `/${s}`}`;
}

function normalizeTeamMembersForPublic(
  members: APITeamMember[],
  apiOrigin: string
): APITeamMember[] {
  return members.map((m) => {
    const clone = { ...m } as APITeamMember & { photoPublicId?: string };
    delete clone.photoPublicId;
    const raw = clone.photoUrl;
    const abs = absolutizeTeamPhotoUrl(raw, apiOrigin);
    return abs ? { ...clone, photoUrl: abs } : { ...clone };
  });
}

function absolutizeCourseImage(course: APICourse, apiOrigin: string): APICourse {
  const raw = course.imageUrl?.trim();
  if (!raw || raw.startsWith("http://") || raw.startsWith("https://")) {
    return course;
  }
  const base = apiOrigin.replace(/\/$/, "");
  return {
    ...course,
    imageUrl: `${base}${raw.startsWith("/") ? raw : `/${raw}`}`,
  };
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
      next: { revalidate: 300 },
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
    });

    if (!res.ok) return null;
    const list = (await res.json()) as APICourse[];
    const origin = apiOriginFromServerApiRoot();
    return list.map((c) => absolutizeCourseImage(c, origin));
  } catch {
    return null;
  }
}

export async function getCoursesISR(): Promise<APICourse[] | null> {
  try {
    const res = await fetch(`${serverApiRoot()}/courses`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const list = (await res.json()) as APICourse[];
    const origin = apiOriginFromServerApiRoot();
    return list.map((c) => absolutizeCourseImage(c, origin));
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

export async function getCourseISR(slug: string): Promise<APICourse | null> {
  try {
    const res = await fetch(`${serverApiRoot()}/courses/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const c = (await res.json()) as APICourse;
    return absolutizeCourseImage(c, apiOriginFromServerApiRoot());
  } catch {
    return null;
  }
}

export async function getTeamPublicISR(): Promise<APITeamMember[] | null> {
  try {
    const res = await fetch(`${serverApiRoot()}/team`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as APITeamMember[];
    if (!Array.isArray(data)) return null;
    return normalizeTeamMembersForPublic(data, apiOriginFromServerApiRoot());
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

export async function getBlogPostsSSR(params?: { category?: string; region?: string; page?: number }): Promise<BlogListResponse | null> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.region) query.set("region", params.region);
    if (params?.page) query.set("page", String(params.page));
    const qs = query.toString();
    const res = await fetch(`${serverApiRoot()}/blog${qs ? `?${qs}` : ""}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getBlogPostSSR(slug: string): Promise<APIBlogPost | null> {
  try {
    const res = await fetch(`${serverApiRoot()}/blog/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getChallengePublicLatestISR(): Promise<PublicMonthlyChallenge | null> {
  try {
    const res = await fetch(`${serverApiRoot()}/challenges/public/latest`, {
      next: { revalidate: 300 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json() as Promise<PublicMonthlyChallenge>;
  } catch {
    return null;
  }
}
