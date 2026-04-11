import type { ReactNode } from "react";

/** Same shell as the main site (`bg-background`); admin dashboard wraps itself in a dark panel. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {children}
    </div>
  );
}
