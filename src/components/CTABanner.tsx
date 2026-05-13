"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AnimatedSection } from "./AnimatedSection";
import {
 CheckCircle2,
 Atom,
 Video,
 FileText,
 Target,
 MapPin,
} from "lucide-react";
import { sendContactMessage } from "@/lib/api";
import { BrainPattern } from "./BrainPatterns";
import { Mascot } from "./Mascot";
import { KidSendIcon } from "./icons/KidIcons";
import { emailError, phoneError, isValidEmail, isValidUAEPhone } from "@/lib/validation";

const FEATURES = [
 { icon: Video, key: "feature1" },
 { icon: FileText, key: "feature2" },
 { icon: Target, key: "feature3" },
 { icon: MapPin, key: "feature4" },
] as const;

const TAG_KEYS = ["tag1", "tag2", "tag4", "tag5", "tag6"] as const;

export function CTABanner() {
 const t = useTranslations("homeCta");
 const locale = useLocale();
 const lang: "en" | "ar" = locale === "ar" ? "ar" : "en";
 const [form, setForm] = useState({ name: "", email: "", child: "", phone: "" });
 const [errors, setErrors] = useState({ email: "", phone: "" });
 const [loading, setLoading] = useState(false);
 const [done, setDone] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (loading) return;
 const emailErr = isValidEmail(form.email) ? "" : emailError(form.email || "_", lang);
 const phoneErr = form.phone && !isValidUAEPhone(form.phone) ? phoneError(form.phone, lang) : "";
 if (emailErr || phoneErr) {
 setErrors({ email: emailErr, phone: phoneErr });
 return;
 }
 setLoading(true);
 try {
 await sendContactMessage({
 name: form.name,
 email: form.email,
 phone: form.phone,
 subject: "Homepage CTA — Free Trial Request",
 message: `Child: ${form.child || "N/A"}\nMobile: ${form.phone || "N/A"}`,
 } as never);
 setDone(true);
 } catch {
 setDone(true);
 } finally {
 setLoading(false);
 }
 };

 return (
 <section className="relative overflow-hidden py-20 sm:py-28">
 <BrainPattern variant="tips" />
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection>
 <div className="relative">
 {/* Peeking Bobo — top-right corner, only on lg+ where the 2-col layout gives him room next to the form */}
 <div className="hidden lg:block absolute right-4 -top-2 -translate-y-1/3 pointer-events-none rotate-[8deg] z-20">
 <Mascot pose="wave" size={110} />
 </div>
 <div className="relative overflow-hidden rounded-3xl border-0 border-t-4 border-l-4 border-r-4 border-b-8 border-t-border border-l-border border-r-border border-b-primary/50 bg-surface p-6 sm:p-10 lg:p-14">
 {/* Decorative blobs */}
 <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/8 blur-3xl" />
 <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-purple/8 blur-3xl" />

 {/* Corner icons */}
 <div className="absolute bottom-5 right-5 w-10 h-10 rounded-2xl bg-mint/10 flex items-center justify-center rotate-[-10deg] z-10">
 <Atom className="w-5 h-5 text-mint" />
 </div>

 <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-y-6 lg:gap-x-14 items-center pt-12 sm:pt-10">
 {/* ─── TEXT (mobile #1, desktop col 1 / row 1) ─── */}
 <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1">
 {/* Title with highlighted words */}
 <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5 leading-[1.15]">
 {t.rich("title", {
 hl1: (chunks) => (
 <span className="relative inline-block">
 <span className="relative z-10">{chunks}</span>
 <span className="absolute left-0 right-0 bottom-0 h-1.5 sm:h-2 lg:h-2.5 bg-amber-300/70 rounded-sm" />
 </span>
 ),
 hl2: (chunks) => (
 <span className="relative inline-block text-purple">
 <span className="relative z-10">{chunks}</span>
 <span className="absolute left-0 right-0 bottom-0 h-1.5 sm:h-2 lg:h-2.5 bg-amber-300/70 rounded-sm" />
 </span>
 ),
 })}
 </h2>

 <p className="text-muted text-base sm:text-lg leading-relaxed mb-6">
 {t("description")}
 </p>

 {/* Tags */}
 <div className="flex flex-wrap gap-2">
 {TAG_KEYS.map((k) => (
 <span
 key={k}
 className="px-3.5 py-1.5 rounded-full bg-foreground text-background text-xs sm:text-sm font-semibold"
 >
 {t(k)}
 </span>
 ))}
 </div>
 </div>

 {/* ─── FEATURES — 4 boxes (mobile #3, desktop col 1 / row 2) ─── */}
 <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 grid sm:grid-cols-2 gap-3 lg:pt-6 lg:border-t lg:border-border">
 {FEATURES.map(({ icon: Icon, key }) => (
 <div
 key={key}
 className="flex items-center gap-3 p-3.5 bg-background rounded-xl border border-border"
 >
 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
 <Icon className="w-5 h-5 text-primary" />
 </div>
 <div className="min-w-0">
 <div className="text-sm font-bold truncate">{t(`${key}Title`)}</div>
 <div className="text-xs text-muted truncate">{t(`${key}Desc`)}</div>
 </div>
 </div>
 ))}
 </div>

 {/* ─── FORM (mobile #2, desktop col 2 spans rows 1-2) ─── */}
 <div className="relative z-10 order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 bg-background/85 backdrop-blur rounded-2xl border border-border p-6 sm:p-8 shadow-xl shadow-primary/5">
 {done ? (
 <div className="text-center py-12">
 <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-5">
 <CheckCircle2 className="w-8 h-8 text-emerald-500" />
 </div>
 <p className="text-lg font-semibold">{t("formSuccess")}</p>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-sm font-semibold mb-2">
 {t("formNameLabel")} <span className="text-red-500">*</span>
 </label>
 <input
 type="text"
 required
 value={form.name}
 onChange={(e) => setForm({ ...form, name: e.target.value })}
 placeholder={t("formNamePlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border placeholder:text-muted outline-none focus:border-primary transition-all"
 />
 </div>
 <div>
 <label className="block text-sm font-semibold mb-2">
 {t("formEmailLabel")} <span className="text-red-500">*</span>
 </label>
 <input
 type="email"
 required
 value={form.email}
 onChange={(e) => {
 setForm({ ...form, email: e.target.value });
 if (errors.email) setErrors({ ...errors, email: "" });
 }}
 onBlur={(e) => setErrors({ ...errors, email: emailError(e.target.value, lang) })}
 placeholder={t("formEmailPlaceholder")}
 aria-invalid={!!errors.email}
 className={`w-full px-4 py-3 rounded-xl bg-background border placeholder:text-muted outline-none transition-all ${errors.email ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"}`}
 />
 {errors.email && (
 <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
 )}
 </div>
 <div>
 <label className="block text-sm font-semibold mb-2">
 {t("formChildLabel")}
 </label>
 <input
 type="text"
 value={form.child}
 onChange={(e) => setForm({ ...form, child: e.target.value })}
 placeholder={t("formChildPlaceholder")}
 className="w-full px-4 py-3 rounded-xl bg-background border border-border placeholder:text-muted outline-none focus:border-primary transition-all"
 />
 </div>
 <div>
 <label className="block text-sm font-semibold mb-2">
 {t("formPhoneLabel")}
 </label>
 <input
 type="tel"
 inputMode="tel"
 value={form.phone}
 onChange={(e) => {
 setForm({ ...form, phone: e.target.value });
 if (errors.phone) setErrors({ ...errors, phone: "" });
 }}
 onBlur={(e) => setErrors({ ...errors, phone: phoneError(e.target.value, lang) })}
 placeholder={t("formPhonePlaceholder")}
 aria-invalid={!!errors.phone}
 className={`w-full px-4 py-3 rounded-xl bg-background border placeholder:text-muted outline-none transition-all ${errors.phone ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"}`}
 dir="ltr"
 />
 {errors.phone && (
 <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>
 )}
 </div>
 <button
 type="submit"
 disabled={loading}
 className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 hover:opacity-90 hover:shadow-xl active:scale-[0.99] transition-all disabled:opacity-60"
 >
 {loading ? (
 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 ) : (
 <KidSendIcon className="w-4 h-4" />
 )}
 {loading ? t("formSending") : t("formSubmit")}
 </button>
 </form>
 )}
 </div>
 </div>
 </div>
 </div>
 </AnimatedSection>
 </div>
 </section>
 );
}
