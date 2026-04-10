import Link from "next/link";
import { Home, BookOpen, Shield } from "lucide-react";

/**
 * Fallback when `notFound()` runs outside `[locale]` (e.g. unknown `/admin/*` paths).
 * Locale routes use `src/app/[locale]/not-found.tsx` with Navbar/Footer.
 */
export default function GlobalNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-7xl sm:text-8xl font-black text-primary/15 select-none tabular-nums leading-none mb-4">
        404
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
        Page not found
      </h1>
      <p className="text-muted max-w-md mb-10 leading-relaxed">
        This page doesn’t exist or may have moved.
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
        <Link
          href="/en"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:opacity-95 transition-opacity"
        >
          <Home className="w-4 h-4" />
          English home
        </Link>
        <Link
          href="/ar"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
        >
          الرئيسية بالعربية
        </Link>
        <Link
          href="/en/courses"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Courses
        </Link>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-6 py-3.5 text-sm font-semibold text-muted-foreground hover:border-primary/40 transition-colors"
        >
          <Shield className="w-4 h-4" />
          Admin login
        </Link>
      </div>
    </div>
  );
}
