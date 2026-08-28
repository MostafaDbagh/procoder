"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  createExplorerRequest,
  type APICourse,
  type ExplorerAnswerDetail,
} from "@/lib/api";
import { isValidEmail } from "@/lib/validation";
import {
  runExplorerFit,
  type ExplorerAnswers,
  type ExplorerOutcome,
  type AgeValue,
  type LevelAgeBand,
} from "@/lib/explorerFitEngine";
import {
  JOURNEY_LEVEL_META,
  nextLevel,
  type JourneyLevel,
} from "@/data/journeyLevels";
import { LevelCourseCard } from "@/components/journey/LevelCourseCard";
import {
  Compass,
  Blocks,
  Palette,
  Lightbulb,
  Rocket,
  Map as MapIcon,
  Brain,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Send,
  Loader2,
  MessagesSquare,
  Phone,
  ClipboardList,
  ListOrdered,
  Search,
  Wrench,
  Star,
  Info,
  Lock,
} from "lucide-react";

// ── raw i18n shapes ──────────────────────────────────────────
interface HabitPractice {
  name: string;
  tag: string;
  body: string;
}
interface OverviewRow {
  label: string;
  value: string;
}
interface QuestionOption {
  value: string;
  label: string;
}
interface FitQuestion {
  id: keyof ExplorerAnswers;
  question: string;
  options: QuestionOption[];
  optional?: boolean;
}

/**
 * Which level's page this tree is rendering. Supplied once at the root so the
 * deeply nested forms and panels can read the level (for copy and for tagging
 * the submitted request) without threading it through every component.
 */
interface LevelCtx {
  level: JourneyLevel;
  band: LevelAgeBand;
  /** Display name of the level, e.g. "Builder". */
  name: string;
}
const LevelContext = createContext<LevelCtx | null>(null);

function useLevel(): LevelCtx {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error("useLevel must be used inside LevelContext");
  return ctx;
}

/** Level-scoped copy: `journey.levels.<level>.*`. */
function useLevelT() {
  const { level } = useLevel();
  return useTranslations(`journey.levels.${level}`);
}

const LEVEL_ICONS: Record<JourneyLevel, ElementType> = {
  explorer: Compass,
  builder: Blocks,
  creator: Palette,
  innovator: Lightbulb,
  pro: Rocket,
};

type Tab = "overview" | "practice";

const TABS: { key: Tab; icon: ElementType }[] = [
  { key: "overview", icon: MapIcon },
  { key: "practice", icon: Brain },
];

const PRACTICE_ICONS: ElementType[] = [ListOrdered, Search, Wrench, RotateCcw];

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:lvl-border transition-all outline-none";
const inputErrCls =
  "w-full px-4 py-3 rounded-xl bg-background border border-red-400 text-foreground placeholder:text-muted focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all outline-none";
const labelCls = "block text-sm font-medium mb-2";

function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text.split("\n\n").map((p, i) => (
        <p key={i} className={`whitespace-pre-line ${className}`}>
          {p}
        </p>
      ))}
    </>
  );
}

// ── main window ──────────────────────────────────────────────

/** Which of the three join routes the parent picked, if any. */
type ApplyMode = null | "call" | "survey" | "register";

export default function LevelContent({
  level,
  courses,
}: {
  level: JourneyLevel;
  courses: APICourse[];
}) {
  const t = useTranslations("journey");
  const meta = JOURNEY_LEVEL_META[level];
  const name = useTranslations(`journey.levels.${level}`)("meta.name");
  const ctx = useMemo<LevelCtx>(
    () => ({ level, band: { ageMin: meta.ageMin, ageMax: meta.ageMax }, name }),
    [level, meta.ageMin, meta.ageMax, name]
  );

  const [tab, setTab] = useState<Tab>("overview");
  const [mode, setMode] = useState<ApplyMode>(null);

  return (
    <LevelContext.Provider value={ctx}>
      {/* --lvl re-tints this whole page to the level's own colour, so the detail
          page matches the card and stone that led here. */}
      <div
        data-lvl={level}
        style={{ ["--lvl" as string]: meta.accentHex }}
        className="py-10 sm:py-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Lands on the five-stage trail itself, not the top of the page —
              the visitor came from a stone and expects to see the map again. */}
          <LocalizedLink
            href="/learning-path#stages-heading"
            className="group inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full lvl-soft lvl-text font-semibold text-sm hover:lvl-bg hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 rtl:rotate-180 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
            <span>{t("index.levelsHeading")}</span>
          </LocalizedLink>

          <LevelHero />

          {/* The two content tabs */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            {TABS.map(({ key, icon: Icon }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-pressed={active}
                  className={`group flex flex-col items-start gap-2 rounded-2xl border p-4 text-start transition-all ${
                    active
                      ? "lvl-border lvl-bg text-white shadow-lg lvl-shadow"
                      : "border-border bg-surface text-foreground hover:lvl-edge hover:-translate-y-0.5"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      active ? "bg-white/20" : "lvl-soft lvl-text"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold leading-snug">
                    {t(`buttons.${key}`)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {tab === "overview" && <OverviewPanel />}
                {tab === "practice" && <PracticePanel />}
              </motion.div>
            </AnimatePresence>
          </div>

          <LevelCourses courses={courses} />

          <ApplySection mode={mode} setMode={setMode} />

          <NextLevelCard />
        </div>
      </div>
    </LevelContext.Provider>
  );
}

function LevelHero() {
  const tl = useLevelT();
  const { level } = useLevel();
  const meta = JOURNEY_LEVEL_META[level];
  const Icon = LEVEL_ICONS[level];
  return (
    <div className="relative overflow-hidden rounded-3xl border lvl-edge bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 p-7 dark:lvl-edge dark:from-violet-950/40 dark:via-slate-900 dark:to-slate-900 sm:p-10">
      <div className="pointer-events-none absolute -top-10 -end-10 h-40 w-40 rounded-full lvl-faint" />
      <div className="pointer-events-none absolute -bottom-12 -start-8 h-48 w-48 rounded-full lvl-faint" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute end-6 top-6 lvl-text-80"
        animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-7 w-7" />
      </motion.div>

      <div className="relative flex items-center gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-white shadow-lg`}
        >
          <Icon className="h-9 w-9" />
        </div>
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full lvl-soft px-3 py-1 text-xs font-semibold lvl-text">
            <Star className="h-3.5 w-3.5" /> {tl("meta.ages")}
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {tl("meta.name")}
          </h1>
          <p className="mt-1 text-sm font-medium text-muted sm:text-base">
            {tl("meta.tagline")}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Tab 1 — Journey overview ─────────────────────────────────
function OverviewPanel() {
  const tl = useLevelT();
  const rows = tl.raw("overview.rows") as OverviewRow[];
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] lvl-text-80">
        {tl("overview.sectionLabel")}
      </p>
      <div className="mt-3 space-y-3 leading-relaxed text-muted">
        <p>{tl("overview.intro1")}</p>
        <p>{tl("overview.intro2")}</p>
      </div>

      <dl className="mt-6 overflow-hidden rounded-xl border border-border">
        {rows.map((r, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:gap-4 ${
              i % 2 ? "bg-background/40" : "bg-surface"
            } ${i > 0 ? "border-t border-border" : ""}`}
          >
            <dt className="text-sm font-semibold text-foreground sm:w-56 sm:shrink-0">
              {r.label}
            </dt>
            <dd className="text-sm text-muted">{r.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 rounded-xl border-s-4 lvl-border lvl-faint p-4 font-medium leading-relaxed text-foreground">
        {tl("overview.closing")}
      </p>
    </section>
  );
}

// ── Tab 2 — What the child practices ─────────────────────────
function PracticePanel() {
  const tl = useLevelT();
  const habits = tl.raw("practice.habits") as HabitPractice[];
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] lvl-text-80">
          {tl("practice.sectionLabel")}
        </p>
        <p className="mt-3 text-lg font-semibold">{tl("practice.intro1")}</p>
        <p className="mt-2 text-muted leading-relaxed">{tl("practice.intro2")}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {habits.map((h, i) => {
          const Icon = PRACTICE_ICONS[i] || Sparkles;
          return (
            <section key={i} className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl lvl-soft lvl-text">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold leading-tight">{h.name}</h3>
                  <p className="text-xs font-medium lvl-text">“{h.tag}”</p>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                <Paragraphs text={h.body} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ── Courses that belong to this level ────────────────────────
function LevelCourses({ courses }: { courses: APICourse[] }) {
  const t = useTranslations("journey");
  return (
    <section className="mt-10">
      <h2 className="text-xl font-extrabold tracking-tight">
        {t("apply.coursesHeading")}
      </h2>
      {courses.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-border bg-surface p-6 text-sm leading-relaxed text-muted">
          {t("apply.coursesEmpty")}
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("apply.coursesIntro")}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {courses.map((c) => (
              <LevelCourseCard key={c.slug} course={c} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

// ── The three ways to join this level ────────────────────────
function ApplySection({
  mode,
  setMode,
}: {
  mode: ApplyMode;
  setMode: (m: ApplyMode) => void;
}) {
  const t = useTranslations("journey");

  if (mode === "call") {
    return (
      <ApplyFrame>
        <ContactForm outcome="" answers={[]} onBack={() => setMode(null)} onSubmitted={() => {}} />
      </ApplyFrame>
    );
  }
  if (mode === "register") {
    return (
      <ApplyFrame>
        <RegisterForm outcome="" answers={[]} onBack={() => setMode(null)} onSubmitted={() => {}} />
      </ApplyFrame>
    );
  }
  if (mode === "survey") {
    return (
      <ApplyFrame>
        <StartJourney onExit={() => setMode(null)} />
      </ApplyFrame>
    );
  }

  const options = [
    { key: "call" as const, icon: Phone, title: "callTitle", body: "callBody", cta: "callCta" },
    { key: "survey" as const, icon: ClipboardList, title: "surveyTitle", body: "surveyBody", cta: "surveyCta" },
    { key: "register" as const, icon: Rocket, title: "registerTitle", body: "registerBody", cta: "registerCta" },
  ];

  return (
    <section id="join" className="mt-12 scroll-mt-24">
      <p className="text-xs font-bold uppercase tracking-[0.2em] lvl-text-80">
        {t("apply.sectionLabel")}
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight">{t("apply.title")}</h2>
      <p className="mt-2 leading-relaxed text-muted">{t("apply.intro")}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {options.map(({ key, icon: Icon, title, body, cta }) => (
          <div
            key={key}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:lvl-edge hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl lvl-soft lvl-text">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-bold leading-tight">{t(`apply.${title}`)}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {t(`apply.${body}`)}
            </p>
            <button
              type="button"
              onClick={() => setMode(key)}
              className="group mt-5 inline-flex items-center justify-center gap-2 rounded-full lvl-bg px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              {t(`apply.${cta}`)}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApplyFrame({ children }: { children: React.ReactNode }) {
  return (
    <section id="join" className="mt-12 scroll-mt-24">
      {children}
    </section>
  );
}

// ── What comes after this level ──────────────────────────────
function NextLevelCard() {
  const t = useTranslations("journey");
  const { level, name } = useLevel();
  const next = nextLevel(level);
  const nextName = useTranslations("journey.levels")(
    next ? `${next}.meta.name` : `${level}.meta.name`
  );

  if (!next) {
    return (
      <section className="mt-12 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-bold">{t("apply.nextHeading")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t("apply.lastLevel")}</p>
      </section>
    );
  }

  return (
    <section className="mt-12 rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-bold">{t("apply.nextHeading")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {t("apply.nextBody", { level: name, next: nextName })}
      </p>
      <LocalizedLink
        href={`/learning-path/${next}`}
        className="group mt-4 inline-flex items-center gap-2 rounded-full lvl-soft px-5 py-2.5 text-sm font-bold lvl-text transition-all hover:lvl-bg hover:text-white"
      >
        {t("apply.nextCta", { next: nextName })}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
      </LocalizedLink>
    </section>
  );
}

// ── Button 4 — Start the journey ─────────────────────────────
type StartStage = "intro" | "quiz" | "result" | "contact" | "register";

/** Quiz progress survives tab switches, stray taps, and reloads. Scoped per
 *  level so answers given for one stage never resurface on another. */
const fitStorageKey = (level: JourneyLevel) => `journey-fit-${level}-v1`;

interface PersistedFitState {
  answers: Record<string, string>;
  notes: string;
  qIndex: number;
  stage: StartStage;
}

/**
 * Read saved quiz progress. Safe to call in state initializers: StartJourney
 * only mounts on user interaction (the window's default tab is Parent message),
 * so it never takes part in SSR hydration.
 */
function loadFitState(level: JourneyLevel): PersistedFitState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(fitStorageKey(level));
    if (!raw) return null;
    const p = JSON.parse(raw) as {
      v?: number;
      answers?: Record<string, string>;
      notes?: string;
      qIndex?: number;
      stage?: StartStage;
    };
    if (p?.v !== 1) return null;
    // Form inputs aren't persisted — land back on the result screen instead.
    const rawStage =
      p.stage === "contact" || p.stage === "register" ? "result" : p.stage;
    return {
      answers:
        p.answers && typeof p.answers === "object" ? p.answers : {},
      notes: typeof p.notes === "string" ? p.notes : "",
      qIndex: typeof p.qIndex === "number" ? p.qIndex : 0,
      stage: rawStage === "quiz" || rawStage === "result" ? rawStage : "intro",
    };
  } catch {
    return null; // corrupted state — start fresh
  }
}

function StartJourney({ onExit }: { onExit: () => void }) {
  const { level, band, name: levelName } = useLevel();
  const t = useTranslations("journey");
  const rawQuestions = t.raw("start.questions") as FitQuestion[];
  // The age question's options are generated from this level's own band, so the
  // same nine questions work for Explorer (5-8) and Pro (13-18) alike.
  const questions = useMemo<FitQuestion[]>(() => {
    const years: QuestionOption[] = [];
    for (let a = band.ageMin; a <= band.ageMax; a++) {
      years.push({ value: String(a), label: t("start.ageOptions.year", { n: a }) });
    }
    const ageOptions: QuestionOption[] = [
      { value: "below", label: t("start.ageOptions.under", { n: band.ageMin }) },
      ...years,
      { value: "above", label: t("start.ageOptions.above", { n: band.ageMax + 1 }) },
    ];
    return rawQuestions.map((q) =>
      q.id === "age" ? { ...q, options: ageOptions } : q
    );
  }, [rawQuestions, band.ageMin, band.ageMax, t]);
  const total = questions.length;

  // Restore saved progress once, via lazy initializers (see loadFitState note).
  const [persisted] = useState(() => loadFitState(level));
  const [stage, setStage] = useState<StartStage>(persisted?.stage ?? "intro");
  const [qIndex, setQIndex] = useState(() =>
    Math.min(Math.max(persisted?.qIndex ?? 0, 0), total - 1)
  );
  const [answers, setAnswers] = useState<Record<string, string>>(
    persisted?.answers ?? {}
  );
  const [notes, setNotes] = useState(persisted?.notes ?? "");
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Keep progress saved so a stray tap or reload never wipes the answers.
  useEffect(() => {
    if (submitted) return;
    try {
      window.localStorage.setItem(
        fitStorageKey(level),
        JSON.stringify({ v: 1, answers, notes, qIndex, stage })
      );
    } catch {
      // storage unavailable (e.g. private mode) — non-fatal
    }
  }, [submitted, answers, notes, qIndex, stage, level]);

  /** Called by the forms after a successful submission. */
  const markSubmitted = () => {
    setSubmitted(true);
    try {
      window.localStorage.removeItem(fitStorageKey(level));
    } catch {
      // ignore
    }
  };

  // All 9 answers with question text + chosen label — sent with both request types.
  const answersDetail = useMemo<ExplorerAnswerDetail[]>(() => {
    const detail = questions
      .filter((q) => q.id !== "additional_notes")
      .map((q) => {
        const value = answers[q.id as string] || "";
        return {
          id: q.id as string,
          question: q.question,
          value,
          label: q.options.find((o) => o.value === value)?.label || "",
        };
      });
    const notesQ = questions.find((q) => q.id === "additional_notes");
    const trimmed = notes.trim();
    if (notesQ && trimmed) {
      detail.push({
        id: "additional_notes",
        question: notesQ.question,
        value: "",
        label: trimmed.slice(0, 300),
      });
    }
    return detail;
  }, [questions, answers, notes]);

  const engineInput: ExplorerAnswers = useMemo(
    () => ({
      age: answers.age as AgeValue | undefined,
      story_visual_response: answers.story_visual_response,
      new_task_behavior: answers.new_task_behavior,
      support_after_unsuccessful_attempt: answers.support_after_unsuccessful_attempt,
      expression_support: answers.expression_support,
      previous_learning_experience: answers.previous_learning_experience,
      online_session_interaction: answers.online_session_interaction,
      entry_style_new_activity: answers.entry_style_new_activity,
      additional_notes: notes,
    }),
    [answers, notes]
  );

  const result = useMemo(() => runExplorerFit(engineInput, band), [engineInput, band]);

  const current = questions[qIndex];
  const isLast = qIndex === total - 1;

  function pick(qid: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setAttempted(false);
    if (qIndex < total - 1) setQIndex(qIndex + 1);
  }

  function next() {
    if (!current.optional && !answers[current.id as string]) {
      setAttempted(true);
      return;
    }
    if (isLast) {
      setStage("result");
      return;
    }
    setAttempted(false);
    setQIndex(qIndex + 1);
  }

  function back() {
    if (qIndex === 0) {
      setStage("intro");
      return;
    }
    setAttempted(false);
    setQIndex(qIndex - 1);
  }

  function retake() {
    setAnswers({});
    setNotes("");
    setQIndex(0);
    setAttempted(false);
    setSubmitted(false);
    setStage("quiz");
  }

  // ---- intro ----
  if (stage === "intro") {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] lvl-text-80">
          {t("start.sectionLabel")}
        </p>
        <h2 className="mt-2 text-xl font-bold">{t("start.leadTitle")}</h2>
        <p className="mt-2 leading-relaxed text-muted">
          {t("start.lead", { level: levelName })}
        </p>

        <div className="mt-6 rounded-xl border border-border bg-background/40 p-5">
          <h3 className="font-bold">{t("start.fitTitle", { level: levelName })}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t("start.fitIntro")}</p>
        </div>

        <button
          type="button"
          onClick={() => setStage("quiz")}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl lvl-bg px-7 py-3 font-semibold text-white shadow-lg lvl-shadow transition-transform hover:scale-[1.02]"
        >
          {t("start.beginCta")}
          <ChevronRight className="h-5 w-5 rtl:rotate-180" />
        </button>
      </section>
    );
  }

  // ---- quiz ----
  if (stage === "quiz") {
    const progress = ((qIndex + 1) / total) * 100;
    return (
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        {/* progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
            <span>{t("start.questionProgress", { n: qIndex + 1, total })}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full lvl-bg"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id as string}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
          >
            <h3 className="text-lg font-bold leading-snug">{current.question}</h3>

            {current.id === "additional_notes" ? (
              <div className="mt-4">
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("start.notesPlaceholder")}
                  className={`${inputCls} resize-none`}
                />
                <p className="mt-1 text-xs text-muted">{t("start.optionalHint")}</p>
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{t("start.privacyReminder")}</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2.5">
                {current.options.map((o) => {
                  const selected = answers[current.id as string] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => pick(current.id as string, o.value)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-start text-sm font-medium transition-all ${
                        selected
                          ? "lvl-border lvl-soft text-foreground"
                          : "border-border bg-background hover:lvl-edge"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected ? "lvl-border lvl-bg" : "border-border"
                        }`}
                      >
                        {selected && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </span>
                      {o.label}
                    </button>
                  );
                })}
                {attempted && !answers[current.id as string] && (
                  <p className="text-xs font-medium text-red-500">{t("start.chooseOne")}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* nav */}
        <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted transition-all hover:text-foreground hover:lvl-edge"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("start.back")}
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl lvl-bg px-6 py-2.5 text-sm font-semibold text-white shadow-md lvl-shadow-sm transition-all hover:scale-[1.02]"
          >
            {isLast ? t("start.seeResult") : t("start.next")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
      </section>
    );
  }

  // ---- result ----
  if (stage === "result") {
    return (
      <ResultPanel
        outcome={result.outcome}
        privacyFlag={result.privacyFlag}
        onRegister={() => setStage("register")}
        onContact={() => setStage("contact")}
        onBack={onExit}
        onRetake={retake}
      />
    );
  }

  // ---- contact ----
  if (stage === "contact") {
    return (
      <ContactForm
        outcome={result.outcome}
        answers={answersDetail}
        onBack={() => setStage("result")}
        onSubmitted={markSubmitted}
      />
    );
  }

  // ---- register ----
  return (
    <RegisterForm
      outcome={result.outcome}
      answers={answersDetail}
      onBack={() => setStage("result")}
      onSubmitted={markSubmitted}
    />
  );
}

// ── Recommendation result ────────────────────────────────────
function ResultPanel({
  outcome,
  privacyFlag,
  onRegister,
  onContact,
  onBack,
  onRetake,
}: {
  outcome: ExplorerOutcome;
  privacyFlag: boolean;
  onRegister: () => void;
  onContact: () => void;
  onBack: () => void;
  onRetake: () => void;
}) {
  const t = useTranslations("journey");
  const { name } = useLevel();
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full lvl-soft px-3 py-1 text-xs font-bold lvl-text">
        <Sparkles className="h-3.5 w-3.5" />
        {t("start.result.kicker")}
      </span>
      <p className="mt-3 text-sm text-muted">{t("start.result.thanks")}</p>

      <h2 className="mt-2 text-2xl font-extrabold leading-snug">
        {t(`start.result.outcomes.${outcome}.title`, { level: name })}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-muted">
        <Paragraphs text={t(`start.result.outcomes.${outcome}.body`, { level: name })} />
      </div>

      {privacyFlag && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("start.result.privacyNote")}</span>
        </div>
      )}

      <div className="mt-5 flex items-start gap-2 rounded-xl border-s-4 lvl-edge lvl-faint p-4 text-sm text-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 lvl-text" />
        <span>{t("start.result.disclaimer")}</span>
      </div>

      {/* Payment trust — deferred */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-background/50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        <div>
          <p className="text-sm font-semibold">{t("start.payment.title")}</p>
          <div className="mt-1 space-y-2 text-xs leading-relaxed text-muted">
            <Paragraphs text={t("start.payment.text")} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRegister}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl lvl-bg px-5 py-3 font-semibold text-white shadow-md lvl-shadow-sm transition-transform hover:scale-[1.02]"
        >
          <Rocket className="h-4 w-4" />
          {t("start.result.register")}
        </button>
        <button
          type="button"
          onClick={onContact}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border lvl-edge lvl-faint px-5 py-3 font-semibold lvl-text transition-colors hover:lvl-soft"
        >
          <MessagesSquare className="h-4 w-4" />
          {t("start.result.contact")}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("start.result.back")}
        </button>
      </div>

      <button
        type="button"
        onClick={onRetake}
        className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-medium text-muted hover:lvl-text"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {t("start.result.retake")}
      </button>
    </section>
  );
}

// ── shared segmented control (method / time) ─────────────────
function Segmented({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: boolean;
}) {
  return (
    <div>
      <label className={labelCls}>{label} *</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              value === o.value
                ? "lvl-bg text-white shadow-sm lvl-shadow-sm"
                : "border border-border bg-background text-muted hover:lvl-edge"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-500">{label}</p>}
    </div>
  );
}

function FormSuccess({
  title,
  body,
  showPayment,
}: {
  title: string;
  body: string;
  showPayment?: boolean;
}) {
  const t = useTranslations("journey");
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 16 }}
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40"
      >
        <CheckCircle2 className="h-9 w-9 text-emerald-500" />
      </motion.div>
      <h2 className="text-xl font-extrabold">{title}</h2>
      <div className="mx-auto mt-3 max-w-md space-y-2 text-sm leading-relaxed text-muted">
        <Paragraphs text={body} />
      </div>
      {showPayment && (
        <div className="mx-auto mt-5 flex max-w-md items-start gap-3 rounded-xl border border-border bg-background/50 p-4 text-start">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <div>
            <p className="text-sm font-semibold">{t("start.payment.title")}</p>
            <div className="mt-1 space-y-2 text-xs leading-relaxed text-muted">
              <Paragraphs text={t("start.payment.text")} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Contact form (short call request) ────────────────────────
function ContactForm({
  outcome,
  answers,
  onBack,
  onSubmitted,
}: {
  /** "" when the parent skipped the fit check and applied directly. */
  outcome: ExplorerOutcome | "";
  answers: ExplorerAnswerDetail[];
  onBack: () => void;
  onSubmitted: () => void;
}) {
  const t = useTranslations("journey");
  const { level } = useLevel();
  const locale = useLocale();
  const [loadedAt] = useState(() => Date.now());
  const [hp, setHp] = useState("");
  const [form, setForm] = useState({
    parentName: "",
    email: "",
    handle: "",
    method: "",
    time: "",
    note: "",
  });
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const emailValid = isValidEmail(form.email);
  const valid =
    form.parentName.trim() && emailValid && form.method && form.time;

  const methodOpts = [
    { value: "whatsapp", label: t("start.method.whatsapp") },
    { value: "call", label: t("start.method.call") },
    { value: "email", label: t("start.method.email") },
  ];
  const timeOpts = [
    { value: "morning", label: t("start.time.morning") },
    { value: "afternoon", label: t("start.time.afternoon") },
    { value: "evening", label: t("start.time.evening") },
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      setAttempted(true);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createExplorerRequest({
        type: "call_request",
        level,
        locale,
        parentName: form.parentName.trim(),
        email: form.email.trim(),
        phone: form.handle.trim() || undefined,
        preferredMethod: form.method,
        preferredTime: form.time,
        note: form.note.trim() || undefined,
        fitOutcome: outcome,
        answers,
        _hp: hp,
        _t: loadedAt,
      });
      onSubmitted();
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("start.errors.submit"));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <FormSuccess
        title={t("start.contactForm.successTitle")}
        body={t("start.contactForm.successBody")}
      />
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <BackLink onBack={onBack} label={t("start.back")} />
      <h2 className="mt-3 text-xl font-bold">{t("start.contactForm.title")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t("start.contactForm.intro")}</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Honeypot hp={hp} setHp={setHp} id="explorer-contact-hp" />
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>{t("start.contactForm.parentName")} *</label>
            <input
              type="text"
              value={form.parentName}
              onChange={(e) => set("parentName", e.target.value)}
              className={attempted && !form.parentName.trim() ? inputErrCls : inputCls}
            />
            {attempted && !form.parentName.trim() && (
              <p className="mt-1 text-xs text-red-500">{t("start.errors.required")}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>{t("start.contactForm.email")} *</label>
            <input
              type="email"
              dir="ltr"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={attempted && !emailValid ? inputErrCls : inputCls}
            />
            {attempted && !emailValid && (
              <p className="mt-1 text-xs text-red-500">{t("start.errors.email")}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelCls}>{t("start.contactForm.handle")}</label>
          <input
            type="text"
            dir="ltr"
            value={form.handle}
            onChange={(e) => set("handle", e.target.value)}
            className={inputCls}
          />
        </div>

        <Segmented
          label={t("start.method.label")}
          value={form.method}
          onChange={(v) => set("method", v)}
          options={methodOpts}
          error={attempted && !form.method}
        />
        <Segmented
          label={t("start.time.label")}
          value={form.time}
          onChange={(v) => set("time", v)}
          options={timeOpts}
          error={attempted && !form.time}
        />

        <div>
          <label className={labelCls}>{t("start.contactForm.note")}</label>
          <textarea
            rows={2}
            value={form.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder={t("start.contactForm.notePlaceholder")}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("start.privacyReminder")}</span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl lvl-bg px-6 py-3 font-semibold text-white shadow-md lvl-shadow-sm transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {submitting ? t("start.contactForm.submitting") : t("start.contactForm.submit")}
        </button>
      </form>
    </section>
  );
}

// ── Registration form (join request) ─────────────────────────
function RegisterForm({
  outcome,
  answers,
  onBack,
  onSubmitted,
}: {
  /** "" when the parent skipped the fit check and applied directly. */
  outcome: ExplorerOutcome | "";
  answers: ExplorerAnswerDetail[];
  onBack: () => void;
  onSubmitted: () => void;
}) {
  const t = useTranslations("journey");
  const { level, name: levelName } = useLevel();
  const locale = useLocale();
  const [loadedAt] = useState(() => Date.now());
  const [hp, setHp] = useState("");
  const ageAnswer = answers.find((a) => a.id === "age")?.value;
  const numericAge = ageAnswer && /^\d+$/.test(ageAnswer) ? ageAnswer : "";
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    childName: "",
    childAge: numericAge,
    language: "",
    method: "",
    time: "",
    note: "",
    consent: false,
  });
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));
  const emailValid = isValidEmail(form.email);
  const valid =
    form.fullName.trim() &&
    form.phone.trim() &&
    emailValid &&
    form.childName.trim() &&
    form.childAge &&
    form.consent;

  const langOpts = [
    { value: "ar", label: t("start.registerForm.langArabic") },
    { value: "en", label: t("start.registerForm.langEnglish") },
    { value: "both", label: t("start.registerForm.langBoth") },
  ];
  const methodOpts = [
    { value: "whatsapp", label: t("start.method.whatsapp") },
    { value: "call", label: t("start.method.call") },
    { value: "email", label: t("start.method.email") },
  ];
  const timeOpts = [
    { value: "morning", label: t("start.time.morning") },
    { value: "afternoon", label: t("start.time.afternoon") },
    { value: "evening", label: t("start.time.evening") },
  ];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      setAttempted(true);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createExplorerRequest({
        type: "registration",
        level,
        locale,
        parentName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        childName: form.childName.trim(),
        childAge: form.childAge,
        childLanguage: form.language || undefined,
        preferredMethod: form.method || undefined,
        preferredTime: form.time || undefined,
        note: form.note.trim() || undefined,
        fitOutcome: outcome,
        answers,
        consent: form.consent,
        _hp: hp,
        _t: loadedAt,
      });
      onSubmitted();
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("start.errors.submit"));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <FormSuccess
        title={t("start.registerForm.successTitle")}
        body={t("start.registerForm.successBody")}
        showPayment
      />
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <BackLink onBack={onBack} label={t("start.back")} />
      <h2 className="mt-3 text-xl font-bold">{t("start.registerForm.title", { level: levelName })}</h2>
      <p className="mt-1 text-sm font-medium text-muted">{t("start.registerForm.functionNote")}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{t("start.registerForm.intro", { level: levelName })}</p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <Honeypot hp={hp} setHp={setHp} id="explorer-register-hp" />
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Parent */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-bold text-foreground">
            {t("start.registerForm.parentSection")}
          </legend>
          <div>
            <label className={labelCls}>{t("start.registerForm.fullName")} *</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              className={attempted && !form.fullName.trim() ? inputErrCls : inputCls}
            />
            {attempted && !form.fullName.trim() && (
              <p className="mt-1 text-xs text-red-500">{t("start.errors.required")}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{t("start.registerForm.phone")} *</label>
              <input
                type="tel"
                dir="ltr"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={attempted && !form.phone.trim() ? inputErrCls : inputCls}
              />
              {attempted && !form.phone.trim() && (
                <p className="mt-1 text-xs text-red-500">{t("start.errors.required")}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>{t("start.registerForm.email")} *</label>
              <input
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={attempted && !emailValid ? inputErrCls : inputCls}
              />
              {attempted && !emailValid && (
                <p className="mt-1 text-xs text-red-500">{t("start.errors.email")}</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Child */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-bold text-foreground">
            {t("start.registerForm.childSection")}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{t("start.registerForm.childName")} *</label>
              <input
                type="text"
                value={form.childName}
                onChange={(e) => set("childName", e.target.value)}
                className={attempted && !form.childName.trim() ? inputErrCls : inputCls}
              />
              {attempted && !form.childName.trim() && (
                <p className="mt-1 text-xs text-red-500">{t("start.errors.required")}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>{t("start.registerForm.childAge")} *</label>
              <select
                value={form.childAge}
                onChange={(e) => set("childAge", e.target.value)}
                className={`${attempted && !form.childAge ? inputErrCls : inputCls} appearance-none`}
              >
                <option value="">—</option>
                {["4", "5", "6", "7", "8", "9"].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {attempted && !form.childAge && (
                <p className="mt-1 text-xs text-red-500">{t("start.errors.required")}</p>
              )}
            </div>
          </div>
          <Segmented
            label={t("start.registerForm.language")}
            value={form.language}
            onChange={(v) => set("language", v)}
            options={langOpts}
          />
        </fieldset>

        {/* Follow-up */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-bold text-foreground">
            {t("start.registerForm.followSection")}
          </legend>
          <Segmented
            label={t("start.method.label")}
            value={form.method}
            onChange={(v) => set("method", v)}
            options={methodOpts}
          />
          <Segmented
            label={t("start.time.label")}
            value={form.time}
            onChange={(v) => set("time", v)}
            options={timeOpts}
          />
          <div>
            <label className={labelCls}>{t("start.registerForm.note")}</label>
            <textarea
              rows={2}
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder={t("start.registerForm.notePlaceholder")}
              className={`${inputCls} resize-none`}
            />
          </div>
        </fieldset>

        <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("start.privacyReminder")}</span>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border lvl-accent"
          />
          <span className="text-sm leading-relaxed text-muted">
            {t("start.registerForm.consent", { level: levelName })} *
          </span>
        </label>
        {attempted && !form.consent && (
          <p className="text-xs font-medium text-red-500">{t("start.errors.consent")}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl lvl-bg px-6 py-3 font-semibold text-white shadow-md lvl-shadow-sm transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          {submitting ? t("start.registerForm.submitting") : t("start.registerForm.submit")}
        </button>
      </form>
    </section>
  );
}

// ── small shared bits ────────────────────────────────────────
function BackLink({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:lvl-text"
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
      {label}
    </button>
  );
}

function Honeypot({
  hp,
  setHp,
  id,
}: {
  hp: string;
  setHp: (v: string) => void;
  id: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}
    >
      <label htmlFor={id}>Leave this empty</label>
      <input
        id={id}
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
      />
    </div>
  );
}
