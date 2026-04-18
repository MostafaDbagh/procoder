import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SessionIdleGuard } from "@/components/SessionIdleGuard";
import { PRIVATE_APP_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
 robots: PRIVATE_APP_ROBOTS,
};

/** Same shell as the main site (`bg-background`); admin dashboard wraps itself in a dark panel. */
export default function AdminLayout({ children }: { children: ReactNode }) {
 return (
 <div className="min-h-screen bg-background text-foreground antialiased">
 <SessionIdleGuard />
 {children}
 </div>
 );
}
