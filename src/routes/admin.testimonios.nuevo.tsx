import { createFileRoute } from "@tanstack/react-router";
import { TestimonialForm } from "@/components/admin/sections/Testimonials";

export const Route = createFileRoute("/admin/testimonios/nuevo")({
  head: () => ({ meta: [{ title: "Nuevo testimonio | Admin EEIVA" }] }),
  component: () => <TestimonialForm />,
});
