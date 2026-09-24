import { createFileRoute } from "@tanstack/react-router";
import { ProjectForm } from "@/components/admin/sections/Projects";

export const Route = createFileRoute("/admin/proyectos/$id/editar")({
  head: () => ({ meta: [{ title: "Editar proyecto | Admin EEIVA" }] }),
  component: Edit,
});

function Edit() {
  const { id } = Route.useParams();
  return <ProjectForm id={id} />;
}
