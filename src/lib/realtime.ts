import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import "../realtime.css";

/**
 * Tiempo real (Fase 7). Supabase Realtime respeta RLS: cada usuario solo recibe
 * eventos de las filas que puede leer (admin: todas; empleado: las asignadas).
 */

export type RealtimeTable = "contact_requests" | "appointments";
export type RealtimeChange = {
  table: RealtimeTable;
  eventType: "INSERT" | "UPDATE";
  row: Record<string, unknown>;
};
export type RealtimeStatus = "connected" | "reconnecting" | "disconnected";

// ---- Estado agregado de los canales abiertos (para el indicador de conexión) ----
const channelStatus = new Map<string, string>();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function aggregate(): RealtimeStatus {
  const values = [...channelStatus.values()];
  if (values.length === 0) return "disconnected";
  if (values.some((v) => v === "CHANNEL_ERROR" || v === "TIMED_OUT" || v === "CONNECTING")) {
    return "reconnecting";
  }
  return values.some((v) => v === "SUBSCRIBED") ? "connected" : "disconnected";
}

export function useRealtimeStatus(): RealtimeStatus {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    aggregate,
    () => "disconnected",
  );
}

// Depuración: en la consola del navegador, __eeivaRealtime() lista los canales abiertos.
if (typeof window !== "undefined") {
  (window as unknown as { __eeivaRealtime: () => string[] }).__eeivaRealtime = () =>
    supabase.getChannels().map((c) => c.topic);
}

let seq = 0;

/**
 * Suscribe a INSERT y UPDATE de las tablas indicadas mientras el componente está montado.
 * Cada montaje usa un canal propio y lo elimina al desmontar (sin canales huérfanos).
 * Con `tables` vacío abre un canal sin eventos, útil solo para conocer el estado de conexión.
 */
export function useTableChanges(
  name: string,
  tables: RealtimeTable[],
  onChange?: (change: RealtimeChange) => void,
) {
  const handler = useRef(onChange);
  useEffect(() => {
    handler.current = onChange;
  });
  const tablesKey = tables.join(",");

  useEffect(() => {
    const topic = `${name}-${++seq}`;
    const channel = supabase.channel(topic);
    for (const table of tablesKey ? (tablesKey.split(",") as RealtimeTable[]) : []) {
      channel
        .on("postgres_changes", { event: "INSERT", schema: "public", table }, (p) =>
          handler.current?.({ table, eventType: "INSERT", row: p.new }),
        )
        .on("postgres_changes", { event: "UPDATE", schema: "public", table }, (p) =>
          handler.current?.({ table, eventType: "UPDATE", row: p.new }),
        );
    }
    channelStatus.set(topic, "CONNECTING");
    notify();
    channel.subscribe((status) => {
      if (!channelStatus.has(topic)) return; // ya desmontado
      channelStatus.set(topic, status);
      notify();
    });
    return () => {
      channelStatus.delete(topic);
      notify();
      void supabase.removeChannel(channel);
    };
  }, [name, tablesKey]);
}

/** Ids recién llegados por tiempo real, para resaltarlos 1,5 s. */
export function useFreshIds(durationMs = 1600) {
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set());
  const timers = useRef(new Map<string, number>());
  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => window.clearTimeout(t));
  }, []);
  const mark = useCallback(
    (id: string) => {
      setFresh((prev) => new Set(prev).add(id));
      window.clearTimeout(timers.current.get(id));
      timers.current.set(
        id,
        window.setTimeout(() => {
          timers.current.delete(id);
          setFresh((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, durationMs),
      );
    },
    [durationMs],
  );
  return { fresh, mark };
}
