import { createFileRoute } from "@tanstack/react-router";
import { TestimonialsList } from "@/components/admin/sections/Testimonials";

export const Route = createFileRoute("/admin/testimonios/")({
  head: () => ({ meta: [{ title: "Testimonios | Admin EEIVA" }] }),
  component: TestimonialsList,
});
