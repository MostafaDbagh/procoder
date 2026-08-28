"use client";

import NextLink from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";
import { markInAppNavigation } from "@/lib/navHistory";

/** Build /[locale]/… URLs explicitly — avoids next-intl Link + Next 16 client nav edge cases. */
export function hrefWithLocale(path: string, locale: string): string {
 if (path === "/") return `/${locale}`;
 return `/${locale}${path}`;
}

export type LocalizedLinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
 href: string;
};

export function LocalizedLink({ href, onNavigate, ...props }: LocalizedLinkProps) {
 const locale = useLocale();
 return (
 <NextLink
 href={hrefWithLocale(href, locale)}
 {...props}
 onNavigate={(e) => {
 // onNavigate (not onClick) fires only on real same-origin client
 // navigations, so a later BackLink knows the previous history entry
 // is a page of ours — modifier-clicks opening new tabs are excluded.
 markInAppNavigation();
 onNavigate?.(e);
 }}
 />
 );
}
