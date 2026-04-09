const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
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
  isActive: boolean;
  enrollmentCount: number;
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
}

export function createEnrollment(
  data: EnrollmentData
): Promise<{ message: string; enrollment: { id: string; status: string } }> {
  return request("/enrollments", {
    method: "POST",
    body: JSON.stringify({ ...data, agreeTerms: String(data.agreeTerms) }),
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
