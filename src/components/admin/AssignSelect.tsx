import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignTo, listEmployees } from "@/lib/admin/api";

/** Selector "Asignar a" (empleados). Guarda al cambiar, con actualización optimista. */
export function AssignSelect({
  table,
  id,
  value,
  label,
}: {
  table: "contact_requests" | "appointments";
  id: string;
  value: string | null;
  label: string;
}) {
  const qc = useQueryClient();
  const key = ["admin", table];
  const employees = useQuery({ queryKey: ["admin", "employees"], queryFn: listEmployees });

  const assign = useMutation({
    mutationFn: (userId: string | null) => assignTo(table, id, userId),
    onMutate: async (userId) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<{ id: string; assigned_to: string | null }[]>(key);
      qc.setQueryData<{ id: string; assigned_to: string | null }[]>(key, (rows) =>
        rows?.map((r) => (r.id === id ? { ...r, assigned_to: userId } : r)),
      );
      return { prev };
    },
    onError: (e: Error, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
      toast.error(e.message);
    },
    onSuccess: (_d, userId) =>
      toast.success(
        userId
          ? `Asignado a ${employees.data?.find((e) => e.id === userId)?.full_name ?? "empleado"}`
          : "Sin asignar",
      ),
  });

  return (
    <select
      aria-label={label}
      value={value ?? ""}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => assign.mutate(e.target.value || null)}
      className="max-w-44 rounded-md border border-line bg-canvas px-2 py-1.5 text-sm text-text focus:border-electric focus:outline-none"
    >
      <option value="">Sin asignar</option>
      {employees.data?.map((e) => (
        <option key={e.id} value={e.id}>
          {e.full_name}
        </option>
      ))}
    </select>
  );
}
