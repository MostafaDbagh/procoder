import type { APICourse } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Server-side fetch for courses with ISR caching.
 * Returns null if the API is unreachable (graceful fallback).
 */
export async function getCoursesISR(): Promise<APICourse[] | null> {
  try {
    const res = await fetch(`${API_URL}/courses`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getCourseISR(slug: string): Promise<APICourse | null> {
  try {
    const res = await fetch(`${API_URL}/courses/${slug}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
