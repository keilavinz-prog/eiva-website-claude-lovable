import { createFileRoute } from "@tanstack/react-router";
import { ProviderForm } from "@/components/admin/sections/Providers";

export const Route = createFileRoute("/admin/proveedores/$id/editar")({
  head: () => ({ meta: [{ title: "Editar proveedor | Admin EEIVA" }] }),
  component: Edit,
});

function Edit() {
  const { id } = Route.useParams();
  return <ProviderForm id={id} />;
}
