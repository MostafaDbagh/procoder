"use client";

import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
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
 animate={{ y: [0, -8, 0] }}
 transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: bubble.delay }}
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
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
 <Sparkles className="w-4 h-4" />
 <span>Ages 6–18</span>
 </div>

 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
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

 <p className="text-lg sm:text-xl text-muted leading-relaxed mb-8 max-w-lg">
 {t("subtitle")}
 </p>

 <div className="flex flex-wrap gap-4">
 <LocalizedLink
 href="/courses"
 className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-semibold text-base shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 hover:scale-[1.02]"
 >
 {t("cta")}
 <ArrowRight className="w-5 h-5" />
 </LocalizedLink>
 <LocalizedLink
 href="/recommend"
 className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border-2 border-border text-foreground font-semibold text-base hover:border-primary hover:text-primary transition-all duration-300"
 >
 {t("secondaryCta")}
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
