import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FilterChips } from "@/components/site/FilterChips";
import { inputClass } from "@/components/auth/fields";
import { AdminPage } from "../AdminPage";
import { DataTable, type Column } from "../DataTable";
import { StatusBadge } from "../StatusBadge";
import { AssignSelect } from "../AssignSelect";
import { getRequest, listRequests, setRequestStatus, type RequestRow } from "@/lib/admin/api";
import { useLiveRows } from "@/lib/live-rows";
import { REQUEST_STATUSES, STATUS_LABEL } from "@/lib/admin/constants";
import { formatDateTime } from "@/lib/format";

const FILTERS = ["Todas", "Nuevo", "En proceso", "Cerrado"] as const;
const FILTER_TO_STATUS: Record<string, string | null> = {
  Todas: null,
  Nuevo: "nuevo",
  "En proceso": "en_proceso",
  Cerrado: "cerrado",
};

export function RequestsList() {
  const qc = useQueryClient();
  const key = ["admin", "contact_requests"];
  const query = useQuery({ queryKey: key, queryFn: listRequests });
  // Tiempo real: filas nuevas arriba (resaltadas) y cambios de otras sesiones en vivo
  const fresh = useLiveRows<RequestRow>("admin-solicitudes", "contact_requests", key, getRequest);
  const [filter, setFilter] = useState<string>("Todas");
  const [openId, setOpenId] = useState<string | null>(null);

  const status = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => setRequestStatus(id, value),
    onMutate: async ({ id, value }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<RequestRow[]>(key);
      qc.setQueryData<RequestRow[]>(key, (rows) =>
        rows?.map((r) => (r.id === id ? { ...r, status: value } : r)),
      );
      return { prev };
    },
    onError: (e: Error, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
      toast.error(e.message);
    },
    onSuccess: (_d, v) => toast.success(`Estado cambiado a «${STATUS_LABEL[v.value]}»`),
    onSettled: () => void qc.invalidateQueries({ queryKey: ["admin"] }),
  });

  const wanted = FILTER_TO_STATUS[filter];
  const rows = query.data?.filter((r) => !wanted || r.status === wanted);
  const open = query.data?.find((r) => r.id === openId) ?? null;

  const columns: Column<RequestRow>[] = [
    { key: "name", header: "Nombre", cell: (r) => <span className="font-medium">{r.name}</span> },
    { key: "email", header: "Email", cell: (r) => r.email },
    { key: "phone", header: "Teléfono", cell: (r) => r.phone ?? "—" },
    { key: "service", header: "Servicio de interés", cell: (r) => r.services?.title ?? "General" },
    {
      key: "date",
      header: "Fecha",
      cell: (r) => (
        <span className="font-mono text-xs whitespace-nowrap">{formatDateTime(r.created_at)}</span>
      ),
    },
    { key: "status", header: "Estado", cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "assigned",
      header: "Asignar a",
      cell: (r) => (
        <AssignSelect
          table="contact_requests"
          id={r.id}
          value={r.assigned_to}
          label={`Asignar la solicitud de ${r.name}`}
        />
      ),
    },
  ];

  return (
    <AdminPage
      kicker="// gestión"
      title="Solicitudes de contacto"
      description="Mensajes enviados desde el formulario de la web. Pulsa una fila para ver el detalle."
    >
      <FilterChips
        label="Filtrar por estado"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />
      <div className="mt-6">
        <DataTable
          rowClassName={(r) => (fresh.has(r.id) ? "rt-fresh" : undefined)}
          columns={columns}
          rows={rows}
          isLoading={query.isLoading}
          error={query.error?.message ?? null}
          empty={
            query.data && query.data.length > 0
              ? "No hay solicitudes con este estado."
              : "Todavía no hay solicitudes de contacto."
          }
          onRowClick={(r) => setOpenId(r.id)}
        />
      </div>

      <Sheet open={Boolean(open)} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {open ? (
            <>
              <SheetHeader>
                <SheetTitle>{open.name}</SheetTitle>
                <SheetDescription>Recibida el {formatDateTime(open.created_at)}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6 px-4 pb-6 text-sm">
                <div className="space-y-2">
                  <a
                    href={`mailto:${open.email}`}
                    className="flex items-center gap-2 text-text hover:text-electric"
                  >
                    <Mail className="h-4 w-4 text-electric" aria-hidden="true" />
                    {open.email}
                  </a>
                  {open.phone ? (
                    <a
                      href={`tel:${open.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2 text-text hover:text-electric"
                    >
                      <Phone className="h-4 w-4 text-electric" aria-hidden="true" />
                      {open.phone}
                    </a>
                  ) : null}
                </div>
                <div>
                  <p className="font-mono text-xs text-text-muted uppercase">Servicio de interés</p>
                  <p className="mt-1 text-text">{open.services?.title ?? "General"}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-text-muted uppercase">Mensaje</p>
                  <p className="mt-2 rounded-md border border-line bg-surface p-4 leading-relaxed whitespace-pre-wrap text-text">
                    {open.message}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="req-status"
                    className="font-mono text-xs text-text-muted uppercase"
                  >
                    Estado (se guarda al cambiarlo)
                  </label>
                  <select
                    id="req-status"
                    value={open.status}
                    onChange={(e) => status.mutate({ id: open.id, value: e.target.value })}
                    className={`${inputClass} mt-2`}
                  >
                    {REQUEST_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </AdminPage>
  );
}
