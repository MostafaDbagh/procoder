"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedCard } from "./AnimatedSection";
import { BrainPattern } from "./BrainPatterns";
import { LocalizedLink } from "./LocalizedLink";
import {
  KidArrowRightIcon,
  BarChartIcon,
  GiftBoxIcon,
} from "./icons/KidIcons";
import {
  AIBotIcon,
  LiveClassIcon,
  ChatHeartIcon,
  IdeaLightIcon,
} from "./icons/PillarIcons";

export function WhyUs() {
  const t = useTranslations("whyUs");

  const reasons = [
    {
      icon: AIBotIcon,
      title: t("r1Title"),
      desc: t("r1Desc"),
      bubble: "bg-purple-400/10 border-purple-400/30",
    },
    {
      icon: LiveClassIcon,
      title: t("r2Title"),
      desc: t("r2Desc"),
      bubble: "bg-amber-400/10 border-amber-400/30",
    },
    {
      icon: ChatHeartIcon,
      title: t("r3Title"),
      desc: t("r3Desc"),
      bubble: "bg-pink-400/10 border-pink-400/30",
    },
    {
      icon: BarChartIcon,
      title: t("r4Title"),
      desc: t("r4Desc"),
      bubble: "bg-blue-400/10 border-blue-400/30",
    },
    {
      icon: IdeaLightIcon,
      title: t("r5Title"),
      desc: t("r5Desc"),
      bubble: "bg-emerald-400/10 border-emerald-400/30",
    },
    {
      icon: GiftBoxIcon,
      title: t("r6Title"),
      desc: t("r6Desc"),
      bubble: "bg-rose-400/10 border-rose-400/30",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-surface/50">
      <BrainPattern variant="rubik" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {t("title")}
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <AnimatedCard key={i} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="bg-surface rounded-2xl border border-border p-7 h-full text-center sm:text-start"
              >
                <div
                  className={`w-16 h-16 rounded-2xl border-2 ${r.bubble} flex items-center justify-center mb-5 mx-auto sm:mx-0`}
                >
                  <r.icon className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{r.desc}</p>
              </motion.article>
            </AnimatedCard>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="text-center mt-12">
          <LocalizedLink
            href="/parents"
            className="inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full border-[3px] border-black dark:border-foreground bg-primary text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_var(--fg)] hover:translate-x-[1px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] dark:hover:shadow-[2px_2px_0_0_var(--fg)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0_0_0_0_#000] dark:active:shadow-[0_0_0_0_var(--fg)] transition-all duration-150"
          >
            {t("cta")}
            <KidArrowRightIcon className="w-5 h-5" />
          </LocalizedLink>
        </AnimatedSection>
      </div>
    </section>
  );
}
