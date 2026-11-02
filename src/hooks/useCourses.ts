import { useQuery } from "@tanstack/react-query";
import { fetchCourses, fetchCourse, type APICourse } from "@/lib/api";

export function useCourses(initialData?: APICourse[]) {
 const query = useQuery<APICourse[]>({
 queryKey: ["courses"],
 queryFn: () => fetchCourses(),
 initialData,
 enabled: initialData === undefined,
 staleTime: 60 * 1000,
 });
 // Server-rendered public content is authoritative, including a fresh empty array.
 // A new navigation snapshot must not be replaced by an older persistent query.
 return { ...query, data: initialData ?? query.data, isLoading: initialData === undefined && query.isLoading };
}

export function useCourse(slug: string, initialData?: APICourse) {
 const query = useQuery<APICourse>({
 queryKey: ["course", slug],
 queryFn: () => fetchCourse(slug),
 enabled: !!slug && initialData === undefined,
 initialData,
 staleTime: 60 * 1000,
 });
 // Server-rendered public content is authoritative, including a fresh empty array.
 // A new navigation snapshot must not be replaced by an older persistent query.
 return { ...query, data: initialData ?? query.data, isLoading: initialData === undefined && query.isLoading };
}
