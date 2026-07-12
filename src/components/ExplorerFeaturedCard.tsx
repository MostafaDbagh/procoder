"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Compass, Sparkles, Clock, CalendarDays, Users } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { KidArrowRightIcon } from "@/components/icons/KidIcons";

/**
 * Discovery entry point for the Explorer guided window (/explorer). Rendered on
 * the courses page above the catalog grid. Explorer is a foundational journey
 * with its own guided flow, so it links to /explorer rather than the standard
 * /courses/[id] detail page.
 */
export function ExplorerFeaturedCard() {
  const t = useTranslations("explorer.meta");

  const stats = [
    { icon: Users, label: t("ages") },
    { icon: CalendarDays, label: t("sessions") },
    { icon: Clock, label: t("duration") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <LocalizedLink href="/explorer" className="group block">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 p-6 text-white transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 sm:p-8">
          <div className="pointer-events-none absolute -top-10 -end-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-12 -start-8 h-48 w-48 rounded-full bg-white/10" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                {t("badge")}
              </span>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <Compass className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold leading-tight">{t("name")}</h2>
                  <p className="text-sm font-medium text-white/90">{t("tagline")}</p>
                </div>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90">
                {t("desc")}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/90">
                {stats.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    <s.icon className="h-3.5 w-3.5" />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-indigo-600 shadow-md transition-all group-hover:gap-3">
                {t("cta")}
                <KidArrowRightIcon className="h-5 w-5 rtl:rotate-180" />
              </span>
            </div>
          </div>
        </div>
      </LocalizedLink>
    </motion.div>
  );
}
