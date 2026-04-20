"use client";

import { useState, type ElementType } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { courses as staticCourses } from "@/data/courses";
import { useCourse } from "@/hooks/useCourses";
import { AnimatedSection } from "@/components/AnimatedSection";
import { EnrollModal } from "@/components/EnrollModal";
import { formatCoursePrice, priceAfterCourseDiscount } from "@/lib/formatCoursePrice";
import { publicOrAbsoluteAssetUrl } from "@/lib/mediaUrls";
import { courseCategoryLabelKey, titleizeCategorySlug } from "@/lib/courseCategoryLabel";
import { motion } from "framer-motion";
import {
 ArrowLeft,
 Clock,
 BookOpen,
 BookMarked,
 Users,
 BarChart3,
 CheckCircle2,
 ArrowRight,
 Loader2,
 Code2,
 Bot,
 Brain,
 Gamepad2,
 Smartphone,
 Layout,
} from "lucide-react";

const categoryBadge: Record<string, string> = {
 programming:
 "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 shadow-sm shadow-blue-600/10",
 robotics:
 "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 shadow-sm shadow-emerald-600/10",
 algorithms:
 "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300 shadow-sm shadow-violet-600/10",
 arabic:
 "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 shadow-sm shadow-rose-600/10",
 "game-development":
 "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200 shadow-sm shadow-amber-600/10",
 "mobile-development":
 "bg-pink-100 text-pink-900 dark:bg-pink-950/50 dark:text-pink-200 shadow-sm shadow-pink-600/10",
 "mobile-app-development":
 "bg-pink-100 text-pink-900 dark:bg-pink-950/50 dark:text-pink-200 shadow-sm shadow-pink-600/10",
 "web-development":
 "bg-cyan-100 text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-200 shadow-sm shadow-cyan-600/10",
};

const levelBadge: Record<string, string> = {
 beginner:
 "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 capitalize shadow-sm shadow-green-600/10",
 intermediate:
 "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200 capitalize shadow-sm shadow-amber-600/10",
 advanced:
 "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 capitalize shadow-sm shadow-red-600/10",
};

type HeroStyle = { icon: ElementType; gradient: string };

const CATEGORY_HERO: Record<string, HeroStyle> = {
 programming: { icon: Code2, gradient: "from-sky-500 to-indigo-600" },
 robotics: { icon: Bot, gradient: "from-emerald-500 to-teal-600" },
 algorithms: { icon: Brain, gradient: "from-violet-500 to-fuchsia-600" },
 arabic: { icon: BookMarked, gradient: "from-rose-500 to-pink-600" },
 "game-development": { icon: Gamepad2, gradient: "from-amber-500 to-orange-600" },
 "mobile-development": { icon: Smartphone, gradient: "from-pink-500 to-rose-600" },
 "web-development": { icon: Layout, gradient: "from-cyan-500 to-sky-600" },
};

/** Maps API / CMS slug variants to canonical CATEGORY_HERO keys. */
const CATEGORY_SLUG_ALIASES: Record<string, keyof typeof CATEGORY_HERO> = {
 mobappdev: "mobile-development",
 "mobile-app-development": "mobile-development",
 "mobile-app": "mobile-development",
 webdev: "web-development",
 gamedev: "game-development",
};

function resolveCategoryHero(category: string): HeroStyle {
 const raw = category.trim().toLowerCase();
 const canonical = CATEGORY_SLUG_ALIASES[raw];
 if (canonical && CATEGORY_HERO[canonical]) {
 return CATEGORY_HERO[canonical];
 }
 if (CATEGORY_HERO[raw]) {
 return CATEGORY_HERO[raw];
 }
 if (raw.includes("mobile") || raw.includes("mobapp")) {
 return CATEGORY_HERO["mobile-development"];
 }
 if (raw.includes("web")) {
 return CATEGORY_HERO["web-development"];
 }
 if (raw.includes("game")) {
 return CATEGORY_HERO["game-development"];
 }
 if (raw.includes("robot")) {
 return CATEGORY_HERO.robotics;
 }
 if (raw.includes("algo")) {
 return CATEGORY_HERO.algorithms;
 }
 if (raw.includes("arabic")) {
 return CATEGORY_HERO.arabic;
 }
 return CATEGORY_HERO.programming;
}

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

 const categoryLabelKeyResolved = courseCategoryLabelKey(course.category);
 const categoryLabel =
 common.has(`categoryLabels.${categoryLabelKeyResolved}` as never)
 ? common(`categoryLabels.${categoryLabelKeyResolved}` as never)
 : titleizeCategorySlug(course.category);
 const categoryBadgeClass =
 categoryBadge[course.category] ||
 categoryBadge[categoryLabelKeyResolved] ||
 categoryBadge.programming;

 const info = [
 { icon: Users, label: t("ageGroup"), value: `${course.ageMin}–${course.ageMax}` },
 { icon: BarChart3, label: t("level"), value: common(course.level as "beginner" | "intermediate" | "advanced") },
 { icon: Clock, label: t("duration"), value: `${course.durationWeeks} ${common("duration")}` },
 { icon: BookOpen, label: t("lessons"), value: `${course.lessons} ${common("lessons")}` },
 ];

 const { icon: HeroIcon, gradient: iconGrad } = resolveCategoryHero(course.category);

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
 <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-surface px-4 py-5 shadow-lg sm:px-6 sm:py-6">
 <div className="relative pb-2">
 {/* Content */}
 <div className="min-w-0 pe-4">
 <div className="mb-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
 <span
 className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold sm:px-3.5 sm:py-1 sm:text-xs ${categoryBadgeClass}`}
 >
 {categoryLabel}
 </span>
 <span
 className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold sm:px-3.5 sm:py-1 sm:text-xs ${
 levelBadge[course.level] || levelBadge.beginner
 }`}
 >
 {common(course.level as "beginner" | "intermediate" | "advanced")}
 </span>
 </div>
 <h1 className="mb-0.5 bg-gradient-to-r from-foreground via-primary to-violet-600 bg-clip-text text-xl font-extrabold leading-snug tracking-tight text-transparent dark:from-foreground dark:via-sky-300 dark:to-violet-400 sm:text-2xl">
 {course.title}
 </h1>
 <p className="mb-3 text-xs font-medium text-muted sm:mb-3.5 sm:text-sm">{t("heroTagline")}</p>

 {course.showPrice ? (
 <div className="flex w-full max-w-md flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-primary/15 bg-primary/[0.06] px-3.5 py-2 dark:bg-primary/10 sm:px-4 sm:py-2.5">
 <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary/80 dark:text-primary/90 sm:text-[10px] sm:tracking-[0.2em]">
 {t("price")}
 </span>
 <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums sm:gap-x-3">
 {course.price <= 0 ? (
 <span className="text-lg font-black text-foreground sm:text-xl">{common("free")}</span>
 ) : course.discountPercent > 0 && course.salePrice < course.price ? (
 <>
 <span className="text-base font-bold text-muted line-through sm:text-lg">
 {formatCoursePrice(course.price, course.currency, locale)}
 </span>
 <span className="text-lg font-black text-foreground sm:text-xl">
 {formatCoursePrice(course.salePrice, course.currency, locale)}
 </span>
 <span className="rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow-sm sm:px-2.5 sm:text-xs">
 {t("savePercent", { pct: course.discountPercent })}
 </span>
 </>
 ) : (
 <span className="text-lg font-black text-foreground sm:text-xl">
 {formatCoursePrice(course.price, course.currency, locale)}
 </span>
 )}
 </div>
 </div>
 ) : null}
 </div>

 {/* Icon — flush bottom-right corner, no top-left radius to blend with card */}
 <div
 className={`absolute -bottom-5 -end-4 flex h-16 w-16 items-center justify-center rounded-tl-2xl bg-gradient-to-br ${iconGrad} text-white sm:-bottom-6 sm:-end-6 sm:h-20 sm:w-20`}
 >
 <HeroIcon className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={2} aria-hidden />
 </div>
 </div>
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
 <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
 {categoryLabel}
 </span>
 <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium capitalize">
 {common(course.level as "beginner" | "intermediate" | "advanced")}
 </span>
 </div>
 <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight tracking-tight">
 {course.title}
 </h1>
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
