"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ChatHeartIcon,
  ThinkBrainIcon,
  BlossomStarIcon,
} from "@/components/icons/PillarIcons";
import { ChipBrainIcon } from "@/components/icons/KidIcons";

/**
 * Explainer that demystifies the AI matching feature for parents AND for crawlers.
 * Lives on the /recommend page — directly above the chat — so the first thing a
 * parent (or LLM) sees is a transparent 4-step description of what the AI does.
 *
 * Translation keys: namespace `recommend`, prefix `howAi`.
 */
export function HowOurAIWorks() {
  const t = useTranslations("recommend");

  const steps = [
    { icon: ChatHeartIcon, key: "Step1", bubble: "bg-primary/10 border-primary/20" },
    { icon: ChipBrainIcon, key: "Step2", bubble: "bg-cyan-500/10 border-cyan-500/20" },
    { icon: ThinkBrainIcon, key: "Step3", bubble: "bg-violet-500/10 border-violet-500/20" },
    { icon: BlossomStarIcon, key: "Step4", bubble: "bg-amber-400/10 border-amber-400/30" },
  ];

  return (
    <section className="mb-12">
      <header className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("howAiTitle")}</h2>
        <p className="text-muted text-base max-w-2xl mx-auto">{t("howAiSubtitle")}</p>
      </header>

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s, i) => (
          <motion.li
            key={s.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-surface rounded-2xl border border-border p-6 text-center"
          >
            <div className={`w-16 h-16 rounded-2xl border-2 ${s.bubble} flex items-center justify-center mx-auto mb-4`}>
              <s.icon className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold mb-2">{t(`howAi${s.key}Title`)}</h3>
            <p className="text-muted text-sm leading-relaxed">
              {t(`howAi${s.key}Desc`)}
            </p>
          </motion.li>
        ))}
      </ol>

      <div className="mt-6 max-w-3xl mx-auto rounded-2xl border border-border bg-surface px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-sm font-bold text-foreground mb-1">
          {t("howAiClarifierTitle")}
        </p>
        <p className="text-muted text-sm leading-relaxed">
          {t("howAiClarifierBody")}
        </p>
      </div>
    </section>
  );
}
