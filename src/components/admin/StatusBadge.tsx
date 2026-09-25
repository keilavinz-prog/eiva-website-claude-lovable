import { STATUS_LABEL } from "@/lib/admin/constants";

/** Colores por estado con los tokens de marca. "nuevo" y "completada" usan el morado claro (el cian ya no existe en la paleta). */
const STYLE: Record<string, string> = {
  activo: "border-success/40 bg-success/15 text-success",
  confirmada: "border-success/40 bg-success/15 text-success",
  inactivo: "border-line bg-surface-elevated text-text-muted",
  cerrado: "border-line bg-surface-elevated text-text-muted",
  cancelada: "border-line bg-surface-elevated text-text-muted",
  pendiente: "border-amber/40 bg-amber/15 text-amber",
  en_proceso: "border-amber/40 bg-amber/15 text-amber",
  nuevo: "border-logo-purple/40 bg-logo-purple/15 text-logo-purple",
  completada: "border-logo-purple/40 bg-logo-purple/15 text-logo-purple",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] whitespace-nowrap ${
        STYLE[status] ?? "border-line text-text-muted"
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
