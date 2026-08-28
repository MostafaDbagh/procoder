"use client";

import { useLocale, useTranslations } from "next-intl";
import { JOURNEY_LEVEL_LIST, type JourneyLevel } from "@/data/journeyLevels";
import JourneyStoneTrail from "@/components/journey/JourneyStoneTrail";
import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowLeft, Info, Route, BrainCircuit } from "lucide-react";


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
  const nav = useTranslations("nav");
  const locale = useLocale();
  const pathways = t.raw("pathways") as Pathway[];

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <LocalizedLink
          href="/courses"
          className="group mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5" />
          <span>{nav("courses")}</span>
        </LocalizedLink>

        <header className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {t("eyebrow")}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {t("title")}
            <span className="block">{t("titleLine2")}</span>
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
        <h2
          id="stages-heading"
          className="mt-14 scroll-mt-24 text-2xl font-extrabold tracking-tight"
        >
          {t("levelsHeading")}
        </h2>
        <JourneyStoneTrail courseCounts={courseCounts} />

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
