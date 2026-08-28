"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LocalizedLink } from "@/components/LocalizedLink";
import { canGoBackInApp } from "@/lib/navHistory";

/**
 * Returns to the page the visitor actually came from — the journey stage, the
 * catalogue, a search result on our own site — instead of always jumping to one
 * fixed route. Renders a real link to `fallbackHref` so it stays crawlable,
 * works in a new tab, and still does something sensible for visitors who landed
 * straight on this page.
 */
export function BackLink({
 fallbackHref,
 className,
 children,
}: {
 fallbackHref: string;
 className?: string;
 children: ReactNode;
}) {
 const router = useRouter();
 // Resolved after hydration: the server has no history to inspect.
 const [canGoBack, setCanGoBack] = useState(false);
 useEffect(() => {
 setCanGoBack(canGoBackInApp());
 }, []);

 return (
 <LocalizedLink
 href={fallbackHref}
 className={className}
 onNavigate={(e) => {
 // Only fires on same-origin client navigation, so modifier-clicks
 // that open a new tab keep the plain /courses href.
 if (!canGoBack) return;
 e.preventDefault();
 router.back();
 }}
 >
 {children}
 </LocalizedLink>
 );
}
