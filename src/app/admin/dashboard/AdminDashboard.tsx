"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
 adminFetch,
 clearAdminToken,
 getAdminToken,
} from "@/lib/admin-api";
import {
 TEAM_CARD_GRADIENTS,
 TEAM_STAR_HEADER_COLORS,
 resolveTeamCardGradient,
} from "@/lib/teamStarPresets";

function teamSkillsToCsv(v: unknown): string {
 if (!Array.isArray(v)) return "";
 return v.map((x) => String(x).trim()).filter(Boolean).join(", ");
}

/** Browser preview for team photos (Express serves `/uploads/...` on the API origin). */
function teamPhotoPreviewSrc(photoUrl: string): string {
 const s = photoUrl.trim();
 if (!s) return "";
 if (s.startsWith("http://") || s.startsWith("https://")) return s;
 const base = (
 typeof process !== "undefined"
 ? process.env.NEXT_PUBLIC_API_ORIGIN?.replace(/\/$/, "")
 : ""
 ) || "http://127.0.0.1:5000";
 return `${base.replace(/\/$/, "")}${s.startsWith("/") ? s : `/${s}`}`;
}

type Tab =
 | "overview"
 | "courses"
 | "categories"
 | "enrollments"
 | "contacts"
 | "challenges"
 | "team"
 | "users"
 | "payments"
 | "promos"
 | "blog"
 | "careers";

type AdminCategoryRow = {
 _id: string;
 slug: string;
 title: { en: string; ar: string };
 description?: { en: string; ar: string };
 sortOrder: number;
 isActive: boolean;
};

type Paginated<T> = {
 items: T[];
 total: number;
 page: number;
 limit: number;
 totalPages: number;
};

type ListMeta = {
 total: number;
 page: number;
 limit: number;
 totalPages: number;
};

const PAGE_SIZE = 15;

const emptyMeta: ListMeta = {
 total: 0,
 page: 1,
 limit: PAGE_SIZE,
 totalPages: 1,
};

/** stem-Be may return `{ items, total, ... }` or a legacy JSON array. */
function normalizePagedResponse<T>(
 data: unknown,
 defaultLimit: number
): { items: T[]; meta: ListMeta } {
 if (Array.isArray(data)) {
 const n = data.length;
 return {
 items: data as T[],
 meta: {
 total: n,
 page: 1,
 limit: n > 0 ? n : defaultLimit,
 totalPages: 1,
 },
 };
 }
 if (data && typeof data === "object" && data !== null && "items" in data) {
 const p = data as Partial<Paginated<T>>;
 const items = Array.isArray(p.items) ? p.items : [];
 return {
 items,
 meta: {
 total: p.total ?? items.length,
 page: p.page ?? 1,
 limit: p.limit ?? defaultLimit,
 totalPages: p.totalPages ?? 1,
 },
 };
 }
 return { items: [], meta: { ...emptyMeta } };
}

/** All catalog and payment UI is USD ($) only. */
function formatMoney(amount: number) {
 try {
 return new Intl.NumberFormat(undefined, {
 style: "currency",
 currency: "USD",
 maximumFractionDigits: 2,
 }).format(amount);
 } catch {
 return `$${amount.toFixed(2)}`;
 }
}

const ENROLLMENT_PAYMENT_OPTIONS = [
 { value: "none", label: "Not set / unpaid" },
 { value: "paid", label: "Paid in full" },
 { value: "half", label: "Half paid (50%)" },
 { value: "deposit_15", label: "15% deposit paid" },
] as const;

function enrollmentDetailDisplay(v: unknown): string {
 if (v == null || v === "") return "—";
 if (typeof v === "boolean") return v ? "Yes" : "No";
 if (Array.isArray(v))
 return v.length > 0 ? v.map((x) => String(x)).join(", ") : "—";
 const s = String(v).trim();
 return s || "—";
}

function EnrollmentFormDataSection({
 enrollment: e,
}: {
 enrollment: Record<string, unknown>;
}) {
 const money = (n: unknown) =>
 n != null && n !== "" && Number.isFinite(Number(n))
 ? formatMoney(Number(n))
 : "—";
 const row = (label: string, value: ReactNode) => (
 <div
 key={label}
 className="grid grid-cols-[minmax(0,128px)_1fr] gap-x-3 gap-y-1 border-b border-slate-800/60 py-2 text-xs last:border-0 sm:grid-cols-[minmax(0,160px)_1fr]"
 >
 <span className="text-slate-500">{label}</span>
 <span className="break-words text-slate-200">{value}</span>
 </div>
 );
 const sid = String(e.childStudentId ?? "").trim();

 return (
 <div className="space-y-4">
 <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
 <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
 Parent
 </h4>
 {row("Name", enrollmentDetailDisplay(e.parentName))}
 {row("Email", enrollmentDetailDisplay(e.email))}
 {row("Phone", enrollmentDetailDisplay(e.phone))}
 {row("Relationship", enrollmentDetailDisplay(e.relationship))}
 </div>
 <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
 <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
 Child
 </h4>
 {row("Name", enrollmentDetailDisplay(e.childName))}
 {row("Age", enrollmentDetailDisplay(e.childAge))}
 {row("Gender", enrollmentDetailDisplay(e.childGender))}
 {row("Grade", enrollmentDetailDisplay(e.gradeLevel))}
 {sid ? row("Student ID", sid) : null}
 {row("Previous experience", enrollmentDetailDisplay(e.previousExperience))}
 </div>
 <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
 <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
 Course & schedule
 </h4>
 {row("Course", enrollmentDetailDisplay(e.courseId))}
 {row("Title", enrollmentDetailDisplay(e.courseTitle))}
 {row("Preferred days", enrollmentDetailDisplay(e.preferredDays))}
 {row("Preferred time", enrollmentDetailDisplay(e.preferredTime))}
 {row("Session format", enrollmentDetailDisplay(e.sessionFormat))}
 {row("Start preference", enrollmentDetailDisplay(e.startDate))}
 {enrollmentDetailDisplay(e.timezone) !== "—"
 ? row("Timezone", enrollmentDetailDisplay(e.timezone))
 : null}
 {enrollmentDetailDisplay(e.schoolName) !== "—"
 ? row("School", enrollmentDetailDisplay(e.schoolName))
 : null}
 </div>
 <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
 <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
 Additional
 </h4>
 {row("Learning goals", enrollmentDetailDisplay(e.learningGoals))}
 {row("Special needs", enrollmentDetailDisplay(e.specialNeeds))}
 {row("How they heard about us", enrollmentDetailDisplay(e.howDidYouHear))}
 {row("Agreed to terms", enrollmentDetailDisplay(e.agreeTerms))}
 {row("Photo consent", enrollmentDetailDisplay(e.agreePhotos))}
 </div>
 <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
 <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
 Pricing snapshot
 </h4>
 {row("List price", money(e.listPrice))}
 {row("Course discount %", enrollmentDetailDisplay(e.courseDiscountPercent))}
 {row("After course discount", money(e.priceAfterCourseDiscount))}
 {Number(e.firstTimeParentDiscountAmount ?? 0) > 0 ? (
 <>
 {row(
 "First enrollment discount",
 `${String(e.firstTimeParentDiscountPercent ?? "")}% (${money(e.firstTimeParentDiscountAmount)})`
 )}
 {row("After first-time discount", money(e.priceAfterFirstTimeDiscount))}
 </>
 ) : null}
 {row("Promo code", enrollmentDetailDisplay(e.promoCodeApplied))}
 {row("Promo discount", money(e.promoDiscountAmount))}
 {row("Amount due", money(e.amountDue))}
 {row("Submitted", enrollmentDetailDisplay(e.createdAt))}
 </div>
 </div>
 );
}

type Overview = {
 users: { total: number; byRole: Record<string, number> };
 enrollments: {
 total: number;
 byStatus: Record<string, number>;
 byCourseId: { courseId: string; count: number }[];
 };
 contacts: { total: number; new: number };
 courses: { active: number; total: number };
 team: { active: number; total: number };
 challenges: {
 records: number;
 published: number;
 emailSignups: number;
 };
 revenue?: {
 note: string;
 committed: {
 statuses: string[];
 byCurrency: Record<string, number>;
 enrollmentCount: number;
 };
 pipeline: {
 statuses: string;
 byCurrency: Record<string, number>;
 enrollmentCount: number;
 };
 byCourse: {
 courseSlug: string;
 titleEn: string;
 currency: string;
 unitPrice: number;
 enrollmentCount: number;
 subtotal: number;
 }[];
 };
 payments?: {
 note: string;
 explanation?: string;
 succeeded: {
 byCurrency: Record<
 string,
 {
 totalCharged: number;
 afterRefunds: number;
 refunds?: number;
 count: number;
 gross?: number;
 net?: number;
 }
 >;
 paymentCount: number;
 };
 byStatus: Record<string, number>;
 pendingPayments: number;
 };
};

const TABS: { id: Tab; label: string }[] = [
 { id: "overview", label: "Overview" },
 { id: "courses", label: "Courses" },
 { id: "categories", label: "Categories" },
 { id: "enrollments", label: "Enrollments" },
 { id: "users", label: "Users" },
 { id: "payments", label: "Payments" },
 { id: "promos", label: "Promos" },
 { id: "contacts", label: "Contact" },
 { id: "challenges", label: "Challenges" },
 { id: "team", label: "Team" },
 { id: "blog", label: "Blog" },
 { id: "careers", label: "Careers" },
];

export default function AdminDashboard() {
 const router = useRouter();
 const [tab, setTab] = useState<Tab>("overview");
 const [overview, setOverview] = useState<Overview | null>(null);
 const [err, setErr] = useState("");
 /** Short-lived success/info line (e.g. category deactivated vs deleted). */
 const [adminNotice, setAdminNotice] = useState("");

 const switchTab = (next: Tab) => {
 setAdminNotice("");
 setTab(next);
 };

 useEffect(() => {
 if (!adminNotice) return;
 const t = setTimeout(() => setAdminNotice(""), 10000);
 return () => clearTimeout(t);
 }, [adminNotice]);

 const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
 const [coursesMeta, setCoursesMeta] = useState<ListMeta>(emptyMeta);
 const [coursesPage, setCoursesPage] = useState(1);
 const [courseFilter, setCourseFilter] = useState({ active: "", category: "" });

 const [categoryOptions, setCategoryOptions] = useState<AdminCategoryRow[]>(
 []
 );

 const [enrollments, setEnrollments] = useState<Record<string, unknown>[]>([]);
 const [enrollmentsMeta, setEnrollmentsMeta] = useState<ListMeta>(emptyMeta);
 const [enrollmentsPage, setEnrollmentsPage] = useState(1);
 const [enrFilter, setEnrFilter] = useState({
 status: "",
 courseId: "",
 q: "",
 });

 const [contacts, setContacts] = useState<Record<string, unknown>[]>([]);
 const [contactsMeta, setContactsMeta] = useState<ListMeta>(emptyMeta);
 const [contactsPage, setContactsPage] = useState(1);
 const [conFilter, setConFilter] = useState({
 status: "",
 q: "",
 challengeOnly: false,
 });

 const [challenges, setChallenges] = useState<Record<string, unknown>[]>([]);
 const [challengesMeta, setChallengesMeta] = useState<ListMeta>(emptyMeta);
 const [challengesPage, setChallengesPage] = useState(1);
 const [chFilter, setChFilter] = useState({ q: "", published: "" });

 const [team, setTeam] = useState<Record<string, unknown>[]>([]);
 const [teamMeta, setTeamMeta] = useState<ListMeta>(emptyMeta);
 const [teamPage, setTeamPage] = useState(1);
 const [teamFilter, setTeamFilter] = useState({ active: "" });

 const [users, setUsers] = useState<Record<string, unknown>[]>([]);
 const [usersMeta, setUsersMeta] = useState<ListMeta>(emptyMeta);
 const [usersPage, setUsersPage] = useState(1);
 const [userFilter, setUserFilter] = useState({
 q: "",
 role: "",
 active: "",
 });
 const [userEdit, setUserEdit] = useState<Record<string, unknown> | null>(
 null
 );

 const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
 const [paymentsMeta, setPaymentsMeta] = useState<ListMeta>(emptyMeta);
 const [paymentsPage, setPaymentsPage] = useState(1);
 const [payFilter, setPayFilter] = useState({ status: "" });

 const [promos, setPromos] = useState<Record<string, unknown>[]>([]);
 const [promosMeta, setPromosMeta] = useState<ListMeta>(emptyMeta);
 const [promosPage, setPromosPage] = useState(1);
 const [promoFilter, setPromoFilter] = useState({ q: "", active: "" });
 const [promoModal, setPromoModal] = useState<
 null | { mode: "create" } | { mode: "edit"; id: string }
 >(null);

 // ── Blog ──
 const [blogPosts, setBlogPosts] = useState<Record<string, unknown>[]>([]);
 const [blogMeta, setBlogMeta] = useState<ListMeta>(emptyMeta);
 const [blogPage, setBlogPage] = useState(1);
 const [blogFilter, setBlogFilter] = useState({ published: "", category: "" });
 const [blogModal, setBlogModal] = useState<
 null | { mode: "create" } | { mode: "edit"; slug: string }
 >(null);

 // ── Careers ──
 const [careers, setCareers] = useState<Record<string, unknown>[]>([]);
 const [careersMeta, setCareersMeta] = useState<ListMeta>(emptyMeta);
 const [careersPage, setCareersPage] = useState(1);
 const [careerFilter, setCareerFilter] = useState({ active: "", department: "" });
 const [careerModal, setCareerModal] = useState<
 null | { mode: "create" } | { mode: "edit"; id: string }
 >(null);

 const [enrollmentDetail, setEnrollmentDetail] = useState<{
 enrollment: Record<string, unknown>;
 linkedUser: Record<string, unknown> | null;
 instructorNotes: Record<string, unknown>[];
 } | null>(null);

 const [categories, setCategories] = useState<AdminCategoryRow[]>([]);
 const [categoriesMeta, setCategoriesMeta] = useState<ListMeta>(emptyMeta);
 const [categoriesPage, setCategoriesPage] = useState(1);
 const [categoryModal, setCategoryModal] = useState<{
 mode: "create" | "edit";
 slug?: string;
 } | null>(null);
 const [courseModal, setCourseModal] = useState<{
 mode: "create" | "edit";
 slug?: string;
 } | null>(null);
 const [challengeModal, setChallengeModal] = useState<Record<
 string,
 unknown
 > | null>(null);
 const [teamModal, setTeamModal] = useState<Record<string, unknown> | null>(
 null
 );

 const guard = useCallback(() => {
 if (!getAdminToken()) router.replace("/admin/login");
 }, [router]);

 useEffect(() => {
 guard();
 }, [guard]);

 const loadOverview = useCallback(async () => {
 const data = await adminFetch<Overview>("/admin/overview");
 setOverview(data);
 }, []);

 const loadCategoryOptions = useCallback(async () => {
 try {
 const raw = await adminFetch<unknown>(
 `/categories/admin/list?page=1&limit=200`
 );
 const { items } = normalizePagedResponse<AdminCategoryRow>(
 raw,
 PAGE_SIZE
 );
 setCategoryOptions(items);
 } catch {
 setCategoryOptions([]);
 }
 }, []);

 const loadCourses = useCallback(async () => {
 const q = new URLSearchParams();
 if (courseFilter.active === "true" || courseFilter.active === "false")
 q.set("active", courseFilter.active);
 if (courseFilter.category) q.set("category", courseFilter.category);
 q.set("page", String(coursesPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/courses/admin/list?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(
 raw,
 PAGE_SIZE
 );
 setCourses(items);
 setCoursesMeta(meta);
 }, [courseFilter, coursesPage]);

 const loadCategoriesPage = useCallback(async () => {
 const q = new URLSearchParams();
 q.set("page", String(categoriesPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/categories/admin/list?${q}`);
 const { items, meta } = normalizePagedResponse<AdminCategoryRow>(
 raw,
 PAGE_SIZE
 );
 setCategories(items);
 setCategoriesMeta(meta);
 }, [categoriesPage]);

 const loadEnrollments = useCallback(async () => {
 const q = new URLSearchParams();
 if (enrFilter.status) q.set("status", enrFilter.status);
 if (enrFilter.courseId) q.set("courseId", enrFilter.courseId);
 if (enrFilter.q) q.set("q", enrFilter.q);
 q.set("page", String(enrollmentsPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/enrollments?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(
 raw,
 PAGE_SIZE
 );
 setEnrollments(items);
 setEnrollmentsMeta(meta);
 }, [enrFilter, enrollmentsPage]);

 const loadContacts = useCallback(async () => {
 const q = new URLSearchParams();
 if (conFilter.status) q.set("status", conFilter.status);
 if (conFilter.q) q.set("q", conFilter.q);
 if (conFilter.challengeOnly) q.set("challengeOnly", "true");
 q.set("page", String(contactsPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/contact?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(
 raw,
 PAGE_SIZE
 );
 setContacts(items);
 setContactsMeta(meta);
 }, [conFilter, contactsPage]);

 const loadChallenges = useCallback(async () => {
 const q = new URLSearchParams();
 if (chFilter.q) q.set("q", chFilter.q);
 if (chFilter.published === "true" || chFilter.published === "false")
 q.set("published", chFilter.published);
 q.set("page", String(challengesPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/challenges?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(
 raw,
 PAGE_SIZE
 );
 setChallenges(items);
 setChallengesMeta(meta);
 }, [chFilter, challengesPage]);

 const loadTeam = useCallback(async () => {
 const q = new URLSearchParams();
 if (teamFilter.active === "true" || teamFilter.active === "false")
 q.set("active", teamFilter.active);
 q.set("page", String(teamPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/team/admin/list?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(
 raw,
 PAGE_SIZE
 );
 setTeam(items);
 setTeamMeta(meta);
 }, [teamFilter, teamPage]);

 const loadUsers = useCallback(async () => {
 const q = new URLSearchParams();
 if (userFilter.q) q.set("q", userFilter.q);
 if (userFilter.role) q.set("role", userFilter.role);
 if (userFilter.active === "true" || userFilter.active === "false")
 q.set("active", userFilter.active);
 q.set("page", String(usersPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/admin/users?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(
 raw,
 PAGE_SIZE
 );
 setUsers(items);
 setUsersMeta(meta);
 }, [userFilter, usersPage]);

 const loadPayments = useCallback(async () => {
 const q = new URLSearchParams();
 if (payFilter.status) q.set("status", payFilter.status);
 q.set("page", String(paymentsPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/admin/payments?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(
 raw,
 PAGE_SIZE
 );
 setPayments(items);
 setPaymentsMeta(meta);
 }, [payFilter, paymentsPage]);

 const loadPromos = useCallback(async () => {
 const q = new URLSearchParams();
 if (promoFilter.active === "true" || promoFilter.active === "false")
 q.set("active", promoFilter.active);
 if (promoFilter.q.trim()) q.set("q", promoFilter.q.trim());
 q.set("page", String(promosPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/admin/promos?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(
 raw,
 PAGE_SIZE
 );
 setPromos(items);
 setPromosMeta(meta);
 }, [promoFilter, promosPage]);

 const loadBlog = useCallback(async () => {
 const q = new URLSearchParams();
 if (blogFilter.published) q.set("published", blogFilter.published);
 if (blogFilter.category) q.set("category", blogFilter.category);
 q.set("page", String(blogPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/blog/admin/list?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(raw, PAGE_SIZE);
 setBlogPosts(items);
 setBlogMeta(meta);
 }, [blogFilter, blogPage]);

 const loadCareers = useCallback(async () => {
 const q = new URLSearchParams();
 if (careerFilter.active) q.set("active", careerFilter.active);
 if (careerFilter.department) q.set("department", careerFilter.department);
 q.set("page", String(careersPage));
 q.set("limit", String(PAGE_SIZE));
 const raw = await adminFetch<unknown>(`/careers/admin/list?${q}`);
 const { items, meta } = normalizePagedResponse<Record<string, unknown>>(raw, PAGE_SIZE);
 setCareers(items);
 setCareersMeta(meta);
 }, [careerFilter, careersPage]);

 useEffect(() => {
 if (!getAdminToken()) return;
 let cancelled = false;
 (async () => {
 try {
 if (tab === "overview") await loadOverview();
 if (tab === "courses") {
 await loadCategoryOptions();
 await loadCourses();
 await loadOverview();
 }
 if (tab === "categories") await loadCategoriesPage();
 if (tab === "enrollments") await loadEnrollments();
 if (tab === "users") await loadUsers();
 if (tab === "payments") await loadPayments();
 if (tab === "promos") await loadPromos();
 if (tab === "contacts") await loadContacts();
 if (tab === "challenges") await loadChallenges();
 if (tab === "team") await loadTeam();
 if (tab === "blog") await loadBlog();
 if (tab === "careers") await loadCareers();
 if (!cancelled) setErr("");
 } catch (e) {
 if (!cancelled) {
 setErr(e instanceof Error ? e.message : "Failed to load");
 }
 }
 })();
 return () => {
 cancelled = true;
 };
 }, [
 tab,
 loadOverview,
 loadCourses,
 loadCategoryOptions,
 loadCategoriesPage,
 loadEnrollments,
 loadContacts,
 loadChallenges,
 loadTeam,
 loadUsers,
 loadPayments,
 loadPromos,
 loadBlog,
 loadCareers,
 ]);

 /** Purge ISR cache for public pages so admin changes appear immediately. */
 const revalidatePublicPages = async (paths?: string[]) => {
 try {
 await fetch("/api/revalidate", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ paths: paths ?? ["/en", "/ar", "/en/courses", "/ar/courses"] }),
 });
 } catch { /* best-effort */ }
 };

 const logout = () => {
 clearAdminToken();
 router.replace("/admin/login");
 };

 const patchEnrollmentStatus = async (id: string, status: string) => {
 try {
 await adminFetch(`/enrollments/${id}/status`, {
 method: "PATCH",
 body: JSON.stringify({ status }),
 });
 await loadEnrollments();
 setEnrollmentDetail((prev) =>
 prev && String(prev.enrollment._id) === id
 ? { ...prev, enrollment: { ...prev.enrollment, status } }
 : prev
 );
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Update failed");
 }
 };

 const patchEnrollmentPaymentStatus = async (id: string, paymentStatus: string) => {
 try {
 await adminFetch(`/enrollments/${id}/payment-status`, {
 method: "PATCH",
 body: JSON.stringify({ paymentStatus }),
 });
 await loadEnrollments();
 setEnrollmentDetail((prev) =>
 prev && String(prev.enrollment._id) === id
 ? { ...prev, enrollment: { ...prev.enrollment, paymentStatus } }
 : prev
 );
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Update failed");
 }
 };

 const patchContactStatus = async (id: string, status: string) => {
 try {
 await adminFetch(`/contact/${id}`, {
 method: "PATCH",
 body: JSON.stringify({ status }),
 });
 await loadContacts();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Update failed");
 }
 };

 const deleteContact = async (id: string) => {
 if (!confirm("Delete this contact message permanently?")) return;
 try {
 await adminFetch(`/contact/${id}`, { method: "DELETE" });
 await loadContacts();
 await loadOverview();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Failed");
 }
 };

 const deactivateCourse = async (slug: string) => {
 if (!confirm(`Deactivate course "${slug}"?`)) return;
 try {
 setErr("");
 await adminFetch(`/courses/${encodeURIComponent(slug)}`, {
 method: "DELETE",
 });
 setAdminNotice("Course deactivated (hidden from catalog).");
 await loadCourses();
 await loadOverview();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Failed");
 }
 };

 const reactivateCourse = async (slug: string) => {
 if (!confirm(`Reactivate course "${slug}"? It will be visible in the catalog again.`)) return;
 try {
 setErr("");
 await adminFetch(`/courses/${encodeURIComponent(slug)}/reactivate`, {
 method: "PATCH",
 });
 setAdminNotice("Course reactivated (visible in catalog).");
 await loadCourses();
 await loadOverview();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Failed");
 }
 };

 /** Hard-delete from DB. API returns 400 if any enrollment references the slug. */
 const deleteCoursePermanent = async (slug: string) => {
 if (
 !confirm(
 `Permanently delete course "${slug}"?\n\nThis removes the catalog row. It only works when no enrollments reference this course. This cannot be undone.`
 )
 ) {
 return;
 }
 try {
 setErr("");
 const data = await adminFetch<{ message?: string }>(
 `/courses/${encodeURIComponent(slug)}/permanent`,
 { method: "DELETE" }
 );
 setAdminNotice(
 typeof data?.message === "string" && data.message
 ? data.message
 : "Course deleted permanently."
 );
 await loadCourses();
 await loadOverview();
 await loadCategoryOptions();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Delete failed");
 }
 };

 const toggleCategoryActive = async (slug: string, currentlyActive: boolean) => {
 const next = !currentlyActive;
 if (!next) {
 if (
 !confirm(
 `Deactivate "${slug}"?\n\nIt will be hidden from the public site and cannot be chosen for new courses (existing courses keep this slug).`
 )
 ) {
 return;
 }
 }
 try {
 setErr("");
 await adminFetch(`/categories/${encodeURIComponent(slug)}`, {
 method: "PUT",
 body: JSON.stringify({ isActive: next }),
 });
 setAdminNotice(
 next
 ? "Category activated (visible on the site)."
 : "Category deactivated (hidden from the public catalog)."
 );
 await loadCategoriesPage();
 await loadCategoryOptions();
 await loadOverview();
 void revalidatePublicPages();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Failed");
 }
 };

 const removeCategory = async (slug: string) => {
 if (
 !confirm(
 `Permanently delete category "${slug}"?\n\nCourses that still use this slug will keep it until you edit them — assign an active category before saving.`
 )
 ) {
 return;
 }
 try {
 setErr("");
 const data = await adminFetch<{ message?: string }>(
 `/categories/${encodeURIComponent(slug)}`,
 { method: "DELETE" }
 );
 setAdminNotice(
 typeof data?.message === "string" && data.message
 ? data.message
 : "Category deleted."
 );
 await loadCategoriesPage();
 await loadCategoryOptions();
 await loadOverview();
 void revalidatePublicPages();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Failed");
 }
 };

 const deleteChallenge = async (id: string) => {
 if (!confirm("Delete this challenge permanently?")) return;
 try {
 await adminFetch(`/challenges/${id}`, { method: "DELETE" });
 await loadChallenges();
 await loadOverview();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Failed");
 }
 };

 const deactivateTeam = async (id: string) => {
 if (!confirm("Deactivate team member?")) return;
 try {
 await adminFetch(`/team/${id}`, { method: "DELETE" });
 await loadTeam();
 await loadOverview();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Failed");
 }
 };

 const saveUserEdit = async () => {
 if (!userEdit?._id) return;
 try {
 await adminFetch(`/admin/users/${String(userEdit._id)}`, {
 method: "PATCH",
 body: JSON.stringify({
 role: userEdit.role,
 isActive: userEdit.isActive,
 name: String(userEdit.name ?? "").trim(),
 phone: String(userEdit.phone ?? "").trim(),
 }),
 });
 setUserEdit(null);
 await loadUsers();
 await loadOverview();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Update failed");
 }
 };

 const resetUserPassword = async (id: string) => {
 const pw = window.prompt("New password (min 8 characters):");
 if (!pw || pw.length < 8) {
 setErr("Password must be at least 8 characters");
 return;
 }
 try {
 await adminFetch(`/admin/users/${id}/reset-password`, {
 method: "POST",
 body: JSON.stringify({ newPassword: pw }),
 });
 alert("Password updated.");
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Reset failed");
 }
 };

 const openEnrollmentDetail = async (id: string) => {
 try {
 const data = await adminFetch<{
 enrollment: Record<string, unknown>;
 linkedUser: Record<string, unknown> | null;
 instructorNotes: Record<string, unknown>[];
 }>(`/admin/enrollments/${id}/detail`);
 setEnrollmentDetail(data);
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Failed to load detail");
 }
 };

 const recordManualPaymentRequest = async (
 enrollmentId: string,
 paymentMethod: "bank_transfer" | "paypal"
 ) => {
 try {
 setErr("");
 const data = await adminFetch<{
 instructions?: string;
 amountUsd?: number;
 }>("/admin/payments/manual", {
 method: "POST",
 body: JSON.stringify({ enrollmentId, paymentMethod }),
 });
 const label =
 paymentMethod === "bank_transfer" ? "Bank transfer" : "PayPal";
 const amt =
 data.amountUsd != null
 ? `\nAmount: ${formatMoney(Number(data.amountUsd))} USD`
 : "";
 alert(
 `${label} payment recorded (pending).${amt}\n\n${data.instructions ?? ""}`
 );
 await loadPayments();
 await loadOverview();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Payment request failed");
 }
 };

 const patchAdminPaymentRecordStatus = async (
 paymentId: string,
 status: string
 ) => {
 try {
 setErr("");
 await adminFetch(`/admin/payments/${paymentId}`, {
 method: "PATCH",
 body: JSON.stringify({ status }),
 });
 await loadPayments();
 await loadOverview();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Payment update failed");
 }
 };

 const patchPromo = async (id: string, patch: Record<string, unknown>) => {
 try {
 await adminFetch(`/admin/promos/${id}`, {
 method: "PATCH",
 body: JSON.stringify(patch),
 });
 await loadPromos();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Promo update failed");
 }
 };

 const deletePromo = async (id: string, code: string) => {
 if (!confirm(`Delete promo "${code}"?`)) return;
 try {
 await adminFetch(`/admin/promos/${id}`, { method: "DELETE" });
 await loadPromos();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Delete failed");
 }
 };

 // ── Blog helpers ──
 const deleteBlog = async (slug: string, title: string) => {
 if (!confirm(`Delete blog post "${title}"?`)) return;
 try {
 await adminFetch(`/blog/${slug}`, { method: "DELETE" });
 await loadBlog();
 setAdminNotice("Blog post deleted");
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Delete failed");
 }
 };

 const toggleBlogPublish = async (slug: string, isPublished: boolean) => {
 try {
 await adminFetch(`/blog/${slug}`, {
 method: "PUT",
 body: JSON.stringify({ isPublished: !isPublished }),
 });
 await loadBlog();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Update failed");
 }
 };

 // ── Career helpers ──
 const deleteCareer = async (id: string, title: string) => {
 if (!confirm(`Delete career "${title}"?`)) return;
 try {
 await adminFetch(`/careers/${id}`, { method: "DELETE" });
 await loadCareers();
 setAdminNotice("Career deleted");
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Delete failed");
 }
 };

 const toggleCareerActive = async (id: string, isActive: boolean) => {
 try {
 await adminFetch(`/careers/${id}`, {
 method: "PATCH",
 body: JSON.stringify({ isActive: !isActive }),
 });
 await loadCareers();
 } catch (e) {
 setErr(e instanceof Error ? e.message : "Update failed");
 }
 };

 return (
 <div className="flex min-h-screen w-full bg-slate-950 text-slate-100">
 <aside className="hidden w-52 shrink-0 border-r border-slate-800 bg-slate-900/50 p-4 md:block">
 <div className="mb-8 font-semibold text-white">Admin</div>
 <nav className="space-y-1">
 {TABS.map((t) => (
 <button
 key={t.id}
 type="button"
 onClick={() => switchTab(t.id)}
 className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
 tab === t.id
 ? "bg-primary/20 text-white"
 : "text-slate-400 hover:bg-slate-800"
 }`}
 >
 {t.label}
 </button>
 ))}
 </nav>
 <button
 type="button"
 onClick={logout}
 className="mt-8 w-full rounded-lg border border-slate-700 py-2 text-sm text-slate-300 hover:bg-slate-800"
 >
 Log out
 </button>
 </aside>

 <div className="flex min-w-0 flex-1 flex-col">
 <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3 md:hidden">
 <select
 value={tab}
 onChange={(e) => switchTab(e.target.value as Tab)}
 className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm"
 >
 {TABS.map((t) => (
 <option key={t.id} value={t.id}>
 {t.label}
 </option>
 ))}
 </select>
 <button
 type="button"
 onClick={logout}
 className="text-sm text-slate-400"
 >
 Log out
 </button>
 </header>

 <main className="flex-1 overflow-auto p-4 md:p-8">
 {err ? (
 <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm text-red-300">
 {err}
 </div>
 ) : null}
 {adminNotice ? (
 <div
 role="status"
 className="mb-4 rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-200"
 >
 {adminNotice}
 </div>
 ) : null}

 {tab === "overview" && overview && (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 <StatCard title="Users" value={overview.users.total} />
 <StatCard
 title="Enrollments"
 value={overview.enrollments.total}
 />
 <StatCard title="Contacts" value={overview.contacts.total} />
 <StatCard
 title="New messages"
 value={overview.contacts.new}
 hint="status: new"
 />
 <StatCard
 title="Courses (active / total)"
 value={`${overview.courses.active} / ${overview.courses.total}`}
 />
 <StatCard
 title="Team (active / total)"
 value={`${overview.team.active} / ${overview.team.total}`}
 />
 <StatCard
 title="Challenge records"
 value={overview.challenges.records}
 />
 <StatCard
 title="Challenge email signups"
 value={overview.challenges.emailSignups}
 hint="Contact subject filter"
 />
 {overview.revenue ? (
 <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:col-span-2 lg:col-span-3">
 <h3 className="text-sm font-medium text-slate-200">
 Catalog revenue{" "}
 <span className="font-normal text-slate-500">
 (estimate · list price)
 </span>
 </h3>
 <p className="mt-1 text-xs text-slate-500">
 {overview.revenue.note}
 </p>
 <div className="mt-4 grid gap-3 sm:grid-cols-2">
 <div className="rounded-lg border border-slate-800/90 bg-slate-950/50 px-4 py-3">
 <div className="text-xs text-slate-500">Pipeline</div>
 <p className="mt-1 text-sm text-slate-200">
 <span className="font-semibold tabular-nums">
 {overview.revenue.pipeline.enrollmentCount}
 </span>{" "}
 <span className="text-slate-500">
 enrollment
 {overview.revenue.pipeline.enrollmentCount !== 1
 ? "s"
 : ""}
 </span>
 </p>
 <p className="mt-2 text-sm text-slate-300">
 {Object.keys(overview.revenue.pipeline.byCurrency)
 .length === 0
 ? "—"
 : Object.entries(overview.revenue.pipeline.byCurrency)
 .sort(([a], [b]) => a.localeCompare(b))
 .map(([cur, amt]) => (
 <span key={cur} className="mr-3 inline-block">
 <span className="font-mono text-xs text-slate-500">
 {cur}
 </span>{" "}
 {formatMoney(amt)}
 </span>
 ))}
 </p>
 </div>
 <div className="rounded-lg border border-slate-800/90 bg-slate-950/50 px-4 py-3">
 <div className="text-xs text-slate-500">Committed</div>
 <p className="mt-1 text-sm text-slate-200">
 <span className="font-semibold tabular-nums">
 {overview.revenue.committed.enrollmentCount}
 </span>{" "}
 <span className="text-slate-500">
 enrollment
 {overview.revenue.committed.enrollmentCount !== 1
 ? "s"
 : ""}
 </span>
 </p>
 <p className="mt-2 text-sm text-slate-300">
 {Object.keys(overview.revenue.committed.byCurrency)
 .length === 0
 ? "—"
 : Object.entries(overview.revenue.committed.byCurrency)
 .sort(([a], [b]) => a.localeCompare(b))
 .map(([cur, amt]) => (
 <span key={cur} className="mr-3 inline-block">
 <span className="font-mono text-xs text-slate-500">
 {cur}
 </span>{" "}
 {formatMoney(amt)}
 </span>
 ))}
 </p>
 </div>
 </div>
 <p className="mt-3 text-[11px] text-slate-600">
 Pipeline = non-cancelled. Committed = confirmed, active, or
 completed.
 </p>
 {overview.revenue.byCourse.length > 0 ? (
 <div className="mt-4 overflow-x-auto">
 <table className="w-full min-w-[360px] text-left text-xs">
 <caption className="mb-2 text-left text-xs font-medium text-slate-400">
 By course (committed)
 </caption>
 <thead>
 <tr className="text-slate-500">
 <th className="py-1.5 pr-3">Course</th>
 <th className="py-1.5 pr-3">Qty</th>
 <th className="py-1.5">Subtotal</th>
 </tr>
 </thead>
 <tbody>
 {overview.revenue.byCourse.map((r) => (
 <tr
 key={r.courseSlug}
 className="border-t border-slate-800/80 text-slate-300"
 >
 <td className="py-1.5 pr-3 font-mono text-[11px]">
 {r.courseSlug}
 </td>
 <td className="py-1.5 pr-3 tabular-nums">
 {r.enrollmentCount}
 </td>
 <td className="py-1.5">
 {formatMoney(r.subtotal)}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 ) : null}
 </div>
 ) : null}
 {overview.payments ? (
 <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:col-span-2 lg:col-span-3">
 <h3 className="mb-1 text-sm font-medium text-slate-200">
 Payments{" "}
 <span className="font-normal text-slate-500">
 (bank / PayPal)
 </span>
 </h3>
 <p className="text-xs text-slate-500">
 {overview.payments.note}
 </p>
 {overview.payments.explanation ? (
 <p className="mt-2 text-xs leading-relaxed text-slate-400">
 {overview.payments.explanation}
 </p>
 ) : null}
 <div className="mt-4 grid gap-4 lg:grid-cols-2">
 <div>
 <h4 className="mb-2 text-xs font-medium text-slate-400">
 Succeeded charges
 </h4>
 <p className="mb-2 text-xs text-slate-500">
 {overview.payments.succeeded.paymentCount} payment
 {overview.payments.succeeded.paymentCount !== 1
 ? "s"
 : ""}{" "}
 · Pending requests:{" "}
 {overview.payments.pendingPayments}
 </p>
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="text-slate-500">
 <th className="py-1 pr-4">Currency</th>
 <th className="py-1 pr-2" title="What customers paid">
 Total charged
 </th>
 <th className="py-1 pr-2" title="Charged minus refunds">
 After refunds
 </th>
 <th className="py-1">#</th>
 </tr>
 </thead>
 <tbody>
 {Object.keys(
 overview.payments.succeeded.byCurrency
 ).length === 0 ? (
 <tr>
 <td
 colSpan={4}
 className="py-2 text-slate-500"
 >
 No succeeded payments recorded yet.
 </td>
 </tr>
 ) : (
 Object.entries(
 overview.payments.succeeded.byCurrency
 )
 .sort(([a], [b]) => a.localeCompare(b))
 .map(([cur, v]) => {
 const charged =
 v.totalCharged ??
 v.gross ??
 0;
 const kept =
 v.afterRefunds ??
 v.net ??
 0;
 return (
 <tr key={cur} className="text-slate-300">
 <td className="py-1 pr-4 font-mono">
 {cur}
 </td>
 <td className="py-1 pr-2">
 {formatMoney(charged)}
 </td>
 <td className="py-1 pr-2">
 {formatMoney(kept)}
 </td>
 <td className="py-1">{v.count}</td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 <p className="mt-2 text-[11px] text-slate-600">
 Mark payments succeeded in the Payments tab when you
 confirm the transfer or PayPal receipt.
 </p>
 </div>
 <div>
 <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
 By status
 </h4>
 <table className="w-full max-w-md text-left text-xs">
 <tbody>
 {Object.entries(overview.payments.byStatus)
 .sort(([a], [b]) => a.localeCompare(b))
 .map(([st, n]) => (
 <tr key={st} className="text-slate-300">
 <td className="py-1 pr-4 capitalize">
 {st.replace(/_/g, " ")}
 </td>
 <td className="py-1">{n}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 ) : null}
 <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:col-span-2 lg:col-span-3">
 <h3 className="mb-2 text-sm font-medium text-slate-300">
 Users by role
 </h3>
 <table className="w-full max-w-md text-left text-xs">
 <thead>
 <tr className="text-slate-500">
 <th className="py-1 pr-4">Role</th>
 <th className="py-1">Count</th>
 </tr>
 </thead>
 <tbody>
 {Object.entries(overview.users.byRole)
 .sort(([a], [b]) => a.localeCompare(b))
 .map(([role, count]) => (
 <tr key={role} className="text-slate-300">
 <td className="py-1 pr-4 capitalize">
 {role.replace(/_/g, " ")}
 </td>
 <td className="py-1">{count}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:col-span-2 lg:col-span-3">
 <h3 className="mb-2 text-sm font-medium text-slate-300">
 Enrollments by status
 </h3>
 <table className="w-full max-w-md text-left text-xs">
 <thead>
 <tr className="text-slate-500">
 <th className="py-1 pr-4">Status</th>
 <th className="py-1">Count</th>
 </tr>
 </thead>
 <tbody>
 {Object.entries(overview.enrollments.byStatus)
 .sort(([a], [b]) => a.localeCompare(b))
 .map(([status, count]) => (
 <tr key={status} className="text-slate-300">
 <td className="py-1 pr-4 capitalize">
 {status.replace(/_/g, " ")}
 </td>
 <td className="py-1">{count}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:col-span-2 lg:col-span-3">
 <h3 className="mb-2 text-sm font-medium text-slate-300">
 Enrollments by courseId
 </h3>
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="text-slate-500">
 <th className="py-1">Course</th>
 <th className="py-1">Count</th>
 </tr>
 </thead>
 <tbody>
 {overview.enrollments.byCourseId.map((r) => (
 <tr key={String(r.courseId)} className="text-slate-300">
 <td className="py-1">{String(r.courseId)}</td>
 <td className="py-1">{r.count}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {tab === "courses" && (
 <div className="space-y-4">
 <div className="flex flex-wrap items-end gap-3">
 <FilterSelect
 label="Active"
 value={courseFilter.active}
 onChange={(v) => {
 setCoursesPage(1);
 setCourseFilter((f) => ({ ...f, active: v }));
 }}
 options={[
 { value: "", label: "All" },
 { value: "true", label: "Active" },
 { value: "false", label: "Inactive" },
 ]}
 />
 <FilterSelect
 label="Category"
 value={courseFilter.category}
 onChange={(v) => {
 setCoursesPage(1);
 setCourseFilter((f) => ({ ...f, category: v }));
 }}
 options={[
 { value: "", label: "All" },
 ...categoryOptions.map((c) => ({
 value: c.slug,
 label: `${c.slug} — ${c.title.en}`,
 })),
 ]}
 />
 <button
 type="button"
 onClick={() => setCourseModal({ mode: "create" })}
 className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
 >
 Add course
 </button>
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full min-w-[960px] text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Slug</th>
 <th className="p-2">Title (en)</th>
 <th className="p-2">Category</th>
 <th className="p-2">Instructors</th>
 <th className="p-2">List price</th>
 <th className="p-2">Cat. discount</th>
 <th className="p-2">Committed revenue (overview)</th>
 <th className="p-2">Active</th>
 <th className="p-2">Enrolled*</th>
 <th className="p-2" />
 </tr>
 </thead>
 <tbody>
 {courses.map((c) => (
 <tr
 key={String(
 (c as { _id?: string })._id ?? c.slug
 )}
 className="border-t border-slate-800/80"
 >
 <td className="p-2 font-mono text-xs">{String(c.slug)}</td>
 <td className="p-2">
 {String((c.title as { en?: string })?.en ?? "")}
 </td>
 <td className="p-2">{String(c.category)}</td>
 <td className="p-2 text-xs text-slate-300">
 {(() => {
 const names = (c as { instructorNames?: string[] }).instructorNames;
 return Array.isArray(names) && names.length > 0
 ? names.join(", ")
 : "—";
 })()}
 </td>
 <td className="p-2 text-slate-200">
 {formatMoney(Number(c.price ?? 0))}
 </td>
 <td className="p-2 text-slate-300">
 {Number(c.discountPercent ?? 0) > 0
 ? `${Number(c.discountPercent)}%`
 : "—"}
 </td>
 <td className="p-2 text-slate-200">
 {(() => {
 const row = overview?.revenue?.byCourse?.find(
 (r) => r.courseSlug === String(c.slug)
 );
 return row
 ? formatMoney(row.subtotal)
 : "—";
 })()}
 </td>
 <td className="p-2">{String(c.isActive)}</td>
 <td className="p-2">{String(c.enrollmentCount ?? 0)}</td>
 <td className="p-2 space-x-2">
 <button
 type="button"
 className="text-primary text-xs"
 onClick={() =>
 setCourseModal({
 mode: "edit",
 slug: String(c.slug),
 })
 }
 >
 Edit
 </button>
 {c.isActive ? (
 <button
 type="button"
 className="text-red-400 text-xs"
 onClick={() =>
 deactivateCourse(String(c.slug))
 }
 >
 Deactivate
 </button>
 ) : (
 <button
 type="button"
 className="text-emerald-400 text-xs"
 onClick={() =>
 reactivateCourse(String(c.slug))
 }
 >
 Activate
 </button>
 )}{" "}
 <button
 type="button"
 className="text-rose-300/90 text-xs hover:text-rose-200"
 onClick={() =>
 deleteCoursePermanent(String(c.slug))
 }
 >
 Delete
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <PaginationBar
 meta={coursesMeta}
 noun="courses"
 onPageChange={setCoursesPage}
 />
 <p className="text-xs text-slate-500">
 * enrollmentCount is incremented on every enrollment submission
 (all statuses). <strong>Committed revenue</strong> uses
 confirmed, active, and completed enrollments; amounts prefer each
 enrollment&apos;s <code className="text-slate-400">amountDue</code>{" "}
 when set, otherwise the catalog price after <strong>Cat. discount</strong>.
 Stripe Checkout uses the enrollment&apos;s amount due.{" "}
 <strong>Deactivate</strong> hides the course;{" "}
 <strong>Delete</strong> removes it from the database only when
 there are no enrollments for that slug.
 </p>
 </div>
 )}

 {tab === "categories" && (
 <div className="space-y-4">
 <div className="flex flex-wrap items-end gap-3">
 <button
 type="button"
 onClick={() => setCategoryModal({ mode: "create" })}
 className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
 >
 New category
 </button>
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full min-w-[560px] text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Slug</th>
 <th className="p-2">Title (en)</th>
 <th className="p-2">Title (ar)</th>
 <th className="p-2">Description (en)</th>
 <th className="p-2">Sort</th>
 <th className="p-2">Status</th>
 <th className="p-2">Actions</th>
 </tr>
 </thead>
 <tbody>
 {categories.map((c) => (
 <tr
 key={String(c._id ?? c.slug)}
 className={`border-t border-slate-800/80 ${
 c.isActive === false
 ? "bg-slate-900/40 opacity-80"
 : ""
 }`}
 >
 <td className="p-2 font-mono text-xs">{c.slug}</td>
 <td className="p-2">{c.title.en}</td>
 <td className="p-2">{c.title.ar}</td>
 <td className="p-2 max-w-[200px] truncate text-xs text-slate-400">{c.description?.en || <span className="text-amber-400">— empty</span>}</td>
 <td className="p-2">{c.sortOrder}</td>
 <td className="p-2">
 {(() => {
 const isOn = c.isActive !== false;
 return (
 <div className="flex items-center gap-2">
 <button
 type="button"
 role="switch"
 aria-checked={isOn}
 aria-label={
 isOn
 ? "Deactivate category"
 : "Activate category"
 }
 onClick={() =>
 void toggleCategoryActive(c.slug, isOn)
 }
 className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
 isOn
 ? "border-emerald-600/70 bg-emerald-600/35"
 : "border-slate-600 bg-slate-800"
 }`}
 >
 <span
 className={`absolute top-0.5 left-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out ${
 isOn ? "translate-x-5" : "translate-x-0"
 }`}
 />
 </button>
 <span
 className={`text-[11px] font-medium tabular-nums ${
 isOn ? "text-emerald-400" : "text-amber-400"
 }`}
 >
 {isOn ? "Active" : "Inactive"}
 </span>
 </div>
 );
 })()}
 </td>
 <td className="p-2 space-x-3 whitespace-nowrap">
 <button
 type="button"
 className="text-primary text-xs font-medium hover:underline"
 onClick={() =>
 setCategoryModal({
 mode: "edit",
 slug: c.slug,
 })
 }
 >
 Edit
 </button>
 <button
 type="button"
 className="rounded-md border border-red-500/50 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-300 hover:bg-red-500/20"
 onClick={() => removeCategory(c.slug)}
 >
 Delete
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <PaginationBar
 meta={categoriesMeta}
 noun="categories"
 onPageChange={setCategoriesPage}
 />
 <p className="text-xs text-slate-500">
 Use the <strong>toggle</strong> to show or hide a category on
 the public site (deactivating blocks it for new courses).
 <strong> Delete</strong> removes the row permanently; if
 courses still use that slug, update them before saving edits.
 </p>
 </div>
 )}

 {tab === "enrollments" && (
 <div className="space-y-4">
 <div className="flex flex-wrap gap-3">
 <input
 placeholder="status"
 value={enrFilter.status}
 onChange={(e) => {
 setEnrollmentsPage(1);
 setEnrFilter((f) => ({ ...f, status: e.target.value }));
 }}
 className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
 />
 <input
 placeholder="courseId"
 value={enrFilter.courseId}
 onChange={(e) => {
 setEnrollmentsPage(1);
 setEnrFilter((f) => ({ ...f, courseId: e.target.value }));
 }}
 className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
 />
 <input
 placeholder="search email / name"
 value={enrFilter.q}
 onChange={(e) => {
 setEnrollmentsPage(1);
 setEnrFilter((f) => ({ ...f, q: e.target.value }));
 }}
 className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
 />
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full min-w-[800px] text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Date</th>
 <th className="p-2">Parent</th>
 <th className="p-2">Child</th>
 <th className="p-2">Course</th>
 <th className="p-2">Status</th>
 <th className="p-2">Payment</th>
 <th className="p-2">Actions</th>
 </tr>
 </thead>
 <tbody>
 {enrollments.map((r) => (
 <tr
 key={String(r._id)}
 className="border-t border-slate-800/80"
 >
 <td className="p-2 text-xs text-slate-400">
 {String(r.createdAt ?? "").slice(0, 10)}
 </td>
 <td className="p-2">{String(r.parentName)}</td>
 <td className="p-2">{String(r.childName)}</td>
 <td className="p-2 font-mono text-xs">
 {String(r.courseId)}
 </td>
 <td className="p-2">
 <select
 value={String(r.status)}
 onChange={(e) =>
 patchEnrollmentStatus(
 String(r._id),
 e.target.value
 )
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
 >
 {[
 "pending",
 "confirmed",
 "active",
 "completed",
 "cancelled",
 ].map((s) => (
 <option key={s} value={s}>
 {s}
 </option>
 ))}
 </select>
 </td>
 <td className="p-2">
 <select
 value={String(r.paymentStatus ?? "none")}
 onChange={(e) =>
 patchEnrollmentPaymentStatus(
 String(r._id),
 e.target.value
 )
 }
 className="max-w-[9rem] rounded border border-slate-700 bg-slate-950 px-1.5 py-1 text-xs"
 >
 {ENROLLMENT_PAYMENT_OPTIONS.map((o) => (
 <option key={o.value} value={o.value}>
 {o.label}
 </option>
 ))}
 </select>
 </td>
 <td className="p-2 space-x-2 whitespace-nowrap">
 <button
 type="button"
 className="text-primary text-xs"
 onClick={() =>
 openEnrollmentDetail(String(r._id))
 }
 >
 Detail
 </button>
 <button
 type="button"
 className="text-amber-300/90 text-xs"
 onClick={() =>
 recordManualPaymentRequest(
 String(r._id),
 "bank_transfer"
 )
 }
 >
 Bank
 </button>
 <button
 type="button"
 className="text-sky-300/90 text-xs"
 onClick={() =>
 recordManualPaymentRequest(
 String(r._id),
 "paypal"
 )
 }
 >
 PayPal
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <PaginationBar
 meta={enrollmentsMeta}
 noun="enrollments"
 onPageChange={setEnrollmentsPage}
 />
 </div>
 )}

 {tab === "users" && (
 <div className="space-y-4">
 <div className="flex flex-wrap gap-3">
 <input
 placeholder="Search name / email"
 value={userFilter.q}
 onChange={(e) => {
 setUsersPage(1);
 setUserFilter((f) => ({ ...f, q: e.target.value }));
 }}
 className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
 />
 <FilterSelect
 label="Role"
 value={userFilter.role}
 onChange={(v) => {
 setUsersPage(1);
 setUserFilter((f) => ({ ...f, role: v }));
 }}
 options={[
 { value: "", label: "All roles" },
 { value: "parent", label: "Parent" },
 { value: "admin", label: "Admin" },
 ]}
 />
 <FilterSelect
 label="Active"
 value={userFilter.active}
 onChange={(v) => {
 setUsersPage(1);
 setUserFilter((f) => ({ ...f, active: v }));
 }}
 options={[
 { value: "", label: "All" },
 { value: "true", label: "Active" },
 { value: "false", label: "Inactive" },
 ]}
 />
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full min-w-[880px] text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Email</th>
 <th className="p-2">Name</th>
 <th className="p-2">Role</th>
 <th className="p-2">Active</th>
 <th className="p-2" />
 </tr>
 </thead>
 <tbody>
 {users.filter((r) => r.role !== "instructor").map((r) => (
 <tr
 key={String(r._id)}
 className="border-t border-slate-800/80"
 >
 <td className="p-2 text-xs">{String(r.email)}</td>
 <td className="p-2">{String(r.name)}</td>
 <td className="p-2 capitalize">{String(r.role)}</td>
 <td className="p-2">{String(r.isActive)}</td>
 <td className="p-2 space-x-2">
 <button
 type="button"
 className="text-primary text-xs"
 onClick={() => setUserEdit({ ...r })}
 >
 Edit
 </button>
 <button
 type="button"
 className="text-slate-300 text-xs"
 onClick={() =>
 resetUserPassword(String(r._id))
 }
 >
 Reset password
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <PaginationBar
 meta={usersMeta}
 noun="users"
 onPageChange={setUsersPage}
 />
 </div>
 )}

 {tab === "payments" && (
 <div className="space-y-4">
 <div className="flex flex-wrap gap-3">
 <FilterSelect
 label="Status"
 value={payFilter.status}
 onChange={(v) => {
 setPaymentsPage(1);
 setPayFilter((f) => ({ ...f, status: v }));
 }}
 options={[
 { value: "", label: "All" },
 { value: "pending", label: "Pending" },
 { value: "succeeded", label: "Succeeded" },
 { value: "failed", label: "Failed" },
 { value: "refunded", label: "Refunded" },
 {
 value: "partially_refunded",
 label: "Partially refunded",
 },
 ]}
 />
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full min-w-[800px] text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Date</th>
 <th className="p-2">Enrollment</th>
 <th className="p-2">Method</th>
 <th className="p-2">Amount</th>
 <th className="p-2">Status</th>
 </tr>
 </thead>
 <tbody>
 {payments.map((r) => (
 <tr
 key={String(r._id)}
 className="border-t border-slate-800/80"
 >
 <td className="p-2 text-xs text-slate-400">
 {String(r.createdAt ?? "").slice(0, 19)}
 </td>
 <td className="p-2 font-mono text-xs">
 {String(r.enrollment ?? "")}
 </td>
 <td className="p-2 text-xs">
 {r.paymentMethod === "bank_transfer"
 ? "Bank transfer"
 : r.paymentMethod === "paypal"
 ? "PayPal"
 : "—"}
 </td>
 <td className="p-2">
 {formatMoney(Number(r.amountCents ?? 0) / 100)}
 </td>
 <td className="p-2">
 <select
 value={String(r.status ?? "pending")}
 onChange={(e) =>
 patchAdminPaymentRecordStatus(
 String(r._id),
 e.target.value
 )
 }
 className="max-w-[11rem] rounded border border-slate-700 bg-slate-950 px-1.5 py-1 text-xs capitalize"
 >
 {[
 "pending",
 "processing",
 "succeeded",
 "failed",
 "refunded",
 "partially_refunded",
 ].map((s) => (
 <option key={s} value={s}>
 {s.replace(/_/g, " ")}
 </option>
 ))}
 </select>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <PaginationBar
 meta={paymentsMeta}
 noun="payments"
 onPageChange={setPaymentsPage}
 />
 <p className="text-xs text-slate-500">
 From <strong>Enrollments</strong>, use <strong>Bank</strong> or{" "}
 <strong>PayPal</strong> to create a pending payment and see
 payout instructions. Update <strong>Status</strong> here when
 money is received.
 </p>
 </div>
 )}

 {tab === "promos" && (
 <div className="space-y-4">
 <div className="flex flex-wrap items-end gap-3">
 <label className="flex flex-col gap-1 text-xs text-slate-500">
 Search
 <input
 value={promoFilter.q}
 onChange={(e) => {
 setPromosPage(1);
 setPromoFilter((f) => ({ ...f, q: e.target.value }));
 }}
 className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
 />
 </label>
 <FilterSelect
 label="Active"
 value={promoFilter.active}
 onChange={(v) => {
 setPromosPage(1);
 setPromoFilter((f) => ({ ...f, active: v }));
 }}
 options={[
 { value: "", label: "All" },
 { value: "true", label: "Active" },
 { value: "false", label: "Inactive" },
 ]}
 />
 <button
 type="button"
 onClick={() => setPromoModal({ mode: "create" })}
 className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
 >
 New promo
 </button>
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full min-w-[900px] text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Code</th>
 <th className="p-2">Type</th>
 <th className="p-2">Value</th>
 <th className="p-2">Uses</th>
 <th className="p-2">Courses</th>
 <th className="p-2">Active</th>
 <th className="p-2" />
 </tr>
 </thead>
 <tbody>
 {promos.map((r) => {
 const id = String(r._id ?? "");
 const code = String(r.code ?? "");
 const maxU = r.maxUses as number | null | undefined;
 const used = Number(r.usedCount ?? 0);
 const slugs = (r.courseSlugs as string[] | undefined) ?? [];
 return (
 <tr
 key={id || code}
 className="border-t border-slate-800/80"
 >
 <td className="p-2 font-mono text-xs">{code}</td>
 <td className="p-2">{String(r.discountType)}</td>
 <td className="p-2">
 {r.discountType === "fixed"
 ? formatMoney(Number(r.discountValue) || 0)
 : `${String(r.discountValue)}%`}
 </td>
 <td className="p-2 text-xs">
 {used}
 {maxU != null ? ` / ${maxU}` : ""}
 </td>
 <td className="p-2 text-xs max-w-[200px] truncate">
 {slugs.length ? slugs.join(", ") : "All"}
 </td>
 <td className="p-2">{String(r.isActive)}</td>
 <td className="p-2 space-x-2 whitespace-nowrap">
 <button
 type="button"
 className="text-primary text-xs"
 onClick={() => setPromoModal({ mode: "edit", id })}
 >
 Edit
 </button>
 <button
 type="button"
 className="text-slate-400 text-xs"
 onClick={() =>
 void patchPromo(id, {
 isActive: !Boolean(r.isActive),
 })
 }
 >
 {r.isActive ? "Deactivate" : "Activate"}
 </button>
 <button
 type="button"
 className="text-red-400 text-xs"
 onClick={() => void deletePromo(id, code)}
 >
 Delete
 </button>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 <PaginationBar
 meta={promosMeta}
 noun="promos"
 onPageChange={setPromosPage}
 />
 <p className="text-xs text-slate-500">
 Promo codes apply on top of the course catalog discount. Leave
 course slugs empty for all courses, or list comma-separated
 slugs to restrict.
 </p>
 </div>
 )}

 {tab === "contacts" && (
 <div className="space-y-4">
 <div className="flex flex-wrap items-center gap-3">
 <input
 placeholder="status (new/read/replied)"
 value={conFilter.status}
 onChange={(e) => {
 setContactsPage(1);
 setConFilter((f) => ({ ...f, status: e.target.value }));
 }}
 className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
 />
 <input
 placeholder="search"
 value={conFilter.q}
 onChange={(e) => {
 setContactsPage(1);
 setConFilter((f) => ({ ...f, q: e.target.value }));
 }}
 className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
 />
 <label className="flex items-center gap-2 text-sm text-slate-400">
 <input
 type="checkbox"
 checked={conFilter.challengeOnly}
 onChange={(e) => {
 setContactsPage(1);
 setConFilter((f) => ({
 ...f,
 challengeOnly: e.target.checked,
 }));
 }}
 />
 Challenge signups only
 </label>
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full min-w-[720px] text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Date</th>
 <th className="p-2">Name</th>
 <th className="p-2">Email</th>
 <th className="p-2">Subject</th>
 <th className="p-2">Status</th>
 <th className="p-2 w-24">Actions</th>
 </tr>
 </thead>
 <tbody>
 {contacts.map((r) => (
 <tr
 key={String(r._id)}
 className="border-t border-slate-800/80 align-top"
 >
 <td className="p-2 text-xs text-slate-400">
 {String(r.createdAt ?? "").slice(0, 10)}
 </td>
 <td className="p-2">{String(r.name)}</td>
 <td className="p-2 text-xs">{String(r.email)}</td>
 <td className="p-2 max-w-xs truncate text-xs">
 {String(r.subject)}
 </td>
 <td className="p-2">
 <select
 value={String(r.status ?? "new")}
 onChange={(e) =>
 patchContactStatus(
 String(r._id),
 e.target.value
 )
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
 >
 {["new", "read", "replied"].map((s) => (
 <option key={s} value={s}>
 {s}
 </option>
 ))}
 </select>
 </td>
 <td className="p-2">
 <button
 type="button"
 onClick={() => deleteContact(String(r._id))}
 className="rounded border border-red-900/60 bg-red-950/40 px-2 py-1 text-xs text-red-200 hover:bg-red-950/70"
 >
 Delete
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <PaginationBar
 meta={contactsMeta}
 noun="messages"
 onPageChange={setContactsPage}
 />
 </div>
 )}

 {tab === "challenges" && (
 <div className="space-y-4">
 <div className="flex flex-wrap gap-3">
 <input
 placeholder="search"
 value={chFilter.q}
 onChange={(e) => {
 setChallengesPage(1);
 setChFilter((f) => ({ ...f, q: e.target.value }));
 }}
 className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
 />
 <FilterSelect
 label="Published"
 value={chFilter.published}
 onChange={(v) => {
 setChallengesPage(1);
 setChFilter((f) => ({ ...f, published: v }));
 }}
 options={[
 { value: "", label: "All" },
 { value: "true", label: "Yes" },
 { value: "false", label: "No" },
 ]}
 />
 <button
 type="button"
 onClick={() => setChallengeModal({})}
 className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
 >
 Add challenge
 </button>
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Slug</th>
 <th className="p-2">Month</th>
 <th className="p-2">Title</th>
 <th className="p-2">Published</th>
 <th className="p-2" />
 </tr>
 </thead>
 <tbody>
 {challenges.map((r) => (
 <tr
 key={String(r._id)}
 className="border-t border-slate-800/80"
 >
 <td className="p-2 font-mono text-xs">
 {String(r.slug)}
 </td>
 <td className="p-2">{String(r.monthKey)}</td>
 <td className="p-2">{String(r.titleEn)}</td>
 <td className="p-2">{String(r.isPublished)}</td>
 <td className="p-2 space-x-2">
 <button
 type="button"
 className="text-primary text-xs"
 onClick={() => setChallengeModal({ ...r })}
 >
 Edit
 </button>
 <button
 type="button"
 className="text-red-400 text-xs"
 onClick={() => deleteChallenge(String(r._id))}
 >
 Delete
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <PaginationBar
 meta={challengesMeta}
 noun="challenges"
 onPageChange={setChallengesPage}
 />
 </div>
 )}

 {tab === "team" && (
 <div className="space-y-4">
 <div className="flex flex-wrap gap-3">
 <FilterSelect
 label="Active"
 value={teamFilter.active}
 onChange={(v) => {
 setTeamPage(1);
 setTeamFilter((f) => ({ ...f, active: v }));
 }}
 options={[
 { value: "", label: "All" },
 { value: "true", label: "Active" },
 { value: "false", label: "Inactive" },
 ]}
 />
 <button
 type="button"
 onClick={() => setTeamModal({})}
 className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
 >
 Add member
 </button>
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Name (en)</th>
 <th className="p-2">Role</th>
 <th className="p-2">Avatar</th>
 <th className="p-2">Active</th>
 <th className="p-2" />
 </tr>
 </thead>
 <tbody>
 {team.map((r) => (
 <tr
 key={String(r._id)}
 className="border-t border-slate-800/80"
 >
 <td className="p-2">
 {String((r.name as { en?: string })?.en)}
 </td>
 <td className="p-2 text-xs">
 {String((r.role as { en?: string })?.en)}
 </td>
 <td className="p-2">{String(r.avatar)}</td>
 <td className="p-2">{String(r.isActive)}</td>
 <td className="p-2 space-x-2">
 <button
 type="button"
 className="text-primary text-xs"
 onClick={() => setTeamModal({ ...r })}
 >
 Edit
 </button>
 {r.isActive ? (
 <button
 type="button"
 className="text-red-400 text-xs"
 onClick={() =>
 deactivateTeam(String(r._id))
 }
 >
 Deactivate
 </button>
 ) : null}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <PaginationBar
 meta={teamMeta}
 noun="members"
 onPageChange={setTeamPage}
 />
 </div>
 )}

 {/* ═══════════ BLOG TAB ═══════════ */}
 {tab === "blog" && (
 <div className="space-y-4">
 <div className="flex flex-wrap items-end gap-3">
 <FilterSelect
 label="Status"
 value={blogFilter.published}
 onChange={(v) => { setBlogPage(1); setBlogFilter((f) => ({ ...f, published: v })); }}
 options={[
 { value: "", label: "All" },
 { value: "true", label: "Published" },
 { value: "false", label: "Draft" },
 ]}
 />
 <FilterSelect
 label="Category"
 value={blogFilter.category}
 onChange={(v) => { setBlogPage(1); setBlogFilter((f) => ({ ...f, category: v })); }}
 options={[
 { value: "", label: "All" },
 { value: "coding", label: "Coding" },
 { value: "robotics", label: "Robotics" },
 { value: "arabic", label: "Arabic" },
 { value: "parenting", label: "Parenting" },
 { value: "stem", label: "STEM" },
 { value: "general", label: "General" },
 ]}
 />
 <button
 type="button"
 onClick={() => setBlogModal({ mode: "create" })}
 className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
 >
 New post
 </button>
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full min-w-[800px] text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Title (EN)</th>
 <th className="p-2">Category</th>
 <th className="p-2">Status</th>
 <th className="p-2">Views</th>
 <th className="p-2">Created</th>
 <th className="p-2" />
 </tr>
 </thead>
 <tbody>
 {blogPosts.map((p) => {
 const slug = String(p.slug ?? "");
 const title = (p.title as { en?: string })?.en ?? slug;
 return (
 <tr key={slug} className="border-t border-slate-800/80">
 <td className="p-2 max-w-[250px] truncate font-medium">{title}</td>
 <td className="p-2 text-xs">{String(p.category ?? "general")}</td>
 <td className="p-2">
 <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${p.isPublished ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400"}`}>
 {p.isPublished ? "Published" : "Draft"}
 </span>
 </td>
 <td className="p-2 text-xs">{String(p.viewCount ?? 0)}</td>
 <td className="p-2 text-xs">{p.createdAt ? new Date(String(p.createdAt)).toLocaleDateString() : "—"}</td>
 <td className="p-2 space-x-2 whitespace-nowrap">
 <button type="button" className="text-primary text-xs" onClick={() => setBlogModal({ mode: "edit", slug })}>Edit</button>
 <button type="button" className="text-slate-400 text-xs" onClick={() => void toggleBlogPublish(slug, Boolean(p.isPublished))}>{p.isPublished ? "Unpublish" : "Publish"}</button>
 <button type="button" className="text-red-400 text-xs" onClick={() => void deleteBlog(slug, title)}>Delete</button>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 <PaginationBar meta={blogMeta} noun="posts" onPageChange={setBlogPage} />
 </div>
 )}

 {/* ═══════════ CAREERS TAB ═══════════ */}
 {tab === "careers" && (
 <div className="space-y-4">
 <div className="flex flex-wrap items-end gap-3">
 <FilterSelect
 label="Active"
 value={careerFilter.active}
 onChange={(v) => { setCareersPage(1); setCareerFilter((f) => ({ ...f, active: v })); }}
 options={[
 { value: "", label: "All" },
 { value: "true", label: "Active" },
 { value: "false", label: "Inactive" },
 ]}
 />
 <FilterSelect
 label="Department"
 value={careerFilter.department}
 onChange={(v) => { setCareersPage(1); setCareerFilter((f) => ({ ...f, department: v })); }}
 options={[
 { value: "", label: "All" },
 { value: "engineering", label: "Engineering" },
 { value: "education", label: "Education" },
 { value: "design", label: "Design" },
 { value: "marketing", label: "Marketing" },
 { value: "operations", label: "Operations" },
 { value: "support", label: "Support" },
 { value: "other", label: "Other" },
 ]}
 />
 <button
 type="button"
 onClick={() => setCareerModal({ mode: "create" })}
 className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
 >
 New position
 </button>
 </div>
 <div className="overflow-x-auto rounded-xl border border-slate-800">
 <table className="w-full min-w-[800px] text-left text-sm">
 <thead className="border-b border-slate-800 text-slate-500">
 <tr>
 <th className="p-2">Title (EN)</th>
 <th className="p-2">Department</th>
 <th className="p-2">Type</th>
 <th className="p-2">Level</th>
 <th className="p-2">Active</th>
 <th className="p-2" />
 </tr>
 </thead>
 <tbody>
 {careers.map((c) => {
 const id = String(c._id ?? "");
 const title = (c.title as { en?: string })?.en ?? "";
 return (
 <tr key={id} className="border-t border-slate-800/80">
 <td className="p-2 max-w-[250px] truncate font-medium">{title}</td>
 <td className="p-2 text-xs capitalize">{String(c.department ?? "other")}</td>
 <td className="p-2 text-xs">{String(c.employmentType ?? "full-time")}</td>
 <td className="p-2 text-xs capitalize">{String(c.experienceLevel ?? "mid")}</td>
 <td className="p-2">
 <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c.isActive ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/40 text-red-400"}`}>
 {c.isActive ? "Active" : "Inactive"}
 </span>
 </td>
 <td className="p-2 space-x-2 whitespace-nowrap">
 <button type="button" className="text-primary text-xs" onClick={() => setCareerModal({ mode: "edit", id })}>Edit</button>
 <button type="button" className="text-slate-400 text-xs" onClick={() => void toggleCareerActive(id, Boolean(c.isActive))}>{c.isActive ? "Deactivate" : "Activate"}</button>
 <button type="button" className="text-red-400 text-xs" onClick={() => void deleteCareer(id, title)}>Delete</button>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 <PaginationBar meta={careersMeta} noun="positions" onPageChange={setCareersPage} />
 </div>
 )}
 </main>
 </div>

 {enrollmentDetail && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
 <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-6 text-sm text-slate-200 shadow-xl">
 <div className="mb-4 flex items-center justify-between">
 <h2 className="text-lg font-semibold text-white">
 Enrollment detail
 </h2>
 <button
 type="button"
 className="rounded-lg border border-slate-600 px-3 py-1 text-slate-300"
 onClick={() => setEnrollmentDetail(null)}
 >
 Close
 </button>
 </div>
 <section className="mb-6 space-y-3 rounded-lg border border-slate-800 bg-slate-900/30 p-4">
 <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
 Status & payment
 </h3>
 <div className="grid gap-3 sm:grid-cols-2">
 <label className="block text-xs text-slate-500">
 Enrollment status
 <select
 value={String(enrollmentDetail.enrollment.status ?? "pending")}
 onChange={(ev) =>
 patchEnrollmentStatus(
 String(enrollmentDetail.enrollment._id),
 ev.target.value
 )
 }
 className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
 >
 {[
 "pending",
 "confirmed",
 "active",
 "completed",
 "cancelled",
 ].map((s) => (
 <option key={s} value={s}>
 {s}
 </option>
 ))}
 </select>
 </label>
 <label className="block text-xs text-slate-500">
 Payment received
 <select
 value={String(
 enrollmentDetail.enrollment.paymentStatus ?? "none"
 )}
 onChange={(ev) =>
 patchEnrollmentPaymentStatus(
 String(enrollmentDetail.enrollment._id),
 ev.target.value
 )
 }
 className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
 >
 {ENROLLMENT_PAYMENT_OPTIONS.map((o) => (
 <option key={o.value} value={o.value}>
 {o.label}
 </option>
 ))}
 </select>
 </label>
 </div>
 <p className="text-[11px] text-slate-600">
 Payment options are for your records (cash, transfer, partial
 payments). They are separate from the Payments tab records.
 </p>
 </section>
 <section className="mb-6 space-y-2">
 <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
 Enrollment information
 </h3>
 <EnrollmentFormDataSection
 enrollment={enrollmentDetail.enrollment}
 />
 </section>
 <section className="mb-6 space-y-2">
 <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
 Linked account (same email)
 </h3>
 {enrollmentDetail.linkedUser ? (
 <>
 <p className="text-xs text-slate-400">
 {String(enrollmentDetail.linkedUser.name)} ·{" "}
 {String(enrollmentDetail.linkedUser.role)} · active:{" "}
 {String(enrollmentDetail.linkedUser.isActive)}
 </p>
 {Array.isArray(enrollmentDetail.linkedUser.children) && (enrollmentDetail.linkedUser.children as Record<string, unknown>[]).length > 0 && (
 <>
 <p className="mt-2 text-xs text-slate-500">Children:</p>
 <div className="mt-1 space-y-2">
 {(enrollmentDetail.linkedUser.children as Record<string, unknown>[]).map((child, ci) => (
 <div key={ci} className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs">
 <span className="font-medium text-slate-200">{String(child.name ?? "")}</span>
 {child.age != null && <span className="text-slate-400"> · Age {String(child.age)}</span>}
 {child.gender ? <span className="text-slate-400"> · {String(child.gender)}</span> : null}
 {child.gradeLevel ? <span className="text-slate-400"> · Grade {String(child.gradeLevel)}</span> : null}
 {Array.isArray(child.interests) && (child.interests as string[]).length > 0 && (
 <div className="mt-1 flex flex-wrap gap-1">
 {(child.interests as string[]).map((interest) => (
 <span key={interest} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{interest}</span>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>
 </>
 )}
 </>
 ) : (
 <p className="text-slate-500">
 No user account with this enrollment email.
 </p>
 )}
 </section>
 <section className="space-y-2">
 <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
 Instructor notes
 </h3>
 {enrollmentDetail.instructorNotes.length === 0 ? (
 <p className="text-slate-500">No notes for this enrollment.</p>
 ) : (
 <ul className="space-y-3">
 {enrollmentDetail.instructorNotes.map((n) => (
 <li
 key={String(n._id)}
 className="rounded-lg border border-slate-800 bg-slate-900/50 p-3"
 >
 <div className="text-xs text-slate-500">
 {String(n.instructorName ?? "")} ·{" "}
 {String(n.type ?? "")} ·{" "}
 {String(n.createdAt ?? "").slice(0, 19)}
 </div>
 <div className="mt-1 font-medium text-slate-200">
 {String(n.title ?? "")}
 </div>
 <div className="mt-1 text-slate-400">
 {String(n.body ?? "")}
 </div>
 </li>
 ))}
 </ul>
 )}
 </section>
 </div>
 </div>
 )}

 {userEdit && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
 <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-6 text-sm text-slate-200 shadow-xl">
 <h2 className="mb-4 text-lg font-semibold text-white">Edit user</h2>
 <div className="space-y-3">
 <label className="block text-xs text-slate-500">Name</label>
 <input
 value={String(userEdit.name ?? "")}
 onChange={(e) =>
 setUserEdit((u) =>
 u ? { ...u, name: e.target.value } : u
 )
 }
 className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
 />
 <label className="block text-xs text-slate-500">Phone</label>
 <input
 value={String(userEdit.phone ?? "")}
 onChange={(e) =>
 setUserEdit((u) =>
 u ? { ...u, phone: e.target.value } : u
 )
 }
 className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
 />
 <label className="block text-xs text-slate-500">Role</label>
 <select
 value={String(userEdit.role ?? "parent")}
 onChange={(e) =>
 setUserEdit((u) => (u ? { ...u, role: e.target.value } : u))
 }
 className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
 >
 {["parent", "student", "admin"].map((role) => (
 <option key={role} value={role}>
 {role}
 </option>
 ))}
 </select>
 <label className="flex items-center gap-2 text-slate-300">
 <input
 type="checkbox"
 checked={Boolean(userEdit.isActive)}
 onChange={(e) =>
 setUserEdit((u) =>
 u ? { ...u, isActive: e.target.checked } : u
 )
 }
 />
 Active
 </label>
 </div>
 <div className="mt-6 flex justify-end gap-2">
 <button
 type="button"
 className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300"
 onClick={() => setUserEdit(null)}
 >
 Cancel
 </button>
 <button
 type="button"
 className="rounded-lg bg-primary px-4 py-2 text-white"
 onClick={() => void saveUserEdit()}
 >
 Save
 </button>
 </div>
 </div>
 </div>
 )}

 {categoryModal && (
 <CategoryFormModal
 mode={categoryModal.mode}
 slug={categoryModal.slug}
 onClose={() => setCategoryModal(null)}
 onSaved={async () => {
 setCategoryModal(null);
 await loadCategoriesPage();
 await loadCategoryOptions();
 void revalidatePublicPages();
 }}
 />
 )}

 {courseModal && (
 <CourseFormModal
 mode={courseModal.mode}
 slug={courseModal.slug}
 onClose={() => setCourseModal(null)}
 onSaved={async () => {
 setCourseModal(null);
 await loadCourses();
 await loadOverview();
 void revalidatePublicPages();
 }}
 />
 )}

 {promoModal && (
 <PromoFormModal
 key={promoModal.mode === "edit" ? promoModal.id : "create"}
 mode={promoModal.mode}
 promoId={promoModal.mode === "edit" ? promoModal.id : undefined}
 onClose={() => setPromoModal(null)}
 onSaved={async () => {
 setPromoModal(null);
 await loadPromos();
 }}
 />
 )}

 {challengeModal !== null && (
 <ChallengeFormModal
 initial={challengeModal}
 onClose={() => setChallengeModal(null)}
 onSaved={async () => {
 setChallengeModal(null);
 await loadChallenges();
 await loadOverview();
 }}
 />
 )}

 {teamModal !== null && (
 <TeamFormModal
 initial={teamModal}
 onClose={() => setTeamModal(null)}
 onSaved={async () => {
 setTeamModal(null);
 await loadTeam();
 await loadOverview();
 }}
 />
 )}

 {blogModal && (
 <BlogFormModal
 key={blogModal.mode === "edit" ? blogModal.slug : "create"}
 mode={blogModal.mode}
 blogSlug={blogModal.mode === "edit" ? blogModal.slug : undefined}
 onClose={() => setBlogModal(null)}
 onSaved={async () => {
 setBlogModal(null);
 await loadBlog();
 void revalidatePublicPages(["/en/blog", "/ar/blog"]);
 }}
 />
 )}

 {careerModal && (
 <CareerFormModal
 key={careerModal.mode === "edit" ? careerModal.id : "create"}
 mode={careerModal.mode}
 careerId={careerModal.mode === "edit" ? careerModal.id : undefined}
 onClose={() => setCareerModal(null)}
 onSaved={async () => {
 setCareerModal(null);
 await loadCareers();
 }}
 />
 )}
 </div>
 );
}

function StatCard({
 title,
 value,
 hint,
}: {
 title: string;
 value: string | number;
 hint?: string;
}) {
 return (
 <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
 <div className="text-xs text-slate-500">{title}</div>
 <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
 {hint ? (
 <div className="mt-1 text-xs text-slate-600">{hint}</div>
 ) : null}
 </div>
 );
}

function PaginationBar({
 meta,
 onPageChange,
 noun = "rows",
}: {
 meta: ListMeta;
 onPageChange: (page: number) => void;
 noun?: string;
}) {
 return (
 <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3 text-sm text-slate-400">
 <span>
 Page {meta.page} of {meta.totalPages} — {meta.total} {noun}
 </span>
 <div className="flex gap-2">
 <button
 type="button"
 disabled={meta.page <= 1}
 onClick={() => onPageChange(meta.page - 1)}
 className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
 >
 Previous
 </button>
 <button
 type="button"
 disabled={meta.page >= meta.totalPages}
 onClick={() => onPageChange(meta.page + 1)}
 className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
 >
 Next
 </button>
 </div>
 </div>
 );
}

function FilterSelect({
 label,
 value,
 onChange,
 options,
}: {
 label: string;
 value: string;
 onChange: (v: string) => void;
 options: { value: string; label: string }[];
}) {
 return (
 <label className="flex flex-col gap-1 text-xs text-slate-500">
 {label}
 <select
 value={value}
 onChange={(e) => onChange(e.target.value)}
 className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
 >
 {options.map((o) => (
 <option key={o.value || "all"} value={o.value}>
 {o.label}
 </option>
 ))}
 </select>
 </label>
 );
}

function promoDateToLocalInput(iso: string | Date | undefined | null): string {
 if (!iso) return "";
 const d = new Date(iso);
 if (Number.isNaN(d.getTime())) return "";
 const pad = (n: number) => String(n).padStart(2, "0");
 return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Matches stem-Be category slug validation (`routes/categories.js`). */
const KEBAB_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeKebabSlug(raw: string): string {
 return raw
 .toLowerCase()
 .trim()
 .replace(/[^a-z0-9-]+/g, "-")
 .replace(/-+/g, "-")
 .replace(/^-|-$/g, "");
}

const CHALLENGE_MONTH_KEY_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

function hydratePromoForm(row: Record<string, unknown>) {
 const slugs = (row.courseSlugs as string[] | undefined) ?? [];
 return {
 code: String(row.code ?? ""),
 discountType: (row.discountType === "fixed" ? "fixed" : "percent") as
 | "percent"
 | "fixed",
 discountValue: Number(row.discountValue ?? 0),
 description: String(row.description ?? ""),
 maxUses:
 row.maxUses != null && row.maxUses !== "" ? String(row.maxUses) : "",
 validFrom: promoDateToLocalInput(row.validFrom as string | undefined),
 validUntil: promoDateToLocalInput(row.validUntil as string | undefined),
 courseSlugs: slugs.join(", "),
 isActive: row.isActive !== false,
 };
}

function defaultPromoForm() {
 return {
 code: "",
 discountType: "percent" as "percent" | "fixed",
 discountValue: 10,
 description: "",
 maxUses: "",
 validFrom: "",
 validUntil: "",
 courseSlugs: "",
 isActive: true,
 };
}

function PromoFormModal({
 mode,
 promoId,
 onClose,
 onSaved,
}: {
 mode: "create" | "edit";
 promoId?: string;
 onClose: () => void;
 onSaved: () => Promise<void>;
}) {
 const [loading, setLoading] = useState(mode === "edit");
 const [saveErr, setSaveErr] = useState("");
 const [usedCount, setUsedCount] = useState<number | null>(null);
 const [form, setForm] = useState(defaultPromoForm);

 useEffect(() => {
 if (mode !== "edit" || !promoId) {
 setLoading(false);
 setUsedCount(null);
 setForm(defaultPromoForm());
 return;
 }
 let cancelled = false;
 setLoading(true);
 setSaveErr("");
 (async () => {
 try {
 const row = await adminFetch<Record<string, unknown>>(
 `/admin/promos/${promoId}`
 );
 if (cancelled) return;
 setForm(hydratePromoForm(row));
 setUsedCount(
 row.usedCount != null ? Number(row.usedCount) : null
 );
 } catch (e) {
 if (!cancelled) {
 setSaveErr(e instanceof Error ? e.message : "Load failed");
 }
 } finally {
 if (!cancelled) setLoading(false);
 }
 })();
 return () => {
 cancelled = true;
 };
 }, [mode, promoId]);

 const buildPayload = (forCreate: boolean): Record<string, unknown> => {
 const courseSlugs = form.courseSlugs
 .split(",")
 .map((s) => s.trim().toLowerCase())
 .filter(Boolean);
 let discountValue = Number(form.discountValue);
 if (form.discountType === "percent") {
 discountValue = Math.min(100, Math.max(0.01, discountValue));
 } else {
 discountValue = Math.max(0.01, discountValue);
 }
 const maxUsesRaw = form.maxUses.trim();
 const maxUses = maxUsesRaw
 ? parseInt(maxUsesRaw, 10)
 : null;
 const base: Record<string, unknown> = {
 discountType: form.discountType,
 discountValue,
 currency: "USD",
 isActive: form.isActive,
 description: form.description.trim(),
 maxUses,
 validFrom: form.validFrom
 ? new Date(form.validFrom).toISOString()
 : null,
 validUntil: form.validUntil
 ? new Date(form.validUntil).toISOString()
 : null,
 courseSlugs,
 };
 if (forCreate) {
 base.code = form.code.trim().toUpperCase();
 }
 return base;
 };

 const save = async () => {
 setSaveErr("");
 if (mode === "create" && !form.code.trim()) {
 setSaveErr("Code is required");
 return;
 }
 const dv = Number(form.discountValue);
 if (!Number.isFinite(dv) || dv <= 0) {
 setSaveErr("Discount value must be greater than 0");
 return;
 }
 if (form.discountType === "percent" && dv > 100) {
 setSaveErr("Percent discount cannot exceed 100");
 return;
 }
 if (form.maxUses.trim()) {
 const n = parseInt(form.maxUses.trim(), 10);
 if (!Number.isFinite(n) || n < 1) {
 setSaveErr("Max uses must be a whole number ≥ 1, or leave empty");
 return;
 }
 }
 try {
 if (mode === "create") {
 await adminFetch("/admin/promos", {
 method: "POST",
 body: JSON.stringify(buildPayload(true)),
 });
 } else if (promoId) {
 await adminFetch(`/admin/promos/${promoId}`, {
 method: "PATCH",
 body: JSON.stringify(buildPayload(false)),
 });
 }
 await onSaved();
 } catch (e) {
 setSaveErr(e instanceof Error ? e.message : "Save failed");
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
 <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
 <h2 className="text-lg font-semibold text-white">
 {mode === "create" ? "New promo code" : "Edit promo code"}
 </h2>
 {mode === "edit" && usedCount != null ? (
 <p className="mt-2 text-xs text-slate-500">
 Redemptions recorded: <span className="text-slate-300">{usedCount}</span>{" "}
 (code cannot be changed)
 </p>
 ) : null}
 {saveErr ? (
 <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
 {saveErr}
 </p>
 ) : null}
 {loading ? (
 <p className="mt-4 text-slate-400">Loading…</p>
 ) : (
 <div className="mt-4 grid gap-3 text-sm">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Code</span>
 <input
 value={form.code}
 readOnly={mode === "edit"}
 onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
 className={`w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 font-mono uppercase ${
 mode === "edit" ? "opacity-70 cursor-not-allowed" : ""
 }`}
 />
 </label>
 <div className="grid grid-cols-2 gap-2">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Type</span>
 <select
 value={form.discountType}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 discountType: e.target.value as "percent" | "fixed",
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 >
 <option value="percent">Percent</option>
 <option value="fixed">Fixed amount</option>
 </select>
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Value</span>
 <input
 type="number"
 min={0.01}
 step={0.01}
 value={form.discountValue}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 discountValue: Number(e.target.value),
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 </div>
 <p className="text-xs text-slate-500">
 Fixed-amount promos are in <span className="text-slate-400">USD</span> only.
 </p>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Max uses (empty = unlimited)</span>
 <input
 value={form.maxUses}
 onChange={(e) =>
 setForm((f) => ({ ...f, maxUses: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <div className="grid grid-cols-2 gap-2">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Valid from</span>
 <input
 type="datetime-local"
 value={form.validFrom}
 onChange={(e) =>
 setForm((f) => ({ ...f, validFrom: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Valid until</span>
 <input
 type="datetime-local"
 value={form.validUntil}
 onChange={(e) =>
 setForm((f) => ({ ...f, validUntil: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 </div>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">
 Course slugs (comma-separated, empty = all)
 </span>
 <input
 value={form.courseSlugs}
 onChange={(e) =>
 setForm((f) => ({ ...f, courseSlugs: e.target.value }))
 }
 placeholder="python-for-kids, robotics-101"
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Description</span>
 <input
 value={form.description}
 onChange={(e) =>
 setForm((f) => ({ ...f, description: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="flex items-center gap-2 text-slate-300">
 <input
 type="checkbox"
 checked={form.isActive}
 onChange={(e) =>
 setForm((f) => ({ ...f, isActive: e.target.checked }))
 }
 />
 Active
 </label>
 </div>
 )}
 <div className="mt-6 flex justify-end gap-2">
 <button
 type="button"
 onClick={onClose}
 className="rounded-lg border border-slate-600 px-4 py-2 text-sm"
 >
 Cancel
 </button>
 <button
 type="button"
 disabled={loading}
 onClick={() => void save()}
 className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
 >
 {mode === "create" ? "Create" : "Save"}
 </button>
 </div>
 </div>
 </div>
 );
}

function CourseFormModal({
 mode,
 slug: editSlug,
 onClose,
 onSaved,
}: {
 mode: "create" | "edit";
 slug?: string;
 onClose: () => void;
 onSaved: () => Promise<void>;
}) {
 const [loading, setLoading] = useState(mode === "edit" && !!editSlug);
 const [saveErr, setSaveErr] = useState("");
 const [catRows, setCatRows] = useState<AdminCategoryRow[]>([]);
 const [instructorOptions, setInstructorOptions] = useState<
 { _id: string; name: string }[]
 >([]);
 const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
 const [form, setForm] = useState({
 slug: "",
 category: "programming",
 ageMin: 8,
 ageMax: 12,
 level: "beginner",
 lessons: 10,
 durationWeeks: 8,
 iconName: "BookOpen",
 color: "from-blue-400 to-cyan-400",
 titleEn: "",
 titleAr: "",
 descEn: "",
 descAr: "",
 skillsEn: "",
 skillsAr: "",
 price: 0,
 discountPercent: 0,
 imageUrl: "",
 imagePublicId: "",
 });
 const [uploadingCourseImage, setUploadingCourseImage] = useState(false);

 useEffect(() => {
 let cancelled = false;
 (async () => {
 try {
 const [catRaw, teamRaw] = await Promise.all([
 adminFetch<unknown>("/categories/admin/list?page=1&limit=200"),
 adminFetch<unknown>("/team/admin/list?page=1&limit=200"),
 ]);
 const { items: cats } = normalizePagedResponse<AdminCategoryRow>(
 catRaw,
 PAGE_SIZE
 );
 const { items: teamMembers } = normalizePagedResponse<Record<string, unknown>>(teamRaw, PAGE_SIZE);
 const instrs = teamMembers.map((m) => ({
 _id: String(m._id ?? ""),
 name: ((m.name as { en?: string })?.en) || String(m.name ?? ""),
 }));
 if (!cancelled) {
 setCatRows(cats);
 setInstructorOptions(instrs);
 }
 } catch {
 if (!cancelled) {
 setCatRows([]);
 setInstructorOptions([]);
 }
 }
 })();
 return () => {
 cancelled = true;
 };
 }, []);

 useEffect(() => {
 if (mode !== "edit" || !editSlug) return;
 (async () => {
 try {
 const c = await adminFetch<Record<string, unknown>>(
 `/courses/admin/by-slug/${encodeURIComponent(editSlug)}`
 );
 const title = c.title as { en: string; ar: string };
 const desc = c.description as { en: string; ar: string };
 const skills = c.skills as { en: string[]; ar: string[] };
 const instrIds = Array.isArray(c.instructors)
 ? (c.instructors as string[]).map(String)
 : [];
 setSelectedInstructors(instrIds);
 setForm({
 slug: String(c.slug),
 category: String(c.category),
 ageMin: Number(c.ageMin),
 ageMax: Number(c.ageMax),
 level: String(c.level),
 lessons: Number(c.lessons),
 durationWeeks: Number(c.durationWeeks),
 iconName: String(c.iconName ?? "BookOpen"),
 color: String(c.color ?? "from-blue-400 to-cyan-400"),
 titleEn: title?.en ?? "",
 titleAr: title?.ar ?? "",
 descEn: desc?.en ?? "",
 descAr: desc?.ar ?? "",
 skillsEn: (skills?.en ?? []).join(", "),
 skillsAr: (skills?.ar ?? []).join(", "),
 price: Number(c.price ?? 0),
 discountPercent: Number(c.discountPercent ?? 0),
 imageUrl: String((c as { imageUrl?: string }).imageUrl ?? ""),
 imagePublicId: String((c as { imagePublicId?: string }).imagePublicId ?? ""),
 });
 } finally {
 setLoading(false);
 }
 })();
 }, [mode, editSlug]);

 const save = async () => {
 setSaveErr("");
 const lessons = Math.floor(Math.max(1, Number(form.lessons) || 1));
 const durationWeeks = Math.floor(
 Math.max(1, Number(form.durationWeeks) || 1)
 );
 const ageMin = Math.min(18, Math.max(6, Number(form.ageMin) || 6));
 const ageMax = Math.min(18, Math.max(6, Number(form.ageMax) || 18));
 const slugForBody =
 mode === "create"
 ? normalizeKebabSlug(form.slug)
 : (editSlug ?? form.slug).trim();
 if (mode === "edit" && !slugForBody) {
 setSaveErr("Missing course slug — close and try Edit again.");
 return;
 }
 const body = {
 slug: slugForBody,
 category: String(form.category).trim().toLowerCase(),
 ageMin: Math.min(ageMin, ageMax),
 ageMax: Math.max(ageMin, ageMax),
 level: form.level,
 lessons,
 durationWeeks,
 iconName: form.iconName,
 color: form.color,
 title: { en: form.titleEn.trim(), ar: form.titleAr.trim() },
 description: { en: form.descEn.trim(), ar: form.descAr.trim() },
 skills: {
 en: form.skillsEn.split(",").map((s) => s.trim()).filter(Boolean),
 ar: form.skillsAr.split(",").map((s) => s.trim()).filter(Boolean),
 },
 price:
 Math.round(Math.max(0, Number(form.price) || 0) * 100) / 100,
 currency: "USD",
 discountPercent: Math.min(
 100,
 Math.max(0, Number(form.discountPercent) || 0)
 ),
 imageUrl: form.imageUrl.trim(),
 imagePublicId: form.imagePublicId.trim(),
 instructors: selectedInstructors,
 };
 try {
 if (mode === "create") {
 await adminFetch("/courses", {
 method: "POST",
 body: JSON.stringify(body),
 });
 } else {
 const key = (editSlug ?? "").trim();
 await adminFetch(`/courses/${encodeURIComponent(key)}`, {
 method: "PUT",
 body: JSON.stringify(body),
 });
 }
 await onSaved();
 } catch (e) {
 setSaveErr(e instanceof Error ? e.message : "Save failed");
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
 <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
 <h2 className="text-lg font-semibold text-white">
 {mode === "create" ? "New course" : "Edit course"}
 </h2>
 {saveErr ? (
 <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
 {saveErr}
 </p>
 ) : null}
 {loading ? (
 <p className="mt-4 text-slate-400">Loading…</p>
 ) : (
 <div className="mt-4 grid gap-3 text-sm">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Slug (URL id)</span>
 <input
 placeholder="e.g. my-new-course"
 disabled={mode === "edit"}
 value={form.slug}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 slug:
 mode === "create"
 ? normalizeKebabSlug(e.target.value)
 : e.target.value,
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 disabled:opacity-60"
 />
 </label>
 <div className="grid grid-cols-2 gap-2">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Age min</span>
 <input
 type="number"
 min={6}
 max={18}
 value={form.ageMin}
 onChange={(e) =>
 setForm((f) => ({ ...f, ageMin: +e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Age max</span>
 <input
 type="number"
 min={6}
 max={18}
 value={form.ageMax}
 onChange={(e) =>
 setForm((f) => ({ ...f, ageMax: +e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 </div>
 <div className="grid grid-cols-2 gap-2">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Lessons</span>
 <input
 type="number"
 min={1}
 value={form.lessons}
 onChange={(e) =>
 setForm((f) => ({ ...f, lessons: +e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Duration (weeks)</span>
 <input
 type="number"
 min={1}
 value={form.durationWeeks}
 onChange={(e) =>
 setForm((f) => ({ ...f, durationWeeks: +e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 </div>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Category</span>
 <select
 value={form.category}
 onChange={(e) =>
 setForm((f) => ({ ...f, category: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 >
 {(catRows.filter(
 (r) => r.isActive || r.slug === form.category
 ).length
 ? catRows.filter(
 (r) => r.isActive || r.slug === form.category
 )
 : [
 "programming",
 "robotics",
 "algorithms",
 "arabic",
 "arabic",
 ].map((slug) => ({
 slug,
 title: { en: slug, ar: slug },
 }))
 ).map((c) => (
 <option key={c.slug} value={c.slug}>
 {c.title.en} ({c.slug})
 </option>
 ))}
 </select>
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Level</span>
 <select
 value={form.level}
 onChange={(e) =>
 setForm((f) => ({ ...f, level: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 >
 {["beginner", "intermediate", "advanced"].map((c) => (
 <option key={c} value={c}>
 {c}
 </option>
 ))}
 </select>
 </label>
 <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/90">
 <strong>List price</strong> drives catalog revenue estimates.{" "}
 <strong>Catalog discount</strong> is a percent off that list price
 before promo codes. Payment requests use the enrollment&apos;s{" "}
 <strong>amount due</strong> (after catalog + promo).
 </p>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Price (USD)</span>
 <input
 type="number"
 min={0}
 step={0.01}
 value={form.price}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 price: Math.max(0, Number(e.target.value) || 0),
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Catalog discount (%)</span>
 <input
 type="number"
 min={0}
 max={100}
 value={form.discountPercent}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 discountPercent: Math.min(
 100,
 Math.max(0, Number(e.target.value) || 0)
 ),
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <input
 placeholder="title EN"
 value={form.titleEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, titleEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="title AR"
 value={form.titleAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, titleAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <textarea
 placeholder="description EN"
 value={form.descEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, descEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 rows={3}
 />
 <textarea
 placeholder="description AR"
 value={form.descAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, descAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 rows={3}
 />
 <input
 placeholder="skills EN comma"
 value={form.skillsEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, skillsEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="skills AR comma"
 value={form.skillsAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, skillsAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <div className="space-y-2">
 <span className="block text-xs text-slate-400">Course cover image</span>
 {form.imageUrl ? (
 <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-3">
 <div className="flex items-start gap-3">
 {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
 <img
 src={teamPhotoPreviewSrc(form.imageUrl)}
 alt="Course cover"
 className="h-24 w-40 shrink-0 rounded-lg border border-slate-600 object-cover"
 onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
 />
 <div className="space-y-2">
 <p className="text-[10px] text-slate-500 break-all">{form.imageUrl}</p>
 <div className="flex gap-2">
 <label className="cursor-pointer rounded bg-slate-700 px-2 py-1 text-xs text-white hover:bg-slate-600">
 Replace
 <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploadingCourseImage} onChange={(e) => {
 const file = e.target.files?.[0];
 e.target.value = "";
 if (!file) return;
 void (async () => {
 setUploadingCourseImage(true);
 try {
 const fd = new FormData();
 fd.append("photo", file);
 const data = await adminFetch<{ photoUrl: string; photoPublicId?: string }>("/courses/upload", { method: "POST", body: fd });
 setForm((f) => ({ ...f, imageUrl: data.photoUrl, imagePublicId: String(data.photoPublicId ?? "") }));
 } catch (err) { setSaveErr(err instanceof Error ? err.message : "Image upload failed"); }
 finally { setUploadingCourseImage(false); }
 })();
 }} />
 </label>
 <button type="button" className="rounded bg-red-900/40 px-2 py-1 text-xs text-red-400 hover:bg-red-900/60" onClick={() => setForm((f) => ({ ...f, imageUrl: "", imagePublicId: "" }))}>
 Remove
 </button>
 </div>
 </div>
 </div>
 {uploadingCourseImage && <p className="mt-2 text-xs text-slate-500">Uploading…</p>}
 </div>
 ) : (
 <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/20 p-4">
 <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
 <span className="text-xs text-slate-400">Click to upload or drag an image</span>
 <span className="text-[10px] text-slate-600">JPEG, PNG, WebP, GIF — max 2MB</span>
 <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploadingCourseImage} onChange={(e) => {
 const file = e.target.files?.[0];
 e.target.value = "";
 if (!file) return;
 void (async () => {
 setUploadingCourseImage(true);
 try {
 const fd = new FormData();
 fd.append("photo", file);
 const data = await adminFetch<{ photoUrl: string; photoPublicId?: string }>("/courses/upload", { method: "POST", body: fd });
 setForm((f) => ({ ...f, imageUrl: data.photoUrl, imagePublicId: String(data.photoPublicId ?? "") }));
 } catch (err) { setSaveErr(err instanceof Error ? err.message : "Image upload failed"); }
 finally { setUploadingCourseImage(false); }
 })();
 }} />
 </label>
 {uploadingCourseImage && <p className="mt-2 text-center text-xs text-slate-500">Uploading…</p>}
 <div className="mt-3 flex items-center gap-2">
 <span className="text-[10px] text-slate-600">or paste URL:</span>
 <input placeholder="https://..." value="" onChange={(e) => { const v = e.target.value.trim(); if (v) setForm((f) => ({ ...f, imageUrl: v, imagePublicId: "" })); }} className="flex-1 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-300" />
 </div>
 </div>
 )}
 </div>
 <div className="text-slate-400">
 <span className="mb-1 block text-xs">Assign instructors</span>
 {instructorOptions.length === 0 ? (
 <p className="text-xs text-slate-500">
 No team members found. Add one in the Team tab first.
 </p>
 ) : (
 <div className="max-h-36 space-y-1 overflow-y-auto rounded border border-slate-700 bg-slate-950 p-2">
 {instructorOptions.map((inst) => (
 <label
 key={inst._id}
 className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer"
 >
 <input
 type="checkbox"
 checked={selectedInstructors.includes(
 String(inst._id)
 )}
 onChange={(e) => {
 const id = String(inst._id);
 setSelectedInstructors((prev) =>
 e.target.checked
 ? [...prev, id]
 : prev.filter((x) => x !== id)
 );
 }}
 className="accent-primary"
 />
 {inst.name}
 </label>
 ))}
 </div>
 )}
 </div>
 </div>
 )}
 <div className="mt-6 flex justify-end gap-2">
 <button
 type="button"
 onClick={onClose}
 className="rounded-lg border border-slate-600 px-4 py-2 text-sm"
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={() => void save()}
 disabled={loading}
 className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
 >
 Save
 </button>
 </div>
 </div>
 </div>
 );
}

function CategoryFormModal({
 mode,
 slug: editSlug,
 onClose,
 onSaved,
}: {
 mode: "create" | "edit";
 slug?: string;
 onClose: () => void;
 onSaved: () => Promise<void>;
}) {
 const [loading, setLoading] = useState(mode === "edit");
 const [saveErr, setSaveErr] = useState("");
 const [form, setForm] = useState({
 slug: "",
 titleEn: "",
 titleAr: "",
 descriptionEn: "",
 descriptionAr: "",
 sortOrder: 100,
 isActive: true,
 });

 useEffect(() => {
 if (mode !== "edit" || !editSlug) return;
 (async () => {
 try {
 const c = await adminFetch<AdminCategoryRow>(
 `/categories/admin/by-slug/${encodeURIComponent(editSlug)}`
 );
 setForm({
 slug: c.slug,
 titleEn: c.title.en,
 titleAr: c.title.ar,
 descriptionEn: c.description?.en ?? "",
 descriptionAr: c.description?.ar ?? "",
 sortOrder: c.sortOrder,
 isActive: c.isActive,
 });
 } catch {
 setSaveErr("Failed to load category");
 } finally {
 setLoading(false);
 }
 })();
 }, [mode, editSlug]);

 const save = async () => {
 setSaveErr("");
 const newSlug = normalizeKebabSlug(form.slug);
 if (mode === "create") {
 if (!newSlug || !KEBAB_SLUG_REGEX.test(newSlug)) {
 setSaveErr(
 "Slug must be kebab-case (lowercase letters, numbers, single hyphens)"
 );
 return;
 }
 }
 if (mode === "edit") {
 const key = (editSlug ?? "").trim();
 if (!key) {
 setSaveErr("Missing category slug — close and try Edit again.");
 return;
 }
 }
 try {
 if (mode === "create") {
 await adminFetch("/categories", {
 method: "POST",
 body: JSON.stringify({
 slug: newSlug,
 title: { en: form.titleEn.trim(), ar: form.titleAr.trim() },
 description: {
 en: form.descriptionEn.trim(),
 ar: form.descriptionAr.trim(),
 },
 sortOrder: Number(form.sortOrder) || 0,
 isActive: form.isActive,
 }),
 });
 } else {
 const key = (editSlug ?? "").trim();
 await adminFetch(`/categories/${encodeURIComponent(key)}`, {
 method: "PUT",
 body: JSON.stringify({
 title: { en: form.titleEn.trim(), ar: form.titleAr.trim() },
 description: {
 en: form.descriptionEn.trim(),
 ar: form.descriptionAr.trim(),
 },
 sortOrder: Number(form.sortOrder) || 0,
 isActive: form.isActive,
 }),
 });
 }
 await onSaved();
 } catch (e) {
 setSaveErr(e instanceof Error ? e.message : "Save failed");
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
 <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
 <h2 className="text-lg font-semibold text-white">
 {mode === "create" ? "New category" : "Edit category"}
 </h2>
 {saveErr ? (
 <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
 {saveErr}
 </p>
 ) : null}
 {loading ? (
 <p className="mt-4 text-slate-400">Loading…</p>
 ) : (
 <div className="mt-4 grid gap-3 text-sm">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Slug (kebab-case)</span>
 <input
 placeholder="e.g. data-science"
 disabled={mode === "edit"}
 value={form.slug}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 slug:
 mode === "create"
 ? normalizeKebabSlug(e.target.value)
 : f.slug,
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 disabled:opacity-60"
 />
 </label>
 <input
 placeholder="Title EN"
 value={form.titleEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, titleEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Title AR"
 value={form.titleAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, titleAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Description (EN)</span>
 <textarea
 rows={4}
 placeholder="Short paragraph for the homepage card (English)"
 value={form.descriptionEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, descriptionEn: e.target.value }))
 }
 className="w-full resize-y rounded border border-slate-700 bg-slate-950 px-2 py-2 text-slate-100 placeholder:text-slate-600"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Description (AR)</span>
 <textarea
 rows={4}
 placeholder="نص قصير لبطاقة الفئة على الصفحة الرئيسية"
 value={form.descriptionAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, descriptionAr: e.target.value }))
 }
 className="w-full resize-y rounded border border-slate-700 bg-slate-950 px-2 py-2 text-slate-100 placeholder:text-slate-600"
 dir="rtl"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Sort order</span>
 <input
 type="number"
 value={form.sortOrder}
 onChange={(e) =>
 setForm((f) => ({ ...f, sortOrder: +e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="flex items-center gap-2 text-slate-300">
 <input
 type="checkbox"
 checked={form.isActive}
 onChange={(e) =>
 setForm((f) => ({ ...f, isActive: e.target.checked }))
 }
 />
 Active (listed publicly; required for new courses)
 </label>
 </div>
 )}
 <div className="mt-6 flex justify-end gap-2">
 <button
 type="button"
 onClick={onClose}
 className="rounded-lg border border-slate-600 px-4 py-2 text-sm"
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={() => void save()}
 disabled={loading}
 className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
 >
 Save
 </button>
 </div>
 </div>
 </div>
 );
}

type ChallengeStepForm = {
 titleEn: string;
 titleAr: string;
 bodyEn: string;
 bodyAr: string;
};

const EMPTY_CHALLENGE_STEP: ChallengeStepForm = {
 titleEn: "",
 titleAr: "",
 bodyEn: "",
 bodyAr: "",
};

function challengeStepsFromInitial(
 raw: unknown,
 isNew: boolean
): ChallengeStepForm[] {
 if (!Array.isArray(raw) || raw.length === 0) {
 return isNew
 ? Array.from({ length: 4 }, () => ({ ...EMPTY_CHALLENGE_STEP }))
 : [{ ...EMPTY_CHALLENGE_STEP }];
 }
 return raw.map((item) => {
 const o = item as Record<string, unknown>;
 return {
 titleEn: String(o.titleEn ?? ""),
 titleAr: String(o.titleAr ?? ""),
 bodyEn: String(o.bodyEn ?? ""),
 bodyAr: String(o.bodyAr ?? ""),
 };
 });
}

function ChallengeFormModal({
 initial,
 onClose,
 onSaved,
}: {
 initial: Record<string, unknown>;
 onClose: () => void;
 onSaved: () => Promise<void>;
}) {
 const isNew = !initial._id;
 const [saveErr, setSaveErr] = useState("");
 const [form, setForm] = useState({
 slug: String(initial.slug ?? ""),
 monthKey: String(initial.monthKey ?? ""),
 badgeEn: String(initial.badgeEn ?? ""),
 badgeAr: String(initial.badgeAr ?? ""),
 titleEn: String(initial.titleEn ?? ""),
 titleAr: String(initial.titleAr ?? ""),
 subtitleEn: String(initial.subtitleEn ?? ""),
 subtitleAr: String(initial.subtitleAr ?? ""),
 formTitleEn: String(initial.formTitleEn ?? ""),
 formTitleAr: String(initial.formTitleAr ?? ""),
 formSubtitleEn: String(initial.formSubtitleEn ?? ""),
 formSubtitleAr: String(initial.formSubtitleAr ?? ""),
 hintBodyEn: String(initial.hintBodyEn ?? ""),
 hintBodyAr: String(initial.hintBodyAr ?? ""),
 isPublished: Boolean(initial.isPublished),
 });
 const [steps, setSteps] = useState<ChallengeStepForm[]>(() =>
 challengeStepsFromInitial(initial.steps, isNew)
 );

 const updateStep = (
 index: number,
 patch: Partial<ChallengeStepForm>
 ) => {
 setSteps((prev) =>
 prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
 );
 };

 const addStep = () => {
 setSteps((prev) => [...prev, { ...EMPTY_CHALLENGE_STEP }]);
 };

 const removeStep = (index: number) => {
 setSteps((prev) =>
 prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)
 );
 };

 const save = async () => {
 setSaveErr("");
 const slug = isNew ? normalizeKebabSlug(form.slug) : form.slug.trim();
 const monthKey = form.monthKey.trim();
 if (isNew && (!slug || !KEBAB_SLUG_REGEX.test(slug))) {
 setSaveErr(
 "Slug must be kebab-case (lowercase letters, numbers, single hyphens)"
 );
 return;
 }
 if (
 isNew &&
 (!monthKey || !CHALLENGE_MONTH_KEY_REGEX.test(monthKey))
 ) {
 setSaveErr("Month key must be YYYY-MM with month 01–12");
 return;
 }
 const stepsPayload = steps.map((s) => ({
 titleEn: s.titleEn.trim(),
 titleAr: s.titleAr.trim(),
 bodyEn: s.bodyEn.trim(),
 bodyAr: s.bodyAr.trim(),
 }));
 const body = {
 slug,
 monthKey,
 badgeEn: form.badgeEn.trim(),
 badgeAr: form.badgeAr.trim(),
 titleEn: form.titleEn.trim(),
 titleAr: form.titleAr.trim(),
 subtitleEn: form.subtitleEn.trim(),
 subtitleAr: form.subtitleAr.trim(),
 formTitleEn: form.formTitleEn.trim(),
 formTitleAr: form.formTitleAr.trim(),
 formSubtitleEn: form.formSubtitleEn.trim(),
 formSubtitleAr: form.formSubtitleAr.trim(),
 hintBodyEn: form.hintBodyEn.trim(),
 hintBodyAr: form.hintBodyAr.trim(),
 isPublished: form.isPublished,
 steps: stepsPayload,
 };
 try {
 if (isNew) {
 await adminFetch("/challenges", {
 method: "POST",
 body: JSON.stringify(body),
 });
 } else {
 await adminFetch(`/challenges/${String(initial._id)}`, {
 method: "PUT",
 body: JSON.stringify(body),
 });
 }
 await onSaved();
 } catch (e) {
 setSaveErr(e instanceof Error ? e.message : "Save failed");
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
 <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
 <h2 className="text-lg font-semibold text-white">
 {isNew ? "New challenge" : "Edit challenge"}
 </h2>
 <p className="mt-1 text-xs text-slate-500">
 Steps match the public challenge page: Step 1…N with title and
 description (EN/AR). The hint and signup block use the fields below.
 </p>
 {saveErr ? (
 <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
 {saveErr}
 </p>
 ) : null}
 <div className="mt-4 space-y-6 text-sm">
 <section className="space-y-2">
 <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
 Basics
 </h3>
 <div className="grid gap-2 sm:grid-cols-2">
 <input
 placeholder="Slug (unique)"
 value={form.slug}
 disabled={!isNew}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 slug: isNew ? normalizeKebabSlug(e.target.value) : f.slug,
 }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1 disabled:opacity-60 sm:col-span-2"
 />
 <input
 placeholder="Month key (YYYY-MM)"
 value={form.monthKey}
 onChange={(e) =>
 setForm((f) => ({ ...f, monthKey: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <label className="flex items-center gap-2 text-slate-400 sm:col-span-2">
 <input
 type="checkbox"
 checked={form.isPublished}
 onChange={(e) =>
 setForm((f) => ({ ...f, isPublished: e.target.checked }))
 }
 />
 Published
 </label>
 <input
 placeholder="Badge EN (pill)"
 value={form.badgeEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, badgeEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Badge AR"
 value={form.badgeAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, badgeAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Title EN"
 value={form.titleEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, titleEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Title AR"
 value={form.titleAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, titleAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Subtitle EN"
 value={form.subtitleEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, subtitleEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Subtitle AR"
 value={form.subtitleAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, subtitleAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </div>
 </section>

 <section className="space-y-3">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
 Steps (how it works)
 </h3>
 <button
 type="button"
 onClick={addStep}
 className="rounded-lg border border-slate-600 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
 >
 Add step
 </button>
 </div>
 <div className="space-y-4">
 {steps.map((step, index) => (
 <div
 key={index}
 className="rounded-xl border border-slate-700 bg-slate-950/50 p-4"
 >
 <div className="mb-3 flex items-center justify-between gap-2">
 <span className="text-sm font-medium text-white">
 Step {index + 1}
 </span>
 {steps.length > 1 ? (
 <button
 type="button"
 onClick={() => removeStep(index)}
 className="text-xs text-red-400 hover:underline"
 >
 Remove
 </button>
 ) : null}
 </div>
 <div className="grid gap-2 sm:grid-cols-2">
 <input
 placeholder="Step title (EN)"
 value={step.titleEn}
 onChange={(e) =>
 updateStep(index, { titleEn: e.target.value })
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Step title (AR)"
 value={step.titleAr}
 onChange={(e) =>
 updateStep(index, { titleAr: e.target.value })
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <label className="block text-slate-500 sm:col-span-2">
 <span className="mb-1 block text-xs">
 Description (EN)
 </span>
 <textarea
 placeholder="What participants do in this step…"
 value={step.bodyEn}
 onChange={(e) =>
 updateStep(index, { bodyEn: e.target.value })
 }
 className="min-h-[72px] w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 rows={3}
 />
 </label>
 <label className="block text-slate-500 sm:col-span-2">
 <span className="mb-1 block text-xs">
 Description (AR)
 </span>
 <textarea
 placeholder="وصف الخطوة…"
 value={step.bodyAr}
 onChange={(e) =>
 updateStep(index, { bodyAr: e.target.value })
 }
 className="min-h-[72px] w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 rows={3}
 />
 </label>
 </div>
 </div>
 ))}
 </div>
 </section>

 <section className="space-y-2">
 <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
 Hint & signup section
 </h3>
 <div className="grid gap-2 sm:grid-cols-2">
 <input
 placeholder="Form heading EN (optional)"
 value={form.formTitleEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, formTitleEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Form heading AR"
 value={form.formTitleAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, formTitleAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Form subtitle EN"
 value={form.formSubtitleEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, formSubtitleEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Form subtitle AR"
 value={form.formSubtitleAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, formSubtitleAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </div>
 <label className="block text-slate-500">
 <span className="mb-1 block text-xs">Hint body (EN)</span>
 <textarea
 value={form.hintBodyEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, hintBodyEn: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 rows={3}
 placeholder="Tips shown in the collapsible hint…"
 />
 </label>
 <label className="block text-slate-500">
 <span className="mb-1 block text-xs">Hint body (AR)</span>
 <textarea
 value={form.hintBodyAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, hintBodyAr: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 rows={3}
 />
 </label>
 </section>
 </div>
 <div className="mt-6 flex justify-end gap-2">
 <button
 type="button"
 onClick={onClose}
 className="rounded-lg border border-slate-600 px-4 py-2 text-sm"
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={() => void save()}
 className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
 >
 Save
 </button>
 </div>
 </div>
 </div>
 );
}

const TEAM_ROLE_PRESETS: { id: string; en: string; ar: string }[] = [
 { id: "instructor", en: "Instructor", ar: "مدرب" },
 { id: "lead_instructor", en: "Lead Instructor", ar: "مدرب رئيسي" },
 { id: "curriculum", en: "Curriculum Lead", ar: "قائد المنهج" },
 { id: "stem", en: "STEM Specialist", ar: "أخصائي STEM" },
 {
 id: "arabic_arabic",
 en: "Arabic Specialist",
 ar: "أخصائي العربية ",
 },
 { id: "operations", en: "Operations Manager", ar: "مدير العمليات" },
 { id: "customer_success", en: "Customer Success", ar: "نجاح العملاء" },
 { id: "cofounder", en: "Co-Founder", ar: "شريك مؤسس" },
 { id: "ceo", en: "CEO", ar: "الرئيس التنفيذي" },
];

function teamRolePresetId(
 roleEn: string,
 roleAr: string
): string | "custom" {
 const found = TEAM_ROLE_PRESETS.find(
 (p) => p.en === roleEn && p.ar === roleAr
 );
 return found?.id ?? "custom";
}

function TeamFormModal({
 initial,
 onClose,
 onSaved,
}: {
 initial: Record<string, unknown>;
 onClose: () => void;
 onSaved: () => Promise<void>;
}) {
 const isNew = !initial._id;
 const name = initial.name as { en?: string; ar?: string } | undefined;
 const role = initial.role as { en?: string; ar?: string } | undefined;
 const bio = initial.bio as { en?: string; ar?: string } | undefined;
 const initialRoleEn = String(role?.en ?? "");
 const initialRoleAr = String(role?.ar ?? "");
 const defaultRole = TEAM_ROLE_PRESETS[0];
 const [form, setForm] = useState({
 nameEn: String(name?.en ?? ""),
 nameAr: String(name?.ar ?? ""),
 roleEn: initialRoleEn || (isNew ? defaultRole.en : ""),
 roleAr: initialRoleAr || (isNew ? defaultRole.ar : ""),
 avatar: String(initial.avatar ?? "PC"),
 photoUrl: String((initial as { photoUrl?: string }).photoUrl ?? ""),
 photoPublicId: String(
 (initial as { photoPublicId?: string }).photoPublicId ?? ""
 ),
 color: resolveTeamCardGradient(String(initial.color ?? "")),
 headerColor: String(initial.headerColor ?? "bg-primary"),
 order: Number(initial.order ?? 0),
 linkedin: String(initial.linkedin ?? ""),
 rating: Math.min(5, Math.max(0, Number(initial.rating ?? 5))),
 reviews: Math.max(0, Math.floor(Number(initial.reviews ?? 0))),
 experienceYears: Math.max(0, Math.floor(Number(initial.experienceYears ?? 0))),
 skillsEnCsv: teamSkillsToCsv(initial.skillsEn),
 skillsArCsv: teamSkillsToCsv(initial.skillsAr),
 locationEn: String(initial.locationEn ?? ""),
 locationAr: String(initial.locationAr ?? ""),
 flag: String(initial.flag ?? ""),
 bioEn: String(bio?.en ?? ""),
 bioAr: String(bio?.ar ?? ""),
 });
 const [rolePresetId, setRolePresetId] = useState<string>(() => {
 if (isNew && !initialRoleEn && !initialRoleAr) return defaultRole.id;
 return teamRolePresetId(initialRoleEn, initialRoleAr);
 });
 const [uploadingPhoto, setUploadingPhoto] = useState(false);

 const save = async () => {
 const skillsEn = form.skillsEnCsv
 .split(",")
 .map((s) => s.trim())
 .filter(Boolean);
 const skillsAr = form.skillsArCsv
 .split(",")
 .map((s) => s.trim())
 .filter(Boolean);
 const avatar = (form.avatar.trim().slice(0, 2) || "PC").slice(0, 2);
 const body = {
 name: { en: form.nameEn.trim(), ar: form.nameAr.trim() },
 role: { en: form.roleEn.trim(), ar: form.roleAr.trim() },
 avatar,
 color: form.color,
 headerColor: form.headerColor,
 order: form.order,
 linkedin: form.linkedin.trim(),
 rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
 reviews: Math.max(0, Math.floor(Number(form.reviews) || 0)),
 experienceYears: Math.max(0, Math.floor(Number(form.experienceYears) || 0)),
 skillsEn,
 skillsAr,
 locationEn: form.locationEn.trim(),
 locationAr: form.locationAr.trim(),
 flag: form.flag.trim().slice(0, 16),
 bio: { en: form.bioEn.trim(), ar: form.bioAr.trim() },
 photoUrl: form.photoUrl.trim(),
 photoPublicId: form.photoPublicId.trim(),
 };
 if (isNew) {
 await adminFetch("/team", { method: "POST", body: JSON.stringify(body) });
 } else {
 await adminFetch(`/team/${String(initial._id)}`, {
 method: "PUT",
 body: JSON.stringify(body),
 });
 }
 await onSaved();
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
 <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
 <h2 className="text-lg font-semibold text-white">
 {isNew ? "New team member" : "Edit team member"}
 </h2>
 <p className="mt-2 text-xs text-slate-500">
 Fields below match the home page &quot;Meet Our Stars&quot; cards and the About team grid (name, role, avatar, colors, LinkedIn, stats, skills, location, flag, bios).
 </p>
 <div className="mt-4 grid gap-2 text-sm">
 <input
 placeholder="Name EN"
 value={form.nameEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, nameEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Name AR"
 value={form.nameAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, nameAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Role</span>
 <select
 value={rolePresetId}
 onChange={(e) => {
 const id = e.target.value;
 setRolePresetId(id);
 if (id === "custom") return;
 const p = TEAM_ROLE_PRESETS.find((x) => x.id === id);
 if (p) {
 setForm((f) => ({ ...f, roleEn: p.en, roleAr: p.ar }));
 }
 }}
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white"
 >
 {TEAM_ROLE_PRESETS.map((p) => (
 <option key={p.id} value={p.id}>
 {p.en} — {p.ar}
 </option>
 ))}
 <option value="custom">Custom…</option>
 </select>
 </label>
 {rolePresetId === "custom" ? (
 <>
 <input
 placeholder="Role EN"
 value={form.roleEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, roleEn: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <input
 placeholder="Role AR"
 value={form.roleAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, roleAr: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </>
 ) : null}
 <input
 placeholder="Avatar (1–2 chars, About page circle)"
 value={form.avatar}
 maxLength={2}
 onChange={(e) =>
 setForm((f) => ({ ...f, avatar: e.target.value }))
 }
 className="rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Profile photo (optional)</span>
 <input
 type="file"
 accept="image/jpeg,image/png,image/webp,image/gif"
 disabled={uploadingPhoto}
 onChange={(e) => {
 const file = e.target.files?.[0];
 e.target.value = "";
 if (!file) return;
 void (async () => {
 setUploadingPhoto(true);
 try {
 const fd = new FormData();
 fd.append("photo", file);
 const data = await adminFetch<{
 photoUrl: string;
 photoPublicId?: string;
 }>("/team/upload", { method: "POST", body: fd });
 setForm((f) => ({
 ...f,
 photoUrl: data.photoUrl,
 photoPublicId: String(data.photoPublicId ?? ""),
 }));
 } catch (err) {
 alert(
 err instanceof Error ? err.message : "Upload failed"
 );
 } finally {
 setUploadingPhoto(false);
 }
 })();
 }}
 className="block w-full text-xs text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-slate-700 file:px-2 file:py-1 file:text-white"
 />
 {form.photoUrl ? (
 <div className="mt-2 flex items-center gap-3">
 {/* eslint-disable-next-line @next/next/no-img-element -- preview from API /uploads */}
 <img
 src={teamPhotoPreviewSrc(form.photoUrl)}
 alt=""
 className="h-16 w-16 rounded-full border border-slate-600 object-cover"
 />
 <button
 type="button"
 onClick={() =>
 setForm((f) => ({ ...f, photoUrl: "", photoPublicId: "" }))
 }
 className="text-xs text-red-400 hover:underline"
 >
 Remove photo
 </button>
 </div>
 ) : null}
 {uploadingPhoto ? (
 <p className="mt-1 text-xs text-slate-500">Uploading…</p>
 ) : null}
 <p className="mt-1 text-[11px] text-slate-600">
 Max 2MB. Production: set NEXT_PUBLIC_API_ORIGIN to your API URL (no /api) if preview breaks.
 </p>
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Card gradient (About)</span>
 <select
 value={form.color}
 onChange={(e) =>
 setForm((f) => ({ ...f, color: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white"
 >
 {TEAM_CARD_GRADIENTS.map((g) => (
 <option key={g.value} value={g.value}>
 {g.label}
 </option>
 ))}
 </select>
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Stars header strip (home)</span>
 <select
 value={form.headerColor}
 onChange={(e) =>
 setForm((f) => ({ ...f, headerColor: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white"
 >
 {TEAM_STAR_HEADER_COLORS.map((h) => (
 <option key={h.value} value={h.value}>
 {h.label}
 </option>
 ))}
 </select>
 </label>
 <div className="grid grid-cols-2 gap-2">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Sort order</span>
 <input
 type="number"
 value={form.order}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 order: Math.floor(Number(e.target.value) || 0),
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Rating (0–5)</span>
 <input
 type="number"
 min={0}
 max={5}
 step={0.1}
 value={form.rating}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 rating: Math.min(5, Math.max(0, Number(e.target.value) || 0)),
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 </div>
 <div className="grid grid-cols-2 gap-2">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Review count</span>
 <input
 type="number"
 min={0}
 value={form.reviews}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 reviews: Math.max(0, Math.floor(Number(e.target.value) || 0)),
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Years experience</span>
 <input
 type="number"
 min={0}
 value={form.experienceYears}
 onChange={(e) =>
 setForm((f) => ({
 ...f,
 experienceYears: Math.max(
 0,
 Math.floor(Number(e.target.value) || 0)
 ),
 }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 </div>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Skills EN (comma-separated)</span>
 <input
 value={form.skillsEnCsv}
 onChange={(e) =>
 setForm((f) => ({ ...f, skillsEnCsv: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Skills AR (comma-separated)</span>
 <input
 value={form.skillsArCsv}
 onChange={(e) =>
 setForm((f) => ({ ...f, skillsArCsv: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <div className="grid grid-cols-2 gap-2">
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Location EN</span>
 <input
 value={form.locationEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, locationEn: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Location AR</span>
 <input
 value={form.locationAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, locationAr: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 </div>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Flag (emoji)</span>
 <input
 value={form.flag}
 maxLength={16}
 onChange={(e) =>
 setForm((f) => ({ ...f, flag: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Bio EN (home stars card)</span>
 <textarea
 rows={3}
 value={form.bioEn}
 onChange={(e) =>
 setForm((f) => ({ ...f, bioEn: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">Bio AR</span>
 <textarea
 rows={3}
 value={form.bioAr}
 onChange={(e) =>
 setForm((f) => ({ ...f, bioAr: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 <label className="block text-slate-400">
 <span className="mb-1 block text-xs">LinkedIn URL</span>
 <input
 placeholder="https://…"
 value={form.linkedin}
 onChange={(e) =>
 setForm((f) => ({ ...f, linkedin: e.target.value }))
 }
 className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1"
 />
 </label>
 </div>
 <div className="mt-6 flex justify-end gap-2">
 <button type="button" onClick={onClose} className="rounded-lg border border-slate-600 px-4 py-2 text-sm">
 Cancel
 </button>
 <button
 type="button"
 onClick={() => save().catch(console.error)}
 className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
 >
 Save
 </button>
 </div>
 </div>
 </div>
 );
}

/* ═══════════════════════════════════════════════════════════
 * BLOG FORM MODAL
 * ═══════════════════════════════════════════════════════════ */
const defaultBlogForm = { slug: "", titleEn: "", titleAr: "", excerptEn: "", excerptAr: "", bodyEn: "", bodyAr: "", category: "general", tags: "", coverImage: "", authorName: "", isPublished: false, metaTitleEn: "", metaTitleAr: "", metaDescEn: "", metaDescAr: "", targetRegions: "", relatedCourses: "" };

function BlogFormModal({ mode, blogSlug, onClose, onSaved }: { mode: "create" | "edit"; blogSlug?: string; onClose: () => void; onSaved: () => Promise<void> }) {
 const [loading, setLoading] = useState(mode === "edit");
 const [saveErr, setSaveErr] = useState("");
 const [form, setForm] = useState(defaultBlogForm);
 useEffect(() => {
 if (mode !== "edit" || !blogSlug) { setLoading(false); return; }
 let c = false;
 (async () => {
 try {
 const d = await adminFetch<Record<string, unknown>>(`/blog/admin/${blogSlug}`);
 if (c) return;
 const t = (d.title as { en?: string; ar?: string }) ?? {};
 const ex = (d.excerpt as { en?: string; ar?: string }) ?? {};
 const b = (d.body as { en?: string; ar?: string }) ?? {};
 const mt = (d.metaTitle as { en?: string; ar?: string }) ?? {};
 const md = (d.metaDescription as { en?: string; ar?: string }) ?? {};
 setForm({ slug: String(d.slug ?? ""), titleEn: t.en ?? "", titleAr: t.ar ?? "", excerptEn: ex.en ?? "", excerptAr: ex.ar ?? "", bodyEn: b.en ?? "", bodyAr: b.ar ?? "", category: String(d.category ?? "general"), tags: Array.isArray(d.tags) ? d.tags.join(", ") : "", coverImage: String(d.coverImage ?? ""), authorName: ((d.author as { name?: string })?.name) ?? "", isPublished: Boolean(d.isPublished), metaTitleEn: mt.en ?? "", metaTitleAr: mt.ar ?? "", metaDescEn: md.en ?? "", metaDescAr: md.ar ?? "", targetRegions: Array.isArray(d.targetRegions) ? d.targetRegions.join(", ") : "", relatedCourses: Array.isArray(d.relatedCourses) ? d.relatedCourses.join(", ") : "" });
 } catch (e) { if (!c) setSaveErr(e instanceof Error ? e.message : "Load failed"); }
 finally { if (!c) setLoading(false); }
 })();
 return () => { c = true; };
 }, [mode, blogSlug]);
 const save = async () => {
 setSaveErr("");
 const payload: Record<string, unknown> = { slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"), title: { en: form.titleEn, ar: form.titleAr }, excerpt: { en: form.excerptEn, ar: form.excerptAr }, body: { en: form.bodyEn, ar: form.bodyAr }, category: form.category, tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean), coverImage: form.coverImage, author: { name: form.authorName }, isPublished: form.isPublished, metaTitle: { en: form.metaTitleEn, ar: form.metaTitleAr }, metaDescription: { en: form.metaDescEn, ar: form.metaDescAr }, targetRegions: form.targetRegions.split(",").map((s) => s.trim()).filter(Boolean), relatedCourses: form.relatedCourses.split(",").map((s) => s.trim()).filter(Boolean) };
 try { if (mode === "create") await adminFetch("/blog", { method: "POST", body: JSON.stringify(payload) }); else await adminFetch(`/blog/${blogSlug}`, { method: "PUT", body: JSON.stringify(payload) }); await onSaved(); } catch (e) { setSaveErr(e instanceof Error ? e.message : "Save failed"); }
 };
 const inp = "w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm";
 const lbl = "block text-slate-400 text-xs mb-1";
 if (loading) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"><p className="text-white">Loading…</p></div>;
 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
 <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-xl">
 <h2 className="mb-4 text-lg font-semibold text-white">{mode === "create" ? "Create Blog Post" : "Edit Blog Post"}</h2>
 {saveErr && <p className="mb-3 rounded bg-red-900/30 p-2 text-xs text-red-400">{saveErr}</p>}
 <div className="grid gap-3 sm:grid-cols-2">
 <label className="block"><span className={lbl}>Slug *</span><input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Author name *</span><input value={form.authorName} onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Title (EN) *</span><input value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Title (AR) *</span><input dir="rtl" value={form.titleAr} onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Excerpt (EN) *</span><input value={form.excerptEn} onChange={(e) => setForm((f) => ({ ...f, excerptEn: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Excerpt (AR) *</span><input dir="rtl" value={form.excerptAr} onChange={(e) => setForm((f) => ({ ...f, excerptAr: e.target.value }))} className={inp} /></label>
 <label className="sm:col-span-2"><span className={lbl}>Body (EN) * — supports markdown</span><textarea rows={6} value={form.bodyEn} onChange={(e) => setForm((f) => ({ ...f, bodyEn: e.target.value }))} className={`${inp} resize-y`} /></label>
 <label className="sm:col-span-2"><span className={lbl}>Body (AR) *</span><textarea dir="rtl" rows={6} value={form.bodyAr} onChange={(e) => setForm((f) => ({ ...f, bodyAr: e.target.value }))} className={`${inp} resize-y`} /></label>
 <label className="block"><span className={lbl}>Category</span><select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inp}>{["general","coding","robotics","arabic","parenting","stem"].map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
 <label className="block"><span className={lbl}>Tags (comma-separated)</span><input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Cover image URL</span><input value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Related courses (slugs)</span><input value={form.relatedCourses} onChange={(e) => setForm((f) => ({ ...f, relatedCourses: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Meta Title (EN)</span><input value={form.metaTitleEn} onChange={(e) => setForm((f) => ({ ...f, metaTitleEn: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Meta Title (AR)</span><input dir="rtl" value={form.metaTitleAr} onChange={(e) => setForm((f) => ({ ...f, metaTitleAr: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Meta Desc (EN)</span><input value={form.metaDescEn} onChange={(e) => setForm((f) => ({ ...f, metaDescEn: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Meta Desc (AR)</span><input dir="rtl" value={form.metaDescAr} onChange={(e) => setForm((f) => ({ ...f, metaDescAr: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Target regions</span><input value={form.targetRegions} onChange={(e) => setForm((f) => ({ ...f, targetRegions: e.target.value }))} className={inp} /></label>
 <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />Published</label>
 </div>
 <div className="mt-6 flex justify-end gap-2">
 <button type="button" onClick={onClose} className="rounded-lg border border-slate-600 px-4 py-2 text-sm">Cancel</button>
 <button type="button" onClick={() => save().catch(console.error)} className="rounded-lg bg-primary px-4 py-2 text-sm text-white">Save</button>
 </div>
 </div>
 </div>
 );
}

/* ═══════════════════════════════════════════════════════════
 * CAREER FORM MODAL
 * ═══════════════════════════════════════════════════════════ */
const defaultCareerForm = { titleEn: "", titleAr: "", descEn: "", descAr: "", reqEn: "", reqAr: "", department: "other", location: "Remote", employmentType: "full-time", experienceLevel: "mid", skills: "", isActive: true, applicationEmail: "", applicationUrl: "" };

function CareerFormModal({ mode, careerId, onClose, onSaved }: { mode: "create" | "edit"; careerId?: string; onClose: () => void; onSaved: () => Promise<void> }) {
 const [loading, setLoading] = useState(mode === "edit");
 const [saveErr, setSaveErr] = useState("");
 const [form, setForm] = useState(defaultCareerForm);
 useEffect(() => {
 if (mode !== "edit" || !careerId) { setLoading(false); return; }
 let c = false;
 (async () => {
 try {
 const d = await adminFetch<Record<string, unknown>>(`/careers/admin/${careerId}`);
 if (c) return;
 const t = (d.title as { en?: string; ar?: string }) ?? {};
 const desc = (d.description as { en?: string; ar?: string }) ?? {};
 const req = (d.requirements as { en?: string; ar?: string }) ?? {};
 setForm({ titleEn: t.en ?? "", titleAr: t.ar ?? "", descEn: desc.en ?? "", descAr: desc.ar ?? "", reqEn: req.en ?? "", reqAr: req.ar ?? "", department: String(d.department ?? "other"), location: String(d.location ?? "Remote"), employmentType: String(d.employmentType ?? "full-time"), experienceLevel: String(d.experienceLevel ?? "mid"), skills: Array.isArray(d.skills) ? d.skills.join(", ") : "", isActive: d.isActive !== false, applicationEmail: String(d.applicationEmail ?? ""), applicationUrl: String(d.applicationUrl ?? "") });
 } catch (e) { if (!c) setSaveErr(e instanceof Error ? e.message : "Load failed"); }
 finally { if (!c) setLoading(false); }
 })();
 return () => { c = true; };
 }, [mode, careerId]);
 const save = async () => {
 setSaveErr("");
 const payload: Record<string, unknown> = { title: { en: form.titleEn, ar: form.titleAr }, description: { en: form.descEn, ar: form.descAr }, requirements: { en: form.reqEn, ar: form.reqAr }, department: form.department, location: form.location, employmentType: form.employmentType, experienceLevel: form.experienceLevel, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean), isActive: form.isActive, applicationEmail: form.applicationEmail, applicationUrl: form.applicationUrl };
 try { if (mode === "create") await adminFetch("/careers", { method: "POST", body: JSON.stringify(payload) }); else await adminFetch(`/careers/${careerId}`, { method: "PATCH", body: JSON.stringify(payload) }); await onSaved(); } catch (e) { setSaveErr(e instanceof Error ? e.message : "Save failed"); }
 };
 const inp = "w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm";
 const lbl = "block text-slate-400 text-xs mb-1";
 if (loading) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"><p className="text-white">Loading…</p></div>;
 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
 <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-xl">
 <h2 className="mb-4 text-lg font-semibold text-white">{mode === "create" ? "Create Career Position" : "Edit Career Position"}</h2>
 {saveErr && <p className="mb-3 rounded bg-red-900/30 p-2 text-xs text-red-400">{saveErr}</p>}
 <div className="grid gap-3 sm:grid-cols-2">
 <label className="block"><span className={lbl}>Title (EN) *</span><input value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Title (AR) *</span><input dir="rtl" value={form.titleAr} onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))} className={inp} /></label>
 <label className="sm:col-span-2"><span className={lbl}>Description (EN) *</span><textarea rows={4} value={form.descEn} onChange={(e) => setForm((f) => ({ ...f, descEn: e.target.value }))} className={`${inp} resize-y`} /></label>
 <label className="sm:col-span-2"><span className={lbl}>Description (AR) *</span><textarea dir="rtl" rows={4} value={form.descAr} onChange={(e) => setForm((f) => ({ ...f, descAr: e.target.value }))} className={`${inp} resize-y`} /></label>
 <label className="sm:col-span-2"><span className={lbl}>Requirements (EN)</span><textarea rows={3} value={form.reqEn} onChange={(e) => setForm((f) => ({ ...f, reqEn: e.target.value }))} className={`${inp} resize-y`} /></label>
 <label className="sm:col-span-2"><span className={lbl}>Requirements (AR)</span><textarea dir="rtl" rows={3} value={form.reqAr} onChange={(e) => setForm((f) => ({ ...f, reqAr: e.target.value }))} className={`${inp} resize-y`} /></label>
 <label className="block"><span className={lbl}>Department</span><select value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} className={inp}>{["engineering","education","design","marketing","operations","support","other"].map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}</select></label>
 <label className="block"><span className={lbl}>Location</span><input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Employment Type</span><select value={form.employmentType} onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))} className={inp}>{["full-time","part-time","contract","internship","freelance"].map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
 <label className="block"><span className={lbl}>Experience Level</span><select value={form.experienceLevel} onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))} className={inp}>{["entry","mid","senior","lead"].map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}</select></label>
 <label className="block"><span className={lbl}>Skills (comma-separated)</span><input value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Application Email</span><input type="email" value={form.applicationEmail} onChange={(e) => setForm((f) => ({ ...f, applicationEmail: e.target.value }))} className={inp} /></label>
 <label className="block"><span className={lbl}>Application URL</span><input value={form.applicationUrl} onChange={(e) => setForm((f) => ({ ...f, applicationUrl: e.target.value }))} className={inp} /></label>
 <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />Active</label>
 </div>
 <div className="mt-6 flex justify-end gap-2">
 <button type="button" onClick={onClose} className="rounded-lg border border-slate-600 px-4 py-2 text-sm">Cancel</button>
 <button type="button" onClick={() => save().catch(console.error)} className="rounded-lg bg-primary px-4 py-2 text-sm text-white">Save</button>
 </div>
 </div>
 </div>
 );
}
