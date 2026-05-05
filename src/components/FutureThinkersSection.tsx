"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Brain, Cpu, Hammer } from "lucide-react";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";

const pillars = [
  { icon: Brain, key: "pillar1", gradient: "from-violet-500 to-primary" },
  { icon: Cpu, key: "pillar2", gradient: "from-cyan-500 to-blue-500" },
  { icon: Hammer, key: "pillar3", gradient: "from-amber-500 to-orange-500" },
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
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mx-auto mb-5`}
                >
                  <pillar.icon className="w-7 h-7 text-white" />
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
