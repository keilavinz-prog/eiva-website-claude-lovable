import { useQueryClient } from "@tanstack/react-query";
import { useFreshIds, useTableChanges, type RealtimeTable } from "@/lib/realtime";

type Row = { id: string; services?: { title: string } | null; service_id?: string | null };

/**
 * Mantiene en vivo una lista en caché de react-query:
 * - INSERT: carga la fila completa (con su servicio), la pone arriba y la resalta.
 * - UPDATE: fusiona los cambios en la fila existente (conserva filtros y scroll).
 */
export function useLiveRows<T extends Row>(
  name: string,
  table: RealtimeTable,
  key: readonly unknown[],
  fetchOne: (id: string) => Promise<T | null>,
) {
  const qc = useQueryClient();
  const { fresh, mark } = useFreshIds();

  useTableChanges(name, [table], async ({ eventType, row }) => {
    const id = String(row["id"]);
    if (eventType === "INSERT") {
      const full = await fetchOne(id).catch(() => null);
      if (!full) return;
      qc.setQueryData<T[]>(key, (rows) =>
        rows && !rows.some((r) => r.id === id) ? [full, ...rows] : rows,
      );
      mark(id);
      return;
    }
    qc.setQueryData<T[]>(key, (rows) =>
      rows?.map((r) => (r.id === id ? { ...r, ...(row as Partial<T>), services: r.services } : r)),
    );
  });

  return fresh;
}
