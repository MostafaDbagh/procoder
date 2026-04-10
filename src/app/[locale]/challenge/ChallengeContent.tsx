"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/AnimatedSection";
import { sendContactMessage } from "@/lib/api";
import type { PublicMonthlyChallenge } from "@/lib/server-api";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Grid3x3,
  Pencil,
  Sparkles,
  Send,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
} from "lucide-react";

const stepIcons = [Grid3x3, Pencil, Sparkles, Trophy];

type Props = {
  cmsChallenge: PublicMonthlyChallenge | null;
};

export default function ChallengeContent({ cmsChallenge }: Props) {
  const t = useTranslations("challenge");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";

  const monthYear = useMemo(() => {
    if (cmsChallenge?.monthKey) {
      const d = new Date(`${cmsChallenge.monthKey}-01T12:00:00Z`);
      if (!Number.isNaN(d.getTime())) {
        return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
          month: "long",
          year: "numeric",
        }).format(d);
      }
    }
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date());
  }, [cmsChallenge?.monthKey, locale]);

  const challengeSlug = cmsChallenge?.slug ?? "procoder-challenge";

  const steps = useMemo(() => {
    if (cmsChallenge?.steps?.length) {
      return cmsChallenge.steps.map((s, i) => ({
        n: i + 1,
        icon: stepIcons[i % stepIcons.length],
        title:
          lang === "ar"
            ? s.titleAr || s.titleEn
            : s.titleEn || s.titleAr,
        body:
          lang === "ar" ? s.bodyAr || s.bodyEn : s.bodyEn || s.bodyAr,
      }));
    }
    return [
      { n: 1, icon: Grid3x3, title: t("step1Title"), body: t("step1Body") },
      { n: 2, icon: Pencil, title: t("step2Title"), body: t("step2Body") },
      { n: 3, icon: Sparkles, title: t("step3Title"), body: t("step3Body") },
      { n: 4, icon: Trophy, title: t("step4Title"), body: t("step4Body") },
    ];
  }, [cmsChallenge, lang, t]);

  const badgeText =
    cmsChallenge &&
    (lang === "ar" ? cmsChallenge.badgeAr : cmsChallenge.badgeEn)
      ? lang === "ar"
        ? cmsChallenge.badgeAr
        : cmsChallenge.badgeEn
      : t("badge");

  const titleText = cmsChallenge
    ? lang === "ar"
      ? cmsChallenge.titleAr
      : cmsChallenge.titleEn
    : t("title");

  const subtitleText = cmsChallenge
    ? lang === "ar"
      ? cmsChallenge.subtitleAr
      : cmsChallenge.subtitleEn
    : t("subtitle");

  const hintBody = cmsChallenge
    ? lang === "ar"
      ? cmsChallenge.hintBodyAr || cmsChallenge.hintBodyEn
      : cmsChallenge.hintBodyEn || cmsChallenge.hintBodyAr
    : t("hintBody");

  const formTitle = cmsChallenge
    ? lang === "ar"
      ? cmsChallenge.formTitleAr || cmsChallenge.titleAr
      : cmsChallenge.formTitleEn || cmsChallenge.titleEn
    : t("formTitle");

  const formSubtitle = cmsChallenge
    ? lang === "ar"
      ? cmsChallenge.formSubtitleAr || cmsChallenge.subtitleAr
      : cmsChallenge.formSubtitleEn || cmsChallenge.subtitleEn
    : t("formSubtitle");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [hintOpen, setHintOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    const subject = `[ProCoder Challenge] ${challengeSlug}`;
    const message = [
      `Challenge: ${challengeSlug}`,
      `Month: ${monthYear}`,
      `Locale: ${locale}`,
      `Parent/caregiver: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Child nickname: ${childName.trim() || "—"}`,
      `Monthly challenge emails: ${optIn ? "yes" : "no"}`,
    ].join("\n");

    try {
      await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject,
        message,
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("errorGeneric")
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-sm font-medium mb-5">
            <Trophy className="w-4 h-4" />
            {badgeText}
          </div>
          <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
            {t("monthLabel", { month: monthYear })}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {titleText}
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
            {subtitleText}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.05} className="mb-10">
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t("stepsHeading")}
            </h2>
            <ol className="space-y-5">
              {steps.map(({ n, icon: Icon, title, body }) => (
                <li key={n} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {n}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-muted" />
                      <span className="font-semibold">{title}</span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-xl border border-border bg-surface-hover/50 overflow-hidden">
              <button
                type="button"
                onClick={() => setHintOpen(!hintOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-start text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  {t("hintToggle")}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted transition-transform ${hintOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {hintOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-muted leading-relaxed border-t border-border pt-3 whitespace-pre-wrap">
                      {hintBody}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-gradient-to-br from-primary/10 via-surface to-purple/5 rounded-2xl border border-primary/20 p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-1">{formTitle}</h2>
            <p className="text-muted text-sm mb-6">{formSubtitle}</p>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <p className="font-semibold mb-2">{t("successTitle")}</p>
                <p className="text-muted text-sm mb-6">{t("successBody")}</p>
                <LocalizedLink
                  href="/courses"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
                >
                  {t("browseCourses")}
                </LocalizedLink>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t("nameLabel")}{" "}
                    <span className="text-red-500" aria-hidden>
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder={t("namePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t("emailLabel")}{" "}
                    <span className="text-red-500" aria-hidden>
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder={t("emailPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t("childLabel")}
                  </label>
                  <input
                    type="text"
                    autoComplete="nickname"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder={t("childPlaceholder")}
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optIn}
                    onChange={(e) => setOptIn(e.target.checked)}
                    className="mt-1 rounded border-border text-primary focus:ring-primary/30"
                  />
                  <span className="text-sm text-muted leading-snug">
                    {t("optInLabel")}
                  </span>
                </label>

                {error ? (
                  <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/20 hover:opacity-95 disabled:opacity-60 transition-opacity"
                >
                  {sending ? (
                    t("sending")
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("submit")}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
