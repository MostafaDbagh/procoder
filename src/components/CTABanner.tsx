"use client";

import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { AnimatedSection } from "./AnimatedSection";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTABanner() {
  const t = useTranslations("hero");

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-primary p-8 sm:p-16 text-center">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white/90 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Start Today
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t("title")}
              </h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                {t("subtitle")}
              </p>
              <LocalizedLink
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-white text-primary font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                {t("cta")}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
