import type { Metadata } from "next";
import AdminLoginClient from "./AdminLoginClient";
import { PRIVATE_APP_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
 title: "Admin Login | StemTechLab",
 robots: PRIVATE_APP_ROBOTS,
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
