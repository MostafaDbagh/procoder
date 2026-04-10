import type { APICourse } from "./api";
import type { Category, Course, Level } from "@/data/courses";

/** Map API courses to the shape CourseCard + filters expect (admin-controlled catalog). */
export function apiCoursesToCatalog(
  list: APICourse[],
  locale: string
): (Course & { _title?: string; _desc?: string })[] {
  return list.map((c) => ({
    id: c.slug,
    category: c.category as Category,
    ageMin: c.ageMin,
    ageMax: c.ageMax,
    level: c.level as Level,
    lessons: c.lessons,
    durationWeeks: c.durationWeeks,
    color: c.color,
    iconName: c.iconName,
    titleKey: "",
    descKey: "",
    skillKeys: [],
    _title: locale === "ar" ? c.title.ar : c.title.en,
    _desc: locale === "ar" ? c.description.ar : c.description.en,
  }));
}
