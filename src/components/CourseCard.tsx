"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatCoursePrice } from "@/lib/formatCoursePrice";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import Image from "next/image";
import {
 Clock,
 BookOpen,
 Users,
 ArrowRight,
 Blocks,
 Code2,
 Globe,
 Bot,
 Cpu,
 Brain,
 Trophy,
 PenTool,
 BookMarked,
 Star,
 Gamepad2,
 Smartphone,
 Layout,
 AppWindow,
 Palette,
 Terminal,
} from "lucide-react";
import type { Course } from "@/data/courses";
import { publicOrAbsoluteAssetUrl } from "@/lib/mediaUrls";

const iconMap: Record<string, React.ElementType> = {
 Blocks, Code2, Globe, Bot, Cpu, Brain, Trophy, BookOpen, PenTool, BookMarked, Star, Gamepad2,
 Smartphone, Layout, AppWindow, Palette, Terminal,
};

const categoryColors: Record<string, { badge: string; bg: string; accent: string }> = {
 programming: {
 badge: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
 bg: "bg-blue-50 dark:bg-blue-950/20",
 accent: "text-blue-500",
 },
 robotics: {
 badge: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
 bg: "bg-emerald-50 dark:bg-emerald-950/20",
 accent: "text-emerald-500",
 },
 algorithms: {
 badge: "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
 bg: "bg-violet-50 dark:bg-violet-950/20",
 accent: "text-violet-500",
 },
 arabic: {
 badge: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
 bg: "bg-rose-50 dark:bg-rose-950/20",
 accent: "text-rose-500",
 },
};

const levelColors: Record<string, string> = {
 beginner: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
 intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
 advanced: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

interface CourseCardProps {
 course: Course & { _title?: string; _desc?: string };
 index?: number;
 title?: string;
 description?: string;
}

export const CourseCard = React.memo(function CourseCard({ course, index = 0, title, description }: CourseCardProps) {
 const t = useTranslations("courseData");
 const ct = useTranslations("courses");
 const locale = useLocale();
 const Icon = iconMap[course.iconName] || BookOpen;
 const colors = categoryColors[course.category] || categoryColors.programming;

 const courseTitle = title || (course.titleKey ? t(course.titleKey) : course._title || "");
 const courseDesc = description || (course.descKey ? t(course.descKey) : course._desc || "");
 const coverSrc = course.imageUrl ? publicOrAbsoluteAssetUrl(course.imageUrl) : "";
 const hasCover = Boolean(coverSrc);

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-40px" }}
 transition={{ duration: 0.4, delay: index * 0.06 }}
 >
 <LocalizedLink href={`/courses/${course.id}`} className="block group h-full">
 <div className="h-full bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
 {/* Top area: solid category tint, or photo cover when image exists */}
 <div
 className={`px-6 pt-6 pb-5 relative overflow-hidden min-h-[148px] ${
 hasCover ? "" : colors.bg
 }`}
 >
 {hasCover ? (
 <>
 <Image
 src={coverSrc}
 alt=""
 fill
 className="object-cover"
 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
 unoptimized
 aria-hidden
 />
 <div
 className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"
 aria-hidden
 />
 </>
 ) : (
 <>
 <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-white/30 dark:bg-white/5" />
 <div className="absolute bottom-[-15px] left-[-15px] w-20 h-20 rounded-full bg-white/20 dark:bg-white/5" />
 </>
 )}

 <div
 className={`relative z-10 flex items-start gap-3 ${
 hasCover ? "justify-end" : "justify-between"
 }`}
 >
 {!hasCover ? (
 <div
 className={`w-14 h-14 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center shadow-sm bg-white dark:bg-surface ${colors.accent}`}
 >
 <Icon className="w-7 h-7" />
 </div>
 ) : null}
 <div className="flex gap-1.5 flex-wrap justify-end">
 <span
 className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
 hasCover
 ? "bg-white/20 text-white ring-1 ring-white/25 backdrop-blur-sm"
 : colors.badge
 }`}
 >
 {course.category}
 </span>
 <span
 className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
 hasCover
 ? "bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm"
 : levelColors[course.level]
 }`}
 >
 {ct(course.level as "beginner" | "intermediate" | "advanced")}
 </span>
 </div>
 </div>

 <h3
 className={`text-lg font-bold mt-4 transition-colors leading-snug ${
 hasCover
 ? "text-white drop-shadow-md group-hover:text-white/95"
 : "group-hover:text-primary"
 }`}
 >
 {courseTitle}
 </h3>
 </div>

 {/* Content */}
 <div className="px-6 py-5">
 <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-2">
 {courseDesc}
 </p>

 {/* Meta row */}
 <div className="flex items-center gap-4 text-xs text-muted mb-5">
 <span className="flex items-center gap-1.5">
 <BookOpen className="w-3.5 h-3.5" />
 {course.lessons} {ct("lessons")}
 </span>
 <span className="flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5" />
 {course.durationWeeks} {ct("duration")}
 </span>
 <span className="flex items-center gap-1.5">
 <Users className="w-3.5 h-3.5" />
 {course.ageMin}–{course.ageMax}
 </span>
 </div>

 {/* CTA */}
 <div className="flex items-center justify-between gap-3 flex-wrap">
 {typeof course.price === "number" && course.price > 0 ? (
 <span className="text-sm font-bold text-foreground tabular-nums">
 {formatCoursePrice(
 course.price,
 course.currency || "USD",
 locale
 )}
 </span>
 ) : (
 <span />
 )}
 <span className={`text-sm font-semibold ${colors.accent} group-hover:underline flex items-center gap-1 transition-all group-hover:gap-2`}>
 {ct("learnMore")}
 <ArrowRight className="w-4 h-4" />
 </span>
 </div>
 </div>
 </div>
 </LocalizedLink>
 </motion.div>
 );
});
