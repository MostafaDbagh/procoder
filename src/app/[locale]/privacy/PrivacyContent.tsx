"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ShieldCheck } from "lucide-react";

export default function PrivacyContent() {
 const t = useTranslations("privacy");

 const sections = [
 { title: t("s1Title"), content: t("s1Content") },
 { title: t("s2Title"), content: t("s2Content") },
 { title: t("s3Title"), content: t("s3Content") },
 { title: t("s4Title"), content: t("s4Content") },
 { title: t("s5Title"), content: t("s5Content") },
 { title: t("s6Title"), content: t("s6Content") },
 ];

 return (
 <div className="py-12 sm:py-20">
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-12">
 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mx-auto mb-5">
 <ShieldCheck className="w-8 h-8 text-white" />
 </div>
 <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h1>
 <p className="text-muted">{t("lastUpdated")}</p>
 </AnimatedSection>

 <AnimatedSection delay={0.1}>
 <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9 space-y-8">
 <p className="text-muted leading-relaxed">{t("intro")}</p>

 {sections.map((s, i) => (
 <div key={i}>
 <h2 className="text-xl font-semibold mb-3">{s.title}</h2>
 <p className="text-muted leading-relaxed whitespace-pre-line">{s.content}</p>
 </div>
 ))}
 </div>
 </AnimatedSection>
 </div>
 </div>
 );
}
