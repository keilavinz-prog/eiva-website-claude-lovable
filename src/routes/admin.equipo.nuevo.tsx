import { createFileRoute } from "@tanstack/react-router";
import { TeamForm } from "@/components/admin/sections/Team";

export const Route = createFileRoute("/admin/equipo/nuevo")({
  head: () => ({ meta: [{ title: "Nuevo miembro | Admin EEIVA" }] }),
  component: () => <TeamForm />,
});
