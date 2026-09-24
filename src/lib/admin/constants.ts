/** Listas fijas de los formularios del panel de administración. */

/** Iconos disponibles para servicios (nombres lucide en kebab-case, ver components/site/icons). */
export const SERVICE_ICONS = [
  "zap",
  "file-check",
  "home",
  "battery-charging",
  "sun",
  "wind",
  "lightbulb",
  "wifi",
  "shield-check",
  "award",
  // Iconos ya usados por el contenido real de eeiva.es
  "cpu",
  "wrench",
  "utility-pole",
  "network",
  "cctv",
  "leaf",
] as const;

export const SERVICE_CATEGORIES = [
  "Instalaciones",
  "Certificación",
  "Automatización",
  "Movilidad",
  "Energía",
  "Climatización",
  "Eficiencia",
  "Telecomunicaciones",
] as const;

export const PROJECT_CATEGORIES = [
  "Industrial",
  "Residencial",
  "Hostelería",
  "Energía Solar",
  "Comercial",
  "Residencial Premium",
  "Movilidad Eléctrica",
] as const;

export const PROVIDER_STATUSES = ["activo", "inactivo", "pendiente"] as const;
export const REQUEST_STATUSES = ["nuevo", "en_proceso", "cerrado"] as const;
export const APPOINTMENT_STATUSES = ["pendiente", "confirmada", "cancelada", "completada"] as const;

export const STATUS_LABEL: Record<string, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  pendiente: "Pendiente",
  nuevo: "Nuevo",
  en_proceso: "En proceso",
  cerrado: "Cerrado",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  completada: "Completada",
};

/** Une la lista fija con los valores ya usados en BD para no perderlos al editar. */
export function mergeOptions(fixed: readonly string[], ...extra: (string | null | undefined)[]) {
  const set = new Set<string>(fixed);
  for (const v of extra) if (v) set.add(v);
  return Array.from(set);
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
