"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
} from "lucide-react";

interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
  courseTitle: string;
}

const STEPS = 4;

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none";
const selectCls =
  "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none";
const labelCls = "block text-sm font-medium mb-2";

export function EnrollModal({ open, onClose, courseTitle }: EnrollModalProps) {
  const t = useTranslations("enroll");
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    parentName: "",
    email: "",
    phone: "",
    relationship: "",
    childName: "",
    childAge: "",
    childGender: "",
    schoolName: "",
    gradeLevel: "",
    previousExperience: "",
    preferredDays: [] as string[],
    preferredTime: "",
    timezone: "",
    sessionFormat: "",
    startDate: "",
    learningGoals: "",
    specialNeeds: "",
    howDidYouHear: "",
    agreeTerms: false,
    agreePhotos: false,
  });

  const set = (key: string, value: string | boolean | string[]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const toggleDay = (day: string) =>
    setForm((p) => ({
      ...p,
      preferredDays: p.preferredDays.includes(day)
        ? p.preferredDays.filter((d) => d !== day)
        : [...p.preferredDays, day],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSuccess(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setStep(1);
      setForm({
        parentName: "",
        email: "",
        phone: "",
        relationship: "",
        childName: "",
        childAge: "",
        childGender: "",
        schoolName: "",
        gradeLevel: "",
        previousExperience: "",
        preferredDays: [],
        preferredTime: "",
        timezone: "",
        sessionFormat: "",
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
        return form.parentName && form.email && form.phone && form.relationship;
      case 2:
        return form.childName && form.childAge && form.gradeLevel;
      case 3:
        return form.preferredDays.length > 0 && form.preferredTime && form.sessionFormat;
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("successTitle")}</h3>
                  <p className="text-muted mb-6 max-w-sm mx-auto">{t("successDesc")}</p>
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition-transform"
                  >
                    {t("close")}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
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
                            <input type="text" required value={form.parentName} onChange={(e) => set("parentName", e.target.value)} placeholder={t("namePlaceholder")} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>{t("relationship")} *</label>
                            <select required value={form.relationship} onChange={(e) => set("relationship", e.target.value)} className={selectCls}>
                              <option value="">{t("selectRelation")}</option>
                              <option value="mother">{t("mother")}</option>
                              <option value="father">{t("father")}</option>
                              <option value="guardian">{t("guardian")}</option>
                              <option value="other">{t("other")}</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>{t("parentEmail")} *</label>
                          <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("emailPlaceholder")} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>{t("phone")} *</label>
                          <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t("phonePlaceholder")} className={inputCls} />
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
                            <input type="text" required value={form.childName} onChange={(e) => set("childName", e.target.value)} placeholder={t("childNamePlaceholder")} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>{t("childAge")} *</label>
                            <select required value={form.childAge} onChange={(e) => set("childAge", e.target.value)} className={selectCls}>
                              <option value="">{t("selectAge")}</option>
                              {Array.from({ length: 13 }, (_, i) => i + 6).map((a) => (
                                <option key={a} value={a}>{a}</option>
                              ))}
                            </select>
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
                            <select required value={form.gradeLevel} onChange={(e) => set("gradeLevel", e.target.value)} className={selectCls}>
                              <option value="">{t("selectGrade")}</option>
                              <option value="1-3">{t("grade1_3")}</option>
                              <option value="4-6">{t("grade4_6")}</option>
                              <option value="7-9">{t("grade7_9")}</option>
                              <option value="10-12">{t("grade10_12")}</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>{t("schoolName")}</label>
                          <input type="text" value={form.schoolName} onChange={(e) => set("schoolName", e.target.value)} placeholder={t("schoolPlaceholder")} className={inputCls} />
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
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>{t("sessionFormat")} *</label>
                            <select required value={form.sessionFormat} onChange={(e) => set("sessionFormat", e.target.value)} className={selectCls}>
                              <option value="">{t("selectFormat")}</option>
                              <option value="online_live">{t("onlineLive")}</option>
                              <option value="online_recorded">{t("onlineRecorded")}</option>
                              <option value="in_person">{t("inPerson")}</option>
                              <option value="hybrid">{t("hybrid")}</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>{t("timezone")}</label>
                            <select value={form.timezone} onChange={(e) => set("timezone", e.target.value)} className={selectCls}>
                              <option value="">{t("selectTimezone")}</option>
                              <option value="AST">AST (UTC+3) — Arabia</option>
                              <option value="GST">GST (UTC+4) — Gulf</option>
                              <option value="EET">EET (UTC+2) — Egypt</option>
                              <option value="CET">CET (UTC+1) — Europe</option>
                              <option value="GMT">GMT (UTC+0) — UK</option>
                              <option value="EST">EST (UTC-5) — US East</option>
                              <option value="PST">PST (UTC-8) — US West</option>
                            </select>
                          </div>
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
                            <option value="">{t("selectSource")}</option>
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
                        onClick={() => canNext() && setStep(step + 1)}
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
                        disabled={!canNext() || submitting}
                        className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          canNext() && !submitting
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
