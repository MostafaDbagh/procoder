"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { X } from "lucide-react";

const STORAGE_KEY = "stl_cookie_consent";

export function CookieBanner() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isAr ? "إشعار ملفات تعريف الارتباط" : "Cookie consent"}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-surface border border-border rounded-2xl shadow-2xl shadow-black/10 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-1">
            {isAr ? "نستخدم ملفات تعريف الارتباط 🍪" : "We use cookies 🍪"}
          </p>
          <p className="text-xs text-muted leading-relaxed">
            {isAr
              ? "نستخدم ملفات تعريف الارتباط الأساسية لتشغيل الموقع وملفات تحليلية لتحسين تجربتك. لا نبيع بياناتك أبداً."
              : "We use essential cookies to keep the site running and analytics cookies to improve your experience. We never sell your data."}
            {" "}
            <LocalizedLink href="/privacy" className="underline underline-offset-2 text-primary hover:text-primary/80 transition-colors">
              {isAr ? "سياسة الخصوصية" : "Privacy policy"}
            </LocalizedLink>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground hover:border-foreground/30 transition-all"
          >
            {isAr ? "رفض" : "Decline"}
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
          >
            {isAr ? "قبول الكل" : "Accept all"}
          </button>
          <button
            onClick={accept}
            aria-label="Close"
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
