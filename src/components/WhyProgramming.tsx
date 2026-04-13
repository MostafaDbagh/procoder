"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedCard } from "./AnimatedSection";
import { Lightbulb, Palette, Brain, Rocket } from "lucide-react";

const points = [
  { key: "point1", icon: Lightbulb, color: "bg-amber-400" },
  { key: "point2", icon: Palette, color: "bg-rose-400" },
  { key: "point3", icon: Brain, color: "bg-violet-400" },
  { key: "point4", icon: Rocket, color: "bg-emerald-400" },
];

export function WhyProgramming() {
  const t = useTranslations("whyProgramming");

  return (
    <section className="py-20 sm:py-28 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="max-w-3xl mx-auto mb-12">
          <p className="text-muted text-base sm:text-lg leading-relaxed text-center">
            {t("intro")}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <AnimatedCard key={p.key} delay={i * 0.1}>
                <article className="bg-surface rounded-2xl border border-border p-7 h-full">
                  <div className={`w-12 h-12 rounded-2xl ${p.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t(`${p.key}Title`)}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {t(`${p.key}Desc`)}
                  </p>
                </article>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
