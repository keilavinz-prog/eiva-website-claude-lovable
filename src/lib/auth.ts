/** Roles y rutas de dashboard. Fuente única para guards, cabecera y formularios. */
export const ROLES = ["cliente", "admin", "empleado", "proveedor"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  cliente: "Cliente",
  admin: "Administrador",
  empleado: "Empleado",
  proveedor: "Proveedor",
};

export const DASHBOARD_BY_ROLE = {
  cliente: "/cliente/dashboard",
  admin: "/admin/dashboard",
  empleado: "/empleado/dashboard",
  proveedor: "/proveedor/dashboard",
} as const satisfies Record<Role, string>;

export type SessionProfile = { id: string; full_name: string; email: string; role: Role };

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Solo acepta rutas internas ("/algo"), para evitar redirecciones a otros dominios. */
export function safeRedirect(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : undefined;
}
