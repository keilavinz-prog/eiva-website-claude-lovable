import { createFileRoute } from "@tanstack/react-router";
import { AdminHome } from "@/components/admin/sections/AdminHome";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Panel Admin | EEIVA" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { profile } = Route.useRouteContext();
  return <AdminHome name={profile.full_name} />;
}
