/** Fecha en formato "mes de año" en español. */
export function formatDate(date: string | null): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
}
