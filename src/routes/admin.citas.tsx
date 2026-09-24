import { createFileRoute } from "@tanstack/react-router";
import { AppointmentsList } from "@/components/admin/sections/Appointments";

export const Route = createFileRoute("/admin/citas")({
  head: () => ({ meta: [{ title: "Citas | Admin EEIVA" }] }),
  component: AppointmentsList,
});
