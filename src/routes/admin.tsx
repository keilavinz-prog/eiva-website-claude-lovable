import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireRole } from "@/lib/role-guard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/admin/admin-nav";
import { PageSkeleton } from "@/components/site/Skeletons";

/** Layout del panel de administración: el guard de rol (validado en servidor) protege todas las rutas /admin/*. */
export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: requireRole("admin"),
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  pendingComponent: () => <PageSkeleton variant="grid" />,
  component: AdminLayout,
});

function AdminLayout() {
  const { profile } = Route.useRouteContext();
  return (
    <DashboardShell profile={profile} nav={ADMIN_NAV}>
      <Outlet />
    </DashboardShell>
  );
}
