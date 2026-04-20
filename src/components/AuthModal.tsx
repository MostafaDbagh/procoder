"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
 X,
 UserPlus,
 LogIn,
 CheckCircle2,
 Loader2,
 Heart,
 GraduationCap,
 ShieldCheck,
} from "lucide-react";
import { apiRoot } from "@/lib/api";
import { PasswordInput } from "@/components/PasswordInput";

interface AuthModalProps {
 open: boolean;
 onClose: () => void;
 defaultTab?: "signup" | "login";
 /** Instructor flow: correct header + login only (no parent signup tab). */
 variant?: "parent" | "instructor";
}

/** Distinct learners from matching enrollments (parent may have multiple children). */
interface SignupMatchedChild {
 childName: string;
 childAge?: number;
 gradeLevel?: string;
 enrollmentCount: number;
}

const inputCls =
 "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";

export function AuthModal({
 open,
 onClose,
 defaultTab = "signup",
 variant = "parent",
}: AuthModalProps) {
 const t = useTranslations("parents");
 const ta = useTranslations("authModal");
 const locale = useLocale();
 const router = useRouter();
 const isRtl = locale === "ar";
 const labelAlign = isRtl ? "text-right" : "text-left";
 const isInstructor = variant === "instructor";

 const [tab, setTab] = useState<"signup" | "login" | "forgot">(defaultTab);
 const [submitting, setSubmitting] = useState(false);
 const [success, setSuccess] = useState(false);
 const [error, setError] = useState("");
 const [forgotStep, setForgotStep] = useState<"email" | "otp" | "newpass" | "done">("email");
 const [forgotEmail, setForgotEmail] = useState("");
 const [forgotInfo, setForgotInfo] = useState("");
 const [otp, setOtp] = useState(["", "", "", ""]);
 const [otpPhase, setOtpPhase] = useState<"idle" | "verifying" | "success" | "error">(
 "idle"
 );
 const otpAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const [newPassword, setNewPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [signupForm, setSignupForm] = useState({ name: "", email: "", phone: "", password: "" });
 const [loginForm, setLoginForm] = useState({ email: "", password: "" });
 /** Parent signup: must match an existing enrollment (name + email or phone). */
 const [signupEligibility, setSignupEligibility] = useState<"idle" | "checking" | "yes" | "no">(
 "idle"
 );
 const [signupMatchedChildren, setSignupMatchedChildren] = useState<SignupMatchedChild[]>([]);
 const signupCheckSeq = useRef(0);

 const API = apiRoot();

 const emailLooksValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

 useEffect(() => {
 if (!open) return;
 setSuccess(false);
 setError("");
 setForgotStep("email");
 setForgotEmail("");
 setForgotInfo("");
 setOtp(["", "", "", ""]);
 setOtpPhase("idle");
 if (otpAdvanceTimer.current) {
 clearTimeout(otpAdvanceTimer.current);
 otpAdvanceTimer.current = null;
 }
 setNewPassword("");
 setConfirmPassword("");
 setSignupForm({ name: "", email: "", phone: "", password: "" });
 setLoginForm({ email: "", password: "" });
 setSignupEligibility("idle");
 setSignupMatchedChildren([]);
 setTab(isInstructor ? "login" : defaultTab);
 }, [open, defaultTab, isInstructor]);

 useEffect(() => {
 return () => {
 if (otpAdvanceTimer.current) clearTimeout(otpAdvanceTimer.current);
 };
 }, []);

 useEffect(() => {
 if (!open || tab !== "signup" || isInstructor) {
 setSignupEligibility("idle");
 setSignupMatchedChildren([]);
 return;
 }
 const name = signupForm.name.trim();
 const email = signupForm.email.trim();
 const phoneDigits = signupForm.phone.replace(/\D/g, "");
 if (name.length < 2 || (!emailLooksValid(email) && phoneDigits.length < 8)) {
 setSignupEligibility("idle");
 setSignupMatchedChildren([]);
 return;
 }

 const handle = window.setTimeout(() => {
 const seq = ++signupCheckSeq.current;
 setSignupEligibility("checking");
 void (async () => {
 try {
 const res = await fetch(`${API}/auth/check-parent-signup`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 name,
 email: emailLooksValid(email) ? email : "",
 phone: signupForm.phone,
 }),
 });
 const data = (await res.json().catch(() => ({}))) as {
 eligible?: boolean;
 children?: SignupMatchedChild[];
 };
 if (signupCheckSeq.current !== seq) return;
 if (!res.ok) {
 setSignupEligibility("no");
 setSignupMatchedChildren([]);
 return;
 }
 const ok = Boolean(data.eligible);
 setSignupEligibility(ok ? "yes" : "no");
 setSignupMatchedChildren(
 ok && Array.isArray(data.children) ? data.children : []
 );
 } catch {
 if (signupCheckSeq.current !== seq) return;
 setSignupEligibility("no");
 setSignupMatchedChildren([]);
 }
 })();
 }, 450);

 return () => window.clearTimeout(handle);
 }, [open, tab, isInstructor, signupForm.name, signupForm.email, signupForm.phone, API]);

 const signupCanSubmit =
 !isInstructor &&
 tab === "signup" &&
 signupEligibility === "yes" &&
 signupForm.name.trim().length >= 2 &&
 emailLooksValid(signupForm.email) &&
 signupForm.phone.trim().length > 0 &&
 signupForm.password.length >= 8;

 const handleSignup = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!signupCanSubmit) return;
 setSubmitting(true);
 setError("");
 try {
 const res = await fetch(`${API}/auth/register`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(signupForm),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.message || "Registration failed");
 if (data.token) localStorage.setItem("token", data.token);
 setSuccess(true);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Something went wrong");
 } finally {
 setSubmitting(false);
 }
 };

 const handleLogin = async (e: React.FormEvent) => {
 e.preventDefault();
 setSubmitting(true);
 setError("");
 try {
 const res = await fetch(`${API}/auth/login`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(loginForm),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.message || "Login failed");
 if (data.token) localStorage.setItem("token", data.token);
 setSuccess(true);
 } catch (err) {
 setError(err instanceof Error ? err.message : "Something went wrong");
 } finally {
 setSubmitting(false);
 }
 };

 const handleClose = () => {
 onClose();
 setTimeout(() => {
 setSuccess(false);
 setError("");
 setForgotStep("email");
 setForgotEmail("");
 setForgotInfo("");
 setOtp(["", "", "", ""]);
 setOtpPhase("idle");
 if (otpAdvanceTimer.current) {
 clearTimeout(otpAdvanceTimer.current);
 otpAdvanceTimer.current = null;
 }
 setNewPassword("");
 setConfirmPassword("");
 setSignupForm({ name: "", email: "", phone: "", password: "" });
 setLoginForm({ email: "", password: "" });
 }, 300);
 };

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
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 transition={{ type: "spring", damping: 25, stiffness: 300 }}
 className="relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
 >
 {/* Header */}
 <div className="flex items-start justify-between gap-4 border-b border-border p-5">
 <div className="min-w-0">
 <div className="flex items-center gap-2">
 {isInstructor ? (
 <GraduationCap className="h-5 w-5 shrink-0 text-purple" aria-hidden />
 ) : (
 <Heart className="h-5 w-5 shrink-0 text-primary" aria-hidden />
 )}
 <span className="font-bold">
 {isInstructor ? ta("instructorTitle") : t("badge")}
 </span>
 </div>
 {isInstructor && (
 <p className="mt-1.5 ps-7 text-xs leading-snug text-muted">
 {ta("instructorSubtitle")}
 </p>
 )}
 </div>
 <button
 type="button"
 onClick={handleClose}
 className="shrink-0 rounded-xl p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 {/* Tab switcher — parent only; instructors sign in with existing accounts */}
 {!success && tab !== "forgot" && !isInstructor && (
 <div className="flex p-1.5 mx-5 mt-5 bg-background rounded-xl border border-border">
 <button
 onClick={() => { setTab("signup"); setError(""); }}
 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
 tab === "signup" ? "bg-primary text-white shadow-sm" : "text-muted hover:text-foreground"
 }`}
 >
 <UserPlus className="w-4 h-4" />
 {t("signupButton")}
 </button>
 <button
 onClick={() => { setTab("login"); setError(""); }}
 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
 tab === "login" ? "bg-primary text-white shadow-sm" : "text-muted hover:text-foreground"
 }`}
 >
 <LogIn className="w-4 h-4" />
 {t("loginLink")}
 </button>
 </div>
 )}

 {/* Body */}
 <div className={`p-5 ${isInstructor && !success && tab === "login" ? "pt-6" : ""}`}>
 {success ? (
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center py-8"
 >
 <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
 <h3 className="text-lg font-bold mb-2">
 {tab === "signup" ? t("signupSuccess") : "Welcome back!"}
 </h3>
 <button
 type="button"
 onClick={() => {
 onClose();
 router.push(`/${locale}/dashboard`);
 }}
 className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition-transform"
 >
 {isRtl ? "الذهاب للوحة التحكم" : "Go to Dashboard"}
 </button>
 </motion.div>
 ) : (
 <AnimatePresence mode="wait">
 {/* ── Signup Form ── */}
 {tab === "signup" && (
 <motion.form
 key="signup"
 initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
 onSubmit={handleSignup}
 className="space-y-5 mt-4"
 >
 <div>
 <label className={`block text-sm font-medium mb-2 ${labelAlign}`}>
 {t("nameLabel")} <span className="text-red-500">*</span>
 </label>
 <input type="text" required value={signupForm.name} onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} placeholder={t("namePlaceholder")} className={inputCls} />
 </div>
 <div>
 <label className={`block text-sm font-medium mb-2 ${labelAlign}`}>
 {t("emailLabel")} <span className="text-red-500">*</span>
 </label>
 <input type="email" required value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} placeholder={t("emailPlaceholder")} className={inputCls} />
 </div>
 <div>
 <label className={`block text-sm font-medium mb-2 ${labelAlign}`}>
 {t("phoneLabel")} <span className="text-red-500">*</span>
 </label>
 <input type="tel" required value={signupForm.phone} onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })} placeholder={t("phonePlaceholder")} className={inputCls} />
 </div>
 <div>
 <label className={`block text-sm font-medium mb-2 ${labelAlign}`}>
 {t("passwordLabel")} <span className="text-red-500">*</span>
 </label>
 <PasswordInput
 required
 minLength={8}
 value={signupForm.password}
 onChange={(e) =>
 setSignupForm({ ...signupForm, password: e.target.value })
 }
 placeholder={t("passwordPlaceholder")}
 inputClassName={inputCls}
 />
 </div>

 <p className="text-xs text-muted leading-relaxed">
 {t("signupEnrollmentHint")}
 </p>

 {signupEligibility === "checking" && (
 <p className="text-sm text-muted flex items-center gap-2">
 <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
 {t("signupEligibilityChecking")}
 </p>
 )}
 {signupEligibility === "no" &&
 signupForm.name.trim().length >= 2 &&
 (emailLooksValid(signupForm.email) ||
 signupForm.phone.replace(/\D/g, "").length >= 8) && (
 <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-xl">
 {t("signupNoEnrollment")}
 </p>
 )}

 {signupEligibility === "yes" && signupMatchedChildren.length > 0 && (
 <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/80 dark:bg-emerald-950/25 px-4 py-3 space-y-2">
 <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
 <GraduationCap className="w-4 h-4 shrink-0" aria-hidden />
 {t("signupMatchedChildrenTitle")}
 </p>
 <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90">
 {t("signupMatchedChildrenSubtitle")}
 </p>
 <ul className="list-disc ps-5 space-y-1.5 text-sm text-foreground">
 {signupMatchedChildren.map((c, idx) => (
 <li key={`${c.childName}-${idx}`}>
 <span className="font-medium">{c.childName}</span>
 {typeof c.childAge === "number"
 ? t("signupMatchedChildAge", { age: c.childAge })
 : null}
 {c.gradeLevel ? ` · ${c.gradeLevel}` : ""}
 <span className="text-muted">
 {" "}
 — {t("signupMatchedChildCourses", { count: c.enrollmentCount })}
 </span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {error && (
 <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl">{error}</p>
 )}

 <button
 type="submit"
 disabled={submitting || !signupCanSubmit}
 className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
 >
 {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t("signupButton")}
 </button>
 </motion.form>
 )}

 {/* ── Login Form ── */}
 {tab === "login" && (
 <motion.form
 key="login"
 initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
 onSubmit={handleLogin}
 className="space-y-5 mt-4"
 >
 <div>
 <label className={`block text-sm font-medium mb-2 ${labelAlign}`}>
 {t("emailLabel")} <span className="text-red-500">*</span>
 </label>
 <input type="email" required value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} placeholder={t("emailPlaceholder")} className={inputCls} />
 </div>
 <div>
 <div className={`flex items-center justify-between mb-2 ${labelAlign}`}>
 <label className="text-sm font-medium">
 {t("passwordLabel")} <span className="text-red-500">*</span>
 </label>
 {!isInstructor && (
 <button
 type="button"
 className="text-xs text-primary hover:underline"
 onClick={() => {
 setTab("forgot");
 setError("");
 setForgotInfo("");
 setForgotEmail(loginForm.email.trim());
 }}
 >
 {isRtl ? "نسيت كلمة المرور؟" : "Forgot password?"}
 </button>
 )}
 </div>
 <PasswordInput
 required
 minLength={8}
 value={loginForm.password}
 onChange={(e) =>
 setLoginForm({ ...loginForm, password: e.target.value })
 }
 placeholder={t("passwordPlaceholder")}
 inputClassName={inputCls}
 />
 </div>

 {error && (
 <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl">{error}</p>
 )}

 <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70">
 {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t("loginLink")}
 </button>
 </motion.form>
 )}

 {/* ── Forgot password: email → Resend OTP → new password (parent only) ── */}
 {tab === "forgot" && (
 <motion.div
 key="forgot"
 initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
 className="mt-4"
 >
 <AnimatePresence mode="wait">
 {forgotStep === "email" && (
 <motion.form
 key="fp-email"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onSubmit={async (e) => {
 e.preventDefault();
 setSubmitting(true);
 setError("");
 setForgotInfo("");
 try {
 const res = await fetch(`${API}/auth/parent/request-password-reset`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 email: forgotEmail.trim(),
 locale: locale === "ar" ? "ar" : "en",
 }),
 });
 const data = (await res.json().catch(() => ({}))) as { message?: string };
 if (!res.ok) {
 throw new Error(data.message || "Request failed");
 }
 if (typeof data.message === "string" && data.message.trim()) {
 setForgotInfo(data.message);
 }
 setForgotStep("otp");
 } catch (err) {
 setError(err instanceof Error ? err.message : "Something went wrong");
 } finally {
 setSubmitting(false);
 }
 }}
 className="space-y-5"
 >
 <div className="text-center mb-2">
 <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30">
 <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-emerald-600 dark:text-emerald-400" aria-hidden>
 <path
 d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"
 fill="currentColor"
 />
 </svg>
 </div>
 <h3 className="mb-1 text-lg font-bold">{ta("forgotTitle")}</h3>
 <p className="text-sm text-muted">{ta("forgotEmailHint")}</p>
 </div>

 <div>
 <label className={`mb-2 block text-sm font-medium ${labelAlign}`}>
 {t("emailLabel")} <span className="text-red-500">*</span>
 </label>
 <input
 type="email"
 required
 value={forgotEmail}
 onChange={(e) => setForgotEmail(e.target.value)}
 placeholder={t("emailPlaceholder")}
 className={inputCls}
 autoComplete="email"
 />
 </div>

 {error && (
 <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-500 dark:bg-red-950/30">{error}</p>
 )}

 <button
 type="submit"
 disabled={submitting || !emailLooksValid(forgotEmail)}
 className="w-full rounded-2xl bg-emerald-500 py-3.5 font-semibold text-white shadow-md transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-70"
 >
 {submitting ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : ta("forgotSendCode")}
 </button>

 <button
 type="button"
 onClick={() => {
 setTab("login");
 setError("");
 setForgotInfo("");
 }}
 className="w-full text-center text-sm text-muted transition-colors hover:text-primary"
 >
 {ta("forgotBackLogin")}
 </button>
 </motion.form>
 )}

 {forgotStep === "otp" && (
 <motion.div
 key="fp-otp"
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -8 }}
 className="space-y-5"
 >
 <div className="text-center">
 <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
 <ShieldCheck className="h-7 w-7 text-primary" aria-hidden />
 </div>
 <h3 className="mb-1 text-lg font-bold">{ta("forgotOtpTitle")}</h3>
 <p className="text-sm text-muted">{ta("forgotOtpHint", { email: forgotEmail.trim() })}</p>
 <p className="mt-1 text-xs text-muted">{ta("forgotOtpScreenSubtitle")}</p>
 {forgotInfo ? (
 <p
 role="status"
 className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
 >
 {forgotInfo}
 </p>
 ) : null}
 </div>

 <AnimatePresence mode="wait">
 {otpPhase === "success" && (
 <motion.div
 key="otp-ok"
 role="status"
 initial={{ opacity: 0, scale: 0.96 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.96 }}
 className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-start dark:border-emerald-900/50 dark:bg-emerald-950/35"
 >
 <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
 <div>
 <p className="font-semibold text-emerald-950 dark:text-emerald-100">
 {ta("forgotOtpSuccessTitle")}
 </p>
 <p className="text-sm text-emerald-900/90 dark:text-emerald-200/90">
 {ta("forgotOtpSuccessBody")}
 </p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {otpPhase === "error" && error ? (
 <div
 role="alert"
 className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-start dark:border-red-900/50 dark:bg-red-950/35"
 >
 <p className="font-semibold text-red-800 dark:text-red-200">{ta("forgotOtpErrorTitle")}</p>
 <p className="mt-1 text-sm text-red-700 dark:text-red-300/90">{error}</p>
 </div>
 ) : null}

 <form
 className="space-y-5"
 onSubmit={async (e) => {
 e.preventDefault();
 const code = otp.join("");
 if (code.length !== 4 || otpPhase === "verifying" || otpPhase === "success") return;
 setError("");
 setOtpPhase("verifying");
 try {
 const res = await fetch(`${API}/auth/parent/verify-reset-otp`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ email: forgotEmail.trim(), code }),
 });
 const data = (await res.json().catch(() => ({}))) as { message?: string; ok?: boolean };
 if (!res.ok || !data.ok) {
 setOtpPhase("error");
 setError(
 data.message ||
 (isRtl ? "تحقق من الرمز وحاول مرة أخرى" : "Check the code and try again")
 );
 return;
 }
 setOtpPhase("success");
 if (otpAdvanceTimer.current) clearTimeout(otpAdvanceTimer.current);
 otpAdvanceTimer.current = setTimeout(() => {
 otpAdvanceTimer.current = null;
 setForgotStep("newpass");
 setOtpPhase("idle");
 }, 1400);
 } catch {
 setOtpPhase("error");
 setError(isRtl ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Try again.");
 }
 }}
 >
 <div
 className={`rounded-2xl border bg-background/60 p-4 transition-colors ${
 otpPhase === "error"
 ? "border-red-300 ring-2 ring-red-200/80 dark:border-red-800 dark:ring-red-900/40"
 : "border-border"
 }`}
 >
 <p className={`mb-3 text-center text-xs font-medium ${labelAlign}`}>
 {ta("forgotOtpBoxesLabel")}
 </p>
 <div className="flex justify-center gap-1.5 sm:gap-2" dir="ltr">
 {otp.map((digit, idx) => (
 <input
 key={idx}
 id={`otp-${idx}`}
 type="text"
 inputMode="numeric"
 autoComplete="one-time-code"
 maxLength={1}
 value={digit}
 disabled={otpPhase === "verifying" || otpPhase === "success"}
 onChange={(e) => {
 setOtpPhase("idle");
 setError("");
 const val = e.target.value.replace(/\D/g, "").slice(-1);
 const next = [...otp];
 next[idx] = val;
 setOtp(next);
 if (val && idx < 3) {
 document.getElementById(`otp-${idx + 1}`)?.focus();
 }
 }}
 onKeyDown={(e) => {
 if (e.key === "Backspace" && !otp[idx] && idx > 0) {
 document.getElementById(`otp-${idx - 1}`)?.focus();
 }
 }}
 className="h-12 w-9 rounded-xl border-2 border-border bg-surface text-center text-lg font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 sm:h-14 sm:w-11 sm:text-xl"
 />
 ))}
 </div>
 </div>

 <button
 type="submit"
 disabled={
 otp.join("").length !== 4 ||
 otpPhase === "verifying" ||
 otpPhase === "success"
 }
 className="w-full rounded-2xl bg-primary py-3.5 font-semibold text-white shadow-md shadow-primary/10 transition-all hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
 >
 {otpPhase === "verifying" ? (
 <span className="flex items-center justify-center gap-2">
 <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
 {ta("forgotOtpVerifying")}
 </span>
 ) : (
 ta("forgotOtpVerify")
 )}
 </button>
 </form>

 <button
 type="button"
 onClick={() => {
 if (otpAdvanceTimer.current) {
 clearTimeout(otpAdvanceTimer.current);
 otpAdvanceTimer.current = null;
 }
 setForgotStep("email");
 setOtp(["", "", "", ""]);
 setOtpPhase("idle");
 setError("");
 setForgotInfo("");
 }}
 disabled={otpPhase === "verifying"}
 className="w-full text-center text-sm text-muted transition-colors hover:text-primary disabled:opacity-50"
 >
 {ta("forgotChangeEmail")}
 </button>
 </motion.div>
 )}

 {forgotStep === "newpass" && (
 <motion.form
 key="fp-newpass"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onSubmit={async (e) => {
 e.preventDefault();
 setError("");
 if (newPassword !== confirmPassword) {
 setError(isRtl ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
 return;
 }
 setSubmitting(true);
 try {
 const res = await fetch(`${API}/auth/parent/reset-password`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 email: forgotEmail.trim(),
 code: otp.join(""),
 password: newPassword,
 }),
 });
 const data = (await res.json().catch(() => ({}))) as {
 message?: string;
 errors?: Array<{ msg?: string }>;
 };
 if (!res.ok) {
 const fromValidator = Array.isArray(data.errors)
 ? data.errors.map((x) => x.msg).filter(Boolean).join("; ")
 : "";
 throw new Error(
 fromValidator || data.message || "Could not update password"
 );
 }
 setForgotStep("done");
 } catch (err) {
 setError(err instanceof Error ? err.message : "Something went wrong");
 } finally {
 setSubmitting(false);
 }
 }}
 className="space-y-5"
 >
 <div className="mb-2 text-center">
 <h3 className="mb-1 text-lg font-bold">{ta("forgotNewPassTitle")}</h3>
 <p className="text-sm text-muted">{ta("forgotNewPassHint")}</p>
 </div>

 <div>
 <label className={`mb-2 block text-sm font-medium ${labelAlign}`}>
 {isRtl ? "كلمة المرور الجديدة" : "New password"} <span className="text-red-500">*</span>
 </label>
 <PasswordInput
 required
 minLength={8}
 value={newPassword}
 onChange={(e) => setNewPassword(e.target.value)}
 placeholder={isRtl ? "٨ أحرف على الأقل، أحرف كبيرة وصغيرة ورقم" : "8+ chars with upper, lower & number"}
 inputClassName={inputCls}
 />
 </div>

 <div>
 <label className={`mb-2 block text-sm font-medium ${labelAlign}`}>
 {isRtl ? "تأكيد كلمة المرور" : "Confirm password"} <span className="text-red-500">*</span>
 </label>
 <PasswordInput
 required
 minLength={8}
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 placeholder={isRtl ? "أعد إدخال كلمة المرور" : "Re-enter your password"}
 inputClassName={inputCls}
 />
 </div>

 {error && (
 <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-500 dark:bg-red-950/30">{error}</p>
 )}

 <button
 type="submit"
 disabled={submitting}
 className="w-full rounded-2xl bg-primary py-3.5 font-semibold text-white shadow-md shadow-primary/10 transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-70"
 >
 {submitting ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : ta("forgotSavePassword")}
 </button>
 </motion.form>
 )}

 {forgotStep === "done" && (
 <motion.div
 key="fp-done"
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="py-6 text-center"
 >
 <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
 <h3 className="mb-2 text-lg font-bold">{ta("forgotDoneTitle")}</h3>
 <p className="mx-auto mb-6 max-w-xs text-sm text-muted">{ta("forgotDoneBody")}</p>
 <button
 type="button"
 onClick={() => {
 setTab("login");
 setForgotStep("email");
 setError("");
 setForgotInfo("");
 setOtp(["", "", "", ""]);
 setNewPassword("");
 setConfirmPassword("");
 }}
 className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-white transition-transform hover:scale-[1.02]"
 >
 {ta("forgotLoginNow")}
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 )}
 </AnimatePresence>
 )}
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
