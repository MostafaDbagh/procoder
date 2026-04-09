"use client";

import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Sparkles, Mail } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const cats = useTranslations("categories");

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
                ProCoder
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

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} ProCoder. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
