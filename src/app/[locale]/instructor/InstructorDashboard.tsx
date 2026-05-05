"use client";

import { useCallback, useEffect, useState, startTransition } from "react";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { isInstructorPortalRole } from "@/lib/auth-flow";
import { useRouter } from "@/i18n/navigation";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  fetchInstructorDashboard,
  createInstructorNote,
  deleteInstructorNote,
  updateStudentProgress,
  type InstructorDashboardData,
  type InstructorStudent,
} from "@/lib/api";
import { BADGE_CATALOG, getBadge } from "@/lib/badges";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  FileText,
  Send,
  Trash2,
  Loader2,
  User,
  LogOut,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Target,
  Heart,
  Award,
  MessageCircle,
  Play,
  TrendingUp,
  Star,
  X,
  Check,
} from "lucide-react";

const noteTypes = [
  { value: "progress", label: "Progress Update", icon: Target, color: "bg-blue-400" },
  { value: "feedback", label: "Feedback", icon: MessageCircle, color: "bg-emerald-400" },
  { value: "absence", label: "Absence Report", icon: AlertCircle, color: "bg-red-400" },
  { value: "achievement", label: "Achievement", icon: Award, color: "bg-amber-400" },
  { value: "general", label: "General Note", icon: FileText, color: "bg-muted" },
] as const;

export default function InstructorDashboard() {
  const locale = useLocale();
  const lang = locale === "ar" ? "ar" : "en";
  const { token, loading: authLoading, isAuthenticated, role, logout } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<InstructorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !isAuthenticated || !token) return;
    if (role && !isInstructorPortalRole(role)) router.replace("/dashboard");
  }, [authLoading, isAuthenticated, token, role, router]);

  const [noteForm, setNoteForm] = useState({ enrollmentId: "", title: "", body: "", type: "general" });
  const [sending, setSending] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const reload = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    fetchInstructorDashboard(token)
      .then((d) => { setData(d); startTransition(() => setLoading(false)); })
      .catch((err) => { setError(err.message); startTransition(() => setLoading(false)); });
  }, [token]);

  useEffect(() => {
    if (authLoading) return;
    if (!token) { startTransition(() => setLoading(false)); return; }
    if (role && !isInstructorPortalRole(role)) return;
    reload();
  }, [token, authLoading, role, reload]);

  const handleSendNote = async (student: InstructorStudent) => {
    if (!token || !noteForm.title.trim() || !noteForm.body.trim()) return;
    setSending(true);
    try {
      await createInstructorNote(token, {
        enrollmentId: student.enrollmentId,
        title: noteForm.title,
        body: noteForm.body,
        type: noteForm.type,
      });
      setNoteForm({ enrollmentId: "", title: "", body: "", type: "general" });
      reload();
    } catch { /* silent */ } finally { setSending(false); }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!token) return;
    try { await deleteInstructorNote(token, noteId); reload(); } catch { /* silent */ }
  };

  if (!authLoading && isAuthenticated && role && !isInstructorPortalRole(role)) {
    return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="py-20 sm:py-32 text-center">
        <div className="max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Instructor Dashboard</h1>
          <p className="text-muted mb-8">Sign in with your instructor account to access your dashboard.</p>
          <p className="text-sm text-muted mb-6">
            Parent or student?{" "}
            <LocalizedLink href="/parent/login" className="text-primary font-medium hover:underline">Parent sign-in</LocalizedLink>
          </p>
          <LocalizedLink href="/instructor/login" className="inline-flex px-8 py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
            Sign in
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
        <p className="text-muted mb-2">{error}</p>
        <button onClick={logout} className="text-primary font-medium hover:underline">Log out and try again</button>
      </div>
    );
  }

  if (!data) return null;

  const { profile, courses, students, recentNotes, stats } = data;
  const filteredStudents = selectedCourse === "all"
    ? students
    : students.filter((s) => s.courseId === selectedCourse);
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const pagedStudents = filteredStudents.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const selectCourse = (slug: string) => { setSelectedCourse(slug); setPage(0); setExpandedStudent(null); };

  return (
    <div className="py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">Welcome, {profile.name}</h1>
            <p className="text-muted text-sm">{profile.email} &middot; {profile.specialties.join(", ") || "Instructor"}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted hover:text-red-500 hover:border-red-200 transition-colors self-start">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { icon: Users, label: "Total Students", value: stats.totalStudents, color: "text-primary", bg: "bg-primary/10" },
            { icon: Play, label: "Active", value: stats.activeStudents, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: Clock, label: "Pending", value: stats.pendingStudents, color: "text-amber-500", bg: "bg-amber-500/10" },
            { icon: BookOpen, label: "Courses", value: stats.totalCourses, color: "text-violet-500", bg: "bg-violet-500/10" },
            { icon: FileText, label: "Notes Sent", value: stats.notesWritten, color: "text-blue-500", bg: "bg-blue-500/10" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }} className="bg-surface rounded-2xl border border-border p-4">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Course filter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => selectCourse("all")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCourse === "all" ? "bg-primary text-white shadow-sm" : "bg-surface border border-border text-muted hover:text-foreground"}`}>
            All Students ({students.length})
          </button>
          {courses.map((c) => {
            const count = students.filter((s) => s.courseId === c.slug).length;
            return (
              <button key={c.slug} onClick={() => selectCourse(c.slug)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCourse === c.slug ? "bg-primary text-white shadow-sm" : "bg-surface border border-border text-muted hover:text-foreground"}`}>
                {c.title[lang]} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Students list */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="space-y-4 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              My Students
              {filteredStudents.length > 0 && (
                <span className="text-sm font-normal text-muted">
                  ({filteredStudents.length} total)
                </span>
              )}
            </h2>
            {totalPages > 1 && (
              <span className="text-sm text-muted">
                Page {page + 1} of {totalPages}
              </span>
            )}
          </div>

          {filteredStudents.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border p-10 text-center">
              <Users className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="text-muted">No students enrolled yet.</p>
            </div>
          ) : (
            pagedStudents.map((student) => {
              const isExpanded = expandedStudent === student.enrollmentId;
              const studentNotes = recentNotes.filter((n) => n.enrollment === student.enrollmentId);

              return (
                <div key={student.enrollmentId} className="bg-surface rounded-2xl border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedStudent(isExpanded ? null : student.enrollmentId)}
                    className="w-full flex items-center justify-between p-5 hover:bg-surface-hover transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {student.childName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{student.childName}, {student.childAge}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                          <span>{student.courseTitle || student.courseId}</span>
                          <span>&middot;</span>
                          <span>Parent: {student.parentName}</span>
                          <span>&middot;</span>
                          <span className="capitalize">{student.status}</span>
                        </div>
                        {/* Progress mini bar */}
                        {student.totalLessons > 0 && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, Math.round((student.lessonsDone / student.totalLessons) * 100))}%` }} />
                            </div>
                            <span className="text-xs text-muted">{student.lessonsDone}/{student.totalLessons} lessons</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {student.badges.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <Star className="w-3 h-3 fill-current" />{student.badges.length}
                        </span>
                      )}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${student.status === "active" ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600" : "bg-amber-100 dark:bg-amber-950/30 text-amber-600"}`}>
                        {student.status}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="px-5 pb-5 border-t border-border pt-4 space-y-6">

                          {/* Student details */}
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <p className="flex items-center gap-2 text-muted"><User className="w-3.5 h-3.5" /> Parent: <strong className="text-foreground">{student.parentName}</strong></p>
                              <p className="flex items-center gap-2 text-muted"><Heart className="w-3.5 h-3.5" /> Email: <strong className="text-foreground">{student.parentEmail}</strong></p>
                              {student.phone && <p className="flex items-center gap-2 text-muted"><MessageCircle className="w-3.5 h-3.5" /> Phone: <strong className="text-foreground">{student.phone}</strong></p>}
                              <p className="flex items-center gap-2 text-muted"><Calendar className="w-3.5 h-3.5" /> Days: <strong className="text-foreground">{student.preferredDays?.join(", ") || "Flexible"}</strong></p>
                              <p className="flex items-center gap-2 text-muted"><Clock className="w-3.5 h-3.5" /> Time: <strong className="text-foreground">{student.preferredTime || "Flexible"}</strong></p>
                            </div>
                            <div className="space-y-2">
                              {student.learningGoals && <p className="text-muted"><strong>Goals:</strong> {student.learningGoals}</p>}
                              {student.specialNeeds && <p className="text-muted"><strong>Special Needs:</strong> {student.specialNeeds}</p>}
                              <p className="text-muted"><strong>Format:</strong> {student.sessionFormat}</p>
                            </div>
                          </div>

                          {/* ── Progress & Scheduling controls ── */}
                          <ProgressControls student={student} token={token!} onSaved={reload} />

                          {/* ── Badge management ── */}
                          <BadgeControls student={student} token={token!} onSaved={reload} />

                          {/* Past notes */}
                          {studentNotes.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-3">Previous Notes</h4>
                              <div className="space-y-2">
                                {studentNotes.map((note) => (
                                  <div key={note._id} className="flex items-start justify-between gap-3 p-3 bg-background rounded-xl text-sm">
                                    <div>
                                      <p className="font-medium">{note.title}</p>
                                      <p className="text-muted text-xs mt-0.5">{note.body}</p>
                                      <p className="text-xs text-muted mt-1">{new Date(note.createdAt).toLocaleDateString()} &middot; {note.type}</p>
                                    </div>
                                    <button onClick={() => handleDeleteNote(note._id)} className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Write new note */}
                          <div className="bg-background rounded-xl p-4">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Send className="w-4 h-4 text-primary" />
                              Send Note to Parent
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {noteTypes.map((nt) => (
                                <button key={nt.value} onClick={() => setNoteForm({ ...noteForm, type: nt.value })} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${noteForm.type === nt.value ? "bg-primary text-white" : "bg-surface border border-border text-muted hover:text-foreground"}`}>
                                  <nt.icon className="w-3 h-3" />
                                  {nt.label}
                                </button>
                              ))}
                            </div>
                            <input
                              type="text"
                              placeholder="Note title..."
                              value={noteForm.enrollmentId === student.enrollmentId ? noteForm.title : ""}
                              onFocus={() => setNoteForm({ ...noteForm, enrollmentId: student.enrollmentId })}
                              onChange={(e) => setNoteForm({ ...noteForm, enrollmentId: student.enrollmentId, title: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm placeholder:text-muted focus:border-primary outline-none mb-2"
                            />
                            <textarea
                              placeholder="Write your note... (this will be visible to the parent)"
                              rows={3}
                              value={noteForm.enrollmentId === student.enrollmentId ? noteForm.body : ""}
                              onFocus={() => setNoteForm({ ...noteForm, enrollmentId: student.enrollmentId })}
                              onChange={(e) => setNoteForm({ ...noteForm, enrollmentId: student.enrollmentId, body: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm placeholder:text-muted focus:border-primary outline-none resize-none mb-3"
                            />
                            <button
                              onClick={() => handleSendNote(student)}
                              disabled={sending || !noteForm.title.trim() || !noteForm.body.trim() || noteForm.enrollmentId !== student.enrollmentId}
                              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4" />
                              {sending ? "Sending..." : "Send to Parent"}
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => { setPage((p) => p - 1); setExpandedStudent(null); }}
                disabled={page === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  const isActive = i === page;
                  const isNearby = Math.abs(i - page) <= 2;
                  const isEdge = i === 0 || i === totalPages - 1;
                  if (!isNearby && !isEdge) {
                    if (i === 1 || i === totalPages - 2) return <span key={i} className="px-1 text-muted text-sm">…</span>;
                    return null;
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => { setPage(i); setExpandedStudent(null); }}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-primary text-white shadow-sm" : "border border-border text-muted hover:text-foreground hover:border-primary/40"}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => { setPage((p) => p + 1); setExpandedStudent(null); }}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ProgressControls({ student, token, onSaved }: { student: InstructorStudent; token: string; onSaved: () => void }) {
  const toDatetimeLocal = (v: string | null) =>
    v ? new Date(v).toISOString().slice(0, 16) : "";

  const [lessons, setLessons] = useState(student.lessonsDone);
  const [nextSession, setNextSession] = useState(() => toDatetimeLocal(student.nextSession));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Sync inputs when the parent re-fetches after a save (avoids stale display)
  useEffect(() => {
    setLessons(student.lessonsDone);
    setNextSession(toDatetimeLocal(student.nextSession));
  }, [student.lessonsDone, student.nextSession]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await updateStudentProgress(token, student.enrollmentId, {
        lessonsDone: Math.min(lessons, student.totalLessons || lessons),
        nextSession: nextSession || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onSaved();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save — please try again");
    } finally {
      setSaving(false);
    }
  };

  const max = student.totalLessons || 999;

  return (
    <div className="bg-background rounded-xl p-4">
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        Progress & Next Session
      </h4>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-muted mb-1">Lessons completed</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={max}
              value={lessons}
              onChange={(e) => setLessons(Math.min(max, Math.max(0, Number(e.target.value))))}
              className="w-24 px-3 py-2 rounded-lg bg-surface border border-border text-sm focus:border-primary outline-none"
            />
            {student.totalLessons > 0 && (
              <span className="text-xs text-muted">/ {student.totalLessons} total</span>
            )}
          </div>
          {student.totalLessons > 0 && (
            <div className="mt-2 h-2 bg-border rounded-full overflow-hidden w-full">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((lessons / student.totalLessons) * 100))}%` }}
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Next session date & time</label>
          <input
            type="datetime-local"
            value={nextSession}
            onChange={(e) => setNextSession(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm focus:border-primary outline-none"
          />
          {nextSession && (
            <button onClick={() => setNextSession("")} className="text-xs text-muted hover:text-red-500 mt-1 transition-colors">
              Clear date
            </button>
          )}
        </div>
      </div>
      {saveError && (
        <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {saveError}
        </p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${saved ? "bg-emerald-500 text-white" : "bg-primary text-white hover:scale-[1.02]"}`}
      >
        {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? "Saving..." : <><TrendingUp className="w-4 h-4" /> Save Progress</>}
      </button>
    </div>
  );
}

function BadgeControls({ student, token, onSaved }: { student: InstructorStudent; token: string; onSaved: () => void }) {
  const [saving, setSaving] = useState<string | null>(null);
  const [badgeError, setBadgeError] = useState("");

  const awardedIds = new Set(student.badges.map((b) => b.name));

  const handleToggle = async (badgeId: string) => {
    setBadgeError("");
    setSaving(badgeId);
    try {
      if (awardedIds.has(badgeId)) {
        await updateStudentProgress(token, student.enrollmentId, { removeBadge: badgeId });
      } else {
        await updateStudentProgress(token, student.enrollmentId, { addBadge: badgeId });
      }
      onSaved();
    } catch (err) {
      setBadgeError(err instanceof Error ? err.message : "Failed to update badge");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="bg-background rounded-xl p-4">
      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Award className="w-4 h-4 text-amber-500" />
        Award Badges
        {student.badges.length > 0 && (
          <span className="ml-auto text-xs text-muted font-normal">
            {student.badges.length} awarded
          </span>
        )}
      </h4>

      {badgeError && (
        <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {badgeError}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {BADGE_CATALOG.map((badge) => {
          const awarded = awardedIds.has(badge.id);
          const isLoading = saving === badge.id;
          const Icon = badge.icon;
          return (
            <button
              key={badge.id}
              onClick={() => handleToggle(badge.id)}
              disabled={isLoading}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-200 disabled:opacity-60 ${
                awarded
                  ? "border-transparent ring-2 " + badge.ring + " bg-gradient-to-br " + badge.gradient + " shadow-lg " + badge.glow
                  : "border-border bg-surface hover:border-primary/30 hover:shadow-md"
              }`}
            >
              {isLoading ? (
                <Loader2 className={`w-6 h-6 animate-spin ${awarded ? "text-white" : "text-muted"}`} />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${awarded ? "bg-white/20" : "bg-gradient-to-br " + badge.gradient}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
              <span className={`text-xs font-semibold leading-tight ${awarded ? "text-white" : "text-foreground"}`}>
                {badge.name}
              </span>
              {awarded && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
