"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserPlus,
  LogIn,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Heart,
} from "lucide-react";
import { apiRoot } from "@/lib/api";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "signup" | "login";
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";

export function AuthModal({ open, onClose, defaultTab = "signup" }: AuthModalProps) {
  const t = useTranslations("parents");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const labelAlign = isRtl ? "text-right" : "text-left";

  const [tab, setTab] = useState<"signup" | "login" | "forgot">(defaultTab);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<"phone" | "otp" | "newpass" | "done">("phone");
  const [forgotPhone, setForgotPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [signupForm, setSignupForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const API = apiRoot();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setShowPassword(false);
      setShowSignupPassword(false);
      setShowNewPassword(false);
      setForgotStep("phone");
      setForgotPhone("");
      setOtp(["", "", "", ""]);
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
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="font-bold">{t("badge")}</span>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switcher */}
            {!success && tab !== "forgot" && (
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
            <div className="p-5">
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
                    onClick={handleClose}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition-transform"
                  >
                    Done
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
                        <div className="relative">
                          <input
                            type={showSignupPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={signupForm.password}
                            onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                            placeholder={t("passwordPlaceholder")}
                            className={`${inputCls} pe-12`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="absolute top-1/2 -translate-y-1/2 end-3 p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
                          >
                            {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl">{error}</p>
                      )}

                      <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70">
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
                          <button
                            type="button"
                            className="text-xs text-primary hover:underline"
                            onClick={() => { setTab("forgot"); setError(""); }}
                          >
                            {isRtl ? "نسيت كلمة المرور؟" : "Forgot password?"}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            placeholder={t("passwordPlaceholder")}
                            className={`${inputCls} pe-12`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 -translate-y-1/2 end-3 p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl">{error}</p>
                      )}

                      <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70">
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t("loginLink")}
                      </button>
                    </motion.form>
                  )}

                  {/* ── Forgot Password — 3 steps: phone → OTP → new password ── */}
                  {tab === "forgot" && (
                    <motion.div
                      key="forgot"
                      initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      className="mt-4"
                    >
                      <AnimatePresence mode="wait">
                        {/* Step 1 — Enter phone number */}
                        {forgotStep === "phone" && (
                          <motion.form
                            key="fp-phone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={async (e) => {
                              e.preventDefault();
                              setSubmitting(true);
                              setError("");
                              await new Promise((r) => setTimeout(r, 1000));
                              setSubmitting(false);
                              setForgotStep("otp");
                            }}
                            className="space-y-5"
                          >
                            <div className="text-center mb-2">
                              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-3">
                                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-emerald-600 dark:text-emerald-400">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
                                  <path d="M20.52 3.449C12.831-3.984.106 1.407.101 11.893c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c10.491 0 16.162-10.863 11.462-17.345A11.88 11.88 0 0020.52 3.449zM12.05 21.785a9.9 9.9 0 01-5.04-1.382l-.362-.214-3.748.983.999-3.648-.235-.374A9.862 9.862 0 012.1 11.893C2.1 6.414 6.544 1.97 12.05 1.97a9.862 9.862 0 019.95 9.923c0 5.48-4.444 9.892-9.95 9.892z" fill="currentColor" opacity="0.3"/>
                                </svg>
                              </div>
                              <h3 className="text-lg font-bold mb-1">
                                {isRtl ? "استعادة كلمة المرور" : "Reset Password"}
                              </h3>
                              <p className="text-sm text-muted">
                                {isRtl
                                  ? "أدخل رقم هاتفك وسنرسل رمز التحقق عبر واتساب"
                                  : "Enter your phone number and we'll send a verification code via WhatsApp"}
                              </p>
                            </div>

                            <div>
                              <label className={`block text-sm font-medium mb-2 ${labelAlign}`}>
                                {t("phoneLabel")} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                required
                                value={forgotPhone}
                                onChange={(e) => setForgotPhone(e.target.value)}
                                placeholder={t("phonePlaceholder")}
                                className={inputCls}
                              />
                            </div>

                            {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl">{error}</p>}

                            <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl bg-emerald-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70">
                              {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : isRtl ? "إرسال الرمز عبر واتساب" : "Send Code via WhatsApp"}
                            </button>

                            <button type="button" onClick={() => { setTab("login"); setError(""); }} className="w-full text-center text-sm text-muted hover:text-primary transition-colors">
                              {isRtl ? "← العودة لتسجيل الدخول" : "← Back to Login"}
                            </button>
                          </motion.form>
                        )}

                        {/* Step 2 — Enter OTP */}
                        {forgotStep === "otp" && (
                          <motion.form
                            key="fp-otp"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={async (e) => {
                              e.preventDefault();
                              setError("");
                              const code = otp.join("");
                              if (code !== "1234") {
                                setError(isRtl ? "رمز التحقق غير صحيح" : "Invalid verification code");
                                return;
                              }
                              setForgotStep("newpass");
                            }}
                            className="space-y-5"
                          >
                            <div className="text-center mb-2">
                              <h3 className="text-lg font-bold mb-1">
                                {isRtl ? "أدخل رمز التحقق" : "Enter Verification Code"}
                              </h3>
                              <p className="text-sm text-muted">
                                {isRtl
                                  ? `أرسلنا رمز مكون من 4 أرقام إلى ${forgotPhone} عبر واتساب`
                                  : `We sent a 4-digit code to ${forgotPhone} via WhatsApp`}
                              </p>
                            </div>

                            {/* 4-digit OTP boxes */}
                            <div className="flex justify-center gap-2" dir="ltr">
                              {otp.map((digit, idx) => (
                                <input
                                  key={idx}
                                  id={`otp-${idx}`}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
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
                                  className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-background border-2 border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                              ))}
                            </div>

                            <p className="text-center text-xs text-muted">
                              {isRtl ? "الرمز التجريبي: 123456" : "Mock code: 123456"}
                            </p>

                            {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl text-center">{error}</p>}

                            <button type="submit" disabled={otp.join("").length < 6} className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                              {isRtl ? "تحقق" : "Verify Code"}
                            </button>

                            <button type="button" onClick={() => { setForgotStep("phone"); setOtp(["", "", "", ""]); setError(""); }} className="w-full text-center text-sm text-muted hover:text-primary transition-colors">
                              {isRtl ? "← تغيير رقم الهاتف" : "← Change phone number"}
                            </button>
                          </motion.form>
                        )}

                        {/* Step 3 — Set new password */}
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
                              await new Promise((r) => setTimeout(r, 1000));
                              setSubmitting(false);
                              setForgotStep("done");
                            }}
                            className="space-y-5"
                          >
                            <div className="text-center mb-2">
                              <h3 className="text-lg font-bold mb-1">
                                {isRtl ? "تعيين كلمة مرور جديدة" : "Set New Password"}
                              </h3>
                              <p className="text-sm text-muted">
                                {isRtl ? "اختر كلمة مرور قوية لحسابك" : "Choose a strong password for your account"}
                              </p>
                            </div>

                            <div>
                              <label className={`block text-sm font-medium mb-2 ${labelAlign}`}>
                                {isRtl ? "كلمة المرور الجديدة" : "New Password"} <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  required
                                  minLength={6}
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder={isRtl ? "٦ أحرف على الأقل" : "At least 6 characters"}
                                  className={`${inputCls} pe-12`}
                                />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute top-1/2 -translate-y-1/2 end-3 p-1.5 rounded-lg text-muted hover:text-foreground transition-colors">
                                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className={`block text-sm font-medium mb-2 ${labelAlign}`}>
                                {isRtl ? "تأكيد كلمة المرور" : "Confirm Password"} <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="password"
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={isRtl ? "أعد إدخال كلمة المرور" : "Re-enter your password"}
                                className={inputCls}
                              />
                            </div>

                            {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-xl">{error}</p>}

                            <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-70">
                              {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : isRtl ? "حفظ كلمة المرور" : "Save Password"}
                            </button>
                          </motion.form>
                        )}

                        {/* Step 4 — Done */}
                        {forgotStep === "done" && (
                          <motion.div
                            key="fp-done"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                          >
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold mb-2">
                              {isRtl ? "تم تغيير كلمة المرور!" : "Password Changed!"}
                            </h3>
                            <p className="text-sm text-muted mb-6 max-w-xs mx-auto">
                              {isRtl
                                ? "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة."
                                : "You can now log in with your new password."}
                            </p>
                            <button
                              onClick={() => { setTab("login"); setForgotStep("phone"); setError(""); }}
                              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition-transform"
                            >
                              {isRtl ? "تسجيل الدخول" : "Log In Now"}
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
