import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminPage } from "../AdminPage";
import { DataTable, type Column } from "../DataTable";
import { StatusBadge } from "../StatusBadge";
import { AssignSelect } from "../AssignSelect";
import { listAppointments, setAppointmentStatus, type AppointmentRow } from "@/lib/admin/api";
import { APPOINTMENT_STATUSES, STATUS_LABEL } from "@/lib/admin/constants";

function formatDay(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AppointmentsList() {
  const qc = useQueryClient();
  const key = ["admin", "appointments"];
  const query = useQuery({ queryKey: key, queryFn: listAppointments });

  const status = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => setAppointmentStatus(id, value),
    onMutate: async ({ id, value }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<AppointmentRow[]>(key);
      qc.setQueryData<AppointmentRow[]>(key, (rows) =>
        rows?.map((r) => (r.id === id ? { ...r, status: value } : r)),
      );
      return { prev };
    },
    onError: (e: Error, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
      toast.error(e.message);
    },
    onSuccess: (_d, v) => toast.success(`Cita marcada como «${STATUS_LABEL[v.value]}»`),
    onSettled: () => void qc.invalidateQueries({ queryKey: ["admin"] }),
  });

  const columns: Column<AppointmentRow>[] = [
    { key: "name", header: "Nombre", cell: (a) => <span className="font-medium">{a.name}</span> },
    { key: "service", header: "Servicio", cell: (a) => a.services?.title ?? "General" },
    {
      key: "when",
      header: "Fecha / hora preferida",
      cell: (a) => (
        <span className="font-mono text-xs whitespace-nowrap">
          {formatDay(a.preferred_date)} · {a.preferred_time}
        </span>
      ),
    },
    {
      key: "type",
      header: "Tipo",
      cell: (a) => (a.meeting_type === "videollamada" ? "Videollamada" : "Presencial"),
    },
    {
      key: "status",
      header: "Estado",
      cell: (a) => (
        <div className="flex items-center gap-3">
          <StatusBadge status={a.status} />
          <select
            aria-label={`Cambiar estado de la cita de ${a.name}`}
            value={a.status}
            onChange={(e) => status.mutate({ id: a.id, value: e.target.value })}
            className="rounded-md border border-line bg-canvas px-2 py-1.5 text-sm text-text focus:border-electric focus:outline-none"
          >
            {APPOINTMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      key: "assigned",
      header: "Asignar a",
      cell: (a) => (
        <AssignSelect
          table="appointments"
          id={a.id}
          value={a.assigned_to}
          label={`Asignar la cita de ${a.name}`}
        />
      ),
    },
  ];

  return (
    <AdminPage kicker="// gestión" title="Citas" description="Citas solicitadas por clientes.">
      <DataTable
        columns={columns}
        rows={query.data}
        isLoading={query.isLoading}
        error={query.error?.message ?? null}
        empty="Todavía no hay citas — estarán disponibles cuando se active la reserva en la Fase 5."
      />
    </AdminPage>
  );
}
