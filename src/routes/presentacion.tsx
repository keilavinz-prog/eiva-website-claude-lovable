import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { enableShowcaseMode } from "@/lib/showcase";

/**
 * URL de demo permanente para enseñar solo el sitio informativo (sin login,
 * registro, reservas ni paneles). No caduca: activa el modo escaparate para
 * esta pestaña y lleva a inicio. Ver src/lib/showcase.ts.
 */
export const Route = createFileRoute("/presentacion")({
  head: () => ({
    meta: [{ title: "EEIVA" }, { name: "robots", content: "noindex" }],
  }),
  component: PresentacionRedirect,
});

function PresentacionRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    enableShowcaseMode();
    void navigate({ to: "/", replace: true });
  }, [navigate]);

  return null;
}
