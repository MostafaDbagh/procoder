"use client";

import { useState, useMemo, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { courses as staticCourses, type Category, type Level } from "@/data/courses";
import { CourseCard } from "@/components/CourseCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getAIRecommendation, type APICourse } from "@/lib/api";
import { apiCoursesToCatalog } from "@/lib/catalog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  SendHorizonal,
  ClipboardList,
  Bot,
  Loader2,
} from "lucide-react";

const interestOptions: { key: string; category: Category | "programming" }[] = [
  { key: "programming", category: "programming" },
  { key: "robotics", category: "robotics" },
  { key: "algorithms", category: "algorithms" },
  { key: "arabic", category: "arabic" },
  { key: "quran", category: "quran" },
  { key: "gaming", category: "programming" },
];

type Props = {
  initialCourses: APICourse[] | null;
};

export default function RecommendContent({ initialCourses }: Props) {
  const t = useTranslations("recommend");
  const locale = useLocale();

  const catalog = useMemo(() => {
    if (initialCourses && initialCourses.length > 0) {
      return apiCoursesToCatalog(initialCourses, locale);
    }
    return staticCourses;
  }, [initialCourses, locale]);

  // === Tab state ===
  const [tab, setTab] = useState<"form" | "ai">("ai");

  // === Form-based state ===
  const [age, setAge] = useState<number | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [level, setLevel] = useState<Level | "">("");
  const [showResults, setShowResults] = useState(false);

  // === AI chat state ===
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiCourseIds, setAiCourseIds] = useState<string[]>([]);
  const [aiError, setAiError] = useState("");
  const [showAiResults, setShowAiResults] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const toggleInterest = (key: string) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const recommended = useMemo(() => {
    if (!age || interests.length === 0 || !level) return [];
    const cats = interests.map(
      (i) => interestOptions.find((o) => o.key === i)?.category
    );
    return catalog
      .filter((c) => {
        const ageMatch = age >= c.ageMin && age <= c.ageMax;
        const catMatch = cats.includes(c.category);
        const levelMatch =
          c.level === level ||
          (level === "beginner" && c.level === "intermediate") ||
          (level === "advanced" && c.level === "intermediate");
        return ageMatch && catMatch && levelMatch;
      })
      .sort((a, b) => {
        const aExact = a.level === level ? 1 : 0;
        const bExact = b.level === level ? 1 : 0;
        return bExact - aExact;
      })
      .slice(0, 6);
  }, [age, interests, level, catalog]);

  const aiRecommendedCourses = useMemo(
    () => catalog.filter((c) => aiCourseIds.includes(c.id)),
    [aiCourseIds, catalog]
  );

  const handleSubmit = () => {
    if (age && interests.length > 0 && level) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setAge(null);
    setInterests([]);
    setLevel("");
    setShowResults(false);
  };

  const handleAiSubmit = async () => {
    if (!chatInput.trim() || chatLoading) return;
    setChatLoading(true);
    setAiError("");
    setAiMessage("");
    setAiCourseIds([]);

    try {
      const data = await getAIRecommendation(chatInput.trim(), locale);
      setAiMessage(data.message || "");
      setAiCourseIds(data.ids || []);
      setShowAiResults(true);
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setChatLoading(false);
    }
  };

  const handleAiReset = () => {
    setChatInput("");
    setAiMessage("");
    setAiCourseIds([]);
    setAiError("");
    setShowAiResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAiSubmit();
    }
  };

  const isValid = age && interests.length > 0 && level;

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t("title")}
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {/* Tab switcher */}
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="flex gap-2 p-1.5 bg-surface rounded-2xl border border-border">
            <button
              onClick={() => setTab("ai")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                tab === "ai"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {t("aiTab")}
            </button>
            <button
              onClick={() => setTab("form")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                tab === "form"
                  ? "bg-primary text-white shadow-md"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              {t("formTab")}
            </button>
          </div>
        </AnimatedSection>

        <AnimatePresence mode="wait">
          {/* ===== AI TAB ===== */}
          {tab === "ai" && !showAiResults && (
            <motion.div
              key="ai-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9">
                {/* AI intro */}
                <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-primary/5">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">{t("aiGreetingTitle")}</p>
                    <p className="text-muted text-sm leading-relaxed">
                      {t("aiGreeting")}
                    </p>
                  </div>
                </div>

                {/* Examples */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-muted mb-3">{t("aiExamples")}</p>
                  <div className="flex flex-wrap gap-2">
                    {[t("aiExample1"), t("aiExample2"), t("aiExample3")].map(
                      (example, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setChatInput(example);
                            inputRef.current?.focus();
                          }}
                          className="px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-muted hover:text-foreground hover:border-primary/30 transition-all text-left"
                        >
                          &ldquo;{example}&rdquo;
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Input */}
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("aiPlaceholder")}
                    rows={3}
                    className="w-full px-5 py-4 pe-14 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                  />
                  <button
                    onClick={handleAiSubmit}
                    disabled={!chatInput.trim() || chatLoading}
                    className={`absolute bottom-3 end-3 p-2.5 rounded-xl transition-all ${
                      chatInput.trim() && !chatLoading
                        ? "bg-primary text-white shadow-md hover:shadow-lg"
                        : "bg-border text-muted cursor-not-allowed"
                    }`}
                  >
                    {chatLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <SendHorizonal className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {aiError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm"
                  >
                    {aiError}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* AI Results */}
          {tab === "ai" && showAiResults && (
            <motion.div
              key="ai-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* AI response bubble */}
              <div className="mb-8">
                {/* User message */}
                <div className="flex justify-end mb-4">
                  <div className="bg-primary text-white px-5 py-3 rounded-2xl rounded-br-sm max-w-[80%]">
                    <p className="text-sm">{chatInput}</p>
                  </div>
                </div>

                {/* AI response */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Bot className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="bg-surface border border-border px-5 py-3 rounded-2xl rounded-bl-sm max-w-[80%]">
                    <p className="text-sm leading-relaxed">{aiMessage}</p>
                  </div>
                </div>
              </div>

              {/* Recommended courses */}
              {aiRecommendedCourses.length > 0 ? (
                <>
                  <h2 className="text-xl font-bold mb-5">{t("results")}</h2>
                  <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    {aiRecommendedCourses.map((course, i) => (
                      <CourseCard key={course.id} course={course} index={i} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted">{t("noResults")}</p>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleAiReset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t("tryAgain")}
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== FORM TAB ===== */}
          {tab === "form" && !showResults && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9 space-y-8">
                {/* Age selection */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    {t("childAge")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 13 }, (_, i) => i + 6).map((a) => (
                      <button
                        key={a}
                        onClick={() => setAge(a)}
                        className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all ${
                          age === a
                            ? "bg-primary text-white shadow-md shadow-primary/10"
                            : "bg-background border border-border text-muted hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    {t("interests")}
                  </label>
                  <p className="text-sm text-muted mb-3">
                    {t("selectInterests")}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {interestOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => toggleInterest(opt.key)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          interests.includes(opt.key)
                            ? "bg-primary text-white shadow-md shadow-primary/10"
                            : "bg-background border border-border text-muted hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {t(opt.key as "programming" | "robotics" | "algorithms" | "arabic" | "quran" | "gaming")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skill Level */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    {t("skillLevel")}
                  </label>
                  <div className="space-y-2">
                    {(["beginner", "intermediate", "advanced"] as const).map(
                      (l) => (
                        <button
                          key={l}
                          onClick={() => setLevel(l)}
                          className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${
                            level === l
                              ? "bg-primary text-white shadow-md shadow-primary/10"
                              : "bg-background border border-border text-muted hover:border-primary/30 hover:text-foreground"
                          }`}
                        >
                          {t(l)}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!isValid}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                    isValid
                      ? "bg-primary text-white shadow-lg shadow-primary/10 hover:shadow-xl hover:scale-[1.01]"
                      : "bg-border text-muted cursor-not-allowed"
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  {t("getRecommendations")}
                </button>
              </div>
            </motion.div>
          )}

          {/* Form Results */}
          {tab === "form" && showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">{t("results")}</h2>
                <p className="text-muted">{t("resultsSubtitle")}</p>
              </div>

              {recommended.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {recommended.map((course, i) => (
                    <CourseCard key={course.id} course={course} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted text-lg">{t("noResults")}</p>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t("tryAgain")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
