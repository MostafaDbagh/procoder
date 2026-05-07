"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { ThinkBrainIcon } from "@/components/icons/PillarIcons";
import { ChipBrainIcon, BuildBlocksIcon } from "@/components/icons/KidIcons";

const pillars = [
  { icon: ThinkBrainIcon, key: "pillar1", bubble: "bg-violet-500/10 border-violet-500/20" },
  { icon: ChipBrainIcon, key: "pillar2", bubble: "bg-cyan-500/10 border-cyan-500/20" },
  { icon: BuildBlocksIcon, key: "pillar3", bubble: "bg-amber-500/10 border-amber-500/20" },
];

export function FutureThinkersSection() {
  const t = useTranslations("futureThinkersSection");

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-[15%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[15%] w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t("title")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h2>
          <div className="max-w-3xl mx-auto space-y-4 text-muted text-lg leading-relaxed">
            <p>{t("body1")}</p>
            <p>{t("body2")}</p>
            <p>{t("body3")}</p>
          </div>
        </AnimatedSection>

        {/* Pillars */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {pillars.map((pillar, i) => (
            <AnimatedCard key={pillar.key} delay={i * 0.1}>
              <div className="bg-surface rounded-2xl border border-border p-7 h-full text-center">
                <div
                  className={`w-20 h-20 rounded-3xl border-2 ${pillar.bubble} flex items-center justify-center mx-auto mb-5`}
                >
                  <pillar.icon className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  {t(`${pillar.key}Title`)}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {t(`${pillar.key}Desc`)}
                </p>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xl sm:text-2xl font-bold text-primary">
            {t("quote")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
