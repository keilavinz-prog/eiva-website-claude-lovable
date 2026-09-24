import { createFileRoute } from "@tanstack/react-router";
import { ProvidersList } from "@/components/admin/sections/Providers";

export const Route = createFileRoute("/admin/proveedores/")({
  head: () => ({ meta: [{ title: "Proveedores | Admin EEIVA" }] }),
  component: ProvidersList,
});
