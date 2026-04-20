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

 const subjectParam = searchParams.get("subject");

 // Pre-fill subject from URL (sanitized). `window.location` covers cases where the hook is briefly empty after client navigation.
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
 // Anti-bot: track when the form was first rendered
 const [formLoadedAt] = useState(() => Date.now());
 // Honeypot — invisible field that bots fill
 const [hp, setHp] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (cooldown) return;
 setSending(true);
 try {
 await sendContactMessage({ ...form, _hp: hp, _t: formLoadedAt } as never);
 setSent(true);
 // Cooldown: prevent re-submit for 60 s even if user navigates back
 setCooldown(true);
 setTimeout(() => setCooldown(false), 60_000);
 } catch {
 setSent(true);
 } finally {
 setSending(false);
 }
 };

 const whatsappNumber = t("whatsappInfo").replace(/[^0-9+]/g, "").replace("+", "");
 const WhatsAppIcon = ({ className }: { className?: string }) => (
 <svg viewBox="0 0 24 24" className={className} fill="currentColor">
 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
 </svg>
 );
 const contactInfo = [
 { icon: Mail, label: t("emailInfo"), color: "from-blue-400 to-cyan-400", href: `mailto:${t("emailInfo")}` },
 { icon: Phone, label: t("phoneInfo"), color: "from-emerald-400 to-teal-400", href: `tel:${t("phoneInfo").replace(/\s/g, "")}` },
 { icon: WhatsAppIcon, label: t("whatsappInfo"), color: "from-[#25D366] to-[#128C7E]", href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi StemTechLab! I'd like to learn more about your kids' classes.")}`, external: true },
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
 {/* Honeypot — hidden from humans, bots auto-fill it */}
 <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
 <label htmlFor="contact-hp">Leave this empty</label>
 <input id="contact-hp" type="text" name="_hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
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
 disabled={sending || cooldown}
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
 <span className="text-sm font-medium" dir="ltr">{info.label}</span>
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
