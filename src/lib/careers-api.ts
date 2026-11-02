import { ApiUnavailableError, serverApiRoot } from "./server-api";

export interface PublicCareer {
 _id: string;
 slug: string;
 title: { en: string; ar: string };
 description: { en: string; ar: string };
 requirements: { en: string; ar: string };
 department: string;
 location: string;
 employmentType: string;
 experienceLevel: string;
 skills: string[];
 applicationEmail: string;
 applicationUrl: string;
}

/** A failed inventory must not masquerade as a successful empty jobs page. */
export async function getPublicCareers(): Promise<PublicCareer[]> {
 try {
  const careers: PublicCareer[] = [];
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page++) {
   const response = await fetch(`${serverApiRoot()}/careers?limit=50&page=${page}`, {
    next: { revalidate: 300 }, signal: AbortSignal.timeout(8000),
   });
   if (!response.ok) throw new Error("Career inventory unavailable");
   const data = await response.json();
   if (!Array.isArray(data.items) || !Number.isInteger(data.totalPages) || data.totalPages < 1 || data.totalPages > 100 ||
       (page > 1 && data.totalPages !== totalPages) || (page < data.totalPages && data.items.length !== 50) ||
       (page > 1 && data.items.length === 0)) throw new Error("Incomplete career inventory");
   totalPages = data.totalPages;
   for (const career of data.items) {
    if (!career || typeof career._id !== "string" || !career.title || !career.description) throw new Error("Invalid career");
    careers.push(career);
   }
  }
  return careers;
 } catch (error) {
  throw new ApiUnavailableError("career inventory", error);
 }
}
