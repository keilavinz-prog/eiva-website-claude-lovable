/** Fecha en formato "mes de año" en español. */
export function formatDate(date: string | null): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
}

/** Fecha completa en español, p. ej. "24 de septiembre de 2026". */
export function formatLongDate(date: string | null): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  });
}

/** Minutos de lectura estimados (≈200 palabras por minuto). */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Fecha y hora en español (zona horaria de Madrid), p. ej. "24 sept 2026, 10:30". */
export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });
}
