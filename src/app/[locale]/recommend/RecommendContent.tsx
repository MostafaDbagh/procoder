"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CourseCard } from "@/components/CourseCard";
import {
 getAIRecommendation,
 type APICourse,
 type ChildProfile,
 type LevelAssessment,
 type ReadinessAnswers,
 type NextReadinessQuestion,
 type ConversationTurn,
} from "@/lib/api";
import { apiCoursesToCatalog } from "@/lib/catalog";
import { filterChatInput, getFilterMessage } from "@/lib/contentFilter";
import { motion, AnimatePresence } from "framer-motion";
import {
 Sparkles,
 RotateCcw,
 SendHorizonal,
 Bot,
 Loader2,
 ChevronRight,
 Target,
} from "lucide-react";
import { JOURNEY_LEVELS, isJourneyLevel, type JourneyLevel } from "@/data/journeyLevels";
import { LocalizedLink } from "@/components/LocalizedLink";
import { ProfileSummary } from "@/components/recommend/ProfileSummary";
import { ReadinessQuestion } from "@/components/recommend/ReadinessQuestion";
import { Mascot } from "@/components/Mascot";


type Props = {
 initialCourses: APICourse[] | null;
};

interface ChatMessage {
 role: "user" | "assistant";
 content: string;
 profile?: ChildProfile;
 followUpQuestions?: string[];
 assessment?: LevelAssessment;
 courseAvailability?: "available" | "no_match" | "pending_assessment" | "unavailable";
 courseIds?: string[];
 courses?: APICourse[];
 submittedAnswers?: ReadinessAnswers;
 nextQuestion?: NextReadinessQuestion | null;
}

function SuggestedLevel({ level, locale }: { level: JourneyLevel; locale: string }) {
 const t = useTranslations("journey.levels");
 const isAr = locale === "ar";
 return (
  <section className="mb-6" aria-label={isAr ? "المستوى المقترح" : "Suggested level"}>
   <h3 className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
    <Sparkles className="w-4 h-4 text-primary" aria-hidden />
    {isAr ? "المستوى المقترح" : "Suggested level"}
   </h3>
   <LocalizedLink href={`/learning-path/${level}`} className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary">
    <Target className="h-6 w-6 shrink-0 text-primary" aria-hidden />
    <span className="flex-1 font-bold text-foreground">{t(`${level}.meta.name`)}</span>
    <span className="text-sm text-primary">{isAr ? "استكشف المستوى" : "Explore level"}</span>
    <ChevronRight className="h-4 w-4 shrink-0 rtl:rotate-180 text-primary" aria-hidden />
   </LocalizedLink>
   <ol className="mt-3 flex flex-wrap gap-2" aria-label={isAr ? "المستويات الخمسة" : "The five levels"}>
    {JOURNEY_LEVELS.map((key, index) => (
     <li key={key} className={`rounded-lg px-3 py-2 text-sm ${key === level ? "bg-primary text-white font-bold" : "bg-background text-muted"}`}>
      {index + 1}. {t(`${key}.meta.name`)}
      {key === level && <span className="sr-only"> — {isAr ? "المستوى المقترح" : "Suggested level"}</span>}
     </li>
    ))}
   </ol>
  </section>
 );
}

export default function RecommendContent({ initialCourses }: Props) {
 const t = useTranslations("recommend");
 const locale = useLocale();

 // === AI multi-turn conversation state ===
 const [conversation, setConversation] = useState<ChatMessage[]>([]);
 const [chatInput, setChatInput] = useState("");
 const [pendingQuestion, setPendingQuestion] = useState("");
 const [readinessAnswers, setReadinessAnswers] = useState<ReadinessAnswers>({});
 const [chatLoading, setChatLoading] = useState(false);
 const [aiError, setAiError] = useState("");
 const [showAiResults, setShowAiResults] = useState(false);
 const inputRef = useRef<HTMLTextAreaElement>(null);
 const aiInFlightRef = useRef(false);
 const aiAbortRef = useRef<AbortController | null>(null);
 const aiRequestIdRef = useRef(0);
 useEffect(() => () => {
  aiRequestIdRef.current += 1;
  aiAbortRef.current?.abort();
 }, []);
 const chatBottomRef = useRef<HTMLDivElement>(null);

 const latestAssistant = useMemo(
  () => [...conversation].reverse().find((m) => m.role === "assistant"),
  [conversation]
 );

 useEffect(() => {
  chatBottomRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest" });
 }, [conversation]);

 const aiRecommendedCourses = useMemo(() => {
  const courses = latestAssistant?.courses ?? initialCourses ?? [];
  const ids = latestAssistant?.courseIds ?? [];
  const selected = ids.map(id => courses.find(course => course.slug === id)).filter((course): course is APICourse => Boolean(course));
  return apiCoursesToCatalog(selected, locale);
 }, [latestAssistant, initialCourses, locale]);

 const readinessChanged = Boolean(latestAssistant?.submittedAnswers &&
  JSON.stringify(latestAssistant.submittedAnswers) !== JSON.stringify(readinessAnswers));
 const suggestedLevel = readinessChanged ? null : latestAssistant?.assessment?.suggestedLevel;

 const AI_REQUEST_MS = 25_000;

 const runAiRecommendation = async (rawMessage: string, answers = readinessAnswers, fresh = false) => {
  const previousAnswers = readinessAnswers;
  const message = rawMessage.trim();
  if (!message || aiInFlightRef.current) return;

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
  setConversation((prev) => fresh ? [userTurn] : [...prev, userTurn]);

  // Build history for backend (all previous turns)
  const historyForBackend: ConversationTurn[] = (fresh ? [] : conversation.slice(-16)).map((m) => ({
   role: m.role,
   content: m.content,
  }));

  const requestId = ++aiRequestIdRef.current;
  const ac = new AbortController();
  aiAbortRef.current = ac;
  const timer = setTimeout(() => ac.abort(), AI_REQUEST_MS);

  try {
   const data = await getAIRecommendation(message, locale, {
    signal: ac.signal,
    conversationHistory: historyForBackend,
    assessment: answers,
   });

   if (requestId !== aiRequestIdRef.current) return;
   const uniqueIds = [...new Set(data.ids || [])];

   const assistantTurn: ChatMessage = {
    role: "assistant",
    content: data.message || "",
    profile: data.profile,
    followUpQuestions: data.followUpQuestions,
    assessment: data.assessment,
    nextQuestion: data.nextQuestion,
    courseAvailability: data.courseAvailability,
    courseIds: uniqueIds,
    courses: data.courses,
    submittedAnswers: { ...(data.assessmentAnswers ?? answers) },
   };

   if (data.assessmentAnswers) {
    setReadinessAnswers(current => JSON.stringify(current) === JSON.stringify(previousAnswers) ? data.assessmentAnswers! : current);
   }
   setPendingQuestion("");
   setConversation((prev) => [...prev, assistantTurn]);
   setShowAiResults(true);

  } catch (err) {
   if (requestId !== aiRequestIdRef.current) return;
   const aborted =
    err instanceof Error &&
    (err.name === "AbortError" || err.message === "The user aborted a request.");
   setAiError(
    aborted
     ? t("aiTimeout")
     : locale === "ar"
      ? "تعذر مراجعة الإجابات الآن. احتفظنا برسالتك؛ حاول مجدداً بعد قليل."
      : "We couldn’t review the answers right now. Your message is saved below; please try again shortly."
   );
   setChatInput(current => current.trim() ? current : message);
   // Remove the user message we optimistically added
   setConversation((prev) => prev.slice(0, -1));
  } finally {
   clearTimeout(timer);
   if (requestId === aiRequestIdRef.current) {
    aiAbortRef.current = null;
    aiInFlightRef.current = false;
    setChatLoading(false);
   }
  }
 };

 const handleAiSubmit = () => {
  const answers = { ...readinessAnswers };
  if (latestAssistant?.nextQuestion?.field === "age") {
   delete answers.age;
   const normalized = chatInput.trim().replace(/[٠-٩]/g, n => String(n.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, n => String(n.charCodeAt(0) - 1776));
   if (/^\d{1,2}$/.test(normalized)) answers.age = Number(normalized);
  }
  void runAiRecommendation(chatInput, answers);
 };

 const handleFollowUp = (question: string) => {
  setPendingQuestion(question);
  inputRef.current?.focus();
 };

 const handleAiReset = () => {
  aiRequestIdRef.current += 1;
  aiAbortRef.current?.abort();
  aiAbortRef.current = null;
  setReadinessAnswers({});
  setPendingQuestion("");
  aiInFlightRef.current = false;
  setChatInput("");
  setConversation([]);
  setAiError("");
  setShowAiResults(false);
  setChatLoading(false);
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
   e.preventDefault();
   handleAiSubmit();
  }
 };


 return (
  <div className="py-8 sm:py-12">
   <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <header className="text-center mb-7 sm:mb-9">
     <div className="flex justify-center mb-2"><Mascot pose="wave" size={88} /></div>
     <p className="text-sm font-semibold text-primary mb-3">{locale === "ar" ? "بداية صغيرة، اكتشافات كبيرة" : "Small beginnings. Big discoveries."}</p>
     <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">{locale === "ar" ? "لنجد نقطة البداية المناسبة لطفلك" : "Find your child’s STEM starting point"}</h1>
     <p className="text-muted text-base sm:text-lg max-w-xl mx-auto text-pretty">{locale === "ar" ? "أخبرنا قليلاً عن طفلك. نساعدك على استكشاف مستوى يناسب ما يستطيع فعله الآن، خطوة بخطوة." : "Tell us a little about your child. Together, we’ll explore a level that fits what they can do today, one step at a time."}</p>
     <p className="mt-4 text-xs sm:text-sm text-muted">{locale === "ar" ? "للأعمار ٥–١٨ · مجاني · دون حساب" : "Ages 5–18 · Free to use · No account needed"}</p>
    </header>

    <AnimatePresence mode="wait">
     {/* ===== AI TAB — INPUT ===== */}
     {!showAiResults && (
      <motion.div
       key="ai-input"
       initial={false}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -20 }}
      >
       <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9">
        <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-primary/5">
         <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-white" />
         </div>
         <div>
          <h2 className="font-semibold mb-1">{locale === "ar" ? "ما الذي يحب طفلك اكتشافه؟" : "What does your child love exploring?"}</h2>
          <p className="text-muted text-sm leading-relaxed">{locale === "ar" ? "ابدأ بعمره واهتماماته وما جرّبه من قبل. لا تحتاج إلى معرفة تقنية." : "Start with their age, interests, and anything they’ve tried. No technical knowledge needed."}</p>
         </div>
        </div>

        <div className="mb-6">
         <p className="text-sm font-medium text-muted mb-3">{locale === "ar" ? "تحتاج فكرة للبدء؟ عدّل أحد هذه الأمثلة:" : "Need a little inspiration? Make an example your own:"}</p>
         <div className="flex flex-wrap gap-2">
          {[t("aiExample1"), t("aiExample2"), t("aiExample3")].map((example, i) => (
           <button
            type="button"
            key={i}
            disabled={chatLoading}
            onClick={() => { setChatInput(example); inputRef.current?.focus(); }}
            className="px-3.5 py-2 rounded-xl bg-background border border-border text-sm text-muted hover:text-foreground hover:border-primary/30 transition-all text-start focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
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
          aria-label={locale === "ar" ? "أخبرنا عن طفلك" : "Tell us about your child"}
          maxLength={2000}
          placeholder={t("aiPlaceholder")}
          rows={3}
          className="w-full px-5 py-4 pe-14 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary transition-all outline-none resize-none"
         />
         <button
          type="button"
          aria-label={t("aiSend")}
          onClick={handleAiSubmit}
          disabled={!chatInput.trim() || chatLoading}
          className={`absolute bottom-3 end-3 z-20 p-2.5 rounded-xl transition-all ${
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

        <p className="mt-3 text-xs leading-relaxed text-muted">{locale === "ar" ? "لا تشارك اسم الطفل الكامل أو المدرسة أو معلومات شخصية حساسة." : "Leave out your child’s full name, school, and sensitive personal details."}</p>
        {aiError && (
         <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="alert"
          className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm"
         >
          {aiError}
         </motion.p>
        )}
       </div>
      </motion.div>
     )}

     {/* ===== AI TAB — RESULTS ===== */}
     {showAiResults && (
      <motion.div
       key="ai-results"
       initial={false}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -20 }}
      >
       {/* Conversation history */}
       <div className="space-y-4 mb-6" role="log" aria-live="polite" aria-label={locale === "ar" ? "المحادثة" : "Conversation"}>
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
           <div className="flex gap-1.5 items-center" role="status">
            <span className="sr-only">{locale === "ar" ? "نراجع إجابتك" : "Reviewing your answer"}</span>
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
           </div>
          </div>
         </div>
        )}
        <div ref={chatBottomRef} />
       </div>

       {/* Profile + Suggested Level */}
       {latestAssistant && !readinessChanged && latestAssistant.assessment?.status !== "needs_information" && (
        <div className="mb-6 p-5 rounded-2xl bg-surface border border-border">
         {suggestedLevel && isJourneyLevel(suggestedLevel) && (
          <SuggestedLevel level={suggestedLevel} locale={locale} />
         )}
         {latestAssistant.assessment && (
          <div className="mb-5 space-y-3" role="status">
           <p className="font-bold text-primary">{latestAssistant.assessment.status === "provisional"
            ? (locale === "ar" ? "اقتراح مبدئي بناءً على إجاباتك" : "Provisional suggestion based on your answers")
            : latestAssistant.assessment.status === "review_required"
             ? (locale === "ar" ? "تحتاج الحالة إلى مراجعة مع المعلم" : "Teacher review needed")
             : (locale === "ar" ? "نحتاج إلى معلومات إضافية" : "More information needed")}</p>
           <ul className="list-disc ps-5 space-y-2 text-sm text-muted">
            {[...latestAssistant.assessment.reasons, ...latestAssistant.assessment.considerations].map(reason => <li key={reason}>{reason}</li>)}
           </ul>
           <p className="text-sm">{latestAssistant.assessment.nextStep}</p>
           {(
            <LocalizedLink href="/free-trial" className="inline-flex font-semibold text-primary underline underline-offset-4">
             {locale === "ar" ? "احجز تجربة مع المعلم" : "Book a trial with a teacher"}
            </LocalizedLink>
           )}
          </div>
         )}
         {latestAssistant.profile && (
          <details className="mt-4 border-t border-border pt-3">
           <summary className="cursor-pointer py-2 text-sm font-medium">{locale === "ar" ? "راجع ما شاركته عن طفلك" : "Review what you shared"}</summary>
           <ProfileSummary profile={latestAssistant.profile} locale={locale} />
          </details>
         )}
        </div>
       )}

       {latestAssistant?.nextQuestion && (
        <ReadinessQuestion question={latestAssistant.nextQuestion} locale={locale} disabled={chatLoading}
         onAnswer={(value, label) => void runAiRecommendation(label, { ...readinessAnswers, [latestAssistant.nextQuestion!.field]: value })} />
       )}
       {!readinessChanged && latestAssistant?.courseAvailability === "no_match" && (
        <p className="mb-6 text-sm text-muted">{locale === "ar" ? "لم نجد حالياً دورة منشورة تطابق المستوى والعمر والخبرة معاً. يساعدك المرشد على اختيار تجربة مناسبة." : "No published course currently matches this level, age and experience together. A learning guide can help choose a suitable activity."}</p>
       )}

       {!readinessChanged && latestAssistant?.courseAvailability === "unavailable" && (
        <p role="status" className="mb-6 text-sm text-muted">{locale === "ar" ? "تعذر تحميل الدورات حالياً. يظل اقتراح المستوى مبدئياً؛ أعد المحاولة لاحقاً أو تواصل مع مرشد التعلّم." : "Courses could not be loaded right now. The level suggestion remains provisional; try again later or contact a learning guide."}</p>
       )}

       {/* Follow-up questions */}
       {latestAssistant?.assessment?.status === "review_required" && latestAssistant.followUpQuestions && latestAssistant.followUpQuestions.length > 0 && (
        <div className="mb-6">
         <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
          {locale === "ar" ? "أسئلة لتحسين التوصية" : "Questions to refine results"}
         </p>
         <div className="flex flex-col gap-2">
          {latestAssistant.followUpQuestions.map((q, i) => (
           <button
            type="button"
            key={i}
            disabled={chatLoading}
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
       {!readinessChanged && aiRecommendedCourses.length > 0 && (
        <>
         <h2 className="text-xl font-bold mb-5">{t("results")}</h2>
         <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {aiRecommendedCourses.map((course, i) => (
           <CourseCard key={course.id} course={course} index={i} />
          ))}
         </div>
        </>
       )}

       {/* Continue chat input */}
       {!chatLoading && (
        <div className="mb-6">
         <div className="relative">
          {pendingQuestion && <p className="mb-2 text-sm font-medium text-foreground">{pendingQuestion}</p>}
          <textarea
           maxLength={2000}
           aria-label={locale === "ar" ? "إجابتك أو سؤالك" : "Your reply or question"}
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
           className="w-full px-5 py-3 pe-14 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary transition-all outline-none resize-none text-sm"
          />
          <button
           type="button"
           aria-label={t("aiSend")}
           onClick={handleAiSubmit}
           disabled={!chatInput.trim() || chatLoading}
           className={`absolute bottom-3 end-3 z-20 p-2 rounded-xl transition-all ${
            chatInput.trim() && !chatLoading
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
           role="alert"
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

    </AnimatePresence>
    <section className="mt-10 border-t border-border pt-6" aria-label={locale === "ar" ? "عن اقتراح المستوى" : "About your level suggestion"}>
     <details className="group">
      <summary className="cursor-pointer py-3 font-semibold focus-visible:outline-2 focus-visible:outline-primary">{locale === "ar" ? "كيف نساعدك على اختيار البداية؟" : "How do we find a starting point?"}</summary>
      <div className="space-y-3 pb-4 text-sm leading-relaxed text-muted">
       <p>{locale === "ar" ? "نستخدم العمر والخبرة وما يستطيع طفلك فعله والدعم الذي يحتاجه لاستكشاف مستوى بداية بين Explorer وBuilder وCreator وInnovator وPro. نطلب فقط المعلومات الناقصة، ويمكنك توضيح إجاباتك أثناء المحادثة." : "We use age, experience, what your child can do, and the support they need to explore a starting level: Explorer, Builder, Creator, Innovator, or Pro. We ask only for missing details, and you can clarify your answers during the conversation."}</p>
       <p>{locale === "ar" ? "الاقتراح نقطة بداية بناءً على ملاحظاتك، وليس اختباراً لقدرات الطفل. يساعد المعلم في تأكيد المستوى المناسب خلال تجربة عملية. لا حاجة إلى خبرة برمجية للمستويات الأولى." : "Your suggestion is a starting point based on your observations, not a test of your child’s abilities. A teacher helps confirm the fit through a practical trial. The early levels need no coding experience."}</p>
       <LocalizedLink href="/learning-path" className="inline-flex font-semibold text-primary underline underline-offset-4">{locale === "ar" ? "استكشف المستويات الخمسة" : "Explore the five learning levels"}</LocalizedLink>
      </div>
     </details>
     <details>
      <summary className="cursor-pointer py-3 font-semibold focus-visible:outline-2 focus-visible:outline-primary">{locale === "ar" ? "ماذا لو لم أعرف الإجابة؟" : "What if I’m not sure of an answer?"}</summary>
      <p className="pb-4 text-sm leading-relaxed text-muted">{locale === "ar" ? "لا بأس! اختر «لست متأكداً بعد». نساعدك على التواصل مع معلم بدلاً من تخمين مستوى لطفلك. تحدث عن طفل واحد في كل محادثة." : "That’s okay! Choose ‘I’m not sure yet’. We’ll point you toward a teacher rather than guess a level for your child. Talk about one child per conversation."}</p>
     </details>
    </section>
   </div>
  </div>
 );
}
