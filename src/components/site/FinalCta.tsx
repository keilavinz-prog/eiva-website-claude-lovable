import { Link } from "@tanstack/react-router";
import { CtaBand } from "./CtaBand";

export function FinalCta() {
  return (
    <CtaBand title="¿Tienes preguntas? ¡Háblanos!">
      <Link to="/contacto" className="btn-accent px-8 py-4 text-base">
        Solicitar consulta
      </Link>
    </CtaBand>
  );
}
