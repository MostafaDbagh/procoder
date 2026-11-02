import { Suspense } from "react";
import { ApiUnavailableError, getCoursesISR } from "@/lib/server-api";
import { CoursesClient } from "./CoursesClient";

export default async function CoursesContent() {
 const courses = await getCoursesISR();
 if (courses === null) throw new ApiUnavailableError("course catalog page");
 return (
 <Suspense
 fallback={
 <div className="py-24 text-center text-muted text-sm">Loading…</div>
 }
 >
 <CoursesClient initialCourses={courses} />
 </Suspense>
 );
}
