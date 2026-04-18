/**
 * StemTechLab authentication model (how the four “actors” relate to storage and routes)
 *
 * 1. Visitor — Not signed in. No member JWT in `localStorage`. Uses public marketing pages
 * under `/[locale]/…` (home, courses, contact, etc.).
 *
 * 2. Parent (and student accounts) — After register/login via `AuthModal`, the API returns a JWT
 * stored as `localStorage.token`. Payload includes `role`: `parent` | `student`.
 * Sign-in entry: `/[locale]/parent/login`. App shell: `/[locale]/dashboard`.
 * Auth API: POST `/api/auth/register` | `/api/auth/login`.
 *
 * 3. Instructor — Same `localStorage.token` as members, but JWT `role` is `instructor`.
 * Sign-in entry: `/[locale]/instructor/login`. App shell: `/[locale]/instructor`.
 * Same login endpoint as parents; accounts are created with instructor role (e.g. seeding / admin).
 *
 * 4. Admin — Separate credential flow: POST `/api/auth/admin-login` (email + username + password).
 * Token is stored as `localStorage.stemtechlab_admin_token` (see `admin-api.ts`), not `token`.
 * Primary UI: `/admin/login` → `/admin/dashboard` (not locale-prefixed).
 * If an admin also has a member JWT (rare), instructor APIs accept `admin` role; parent portal
 * is restricted to parent/student only (see backend + redirects below).
 */

export type MemberJwtRole = "parent" | "student" | "instructor" | "admin";

export function parseMemberJwtRole(token: string | null): MemberJwtRole | undefined {
 if (!token) return undefined;
 try {
 const part = token.split(".")[1];
 const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))) as { role?: string };
 const r = json.role;
 if (r === "parent" || r === "student" || r === "instructor" || r === "admin") return r;
 return undefined;
 } catch {
 return undefined;
 }
}

export function isParentPortalRole(role: MemberJwtRole | undefined): boolean {
 return role === "parent" || role === "student";
}

export function isInstructorPortalRole(role: MemberJwtRole | undefined): boolean {
 return role === "instructor" || role === "admin";
}
