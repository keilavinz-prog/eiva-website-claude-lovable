import { createFileRoute } from "@tanstack/react-router";
import { MetricsDashboard } from "@/components/admin/sections/Metrics";

export const Route = createFileRoute("/admin/metricas")({
  head: () => ({ meta: [{ title: "Métricas | Admin EEIVA" }] }),
  component: MetricsDashboard,
});
