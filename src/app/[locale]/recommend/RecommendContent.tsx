"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { courses as staticCourses, type Category, type Level } from "@/data/courses";
import { CourseCard } from "@/components/CourseCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
 getAIRecommendation,
 type APICourse,
 type ChildProfile,
 type LearningPathStep,
 type ConversationTurn,
} from "@/lib/api";
import { apiCoursesToCatalog } from "@/lib/catalog";
import { filterChatInput, getFilterMessage } from "@/lib/contentFilter";
import { motion, AnimatePresence } from "framer-motion";
import {
 Sparkles,
 RotateCcw,
 SendHorizonal,
 ClipboardList,
 Bot,
 Loader2,
 ChevronRight,
 User,
 Target,
 TrendingUp,
 Calendar,
} from "lucide-react";

const interestOptions: { key: string; category: Category | "programming" }[] = [
 { key: "programming", category: "programming" },
 { key: "robotics", category: "robotics" },
 { key: "algorithms", category: "algorithms" },
 { key: "arabic", category: "arabic" },
 { key: "gaming", category: "programming" },
];

type Props = {
 initialCourses: APICourse[] | null;
};

interface ChatMessage {
 role: "user" | "assistant";
 content: string;
 profile?: ChildProfile;
 confidence?: number;
 followUpQuestions?: string[];
 learningPath?: LearningPathStep[];
 courseIds?: string[];
}

function ConfidenceBar({ value, locale }: { value: number; locale: string }) {
 const isAr = locale === "ar";
 const color =
  value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-red-400";
 const label =
  value >= 70
   ? isAr
    ? "ملف طفلك مكتمل بشكل جيد"
    : "Great — we have a solid picture of your child"
   : value >= 40
    ? isAr
     ? "معلومات جيدة، أجب على الأسئلة أدناه لنتائج أدق"
     : "Good start — answer below for sharper results"
    : isAr
     ? "نحتاج مزيداً من التفاصيل لتوصية دقيقة"
     : "Tell us more for a precise recommendation";
 return (
  <div className="mb-5">
   <div className="flex justify-between items-center mb-1.5">
    <span className="text-xs font-semibold text-muted uppercase tracking-wide">
     {isAr ? "دقة الملف الشخصي" : "Profile confidence"}
    </span>
    <span className="text-xs font-bold text-foreground">{value}%</span>
   </div>
   <div className="w-full h-2 bg-border rounded-full overflow-hidden">
    <motion.div
     initial={{ width: 0 }}
     animate={{ width: `${value}%` }}
     transition={{ duration: 0.8, ease: "easeOut" }}
     className={`h-full rounded-full ${color}`}
    />
   </div>
   <p className="text-xs text-muted mt-1">{label}</p>
  </div>
 );
}

function ProfileCard({ profile, locale }: { profile: ChildProfile; locale: string }) {
 const isAr = locale === "ar";
 const tags: { label: string; value: string; color: string }[] = [];

 if (profile.age) {
  tags.push({
   label: isAr ? "العمر" : "Age",
   value: isAr ? `${profile.age} سنوات` : `${profile.age} yrs`,
   color: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
  });
 }
 if (profile.gender) {
  tags.push({
   label: isAr ? "الجنس" : "Gender",
   value:
    profile.gender === "boy"
     ? isAr ? "ولد" : "Boy"
     : isAr ? "بنت" : "Girl",
   color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  });
 }
 if (profile.experience_level) {
  tags.push({
   label: isAr ? "الخبرة" : "Level",
   value: profile.experience_level,
   color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  });
 }
 for (const interest of profile.interests.slice(0, 3)) {
  tags.push({
   label: isAr ? "اهتمام" : "Interest",
   value: interest,
   color: "bg-primary/10 text-primary",
  });
 }
 for (const trait of profile.adjectives.slice(0, 3)) {
  tags.push({
   label: isAr ? "صفة" : "Trait",
   value: trait,
   color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  });
 }

 if (tags.length === 0) return null;

 return (
  <div className="mb-5 p-4 rounded-xl bg-surface border border-border">
   <div className="flex items-center gap-2 mb-3">
    <User className="w-4 h-4 text-primary" />
    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
     {isAr ? "ما فهمناه عن طفلك" : "What we detected about your child"}
    </span>
   </div>
   <div className="flex flex-wrap gap-2">
    {tags.map((tag, i) => (
     <span
      key={i}
      className={`inline-flex flex-col px-3 py-1.5 rounded-lg text-xs font-medium ${tag.color}`}
     >
      <span className="opacity-60 text-[10px] uppercase leading-none mb-0.5">
       {tag.label}
      </span>
      <span className="capitalize">{tag.value}</span>
     </span>
    ))}
   </div>
  </div>
 );
}

function LearningPathTimeline({
 steps,
 locale,
}: {
 steps: LearningPathStep[];
 locale: string;
}) {
 if (steps.length === 0) return null;
 const isAr = locale === "ar";

 const phaseConfig = {
  now: {
   icon: Target,
   label: isAr ? "الآن" : "Now",
   sub: isAr ? "ابدأ هنا" : "Start here",
   color: "text-emerald-600 dark:text-emerald-400",
   bg: "bg-emerald-50 dark:bg-emerald-950/30",
   dot: "bg-emerald-500",
  },
  next: {
   icon: TrendingUp,
   label: isAr ? "بعد 6 أشهر" : "6 months",
   sub: isAr ? "المرحلة التالية" : "Next level",
   color: "text-blue-600 dark:text-blue-400",
   bg: "bg-blue-50 dark:bg-blue-950/30",
   dot: "bg-blue-500",
  },
  future: {
   icon: Calendar,
   label: isAr ? "بعد سنة" : "1 year",
   sub: isAr ? "الهدف البعيد" : "Future goal",
   color: "text-violet-600 dark:text-violet-400",
   bg: "bg-violet-50 dark:bg-violet-950/30",
   dot: "bg-violet-500",
  },
 } as const;

 return (
  <div className="mb-6">
   <div className="flex items-center gap-2 mb-3">
    <Sparkles className="w-4 h-4 text-primary" />
    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
     {isAr ? "مسار التعلم المقترح" : "Suggested learning path"}
    </span>
   </div>
   <div className="relative">
    {steps.length > 1 && (
     <div className="absolute top-5 left-5 right-5 h-0.5 bg-border z-0" />
    )}
    <div className={`flex gap-3 ${steps.length === 1 ? "" : "justify-between"}`}>
     {steps.map((step) => {
      const cfg = phaseConfig[step.phase];
      const Icon = cfg.icon;
      const title =
       typeof step.title === "object"
        ? locale === "ar"
         ? step.title.ar || step.title.en
         : step.title.en || step.title.ar
        : step.title;
      return (
       <div key={step.phase} className="relative z-10 flex flex-col items-center flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center mb-2 shadow-sm`}>
         <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
        <span className={`text-[10px] font-bold uppercase ${cfg.color} mb-0.5`}>
         {cfg.label}
        </span>
        <span className="text-[10px] text-muted mb-1">{cfg.sub}</span>
        <span className="text-xs font-medium text-foreground text-center leading-tight line-clamp-2">
         {title}
        </span>
       </div>
      );
     })}
    </div>
   </div>
  </div>
 );
}

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

 // === AI multi-turn conversation state ===
 const [conversation, setConversation] = useState<ChatMessage[]>([]);
 const [chatInput, setChatInput] = useState("");
 const [chatLoading, setChatLoading] = useState(false);
 const [aiError, setAiError] = useState("");
 const [showAiResults, setShowAiResults] = useState(false);
 const inputRef = useRef<HTMLTextAreaElement>(null);
 const aiInFlightRef = useRef(false);
 const [aiCooldown, setAiCooldown] = useState(false);
 const lastAiRequestRef = useRef(0);
 const chatBottomRef = useRef<HTMLDivElement>(null);

 const latestAssistant = useMemo(
  () => [...conversation].reverse().find((m) => m.role === "assistant"),
  [conversation]
 );

 useEffect(() => {
  chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
 }, [conversation]);

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
  const categoryMatched = catalog.filter((c) => cats.includes(c.category));

  const scored = categoryMatched.map((c) => {
   let score = 0;
   const ageMatch = age >= c.ageMin && age <= c.ageMax;
   if (ageMatch) score += 50;
   else {
    const ageDist = Math.min(Math.abs(age - c.ageMin), Math.abs(age - c.ageMax));
    if (ageDist <= 2) score += 25;
    else if (ageDist <= 4) score += 10;
   }
   if (c.level === level) score += 30;
   else if (
    (level === "beginner" && c.level === "intermediate") ||
    (level === "advanced" && c.level === "intermediate") ||
    level === "intermediate"
   )
    score += 15;
   return { course: c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const results = [];
  for (const { course, score } of scored) {
   if (score <= 0 || seen.has(course.id)) continue;
   seen.add(course.id);
   results.push(course);
   if (results.length >= 2) break;
  }
  return results;
 }, [age, interests, level, catalog]);

 const aiRecommendedCourses = useMemo(() => {
  if (!latestAssistant?.courseIds) return [];
  const seen = new Set<string>();
  const results = [];
  for (const id of latestAssistant.courseIds) {
   if (seen.has(id)) continue;
   seen.add(id);
   const course = catalog.find((c) => c.id === id);
   if (course) results.push(course);
   if (results.length >= 2) break;
  }
  return results;
 }, [latestAssistant, catalog]);

 const handleSubmit = () => {
  if (age != null && interests.length > 0 && level) setShowResults(true);
 };

 const handleReset = () => {
  setAge(null);
  setInterests([]);
  setLevel("");
  setShowResults(false);
 };

 const AI_REQUEST_MS = 120_000;

 const runAiRecommendation = async (rawMessage: string) => {
  const message = rawMessage.trim();
  if (!message || aiInFlightRef.current || aiCooldown) return;

  const now = Date.now();
  if (now - lastAiRequestRef.current < 5000) {
   setAiError(
    locale === "ar"
     ? "يرجى الانتظار قليلاً قبل المحاولة مرة أخرى"
     : "Please wait a moment before trying again"
   );
   return;
  }
  lastAiRequestRef.current = now;

  const filter = filterChatInput(message);
  if (!filter.ok) {
   setAiError(getFilterMessage(filter.reason, locale === "ar"));
   return;
  }

  aiInFlightRef.current = true;
  setChatInput("");
  setChatLoading(true);
  setAiError("");

  // Add user message to conversation immediately
  const userTurn: ChatMessage = { role: "user", content: message };
  setConversation((prev) => [...prev, userTurn]);

  // Build history for backend (all previous turns)
  const historyForBackend: ConversationTurn[] = conversation.map((m) => ({
   role: m.role,
   content: m.content,
  }));

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), AI_REQUEST_MS);

  try {
   const data = await getAIRecommendation(message, locale, {
    signal: ac.signal,
    conversationHistory: historyForBackend,
   });

   const uniqueIds = [...new Set(data.ids || [])];

   const assistantTurn: ChatMessage = {
    role: "assistant",
    content: data.message || "",
    profile: data.profile,
    confidence: data.confidence,
    followUpQuestions: data.followUpQuestions,
    learningPath: data.learningPath,
    courseIds: uniqueIds,
   };

   setConversation((prev) => [...prev, assistantTurn]);
   setShowAiResults(true);
   setAiCooldown(true);
   setTimeout(() => setAiCooldown(false), 10_000);
  } catch (err) {
   const aborted =
    err instanceof Error &&
    (err.name === "AbortError" || err.message === "The user aborted a request.");
   setAiError(
    aborted
     ? t("aiTimeout")
     : err instanceof Error
      ? err.message
      : "Something went wrong"
   );
   // Remove the user message we optimistically added
   setConversation((prev) => prev.slice(0, -1));
  } finally {
   clearTimeout(timer);
   aiInFlightRef.current = false;
   setChatLoading(false);
  }
 };

 const handleAiSubmit = () => {
  void runAiRecommendation(chatInput);
 };

 const handleFollowUp = (question: string) => {
  void runAiRecommendation(question);
 };

 const handleAiReset = () => {
  aiInFlightRef.current = false;
  setChatInput("");
  setConversation([]);
  setAiError("");
  setShowAiResults(false);
  setChatLoading(false);
  setAiCooldown(false);
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
   e.preventDefault();
   handleAiSubmit();
  }
 };

 const isValid = Boolean(age != null && interests.length > 0 && level);

 return (
  <div className="py-12 sm:py-20">
   <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <AnimatedSection className="text-center mb-12">
     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
      <Sparkles className="w-4 h-4" />
      {t("aiBadge")}
     </div>
     <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
      {t("title")}
     </h1>
     <p className="text-muted text-lg max-w-xl mx-auto">{t("subtitle")}</p>
     <div className="mt-6 max-w-lg mx-auto p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
       <strong>⚠</strong>{" "}
       {locale === "ar"
        ? "محرك التوصية الذكي قيد التطوير المستمر لتقديم أفضل النتائج لأطفالك. النتائج استرشادية ونوصي بمراجعة تفاصيل الدورة قبل التسجيل."
        : "Our AI recommendation engine is continuously being improved to serve the best results for your kids. Results are suggestions — we recommend reviewing course details before enrolling."}
      </p>
     </div>
    </AnimatedSection>

    {/* Tab switcher */}
    <AnimatedSection delay={0.1} className="mb-8">
     <div className="flex gap-2 p-1.5 bg-surface rounded-2xl border border-border">
      <button
       type="button"
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
       type="button"
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
     {/* ===== AI TAB — INPUT ===== */}
     {tab === "ai" && !showAiResults && (
      <motion.div
       key="ai-input"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -20 }}
      >
       <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9">
        <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-primary/5">
         <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-white" />
         </div>
         <div>
          <p className="font-semibold text-sm mb-1">{t("aiGreetingTitle")}</p>
          <p className="text-muted text-sm leading-relaxed">{t("aiGreeting")}</p>
         </div>
        </div>

        <div className="mb-6">
         <p className="text-sm font-medium text-muted mb-3">{t("aiExamples")}</p>
         <div className="flex flex-wrap gap-2">
          {[t("aiExample1"), t("aiExample2"), t("aiExample3")].map((example, i) => (
           <button
            type="button"
            key={i}
            onClick={() => void runAiRecommendation(example)}
            className="px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-muted hover:text-foreground hover:border-primary/30 transition-all text-left"
           >
            &ldquo;{example}&rdquo;
           </button>
          ))}
         </div>
        </div>

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
          type="button"
          aria-label={t("aiSend")}
          onClick={handleAiSubmit}
          disabled={!chatInput.trim() || chatLoading || aiCooldown}
          className={`absolute bottom-3 end-3 z-20 p-2.5 rounded-xl transition-all ${
           chatInput.trim() && !chatLoading && !aiCooldown
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

     {/* ===== AI TAB — RESULTS ===== */}
     {tab === "ai" && showAiResults && (
      <motion.div
       key="ai-results"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -20 }}
      >
       {/* Conversation history */}
       <div className="space-y-4 mb-6">
        {conversation.map((msg, i) => (
         <div key={i}>
          {msg.role === "user" ? (
           <div className="flex justify-end">
            <div className="bg-primary text-white px-5 py-3 rounded-2xl rounded-br-sm max-w-[80%]">
             <p className="text-sm">{msg.content}</p>
            </div>
           </div>
          ) : (
           <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
             <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-surface border border-border px-5 py-3 rounded-2xl rounded-bl-sm max-w-[85%]">
             <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
           </div>
          )}
         </div>
        ))}

        {chatLoading && (
         <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
           <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-surface border border-border px-5 py-4 rounded-2xl rounded-bl-sm">
           <div className="flex gap-1.5 items-center">
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
           </div>
          </div>
         </div>
        )}
        <div ref={chatBottomRef} />
       </div>

       {/* Profile + Confidence + Learning Path */}
       {latestAssistant && (
        <div className="mb-6 p-5 rounded-2xl bg-surface border border-border">
         {latestAssistant.profile && (
          <ProfileCard profile={latestAssistant.profile} locale={locale} />
         )}
         {typeof latestAssistant.confidence === "number" && (
          <ConfidenceBar value={latestAssistant.confidence} locale={locale} />
         )}
         {latestAssistant.learningPath && latestAssistant.learningPath.length > 0 && (
          <LearningPathTimeline steps={latestAssistant.learningPath} locale={locale} />
         )}
        </div>
       )}

       {/* Follow-up questions */}
       {latestAssistant?.followUpQuestions && latestAssistant.followUpQuestions.length > 0 && (
        <div className="mb-6">
         <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
          {locale === "ar" ? "أسئلة لتحسين التوصية" : "Questions to refine results"}
         </p>
         <div className="flex flex-col gap-2">
          {latestAssistant.followUpQuestions.map((q, i) => (
           <button
            type="button"
            key={i}
            disabled={chatLoading || aiCooldown}
            onClick={() => handleFollowUp(q)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 text-sm text-foreground hover:bg-primary/10 hover:border-primary/40 transition-all text-start disabled:opacity-40 disabled:cursor-not-allowed"
           >
            <ChevronRight className="w-4 h-4 text-primary shrink-0" />
            {q}
           </button>
          ))}
         </div>
        </div>
       )}

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
        !chatLoading && (
         <div className="text-center py-10 bg-surface rounded-2xl border border-border mb-8">
          <Bot className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-muted text-lg mb-2">
           {locale === "ar"
            ? "لم نجد دورات مناسبة لطفلك بناءً على وصفك."
            : "We couldn't find matching courses based on your description."}
          </p>
          <p className="text-sm text-muted max-w-md mx-auto">
           {locale === "ar"
            ? "جرب ذكر عمر طفلك واهتماماته بشكل أوضح، مثل: \"ابني عمره ١٠ سنوات يحب البرمجة والألعاب\""
            : "Try mentioning your child's age and interests more clearly, like: \"My 10 year old loves coding and games\""}
          </p>
         </div>
        )
       )}

       {/* Continue chat input */}
       {!chatLoading && (
        <div className="mb-6">
         <div className="relative">
          <textarea
           ref={inputRef}
           value={chatInput}
           onChange={(e) => setChatInput(e.target.value)}
           onKeyDown={handleKeyDown}
           placeholder={
            locale === "ar"
             ? "أضف تفاصيل أو اطرح سؤالاً..."
             : "Add more details or ask a follow-up..."
           }
           rows={2}
           className="w-full px-5 py-3 pe-14 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none text-sm"
          />
          <button
           type="button"
           aria-label={t("aiSend")}
           onClick={handleAiSubmit}
           disabled={!chatInput.trim() || chatLoading || aiCooldown}
           className={`absolute bottom-3 end-3 z-20 p-2 rounded-xl transition-all ${
            chatInput.trim() && !chatLoading && !aiCooldown
             ? "bg-primary text-white shadow-md hover:shadow-lg"
             : "bg-border text-muted cursor-not-allowed"
           }`}
          >
           <SendHorizonal className="w-4 h-4" />
          </button>
         </div>
         {aiError && (
          <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm"
          >
           {aiError}
          </motion.p>
         )}
        </div>
       )}

       <div className="text-center">
        <button
         type="button"
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
        <div>
         <label className="block text-lg font-semibold mb-3">{t("childAge")}</label>
         <div className="flex flex-wrap gap-2">
          {Array.from({ length: 13 }, (_, i) => i + 6).map((a) => (
           <button
            type="button"
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

        <div>
         <label className="block text-lg font-semibold mb-3">{t("interests")}</label>
         <p className="text-sm text-muted mb-3">{t("selectInterests")}</p>
         <div className="flex flex-wrap gap-3">
          {interestOptions.map((opt) => (
           <button
            type="button"
            key={opt.key}
            onClick={() => toggleInterest(opt.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
             interests.includes(opt.key)
              ? "bg-primary text-white shadow-md shadow-primary/10"
              : "bg-background border border-border text-muted hover:border-primary/30 hover:text-foreground"
            }`}
           >
            {t(opt.key as "programming" | "robotics" | "algorithms" | "arabic" | "gaming")}
           </button>
          ))}
         </div>
        </div>

        <div>
         <label className="block text-lg font-semibold mb-3">{t("skillLevel")}</label>
         <div className="space-y-2">
          {(["beginner", "intermediate", "advanced"] as const).map((l) => (
           <button
            type="button"
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
          ))}
         </div>
        </div>

        <button
         type="button"
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
        {age && (
         <p className="text-xs text-muted mt-2">
          {locale === "ar"
           ? `العمر: ${age} | الاهتمامات: ${interests.join("، ")} | المستوى: ${level}`
           : `Age: ${age} | Interests: ${interests.join(", ")} | Level: ${level}`}
         </p>
        )}
       </div>

       {recommended.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
         {recommended.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
         ))}
        </div>
       ) : (
        <div className="text-center py-12 bg-surface rounded-2xl border border-border">
         <Sparkles className="w-10 h-10 text-muted mx-auto mb-3" />
         <p className="text-muted text-lg mb-2">{t("noResults")}</p>
         <p className="text-sm text-muted max-w-md mx-auto">
          {locale === "ar"
           ? "جرب تعديل العمر أو الاهتمامات أو المستوى للحصول على نتائج أفضل."
           : "Try adjusting the age, interests, or level for better results."}
         </p>
        </div>
       )}

       <div className="text-center mt-6">
        <button
         type="button"
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
