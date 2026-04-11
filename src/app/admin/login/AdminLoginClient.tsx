"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminLogin, setAdminToken } from "@/lib/admin-api";
import { Shield } from "lucide-react";
import { PasswordInput } from "@/components/PasswordInput";

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";

export default function AdminLoginClient({ idleSignOut = false }: { idleSignOut?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await adminLogin(email.trim(), username.trim(), password);
      setAdminToken(token);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 left-[10%] h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-[10%] bottom-10 h-80 w-80 rounded-full bg-purple/5 blur-3xl" />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:py-32">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-10 w-10 text-primary" aria-hidden />
            </div>
            <h1 className="mb-3 text-2xl font-bold text-foreground">Admin sign-in</h1>
            <p className="text-muted">
              Sign in with your admin email, username, and password.
            </p>
            {idleSignOut && (
              <p
                role="status"
                className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
              >
                You were signed out after 30 minutes of inactivity.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-xl">
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputCls}
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Password <span className="text-red-500">*</span>
                </label>
                <PasswordInput
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  inputClassName={inputCls}
                />
              </div>

              {error ? (
                <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/10 transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-70"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            <Link href="/en" className="font-medium text-primary hover:underline">
              Back to site
            </Link>
            {" · "}
            <Link href="/ar" className="font-medium text-primary hover:underline">
              العودة للموقع
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
