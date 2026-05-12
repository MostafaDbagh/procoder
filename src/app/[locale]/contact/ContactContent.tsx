"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/AnimatedSection";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion } from "framer-motion";
import { sendContactMessage } from "@/lib/api";
import {
 Mail,
 Phone,
 MapPin,
 Clock,
 CheckCircle2,
 MessageCircle,
} from "lucide-react";
import { KidSendIcon } from "@/components/icons/KidIcons";
import { ChatHeartIcon } from "@/components/icons/PillarIcons";

export default function ContactContent() {
 const t = useTranslations("contact");
 const searchParams = useSearchParams();

 const [form, setForm] = useState({
 name: "",
 email: "",
 phone: "",
 subject: "",
 message: "",
 });

 const subjectParam = searchParams.get("subject");

 useEffect(() => {
 const raw =
 subjectParam ??
 (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("subject") : null);
 if (!raw) return;
 const sanitized = raw.replace(/<[^>]*>/g, "").slice(0, 200).trim();
 if (!sanitized) return;
 setForm((prev) => (prev.subject === sanitized ? prev : { ...prev, subject: sanitized }));
 }, [subjectParam, searchParams.toString()]);
 const [sending, setSending] = useState(false);
 const [sent, setSent] = useState(false);
 const [cooldown, setCooldown] = useState(false);
 const [formLoadedAt] = useState(() => Date.now());
 const [hp, setHp] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (cooldown) return;
 setSending(true);
 try {
 await sendContactMessage({ ...form, _hp: hp, _t: formLoadedAt } as never);
 setSent(true);
 setCooldown(true);
 setTimeout(() => setCooldown(false), 60_000);
 } catch {
 setSent(true);
 } finally {
 setSending(false);
 }
 };

 const whatsappNumber = t("whatsappInfo").replace(/[^0-9+]/g, "").replace("+", "");

 return (
 <div className="relative overflow-hidden py-12 sm:py-20">
 {/* ═══ Decorative background shapes ═══ */}
 <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
 <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-background to-amber-50/40 dark:from-blue-950/20 dark:via-background dark:to-amber-950/10" />
 <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-blue-300/20 dark:bg-blue-500/10 blur-3xl" />
 <div className="absolute -bottom-40 right-1/4 w-[420px] h-[420px] rounded-full bg-violet-300/15 dark:bg-violet-500/10 blur-3xl" />
 <div
 className="absolute inset-0 opacity-[0.08]"
 style={{
 backgroundImage:
 "radial-gradient(circle, rgba(124,58,237,0.45) 1px, transparent 1px)",
 backgroundSize: "26px 26px",
 }}
 />
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-14">
 <div className="flex justify-center mb-5">
 <ChatHeartIcon className="w-20 h-20" />
 </div>
 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
 {t("title")}
 </h1>
 <p className="text-muted text-lg max-w-xl mx-auto">
 {t("subtitle")}
 </p>
 </AnimatedSection>

 <div className="grid lg:grid-cols-2 gap-8 items-stretch">
 {/* ═══ Form ═══ */}
 <AnimatedSection delay={0.1} className="h-full">
 <div className="bg-surface/95 backdrop-blur rounded-2xl border border-border p-7 sm:p-9 shadow-sm h-full flex flex-col">
 <div className="flex items-start gap-4 mb-6">
 <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
 <MessageCircle className="w-5 h-5 text-blue-500" />
 </div>
 <div>
 <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
 {t("formTitle")}
 </h2>
 <p className="text-sm text-muted mt-1">{t("formSubtitle")}</p>
 </div>
 </div>
 {sent ? (
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center py-12"
 >
 <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-5">
 <CheckCircle2 className="w-8 h-8 text-emerald-500" />
 </div>
 <p className="text-lg font-semibold mb-2">{t("success")}</p>
 </motion.div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
 {/* Honeypot */}
 <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
 <label htmlFor="contact-hp">Leave this empty</label>
 <input id="contact-hp" type="text" name="_hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
 </div>
 {/* Row 1: Name + Email (email is required) */}
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
 className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted outline-none"
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-2">
 {t("emailLabel")} <span className="text-red-500">*</span>
 </label>
 <input
 type="email"
 required
 value={form.email}
 onChange={(e) => setForm({ ...form, email: e.target.value })}
 placeholder={t("emailPlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted outline-none"
 />
 </div>
 </div>
 {/* Row 2: Phone (optional) + Subject — one row on sm+ */}
 <div className="grid sm:grid-cols-2 gap-5">
 <div>
 <label className="block text-sm font-medium mb-2">
 {t("phoneLabel")}
 </label>
 <input
 type="tel"
 value={form.phone}
 onChange={(e) => setForm({ ...form, phone: e.target.value })}
 placeholder={t("phonePlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted outline-none"
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-2">
 {t("subjectLabel")}
 </label>
 <input
 type="text"
 value={form.subject}
 onChange={(e) => setForm({ ...form, subject: e.target.value })}
 placeholder={t("subjectPlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted outline-none"
 />
 </div>
 </div>
 <div className="flex-1 flex flex-col min-h-[140px]">
 <label className="block text-sm font-medium mb-2">
 {t("messageLabel")} <span className="text-red-500">*</span>
 </label>
 <textarea
 required
 rows={5}
 value={form.message}
 onChange={(e) => setForm({ ...form, message: e.target.value })}
 placeholder={t("messagePlaceholder")}
 className="w-full flex-1 min-h-[120px] px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted outline-none resize-none"
 />
 </div>
 <button
 type="submit"
 disabled={sending || cooldown}
 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-lg shadow-primary/10 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
 >
 <KidSendIcon className="w-4 h-4" />
 {sending ? t("sending") : t("send")}
 </button>
 </form>
 )}
 </div>
 </AnimatedSection>

 {/* ═══ Sidebar ═══ */}
 <AnimatedSection delay={0.2} className="space-y-5">
 {/* Contact Information — gradient card with 2x2 grid */}
 <div className="rounded-3xl border border-border p-7 sm:p-8 bg-gradient-to-br from-blue-50 via-amber-50/50 to-rose-50/30 dark:from-blue-950/30 dark:via-amber-950/15 dark:to-rose-950/15 shadow-sm">
 <h2 className="text-xl sm:text-2xl font-extrabold mb-6 text-foreground">
 {t("infoTitle")}
 </h2>
 <div className="grid grid-cols-2 gap-x-4 gap-y-6">
 {/* Email Us */}
 <a
 href={`mailto:${t("emailInfo")}`}
 className="group flex items-start gap-3 min-w-0"
 >
 <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
 <Mail className="w-5 h-5 text-blue-500" />
 </div>
 <div className="min-w-0">
 <div className="text-xs text-muted mb-1">{t("emailUsLabel")}</div>
 <div className="text-sm font-bold break-all group-hover:text-primary transition-colors" dir="ltr">
 {t("emailInfo")}
 </div>
 </div>
 </a>

 {/* Call Us */}
 <a
 href={`tel:${t("phoneInfo").replace(/\s/g, "")}`}
 className="group flex items-start gap-3 min-w-0"
 >
 <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
 <Phone className="w-5 h-5 text-amber-600" />
 </div>
 <div className="min-w-0">
 <div className="text-xs text-muted mb-1">{t("callUsLabel")}:</div>
 <div className="text-sm font-bold group-hover:text-primary transition-colors" dir="ltr">
 {t("phoneInfo")}
 </div>
 </div>
 </a>

 {/* Location */}
 <div className="flex items-start gap-3 min-w-0">
 <div className="w-11 h-11 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
 <MapPin className="w-5 h-5 text-violet-500" />
 </div>
 <div className="min-w-0">
 <div className="text-xs text-muted mb-1">{t("locationLabel")}</div>
 <div className="text-sm font-bold">{t("locationInfo")}</div>
 </div>
 </div>

 {/* Hours */}
 <div className="flex items-start gap-3 min-w-0">
 <div className="w-11 h-11 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
 <Clock className="w-5 h-5 text-rose-500" />
 </div>
 <div className="min-w-0">
 <div className="text-xs text-muted mb-1">{t("hoursLabel")}</div>
 <div className="text-sm font-bold">{t("hoursInfo")}</div>
 </div>
 </div>
 </div>
 </div>

 {/* Common Questions + Chat With Us — 2 cards */}
 <div className="grid sm:grid-cols-2 gap-4">
 <div className="bg-surface rounded-2xl border border-border p-6 flex flex-col">
 <h3 className="text-lg font-extrabold mb-2">{t("commonQTitle")}</h3>
 <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
 {t("commonQDesc")}
 </p>
 <LocalizedLink
 href="/faq"
 className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-blue-400/60 text-blue-500 text-sm font-semibold hover:bg-blue-500/10 transition-colors self-start"
 >
 {t("viewFaqsBtn")}
 </LocalizedLink>
 </div>

 <div className="bg-surface rounded-2xl border border-border p-6 flex flex-col">
 <h3 className="text-lg font-extrabold mb-2">{t("chatTitle")}</h3>
 <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
 {t("chatDesc")}
 </p>
 <a
 href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi StemTechLab! I'd like to learn more about your kids' classes.")}`}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-blue-400/60 text-blue-500 text-sm font-semibold hover:bg-blue-500/10 transition-colors self-start"
 >
 {t("whatsappBtn")}
 <MessageCircle className="w-4 h-4" />
 </a>
 </div>
 </div>
 </AnimatedSection>
 </div>
 </div>
 </div>
 );
}
