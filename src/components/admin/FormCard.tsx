import type { FormEventHandler, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";

type ListRoute =
  | "/admin/servicios"
  | "/admin/proyectos"
  | "/admin/testimonios"
  | "/admin/equipo"
  | "/admin/proveedores";

/** Contenedor de formulario con botones Guardar / Cancelar. */
export function FormCard({
  onSubmit,
  saving,
  cancelTo,
  children,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  saving: boolean;
  cancelTo: ListRoute;
  children: ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="card-tech space-y-6 p-6 sm:p-8">
      {children}
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
        <Link to={cancelTo} className="btn-secondary px-6 py-3 text-sm">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-7 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </button>
      </div>
    </form>
  );
}

export function FormSkeleton() {
  return (
    <div className="card-tech space-y-6 p-6 sm:p-8" aria-busy="true" aria-label="Cargando">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i}>
          <div className="h-3 w-32 animate-pulse rounded bg-surface-elevated" />
          <div className="mt-2 h-11 w-full animate-pulse rounded bg-surface-elevated" />
        </div>
      ))}
    </div>
  );
}
