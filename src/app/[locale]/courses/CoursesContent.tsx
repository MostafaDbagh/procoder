import { getCoursesISR } from "@/lib/server-api";
import { CoursesClient } from "./CoursesClient";

export default async function CoursesContent() {
  const courses = await getCoursesISR();
  return <CoursesClient initialCourses={courses} />;
}
