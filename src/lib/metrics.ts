/** Agregaciones del panel de métricas (funciones puras, sin datos inventados). */

export type RequestForMetrics = {
  created_at: string;
  status: string;
  services: { title: string } | null;
};
export type AppointmentForMetrics = { status: string };

const TZ = "Europe/Madrid";

function monthKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  return `${y}-${m}`;
}

/** "ene 26", "sept 26"… */
function monthLabel(key: string): string {
  const [y = 0, m = 1] = key.split("-").map(Number);
  const month = new Date(Date.UTC(y, m - 1, 15))
    .toLocaleDateString("es-ES", { month: "short", timeZone: "UTC" })
    .replace(".", "");
  return `${month} ${String(y).slice(2)}`;
}

/** Solicitudes por mes en los últimos 6 meses (incluido el actual), hora de Madrid. */
export function requestsByMonth(requests: RequestForMetrics[], now = new Date()) {
  const [cy = 0, cm = 1] = monthKey(now).split("-").map(Number);
  const keys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(cy, cm - 1 - i, 15));
    keys.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  const counts = new Map(keys.map((k) => [k, 0]));
  for (const r of requests) {
    const k = monthKey(new Date(r.created_at));
    if (counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const data = keys.map((k) => ({ month: monthLabel(k), solicitudes: counts.get(k) ?? 0 }));
  return { data, total: data.reduce((sum, d) => sum + d.solicitudes, 0) };
}

/** Top 6 servicios por número de solicitudes; sin servicio → "Sin especificar". */
export function topServices(requests: RequestForMetrics[], limit = 6) {
  const counts = new Map<string, number>();
  for (const r of requests) {
    const name = r.services?.title ?? "Sin especificar";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([servicio, solicitudes]) => ({ servicio, solicitudes }))
    .sort((a, b) => b.solicitudes - a.solicitudes || a.servicio.localeCompare(b.servicio, "es"))
    .slice(0, limit);
}

/** Reparto por estado en el orden indicado (incluye estados con 0 para la leyenda). */
export function byStatus(rows: { status: string }[], order: readonly string[]) {
  const total = rows.length;
  return order.map((status) => {
    const value = rows.filter((r) => r.status === status).length;
    return { status, value, pct: total ? Math.round((value / total) * 100) : 0 };
  });
}

/** Citas confirmadas + completadas sobre el total. null si no hay citas (se muestra "—"). */
export function conversionRate(appointments: AppointmentForMetrics[]): number | null {
  if (appointments.length === 0) return null;
  const ok = appointments.filter((a) => a.status === "confirmada" || a.status === "completada");
  return Math.round((ok.length / appointments.length) * 1000) / 10;
}
