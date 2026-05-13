"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { sendContactMessage } from "@/lib/api";
import {
  CheckCircle2,
  Users,
  GraduationCap,
} from "lucide-react";
import { ChatHeartIcon } from "@/components/icons/PillarIcons";
import { VideoCameraIcon, GiftBoxIcon, SmileIcon } from "@/components/icons/KidIcons";

export default function FreeTrialContent() {
  const t = useTranslations("freeTrial");
  const tc = useTranslations("homeCta");

  const [form, setForm] = useState({ name: "", email: "", child: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return;
    let cancelled = false;
    (async () => {
      const { default: confetti } = await import("canvas-confetti");
      if (cancelled) return;
      const colors = ["#A78BFA", "#FBBF24", "#10B981", "#F472B6", "#67E8F9"];
      // Two angled bursts for a celebratory left+right pop.
      confetti({ particleCount: 90, spread: 70, startVelocity: 45, origin: { x: 0.2, y: 0.6 }, colors });
      confetti({ particleCount: 90, spread: 70, startVelocity: 45, origin: { x: 0.8, y: 0.6 }, colors });
    })();
    return () => {
      cancelled = true;
    };
  }, [sent]);
  const [hp, setHp] = useState("");
  const [formLoadedAt] = useState(() => Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: "Free Trial Request",
        message: `Child: ${form.child || "N/A"}\nMobile: ${form.phone || "N/A"}`,
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
    { icon: ChatHeartIcon, title: t("step1Title"), desc: t("step1Desc"), bubble: "bg-primary/10 border-primary/20" },
    { icon: VideoCameraIcon, title: t("step2Title"), desc: t("step2Desc"), bubble: "bg-emerald-400/10 border-emerald-400/30" },
    { icon: GiftBoxIcon, title: t("step3Title"), desc: t("step3Desc"), bubble: "bg-amber-400/10 border-amber-400/30" },
  ];

  const includes = [
    t("include1"), t("include2"), t("include3"),
    t("include4"), t("include5"), t("include6"),
  ];

  const trustBadges = [
    { icon: Users, label: t("trustBadge1") },
    { icon: Users, label: t("trustBadge2") },
    { icon: GraduationCap, label: t("trustBadge3") },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <AnimatedSection className="text-center mb-16">
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                    <input type="text" name="_hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {tc("formNameLabel")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={tc("formNamePlaceholder")}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border placeholder:text-muted outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {tc("formEmailLabel")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={tc("formEmailPlaceholder")}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border placeholder:text-muted outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {tc("formChildLabel")}
                    </label>
                    <input
                      type="text"
                      value={form.child}
                      onChange={(e) => setForm({ ...form, child: e.target.value })}
                      placeholder={tc("formChildPlaceholder")}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border placeholder:text-muted outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {tc("formPhoneLabel")}
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder={tc("formPhonePlaceholder")}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border placeholder:text-muted outline-none focus:border-primary transition-all"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2.5"
                  >
                    {sending ? (
                      t("submitting")
                    ) : (
                      <>
                        <SmileIcon className="w-7 h-7" />
                        {t("submit").replace(/\s*[→←]\s*$/, "")}
                      </>
                    )}
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

        {/* Steps */}
        <AnimatedSection className="mb-16">
          <div className="grid sm:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <AnimatedCard key={i} delay={0.07 * i}>
                <div className="bg-surface border border-border rounded-2xl p-7 text-center">
                  <div className={`w-20 h-20 rounded-3xl border-2 ${s.bubble} flex items-center justify-center mx-auto mb-4`}>
                    <s.icon className="w-12 h-12" />
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

      </div>
    </div>
  );
}
