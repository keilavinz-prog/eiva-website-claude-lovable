import { createFileRoute } from "@tanstack/react-router";
import { ServicesList } from "@/components/admin/sections/Services";

export const Route = createFileRoute("/admin/servicios/")({
  head: () => ({ meta: [{ title: "Servicios | Admin EEIVA" }] }),
  component: ServicesList,
});
