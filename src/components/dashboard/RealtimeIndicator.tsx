import { useRealtimeStatus, useTableChanges, type RealtimeStatus } from "@/lib/realtime";

const LABEL: Record<RealtimeStatus, string> = {
  connected: "Tiempo real: conectado",
  reconnecting: "Tiempo real: reconectando…",
  disconnected: "Tiempo real: desconectado",
};
const DOT: Record<RealtimeStatus, string> = {
  connected: "bg-success",
  reconnecting: "bg-amber animate-pulse motion-reduce:animate-none",
  disconnected: "bg-text-muted",
};

/** Punto discreto con el estado de la conexión en tiempo real. */
export function RealtimeDot() {
  const status = useRealtimeStatus();
  return (
    <span
      role="status"
      title={LABEL[status]}
      aria-label={LABEL[status]}
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${DOT[status]}`}
    />
  );
}

/** Canal ligero del panel: mantiene y refleja la conexión aunque la página no escuche tablas. */
export function RealtimeConnection() {
  useTableChanges("panel", []);
  return null;
}
