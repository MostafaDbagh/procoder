"use client";

import { useTranslations, useLocale } from "next-intl";
import { AnimatedSection, AnimatedCard } from "./AnimatedSection";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, ShieldCheck } from "lucide-react";

export function LearnByFun() {
  const t = useTranslations("learnWithFun");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const cards = [
    {
      icon: Gamepad2,
      title: t("card1Title"),
      desc: t("card1Desc"),
      color: "#3B82F6",
      lightBg: "#EFF6FF",
      darkBg: "rgba(59,130,246,0.08)",
      emoji: "🎮",
      number: "01",
    },
    {
      icon: Trophy,
      title: t("card2Title"),
      desc: t("card2Desc"),
      color: "#F59E0B",
      lightBg: "#FFFBEB",
      darkBg: "rgba(245,158,11,0.08)",
      emoji: "🏆",
      number: "02",
    },
    {
      icon: ShieldCheck,
      title: t("card3Title"),
      desc: t("card3Desc"),
      color: "#10B981",
      lightBg: "#ECFDF5",
      darkBg: "rgba(16,185,129,0.08)",
      emoji: "🛡️",
      number: "03",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          {/* Animated icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background circle */}
                <circle cx="60" cy="60" r="50" fill="#5B7FD6" opacity="0.08" />
                <circle cx="60" cy="60" r="38" fill="#5B7FD6" opacity="0.06" />

                {/* Gamepad body */}
                <rect x="30" y="45" width="60" height="35" rx="12" fill="#5B7FD6" opacity="0.7" />
                <rect x="34" y="49" width="52" height="27" rx="9" fill="#4A6BBF" opacity="0.5" />

                {/* D-pad left */}
                <rect x="40" y="58" width="14" height="5" rx="2" fill="white" opacity="0.8" />
                <rect x="44.5" y="53.5" width="5" height="14" rx="2" fill="white" opacity="0.8" />

                {/* Buttons right */}
                <circle cx="74" cy="57" r="3.5" fill="#D4A46A" opacity="0.9" />
                <circle cx="82" cy="57" r="3.5" fill="#5CC4A0" opacity="0.9" />
                <circle cx="78" cy="52" r="3.5" fill="#C88DA8" opacity="0.9" />
                <circle cx="78" cy="62" r="3.5" fill="#8B7BC8" opacity="0.9" />

                {/* Left grip */}
                <path d="M30 60 Q22 62 20 72 Q19 78 24 80 L32 78 Q30 72 30 65Z" fill="#5B7FD6" opacity="0.6" />
                {/* Right grip */}
                <path d="M90 60 Q98 62 100 72 Q101 78 96 80 L88 78 Q90 72 90 65Z" fill="#5B7FD6" opacity="0.6" />

                {/* Stars bouncing around */}
                <motion.g
                  animate={{ y: [0, -5, 0], rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "25px 30px" }}
                >
                  <path d="M25 24 L27 28 L31 29 L28 32 L29 36 L25 34 L21 36 L22 32 L19 29 L23 28Z" fill="#D4A46A" opacity="0.7" />
                </motion.g>

                <motion.g
                  animate={{ y: [0, -4, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  style={{ transformOrigin: "95px 28px" }}
                >
                  <path d="M95 22 L96.5 26 L100 26.5 L97.5 29 L98 33 L95 31 L92 33 L92.5 29 L90 26.5 L93.5 26Z" fill="#5CC4A0" opacity="0.7" />
                </motion.g>

                <motion.g
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  style={{ transformOrigin: "60px 25px" }}
                >
                  <path d="M60 20 L62 25 L67 25.5 L63 28.5 L64 33 L60 30.5 L56 33 L57 28.5 L53 25.5 L58 25Z" fill="#8B7BC8" opacity="0.6" />
                </motion.g>

                {/* Sparkle dots */}
                <motion.circle cx="15" cy="50" r="2" fill="#D4A46A" opacity="0.5"
                  animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.circle cx="105" cy="45" r="2" fill="#5CC4A0" opacity="0.5"
                  animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.3, 0.8] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }}
                />
                <motion.circle cx="40" cy="95" r="1.5" fill="#8B7BC8" opacity="0.4"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle cx="80" cy="92" r="1.5" fill="#D4A46A" opacity="0.4"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                />
              </svg>
            </motion.div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-3 gap-5 sm:gap-7">
          {cards.map((card, i) => (
            <AnimatedCard key={i} delay={i * 0.12}>
              <div className="relative h-full group">
                {/* Main card */}
                <div className="relative bg-white dark:bg-surface rounded-3xl p-8 h-full border border-border/50 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/[0.06] dark:hover:shadow-black/[0.2]">
                  {/* Colored top strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                    style={{ backgroundColor: card.color }}
                  />

                  {/* Large number — right for EN, left for AR */}
                  <span
                    className={`absolute top-3 ${isRtl ? "left-5" : "right-5"} text-4xl font-black opacity-[0.12] dark:opacity-[0.15] select-none leading-none`}
                    style={{ color: card.color }}
                  >
                    {card.number}
                  </span>

                  {/* Floating emoji — bottom-right for EN, bottom-left for AR */}
                  <motion.span
                    className={`absolute bottom-5 ${isRtl ? "left-5" : "right-5"} text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  >
                    {card.emoji}
                  </motion.span>

                  {/* Icon with colored bg */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <card.icon className="w-7 h-7" style={{ color: card.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">
                      {card.title}
                    </h3>
                  </div>

                  {/* Divider */}
                  <div
                    className="w-10 h-0.5 rounded-full mb-4 transition-all duration-300 group-hover:w-16"
                    style={{ backgroundColor: `${card.color}30` }}
                  />

                  <p className="text-muted leading-relaxed text-[0.95rem]">
                    {card.desc}
                  </p>

                  {/* Bottom decorative dots */}
                  <div className="flex gap-1.5 mt-6">
                    {[0.6, 0.4, 0.2].map((op, di) => (
                      <div
                        key={di}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: card.color, opacity: op }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
