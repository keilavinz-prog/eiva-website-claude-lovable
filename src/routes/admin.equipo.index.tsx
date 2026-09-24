import { createFileRoute } from "@tanstack/react-router";
import { TeamList } from "@/components/admin/sections/Team";

export const Route = createFileRoute("/admin/equipo/")({
  head: () => ({ meta: [{ title: "Equipo | Admin EEIVA" }] }),
  component: TeamList,
});
