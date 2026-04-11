"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { adminLogin, createCourse, type CreateCourseData } from "@/lib/api";
import { adminFetch, setAdminToken } from "@/lib/admin-api";
import { AnimatedSection } from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import {
  LogIn,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  BookOpen,
  X,
} from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { formatCoursePrice, priceAfterCourseDiscount } from "@/lib/formatCoursePrice";
import { PasswordInput } from "@/components/PasswordInput";

/** Used only when /categories/admin/list returns nothing (same slugs as typical seed). */
const FALLBACK_CATEGORY_SLUGS = [
  "programming",
  "robotics",
  "algorithms",
  "arabic",
  "quran",
] as const;

type AdminCategoryRow = {
  slug: string;
  title: { en: string; ar: string };
  isActive?: boolean;
};
const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const ICONS = ["Blocks", "Code2", "Globe", "Bot", "Cpu", "Brain", "Trophy", "BookOpen", "PenTool", "BookMarked", "Star", "Gamepad2"] as const;
const GRADIENTS = [
  "from-blue-400 to-cyan-400",
  "from-emerald-400 to-teal-400",
  "from-violet-400 to-purple-400",
  "from-amber-400 to-orange-400",
  "from-rose-400 to-pink-400",
  "from-teal-400 to-green-400",
  "from-sky-400 to-blue-400",
  "from-indigo-400 to-violet-400",
  "from-pink-400 to-fuchsia-400",
  "from-emerald-400 to-lime-400",
  "from-lime-400 to-emerald-400",
  "from-fuchsia-400 to-purple-400",
] as const;
const initialForm: CreateCourseData = {
  slug: "",
  category: "programming",
  ageMin: 6,
  ageMax: 12,
  level: "beginner",
  lessons: 20,
  durationWeeks: 8,
  iconName: "Code2",
  color: "from-blue-400 to-cyan-400",
  title: { en: "", ar: "" },
  description: { en: "", ar: "" },
  skills: { en: [""], ar: [""] },
  price: 0,
  currency: "USD",
  discountPercent: 0,
};

export default function CreateCourseContent() {
  const locale = useLocale();
  // Auth state
  const [token, setToken] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("");

  // Form state
  const [form, setForm] = useState<CreateCourseData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [catRows, setCatRows] = useState<AdminCategoryRow[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let cancelled = false;
    setCatsLoading(true);
    (async () => {
      try {
        const raw = await adminFetch<Record<string, unknown>>(
          "/categories/admin/list?page=1&limit=500"
        );
        const items = Array.isArray(raw.items) ? raw.items : [];
        if (!cancelled) {
          setCatRows(items as AdminCategoryRow[]);
        }
      } catch {
        if (!cancelled) setCatRows([]);
      } finally {
        if (!cancelled) setCatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    const active = catRows.filter((r) => r.isActive !== false);
    if (active.length === 0) return;
    const slugs = active.map((r) => r.slug);
    setForm((f) => (slugs.includes(f.category) ? f : { ...f, category: slugs[0] }));
  }, [catRows]);

  // --- Auth ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await adminLogin(loginEmail, loginPassword);
      if (res.user.role !== "admin") {
        setLoginError("Access denied. Admin account required.");
        return;
      }
      setToken(res.token);
      setAdminToken(res.token);
      setAdminName(res.user.name as string);
      setIsAuthenticated(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // --- Form helpers ---
  const updateField = <K extends keyof CreateCourseData>(key: K, value: CreateCourseData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSkill = (lang: "en" | "ar", index: number, value: string) => {
    setForm((prev) => {
      const skills = { ...prev.skills };
      skills[lang] = [...skills[lang]];
      skills[lang][index] = value;
      return { ...prev, skills };
    });
  };

  const addSkill = (lang: "en" | "ar") => {
    setForm((prev) => {
      const skills = { ...prev.skills };
      skills[lang] = [...skills[lang], ""];
      return { ...prev, skills };
    });
  };

  const removeSkill = (lang: "en" | "ar", index: number) => {
    setForm((prev) => {
      const skills = { ...prev.skills };
      skills[lang] = skills[lang].filter((_, i) => i !== index);
      return { ...prev, skills };
    });
  };

  const autoSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const activeSlugs = catRows
      .filter((r) => r.isActive !== false)
      .map((r) => r.slug);
    if (activeSlugs.length > 0 && !activeSlugs.includes(form.category)) {
      setError(
        "Choose an active category from the list (must match Categories in admin)."
      );
      setSubmitting(false);
      return;
    }

    const lessons = Math.max(1, Math.floor(Number(form.lessons) || 1));
    const durationWeeks = Math.max(1, Math.floor(Number(form.durationWeeks) || 1));
    let ageMin = Math.min(18, Math.max(6, Math.floor(Number(form.ageMin) || 6)));
    let ageMax = Math.min(18, Math.max(6, Math.floor(Number(form.ageMax) || 18)));
    ageMin = Math.min(ageMin, ageMax);
    ageMax = Math.max(ageMin, ageMax);

    const slug = form.slug.trim().toLowerCase();
    if (!slug) {
      setError("Slug is required.");
      setSubmitting(false);
      return;
    }

    const payload: CreateCourseData = {
      slug,
      category: String(form.category).trim().toLowerCase(),
      ageMin,
      ageMax,
      level: form.level,
      lessons,
      durationWeeks,
      iconName: form.iconName,
      color: form.color,
      title: {
        en: form.title.en.trim(),
        ar: form.title.ar.trim(),
      },
      description: {
        en: form.description.en.trim(),
        ar: form.description.ar.trim(),
      },
      skills: {
        en: form.skills.en.map((s) => s.trim()).filter(Boolean),
        ar: form.skills.ar.map((s) => s.trim()).filter(Boolean),
      },
      price: Math.round(Math.max(0, Number(form.price) || 0) * 100) / 100,
      currency: "USD",
      discountPercent: Math.min(
        100,
        Math.max(0, Number(form.discountPercent) || 0)
      ),
    };

    try {
      await createCourse(payload, token);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Input classes ---
  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none";
  const selectClass =
    "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none";
  const labelClass = "block text-sm font-semibold mb-2";

  // ============ LOGIN SCREEN ============
  if (!isAuthenticated) {
    return (
      <div className="py-12 sm:py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">Admin Login</h1>
            <p className="text-muted">Sign in with your admin account to manage courses</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <form onSubmit={handleLogin} className="bg-surface rounded-2xl border border-border p-7 space-y-5">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@procoder.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <PasswordInput
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  inputClassName={inputClass}
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-lg shadow-primary/10 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                {loginLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  // ============ SUCCESS SCREEN ============
  if (success) {
    return (
      <div className="py-12 sm:py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Course Created!</h2>
            <p className="text-muted mb-8">
              <strong>{form.title.en}</strong> has been added successfully.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setForm(initialForm);
                  setSuccess(false);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:scale-[1.02] transition-transform"
              >
                <Plus className="w-5 h-5" />
                Create Another
              </button>
              <LocalizedLink
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:border-primary hover:text-primary transition-colors"
              >
                View Courses
              </LocalizedLink>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ============ CREATE FORM ============
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="mb-8">
          <LocalizedLink
            href="/dashboard"
            className="inline-flex items-center gap-2 text-muted hover:text-primary font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </LocalizedLink>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create New Course</h1>
              <p className="text-muted">
                Logged in as <span className="font-medium text-foreground">{adminName}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </AnimatedSection>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Info */}
          <AnimatedSection delay={0.1}>
            <div className="bg-surface rounded-2xl border border-border p-7">
              <h2 className="text-lg font-bold mb-5">Basic Information</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Course Title (English)</label>
                  <input
                    type="text"
                    required
                    value={form.title.en}
                    onChange={(e) => {
                      const en = e.target.value;
                      setForm((prev) => {
                        const prevAuto = autoSlug(prev.title.en);
                        const nextSlug =
                          !prev.slug || prev.slug === prevAuto
                            ? autoSlug(en)
                            : prev.slug;
                        return {
                          ...prev,
                          title: { ...prev.title, en },
                          slug: nextSlug,
                        };
                      });
                    }}
                    placeholder="e.g. Python for Kids"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Course Title (Arabic)</label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={form.title.ar}
                    onChange={(e) => updateField("title", { ...form.title, ar: e.target.value })}
                    placeholder="مثال: بايثون للأطفال"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="python-for-kids"
                    className={inputClass}
                  />
                  <p className="text-xs text-muted mt-1">Used in the URL: /courses/{form.slug || "..."}</p>
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    disabled={catsLoading}
                    className={selectClass}
                  >
                    {(catRows.filter((r) => r.isActive !== false).length
                      ? catRows.filter((r) => r.isActive !== false)
                                           : FALLBACK_CATEGORY_SLUGS.map((slug) => ({
                          slug,
                          title: { en: slug, ar: slug },
                        }))
                    ).map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.title.en} ({c.slug})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted mt-1">
                    {catsLoading
                      ? "Loading categories from admin…"
                      : "Must be an active category (same rule as admin dashboard)."}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Section 2: Description */}
          <AnimatedSection delay={0.15}>
            <div className="bg-surface rounded-2xl border border-border p-7">
              <h2 className="text-lg font-bold mb-5">Description</h2>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Description (English)</label>
                  <textarea
                    required
                    rows={3}
                    value={form.description.en}
                    onChange={(e) => updateField("description", { ...form.description, en: e.target.value })}
                    placeholder="Brief description of what students will learn..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Description (Arabic)</label>
                  <textarea
                    required
                    rows={3}
                    dir="rtl"
                    value={form.description.ar}
                    onChange={(e) => updateField("description", { ...form.description, ar: e.target.value })}
                    placeholder="وصف مختصر لما سيتعلمه الطلاب..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Section 3: Course Details */}
          <AnimatedSection delay={0.2}>
            <div className="bg-surface rounded-2xl border border-border p-7">
              <h2 className="text-lg font-bold mb-5">Course Details</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => updateField("level", e.target.value)}
                    className={selectClass}
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Min Age</label>
                  <input
                    type="number"
                    required
                    min={6}
                    max={18}
                    value={form.ageMin}
                    onChange={(e) =>
                      updateField("ageMin", Math.floor(Number(e.target.value) || 6))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Max Age</label>
                  <input
                    type="number"
                    required
                    min={6}
                    max={18}
                    value={form.ageMax}
                    onChange={(e) =>
                      updateField("ageMax", Math.floor(Number(e.target.value) || 18))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Total Lessons</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.lessons}
                    onChange={(e) =>
                      updateField(
                        "lessons",
                        Math.max(1, Math.floor(Number(e.target.value) || 1))
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Duration (Weeks)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.durationWeeks}
                    onChange={(e) =>
                      updateField(
                        "durationWeeks",
                        Math.max(1, Math.floor(Number(e.target.value) || 1))
                      )
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Price (USD)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => updateField("price", Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Catalog discount (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.discountPercent ?? 0}
                    onChange={(e) =>
                      updateField(
                        "discountPercent",
                        Math.min(100, Math.max(0, Number(e.target.value) || 0))
                      )
                    }
                    className={inputClass}
                  />
                  <p className="text-xs text-muted mt-1">
                    Optional percent off the list price for this course (display, enrollments, and checkout).
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Section 4: Appearance */}
          <AnimatedSection delay={0.25}>
            <div className="bg-surface rounded-2xl border border-border p-7">
              <h2 className="text-lg font-bold mb-5">Appearance</h2>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => updateField("iconName", icon)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          form.iconName === icon
                            ? "bg-primary text-white shadow-sm"
                            : "bg-background border border-border text-muted hover:text-foreground hover:border-primary/30"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Color Gradient</label>
                  <div className="flex flex-wrap gap-2">
                    {GRADIENTS.map((gradient) => (
                      <button
                        key={gradient}
                        type="button"
                        onClick={() => updateField("color", gradient)}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} transition-all ${
                          form.color === gradient
                            ? "ring-3 ring-primary ring-offset-2 ring-offset-surface scale-110"
                            : "hover:scale-105 opacity-70 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Section 5: Skills */}
          <AnimatedSection delay={0.3}>
            <div className="bg-surface rounded-2xl border border-border p-7">
              <h2 className="text-lg font-bold mb-5">Skills Gained</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {/* English skills */}
                <div>
                  <label className={labelClass}>Skills (English)</label>
                  <div className="space-y-2">
                    {form.skills.en.map((skill, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkill("en", i, e.target.value)}
                          placeholder={`Skill ${i + 1}`}
                          className={`${inputClass} flex-1`}
                        />
                        {form.skills.en.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSkill("en", i)}
                            className="p-3 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSkill("en")}
                      className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add skill
                    </button>
                  </div>
                </div>

                {/* Arabic skills */}
                <div>
                  <label className={labelClass}>Skills (Arabic)</label>
                  <div className="space-y-2">
                    {form.skills.ar.map((skill, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          dir="rtl"
                          value={skill}
                          onChange={(e) => updateSkill("ar", i, e.target.value)}
                          placeholder={`مهارة ${i + 1}`}
                          className={`${inputClass} flex-1`}
                        />
                        {form.skills.ar.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSkill("ar", i)}
                            className="p-3 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSkill("ar")}
                      className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mt-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add skill
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Preview */}
          <AnimatedSection delay={0.35}>
            <div className="bg-surface rounded-2xl border border-border p-7">
              <h2 className="text-lg font-bold mb-5">Preview</h2>
              <div className={`rounded-2xl bg-gradient-to-br ${form.color} p-6 sm:p-8 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10" />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium capitalize">
                      {form.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium capitalize">
                      {form.level}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                      Ages {form.ageMin}–{form.ageMax}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {form.title.en || "Course Title"}
                  </h3>
                  <p className="text-white/80 text-sm max-w-xl">
                    {form.description.en || "Course description will appear here..."}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-white/70 text-xs">
                    <span>{form.lessons} lessons</span>
                    <span>{form.durationWeeks} weeks</span>
                    {form.price > 0 && (
                      <span>
                        {form.discountPercent
                          ? `${formatCoursePrice(
                              priceAfterCourseDiscount(
                                form.price,
                                form.discountPercent
                              ),
                              "USD",
                              locale
                            )} (${form.discountPercent}% off)`
                          : formatCoursePrice(form.price, "USD", locale)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <AnimatedSection delay={0.4}>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-primary text-white font-semibold text-lg shadow-lg shadow-primary/10 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {submitting ? "Creating Course..." : "Create Course"}
            </button>
          </AnimatedSection>
        </form>
      </div>
    </div>
  );
}
