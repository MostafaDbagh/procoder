"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const STEP_COLORS = ["#8B6CFF", "#F59E0B", "#3B82F6", "#10B981", "#EC4899"];

// Approx X-center of each icon circle in the bg image (percent of image width).
// Tune if the image is recropped.
const STEP_X = ["14%", "32%", "50%", "68%", "86%"];

// Per-step Y (top %) — staircase that follows the icons rising left→right.
const STEP_Y = ["42%", "38%", "34%", "30%", "26%"];

export function LearningJourney() {
 const t = useTranslations("learningJourney");
 const locale = useLocale();

 const steps = [
 { number: "01", label: t("step1Label"), desc: t("step1Desc"), color: STEP_COLORS[0], x: STEP_X[0], y: STEP_Y[0] },
 { number: "02", label: t("step2Label"), desc: t("step2Desc"), color: STEP_COLORS[1], x: STEP_X[1], y: STEP_Y[1] },
 { number: "03", label: t("step3Label"), desc: t("step3Desc"), color: STEP_COLORS[2], x: STEP_X[2], y: STEP_Y[2] },
 { number: "04", label: t("step4Label"), desc: t("step4Desc"), color: STEP_COLORS[3], x: STEP_X[3], y: STEP_Y[3] },
 { number: "05", label: t("step5Label"), desc: t("step5Desc"), color: STEP_COLORS[4], x: STEP_X[4], y: STEP_Y[4] },
 ];

 const flow = [t("flow1"), t("flow2"), t("flow3"), t("flow4")];

 return (
 <section
 dir={locale === "ar" ? "rtl" : "ltr"}
 className="relative overflow-hidden pt-0 pb-0 font-display"
 aria-labelledby="learning-journey-title"
 >
 <h2 id="learning-journey-title" className="sr-only">{t("title")}</h2>
 {/* Desktop: full-width bg image + absolutely-positioned text labels under each icon */}
 <div className="hidden min-[786px]:block relative w-full aspect-[1280/737]">
 <Image
 src="/images/ladder.webp"
 alt="StemTechLab learning journey: Ask, Break Down, Test, Build, Improve — five steps that turn curiosity into real skills"
 fill
 sizes="100vw"
 className="object-cover"
 priority={false}
 />
 {steps.map((step, i) => (
 <motion.div
 key={step.number}
 initial={{ opacity: 0, y: 12 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, amount: 0.3 }}
 transition={{ duration: 0.5, delay: i * 0.08 }}
 className="absolute -translate-x-1/2 text-center w-[15%]"
 style={{ left: step.x, top: step.y }}
 >
 <div
 className="text-[12px] lg:text-[13px] font-bold tracking-[0.25em] mb-1"
 style={{ color: step.color }}
 >
 {step.number}
 </div>
 <h3
 className="font-display font-bold text-[16px] lg:text-[20px] uppercase tracking-wide mb-1"
 style={{ color: "#16234F" }}
 >
 {step.label}
 </h3>
 <span
 className="block h-[2px] w-6 mx-auto rounded-full mb-2"
 style={{ backgroundColor: step.color, opacity: 0.6 }}
 />
 <p
 dir="auto"
 className="text-[14px] lg:text-[17px] leading-snug font-medium whitespace-pre-line"
 style={{ color: "#3F4868" }}
 >
 {step.desc}
 </p>
 </motion.div>
 ))}

 {/* Flow chips + closing tagline overlaid inside the image */}
 <div className="absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[90%] flex flex-col items-center">
 <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-2">
 {flow.map((word, i) => (
 <div key={word} className="flex items-center gap-3">
 <span
 className="text-[14px] lg:text-[18px] font-bold tracking-[0.25em] uppercase"
 style={{ color: "#8B6CFF" }}
 >
 {word}
 </span>
 {i < flow.length - 1 && (
 <ChevronRight
 className="w-4 h-4 lg:w-5 lg:h-5 rtl:rotate-180"
 style={{ color: "#8B6CFF", opacity: 0.6 }}
 aria-hidden
 />
 )}
 </div>
 ))}
 </div>
 <p
 className="text-center text-[14px] lg:text-[18px]"
 style={{ color: "#3F4868" }}
 >
 {t("closingLead")}{" "}
 <span style={{ color: "#8B6CFF", fontWeight: 700 }}>
 {t("closingHighlight")}
 </span>
 </p>
 </div>
 </div>

 {/* Mobile / tablet: compact step cards; the desktop infographic has no useful
     readable detail at phone widths and was creating a large empty band. */}
 <div className="min-[786px]:hidden">
 <ol className="mx-auto grid max-w-xl grid-cols-2 gap-x-6 gap-y-8 px-6 py-8 sm:gap-x-12 sm:gap-y-10 sm:px-8">
 {steps.map((step) => (
 <li key={step.number} className="flex min-w-0 flex-col items-center px-2 text-center last:col-span-2 last:mx-auto last:w-1/2">
 <div
 className="inline-flex items-center justify-center w-11 h-11 rounded-full text-sm font-bold tracking-wider mb-3"
 style={{ backgroundColor: step.color + "1f", color: step.color }}
 >
 {step.number}
 </div>
 <h3
 className="font-display font-bold text-xl sm:text-2xl mb-2 leading-relaxed text-foreground"
 >
 {step.label}
 </h3>
 <span
 className="block h-[2px] w-6 rounded-full mb-2"
 style={{ backgroundColor: step.color, opacity: 0.6 }}
 />
 <p
 className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-muted"
 >
 {step.desc}
 </p>
 </li>
 ))}
 </ol>
 </div>

 {/* Mobile only: flow chips + tagline below the image */}
 <div className="min-[786px]:hidden max-w-7xl mx-auto px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
 <div className="mt-7 sm:mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-3">
 {flow.map((word, i) => (
 <div key={word} className="flex items-center gap-3">
 <span
 className="text-xs sm:text-sm font-semibold ltr:tracking-widest ltr:uppercase"
 style={{ color: "#8B6CFF" }}
 >
 {word}
 </span>
 {i < flow.length - 1 && (
 <ChevronRight
 className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180"
 style={{ color: "#8B6CFF", opacity: 0.6 }}
 aria-hidden
 />
 )}
 </div>
 ))}
 </div>

 <p
 className="text-center text-base sm:text-lg leading-relaxed text-muted"
 >
 {t("closingLead")}{" "}
 <span style={{ color: "#8B6CFF", fontWeight: 700 }}>
 {t("closingHighlight")}
 </span>
 </p>
 </div>
 </section>
 );
}
