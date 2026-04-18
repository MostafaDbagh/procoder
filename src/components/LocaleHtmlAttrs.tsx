"use client";

import { useLocale } from "next-intl";
import { useLayoutEffect } from "react";

/**
 * Keeps <html lang> and <html dir> in sync with the active locale on every navigation.
 * next/script does not re-run on client locale changes, which left RTL stuck until a full refresh.
 */
export function LocaleHtmlAttrs() {
 const locale = useLocale();

 useLayoutEffect(() => {
 document.documentElement.lang = locale;
 document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
 }, [locale]);

 return null;
}
