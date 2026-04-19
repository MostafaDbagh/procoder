"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { courses as staticCourses } from "@/data/courses";
import { useCourse } from "@/hooks/useCourses";
import { AnimatedSection } from "@/components/AnimatedSection";
import { EnrollModal } from "@/components/EnrollModal";
import { formatCoursePrice, priceAfterCourseDiscount } from "@/lib/formatCoursePrice";
import { publicOrAbsoluteAssetUrl } from "@/lib/mediaUrls";
import { motion } from "framer-motion";
import {
 ArrowLeft,
 Clock,
 BookOpen,
 Users,
 BarChart3,
 CheckCircle2,
 ArrowRight,
 Loader2,
} from "lucide-react";

const categoryBadge: Record<string, string> = {
 programming:
 "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 capitalize",
 robotics:
 "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 capitalize",
 algorithms:
 "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 capitalize",
 arabic: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 capitalize",
};

const levelBadge: Record<string, string> = {
 beginner: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 capitalize",
 intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 capitalize",
 advanced: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 capitalize",
};

export default function CourseDetailContent() {
 const { id: slug } = useParams<{ id: string }>();
 const locale = useLocale();
 const t = useTranslations("courseDetail");
 const ct = useTranslations("courseData");
 const common = useTranslations("courses");
 const [enrollOpen, setEnrollOpen] = useState(false);

 const { data: apiCourse, isLoading, isError } = useCourse(slug);

 const staticCourse = staticCourses.find((c) => c.id === slug);
 const lang = locale === "ar" ? "ar" : "en";

 const fromApi = !isError && !!apiCourse;
 const course = fromApi
 ? {
 id: apiCourse.slug,
 category: apiCourse.category,
 ageMin: apiCourse.ageMin,
 ageMax: apiCourse.ageMax,
 level: apiCourse.level,
 lessons: apiCourse.lessons,
 durationWeeks: apiCourse.durationWeeks,
 color: apiCourse.color,
 title: apiCourse.title[lang],
 description: apiCourse.description[lang],
 skills: apiCourse.skills[lang] || [],
 price: typeof apiCourse.price === "number" ? apiCourse.price : 0,
 currency: apiCourse.currency || "USD",
 discountPercent: apiCourse.discountPercent ?? 0,
 salePrice: priceAfterCourseDiscount(
 typeof apiCourse.price === "number" ? apiCourse.price : 0,
 apiCourse.discountPercent ?? 0
 ),
 showPrice: true,
 imageUrl: apiCourse.imageUrl?.trim() || undefined,
 }
 : staticCourse
 ? {
 id: staticCourse.id,
 category: staticCourse.category,
 ageMin: staticCourse.ageMin,
 ageMax: staticCourse.ageMax,
 level: staticCourse.level,
 lessons: staticCourse.lessons,
 durationWeeks: staticCourse.durationWeeks,
 color: staticCourse.color,
 title: ct(staticCourse.titleKey),
 description: ct(staticCourse.descKey),
 skills: staticCourse.skillKeys.map((k) => ct(k)),
 price: staticCourse.price ?? 0,
 currency: staticCourse.currency ?? "USD",
 discountPercent: 0,
 salePrice: priceAfterCourseDiscount(
 staticCourse.price ?? 0,
 0
 ),
 showPrice: (staticCourse.price ?? 0) > 0,
 imageUrl: undefined as string | undefined,
 }
 : null;

 if (isLoading && !staticCourse) {
 return (
 <div className="flex justify-center py-32">
 <Loader2 className="w-8 h-8 text-primary animate-spin" />
 </div>
 );
 }

 if (!course) {
 return (
 <div className="py-32 text-center">
 <p className="text-muted text-xl">{t("notFound")}</p>
 <LocalizedLink
 href="/courses"
 className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline"
 >
 <ArrowLeft className="w-4 h-4" />
 {t("backToCourses")}
 </LocalizedLink>
 </div>
 );
 }

 const coverSrc =
 course.imageUrl?.trim()
 ? publicOrAbsoluteAssetUrl(course.imageUrl)
 : "";

 const info = [
 { icon: Users, label: t("ageGroup"), value: `${course.ageMin}–${course.ageMax}` },
 { icon: BarChart3, label: t("level"), value: common(course.level as "beginner" | "intermediate" | "advanced") },
 { icon: Clock, label: t("duration"), value: `${course.durationWeeks} ${common("duration")}` },
 { icon: BookOpen, label: t("lessons"), value: `${course.lessons} ${common("lessons")}` },
 ];

 return (
 <div className="py-12 sm:py-20">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection>
 <LocalizedLink
 href="/courses"
 className="inline-flex items-center gap-2 text-muted hover:text-primary font-medium mb-8 transition-colors"
 >
 <ArrowLeft className="w-4 h-4" />
 {t("backToCourses")}
 </LocalizedLink>
 </AnimatedSection>

 {coverSrc ? (
 <>
 <AnimatedSection delay={0.1}>
 <div className="rounded-3xl overflow-hidden border border-border bg-muted/30 mb-6 relative w-full aspect-[16/10] sm:aspect-[2/1] max-h-[min(420px,55vh)] sm:max-h-[480px]">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={coverSrc}
 alt=""
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </AnimatedSection>
 <AnimatedSection delay={0.12}>
 <div className="bg-surface rounded-3xl border border-border p-8 sm:p-10 mb-8">
 <div className="flex flex-wrap gap-2 mb-4">
 <span
 className={`text-sm font-semibold px-3 py-1 rounded-full ${
 categoryBadge[course.category] || categoryBadge.programming
 }`}
 >
 {course.category}
 </span>
 <span
 className={`text-sm font-semibold px-3 py-1 rounded-full ${
 levelBadge[course.level] || levelBadge.beginner
 }`}
 >
 {common(course.level as "beginner" | "intermediate" | "advanced")}
 </span>
 </div>
 <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{course.title}</h1>
 {course.showPrice ? (
 <p className="text-2xl font-bold text-foreground tabular-nums flex flex-wrap items-baseline gap-x-3 gap-y-1">
 <span className="text-sm font-semibold uppercase tracking-wide text-muted w-full sm:w-auto">
 {t("price")}
 </span>
 {course.price <= 0 ? (
 <span>{common("free")}</span>
 ) : course.discountPercent > 0 && course.salePrice < course.price ? (
 <>
 <span className="line-through text-muted text-lg font-semibold">
 {formatCoursePrice(course.price, course.currency, locale)}
 </span>
 <span>{formatCoursePrice(course.salePrice, course.currency, locale)}</span>
 <span className="text-sm font-medium text-primary">
 {t("savePercent", { pct: course.discountPercent })}
 </span>
 </>
 ) : (
 <span>{formatCoursePrice(course.price, course.currency, locale)}</span>
 )}
 </p>
 ) : null}
 </div>
 </AnimatedSection>
 </>
 ) : (
 <AnimatedSection delay={0.1}>
 <div className={`rounded-3xl p-8 sm:p-12 mb-8 relative overflow-hidden min-h-[220px] bg-gradient-to-br ${course.color}`}>
 <div className="absolute inset-0 bg-white/10" />
 <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
 <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10" />
 <div className="relative">
 <div className="flex flex-wrap gap-3 mb-4">
 <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium capitalize">
 {course.category}
 </span>
 <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium capitalize">
 {common(course.level as "beginner" | "intermediate" | "advanced")}
 </span>
 </div>
 <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{course.title}</h1>
 {course.showPrice ? (
 <p className="mt-5 text-2xl font-bold text-white tabular-nums flex flex-wrap items-baseline gap-x-3 gap-y-1">
 <span className="text-sm font-semibold uppercase tracking-wide text-white/70 w-full sm:w-auto">
 {t("price")}
 </span>
 {course.price <= 0 ? (
 <span>{common("free")}</span>
 ) : course.discountPercent > 0 && course.salePrice < course.price ? (
 <>
 <span className="line-through text-white/60 text-lg font-semibold">
 {formatCoursePrice(course.price, course.currency, locale)}
 </span>
 <span>{formatCoursePrice(course.salePrice, course.currency, locale)}</span>
 <span className="text-sm font-medium text-white/85">
 {t("savePercent", { pct: course.discountPercent })}
 </span>
 </>
 ) : (
 <span>{formatCoursePrice(course.price, course.currency, locale)}</span>
 )}
 </p>
 ) : null}
 </div>
 </div>
 </AnimatedSection>
 )}

 <AnimatedSection delay={0.2}>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
 {info.map((item, i) => (
 <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="bg-surface rounded-2xl border border-border p-5 text-center">
 <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
 <p className="text-xs text-muted mb-1">{item.label}</p>
 <p className="font-semibold">{item.value}</p>
 </motion.div>
 ))}
 </div>
 </AnimatedSection>

 <AnimatedSection delay={0.3}>
 <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9 mb-8">
 <h2 className="text-xl font-bold mb-4">{t("description")}</h2>
 <p className="text-muted leading-relaxed">{course.description}</p>
 </div>
 </AnimatedSection>

 <AnimatedSection delay={0.4}>
 <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9 mb-8">
 <h2 className="text-xl font-bold mb-5">{t("skillsGained")}</h2>
 <div className="grid sm:grid-cols-2 gap-3">
 {course.skills.map((skill, i) => (
 <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
 <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
 <span className="font-medium text-sm">{skill}</span>
 </motion.div>
 ))}
 </div>
 </div>
 </AnimatedSection>

 <AnimatedSection delay={0.5}>
 <div className="text-center">
 <button
 type="button"
 data-testid="course-enroll-open"
 onClick={() => setEnrollOpen(true)}
 className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary text-white font-semibold text-lg shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 hover:scale-[1.02] transition-all duration-300"
 >
 {t("enrollNow")}
 <ArrowRight className="w-5 h-5" />
 </button>
 </div>
 </AnimatedSection>
 </div>

 <EnrollModal
 open={enrollOpen}
 onClose={() => setEnrollOpen(false)}
 courseTitle={course.title}
 courseId={course.id}
 />
 </div>
 );
}
