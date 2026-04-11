"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { AuthModal } from "@/components/AuthModal";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import {
  Heart,
  BarChart3,
  Bell,
  FileText,
  ShieldCheck,
  Calendar,
  MessageCircle,
  CheckCircle2,
  Eye,
  Award,
  Clock,
  Video,
  ArrowRight,
  UserPlus,
  Star,
  LayoutDashboard,
} from "lucide-react";

export default function ParentsContent() {
  const t = useTranslations("parents");
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signup" | "login">("signup");

  const trustCards = [
    { icon: BarChart3, title: t("trust1Title"), desc: t("trust1Desc"), color: "bg-blue-400" },
    { icon: Bell, title: t("trust2Title"), desc: t("trust2Desc"), color: "bg-amber-400" },
    { icon: FileText, title: t("trust3Title"), desc: t("trust3Desc"), color: "bg-violet-400" },
    { icon: ShieldCheck, title: t("trust4Title"), desc: t("trust4Desc"), color: "bg-emerald-400" },
    { icon: Calendar, title: t("trust5Title"), desc: t("trust5Desc"), color: "bg-rose-400" },
    { icon: MessageCircle, title: t("trust6Title"), desc: t("trust6Desc"), color: "bg-teal-400" },
  ];

  const dashItems = [
    { icon: BarChart3, text: t("dash1") },
    { icon: Bell, text: t("dash2") },
    { icon: FileText, text: t("dash3") },
    { icon: Clock, text: t("dash4") },
    { icon: Award, text: t("dash5") },
    { icon: Video, text: t("dash6") },
  ];

  const promises = [
    t("promise1"), t("promise2"), t("promise3"),
    t("promise4"), t("promise5"), t("promise6"),
  ];

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-purple/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                {t("badge")}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
                {t("heroTitle")}
              </h1>

              <p className="text-lg text-muted leading-relaxed mb-8 max-w-lg">
                {t("heroSubtitle")}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  <UserPlus className="w-5 h-5 shrink-0" />
                  {t("heroCta")} / {t("loginLink")}
                </button>
                <LocalizedLink
                  href="/parent/login"
                  className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl border-2 border-border bg-surface text-foreground font-semibold shadow-sm transition-all hover:border-primary/45 hover:bg-primary/[0.06] hover:text-primary hover:shadow-md hover:scale-[1.02] dark:hover:bg-primary/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <LayoutDashboard className="w-5 h-5" aria-hidden />
                  </span>
                  <span>{t("openDashboard")}</span>
                </LocalizedLink>
              </div>
            </motion.div>

            {/* Illustration — dashboard mockup */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:block">
              <div className="bg-surface rounded-3xl border border-border p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
                  <span className="text-xs text-muted ml-2">Parent Dashboard</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Courses", value: "3", color: "text-primary" },
                    { label: "Hours", value: "24", color: "text-amber-500" },
                    { label: "Badges", value: "7", color: "text-purple" },
                    { label: "Streak", value: "12d", color: "text-emerald-500" },
                  ].map((s) => (
                    <div key={s.label} className="bg-background rounded-xl p-3 text-center">
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-muted">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs">Python Lesson 12 — Completed</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="text-xs">Instructor: &quot;Great progress on loops!&quot;</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span className="text-xs">Next class: Wednesday 4PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ WHY PARENTS TRUST US ═══ */}
      <section className="py-20 sm:py-28 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("trustTitle")}</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">{t("trustSubtitle")}</p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustCards.map((card, i) => (
              <AnimatedCard key={i} delay={i * 0.08}>
                <article className="bg-surface rounded-2xl border border-border p-7 h-full">
                  <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center mb-5`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{card.desc}</p>
                </article>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("dashTitle")}</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">{t("dashSubtitle")}</p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {dashItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 bg-surface rounded-2xl border border-border p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OUR PROMISE ═══ */}
      <section className="py-20 sm:py-28 bg-surface/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <div className="flex justify-center mb-4">
              <Star className="w-10 h-10 text-amber-400 fill-amber-400/30" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t("promiseTitle")}</h2>
            <p className="text-muted text-lg">{t("promiseSubtitle")}</p>
          </AnimatedSection>

          <div className="space-y-4">
            {promises.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 bg-surface rounded-2xl border border-border p-5"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <p className="font-medium">{p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <div className="bg-primary rounded-3xl p-10 sm:p-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t("ctaTitle")}</h2>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">{t("ctaSubtitle")}</p>
              <button
                onClick={() => { setAuthTab("signup"); setAuthOpen(true); }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-semibold text-lg hover:scale-[1.02] transition-transform shadow-lg"
              >
                {t("ctaButton")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </div>
  );
}
