import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "@/lib/role-guard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProviderHome } from "@/components/dashboard/ProviderHome";
import { PROVIDER_NAV } from "@/components/dashboard/role-nav";
import { PageSkeleton } from "@/components/site/Skeletons";

export const Route = createFileRoute("/proveedor/dashboard")({
  // La sesión vive en el navegador; el rol lo valida el servidor dentro del guard
  ssr: false,
  beforeLoad: requireRole("proveedor"),
  head: () => ({
    meta: [{ title: "Panel Proveedor | EEIVA" }, { name: "robots", content: "noindex" }],
  }),
  pendingComponent: () => <PageSkeleton variant="grid" />,
  component: ProveedorDashboard,
});

function ProveedorDashboard() {
  const { profile } = Route.useRouteContext();
  return (
    <DashboardShell profile={profile} nav={PROVIDER_NAV}>
      <ProviderHome profile={profile} />
    </DashboardShell>
  );
}
