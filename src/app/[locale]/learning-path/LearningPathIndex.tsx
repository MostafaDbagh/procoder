"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { LocalizedLink } from "@/components/LocalizedLink";
import { JOURNEY_LEVEL_LIST, type JourneyLevel } from "@/data/journeyLevels";
import {
  Compass,
  Blocks,
  Palette,
  Lightbulb,
  Rocket,
  ArrowRight,
  Info,
  Route,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

const LEVEL_ICONS: Record<JourneyLevel, LucideIcon> = {
  explorer: Compass,
  builder: Blocks,
  creator: Palette,
  innovator: Lightbulb,
  pro: Rocket,
};

interface Pathway {
  name: string;
  steps: string;
}

export default function LearningPathIndex({
  courseCounts,
}: {
  courseCounts: Record<JourneyLevel, number>;
}) {
  const t = useTranslations("journey.index");
  const tLevels = useTranslations("journey.levels");
  const locale = useLocale();
  const pathways = t.raw("pathways") as Pathway[];

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <header className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {t("eyebrow")}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {t("subtitle")}
          </p>
          <p className="mx-auto mt-6 max-w-3xl rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed text-muted">
            {t("intro")}
          </p>
          <p
            className="mt-6 text-sm font-bold tracking-wide text-primary"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            {t("progression")}
          </p>
        </header>

        {/* The five levels */}
        <h2 className="mt-14 text-2xl font-extrabold tracking-tight">
          {t("levelsHeading")}
        </h2>
        <ol className="mt-6 space-y-4">
          {JOURNEY_LEVEL_LIST.map((lvl, i) => {
            const Icon = LEVEL_ICONS[lvl.key];
            const count = courseCounts[lvl.key] ?? 0;
            return (
              <motion.li
                key={lvl.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <LocalizedLink
                  href={`/learning-path/${lvl.key}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${lvl.gradient} text-white shadow-md`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {t("stepLabel", { n: lvl.step })}
                      </span>
                      <span className="text-xs font-medium text-muted">
                        {tLevels(`${lvl.key}.meta.ages`)}
                      </span>
                      <span className="text-xs font-medium text-muted">
                        · {t("coursesCount", { count })}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-xl font-extrabold leading-tight group-hover:text-primary">
                      {tLevels(`${lvl.key}.meta.name`)}
                    </h3>
                    <p className="text-sm font-medium text-primary/80">
                      {tLevels(`${lvl.key}.meta.tagline`)}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {tLevels(`${lvl.key}.meta.desc`)}
                    </p>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white sm:self-center">
                    {t("viewLevel")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </span>
                </LocalizedLink>
              </motion.li>
            );
          })}
        </ol>

        {/* Age guidance */}
        <section className="mt-8 flex gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="font-bold">{t("ageNoteTitle")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{t("ageNote")}</p>
          </div>
        </section>

        {/* Pathways */}
        <section className="mt-14">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-extrabold tracking-tight">
              {t("pathwaysHeading")}
            </h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            {t("pathwaysIntro")}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {pathways.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <h3 className="font-bold text-foreground">{p.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.steps}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI across the journey */}
        <section className="mt-14">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-extrabold tracking-tight">
              {t("aiHeading")}
            </h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            {t("aiIntro")}
          </p>
          <dl className="mt-5 overflow-hidden rounded-2xl border border-border">
            {JOURNEY_LEVEL_LIST.map((lvl, i) => (
              <div
                key={lvl.key}
                className={`flex flex-col gap-1 p-4 sm:flex-row sm:gap-4 ${
                  i % 2 ? "bg-background/40" : "bg-surface"
                } ${i > 0 ? "border-t border-border" : ""}`}
              >
                <dt className="text-sm font-bold text-foreground sm:w-32 sm:shrink-0">
                  {tLevels(`${lvl.key}.meta.name`)}
                </dt>
                <dd className="text-sm leading-relaxed text-muted">
                  {t(`aiRoles.${lvl.key}`)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
