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
 {/* Colored bubbles */}
 <div className="absolute -top-10 -right-10 w-36 sm:w-52 h-36 sm:h-52 bg-purple/40 rounded-full blur-2xl" />
 <div className="absolute -bottom-12 -left-10 w-40 sm:w-56 h-40 sm:h-56 bg-mint/30 rounded-full blur-2xl" />
 <div className="absolute top-1/4 -left-6 w-28 sm:w-40 h-28 sm:h-40 bg-orange/25 rounded-full blur-2xl" />
 <div className="absolute -bottom-8 right-1/4 w-32 sm:w-44 h-32 sm:h-44 bg-pink/30 rounded-full blur-2xl" />
 <div className="absolute top-1/3 right-[10%] w-24 sm:w-36 h-24 sm:h-36 bg-white/10 rounded-full blur-xl" />
 <div className="absolute bottom-1/3 left-[15%] w-20 sm:w-28 h-20 sm:h-28 bg-purple-light/25 rounded-full blur-xl" />

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
