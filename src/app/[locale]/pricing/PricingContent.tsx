"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { Check, Zap, ChevronDown, ChevronUp, Users, Tag, Star } from "lucide-react";
import type { APIPricingData, APIPricingPlan, APIPricingDiscount, APIPricingFaq } from "@/lib/server-api";

const DISCOUNT_ICONS = [Users, Tag, Star];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold hover:bg-surface-hover transition-colors"
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-muted shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-muted text-sm leading-relaxed border-t border-border pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

function PlanCard({ plan, lang }: { plan: APIPricingPlan; lang: "en" | "ar" }) {
  const features = plan.features ?? [];
  const badge = plan.badge?.[lang];
  const highlighted = plan.highlighted;

  if (highlighted) {
    return (
      <div className="h-full bg-primary rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple/20 rounded-full blur-2xl" />
        <div className="relative flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-white/70 uppercase tracking-wide">{plan.name[lang]}</p>
            {badge && <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full">{badge}</span>}
          </div>
          <p className="text-4xl font-bold text-white mb-1">{plan.priceDisplay[lang]}</p>
          {plan.period[lang] && <p className="text-white/60 text-sm mb-6">{plan.period[lang]}</p>}
          <p className="text-white/80 text-sm mb-8">{plan.description[lang]}</p>
          <ul className="space-y-3 mb-8 flex-1">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                <Check className="w-4 h-4 text-white shrink-0" />
                {f[lang]}
              </li>
            ))}
          </ul>
          <LocalizedLink
            href={plan.ctaHref}
            className="block text-center px-6 py-3.5 rounded-2xl bg-white text-primary font-bold hover:bg-white/90 transition-all shadow-lg"
          >
            {plan.ctaLabel[lang]}
          </LocalizedLink>
        </div>
      </div>
    );
  }

  const isTrial = plan.key === "trial";
  return (
    <div className="h-full bg-surface border border-border rounded-3xl p-8 flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-muted uppercase tracking-wide">{plan.name[lang]}</p>
          {badge && (
            <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 px-3 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-4xl font-bold mb-1">{plan.priceDisplay[lang]}</p>
        {plan.period[lang] && <p className="text-muted text-sm mb-2">{plan.period[lang]}</p>}
        <p className="text-muted text-sm">{plan.description[lang]}</p>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            {f[lang]}
          </li>
        ))}
      </ul>
      <LocalizedLink
        href={plan.ctaHref}
        className={
          isTrial
            ? "block text-center px-6 py-3.5 rounded-2xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all"
            : "block text-center px-6 py-3.5 rounded-2xl bg-foreground text-background font-semibold hover:opacity-90 transition-all"
        }
      >
        {plan.ctaLabel[lang]}
      </LocalizedLink>
    </div>
  );
}

export default function PricingContent({ pricing }: { pricing: APIPricingData | null }) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";

  const plans: APIPricingPlan[] = pricing?.plans ?? [];
  const discounts: APIPricingDiscount[] = pricing?.discounts ?? [];
  const faqs: APIPricingFaq[] = pricing?.faqs ?? [];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            <Zap className="w-4 h-4" />
            {t("badgeLabel")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-muted text-lg max-w-xl mx-auto">{t("subtitle")}</p>
        </AnimatedSection>

        {/* Plans */}
        {plans.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan, i) => (
              <AnimatedCard key={plan._id} delay={0.05 * (i + 1)}>
                <PlanCard plan={plan} lang={lang} />
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Discounts */}
        {discounts.length > 0 && (
          <AnimatedSection className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("discountsTitle")}</h2>
              <p className="text-muted">{t("discountsSubtitle")}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {discounts.map((d, i) => {
                const Icon = DISCOUNT_ICONS[i % DISCOUNT_ICONS.length];
                return (
                  <AnimatedCard key={d._id} delay={0.05 * i}>
                    <div className="bg-surface border border-border rounded-2xl p-6 text-center">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${d.iconColor} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-primary mb-1">{d.value[lang]}</p>
                      <p className="font-semibold mb-2">{d.title[lang]}</p>
                      <p className="text-muted text-sm">{d.description[lang]}</p>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </AnimatedSection>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <AnimatedSection className="mb-20 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">{t("faqTitle")}</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <FAQItem key={faq._id} q={faq.question[lang]} a={faq.answer[lang]} />
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* CTA */}
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-primary p-10 sm:p-16 text-center">
            <div className="absolute -top-10 -right-10 w-52 h-52 bg-purple/40 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-mint/30 rounded-full blur-2xl" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">{t("ctaTitle")}</h2>
              <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">{t("ctaDesc")}</p>
              <LocalizedLink
                href="/free-trial"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
              >
                {t("ctaCta")}
              </LocalizedLink>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
