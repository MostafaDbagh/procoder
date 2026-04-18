import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Home, BookOpen } from "lucide-react";

export default async function LocaleNotFound() {
 const t = await getTranslations("notFound");

 return (
 <div className="flex flex-col items-center justify-center py-20 sm:py-28 px-4 text-center">
 <p className="text-7xl sm:text-8xl font-black text-primary/15 select-none tabular-nums leading-none mb-4">
 404
 </p>
 <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
 {t("title")}
 </h1>
 <p className="text-muted max-w-md mb-10 leading-relaxed">
 {t("description")}
 </p>
 <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
 <Link
 href="/"
 className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:opacity-95 transition-opacity"
 >
 <Home className="w-4 h-4" />
 {t("home")}
 </Link>
 <Link
 href="/courses"
 className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
 >
 <BookOpen className="w-4 h-4" />
 {t("courses")}
 </Link>
 </div>
 </div>
 );
}
