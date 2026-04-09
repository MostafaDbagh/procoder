"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { courses as staticCourses, type Category, type Level } from "@/data/courses";
import { fetchCourses, type APICourse } from "@/lib/api";
import { CourseCard } from "@/components/CourseCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Code2,
  Bot,
  Brain,
  BookOpen,
  BookMarked,
  Sparkles,
  GraduationCap,
  X,
  Loader2,
} from "lucide-react";

type AgeFilter = "all" | "6-9" | "10-13" | "14-18";

const categoryTabs: {
  value: Category | "all";
  icon: React.ElementType;
  color: string;
  activeColor: string;
}[] = [
  { value: "all", icon: Sparkles, color: "text-muted", activeColor: "bg-primary text-white" },
  { value: "programming", icon: Code2, color: "text-blue-500", activeColor: "bg-blue-500 text-white" },
  { value: "robotics", icon: Bot, color: "text-emerald-500", activeColor: "bg-emerald-500 text-white" },
  { value: "algorithms", icon: Brain, color: "text-violet-500", activeColor: "bg-violet-500 text-white" },
  { value: "arabic", icon: BookOpen, color: "text-rose-500", activeColor: "bg-rose-500 text-white" },
  { value: "quran", icon: BookMarked, color: "text-teal-500", activeColor: "bg-teal-500 text-white" },
];

// Convert API course to the shape CourseCard expects
function apiToLocal(c: APICourse, locale: string) {
  return {
    id: c.slug,
    category: c.category as Category,
    ageMin: c.ageMin,
    ageMax: c.ageMax,
    level: c.level as Level,
    lessons: c.lessons,
    durationWeeks: c.durationWeeks,
    color: c.color,
    iconName: c.iconName,
    // Direct translated strings
    _title: locale === "ar" ? c.title.ar : c.title.en,
    _desc: locale === "ar" ? c.description.ar : c.description.en,
    _skills: locale === "ar" ? c.skills.ar : c.skills.en,
    // Keep keys for static fallback compatibility
    titleKey: "",
    descKey: "",
    skillKeys: [] as string[],
  };
}

export type LocalCourse = ReturnType<typeof apiToLocal>;

export default function CoursesPage() {
  const t = useTranslations("courses");
  const ct = useTranslations("courseData");
  const locale = useLocale();

  const [apiCourses, setApiCourses] = useState<LocalCourse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [age, setAge] = useState<AgeFilter>("all");
  const [level, setLevel] = useState<Level | "all">("all");

  // Fetch courses from BE
  useEffect(() => {
    let cancelled = false;
    fetchCourses()
      .then((data) => {
        if (!cancelled) {
          setApiCourses(data.map((c) => apiToLocal(c, locale)));
          setLoading(false);
        }
      })
      .catch(() => {
        // Fallback to static data if BE is down
        if (!cancelled) {
          setApiCourses(null);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [locale]);

  // Use API data if available, else static
  const allCourses = apiCourses ?? staticCourses.map((c) => ({
    ...c,
    _title: "",
    _desc: "",
    _skills: [] as string[],
  }));
  const isFromAPI = apiCourses !== null;

  const getTitle = (c: LocalCourse) =>
    isFromAPI ? c._title : ct(c.titleKey);
  const getDesc = (c: LocalCourse) =>
    isFromAPI ? c._desc : ct(c.descKey);

  const filtered = useMemo(() => {
    return allCourses.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (level !== "all" && c.level !== level) return false;
      if (age !== "all") {
        const [min, max] = age.split("-").map(Number);
        if (c.ageMax < min || c.ageMin > max) return false;
      }
      if (search) {
        const title = getTitle(c).toLowerCase();
        if (!title.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [allCourses, category, age, level, search, isFromAPI]);

  const hasFilters = category !== "all" || age !== "all" || level !== "all" || search !== "";

  const clearFilters = () => {
    setCategory("all");
    setAge("all");
    setLevel("all");
    setSearch("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <section className="relative overflow-hidden bg-surface/50 py-14 sm:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-[10%] w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-[10%] w-72 h-72 bg-violet-400/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" />
              {allCourses.length}+ {t("title")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {t("title")}
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`${t("all")}...`}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Category tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex justify-center"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                const active = category === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setCategory(tab.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? `${tab.activeColor} shadow-md`
                        : "bg-surface border border-border text-muted hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.value === "all" ? t("all") : tab.value.charAt(0).toUpperCase() + tab.value.slice(1)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters + Results */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted uppercase tracking-wider">{t("filterAge")}:</span>
              {([
                { value: "all" as AgeFilter, label: t("all") },
                { value: "6-9" as AgeFilter, label: t("ages6_9") },
                { value: "10-13" as AgeFilter, label: t("ages10_13") },
                { value: "14-18" as AgeFilter, label: t("ages14_18") },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAge(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    age === opt.value
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted uppercase tracking-wider">{t("filterLevel")}:</span>
              {([
                { value: "all" as const, label: t("all"), dot: "" },
                { value: "beginner" as const, label: t("beginner"), dot: "bg-green-400" },
                { value: "intermediate" as const, label: t("intermediate"), dot: "bg-amber-400" },
                { value: "advanced" as const, label: t("advanced"), dot: "bg-red-400" },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLevel(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    level === opt.value
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {opt.dot && <span className={`w-2 h-2 rounded-full ${opt.dot}`} />}
                  {opt.label}
                </button>
              ))}
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors">
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </motion.div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted">
              {loading ? "" : `${filtered.length} course${filtered.length !== 1 ? "s" : ""} found`}
            </p>
            {isFromAPI && (
              <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                Live data
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* Course grid */}
          {!loading && (
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key={`${category}-${age}-${level}-${search}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filtered.map((course, i) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={i}
                      title={isFromAPI ? course._title : undefined}
                      description={isFromAPI ? course._desc : undefined}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-5">
                    <Search className="w-8 h-8 text-muted" />
                  </div>
                  <p className="text-muted text-lg mb-2">{t("noCourses")}</p>
                  <button onClick={clearFilters} className="mt-3 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:scale-[1.02] transition-transform">
                    Clear filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}
