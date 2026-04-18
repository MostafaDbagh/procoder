"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Sparkles, Mail, LayoutDashboard, GraduationCap, Shield } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const cats = useTranslations("categories");

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
                StemTechLab
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2.5">
              <li>
                <LocalizedLink href="/" className="text-sm text-muted hover:text-primary transition-colors">
                  {nav("home")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/courses" className="text-sm text-muted hover:text-primary transition-colors">
                  {nav("courses")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/recommend" className="text-sm text-muted hover:text-primary transition-colors">
                  {nav("recommend")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/challenge" className="text-sm text-muted hover:text-primary transition-colors">
                  {nav("challenge")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/blog" className="text-sm text-muted hover:text-primary transition-colors">
                  {nav("blog")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/about" className="text-sm text-muted hover:text-primary transition-colors">
                  {t("about")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/contact" className="text-sm text-muted hover:text-primary transition-colors">
                  {t("contact")}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">{t("categories")}</h3>
            <ul className="space-y-2.5">
              <li>
                <LocalizedLink href="/courses" className="text-sm text-muted hover:text-primary transition-colors">
                  {cats("programming")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/courses" className="text-sm text-muted hover:text-primary transition-colors">
                  {cats("robotics")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/courses" className="text-sm text-muted hover:text-primary transition-colors">
                  {cats("algorithms")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/courses" className="text-sm text-muted hover:text-primary transition-colors">
                  {cats("arabic")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/courses" className="text-sm text-muted hover:text-primary transition-colors">
                  {cats("quran")}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t("contact")}</h3>
            <div className="flex items-center gap-2 text-sm text-muted mb-4">
              <Mail className="w-4 h-4" />
              <span>{t("email")}</span>
            </div>
            <ul className="space-y-2.5">
              <li>
                <LocalizedLink href="/privacy" className="text-sm text-muted hover:text-primary transition-colors">
                  {t("privacy")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/terms" className="text-sm text-muted hover:text-primary transition-colors">
                  {t("terms")}
                </LocalizedLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <div className="rounded-2xl border border-border bg-background/60 dark:bg-background/30 px-4 py-6 sm:px-8 sm:py-7">
            <p className="text-center text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted mb-5">
              {t("memberAccess")}
            </p>
            <nav
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3"
              aria-label={t("memberAccess")}
            >
              <LocalizedLink
                href="/parent/login"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/45 hover:bg-primary/[0.06] hover:text-primary hover:shadow-md dark:hover:bg-primary/10 text-start"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                </span>
                <span>{t("parentDashboardLink")}</span>
              </LocalizedLink>
              <LocalizedLink
                href="/instructor/login"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-purple/45 hover:bg-purple/[0.06] hover:text-purple hover:shadow-md dark:hover:bg-purple/10 text-start"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple/10 text-purple transition-colors group-hover:bg-purple/15">
                  <GraduationCap className="h-4 w-4" aria-hidden />
                </span>
                <span>{t("instructorPortalLink")}</span>
              </LocalizedLink>
              <Link
                href="/admin/login"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-muted hover:bg-surface-hover hover:text-foreground hover:shadow-md"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/15 text-muted transition-colors group-hover:bg-muted/25 group-hover:text-foreground">
                  <Shield className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-start">{t("adminLoginLink")}</span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} StemTechLab. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
