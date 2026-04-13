"use client";

import { useState, useEffect, startTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LocalizedLink } from "@/components/LocalizedLink";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the drawer after navigation — not in the Link onClick. Closing on the same
  // click unmounts the menu before the transition runs, which can cancel navigation
  // and leave you on the previous page.
  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false);
    });
  }, [pathname, locale]);

  const links = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
    { href: "/recommend", label: t("recommend") },
    { href: "/challenge", label: t("challenge") },
    { href: "/parents", label: t("parents") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-surface/80 border-b border-border">
      <nav className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <LocalizedLink href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
              ProCoder
            </span>
          </LocalizedLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <LocalizedLink
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {link.label}
                </LocalizedLink>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LocalizedLink
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:scale-[1.02] transition-all md:me-5"
            >
              {t("bookDemo")}
            </LocalizedLink>

            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              aria-label={t("language")}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{t("language")}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              aria-label={t("menu")}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 space-y-1">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <LocalizedLink
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "text-primary bg-primary/10"
                          : "text-muted hover:text-foreground hover:bg-surface-hover"
                      }`}
                    >
                      {link.label}
                    </LocalizedLink>
                  );
                })}
                <LocalizedLink
                  href="/contact"
                  className="block mx-4 mt-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold text-center shadow-md"
                >
                  {t("bookDemo")}
                </LocalizedLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
