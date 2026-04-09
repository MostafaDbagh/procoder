"use client";

import { useTranslations } from "next-intl";
import { courses } from "@/data/courses";
import { CourseCard } from "@/components/CourseCard";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Award,
  Flame,
  Code2,
  Bot,
  BookMarked,
  PenTool,
} from "lucide-react";

const stats = [
  { key: "coursesEnrolled", value: "3", icon: BookOpen, color: "text-primary" },
  { key: "hoursLearned", value: "24", icon: Clock, color: "text-orange" },
  { key: "badges", value: "7", icon: Award, color: "text-purple" },
  { key: "streak", value: "12", icon: Flame, color: "text-pink" },
];

const interests = [
  { key: "programming", icon: Code2, color: "from-blue-400 to-cyan-400" },
  { key: "robotics", icon: Bot, color: "from-emerald-400 to-teal-400" },
  { key: "arabic", icon: PenTool, color: "from-rose-400 to-pink-400" },
  { key: "quran", icon: BookMarked, color: "from-green-400 to-lime-400" },
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const recommendedCourses = courses.slice(0, 4);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <AnimatedSection className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted text-lg">{t("welcome")}</p>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection delay={0.1} className="mb-10">
          <h2 className="text-xl font-bold mb-5">{t("progress")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-surface rounded-2xl border border-border p-5 text-center"
              >
                <stat.icon
                  className={`w-7 h-7 ${stat.color} mx-auto mb-3`}
                />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted">
                  {t(stat.key as "coursesEnrolled" | "hoursLearned" | "badges" | "streak")}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Interests */}
        <AnimatedSection delay={0.2} className="mb-10">
          <h2 className="text-xl font-bold mb-5">{t("savedInterests")}</h2>
          <div className="flex flex-wrap gap-3">
            {interests.map((interest, i) => (
              <AnimatedCard key={interest.key} delay={i * 0.08}>
                <div className="flex items-center gap-3 px-5 py-3 bg-surface rounded-2xl border border-border">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${interest.color} flex items-center justify-center`}
                  >
                    <interest.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">
                    {t(interest.key as "programming" | "robotics" | "arabic" | "quran")}
                  </span>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        {/* Recommended */}
        <AnimatedSection delay={0.3}>
          <h2 className="text-xl font-bold mb-5">{t("recommended")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
