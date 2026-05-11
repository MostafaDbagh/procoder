"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { LocalizedLink } from "@/components/LocalizedLink";
import { BrainPattern } from "@/components/BrainPatterns";
import {
  Compass,
  Baby,
  Lightbulb,
  Hammer,
  Brain,
  TrendingUp,
  GraduationCap,
  Gauge,
  MessageSquareText,
  Users,
  CalendarClock,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Check,
  HelpCircle,
} from "lucide-react";

type QuestionId = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8" | "q9" | "q10" | "q11" | "q12";

const NAVY = "#16234F";
const LAVENDER = "#8B6CFF";
const LAVENDER_SOFT = "#B8A7FF";
const SLATE = "#3F4868";
const SECTION_BG = "#FAF8FF";

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
  const [selected, setSelected] = useState<QuestionId | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openMoreItem, setOpenMoreItem] = useState<QuestionId | null>(null);

  return (
    <section
      className="relative isolate overflow-hidden py-28 sm:py-20 lg:py-28"
      style={{ backgroundColor: 'white' }}
    >
      <BrainPattern variant="question" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="font-display font-extrabold leading-tight tracking-tight text-[28px] sm:text-[28px] md:text-[36px] lg:text-[36px] mb-4"
            style={{ color: NAVY }}
          >
            {t("sectionTitle")}
          </h2>
          <div
            className="h-1 w-16 mx-auto rounded-full mb-5"
            style={{ backgroundColor: LAVENDER }}
          />
          <p
            className="text-muted text-lg max-w-2xl mx-auto"
          
          >
            {t("sectionSubtitle")}
          </p>
        </div>

        {/* 6 main buttons — 2×3 on desktop, 1col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {MAIN_QUESTIONS.map(({ id, icon: Icon, tone }) => {
            const isSelected = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(isSelected ? null : id)}
                aria-pressed={isSelected}
                aria-label={t(`${id}.question`)}
                className="group relative flex items-center gap-3 sm:gap-4 w-full text-left rounded-full px-4 sm:px-5 py-3 sm:py-4 bg-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  border: `1.5px solid ${isSelected ? LAVENDER : LAVENDER_SOFT + "55"}`,
                  boxShadow: isSelected
                    ? `0 0 0 4px ${LAVENDER}22, 0 8px 24px -8px ${LAVENDER}55`
                    : "0 2px 6px rgba(22,35,79,0.04), 0 1px 2px rgba(22,35,79,0.02)",
                }}
              >
                {/* Left icon */}
                <span
                  className="shrink-0 inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full"
                  style={{ backgroundColor: tone + "1f", color: tone }}
                >
                  <Icon className="w-5 h-5" />
                </span>

                {/* Question text */}
                <span
                  className="flex-1 font-semibold text-[16px] sm:text-[18px] lg:text-[20px] leading-snug"
                  style={{ color: NAVY }}
                >
                  {t(`${id}.question`)}
                </span>

                {/* Right indicator */}
                {isSelected ? (
                  <span
                    className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full"
                    style={{ backgroundColor: LAVENDER, color: "white" }}
                  >
                    <Check className="w-4 h-4" />
                  </span>
                ) : (
                  <ChevronRight
                    className="shrink-0 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: LAVENDER }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Result panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-6 sm:mt-8 rounded-3xl bg-white p-6 sm:p-8 lg:p-10"
              style={{
                border: `1.5px solid ${LAVENDER_SOFT}`,
                boxShadow: `0 16px 40px -16px ${LAVENDER}33`,
              }}
            >
              <div
                className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2"
                style={{ color: LAVENDER }}
              >
                {t("resultTitle")}
              </div>
              <h3
                className="font-display font-extrabold text-[22px] sm:text-[26px] lg:text-[30px] leading-snug mb-4"
                style={{ color: NAVY }}
              >
                {t(`${selected}.question`)}
              </h3>
              <p
                className="text-[16px] sm:text-[17px] lg:text-[18px] leading-relaxed mb-6 whitespace-pre-line"
                style={{ color: SLATE }}
              >
                {t(`${selected}.answer`)}
              </p>
              <div
                className="text-sm font-semibold mb-2"
                style={{ color: LAVENDER }}
              >
                {t("suggestedDirection")}
              </div>
              <div
                className="text-[15px] sm:text-[16px] mb-6"
                style={{ color: NAVY }}
              >
                {t("startingPointCheck")}
              </div>
              <LocalizedLink
                href="/recommend"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: LAVENDER,
                  boxShadow: `0 10px 24px -8px ${LAVENDER}88`,
                }}
              >
                {t("ctaStartCheck")}
                <ChevronRight className="w-4 h-4" />
              </LocalizedLink>
            </motion.div>
          )}
        </AnimatePresence>

        {/* "I have another concern" dropdown — secondary, calmer */}
        <div className="mt-10 sm:mt-12 max-w-full md:mx-auto md:w-[55%]">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            className="group flex items-center justify-between gap-3 w-full rounded-full px-5 sm:px-6 py-3 sm:py-4 bg-transparent transition-colors hover:bg-white"
            style={{
              border: `1.5px dashed ${LAVENDER_SOFT}`,
              color: NAVY,
            }}
          >
            <span className="inline-flex items-center gap-3">
              <HelpCircle className="w-5 h-5" style={{ color: LAVENDER }} />
              <span className="font-semibold text-[15px] sm:text-[16px] lg:text-[18px]">
                {t("anotherConcern")}
              </span>
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
              style={{ color: LAVENDER }}
            />
          </button>

          <AnimatePresence initial={false}>
            {moreOpen && (
              <motion.div
                key="more-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <ul className="pt-4 space-y-2">
                  {MORE_QUESTIONS.map(({ id, icon: Icon }) => {
                    const isOpen = openMoreItem === id;
                    return (
                      <li
                        key={id}
                        className="rounded-2xl bg-white"
                        style={{ border: `1px solid ${LAVENDER_SOFT}55` }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenMoreItem(isOpen ? null : id)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 text-left"
                        >
                          <Icon
                            className="shrink-0 w-5 h-5"
                            style={{ color: LAVENDER }}
                          />
                          <span
                            className="flex-1 font-semibold text-[15px] sm:text-[16px]"
                            style={{ color: NAVY }}
                          >
                            {t(`${id}.question`)}
                          </span>
                          <ChevronDown
                            className={`shrink-0 w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            style={{ color: LAVENDER }}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key={`${id}-body`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <p
                                className="px-4 sm:px-5 pb-4 text-[15px] sm:text-[16px] leading-relaxed whitespace-pre-line"
                                style={{ color: SLATE }}
                              >
                                {t(`${id}.answer`)}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FAQ link CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <h3
            className="font-display font-bold text-[22px] sm:text-[26px] lg:text-[30px] mb-2"
            style={{ color: NAVY }}
          >
            {t("faqLinkTitle")}
          </h3>
          <p
            className="text-[15px] sm:text-[16px] lg:text-[17px] mb-5 max-w-md mx-auto leading-relaxed"
            style={{ color: SLATE }}
          >
            {t("faqLinkSubtitle")}
          </p>
          <LocalizedLink
            href="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              color: LAVENDER,
              border: `1.5px solid ${LAVENDER}`,
              boxShadow: `0 8px 20px -8px ${LAVENDER}55`,
            }}
          >
            {t("faqLinkCta")}
            <ChevronRight className="w-4 h-4" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
