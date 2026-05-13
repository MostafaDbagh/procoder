"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
 X,
 CheckCircle2,
 GraduationCap,
 ArrowRight,
 ArrowLeft,
 User,
 Baby,
 Clock,
 FileText,
 Sparkles,
 Star,
 PartyPopper,
} from "lucide-react";
import { Mascot } from "./Mascot";

import {
 createEnrollment,
 quotePromo,
 type PromoQuoteResponse,
} from "@/lib/api";
import { formatCoursePrice } from "@/lib/formatCoursePrice";
import { emailError, phoneError, isValidEmail, isValidUAEPhone } from "@/lib/validation";

interface EnrollModalProps {
 open: boolean;
 onClose: () => void;
 courseTitle: string;
 courseId: string;
}

const STEPS = 4;

const inputCls =
 "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary transition-all outline-none";
const inputErrCls =
 "w-full px-4 py-3 rounded-xl bg-background border border-red-400 text-foreground placeholder:text-muted focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all outline-none";
const selectCls =
 "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:border-primary transition-all outline-none";
const selectErrCls =
 "w-full px-4 py-3 rounded-xl bg-background border border-red-400 text-foreground focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all outline-none";
const labelCls = "block text-sm font-medium mb-2";
const errSpan = <span className="mt-1 text-xs text-red-500 font-medium">This field is required</span>;

export function EnrollModal({ open, onClose, courseTitle, courseId }: EnrollModalProps) {
 const t = useTranslations("enroll");
 const locale = useLocale();
 const valLang: "en" | "ar" = locale === "ar" ? "ar" : "en";
 const [fieldErrors, setFieldErrors] = useState({ email: "", phone: "" });
 const [step, setStep] = useState(1);
 const [submitting, setSubmitting] = useState(false);
 const [success, setSuccess] = useState(false);
 const [successAmount, setSuccessAmount] = useState<{
 amountDue: number;
 currency: string;
 } | null>(null);

 const [form, setForm] = useState({
 parentName: "",
 email: "",
 phone: "",
 relationship: "",
 childName: "",
 childAge: "",
 childGender: "",
 gradeLevel: "",
 previousExperience: "",
 preferredDays: [] as string[],
 preferredTime: "",
 /** Fixed to online live only (see schedule step). */
 sessionFormat: "online_live",
 startDate: "",
 learningGoals: "",
 specialNeeds: "",
 howDidYouHear: "",
 agreeTerms: false,
 agreePhotos: false,
 });

 const [promoInput, setPromoInput] = useState("");
 const [priceQuote, setPriceQuote] = useState<PromoQuoteResponse | null>(null);
 const [quoteLoading, setQuoteLoading] = useState(false);
 const [quoteErr, setQuoteErr] = useState("");

 const refreshQuote = useCallback(
 async (code?: string) => {
 setQuoteLoading(true);
 setQuoteErr("");
 try {
 const email = form.email.trim() || undefined;
 const q = await quotePromo(courseId, code, email);
 setPriceQuote(q);
 } catch (e) {
 setPriceQuote(null);
 setQuoteErr(e instanceof Error ? e.message : "Quote failed");
 } finally {
 setQuoteLoading(false);
 }
 },
 [courseId, form.email]
 );

 useEffect(() => {
 if (!open || step !== 4) return;
 void refreshQuote();
 }, [open, step, refreshQuote]);

 // Celebrate when enrollment completes — multiple confetti bursts in brand colors.
 useEffect(() => {
 if (!success) return;
 let cancelled = false;
 const timers: ReturnType<typeof setTimeout>[] = [];
 (async () => {
 const { default: confetti } = await import("canvas-confetti");
 if (cancelled) return;
 const colors = ["#A78BFA", "#FBBF24", "#10B981", "#F472B6", "#67E8F9"];
 const burst = (x: number, particles = 110) =>
 confetti({ particleCount: particles, spread: 80, startVelocity: 50, origin: { x, y: 0.5 }, colors, scalar: 1.1 });
 // Opening double burst
 burst(0.2);
 burst(0.8);
 // Second wave — keeps the energy going
 timers.push(setTimeout(() => { if (!cancelled) { burst(0.3, 70); burst(0.7, 70); } }, 700));
 // Final overhead shower
 timers.push(setTimeout(() => {
 if (cancelled) return;
 confetti({ particleCount: 120, spread: 160, startVelocity: 35, origin: { x: 0.5, y: 0.2 }, colors, scalar: 0.9, ticks: 220 });
 }, 1400));
 })();
 return () => {
 cancelled = true;
 timers.forEach(clearTimeout);
 };
 }, [success]);

 const set = (key: string, value: string | boolean | string[]) =>
 setForm((p) => ({ ...p, [key]: value }));

 const toggleDay = (day: string) =>
 setForm((p) => ({
 ...p,
 preferredDays: p.preferredDays.includes(day)
 ? p.preferredDays.filter((d) => d !== day)
 : [...p.preferredDays, day],
 }));

 const [error, setError] = useState("");
 const [stepAttempted, setStepAttempted] = useState(false);

 // Anti-bot: track when the modal was first opened
 const [formLoadedAt] = useState(() => Date.now());
 // Honeypot — invisible field that bots fill
 const [hp, setHp] = useState("");
 const [cooldown, setCooldown] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (cooldown) return;
 if (!canNext()) { setStepAttempted(true); return; }
 setSubmitting(true);
 setError("");
 try {
 const res = await createEnrollment({
 parentName: form.parentName,
 email: form.email,
 phone: form.phone,
 relationship: form.relationship,
 childName: form.childName,
 childAge: Number(form.childAge),
 childGender: form.childGender || undefined,
 gradeLevel: form.gradeLevel,
 previousExperience: form.previousExperience || undefined,
 courseId,
 courseTitle,
 preferredDays: form.preferredDays,
 preferredTime: form.preferredTime,
 sessionFormat: form.sessionFormat,
 startDate: form.startDate || undefined,
 learningGoals: form.learningGoals || undefined,
 specialNeeds: form.specialNeeds || undefined,
 howDidYouHear: form.howDidYouHear || undefined,
 agreeTerms: form.agreeTerms,
 agreePhotos: form.agreePhotos || undefined,
 promoCode: promoInput.trim() || undefined,
 _hp: hp,
 _t: formLoadedAt,
 } as never);
 if (
 res.pricing &&
 typeof res.pricing.amountDue === "number" &&
 res.pricing.amountDue > 0
 ) {
 setSuccessAmount({
 amountDue: res.pricing.amountDue,
 currency: res.pricing.currency,
 });
 } else {
 setSuccessAmount(null);
 }
 setSuccess(true);
 // Cooldown: prevent rapid re-enrollment
 setCooldown(true);
 setTimeout(() => setCooldown(false), 60_000);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Enrollment failed. Please try again.");
 } finally {
 setSubmitting(false);
 }
 };

 const handleClose = () => {
 onClose();
 setTimeout(() => {
 setSuccess(false);
 setSuccessAmount(null);
 setStep(1);
 setError("");
 setPromoInput("");
 setPriceQuote(null);
 setQuoteErr("");
 setForm({
 parentName: "",
 email: "",
 phone: "",
 relationship: "",
 childName: "",
 childAge: "",
 childGender: "",
 gradeLevel: "",
 previousExperience: "",
 preferredDays: [],
 preferredTime: "",
 sessionFormat: "online_live",
 startDate: "",
 learningGoals: "",
 specialNeeds: "",
 howDidYouHear: "",
 agreeTerms: false,
 agreePhotos: false,
 });
 }, 300);
 };

 const canNext = () => {
 switch (step) {
 case 1:
 return (
 form.parentName &&
 form.email &&
 isValidEmail(form.email) &&
 form.phone &&
 isValidUAEPhone(form.phone) &&
 form.relationship
 );
 case 2:
 return form.childName && form.childAge && form.gradeLevel;
 case 3:
 return form.preferredDays.length > 0 && !!form.preferredTime;
 case 4:
 return form.agreeTerms;
 default:
 return true;
 }
 };

 const stepIcons = [User, Baby, Clock, FileText];
 const stepKeys = ["stepParent", "stepChild", "stepSchedule", "stepAdditional"] as const;

 return (
 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] flex items-center justify-center p-4"
 >
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
 onClick={handleClose}
 />

 <motion.div
 data-testid="enroll-modal"
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 transition={{ type: "spring", damping: 25, stiffness: 300 }}
 className="relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
 >
 {/* Header */}
 <div className="sticky top-0 z-10 bg-surface border-b border-border rounded-t-2xl">
 <div className="flex items-center justify-between p-5">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
 <GraduationCap className="w-5 h-5 text-white" />
 </div>
 <div>
 <h2 className="font-bold">{t("title")}</h2>
 <p className="text-sm text-muted line-clamp-1">{courseTitle}</p>
 </div>
 </div>
 <button
 onClick={handleClose}
 className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Step indicator */}
 {!success && (
 <div className="px-5 pb-4">
 <div className="flex items-center gap-1">
 {Array.from({ length: STEPS }, (_, i) => {
 const Icon = stepIcons[i];
 const active = step === i + 1;
 const done = step > i + 1;
 return (
 <div key={i} className="flex-1 flex items-center gap-1">
 <button
 type="button"
 onClick={() => done && setStep(i + 1)}
 className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all w-full justify-center ${
 active
 ? "bg-primary/10 text-primary"
 : done
 ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 cursor-pointer"
 : "text-muted"
 }`}
 >
 {done ? (
 <CheckCircle2 className="w-3.5 h-3.5" />
 ) : (
 <Icon className="w-3.5 h-3.5" />
 )}
 <span className="hidden sm:inline">{t(stepKeys[i])}</span>
 </button>
 {i < STEPS - 1 && (
 <div className={`w-4 h-0.5 shrink-0 rounded ${done ? "bg-emerald-400" : "bg-border"}`} />
 )}
 </div>
 );
 })}
 </div>
 </div>
 )}
 </div>

 {/* Body */}
 <div className="p-5 sm:p-6">
 {success ? (
 <motion.div
 initial={{ opacity: 0, scale: 0.92 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.4 }}
 className="relative text-center py-8 sm:py-10 overflow-hidden"
 >
 {/* Soft animated gradient backdrop */}
 <motion.div
 aria-hidden
 className="pointer-events-none absolute inset-0 -z-10"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.6 }}
 >
 <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-primary/25 via-pink-400/15 to-emerald-300/25 blur-3xl" />
 </motion.div>

 {/* Floating sparkles */}
 {[
 { Icon: Sparkles, top: "12%", left: "10%", delay: 0.2, size: 22, color: "text-amber-400" },
 { Icon: Star, top: "8%", left: "82%", delay: 0.35, size: 18, color: "text-pink-400" },
 { Icon: Sparkles, top: "62%", left: "6%", delay: 0.5, size: 16, color: "text-emerald-400" },
 { Icon: Star, top: "70%", left: "88%", delay: 0.65, size: 20, color: "text-violet-400" },
 ].map(({ Icon, top, left, delay, size, color }, i) => (
 <motion.div
 key={i}
 className={`pointer-events-none absolute ${color}`}
 style={{ top, left }}
 initial={{ opacity: 0, scale: 0, rotate: -45 }}
 animate={{ opacity: [0, 1, 0.85, 1], scale: [0, 1.2, 0.9, 1], rotate: [0, 12, -8, 0] }}
 transition={{ delay, duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
 >
 <Icon style={{ width: size, height: size }} fill="currentColor" />
 </motion.div>
 ))}

 {/* Mascot — bouncy entrance */}
 <motion.div
 className="mx-auto mb-3 w-fit"
 initial={{ y: -30, opacity: 0, rotate: -8 }}
 animate={{ y: 0, opacity: 1, rotate: 0 }}
 transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.1 }}
 >
 <Mascot pose="wave" size={120} />
 </motion.div>

 {/* Checkmark with concentric pulse rings */}
 <div className="relative mx-auto mb-5 w-20 h-20">
 {[0, 1].map((i) => (
 <motion.span
 key={i}
 aria-hidden
 className="absolute inset-0 rounded-full bg-emerald-400/30"
 initial={{ scale: 1, opacity: 0.55 }}
 animate={{ scale: 2.1, opacity: 0 }}
 transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
 />
 ))}
 <motion.div
 className="relative w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center"
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.25 }}
 >
 <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={2.4} />
 </motion.div>
 </div>

 <motion.h3
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.45, duration: 0.4 }}
 className="text-2xl sm:text-3xl font-extrabold mb-3 text-violet-700 dark:text-violet-300"
 >
 {t("successTitle")}
 </motion.h3>
 <motion.p
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.6, duration: 0.4 }}
 className="text-muted mb-7 max-w-sm mx-auto leading-relaxed"
 >
 {t("successDesc")}
 </motion.p>
 <motion.button
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.75, type: "spring", stiffness: 280, damping: 16 }}
 whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
 whileTap={{ scale: 0.97 }}
 onClick={handleClose}
 className="inline-flex items-center gap-2 px-9 py-3 rounded-2xl bg-gradient-to-r from-primary via-violet-500 to-pink-500 text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-shadow"
 >
 <PartyPopper className="w-4 h-4" />
 {t("close")}
 </motion.button>
 </motion.div>
 ) : (
 <form onSubmit={handleSubmit}>
 {/* Honeypot — hidden from humans, bots auto-fill it */}
 <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
 <label htmlFor="enroll-hp">Leave this empty</label>
 <input id="enroll-hp" type="text" name="_hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
 </div>
 {error ? (
 <div
 role="alert"
 className="mx-5 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400"
 >
 {error}
 </div>
 ) : null}
 <AnimatePresence mode="wait">
 {/* STEP 1 — Parent Info */}
 {step === 1 && (
 <motion.div
 key="s1"
 initial={{ opacity: 0, x: 30 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -30 }}
 className="space-y-4"
 >
 <div className="mb-5">
 <h3 className="text-lg font-semibold">{t("parentInfoTitle")}</h3>
 <p className="text-sm text-muted">{t("parentInfoDesc")}</p>
 </div>
 <div className="grid sm:grid-cols-2 gap-4">
 <div>
 <label className={labelCls}>{t("parentName")} *</label>
 <input
 type="text"
 required
 data-testid="enroll-parent-name"
 value={form.parentName}
 onChange={(e) => set("parentName", e.target.value)}
 placeholder={t("namePlaceholder")}
 className={stepAttempted && !form.parentName ? inputErrCls : inputCls}
 />
 {stepAttempted && !form.parentName && errSpan}
 </div>
 <div>
 <label className={labelCls}>{t("relationship")} *</label>
 <select required value={form.relationship} onChange={(e) => set("relationship", e.target.value)} className={stepAttempted && !form.relationship ? selectErrCls : selectCls}>
 <option value="">{t("selectRelation")}</option>
 <option value="mother">{t("mother")}</option>
 <option value="father">{t("father")}</option>
 <option value="guardian">{t("guardian")}</option>
 <option value="other">{t("other")}</option>
 </select>
 {stepAttempted && !form.relationship && errSpan}
 </div>
 </div>
 <div>
 <label className={labelCls}>{t("parentEmail")} *</label>
 <input
 type="email"
 required
 value={form.email}
 onChange={(e) => {
 set("email", e.target.value);
 if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
 }}
 onBlur={(e) => setFieldErrors((p) => ({ ...p, email: emailError(e.target.value, valLang) }))}
 placeholder={t("emailPlaceholder")}
 aria-invalid={!!fieldErrors.email || (stepAttempted && !form.email)}
 className={(stepAttempted && !form.email) || fieldErrors.email ? inputErrCls : inputCls}
 />
 {fieldErrors.email ? (
 <span className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.email}</span>
 ) : (stepAttempted && !form.email && errSpan)}
 </div>
 <div>
 <label className={labelCls}>{t("phone")} *</label>
 <input
 type="tel"
 inputMode="tel"
 required
 value={form.phone}
 onChange={(e) => {
 set("phone", e.target.value);
 if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: "" }));
 }}
 onBlur={(e) => setFieldErrors((p) => ({ ...p, phone: phoneError(e.target.value, valLang) }))}
 placeholder={t("phonePlaceholder")}
 aria-invalid={!!fieldErrors.phone || (stepAttempted && !form.phone)}
 className={(stepAttempted && !form.phone) || fieldErrors.phone ? inputErrCls : inputCls}
 dir="ltr"
 />
 {fieldErrors.phone ? (
 <span className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.phone}</span>
 ) : (stepAttempted && !form.phone && errSpan)}
 </div>
 </motion.div>
 )}

 {/* STEP 2 — Child Info */}
 {step === 2 && (
 <motion.div
 key="s2"
 initial={{ opacity: 0, x: 30 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -30 }}
 className="space-y-4"
 >
 <div className="mb-5">
 <h3 className="text-lg font-semibold">{t("childInfoTitle")}</h3>
 <p className="text-sm text-muted">{t("childInfoDesc")}</p>
 </div>
 <div className="grid sm:grid-cols-2 gap-4">
 <div>
 <label className={labelCls}>{t("childName")} *</label>
 <input type="text" required value={form.childName} onChange={(e) => set("childName", e.target.value)} placeholder={t("childNamePlaceholder")} className={stepAttempted && !form.childName ? inputErrCls : inputCls} />
 {stepAttempted && !form.childName && errSpan}
 </div>
 <div>
 <label className={labelCls}>{t("childAge")} *</label>
 <select required value={form.childAge} onChange={(e) => set("childAge", e.target.value)} className={stepAttempted && !form.childAge ? selectErrCls : selectCls}>
 <option value="">{t("selectAge")}</option>
 {Array.from({ length: 13 }, (_, i) => i + 6).map((a) => (
 <option key={a} value={a}>{a}</option>
 ))}
 </select>
 {stepAttempted && !form.childAge && errSpan}
 </div>
 </div>
 <div className="grid sm:grid-cols-2 gap-4">
 <div>
 <label className={labelCls}>{t("childGender")}</label>
 <select value={form.childGender} onChange={(e) => set("childGender", e.target.value)} className={selectCls}>
 <option value="">{t("selectGender")}</option>
 <option value="male">{t("male")}</option>
 <option value="female">{t("female")}</option>
 <option value="prefer_not">{t("preferNot")}</option>
 </select>
 </div>
 <div>
 <label className={labelCls}>{t("gradeLevel")} *</label>
 <select required value={form.gradeLevel} onChange={(e) => set("gradeLevel", e.target.value)} className={stepAttempted && !form.gradeLevel ? selectErrCls : selectCls}>
 <option value="">{t("selectGrade")}</option>
 <option value="1-3">{t("grade1_3")}</option>
 <option value="4-6">{t("grade4_6")}</option>
 <option value="7-9">{t("grade7_9")}</option>
 <option value="10-12">{t("grade10_12")}</option>
 </select>
 {stepAttempted && !form.gradeLevel && errSpan}
 </div>
 </div>
 <div>
 <label className={labelCls}>{t("previousExperience")}</label>
 <select value={form.previousExperience} onChange={(e) => set("previousExperience", e.target.value)} className={selectCls}>
 <option value="">{t("selectExperience")}</option>
 <option value="none">{t("expNone")}</option>
 <option value="some">{t("expSome")}</option>
 <option value="moderate">{t("expModerate")}</option>
 <option value="experienced">{t("expExperienced")}</option>
 </select>
 </div>
 </motion.div>
 )}

 {/* STEP 3 — Schedule */}
 {step === 3 && (
 <motion.div
 key="s3"
 initial={{ opacity: 0, x: 30 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -30 }}
 className="space-y-4"
 >
 <div className="mb-5">
 <h3 className="text-lg font-semibold">{t("scheduleTitle")}</h3>
 <p className="text-sm text-muted">{t("scheduleDesc")}</p>
 </div>
 <div>
 <label className={labelCls}>{t("preferredDays")} *</label>
 {stepAttempted && form.preferredDays.length === 0 && errSpan}
 <div className="flex flex-wrap gap-2">
 {(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const).map((day) => (
 <button
 key={day}
 type="button"
 onClick={() => toggleDay(day)}
 className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
 form.preferredDays.includes(day)
 ? "bg-primary text-white shadow-md shadow-primary/10"
 : "bg-background border border-border text-muted hover:border-primary/30"
 }`}
 >
 {t(day)}
 </button>
 ))}
 </div>
 </div>
 <div>
 <label className={labelCls}>{t("preferredTime")} *</label>
 {stepAttempted && !form.preferredTime && errSpan}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 {(["morning", "afternoon", "evening", "flexible"] as const).map((time) => (
 <button
 key={time}
 type="button"
 onClick={() => set("preferredTime", time)}
 className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
 form.preferredTime === time
 ? "bg-primary text-white shadow-md shadow-primary/10"
 : "bg-background border border-border text-muted hover:border-primary/30"
 }`}
 >
 {t(time)}
 </button>
 ))}
 </div>
 </div>
 <div>
 <label className={labelCls}>{t("sessionFormat")}</label>
 <select
 disabled
 value={form.sessionFormat}
 className={`${selectCls} opacity-80 cursor-not-allowed`}
 aria-label={t("sessionFormat")}
 >
 <option value="online_live">{t("onlineLive")}</option>
 </select>
 <p className="mt-1 text-xs text-muted">{t("sessionFormatOnlineOnly")}</p>
 </div>
 <div>
 <label className={labelCls}>{t("startDate")}</label>
 <select value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={selectCls}>
 <option value="">{t("selectStartDate")}</option>
 <option value="asap">{t("asap")}</option>
 <option value="next_week">{t("nextWeek")}</option>
 <option value="next_month">{t("nextMonth")}</option>
 <option value="specific">{t("specificDate")}</option>
 </select>
 </div>
 </motion.div>
 )}

 {/* STEP 4 — Additional */}
 {step === 4 && (
 <motion.div
 key="s4"
 initial={{ opacity: 0, x: 30 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -30 }}
 className="space-y-4"
 >
 <div className="mb-5">
 <h3 className="text-lg font-semibold">{t("additionalTitle")}</h3>
 <p className="text-sm text-muted">{t("additionalDesc")}</p>
 </div>
 <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
 <p className="text-sm font-semibold">{t("priceBreakdownTitle")}</p>
 {quoteLoading && !priceQuote ? (
 <p className="text-xs text-muted">{t("promoChecking")}</p>
 ) : null}
 {priceQuote ? (
 <ul className="text-xs text-muted space-y-1">
 <li className="flex justify-between gap-2">
 <span>{t("listPrice")}</span>
 <span className="text-foreground tabular-nums">
 {formatCoursePrice(priceQuote.listPrice, priceQuote.currency, locale)}
 </span>
 </li>
 {priceQuote.courseDiscountPercent > 0 ? (
 <li className="flex justify-between gap-2">
 <span>
 {t("courseDiscount", { pct: priceQuote.courseDiscountPercent })}
 </span>
 <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">
 −{" "}
 {formatCoursePrice(
 priceQuote.listPrice -
 priceQuote.priceAfterCourseDiscount,
 priceQuote.currency,
 locale
 )}
 </span>
 </li>
 ) : null}
 <li className="flex justify-between gap-2 font-medium text-foreground">
 <span>{t("afterCourseDiscount")}</span>
 <span className="tabular-nums">
 {formatCoursePrice(
 priceQuote.priceAfterCourseDiscount,
 priceQuote.currency,
 locale
 )}
 </span>
 </li>
 {(priceQuote.firstTimeParentDiscountAmount ?? 0) > 0 ? (
 <>
 <li className="flex justify-between gap-2">
 <span>
 {t("firstTimeParentDiscount", {
 pct: priceQuote.firstTimeParentDiscountPercent,
 })}
 </span>
 <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">
 −
 {formatCoursePrice(
 priceQuote.firstTimeParentDiscountAmount,
 priceQuote.currency,
 locale
 )}
 </span>
 </li>
 <li className="flex justify-between gap-2 text-foreground">
 <span>{t("afterFirstTimeDiscount")}</span>
 <span className="tabular-nums">
 {formatCoursePrice(
 priceQuote.priceAfterFirstTimeDiscount,
 priceQuote.currency,
 locale
 )}
 </span>
 </li>
 </>
 ) : null}
 {priceQuote.promoDiscountAmount > 0 ? (
 <li className="flex justify-between gap-2">
 <span>{t(priceQuote.isReferralCode ? "referralSavings" : "promoSavings")}</span>
 <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">
 −
 {formatCoursePrice(
 priceQuote.promoDiscountAmount,
 priceQuote.currency,
 locale
 )}
 </span>
 </li>
 ) : null}
 <li className="flex justify-between gap-2 pt-1 border-t border-border text-sm font-semibold text-foreground">
 <span>{t("amountDue")}</span>
 <span className="tabular-nums">
 {formatCoursePrice(priceQuote.amountDue, priceQuote.currency, locale)}
 </span>
 </li>
 </ul>
 ) : null}
 {quoteErr ? (
 <p className="text-xs text-red-600 dark:text-red-400">{quoteErr}</p>
 ) : null}
 <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
 <div className="flex-1">
 <label className={labelCls}>{t("promoLabel")}</label>
 <input
 type="text"
 value={promoInput}
 onChange={(e) => setPromoInput(e.target.value)}
 placeholder={t("promoPlaceholder")}
 className={inputCls}
 autoComplete="off"
 />
 </div>
 <button
 type="button"
 disabled={quoteLoading}
 onClick={() => void refreshQuote(promoInput.trim() || undefined)}
 className="px-4 py-3 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15 disabled:opacity-50"
 >
 {quoteLoading ? t("promoChecking") : t("promoApply")}
 </button>
 </div>
 {priceQuote?.isReferralCode && priceQuote.referrerName ? (
 <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
 ✓ {t("referralApplied", { name: priceQuote.referrerName })}
 </p>
 ) : priceQuote?.promoError ? (
 <p className="text-xs text-amber-600 dark:text-amber-400">
 {priceQuote.promoError}
 </p>
 ) : null}
 </div>
 <div>
 <label className={labelCls}>{t("learningGoals")}</label>
 <textarea rows={3} value={form.learningGoals} onChange={(e) => set("learningGoals", e.target.value)} placeholder={t("goalsPlaceholder")} className={`${inputCls} resize-none`} />
 </div>
 <div>
 <label className={labelCls}>{t("specialNeeds")}</label>
 <textarea rows={2} value={form.specialNeeds} onChange={(e) => set("specialNeeds", e.target.value)} placeholder={t("needsPlaceholder")} className={`${inputCls} resize-none`} />
 </div>
 <div>
 <label className={labelCls}>{t("howDidYouHear")}</label>
 <select value={form.howDidYouHear} onChange={(e) => set("howDidYouHear", e.target.value)} className={selectCls}>
 <option value="">{t("selectSourceOptional")}</option>
 <option value="social_media">{t("socialMedia")}</option>
 <option value="friend">{t("friend")}</option>
 <option value="school">{t("school")}</option>
 <option value="search">{t("searchEngine")}</option>
 <option value="other">{t("other")}</option>
 </select>
 </div>
 <div className="space-y-3 pt-2">
 <label className="flex items-start gap-3 cursor-pointer">
 <input type="checkbox" checked={form.agreeTerms} onChange={(e) => set("agreeTerms", e.target.checked)} className="mt-1 w-4 h-4 rounded border-border text-primary accent-primary" />
 <span className="text-sm text-muted leading-relaxed">{t("agreeTerms")} *</span>
 </label>
 {stepAttempted && !form.agreeTerms && errSpan}
 <label className="flex items-start gap-3 cursor-pointer">
 <input type="checkbox" checked={form.agreePhotos} onChange={(e) => set("agreePhotos", e.target.checked)} className="mt-1 w-4 h-4 rounded border-border text-primary accent-primary" />
 <span className="text-sm text-muted leading-relaxed">{t("agreePhotos")}</span>
 </label>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Navigation */}
 <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
 {step > 1 ? (
 <button
 type="button"
 onClick={() => setStep(step - 1)}
 className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground hover:border-primary/30 transition-all"
 >
 <ArrowLeft className="w-4 h-4" />
 {t("back")}
 </button>
 ) : (
 <div />
 )}
 {step < STEPS ? (
 <button
 type="button"
 onClick={() => {
 if (canNext()) { setStepAttempted(false); setStep(step + 1); return; }
 // On step 1, surface inline validation errors so the user can see what's wrong.
 if (step === 1) {
 setFieldErrors({
 email: form.email && !isValidEmail(form.email) ? emailError(form.email, valLang) : "",
 phone: form.phone && !isValidUAEPhone(form.phone) ? phoneError(form.phone, valLang) : "",
 });
 }
 setStepAttempted(true);
 }}
 disabled={!canNext()}
 className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
 canNext()
 ? "bg-primary text-white shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.02]"
 : "bg-border text-muted cursor-not-allowed"
 }`}
 >
 {t("next")}
 <ArrowRight className="w-4 h-4" />
 </button>
 ) : (
 <button
 type="submit"
 disabled={!canNext() || submitting || cooldown}
 className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-semibold transition-all ${
 canNext() && !submitting && !cooldown
 ? "bg-primary text-white shadow-lg shadow-primary/10 hover:shadow-xl hover:scale-[1.02]"
 : "bg-border text-muted cursor-not-allowed"
 }`}
 >
 <GraduationCap className="w-4 h-4" />
 {submitting ? t("submitting") : t("submit")}
 </button>
 )}
 </div>
 </form>
 )}
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
