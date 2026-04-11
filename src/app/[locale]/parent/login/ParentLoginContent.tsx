"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isInstructorPortalRole, isParentPortalRole } from "@/lib/auth-flow";
import { AuthModal } from "@/components/AuthModal";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Loader2, User } from "lucide-react";

export default function ParentLoginContent({ idleSignOut = false }: { idleSignOut?: boolean }) {
  const router = useRouter();
  const t = useTranslations("common");
  const { loading: authLoading, isAuthenticated, role } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (isParentPortalRole(role)) {
      router.replace("/dashboard");
      return;
    }
    if (isInstructorPortalRole(role)) {
      router.replace("/instructor");
    }
  }, [authLoading, isAuthenticated, role, router]);

  if (authLoading || (isAuthenticated && (isParentPortalRole(role) || isInstructorPortalRole(role)))) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <User className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-3 text-2xl font-bold">Parent sign-in</h1>
        {idleSignOut && (
          <p
            role="status"
            className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
          >
            {t("sessionIdleLogout")}
          </p>
        )}
        <p className="mb-6 text-muted">
          Sign in or create a parent account to open your dashboard.
        </p>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="mb-6 w-full rounded-2xl bg-primary px-8 py-3.5 font-semibold text-white shadow-md shadow-primary/10 transition-all hover:scale-[1.02] hover:shadow-lg sm:w-auto"
        >
          Sign in / Create account
        </button>
        <p className="text-sm text-muted">
          Instructor?{" "}
          <LocalizedLink href="/instructor/login" className="font-medium text-primary hover:underline">
            Go to instructor login
          </LocalizedLink>
        </p>
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => {
          setAuthOpen(false);
          if (typeof window !== "undefined" && localStorage.getItem("token")) {
            window.location.reload();
          }
        }}
        defaultTab="signup"
      />
    </div>
  );
}
