import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "@/lib/role-guard";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
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
  return <RoleDashboard profile={profile} />;
}
