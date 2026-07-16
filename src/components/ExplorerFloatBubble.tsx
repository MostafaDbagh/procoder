"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Compass } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";

/**
 * Floating circular launcher for the Explorer journey (/explorer), shown on the
 * home page. Sits at the bottom "end" corner (right in LTR, left in RTL) with a
 * soft halo, a gentle float, an ages chip, and a hover-reveal label.
 */
export function ExplorerFloatBubble() {
  const t = useTranslations("explorer.meta");
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.9 }}
      className="fixed bottom-6 end-6 z-50"
    >
      <LocalizedLink
        href="/explorer"
        aria-label={`${t("name")} — ${t("tagline")}`}
        className="group relative flex items-center"
      >
        {/* Hover label — fades in beside the circle (desktop only) */}
        <span className="pointer-events-none absolute end-full me-3 hidden whitespace-nowrap rounded-full border border-primary/20 bg-surface px-4 py-2 text-sm font-bold text-primary opacity-0 scale-95 shadow-lg shadow-primary/10 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 sm:block">
          {t("name")} · {t("ages")}
        </span>

        <motion.span
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative block"
        >
          {/* Soft pulsing halo */}
          {!reduceMotion && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-primary/25"
              animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}

          {/* The circle */}
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white shadow-lg shadow-primary/30 ring-4 ring-surface transition-transform duration-300 group-hover:scale-110">
            <Compass className="h-7 w-7" strokeWidth={2.2} />
          </span>

          {/* Ages chip */}
          <span className="absolute -top-1.5 -start-1.5 rounded-full border border-primary/20 bg-surface px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-primary shadow-sm">
            5–7
          </span>
        </motion.span>
      </LocalizedLink>
    </motion.div>
  );
}
