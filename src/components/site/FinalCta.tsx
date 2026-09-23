import { Link } from "@tanstack/react-router";
import { CtaBand } from "./CtaBand";

export function FinalCta() {
  return (
    <CtaBand title="¿Necesitas un electricista de confianza?">
      <Link to="/contacto" className="btn-accent px-8 py-4 text-base">
        Contactar ahora
      </Link>
    </CtaBand>
  );
}
