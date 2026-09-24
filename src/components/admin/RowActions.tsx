import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

/** Contenedor de acciones de fila (evita que el clic abra la fila). */
export function RowActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}

export const editLinkClass =
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-text-muted transition-colors hover:bg-surface-elevated hover:text-text";

export function EditIcon() {
  return <Pencil className="h-4 w-4" aria-hidden="true" />;
}
