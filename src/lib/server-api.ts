import type { APICourse } from "./api";

/** Server-side base for Express JSON API (not the browser origin). */
export function serverApiRoot(): string {
  const backend = process.env.BACKEND_URL?.replace(/\/$/, "");
  if (backend) {
    return backend.endsWith("/api") ? backend : `${backend}/api`;
  }
  return "http://127.0.0.1:5000/api";
}

export interface APITeamMember {
  _id: string;
  name: { en: string; ar: string };
  role: { en: string; ar: string };
  avatar: string;
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
export async function getCoursesISR(): Promise<APICourse[] | null> {
  try {
    const res = await fetch(`${serverApiRoot()}/courses`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    return res.json();
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
    return res.json();
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
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function getChallengePublicLatestISR(): Promise<PublicMonthlyChallenge | null> {
  try {
    const res = await fetch(`${serverApiRoot()}/challenges/public/latest`, {
      next: { revalidate: 120 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json() as Promise<PublicMonthlyChallenge>;
  } catch {
    return null;
  }
}
