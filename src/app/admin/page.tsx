"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/lib/admin-api";

export default function AdminHomePage() {
  const router = useRouter();

  useEffect(() => {
    const t = getAdminToken();
    router.replace(t ? "/admin/dashboard" : "/admin/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-slate-400">
      Redirecting…
    </div>
  );
}
