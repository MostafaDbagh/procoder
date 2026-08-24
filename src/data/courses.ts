export type Category =
 | "programming"
 | "robotics"
 | "algorithms"
 | "web-development"
 | "artificial-intelligence"
 | "mobile-app-development";

export type Level = "beginner" | "intermediate" | "advanced";

export interface Course {
 id: string;
 category: Category;
 ageMin: number;
 ageMax: number;
 level: Level;
 lessons: number;
 durationWeeks: number;
 color: string;
 iconName: string;
 titleKey: string;
 descKey: string;
 skillKeys: string[];
 /** Set when listing from API (MongoDB catalog price). */
 price?: number;
 currency?: string;
 /** Set from API when a cover image was uploaded. */
 imageUrl?: string;
 /** Live social proof from API. */
 enrollmentCount?: number;
 /** ISO date string — next cohort start. */
 nextSessionDate?: string | null;
}

/**
 * Offline fallback catalogue — intentionally empty.
 *
 * This used to hold 12 hand-written courses, but only 2 of their slugs existed
 * in the live catalogue. The other 10 (scratch, gamedev, webdev, robot-*,
 * algo-competitive and 4 arabic-*) were being merged into generateStaticParams,
 * which published indexable pages for courses that cannot be bought — including
 * Arabic, a subject that has been discontinued. They also fed the course finder
 * and the navbar search, so parents were being recommended them.
 *
 * The live API is now the single source of catalogue truth. Backend outages are
 * handled by ApiUnavailableError (5xx + stale ISR), not by serving a phantom
 * catalogue. Callers already treat an empty list as "no fallback available".
 */
export const courses: Course[] = [];

export function getAgeGroup(
 ageMin: number,
 ageMax: number
): "6-9" | "10-13" | "14-18" {
 if (ageMax <= 9) return "6-9";
 if (ageMax <= 13) return "10-13";
 return "14-18";
}
