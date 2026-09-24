import { ROLE_LABEL, type Role } from "@/lib/auth";

/** Color por rol, con tokens existentes: cliente morado claro, admin amarillo, empleado verde, proveedor gris. */
const ROLE_STYLE: Record<Role, string> = {
  cliente: "border-logo-purple/40 bg-logo-purple/15 text-logo-purple",
  admin: "border-amber/40 bg-amber/15 text-amber",
  empleado: "border-success/40 bg-success/15 text-success",
  proveedor: "border-line bg-surface-elevated text-text-muted",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] ${ROLE_STYLE[role]}`}
    >
      {ROLE_LABEL[role]}
    </span>
  );
}
