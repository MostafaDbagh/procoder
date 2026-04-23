"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "./AnimatedSection";
import { sendContactMessage } from "@/lib/api";
import { Mail, CheckCircle2 } from "lucide-react";

interface NewsletterProps {
  variant?: "banner" | "footer";
}

export function Newsletter({ variant = "banner" }: NewsletterProps) {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      await sendContactMessage({
        name: "Newsletter",
        email,
        phone: "",
        subject: "Newsletter Subscription",
        message: `Newsletter signup: ${email}`,
      } as never);
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "footer") {
    return (
      <div>
        <p className="font-semibold text-sm mb-1">{t("footerTitle")}</p>
        <p className="text-muted text-xs mb-3">{t("footerSubtitle")}</p>
        {done ? (
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            {t("success")}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shrink-0 hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? "..." : t("subscribe")}
            </button>
          </form>
        )}
        <p className="text-muted text-xs mt-2">{t("privacy")}</p>
      </div>
    );
  }

  return (
    <AnimatedSection>
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 sm:p-14 text-center">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t("title")}</h2>
              <p className="text-muted text-base max-w-md mx-auto mb-8">{t("subtitle")}</p>
              {done ? (
                <div className="flex items-center justify-center gap-2 text-emerald-500 font-semibold text-lg">
                  <CheckCircle2 className="w-6 h-6" />
                  {t("success")}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    className="flex-1 px-5 py-3.5 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3.5 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60 whitespace-nowrap"
                  >
                    {loading ? t("subscribing") : t("subscribe")}
                  </button>
                </form>
              )}
              <p className="text-muted text-xs mt-4">{t("privacy")}</p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
