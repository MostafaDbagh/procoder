import { useQuery } from "@tanstack/react-query";
import { fetchCourses, fetchCourse, type APICourse } from "@/lib/api";

export function useCourses(initialData?: APICourse[]) {
 return useQuery<APICourse[]>({
 queryKey: ["courses"],
 queryFn: () => fetchCourses(),
 initialData,
 staleTime: 5 * 60 * 1000, // 5 min — matches ISR revalidate
 });
}

export function useCourse(slug: string, initialData?: APICourse) {
 return useQuery<APICourse>({
 queryKey: ["course", slug],
 queryFn: () => fetchCourse(slug),
 enabled: !!slug,
 initialData,
 staleTime: 5 * 60 * 1000,
 });
}
