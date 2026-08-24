"use client";

import { useLocale, useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import type { APICourse } from "@/lib/api";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

/**
 * Compact course card used on a learning-path level page. Deliberately lighter
 * than the catalogue card: at this point the parent is choosing a stage, not
 * comparing prices, so it leads with what the course develops.
 */
export function LevelCourseCard({ course }: { course: APICourse }) {
  const locale = useLocale();
  const t = useTranslations("courses");
  const lang = locale === "ar" ? "ar" : "en";

  const title = course.title?.[lang] ?? course.slug;
  const description = course.description?.[lang] ?? "";

  return (
    <LocalizedLink
      href={`/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <h3 className="font-bold leading-snug text-foreground group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
        {description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {course.lessons} {t("lessons")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {course.durationWeeks} {t("duration")}
        </span>
        <ArrowRight className="ms-auto h-4 w-4 text-primary transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
      </div>
    </LocalizedLink>
  );
}
