"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { sendContactMessage } from "@/lib/api";
import {
  CheckCircle2,
  Rocket,
  Users,
  Star,
  Clock,
  Video,
  MessageCircle,
  Gift,
} from "lucide-react";

const AGES = Array.from({ length: 13 }, (_, i) => i + 6);

export default function FreeTrialContent() {
  const t = useTranslations("freeTrial");

  const [form, setForm] = useState({ name: "", phone: "", age: "", interest: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [hp, setHp] = useState("");
  const [formLoadedAt] = useState(() => Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendContactMessage({
        name: form.name,
        phone: form.phone,
        subject: `Free Trial Request — Age ${form.age} — ${form.interest}`,
        message: `Child age: ${form.age}\nInterest: ${form.interest}\n\n${form.message}`,
        email: "",
        _hp: hp,
        _t: formLoadedAt,
      } as never);
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  const steps = [
    { icon: MessageCircle, title: t("step1Title"), desc: t("step1Desc"), color: "from-primary to-purple" },
    { icon: Video, title: t("step2Title"), desc: t("step2Desc"), color: "from-emerald-400 to-teal-500" },
    { icon: Gift, title: t("step3Title"), desc: t("step3Desc"), color: "from-orange-400 to-amber-500" },
  ];

  const includes = [
    t("include1"), t("include2"), t("include3"),
    t("include4"), t("include5"), t("include6"),
  ];

  const trustBadges = [
    { icon: Users, label: t("trustBadge1") },
    { icon: Star, label: t("trustBadge2") },
    { icon: Clock, label: t("trustBadge3") },
  ];

  const interests = [
    { value: "programming", label: t("interestProgramming") },
    { value: "robotics", label: t("interestRobotics") },
    { value: "algorithms", label: t("interestAlgorithms") },
    { value: "arabic", label: t("interestArabic") },
    { value: "gamedev", label: t("interestGameDev") },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            <Rocket className="w-4 h-4" />
            {t("badgeLabel")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
            {t("title")}
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto mb-8">{t("subtitle")}</p>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm font-medium">
                <Icon className="w-4 h-4 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Steps */}
        <AnimatedSection className="mb-16">
          <div className="grid sm:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <AnimatedCard key={i} delay={0.07 * i}>
                <div className="bg-surface border border-border rounded-2xl p-7 text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4`}>
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mx-auto mb-3">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-muted text-sm">{s.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        {/* Main: form + includes */}
        <div className="grid lg:grid-cols-5 gap-8 mb-16">

          {/* Form */}
          <AnimatedSection delay={0.1} className="lg:col-span-3">
            <div className="bg-surface rounded-3xl border border-border p-7 sm:p-9">
              <h2 className="text-2xl font-bold mb-1">{t("formTitle")}</h2>
              <p className="text-muted text-sm mb-7">{t("formSubtitle")}</p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-14"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("successTitle")}</h3>
                  <p className="text-muted text-sm max-w-sm mx-auto">{t("successDesc")}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                    <input type="text" name="_hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("nameLabel")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t("namePlaceholder")}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("phoneLabel")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder={t("phonePlaceholder")}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("childAgeLabel")} <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      >
                        <option value="">{t("selectAge")}</option>
                        {AGES.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("interestLabel")} <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={form.interest}
                        onChange={(e) => setForm({ ...form, interest: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      >
                        <option value="">{t("selectInterest")}</option>
                        {interests.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t("messageLabel")}</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t("messagePlaceholder")}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {sending ? t("submitting") : t("submit")}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>

          {/* What's included */}
          <AnimatedSection delay={0.2} className="lg:col-span-2">
            <div className="bg-primary rounded-3xl p-7 sm:p-9 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple/20 rounded-full blur-2xl" />
              <div className="relative">
                <h2 className="text-xl font-bold text-white mb-7">{t("includesTitle")}</h2>
                <ul className="space-y-4">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                      <span className="text-white/90 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>

      </div>
    </div>
  );
}
