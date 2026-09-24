import { createFileRoute } from "@tanstack/react-router";
import { ProjectForm } from "@/components/admin/sections/Projects";

export const Route = createFileRoute("/admin/proyectos/nuevo")({
  head: () => ({ meta: [{ title: "Nuevo proyecto | Admin EEIVA" }] }),
  component: () => <ProjectForm />,
});
