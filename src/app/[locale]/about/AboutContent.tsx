"use client";

import { useTranslations, useLocale } from "next-intl";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { FutureThinkersSection } from "@/components/FutureThinkersSection";
import { motion } from "framer-motion";
import {
 Sparkles,
 Rocket,
 Telescope,
 Heart,
 Globe,
 ShieldCheck,
 Smile,
 BookOpen,
 Brain,
} from "lucide-react";

export default function AboutContent() {
 const t = useTranslations("about");

 const values = [
 { icon: Heart, title: t("value1Title"), desc: t("value1Desc"), color: "from-pink-400 to-rose-400" },
 { icon: ShieldCheck, title: t("value2Title"), desc: t("value2Desc"), color: "from-emerald-400 to-teal-400" },
 { icon: Smile, title: t("value3Title"), desc: t("value3Desc"), color: "from-amber-400 to-orange-400" },
 { icon: Globe, title: t("value4Title"), desc: t("value4Desc"), color: "from-blue-400 to-cyan-400" },
 ];


 return (
 <>
 <div className="py-12 sm:py-20">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Hero */}
 <AnimatedSection className="text-center mb-20">
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
 <Sparkles className="w-4 h-4" />
 {t("badge")}
 </div>
 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
 {t("title")}
 </h1>
 <p className="text-muted text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
 {t("subtitle")}
 </p>
 </AnimatedSection>

 {/* Vision & Mission */}
 <div className="grid md:grid-cols-2 gap-6 mb-20">
 <AnimatedCard delay={0}>
 <div className="bg-surface rounded-2xl border border-border p-8 h-full">
 <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-5">
 <Telescope className="w-7 h-7 text-white" />
 </div>
 <h2 className="text-2xl font-bold mb-3">{t("visionTitle")}</h2>
 <p className="text-muted leading-relaxed">{t("visionDesc")}</p>
 </div>
 </AnimatedCard>
 <AnimatedCard delay={0.1}>
 <div className="bg-surface rounded-2xl border border-border p-8 h-full">
 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange to-amber-400 flex items-center justify-center mb-5">
 <Rocket className="w-7 h-7 text-white" />
 </div>
 <h2 className="text-2xl font-bold mb-3">{t("missionTitle")}</h2>
 <p className="text-muted leading-relaxed">{t("missionDesc")}</p>
 </div>
 </AnimatedCard>
 </div>

 <FutureThinkersSection />

 {/* AI disclosure — crawlable HTML for search & LLMs */}
 <AnimatedSection className="mb-20">
 <div className="bg-surface rounded-2xl border border-border p-8 max-w-4xl mx-auto">
 <div className="flex items-start gap-4">
 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center shrink-0">
 <Brain className="w-7 h-7 text-white" />
 </div>
 <div>
 <h2 className="text-xl sm:text-2xl font-bold mb-3">{t("aiTechTitle")}</h2>
 <p className="text-muted leading-relaxed">{t("aiTechBody")}</p>
 </div>
 </div>
 </div>
 </AnimatedSection>
 </div>
 </div>
 <div className="py-12 sm:py-20">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Values */}
 <AnimatedSection className="text-center mb-12">
 <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("valuesTitle")}</h2>
 <p className="text-muted text-lg max-w-2xl mx-auto">{t("valuesSubtitle")}</p>
 </AnimatedSection>
 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
 {values.map((v, i) => (
 <AnimatedCard key={i} delay={i * 0.08}>
 <div className="bg-surface rounded-2xl border border-border p-6 text-center h-full">
 <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mx-auto mb-4`}>
 <v.icon className="w-7 h-7 text-white" />
 </div>
 <h3 className="text-lg font-semibold mb-2">{v.title}</h3>
 <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
 </div>
 </AnimatedCard>
 ))}
 </div>

 {/* Our Story */}
 <AnimatedSection className="mb-20">
 <div className="bg-surface rounded-2xl border border-border p-8 sm:p-12">
 <div className="max-w-3xl mx-auto text-center">
 <BookOpen className="w-10 h-10 text-primary mx-auto mb-5" />
 <h2 className="text-2xl sm:text-3xl font-bold mb-5">{t("storyTitle")}</h2>
 <p className="text-muted leading-relaxed mb-4">{t("storyP1")}</p>
 <p className="text-muted leading-relaxed">{t("storyP2")}</p>
 </div>
 </div>
 </AnimatedSection>

 </div>
 </div>
 </>
 );
}
