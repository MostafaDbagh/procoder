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
 type InstructorDashboardData,
 type InstructorStudent,
} from "@/lib/api";
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
 Clock,
 Calendar,
 Target,
 Heart,
 Award,
 MessageCircle,
 Play,
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
 if (role && !isInstructorPortalRole(role)) {
 router.replace("/dashboard");
 }
 }, [authLoading, isAuthenticated, token, role, router]);

 // Note form
 const [noteForm, setNoteForm] = useState({ enrollmentId: "", title: "", body: "", type: "general" });
 const [sending, setSending] = useState(false);
 const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
 const [selectedCourse, setSelectedCourse] = useState<string>("all");

 const reload = useCallback(() => {
 if (!token) return;
 setLoading(true);
 setError("");
 fetchInstructorDashboard(token)
 .then((d) => {
 setData(d);
 startTransition(() => setLoading(false));
 })
 .catch((err) => {
 setError(err.message);
 startTransition(() => setLoading(false));
 });
 }, [token]);

 useEffect(() => {
 if (authLoading) return;
 if (!token) {
 startTransition(() => setLoading(false));
 return;
 }
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
 } catch {
 // silent
 } finally {
 setSending(false);
 }
 };

 const handleDeleteNote = async (noteId: string) => {
 if (!token) return;
 try {
 await deleteInstructorNote(token, noteId);
 reload();
 } catch {
 // silent
 }
 };

 if (!authLoading && isAuthenticated && role && !isInstructorPortalRole(role)) {
 return (
 <div className="flex justify-center py-32">
 <Loader2 className="w-8 h-8 text-primary animate-spin" aria-label="Redirecting" />
 </div>
 );
 }

 // Auth gate (visitor or no token)
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
 <LocalizedLink href="/parent/login" className="text-primary font-medium hover:underline">
 Parent sign-in
 </LocalizedLink>
 </p>
 <LocalizedLink
 href="/instructor/login"
 className="inline-flex px-8 py-3.5 rounded-2xl bg-primary text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
 >
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
 <button
 onClick={() => setSelectedCourse("all")}
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCourse === "all" ? "bg-primary text-white shadow-sm" : "bg-surface border border-border text-muted hover:text-foreground"}`}
 >
 All Students ({students.length})
 </button>
 {courses.map((c) => {
 const count = students.filter((s) => s.courseId === c.slug).length;
 return (
 <button
 key={c.slug}
 onClick={() => setSelectedCourse(c.slug)}
 className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCourse === c.slug ? "bg-primary text-white shadow-sm" : "bg-surface border border-border text-muted hover:text-foreground"}`}
 >
 {c.title[lang]} ({count})
 </button>
 );
 })}
 </motion.div>

 {/* Students list */}
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="space-y-4 mb-10">
 <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
 <Users className="w-5 h-5 text-primary" />
 My Students
 </h2>

 {filteredStudents.length === 0 ? (
 <div className="bg-surface rounded-2xl border border-border p-10 text-center">
 <Users className="w-10 h-10 text-muted mx-auto mb-3" />
 <p className="text-muted">No students enrolled yet.</p>
 </div>
 ) : (
 filteredStudents.map((student) => {
 const isExpanded = expandedStudent === student.enrollmentId;
 const studentNotes = recentNotes.filter((n) => n.enrollment === student.enrollmentId);

 return (
 <div key={student.enrollmentId} className="bg-surface rounded-2xl border border-border overflow-hidden">
 {/* Student header */}
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
 </div>
 </div>
 <div className="flex items-center gap-3">
 <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${student.status === "active" ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600" : "bg-amber-100 dark:bg-amber-950/30 text-amber-600"}`}>
 {student.status}
 </span>
 {isExpanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
 </div>
 </button>

 {/* Expanded content */}
 <AnimatePresence>
 {isExpanded && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.25 }}
 className="overflow-hidden"
 >
 <div className="px-5 pb-5 border-t border-border pt-4">
 {/* Student details */}
 <div className="grid sm:grid-cols-2 gap-4 mb-6">
 <div className="space-y-2 text-sm">
 <p className="flex items-center gap-2 text-muted"><User className="w-3.5 h-3.5" /> Parent: <strong className="text-foreground">{student.parentName}</strong></p>
 <p className="flex items-center gap-2 text-muted"><Heart className="w-3.5 h-3.5" /> Email: <strong className="text-foreground">{student.parentEmail}</strong></p>
 {student.phone && <p className="flex items-center gap-2 text-muted"><MessageCircle className="w-3.5 h-3.5" /> Phone: <strong className="text-foreground">{student.phone}</strong></p>}
 <p className="flex items-center gap-2 text-muted"><Calendar className="w-3.5 h-3.5" /> Days: <strong className="text-foreground">{student.preferredDays?.join(", ") || "Flexible"}</strong></p>
 <p className="flex items-center gap-2 text-muted"><Clock className="w-3.5 h-3.5" /> Time: <strong className="text-foreground">{student.preferredTime || "Flexible"}</strong></p>
 </div>
 <div className="space-y-2 text-sm">
 {student.learningGoals && <p className="text-muted"><strong>Goals:</strong> {student.learningGoals}</p>}
 {student.specialNeeds && <p className="text-muted"><strong>Special Needs:</strong> {student.specialNeeds}</p>}
 <p className="text-muted"><strong>Format:</strong> {student.sessionFormat}</p>
 </div>
 </div>

 {/* Past notes for this student */}
 {studentNotes.length > 0 && (
 <div className="mb-6">
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
 <button
 key={nt.value}
 onClick={() => setNoteForm({ ...noteForm, type: nt.value })}
 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${noteForm.type === nt.value ? "bg-primary text-white" : "bg-surface border border-border text-muted hover:text-foreground"}`}
 >
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
 </motion.div>
 </div>
 </div>
 );
}
