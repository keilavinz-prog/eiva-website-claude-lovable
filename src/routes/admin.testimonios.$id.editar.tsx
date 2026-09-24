import { createFileRoute } from "@tanstack/react-router";
import { TestimonialForm } from "@/components/admin/sections/Testimonials";

export const Route = createFileRoute("/admin/testimonios/$id/editar")({
  head: () => ({ meta: [{ title: "Editar testimonio | Admin EEIVA" }] }),
  component: Edit,
});

function Edit() {
  const { id } = Route.useParams();
  return <TestimonialForm id={id} />;
}
