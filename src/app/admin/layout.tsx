import type { ReactNode } from "react";
import { SessionIdleGuard } from "@/components/SessionIdleGuard";

/** Same shell as the main site (`bg-background`); admin dashboard wraps itself in a dark panel. */
export default function AdminLayout({ children }: { children: ReactNode }) {
 return (
 <div className="min-h-screen bg-background text-foreground antialiased">
 <SessionIdleGuard />
 {children}
 </div>
 );
}
