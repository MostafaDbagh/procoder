"use client";

import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function GrowthIcon() {
 return (
 <svg width="120" height="110" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
 {/* Bar chart */}
 {/* Bar 1 — short */}
 <rect x="30" y="62" width="18" height="35" rx="3" fill="#D4A46A" />
 <rect x="30" y="62" width="18" height="35" rx="3" stroke="#2D3748" strokeWidth="2.2" fill="none" />
 {/* Bar 2 — medium */}
 <rect x="54" y="42" width="18" height="55" rx="3" fill="#D4A46A" />
 <rect x="54" y="42" width="18" height="55" rx="3" stroke="#2D3748" strokeWidth="2.2" fill="none" />
 {/* Bar 3 — tall */}
 <rect x="78" y="22" width="18" height="75" rx="3" fill="#D4A46A" />
 <rect x="78" y="22" width="18" height="75" rx="3" stroke="#2D3748" strokeWidth="2.2" fill="none" />

 {/* Spiral arrow */}
 <path
 d="M18 85 Q10 70 22 60 Q34 50 26 38 Q20 28 30 22 L42 14"
 stroke="#44259a" strokeWidth="2.8" fill="none" strokeLinecap="round"
 />
 {/* Arrow head */}
 <path d="M38 10 L44 14 L38 19" stroke="#44259a" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />

 {/* Stars */}
 <polygon points="72,10 74,6 76,10 80,11 77,14 78,18 74,16 70,18 71,14 68,11" fill="#D4A46A" stroke="#2D3748" strokeWidth="1.2" />
 <polygon points="88,4 89.5,1 91,4 94,4.5 91.5,7 92,10 89.5,8.5 87,10 87.5,7 85,4.5" fill="#D4A46A" stroke="#2D3748" strokeWidth="1" />
 </svg>
 );
}

export function HowItWorks() {
 const t = useTranslations("howItWorks");

 const steps = [
 { title: t("step1Title"), desc: t("step1Desc"), bg: "bg-pink-100 dark:bg-pink-950/30", border: "border-pink-200 dark:border-pink-900/40", line: "border-pink-200 dark:border-pink-900/40" },
 { title: t("step2Title"), desc: t("step2Desc"), bg: "bg-amber-50 dark:bg-amber-950/25", border: "border-amber-200 dark:border-amber-900/40", line: "border-amber-200 dark:border-amber-900/40" },
 { title: t("step3Title"), desc: t("step3Desc"), bg: "bg-blue-50 dark:bg-blue-950/25", border: "border-blue-200 dark:border-blue-900/40", line: "border-blue-200 dark:border-blue-900/40" },
 { title: t("step4Title"), desc: t("step4Desc"), bg: "bg-purple-100 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-900/40", line: "border-purple-200 dark:border-purple-900/40" },
 ];

 return (
 <section className="py-20 sm:py-28">
 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Icon */}
 <AnimatedSection className="flex justify-center mb-6">
 <GrowthIcon />
 </AnimatedSection>

 {/* Heading */}
 <AnimatedSection className="text-center mb-12">
 <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{t("title")}</h2>
 <p className="text-muted text-lg max-w-xl mx-auto italic">
 {t("subtitle")}
 </p>
 </AnimatedSection>

 {/* Steps */}
 <div className="flex flex-col gap-5">
 {steps.map((step, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 25 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.45, delay: i * 0.12 }}
 >
 {/* Step card */}
 <div className={`${step.bg} ${step.border} border rounded-2xl px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between gap-3`}>
 <h3 className="text-base sm:text-xl font-extrabold text-foreground">
 {step.title}
 </h3>
 <span className="text-muted text-xs sm:text-sm font-medium whitespace-nowrap">
 Step {i + 1}
 </span>
 </div>

 {/* Description */}
 <div className={`ml-4 sm:ml-5 mt-0 border-l-2 ${step.line} pl-4 sm:pl-6 py-4 sm:py-5`}>
 <p className="text-muted leading-relaxed text-base">
 {step.desc}
 </p>
 </div>
 </motion.div>
 ))}
 </div>

 {/* Book Free Trial link */}
 <AnimatedSection delay={0.5} className="text-center mt-10">
 <LocalizedLink
 href="/contact?subject=Book%20a%20Free%20Trial%20Class"
 className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-semibold text-base shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.02] transition-all"
 >
 {t("step2Title")}
 <ArrowRight className="w-5 h-5" />
 </LocalizedLink>
 </AnimatedSection>
 </div>
 </section>
 );
}
