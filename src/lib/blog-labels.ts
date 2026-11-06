const arabic: Record<string, string> = {
 coding: "البرمجة", robotics: "الروبوتات", arabic: "العربية", parenting: "إرشادات للوالدين", stem: "العلوم والتقنية والهندسة والرياضيات", general: "عام", "parents-guide": "دليل الوالدين",
};
export function blogCategoryLabel(category: string, locale: string): string {
 return locale === "ar" ? (arabic[category] ?? "مقالات تعليمية") : category.replace(/-/g, " ");
}
export function readingTime(minutes: number, locale: string): string {
 const n = Math.max(1, Math.ceil(minutes));
 if (locale !== "ar") return `${n} min read`;
 if (n === 1) return "دقيقة قراءة";
 if (n === 2) return "دقيقتان للقراءة";
 return `${new Intl.NumberFormat("ar").format(n)} ${n % 100 >= 3 && n % 100 <= 10 ? "دقائق" : "دقيقة"} قراءة`;
}
