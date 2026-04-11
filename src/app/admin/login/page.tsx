import AdminLoginClient from "./AdminLoginClient";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ idle?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const idleSignOut = sp.idle === "1";
  return <AdminLoginClient idleSignOut={idleSignOut} />;
}
