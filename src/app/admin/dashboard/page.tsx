import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | StemTechLab",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
