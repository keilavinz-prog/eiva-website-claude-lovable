import { createFileRoute } from "@tanstack/react-router";
import { RequestsList } from "@/components/admin/sections/Requests";

export const Route = createFileRoute("/admin/solicitudes")({
  head: () => ({ meta: [{ title: "Solicitudes | Admin EEIVA" }] }),
  component: RequestsList,
});
