"use client";

import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import { KidArrowRightIcon } from "@/components/icons/KidIcons";

function TargetArrowIcon({ className = "" }: { className?: string }) {
 return (
 <svg
 viewBox="0 0 260 260"
 fill="currentColor"
 className={className}
 aria-hidden
 >
 <path d="M218,94h3.023C228.057,108.874,232,125.484,232,143c0,63.411-51.589,115-115,115S2,206.411,2,143S53.589,28,117,28 c17.516,0,34.126,3.943,49,10.977V42v9.574l-7.979,7.979C145.64,53.441,131.715,50,117,50c-51.28,0-93,41.72-93,93s41.72,93,93,93 s93-41.72,93-93c0-14.716-3.441-28.641-9.552-41.022L208.426,94H218z M164,143c0,25.916-21.084,47-47,47s-47-21.084-47-47 s21.084-47,47-47c1.472,0,2.926,0.077,4.363,0.21l18.351-18.351C132.596,75.37,124.957,74,117,74c-38.047,0-69,30.953-69,69 s30.953,69,69,69s69-30.953,69-69c0-7.957-1.37-15.596-3.859-22.714l-18.35,18.35C163.923,140.074,164,141.528,164,143z M218,74 l40-40h-32V2l-40,40v17.857l-61.425,61.425c-2.373-0.828-4.92-1.283-7.575-1.283c-12.703,0-23,10.297-23,23 c0,12.703,10.297,23,23,23c12.703,0,23-10.297,23-23c0-2.655-0.455-5.202-1.283-7.575L200.143,74H218z" />
 </svg>
 );
}
import { HeroIllustration } from "./illustrations/HeroIllustration";

export function Hero() {
 const t = useTranslations("hero");

 return (
 <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
 {/* Hello bubbles */}
 <div className="absolute inset-0 -z-10 overflow-hidden">
 {/* Soft background glow */}
 <div className="absolute -top-24 -right-24 w-60 sm:w-[400px] h-60 sm:h-[400px] rounded-full bg-gradient-to-bl from-purple/25 via-primary/15 to-transparent blur-3xl" />
 <div className="absolute -bottom-16 -left-16 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-gradient-to-tr from-mint/15 via-primary/10 to-transparent blur-3xl" />

 {/* Bubbles with greetings — desktop only */}
 <div className="hidden lg:block">
 {[
 { text: "你好", top: "3%", left: "10%", size: "w-14 sm:w-22 h-14 sm:h-22", gradient: "from-pink/18 to-orange/12", fontSize: "text-[10px] sm:text-sm", delay: 0.3 },
 { text: "नमस्ते", top: "5%", left: "28%", size: "w-14 sm:w-24 h-14 sm:h-24", gradient: "from-orange/20 to-pink/12", fontSize: "text-[10px] sm:text-sm", delay: 0.7 },
 { text: "Привет", top: "15%", left: "5%", size: "w-14 sm:w-22 h-14 sm:h-22", gradient: "from-primary/18 to-purple/12", fontSize: "text-[9px] sm:text-xs", delay: 1.4 },
 { text: "مرحبا", top: "8%", right: "6%", size: "w-20 sm:w-32 h-20 sm:h-32", gradient: "from-purple/20 to-primary/12", fontSize: "text-xs sm:text-base", delay: 0 },
 { text: "Hello", top: "18%", right: "22%", size: "w-14 sm:w-22 h-14 sm:h-22", gradient: "from-primary/18 to-mint/12", fontSize: "text-[10px] sm:text-sm", delay: 0.5 },
 { text: "Hola", top: "4%", right: "38%", size: "w-12 sm:w-20 h-12 sm:h-20", gradient: "from-orange/18 to-pink/12", fontSize: "text-[10px] sm:text-sm", delay: 1.2 },
 { text: "Bonjour", top: "30%", right: "4%", size: "w-16 sm:w-24 h-16 sm:h-24", gradient: "from-mint/20 to-primary/12", fontSize: "text-[9px] sm:text-xs", delay: 0.8 },
 { text: "Hallo", bottom: "8%", left: "3%", size: "w-14 sm:w-22 h-14 sm:h-22", gradient: "from-primary/15 to-purple/10", fontSize: "text-[10px] sm:text-sm", delay: 1.5 },
 { text: "Merhaba", bottom: "18%", right: "8%", size: "w-16 sm:w-26 h-16 sm:h-26", gradient: "from-pink/18 to-purple/12", fontSize: "text-[9px] sm:text-xs", delay: 2 },
 { text: "Ciao", bottom: "5%", left: "20%", size: "w-12 sm:w-18 h-12 sm:h-18", gradient: "from-orange/15 to-mint/10", fontSize: "text-[10px] sm:text-sm", delay: 1 },
 ].map((bubble, i) => (
 <motion.div
 key={i}
 className={`absolute ${bubble.size} rounded-full bg-gradient-to-br ${bubble.gradient} border border-white/25 dark:border-white/8 flex items-center justify-center backdrop-blur-[2px]`}
 style={{
 top: bubble.top,
 right: bubble.right,
 bottom: bubble.bottom,
 left: bubble.left,
 }}
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.5, delay: bubble.delay, ease: "easeOut" }}
 >
 <span className={`${bubble.fontSize} font-semibold text-foreground/40 dark:text-foreground/25 select-none`}>
 {bubble.text}
 </span>
 </motion.div>
 ))}
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid lg:grid-cols-2 gap-12 items-center">
 {/* Text — starts visible so the h1 paints immediately (LCP) */}
 <motion.div
 initial={{ opacity: 1, x: 0 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.7, ease: "easeOut" }}
 >
 <h1 className="text-[28px] sm:text-5xl lg:text-[52px] font-bold leading-tight mb-6">
 {t("title").split(" ").map((word, i) => (
 <span
 key={i}
 className={
 i >= t("title").split(" ").length - 2
 ? "bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent"
 : ""
 }
 >
 {word}{" "}
 </span>
 ))}
 </h1>

 <p className="text-sm sm:text-xl text-muted leading-relaxed mb-8 max-w-lg">
 {t("subtitle")}
 </p>

 <div className="flex flex-wrap gap-3 sm:gap-4">
 <LocalizedLink
 href="/courses"
 className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm sm:text-base shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 hover:scale-[1.02]"
 >
 {t("cta")}
 <KidArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
 </LocalizedLink>
 <LocalizedLink
 href="/recommend"
 className="group inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl bg-surface text-foreground font-semibold text-sm sm:text-base shadow-lg shadow-black/[0.04] hover:bg-primary/10 hover:text-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
 >
 {t("secondaryCta")}
 <TargetArrowIcon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
 </LocalizedLink>
 </div>
 </motion.div>

 {/* Illustration */}
 <motion.div
 initial={{ opacity: 0, x: 30 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
 className="hidden lg:block"
 >
 <HeroIllustration />
 </motion.div>
 </div>
 </div>
 </section>
 );
}
