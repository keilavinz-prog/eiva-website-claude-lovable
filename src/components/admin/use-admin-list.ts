import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { crud, CrudTable } from "@/lib/admin/api";

type Api<T extends CrudTable> = ReturnType<typeof crud<T>>;

/** Listado + borrado + interruptor "featured" optimista para una tabla del panel. */
export function useAdminList<T extends CrudTable>(table: T, api: Api<T>) {
  const qc = useQueryClient();
  const key = ["admin", table];
  const query = useQuery({ queryKey: key, queryFn: api.list });

  const remove = useMutation({
    mutationFn: (id: string) => api.remove(id),
    onSuccess: () => {
      toast.success("Eliminado correctamente");
      void qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      api.update(id, { featured } as never),
    onMutate: async ({ id, featured }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<{ id: string }[]>(key);
      qc.setQueryData<{ id: string }[]>(key, (rows) =>
        rows?.map((r) => (r.id === id ? { ...r, featured } : r)),
      );
      return { prev };
    },
    onError: (e: Error, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
      toast.error(e.message);
    },
    onSuccess: (_d, v) =>
      toast.success(v.featured ? "Marcado como destacado" : "Ya no es destacado"),
    onSettled: () => void qc.invalidateQueries({ queryKey: key }),
  });

  return { query, remove, toggleFeatured };
}
