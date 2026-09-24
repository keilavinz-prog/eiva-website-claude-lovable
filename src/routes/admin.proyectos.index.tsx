import { createFileRoute } from "@tanstack/react-router";
import { ProjectsList } from "@/components/admin/sections/Projects";

export const Route = createFileRoute("/admin/proyectos/")({
  head: () => ({ meta: [{ title: "Proyectos | Admin EEIVA" }] }),
  component: ProjectsList,
});
