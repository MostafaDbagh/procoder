import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";
import { PRIVATE_APP_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
 title: "Admin Dashboard | StemTechLab",
 robots: PRIVATE_APP_ROBOTS,
};

export default function AdminDashboardPage() {
 return <AdminDashboard />;
}
