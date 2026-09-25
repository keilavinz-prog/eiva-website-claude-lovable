import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { attachLinksAfterConfirm } from "@/lib/meeting-links";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AppointmentCard } from "@/components/booking/AppointmentCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DashboardWelcome } from "./DashboardWelcome";
import {
  listAssignedAppointments,
  listAssignedRequests,
  setAssignedAppointmentStatus,
  setAssignedRequestStatus,
  type AssignedAppointment,
  type AssignedRequest,
} from "@/lib/role-areas";
import { APPOINTMENT_STATUSES, REQUEST_STATUSES, STATUS_LABEL } from "@/lib/admin/constants";
import { formatDateTime } from "@/lib/format";
import type { SessionProfile } from "@/lib/auth";

const selectClass =
  "rounded-md border border-line bg-canvas px-2 py-1.5 text-sm text-text focus:border-electric focus:outline-none";

/** Cambio de estado optimista reutilizable para las dos listas del empleado. */
function useStatusMutation<T extends { id: string; status: string }>(
  key: readonly unknown[],
  save: (id: string, status: string) => Promise<void>,
  afterSave?: (id: string, status: string) => Promise<void>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => save(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<T[]>(key);
      qc.setQueryData<T[]>(key, (rows) => rows?.map((r) => (r.id === id ? { ...r, status } : r)));
      return { prev };
    },
    onError: (e: Error, _v, ctx) => {
      qc.setQueryData(key, ctx?.prev);
      toast.error(e.message);
    },
    onSuccess: async (_d, v) => {
      toast.success(`Estado: ${STATUS_LABEL[v.status] ?? v.status}`);
      await afterSave?.(v.id, v.status);
    },
  });
}

function Empty() {
  return <p className="py-6 text-center text-text-muted">No tienes tareas asignadas todavía.</p>;
}

function ListSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-md bg-surface-elevated" />
      ))}
    </>
  );
}

export function EmployeeHome({ profile }: { profile: SessionProfile }) {
  const aKey = ["me", profile.id, "assigned", "appointments"] as const;
  const rKey = ["me", profile.id, "assigned", "requests"] as const;
  const appointments = useQuery({
    queryKey: aKey,
    queryFn: () => listAssignedAppointments(profile.id),
  });
  const requests = useQuery({ queryKey: rKey, queryFn: () => listAssignedRequests(profile.id) });
  const qc = useQueryClient();
  // Fase 6: al confirmar una cita se generan sus enlaces de calendario / videollamada
  const aStatus = useStatusMutation<AssignedAppointment>(
    aKey,
    setAssignedAppointmentStatus,
    (id, status) =>
      status === "confirmada" ? attachLinksAfterConfirm(qc, aKey, id) : Promise.resolve(),
  );
  const rStatus = useStatusMutation<AssignedRequest>(rKey, setAssignedRequestStatus);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = requests.data?.find((r) => r.id === openId) ?? null;

  return (
    <div>
      <DashboardWelcome name={profile.full_name} subtitle="Tus tareas y citas asignadas" />
      <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-text-muted">
        <Info className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
        La asignación de tareas la gestiona un administrador
      </p>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <section className="card-tech p-6" aria-labelledby="tareas-citas">
          <h2 id="tareas-citas" className="text-lg font-semibold text-text">
            Mis tareas — Citas asignadas
          </h2>
          <div className="mt-5 space-y-3">
            {appointments.isLoading ? (
              <ListSkeleton />
            ) : appointments.error ? (
              <p role="alert" className="text-sm text-danger">
                {appointments.error.message}
              </p>
            ) : (appointments.data ?? []).length === 0 ? (
              <Empty />
            ) : (
              appointments.data?.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  extra={
                    <p className="mt-1 text-sm text-text-muted">
                      {a.name} · {a.email}
                      {a.phone ? ` · ${a.phone}` : ""}
                    </p>
                  }
                  actions={
                    <select
                      aria-label={`Cambiar estado de la cita de ${a.name}`}
                      value={a.status}
                      onChange={(e) => aStatus.mutate({ id: a.id, status: e.target.value })}
                      className={selectClass}
                    >
                      {APPOINTMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  }
                />
              ))
            )}
          </div>
        </section>

        <section className="card-tech p-6" aria-labelledby="tareas-solicitudes">
          <h2 id="tareas-solicitudes" className="text-lg font-semibold text-text">
            Mis tareas — Solicitudes asignadas
          </h2>
          <div className="mt-5 space-y-3">
            {requests.isLoading ? (
              <ListSkeleton />
            ) : requests.error ? (
              <p role="alert" className="text-sm text-danger">
                {requests.error.message}
              </p>
            ) : (requests.data ?? []).length === 0 ? (
              <Empty />
            ) : (
              requests.data?.map((r) => (
                <div key={r.id} className="rounded-md border border-line bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-text">{r.name}</p>
                      <p className="mt-1 font-mono text-xs text-text-muted">
                        {r.services?.title ?? "General"} · {formatDateTime(r.created_at)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenId(r.id)}
                      className="rounded-md px-3 py-1.5 text-sm text-electric hover:bg-surface-elevated"
                    >
                      Ver mensaje
                    </button>
                    <select
                      aria-label={`Cambiar estado de la solicitud de ${r.name}`}
                      value={r.status}
                      onChange={(e) => rStatus.mutate({ id: r.id, status: e.target.value })}
                      className={selectClass}
                    >
                      {REQUEST_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <Sheet open={Boolean(open)} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {open ? (
            <>
              <SheetHeader>
                <SheetTitle>{open.name}</SheetTitle>
                <SheetDescription>Recibida el {formatDateTime(open.created_at)}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5 px-4 pb-6 text-sm">
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
                  <p className="font-mono text-xs text-text-muted uppercase">Mensaje</p>
                  <p className="mt-2 rounded-md border border-line bg-surface p-4 leading-relaxed whitespace-pre-wrap text-text">
                    {open.message}
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
