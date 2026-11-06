"use client";

import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { BrainPattern } from "@/components/BrainPatterns";
import { Compass, Baby, Lightbulb, Hammer, Brain, TrendingUp, GraduationCap, Gauge, MessageSquareText, Users, CalendarClock, ShieldCheck, ChevronRight, ChevronDown } from "lucide-react";

type QuestionId = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9" | "q10" | "q11" | "q12";

const NAVY = "#16234F";
const LAVENDER = "#8B6CFF";
const LAVENDER_SOFT = "#B8A7FF";
const SLATE = "#3F4868";


type IconType = typeof Compass;

const MAIN_QUESTIONS: Array<{ id: QuestionId; icon: IconType; tone: string }> = [
  { id: "q1", icon: Compass, tone: "#8B6CFF" },
  { id: "q2", icon: Baby, tone: "#54C7A6" },
  { id: "q3", icon: Lightbulb, tone: "#F6A646" },
  { id: "q4", icon: Hammer, tone: "#5D8CFF" },
  { id: "q5", icon: Brain, tone: "#F08AC8" },
  { id: "q6", icon: TrendingUp, tone: "#7D63F6" },
];

const MORE_QUESTIONS: Array<{ id: QuestionId; icon: IconType }> = [
  { id: "q7", icon: GraduationCap },
  { id: "q8", icon: Gauge },
  { id: "q9", icon: MessageSquareText },
  { id: "q10", icon: Users },
  { id: "q11", icon: CalendarClock },
  { id: "q12", icon: ShieldCheck },
];

export function ParentQuestions() {
 const t = useTranslations("parentQuestions");
 const renderQuestion = ({ id, icon: Icon }: { id: QuestionId; icon: IconType }) => (
  <details key={id} className="group self-start rounded-2xl border border-border bg-white p-4 sm:p-5">
   <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl text-start font-semibold text-base sm:text-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden" style={{ color: NAVY }}>
    <Icon aria-hidden="true" className="h-5 w-5 shrink-0" style={{ color: LAVENDER }} />
    <span className="flex-1">{t(`${id}.question`)}</span>
    <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
   </summary>
   <p className="mt-4 whitespace-pre-line text-base leading-relaxed" style={{ color: SLATE }}>{t(`${id}.answer`)}</p>
  </details>
 );
 return (
  <section className="relative isolate overflow-hidden bg-white py-20 lg:py-28">
   <BrainPattern variant="question" />
   <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <div className="mb-10 text-center sm:mb-14">
     <h2 className="mb-4 font-display text-[28px] font-extrabold leading-tight md:text-[36px]" style={{ color: NAVY }}>{t("sectionTitle")}</h2>
     <div className="mx-auto mb-5 h-1 w-16 rounded-full" style={{ backgroundColor: LAVENDER }} />
     <p className="mx-auto max-w-2xl text-lg text-muted">{t("sectionSubtitle")}</p>
    </div>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 sm:gap-4">{MAIN_QUESTIONS.map(renderQuestion)}</div>
    <details className="mx-auto mt-10 max-w-3xl rounded-2xl border border-dashed p-4 sm:p-6" style={{ borderColor: LAVENDER_SOFT }}>
     <summary className="cursor-pointer rounded-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" style={{ color: NAVY }}>{t("anotherConcern")}</summary>
     <div className="mt-4 space-y-3">{MORE_QUESTIONS.map(renderQuestion)}</div>
    </details>
    <div className="mt-8 text-center">
     <p className="mb-4 text-muted">{t("startingPointCheck")}</p>
     <LocalizedLink href="/recommend" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white">
      {t("ctaStartCheck")}<ChevronRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
     </LocalizedLink>
    </div>
    <div className="mt-12 text-center sm:mt-16">
     <h3 className="mb-2 font-display text-2xl font-bold" style={{ color: NAVY }}>{t("faqLinkTitle")}</h3>
     <p className="mx-auto mb-5 max-w-md text-muted">{t("faqLinkSubtitle")}</p>
     <LocalizedLink href="/faq" className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-semibold text-primary">{t("faqLinkCta")}<ChevronRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" /></LocalizedLink>
    </div>
   </div>
  </section>
 );
}
