import type { Metadata } from "next";
import AdminLoginClient from "./AdminLoginClient";

export const metadata: Metadata = {
 title: "Admin Login | StemTechLab",
 robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
 searchParams,
}: {
 searchParams?: Promise<{ idle?: string }>;
}) {
 const sp = (await searchParams) ?? {};
 const idleSignOut = sp.idle === "1";
 return <AdminLoginClient idleSignOut={idleSignOut} />;
}
