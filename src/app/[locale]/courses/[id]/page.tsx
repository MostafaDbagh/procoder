"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { courses } from "@/data/courses";
import { AnimatedSection } from "@/components/AnimatedSection";
import { EnrollModal } from "@/components/EnrollModal";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations("courseDetail");
  const ct = useTranslations("courseData");
  const common = useTranslations("courses");
  const [enrollOpen, setEnrollOpen] = useState(false);

  const course = courses.find((c) => c.id === id);

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

  const info = [
    {
      icon: Users,
      label: t("ageGroup"),
      value: `${course.ageMin}–${course.ageMax}`,
    },
    {
      icon: BarChart3,
      label: t("level"),
      value: common(course.level as "beginner" | "intermediate" | "advanced"),
    },
    {
      icon: Clock,
      label: t("duration"),
      value: `${course.durationWeeks} ${common("duration")}`,
    },
    {
      icon: BookOpen,
      label: t("lessons"),
      value: `${course.lessons} ${common("lessons")}`,
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <AnimatedSection>
          <LocalizedLink
            href="/courses"
            className="inline-flex items-center gap-2 text-muted hover:text-primary font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToCourses")}
          </LocalizedLink>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection delay={0.1}>
          <div
            className={`rounded-3xl bg-gradient-to-br ${course.color} p-8 sm:p-12 mb-8 relative overflow-hidden`}
          >
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
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {ct(course.titleKey)}
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                {ct(course.descKey)}
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Info grid */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {info.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-surface rounded-2xl border border-border p-5 text-center"
              >
                <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted mb-1">{item.label}</p>
                <p className="font-semibold">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Description */}
        <AnimatedSection delay={0.3}>
          <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9 mb-8">
            <h2 className="text-xl font-bold mb-4">{t("description")}</h2>
            <p className="text-muted leading-relaxed">{ct(course.descKey)}</p>
          </div>
        </AnimatedSection>

        {/* Skills */}
        <AnimatedSection delay={0.4}>
          <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9 mb-8">
            <h2 className="text-xl font-bold mb-5">{t("skillsGained")}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {course.skillKeys.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-primary/5"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-sm">{ct(key)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.5}>
          <div className="text-center">
            <button
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
        courseTitle={ct(course.titleKey)}
      />
    </div>
  );
}
