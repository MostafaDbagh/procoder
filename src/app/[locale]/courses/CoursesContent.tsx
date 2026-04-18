import { Suspense } from "react";
import { getCoursesSSR } from "@/lib/server-api";
import { CoursesClient } from "./CoursesClient";

export default async function CoursesContent() {
 const courses = await getCoursesSSR();
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
