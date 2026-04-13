"use client";

import { useEffect, useState, startTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { isParentPortalRole } from "@/lib/auth-flow";
import { useRouter } from "@/i18n/navigation";
import {
  fetchParentDashboard,
  type ParentDashboardData,
  type APICourse,
  type EnrollmentWithCourse,
} from "@/lib/api";
import { CourseCard } from "@/components/CourseCard";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Award,
  Flame,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Phone,
  LogOut,
  ChevronRight,
  Play,
  FileText,
  TrendingUp,
} from "lucide-react";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-100 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", label: "Pending" },
  confirmed: { bg: "bg-blue-100 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400", label: "Confirmed" },
  active: { bg: "bg-emerald-100 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", label: "Active" },
  completed: { bg: "bg-violet-100 dark:bg-violet-950/30", text: "text-violet-700 dark:text-violet-400", label: "Completed" },
  cancelled: { bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", label: "Cancelled" },
};

function childGroupKey(e: Pick<EnrollmentWithCourse, "childName" | "childStudentId">) {
  const n = String(e.childName || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  const id = String(e.childStudentId || "")
    .trim()
    .toLowerCase();
  return `${n}|||${id}`;
}

type ChildEnrollmentGroup = {
  key: string;
  childName: string;
  childAge?: number;
  gradeLevel?: string;
  enrollments: EnrollmentWithCourse[];
};

function groupEnrollmentsByChild(enrollments: EnrollmentWithCourse[]): ChildEnrollmentGroup[] {
  const map = new Map<string, ChildEnrollmentGroup>();
  for (const e of enrollments) {
    const key = childGroupKey(e);
    if (!map.has(key)) {
      map.set(key, {
        key,
        childName: e.childName,
        childAge: e.childAge,
        gradeLevel: e.gradeLevel,
        enrollments: [],
      });
    }
    map.get(key)!.enrollments.push(e);
  }
  return [...map.values()];
}

type Props = { initialCourses: APICourse[] | null };

export default function DashboardContent({ initialCourses }: Props) {
  void initialCourses; // passed from page for future ISR-enriched recommendations
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const { token, loading: authLoading, isAuthenticated, role, logout } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<ParentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !isAuthenticated || !token) return;
    if (role && !isParentPortalRole(role)) {
      router.replace("/instructor");
    }
  }, [authLoading, isAuthenticated, token, role, router]);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      startTransition(() => setLoading(false));
      return;
    }
    if (role && !isParentPortalRole(role)) return;
    startTransition(() => {
      setLoading(true);
      setError("");
    });
    fetchParentDashboard(token)
      .then((d) => {
        setData(d);
        startTransition(() => setLoading(false));
      })
      .catch((err) => {
        setError(err.message);
        startTransition(() => setLoading(false));
      });
  }, [token, authLoading, role]);

  if (!authLoading && isAuthenticated && role && !isParentPortalRole(role)) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Redirecting" />
      </div>
    );
  }

  // Not authenticated — show login prompt (visitor → member auth)
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="py-20 sm:py-32">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Welcome to Your Dashboard</h1>
          <p className="text-muted mb-8">Sign in to track your child&apos;s progress, view enrollments, and manage your account.</p>
          <p className="text-sm text-muted mb-6">
            Teaching on ProCoder?{" "}
            <LocalizedLink href="/instructor/login" className="text-primary font-medium hover:underline">
              Instructor sign-in
            </LocalizedLink>
          </p>
          <LocalizedLink
            href="/parent/login"
            className="inline-flex px-8 py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            Sign in / Create account
          </LocalizedLink>
        </div>
      </div>
    );
  }

  // Loading
  if (loading || authLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-muted">{error}</p>
        <button onClick={logout} className="mt-4 text-primary font-medium hover:underline">
          Log out and try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { profile, stats, enrollments, recommended } = data;
  const enrollmentsByChild = groupEnrollmentsByChild(enrollments);

  return (
    <div className="py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══ Header ═══ */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">
              {t("welcome").replace("Explorer", profile.name.split(" ")[0])}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{profile.email}</span>
              {profile.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{profile.phone}</span>}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted hover:text-red-500 hover:border-red-200 transition-colors self-start"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </motion.div>

        {/* ═══ Stats Grid ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: BookOpen, label: t("coursesEnrolled"), value: stats.coursesEnrolled, color: "text-primary", bg: "bg-primary/10" },
            { icon: Clock, label: t("hoursLearned"), value: stats.hoursLearned, color: "text-amber-500", bg: "bg-amber-500/10" },
            { icon: Award, label: t("badges"), value: stats.badges, color: "text-purple", bg: "bg-purple/10" },
            { icon: Flame, label: t("streak"), value: stats.streak, color: "text-rose-500", bg: "bg-rose-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="bg-surface rounded-2xl border border-border p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ Enrollments ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              My Enrollments
            </h2>
            <span className="text-sm text-muted">{enrollments.length} total</span>
          </div>

          {enrollments.length > 0 ? (
            <div className="space-y-8">
              {enrollmentsByChild.length > 1 && (
                <p className="text-sm font-semibold text-muted -mb-2">{t("yourChildren")}</p>
              )}
              <AnimatePresence>
                {enrollmentsByChild.map((group, gIdx) => {
                  const agePart =
                    typeof group.childAge === "number"
                      ? t("childAgePart", { age: group.childAge })
                      : "";
                  const gradePart = group.gradeLevel
                    ? t("childGradePart", { grade: group.gradeLevel })
                    : "";
                  return (
                    <motion.div
                      key={group.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 + gIdx * 0.06 }}
                      className="space-y-3"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2 px-0.5">
                        <h3 className="text-base font-semibold">
                          {t("childMeta", {
                            name: group.childName,
                            agePart,
                            gradePart,
                          })}
                        </h3>
                        <span className="text-xs text-muted">
                          {t("enrollmentsForChild", { count: group.enrollments.length })}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {group.enrollments.map((enrollment, i) => {
                          const s = statusColors[enrollment.status] || statusColors.pending;
                          const courseTitle = enrollment.course
                            ? enrollment.course.title[lang]
                            : enrollment.courseTitle || enrollment.courseId;
                          const animIndex = gIdx * 8 + i;
                          return (
                            <motion.div
                              key={enrollment._id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + animIndex * 0.04 }}
                              className="bg-surface rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-4">
                                  <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${enrollment.course?.color || "from-primary to-primary"} flex items-center justify-center shrink-0`}
                                  >
                                    <Play className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">{courseTitle}</h4>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {enrollment.preferredDays?.join(", ") || "Flexible"}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {enrollment.preferredTime || "Flexible"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 sm:shrink-0">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                                    {s.label}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-muted" />
                                </div>
                              </div>

                              {enrollment.status === "active" && enrollment.course && (
                                <div className="mt-4 pt-3 border-t border-border">
                                  <div className="flex justify-between text-xs text-muted mb-1.5">
                                    <span>Progress</span>
                                    <span>
                                      {Math.round(enrollment.course.lessons * 0.4)} /{" "}
                                      {enrollment.course.lessons} lessons
                                    </span>
                                  </div>
                                  <div className="h-2 bg-border rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full"
                                      style={{ width: "40%" }}
                                    />
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-border p-10 text-center">
              <FileText className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-muted">No enrollments yet.</p>
              <p className="text-sm text-muted mt-1">Browse courses and enroll your child to get started!</p>
            </div>
          )}
        </motion.div>

        {/* ═══ Instructor Notes ═══ */}
        {data.notes && data.notes.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-500" />
                Instructor Notes
                {data.unreadNotes > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                    {data.unreadNotes} new
                  </span>
                )}
              </h2>
            </div>
            <div className="space-y-3">
              {data.notes.map((note, i) => {
                const typeColors: Record<string, string> = {
                  progress: "bg-blue-400",
                  feedback: "bg-emerald-400",
                  absence: "bg-red-400",
                  achievement: "bg-amber-400",
                  general: "bg-muted",
                };
                return (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className={`bg-surface rounded-2xl border border-border p-5 ${!note.readByParent ? "ring-2 ring-primary/20" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${typeColors[note.type] || typeColors.general}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{note.title}</h4>
                          <span className="text-xs text-muted shrink-0">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted leading-relaxed mb-2">{note.body}</p>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span>By {note.instructorName}</span>
                          <span>&middot;</span>
                          <span>{note.childName}</span>
                          <span>&middot;</span>
                          <span className="capitalize">{note.type}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══ Quick Stats Row ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-sm">Active Courses</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.activeCourses}</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/20 rounded-2xl border border-violet-100 dark:border-violet-900/30 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-violet-500" />
              <span className="font-semibold text-sm">Completed</span>
            </div>
            <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{stats.completedCourses}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-sm">Total Lessons</span>
            </div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalLessons}</p>
          </div>
        </motion.div>

        {/* ═══ Recommended ═══ */}
        {recommended.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-bold mb-5">{t("recommended")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map((course, i) => (
                <CourseCard
                  key={course.slug || i}
                  course={{
                    id: course.slug,
                    category: course.category as "programming" | "robotics" | "algorithms" | "arabic" | "quran",
                    ageMin: course.ageMin,
                    ageMax: course.ageMax,
                    level: course.level as "beginner" | "intermediate" | "advanced",
                    lessons: course.lessons,
                    durationWeeks: course.durationWeeks,
                    color: course.color,
                    iconName: course.iconName,
                    titleKey: "",
                    descKey: "",
                    skillKeys: [],
                                       _title: course.title[lang],
                    _desc: course.description[lang],
                    imageUrl: course.imageUrl?.trim() || undefined,
                  }}
                  index={i}
                  title={course.title[lang]}
                  description={course.description[lang]}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ Invite a Friend ═══ */}
        <ReferralSection token={token} lang={lang} />
      </div>
    </div>
  );
}

function ReferralSection({ token, lang }: { token: string | null; lang: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalReferred: 0, discountPercent: 15 });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/referrals/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setCode(d.code || null);
        setStats({ totalReferred: d.totalReferred || 0, discountPercent: d.discountPercent || 15 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleCopy = () => {
    if (!code) return;
    const text = `Join ProCoder! Use my referral code ${code} for ${stats.discountPercent}% off your first course. https://procoder.com/en/courses`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !code) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10">
      <div className="bg-gradient-to-br from-primary/5 to-purple/5 rounded-2xl border border-primary/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              🎁 {lang === "ar" ? "ادعُ صديقاً" : "Invite a Friend"}
            </h3>
            <p className="text-sm text-muted">
              {lang === "ar"
                ? `شارك رمزك وامنح صديقك ${stats.discountPercent}% خصم على أول دورة`
                : `Share your code & give a friend ${stats.discountPercent}% off their first course`}
            </p>
            {stats.totalReferred > 0 && (
              <p className="text-xs text-muted mt-1">
                {lang === "ar" ? `${stats.totalReferred} عائلة دُعيت` : `${stats.totalReferred} families referred`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-surface border-2 border-dashed border-primary/30 rounded-xl px-5 py-3 text-center">
              <p className="text-xs text-muted mb-0.5">{lang === "ar" ? "رمزك" : "Your code"}</p>
              <p className="text-lg font-bold text-primary tracking-wider">{code}</p>
            </div>
            <button
              onClick={handleCopy}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                copied
                  ? "bg-emerald-500 text-white"
                  : "bg-primary text-white hover:scale-[1.02]"
              }`}
            >
              {copied
                ? lang === "ar" ? "✓ تم النسخ" : "✓ Copied!"
                : lang === "ar" ? "نسخ ومشاركة" : "Copy & Share"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
