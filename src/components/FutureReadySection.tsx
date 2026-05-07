"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  ThinkBrainIcon,
  AIBotIcon,
  BuildToolsIcon,
} from "@/components/icons/PillarIcons";

const pillars = [
  {
    icon: ThinkBrainIcon,
    key: "pillar1",
    bubble: "bg-primary/10 border-primary/20",
  },
  {
    icon: AIBotIcon,
    key: "pillar2",
    bubble: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: BuildToolsIcon,
    key: "pillar3",
    bubble: "bg-amber-500/10 border-amber-500/20",
  },
];

export function FutureReadySection() {
  const t = useTranslations("futureReady");

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4" />
            {t("badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-muted text-lg sm:text-xl leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Body text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-muted leading-relaxed text-base sm:text-lg">
            {t("body")}
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-surface rounded-2xl border border-border p-8 text-center"
            >
              <div
                className={`w-20 h-20 rounded-3xl border-2 ${pillar.bubble} flex items-center justify-center mx-auto mb-5`}
              >
                <pillar.icon className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold mb-3">
                {t(`${pillar.key}Title`)}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {t(`${pillar.key}Desc`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quote + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <p className="mb-8">
            <span className="inline-block text-2xl sm:text-3xl font-bold px-5 py-2.5 rounded-2xl bg-primary/15 text-primary">
              &ldquo;{t("quote")}&rdquo;
            </span>
          </p>
          <LocalizedLink
            href="/free-trial"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-purple text-white font-semibold text-base shadow-[0_4px_14px_rgba(139,123,200,0.40)] hover:shadow-[0_6px_20px_rgba(139,123,200,0.55)] hover:scale-[1.03] transition-all duration-200"
          >
            {t("cta")}
          </LocalizedLink>
        </motion.div>
      </div>
    </section>
  );
}
