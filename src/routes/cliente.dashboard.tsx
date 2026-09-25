import { createFileRoute } from "@tanstack/react-router";
import { requireRole } from "@/lib/role-guard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ClientHome } from "@/components/dashboard/ClientHome";
import { CLIENT_NAV } from "@/components/dashboard/role-nav";
import { PageSkeleton } from "@/components/site/Skeletons";

export const Route = createFileRoute("/cliente/dashboard")({
  // La sesión vive en el navegador; el rol lo valida el servidor dentro del guard
  ssr: false,
  beforeLoad: requireRole("cliente"),
  head: () => ({
    meta: [{ title: "Panel Cliente | EEIVA" }, { name: "robots", content: "noindex" }],
  }),
  pendingComponent: () => <PageSkeleton variant="grid" />,
  component: ClienteDashboard,
});

function ClienteDashboard() {
  const { profile } = Route.useRouteContext();
  return (
    <DashboardShell profile={profile} nav={CLIENT_NAV}>
      <ClientHome profile={profile} />
    </DashboardShell>
  );
}
