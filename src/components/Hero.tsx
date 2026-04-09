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
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-40 sm:w-72 h-40 sm:h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-52 sm:w-96 h-52 sm:h-96 bg-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[450px] lg:h-[600px] bg-mint/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
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
