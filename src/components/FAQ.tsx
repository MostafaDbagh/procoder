"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "./AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const tabs = ["classExperience", "customerSupport", "teacherQueries"] as const;

const faqsByTab: Record<string, string[]> = {
  classExperience: ["ce1", "ce2", "ce3", "ce4", "ce5", "ce6", "ce7", "ce8"],
  customerSupport: ["cs1", "cs2", "cs3", "cs4", "cs5"],
  teacherQueries: ["tq1", "tq2", "tq3", "tq4"],
};

export function FAQ() {
  const t = useTranslations("faq");
  const [activeTab, setActiveTab] = useState<string>("classExperience");
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <HelpCircle className="w-16 h-16 text-purple" />
              <HelpCircle className="w-8 h-8 text-primary/40 absolute -top-2 -left-4" />
              <HelpCircle className="w-6 h-6 text-pink/50 absolute -top-3 right-[-12px]" />
              <HelpCircle className="w-5 h-5 text-orange/40 absolute bottom-0 -right-5" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("title")}{" "}
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection delay={0.1} className="mb-10">
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-1 p-1.5 bg-surface rounded-2xl border border-border w-full sm:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setOpenId(null);
                  }}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-md"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {t(`tab_${tab}`)}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Accordion */}
        <AnimatedSection delay={0.15}>
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {faqsByTab[activeTab].map((id, i) => {
                  const isOpen = openId === id;
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`rounded-2xl border transition-all duration-200 ${
                        isOpen
                          ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5"
                          : "bg-surface border-border hover:border-primary/20"
                      }`}
                    >
                      <button
                        onClick={() => toggle(id)}
                        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
                      >
                        <span className="font-semibold text-sm sm:text-base leading-relaxed">
                          {t(`${id}_q`)}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isOpen
                              ? "bg-primary text-white"
                              : "bg-border text-muted"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                              <p className="text-muted leading-relaxed text-sm sm:text-base">
                                {t(`${id}_a`)}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
