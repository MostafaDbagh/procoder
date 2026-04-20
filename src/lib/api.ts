/**
 * Base URL for Express: must be the `/api` prefix (e.g. `/api` or `http://localhost:5000/api`).
 * If NEXT_PUBLIC_API_URL is set to an origin only (e.g. `http://localhost:3000`), `/api` is appended * so requests hit `/api/recommend`, not `/recommend` (which would 404 as an HTML page).
 */
export function apiRoot(): string {
 const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
 if (typeof window !== "undefined") {
 if (!raw) return "/api";
 try {
 const base = raw.replace(/\/$/, "");
 const withApi = base.endsWith("/api") ? base : `${base}/api`;
 const absolute =
 withApi.startsWith("http://") || withApi.startsWith("https://")
 ? withApi
 : `http://${withApi.replace(/^\/+/, "")}`;
 const u = new URL(absolute);
 const port = u.port || (u.protocol === "https:" ? "443" : "80");
 const isLoopback =
 u.hostname === "localhost" ||
 u.hostname === "127.0.0.1" ||
 u.hostname === "[::1]";
 // Hitting Express on :5000 from the browser skips the Next proxy and often404s; use Route Handler at /api instead.
 if (isLoopback && port === "5000") {
 return "/api";
 }
 if (u.origin === window.location.origin) {
 return "/api";
 }
 return withApi;
 } catch {
 return "/api";
 }
 }
 if (raw) {
 const base = raw.replace(/\/$/, "");
 return base.endsWith("/api") ? base : `${base}/api`;
 }
 return "http://127.0.0.1:5000/api";
}

async function parseJsonResponse(res: Response): Promise<unknown> {
 const text = await res.text();
 const trimmed = text.trim();
 if (!trimmed) return null;
 if (trimmed.startsWith("<") || trimmed.startsWith("<!")) {
 throw new Error(
 "The server returned HTML instead of JSON. Start stem-Be on port 5000, restart stem-Fe (rm -rf .next && npm run dev), and call same-origin /api/recommend (do not point NEXT_PUBLIC_API_URL at this site unless it is a different API host)."
 );
 }
 try {
 return JSON.parse(trimmed);
 } catch {
 throw new Error(
 `Invalid JSON from API (${res.status}). Check NEXT_PUBLIC_API_URL and that stem-Be is running.`
 );
 }
}

async function request<T>(
 endpoint: string,
 options?: RequestInit
): Promise<T> {
 const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
 const res = await fetch(`${apiRoot()}${path}`, {
 headers: { "Content-Type": "application/json", ...options?.headers },
 ...options,
 });

 const data = (await parseJsonResponse(res)) as {
 message?: string;
 error?: string;
 } | null;

 if (!res.ok) {
 const msg =
 (data && typeof data === "object" && (data.message || data.error)) ||
 `Request failed: ${res.status}`;
 throw new Error(String(msg));
 }

 return data as T;
}

// --- Courses ---

export interface APICourse {
 _id: string;
 slug: string;
 category: string;
 ageMin: number;
 ageMax: number;
 level: string;
 lessons: number;
 durationWeeks: number;
 iconName: string;
 color: string;
 title: { en: string; ar: string };
 description: { en: string; ar: string };
 skills: { en: string[]; ar: string[] };
 price: number;
 currency: string;
 /** 0–100: percent off list `price` for display, quotes, and enrollments. */
 discountPercent?: number;
 isActive: boolean;
 enrollmentCount: number;
 /** Cover image (Cloudinary or `/uploads/courses/...`). */
 imageUrl?: string;
 imagePublicId?: string;
}

export function fetchCourses(params?: {
 category?: string;
 level?: string;
 ageMin?: number;
 ageMax?: number;
}): Promise<APICourse[]> {
 const query = new URLSearchParams();
 if (params?.category) query.set("category", params.category);
 if (params?.level) query.set("level", params.level);
 if (params?.ageMin) query.set("ageMin", String(params.ageMin));
 if (params?.ageMax) query.set("ageMax", String(params.ageMax));
 const qs = query.toString();
 return request<APICourse[]>(`/courses${qs ? `?${qs}` : ""}`);
}

export function fetchCourse(slug: string): Promise<APICourse> {
 return request<APICourse>(`/courses/${slug}`);
}

// --- Enrollments ---

export interface EnrollmentData {
 parentName: string;
 email: string;
 phone: string;
 relationship: string;
 childName: string;
 /** Optional: distinguishes siblings with the same name in the same course. */
 childStudentId?: string;
 childAge: number;
 childGender?: string;
 gradeLevel: string;
 schoolName?: string;
 previousExperience?: string;
 courseId: string;
 courseTitle?: string;
 preferredDays: string[];
 preferredTime: string;
 timezone?: string;
 sessionFormat: string;
 startDate?: string;
 learningGoals?: string;
 specialNeeds?: string;
 howDidYouHear?: string;
 agreeTerms: boolean;
 agreePhotos?: boolean;
 /** Optional promo; validated server-side against course and limits. */
 promoCode?: string;
}

export interface PromoQuoteResponse {
 courseId: string;
 currency: string;
 listPrice: number;
 courseDiscountPercent: number;
 priceAfterCourseDiscount: number;
 firstTimeParentDiscountPercent: number;
 firstTimeParentDiscountAmount: number;
 priceAfterFirstTimeDiscount: number;
 promoCode: string | null;
 promoError: string | null;
 promoApplied: {
 code: string;
 discountType: string;
 discountValue: number;
 } | null;
 promoDiscountAmount: number;
 amountDue: number;
}

export function quotePromo(
 courseId: string,
 promoCode?: string,
 parentEmail?: string
): Promise<PromoQuoteResponse> {
 const email = parentEmail?.trim();
 return request<PromoQuoteResponse>("/promos/quote", {
 method: "POST",
 body: JSON.stringify({
 courseId,
 ...(promoCode?.trim() ? { promoCode: promoCode.trim() } : {}),
 ...(email ? { parentEmail: email } : {}),
 }),
 });
}

export interface EnrollmentPricingSnapshot {
 listPrice: number;
 currency: string;
 courseDiscountPercent: number;
 priceAfterCourseDiscount: number;
 firstTimeParentDiscountPercent?: number;
 firstTimeParentDiscountAmount?: number;
 priceAfterFirstTimeDiscount?: number;
 promoCodeApplied: string | null;
 promoDiscountAmount: number;
 amountDue: number;
}

export function createEnrollment(
 data: EnrollmentData
): Promise<{
 message: string;
 enrollment: { id: string; status: string };
 pricing?: EnrollmentPricingSnapshot;
}> {
 const { promoCode, ...rest } = data;
 return request("/enrollments", {
 method: "POST",
 body: JSON.stringify({
 ...rest,
 agreeTerms: String(data.agreeTerms),
 ...(promoCode?.trim() ? { promoCode: promoCode.trim() } : {}),
 }),
 });
}

// --- Contact ---

export interface ContactData {
 name: string;
 email: string;
 subject: string;
 message: string;
}

export function sendContactMessage(
 data: ContactData
): Promise<{ message: string; id: string }> {
 return request("/contact", {
 method: "POST",
 body: JSON.stringify(data),
 });
}

// --- Admin Auth ---

export interface LoginResponse {
 token: string;
 user: { id: string; name: string; email: string; role: string };
}

export function adminLogin(
 email: string,
 password: string
): Promise<LoginResponse> {
 return request("/auth/login", {
 method: "POST",
 body: JSON.stringify({ email, password }),
 });
}

// --- AI Recommendation ---

export interface RecommendResponse {
 ids: string[];
 message: string;
}

export function getAIRecommendation(
 message: string,
 locale: string,
 init?: Pick<RequestInit, "signal">
): Promise<RecommendResponse> {
 return request<RecommendResponse>("/recommend", {
 method: "POST",
 body: JSON.stringify({ message, locale }),
 signal: init?.signal,
 });
}

// --- Admin Courses ---

export interface CreateCourseData {
 slug: string;
 category: string;
 ageMin: number;
 ageMax: number;
 level: string;
 lessons: number;
 durationWeeks: number;
 iconName: string;
 color: string;
 title: { en: string; ar: string };
 description: { en: string; ar: string };
 skills: { en: string[]; ar: string[] };
 price: number;
 currency: string;
 /** 0–100 catalog discount (optional). */
 discountPercent?: number;
 imageUrl?: string;
 imagePublicId?: string;
}

function authRequest<T>(
 endpoint: string,
 token: string,
 options?: RequestInit
): Promise<T> {
 return request<T>(endpoint, {
 ...options,
 headers: {
 ...options?.headers,
 Authorization: `Bearer ${token}`,
 },
 });
}

export function createCourse(
 data: CreateCourseData,
 token: string
): Promise<APICourse> {
 return authRequest<APICourse>("/courses", token, {
 method: "POST",
 body: JSON.stringify(data),
 });
}

// --- Parent Dashboard ---

export interface ParentChild {
 name: string;
 age: number;
 gender?: string;
 gradeLevel?: string;
 interests?: string[];
}

export interface ParentProfile {
 id: string;
 name: string;
 email: string;
 phone?: string;
 role: string;
 children: ParentChild[];
 createdAt: string;
}

export interface EnrollmentWithCourse {
 _id: string;
 parentName: string;
 email: string;
 phone: string;
 childName: string;
 /** Disambiguates siblings with the same display name (from enrollment form). */
 childStudentId?: string;
 childAge: number;
 gradeLevel?: string;
 courseId: string;
 courseTitle?: string;
 status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
 preferredDays: string[];
 preferredTime: string;
 sessionFormat: string;
 createdAt: string;
 course: {
 slug: string;
 title: { en: string; ar: string };
 description: { en: string; ar: string };
 category: string;
 level: string;
 lessons: number;
 durationWeeks: number;
 iconName: string;
 color: string;
 } | null;
}

export interface DashboardStats {
 coursesEnrolled: number;
 activeCourses: number;
 completedCourses: number;
 totalLessons: number;
 hoursLearned: number;
 badges: number;
 streak: number;
}

export interface InstructorNote {
 _id: string;
 instructor: string;
 instructorName: string;
 enrollment: string;
 courseId: string;
 childName: string;
 parentEmail: string;
 type: "progress" | "feedback" | "absence" | "achievement" | "general";
 title: string;
 body: string;
 readByParent: boolean;
 createdAt: string;
}

export interface ParentDashboardData {
 profile: ParentProfile;
 stats: DashboardStats;
 enrollments: EnrollmentWithCourse[];
 notes: InstructorNote[];
 unreadNotes: number;
 recommended: APICourse[];
}

export function fetchParentDashboard(token: string): Promise<ParentDashboardData> {
 return authRequest<ParentDashboardData>("/parent/dashboard", token);
}

export interface ParentReferralInfo {
 code: string;
 discountPercent: number;
 totalReferred: number;
 totalRevenueSaved?: number;
 referrals?: unknown[];
 isActive?: boolean;
}

/** Same-origin `/api` as other parent calls — avoids broken NEXT_PUBLIC_API_URL defaults. */
export function fetchParentReferral(token: string): Promise<ParentReferralInfo> {
 return authRequest<ParentReferralInfo>("/referrals/my", token);
}

export function updateParentChildren(
 token: string,
 children: ParentChild[]
): Promise<{ children: ParentChild[] }> {
 return authRequest<{ children: ParentChild[] }>("/parent/children", token, {
 method: "PUT",
 body: JSON.stringify({ children }),
 });
}

export function updateParentProfile(
 token: string,
 data: { name?: string; phone?: string }
): Promise<ParentProfile> {
 return authRequest<ParentProfile>("/parent/profile", token, {
 method: "PUT",
 body: JSON.stringify(data),
 });
}

// --- Instructor Dashboard ---

export interface InstructorStudent {
 enrollmentId: string;
 childName: string;
 childAge: number;
 parentName: string;
 parentEmail: string;
 phone: string;
 courseId: string;
 courseTitle?: string;
 status: string;
 preferredDays: string[];
 preferredTime: string;
 sessionFormat: string;
 learningGoals?: string;
 specialNeeds?: string;
 createdAt: string;
}

export interface InstructorDashboardData {
 profile: {
 id: string;
 name: string;
 email: string;
 specialties: string[];
 bio: string;
 assignedCourses: string[];
 };
 courses: {
 slug: string;
 title: { en: string; ar: string };
 category: string;
 level: string;
 lessons: number;
 color: string;
 }[];
 students: InstructorStudent[];
 recentNotes: InstructorNote[];
 stats: {
 totalStudents: number;
 activeStudents: number;
 pendingStudents: number;
 totalCourses: number;
 notesWritten: number;
 };
}

export function fetchInstructorDashboard(token: string): Promise<InstructorDashboardData> {
 return authRequest<InstructorDashboardData>("/instructor/dashboard", token);
}

export function createInstructorNote(
 token: string,
 data: { enrollmentId: string; title: string; body: string; type?: string }
): Promise<InstructorNote> {
 return authRequest<InstructorNote>("/instructor/notes", token, {
 method: "POST",
 body: JSON.stringify(data),
 });
}

export function deleteInstructorNote(token: string, noteId: string): Promise<{ message: string }> {
 return authRequest<{ message: string }>(`/instructor/notes/${noteId}`, token, {
 method: "DELETE",
 });
}
