"use client";

import { useEffect, useState, startTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { isParentPortalRole } from "@/lib/auth-flow";
import { useRouter } from "@/i18n/navigation";
import {
  fetchParentDashboard,
  fetchParentReferral,
  fetchParentHomework,
  type ParentDashboardData,
  type APICourse,
  type EnrollmentWithCourse,
  type InstructorNote,
  type HomeworkItem,
} from "@/lib/api";
import { BADGE_CATALOG, getBadge } from "@/lib/badges";
import { CourseCard } from "@/components/CourseCard";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
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
  Star,
  Trophy,
  UserX,
  Bell,
  ClipboardList,
  CalendarClock,
  BookMarked,
  Gift,
  Copy,
  Share2,
} from "lucide-react";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-100 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", label: "Pending" },
  confirmed: { bg: "bg-blue-100 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400", label: "Confirmed" },
  active: { bg: "bg-emerald-100 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", label: "Active" },
  completed: { bg: "bg-violet-100 dark:bg-violet-950/30", text: "text-violet-700 dark:text-violet-400", label: "Completed" },
  cancelled: { bg: "bg-red-100 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", label: "Cancelled" },
};

function progressForEnrollment(lessonsDone: number, totalLessons: number, status: string): number {
  if (status === "completed") return 100;
  if (totalLessons > 0) return Math.min(99, Math.round((lessonsDone / totalLessons) * 100));
  if (status === "active") return 45;
  if (status === "confirmed") return 10;
  return 0;
}

const DAY_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function nextSessionDate(preferredDays: string[], preferredTime: string): string | null {
  if (!preferredDays || preferredDays.length === 0) return null;
  const now = new Date();
  const todayIdx = now.getDay();
  const normalized = preferredDays.map((d) => {
    const idx = DAY_ORDER.findIndex((x) => x.toLowerCase() === d.toLowerCase());
    return idx === -1 ? null : idx;
  }).filter((x): x is number => x !== null);
  if (normalized.length === 0) return null;

  let minDiff = 8;
  let nextDay = -1;
  for (const dayIdx of normalized) {
    let diff = dayIdx - todayIdx;
    if (diff < 0) diff += 7;
    if (diff === 0) diff = 7; // same day next week
    if (diff < minDiff) { minDiff = diff; nextDay = dayIdx; }
  }
  if (nextDay === -1) return null;

  const next = new Date(now);
  next.setDate(now.getDate() + minDiff);
  const label = next.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  return preferredTime ? `${label} · ${preferredTime}` : label;
}

function childGroupKey(e: Pick<EnrollmentWithCourse, "childName" | "childStudentId">) {
  const n = String(e.childName || "").trim().toLowerCase().replace(/\s+/g, " ");
  const id = String(e.childStudentId || "").trim().toLowerCase();
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
      map.set(key, { key, childName: e.childName, childAge: e.childAge, gradeLevel: e.gradeLevel, enrollments: [] });
    }
    map.get(key)!.enrollments.push(e);
  }
  return [...map.values()];
}

type Props = { initialCourses: APICourse[] | null };

export default function DashboardContent({ initialCourses }: Props) {
  void initialCourses;
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const { token, loading: authLoading, isAuthenticated, role, logout } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<ParentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [hwUnread, setHwUnread] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "badges" | "homework" | "referral">("overview");

  useEffect(() => {
    if (authLoading || !isAuthenticated || !token) return;
    if (role && !isParentPortalRole(role)) router.replace("/instructor");
  }, [authLoading, isAuthenticated, token, role, router]);

  useEffect(() => {
    if (authLoading) return;
    if (!token) { startTransition(() => setLoading(false)); return; }
    if (role && !isParentPortalRole(role)) return;
    startTransition(() => { setLoading(true); setError(""); });
    fetchParentDashboard(token)
      .then((d) => { setData(d); startTransition(() => setLoading(false)); })
      .catch((err) => { setError(err.message); startTransition(() => setLoading(false)); });
  }, [token, authLoading, role]);

  useEffect(() => {
    if (!token || authLoading) return;
    fetchParentHomework(token)
      .then((res) => { setHomework(res.homework); setHwUnread(res.unreadCount); })
      .catch(() => {});
  }, [token, authLoading]);

  if (!authLoading && isAuthenticated && role && !isParentPortalRole(role)) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

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
            Teaching on StemTechLab?{" "}
            <LocalizedLink href="/instructor/login" className="text-primary font-medium hover:underline">Instructor sign-in</LocalizedLink>
          </p>
          <LocalizedLink href="/parent/login" className="inline-flex px-8 py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.02] transition-all">
            Sign in / Create account
          </LocalizedLink>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-muted">{error}</p>
        <button onClick={logout} className="mt-4 text-primary font-medium hover:underline">Log out and try again</button>
      </div>
    );
  }

  if (!data) return null;

  const { profile, stats, enrollments, recommended } = data;
  const enrollmentsByChild = groupEnrollmentsByChild(enrollments);

  const absenceNotes = (data.notes ?? []).filter((n) => n.type === "absence");
  const achievementNotes = (data.notes ?? []).filter((n) => n.type === "achievement");
  const otherNotes = (data.notes ?? []).filter((n) => n.type !== "absence");

  const activeEnrollments = enrollments.filter((e) => e.status === "active" || e.status === "confirmed");
  const completedEnrollments = enrollments.filter((e) => e.status === "completed");
  const enrollmentsWithBadges = enrollments.filter((e) => e.badges && e.badges.length > 0);

  const totalLessonsDone = enrollments.reduce((sum, e) => sum + (e.lessonsDone || 0), 0);
  const totalBadgesEarned = enrollments.reduce((sum, e) => sum + (e.badges?.length || 0), 0);

  return (
    <div className="py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══ Header ═══ */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              {t("welcome", { name: profile.name.split(" ")[0] })}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{profile.email}</span>
              {profile.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{profile.phone}</span>}
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted hover:text-red-500 hover:border-red-200 transition-colors self-start">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </motion.div>

        {/* ═══ Stats Grid ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {[
            { icon: BookOpen,     label: t("coursesEnrolled"),   value: stats.coursesEnrolled, iconBg: "bg-violet-500/10", iconColor: "text-violet-500" },
            { icon: GraduationCap, label: t("lessonsCompleted"), value: totalLessonsDone,       iconBg: "bg-amber-500/10",  iconColor: "text-amber-500"  },
            { icon: Award,        label: t("badges"),            value: totalBadgesEarned,      iconBg: "bg-emerald-500/10",iconColor: "text-emerald-500"},
            { icon: Flame,        label: t("streak"),            value: stats.streak,           iconBg: "bg-rose-500/10",  iconColor: "text-rose-500"   },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold leading-none">{stat.value}</p>
                <p className="text-xs text-muted mt-1 leading-tight">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ Tab Bar ═══ */}
        <div className="flex gap-1 mb-16 border-b border-border overflow-x-auto">
          {([
            { id: "overview",  icon: BookMarked,   label: "Overview" },
            { id: "badges",    icon: Trophy,        label: "Badges",    count: totalBadgesEarned + completedEnrollments.length + achievementNotes.length },
            { id: "homework",  icon: ClipboardList, label: "Homework",  count: homework.length, unread: hwUnread },
            { id: "referral",  icon: Gift,          label: "Referral" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground"}`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
              {"unread" in tab && tab.unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold leading-none">{tab.unread}</span>
              )}
              {"count" in tab && tab.count > 0 && (!("unread" in tab) || tab.unread === 0) && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ═══ Homework Tab ═══ */}
        {activeTab === "homework" && (
          <HomeworkTab homework={homework} lang={lang} />
        )}

        {/* ═══ Badges Tab ═══ */}
        {activeTab === "badges" && (
          <BadgesTab
            completedEnrollments={completedEnrollments}
            achievementNotes={achievementNotes}
            enrollmentsWithBadges={enrollmentsWithBadges}
            lang={lang}
          />
        )}

        {/* ═══ Referral Tab ═══ */}
        {activeTab === "referral" && (
          <ReferralTab token={token} lang={lang} />
        )}

        {/* ═══ Enrollments ═══ */}
        {activeTab === "overview" && (<>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mb-10">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
            <GraduationCap className="w-5 h-5 text-primary" />
            My Enrollments
            {enrollments.length > 0 && (
              <span className="text-base font-normal text-muted">({enrollments.length})</span>
            )}
          </h2>

          {enrollments.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {enrollmentsByChild.flatMap((group, gIdx) => {
                  const childTags = [
                    group.childName,
                    typeof group.childAge === "number" ? `Age ${group.childAge}` : null,
                    group.gradeLevel ? `Grade ${group.gradeLevel}` : null,
                  ].filter(Boolean) as string[];
                  return group.enrollments.map((enrollment, i) => {
                    const s = statusColors[enrollment.status] || statusColors.pending;
                    const courseTitle = enrollment.course ? enrollment.course.title[lang] : enrollment.courseTitle || enrollment.courseId;
                    const progress = progressForEnrollment(enrollment.lessonsDone ?? 0, enrollment.course?.lessons ?? 0, enrollment.status);
                    const animIndex = gIdx * 8 + i;
                    return (
                      <motion.div key={enrollment._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + animIndex * 0.04 }} className="bg-surface rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${enrollment.course?.color || "from-primary to-primary"} flex items-center justify-center shrink-0`}>
                              <Play className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{courseTitle}</h4>
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                {childTags.map((tag) => (
                                  <span key={tag} className="px-2 py-0.5 rounded-md bg-border/60 text-sm text-muted font-medium">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 sm:shrink-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>{s.label}</span>
                            <ChevronRight className="w-4 h-4 text-muted" />
                          </div>
                        </div>

                        {enrollment.status !== "pending" && enrollment.status !== "cancelled" && (
                          <div className="mt-4 pt-3 border-t border-border">
                            <div className="flex justify-between text-xs text-muted mb-1.5">
                              <span>Progress</span>
                              <span>
                                {enrollment.status === "completed"
                                  ? `${enrollment.course?.lessons ?? "—"} / ${enrollment.course?.lessons ?? "—"} lessons`
                                  : enrollment.course?.lessons
                                    ? `${enrollment.lessonsDone ?? 0} / ${enrollment.course.lessons} lessons`
                                    : enrollment.status === "confirmed" ? "Starting soon" : "In progress"}
                              </span>
                            </div>
                            <div className="h-2 bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  });
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

        {/* ═══ Upcoming Classes ═══ */}
        {activeEnrollments.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className="mb-10">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
              <Bell className="w-5 h-5 text-amber-500" />
              Upcoming Classes
            </h2>
            <div className="space-y-3">
              {activeEnrollments.map((enrollment, i) => {
                const courseTitle = enrollment.course ? enrollment.course.title[lang] : enrollment.courseTitle || enrollment.courseId;
                const next = nextSessionDate(enrollment.preferredDays, enrollment.preferredTime);
                return (
                  <motion.div key={enrollment._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="bg-surface rounded-2xl border border-border p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{courseTitle}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {enrollment.childName} ·{" "}
                        {enrollment.nextSession
                          ? new Date(enrollment.nextSession).toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                          : next ?? `${enrollment.preferredDays?.join(", ") || "Flexible"} · ${enrollment.preferredTime || "Flexible"}`}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${statusColors[enrollment.status]?.bg} ${statusColors[enrollment.status]?.text}`}>
                      {statusColors[enrollment.status]?.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══ Recorded Sessions ═══ */}
        {(() => {
          const allRecordings = enrollments
            .filter((e) => e.recordings && e.recordings.length > 0)
            .flatMap((e) =>
              e.recordings.map((r) => ({
                ...r,
                childName: e.childName,
                courseTitle: e.course ? e.course.title[lang] : e.courseTitle || e.courseId,
              }))
            )
            .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());

          if (allRecordings.length === 0) return null;
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29 }} className="mb-10">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
                <Play className="w-5 h-5 text-blue-500" />
                Recorded Sessions
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allRecordings.map((rec, i) => (
                  <motion.div key={rec._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.31 + i * 0.04 }} className="bg-surface rounded-2xl border border-border p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Play className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{rec.title || `Session Recording ${i + 1}`}</p>
                        <p className="text-xs text-muted mt-0.5">{rec.childName} · {rec.courseTitle}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted">{new Date(rec.sessionDate).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}</p>
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
                    >
                      <Play className="w-4 h-4" /> Watch Recording
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })()}

        {/* ═══ Instructor Notes ═══ */}
        {otherNotes.length > 0 && (
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
              {otherNotes.map((note, i) => (
                <NoteCard key={note._id} note={note} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ Attendance History ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.33 }} className="mb-10">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
            <UserX className="w-5 h-5 text-rose-500" />
            Attendance History
          </h2>
          {absenceNotes.length > 0 ? (
            <div className="space-y-3">
              {absenceNotes.map((note, i) => (
                <motion.div key={note._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.04 }} className="bg-surface rounded-2xl border border-border p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <UserX className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-sm">{note.title}</p>
                      <span className="text-xs text-muted shrink-0">{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{note.body}</p>
                    <p className="text-xs text-muted mt-1">{note.childName} · By {note.instructorName}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-6 flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">Perfect attendance!</p>
                <p className="text-sm text-emerald-600/80 dark:text-emerald-500/80">No absences recorded — great job!</p>
              </div>
            </div>
          )}
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
                    category: course.category as "programming" | "robotics" | "algorithms" | "arabic" | "arabic",
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

        </>)}
      </div>
    </div>
  );
}

// ─── Badges Tab ────────────────────────────────────────────────────────────
function BadgesTab({
  completedEnrollments,
  achievementNotes,
  enrollmentsWithBadges,
  lang,
}: {
  completedEnrollments: EnrollmentWithCourse[];
  achievementNotes: ReturnType<typeof Array.prototype.filter>;
  enrollmentsWithBadges: EnrollmentWithCourse[];
  lang: "en" | "ar";
}) {
  const total =
    completedEnrollments.length +
    achievementNotes.length +
    enrollmentsWithBadges.reduce((s: number, e: EnrollmentWithCourse) => s + (e.badges?.length || 0), 0);

  if (total === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
        <div className="bg-surface rounded-2xl border border-border p-14 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <p className="font-semibold text-lg mb-2">No badges yet</p>
          <p className="text-sm text-muted max-w-sm mx-auto">
            Complete courses or earn instructor awards to see badges and certificates here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Badges &amp; Certificates</h2>
          <p className="text-sm text-muted">{total} achievement{total !== 1 ? "s" : ""} earned</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {completedEnrollments.map((enrollment, i) => {
          const courseTitle = enrollment.course ? enrollment.course.title[lang] : enrollment.courseTitle || enrollment.courseId;
          return (
            <motion.div key={enrollment._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-surface rounded-2xl border border-amber-200 dark:border-amber-900/40 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${enrollment.course?.color || "from-violet-500 to-primary"} flex items-center justify-center shrink-0 shadow-sm`}>
                <Trophy className="w-8 h-8 text-white drop-shadow" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-snug">{courseTitle}</p>
                <p className="text-xs text-muted mt-1">{enrollment.childName}</p>
                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Course Completed
                </span>
              </div>
            </motion.div>
          );
        })}
        {(achievementNotes as InstructorNote[]).map((note, i) => (
          <motion.div key={note._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (completedEnrollments.length + i) * 0.06 }}
            className="bg-surface rounded-2xl border border-violet-200 dark:border-violet-900/40 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center shrink-0 shadow-sm">
              <Star className="w-8 h-8 text-white fill-white/30 drop-shadow" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-snug">{note.title}</p>
              <p className="text-xs text-muted mt-1">{note.childName}</p>
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 text-xs font-semibold">
                <Star className="w-3 h-3 fill-current" /> Achievement
              </span>
            </div>
          </motion.div>
        ))}
        {enrollmentsWithBadges.flatMap((enrollment, eIdx) =>
          (enrollment.badges ?? []).map((badge, bIdx) => {
            const def = getBadge(badge.name);
            const courseTitle = enrollment.course ? enrollment.course.title[lang] : enrollment.courseTitle || enrollment.courseId;
            const delay = (completedEnrollments.length + achievementNotes.length + eIdx + bIdx) * 0.06;
            if (def) {
              const BadgeIcon = def.icon;
              return (
                <motion.div key={`${enrollment._id}-${badge.name}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
                  className="bg-surface rounded-2xl border border-border p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${def.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                    <BadgeIcon className="w-8 h-8 text-white drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm leading-snug ${def.textColor}`}>{def.name}</p>
                    <p className="text-xs text-muted mt-0.5 italic">{def.tagline}</p>
                    <p className="text-xs text-muted mt-1">{enrollment.childName} · {courseTitle}</p>
                    <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 ${def.textColor}`}>
                      {new Date(badge.awardedAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              );
            }
            return (
              <motion.div key={`${enrollment._id}-${badge.name}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
                className="bg-surface rounded-2xl border border-amber-200 dark:border-amber-900/40 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                  <Star className="w-8 h-8 text-white fill-white/40 drop-shadow" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug">{badge.name}</p>
                  <p className="text-xs text-muted mt-1">{enrollment.childName} · {courseTitle}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                    Instructor Badge · {new Date(badge.awardedAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

// ─── Referral Tab ───────────────────────────────────────────────────────────
function ReferralTab({ token, lang }: { token: string | null; lang: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalReferred: 0, discountPercent: 15 });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchParentReferral(token)
      .then((d) => {
        if (cancelled) return;
        setCode(d.code || null);
        setStats({ totalReferred: d.totalReferred || 0, discountPercent: d.discountPercent ?? 15 });
      })
      .catch(() => { if (!cancelled) setCode(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  const shareText = code
    ? `Join StemTechLab! Use my referral code ${code} for ${stats.discountPercent}% off your first course.\n\nHow to use: go to any course → click Enroll → on the last step enter code "${code}" in the "Promo or referral code" field.\n\nhttps://www.stemtechlab.com/en/courses`
    : "";

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (!code) {
    return (
      <div className="text-center py-20 text-muted">
        <Gift className="w-12 h-12 mx-auto mb-4 text-muted" />
        <p>Referral program not available yet.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10 max-w-2xl mx-auto">
      {/* Hero card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-purple rounded-3xl p-8 sm:p-10 text-white mb-6 text-center">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-white/5" />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {lang === "ar" ? "ادعُ صديقاً" : "Invite a Friend"}
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-sm mx-auto">
            {lang === "ar"
              ? `شارك رمزك وامنح صديقك ${stats.discountPercent}% خصم على أول دورة لهم`
              : `Share your code and give a friend ${stats.discountPercent}% off their first course enrollment`}
          </p>
        </div>
      </div>

      {/* Code box */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-4">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 text-center">
          {lang === "ar" ? "رمز الإحالة الخاص بك" : "Your Referral Code"}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-background border-2 border-dashed border-primary/30 rounded-xl py-4 text-center">
            <span className="text-3xl font-bold text-primary tracking-[0.15em]">{code}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex flex-col items-center gap-1.5 px-5 py-4 rounded-xl font-semibold text-sm transition-all ${copied ? "bg-emerald-500 text-white scale-95" : "bg-primary text-white hover:scale-[1.03]"}`}
          >
            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? (lang === "ar" ? "تم!" : "Copied!") : (lang === "ar" ? "نسخ" : "Copy")}
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-surface rounded-2xl border border-border p-6 mb-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" />
          {lang === "ar" ? "كيف يعمل؟" : "How it works"}
        </h3>
        <ol className="space-y-3">
          {[
            lang === "ar" ? "شارك الرمز مع الأصدقاء والعائلة" : "Share your code with friends & family",
            lang === "ar" ? "يختارون دورة ويضغطون تسجيل" : "They choose a course and click Enroll",
            lang === "ar" ? `يدخلون الرمز "${code}" في خانة كود الخصم` : `They enter "${code}" in the promo/referral code field`,
            lang === "ar" ? `يحصلون على خصم ${stats.discountPercent}% فوراً` : `They get ${stats.discountPercent}% off instantly`,
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Stats */}
      {stats.totalReferred > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">{stats.totalReferred}</p>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-500/80">
              {lang === "ar" ? "عائلة انضمت بفضلك" : `${stats.totalReferred === 1 ? "family" : "families"} referred so far`}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

const HW_STATUS_STYLES: Record<string, { label: string; color: string }> = {
  assigned: { label: "Assigned", color: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400" },
  submitted: { label: "Submitted", color: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" },
  graded: { label: "Graded", color: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" },
};

function HomeworkTab({ homework, lang }: { homework: HomeworkItem[]; lang: string }) {
  void lang;
  if (homework.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface rounded-2xl border border-border p-12 text-center mb-10">
        <ClipboardList className="w-12 h-12 text-muted mx-auto mb-4" />
        <p className="font-semibold text-lg mb-1">No homework yet</p>
        <p className="text-sm text-muted">Your child&apos;s instructor will assign homework here. Check back soon!</p>
      </motion.div>
    );
  }

  const byChild = homework.reduce<Record<string, HomeworkItem[]>>((acc, hw) => {
    const key = hw.childName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(hw);
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10 space-y-8">
      {Object.entries(byChild).map(([childName, items]) => (
        <div key={childName}>
          {Object.keys(byChild).length > 1 && (
            <h3 className="text-base font-semibold mb-3 text-muted">{childName}</h3>
          )}
          <div className="space-y-3">
            {items.map((hw, i) => {
              const st = HW_STATUS_STYLES[hw.status] ?? HW_STATUS_STYLES.assigned;
              const isOverdue = hw.dueDate && hw.status === "assigned" && new Date(hw.dueDate) < new Date();
              return (
                <motion.div
                  key={hw._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-surface rounded-2xl border p-5 ${!hw.readByParent ? "border-primary/30 ring-2 ring-primary/10" : "border-border"}`}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <ClipboardList className="w-5 h-5 text-violet-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-semibold text-sm">{hw.title}</p>
                          {!hw.readByParent && (
                            <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-xs font-bold">New</span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                          {hw.grade && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400">
                              {hw.grade}
                            </span>
                          )}
                        </div>
                        {hw.description && (
                          <p className="text-sm text-muted leading-relaxed mb-2">{hw.description}</p>
                        )}
                        {hw.feedback && (
                          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-emerald-700 dark:text-emerald-400">{hw.feedback}</p>
                          </div>
                        )}
                        <div className="flex items-center flex-wrap gap-3 text-xs text-muted">
                          <span>By {hw.instructorName}</span>
                          <span>&middot;</span>
                          <span>{hw.courseId}</span>
                          <span>&middot;</span>
                          <span>Assigned {new Date(hw.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          {hw.dueDate && (
                            <>
                              <span>&middot;</span>
                              <span className={`flex items-center gap-1 ${isOverdue ? "text-red-500 font-semibold" : ""}`}>
                                <CalendarClock className="w-3 h-3" />
                                Due {new Date(hw.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                {isOverdue && " (overdue)"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function NoteCard({ note, index }: { note: InstructorNote; index: number }) {
  const typeColors: Record<string, string> = {
    progress: "bg-blue-400",
    feedback: "bg-emerald-400",
    absence: "bg-red-400",
    achievement: "bg-amber-400",
    general: "bg-muted",
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 + index * 0.04 }}
      className={`bg-surface rounded-2xl border border-border p-5 ${!note.readByParent ? "ring-2 ring-primary/20" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${typeColors[note.type] || typeColors.general}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm">{note.title}</h4>
            <span className="text-xs text-muted shrink-0">{new Date(note.createdAt).toLocaleDateString()}</span>
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
}
