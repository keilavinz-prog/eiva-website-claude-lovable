import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "@/lib/role-guard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EmployeeHome } from "@/components/dashboard/EmployeeHome";
import { EMPLOYEE_NAV } from "@/components/dashboard/role-nav";
import { PageSkeleton } from "@/components/site/Skeletons";

export const Route = createFileRoute("/empleado/dashboard")({
  // La sesión vive en el navegador; el rol lo valida el servidor dentro del guard
  ssr: false,
  beforeLoad: requireRole("empleado"),
  head: () => ({
    meta: [{ title: "Panel Empleado | EEIVA" }, { name: "robots", content: "noindex" }],
  }),
  pendingComponent: () => <PageSkeleton variant="grid" />,
  component: EmpleadoDashboard,
});

function EmpleadoDashboard() {
  const { profile } = Route.useRouteContext();
  return (
    <DashboardShell profile={profile} nav={EMPLOYEE_NAV}>
      <EmployeeHome profile={profile} />
    </DashboardShell>
  );
}
