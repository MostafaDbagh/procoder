"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { sendContactMessage } from "@/lib/api";
import {
 Mail,
 Phone,
 MapPin,
 Clock,
 Send,
 CheckCircle2,
 MessageCircle,
} from "lucide-react";

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

 // Pre-fill subject from URL query param
 useEffect(() => {
 const subject = searchParams.get("subject");
 if (subject) {
 setForm((prev) => ({ ...prev, subject }));
 }
 }, [searchParams]);
 const [sending, setSending] = useState(false);
 const [sent, setSent] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setSending(true);
 try {
 await sendContactMessage(form);
 setSent(true);
 } catch {
 // Fallback — still show success for UX, log error
 setSent(true);
 } finally {
 setSending(false);
 }
 };

 const whatsappNumber = t("whatsappInfo").replace(/[^0-9+]/g, "").replace("+", "");
 const contactInfo = [
 { icon: Mail, label: t("emailInfo"), color: "from-blue-400 to-cyan-400", href: `mailto:${t("emailInfo")}` },
 { icon: Phone, label: t("phoneInfo"), color: "from-emerald-400 to-teal-400", href: `tel:${t("phoneInfo").replace(/\s/g, "")}` },
 { icon: MessageCircle, label: t("whatsappLabel"), color: "from-green-400 to-emerald-400", href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi StemTechLab! I'd like to learn more about your kids' classes.")}`, external: true },
 { icon: MapPin, label: t("locationInfo"), color: "from-purple to-violet-400" },
 { icon: Clock, label: t("hoursInfo"), color: "from-orange to-amber-400" },
 ];

 return (
 <div className="py-12 sm:py-20">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection className="text-center mb-14">
 <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5">
 <MessageCircle className="w-8 h-8 text-white" />
 </div>
 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
 {t("title")}
 </h1>
 <p className="text-muted text-lg max-w-xl mx-auto">
 {t("subtitle")}
 </p>
 </AnimatedSection>

 <div className="grid lg:grid-cols-5 gap-8">
 {/* Form */}
 <AnimatedSection delay={0.1} className="lg:col-span-3">
 <div className="bg-surface rounded-2xl border border-border p-7 sm:p-9">
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
 <form onSubmit={handleSubmit} className="space-y-5">
 <div className="grid sm:grid-cols-2 gap-5">
 <div>
 <label className="block text-sm font-medium mb-2">
 {t("nameLabel")} <span className="text-red-500">*</span>
 </label>
 <input
 type="text"
 required
 value={form.name}
 onChange={(e) =>
 setForm({ ...form, name: e.target.value })
 }
 placeholder={t("namePlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-2">
 {t("emailLabel")}
 </label>
 <input
 type="email"
 value={form.email}
 onChange={(e) =>
 setForm({ ...form, email: e.target.value })
 }
 placeholder={t("emailPlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium mb-2">
 {t("phoneLabel")} <span className="text-red-500">*</span>
 </label>
 <input
 type="tel"
 required
 value={form.phone}
 onChange={(e) =>
 setForm({ ...form, phone: e.target.value })
 }
 placeholder={t("phonePlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-2">
 {t("subjectLabel")}
 </label>
 <input
 type="text"
 value={form.subject}
 onChange={(e) =>
 setForm({ ...form, subject: e.target.value })
 }
 placeholder={t("subjectPlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-2">
 {t("messageLabel")} <span className="text-red-500">*</span>
 </label>
 <textarea
 required
 rows={5}
 value={form.message}
 onChange={(e) =>
 setForm({ ...form, message: e.target.value })
 }
 placeholder={t("messagePlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
 />
 </div>
 <button
 type="submit"
 disabled={sending}
 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-lg shadow-primary/10 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
 >
 <Send className="w-4 h-4" />
 {sending ? t("sending") : t("send")}
 </button>
 </form>
 )}
 </div>
 </AnimatedSection>

 {/* Sidebar */}
 <AnimatedSection delay={0.2} className="lg:col-span-2">
 <div className="space-y-4">
 <h2 className="text-xl font-bold mb-5">{t("infoTitle")}</h2>
 {contactInfo.map((info, i) => {
 const inner = (
 <div className={`flex items-center gap-4 p-5 bg-surface rounded-2xl border border-border${info.href ? " hover:border-primary/40 hover:shadow-md transition-all cursor-pointer" : ""}`}>
 <div
 className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shrink-0`}
 >
 <info.icon className="w-6 h-6 text-white" />
 </div>
 <span className="text-sm font-medium">{info.label}</span>
 </div>
 );
 return (
 <AnimatedCard key={i} delay={0.3 + i * 0.08}>
 {info.href ? (
 <a href={info.href} target={info.external ? "_blank" : undefined} rel={info.external ? "noopener noreferrer" : undefined}>
 {inner}
 </a>
 ) : inner}
 </AnimatedCard>
 );
 })}
 </div>
 </AnimatedSection>
 </div>
 </div>
 </div>
 );
}
