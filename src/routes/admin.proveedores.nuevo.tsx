import { createFileRoute } from "@tanstack/react-router";
import { ProviderForm } from "@/components/admin/sections/Providers";

export const Route = createFileRoute("/admin/proveedores/nuevo")({
  head: () => ({ meta: [{ title: "Nuevo proveedor | Admin EEIVA" }] }),
  component: () => <ProviderForm />,
});
