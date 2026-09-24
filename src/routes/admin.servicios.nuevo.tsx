import { createFileRoute } from "@tanstack/react-router";
import { ServiceForm } from "@/components/admin/sections/Services";

export const Route = createFileRoute("/admin/servicios/nuevo")({
  head: () => ({ meta: [{ title: "Nuevo servicio | Admin EEIVA" }] }),
  component: () => <ServiceForm />,
});
