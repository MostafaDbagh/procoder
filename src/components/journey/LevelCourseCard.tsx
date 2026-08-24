"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import type { APICourse } from "@/lib/api";
import { publicOrAbsoluteAssetUrl } from "@/lib/mediaUrls";
import { courseCategoryLabelKey, titleizeCategorySlug } from "@/lib/courseCategoryLabel";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

/**
 * Course card for a learning-path level page. Leads with the cover image, then
 * what the course develops — at this point the parent is choosing a stage, not
 * comparing prices, so no price or enrol CTA appears here.
 */
export function LevelCourseCard({ course }: { course: APICourse }) {
  const locale = useLocale();
  const t = useTranslations("courses");
  const lang = locale === "ar" ? "ar" : "en";

  const title = course.title?.[lang] ?? course.slug;
  const description = course.description?.[lang] ?? "";
  const coverSrc = course.imageUrl ? publicOrAbsoluteAssetUrl(course.imageUrl) : "";

  const labelKey = courseCategoryLabelKey(course.category);
  const categoryLabel = t.has(`categoryLabels.${labelKey}` as never)
    ? t(`categoryLabels.${labelKey}` as never)
    : titleizeCategorySlug(course.category);

  return (
    <LocalizedLink
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
    >
      {/* Cover */}
      <div
        className={`relative min-h-[150px] overflow-hidden sm:min-h-[164px] ${
          coverSrc ? "" : `bg-gradient-to-br ${course.color || "from-blue-400 to-cyan-400"}`
        }`}
      >
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          />
        ) : (
          <>
            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/25" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/20" />
          </>
        )}

        <span className="absolute bottom-3 start-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {categoryLabel}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
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
      </div>
    </LocalizedLink>
  );
}
