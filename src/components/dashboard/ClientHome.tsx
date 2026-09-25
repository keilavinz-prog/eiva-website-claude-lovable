import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppointmentCard } from "@/components/booking/AppointmentCard";
import { DashboardWelcome } from "./DashboardWelcome";
import {
  cancelMyAppointment,
  isTempId,
  listMyAppointments,
  myAppointmentsKey,
  type MyAppointment,
} from "@/lib/booking";
import type { SessionProfile } from "@/lib/auth";

const CANCELLABLE = ["pendiente", "confirmada"];

export function ClientHome({ profile }: { profile: SessionProfile }) {
  const qc = useQueryClient();
  const key = myAppointmentsKey(profile.id);
  const query = useQuery({ queryKey: key, queryFn: () => listMyAppointments(profile.id) });
  const [toCancel, setToCancel] = useState<MyAppointment | null>(null);

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const ok = await cancelMyAppointment(id);
      if (!ok) throw new Error("Esta cita ya no se puede cancelar.");
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<MyAppointment[]>(key);
      qc.setQueryData<MyAppointment[]>(key, (rows) =>
        rows?.map((r) => (r.id === id ? { ...r, status: "cancelada" } : r)),
      );
      return { prev };
    },
    onError: (e: Error, _id, ctx) => {
      qc.setQueryData(key, ctx?.prev);
      toast.error(e.message);
    },
    onSuccess: () => toast.success("Cita cancelada"),
    onSettled: () => void qc.invalidateQueries({ queryKey: key }),
  });

  const appointments = query.data ?? [];

  return (
    <div>
      <DashboardWelcome name={profile.full_name} subtitle="Aquí verás tus solicitudes y citas" />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <section className="card-tech p-6 lg:col-span-2" aria-labelledby="mis-citas">
          <h2 id="mis-citas" className="text-lg font-semibold text-text">
            Mis citas
          </h2>
          <div className="mt-5 space-y-3">
            {query.isLoading ? (
              Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-md bg-surface-elevated" />
              ))
            ) : query.error ? (
              <p role="alert" className="text-sm text-danger">
                {query.error.message}
              </p>
            ) : appointments.length === 0 ? (
              <p className="py-6 text-center text-text-muted">
                Todavía no tienes citas — reserva la primera con el botón de arriba.
              </p>
            ) : (
              appointments.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  forClient
                  actions={
                    CANCELLABLE.includes(a.status) && !isTempId(a.id) ? (
                      <button
                        type="button"
                        onClick={() => setToCancel(a)}
                        disabled={cancel.isPending && cancel.variables === a.id}
                        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-60"
                      >
                        {cancel.isPending && cancel.variables === a.id ? (
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        ) : null}
                        Cancelar
                      </button>
                    ) : null
                  }
                />
              ))
            )}
          </div>
        </section>

        <Link
          to="/reservar"
          className="card-tech card-tech-interactive flex flex-col items-start p-6 lg:order-first lg:col-span-1"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-md border border-line bg-surface-elevated text-electric">
            <CalendarPlus className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-text">Reservar nueva cita</h2>
          <p className="mt-2 text-sm text-text-muted">
            Elige servicio, fecha y si prefieres presencial o videollamada.
          </p>
          <span className="btn-primary mt-5 px-5 py-2.5 text-sm">Reservar cita</span>
        </Link>
      </div>

      <AlertDialog open={Boolean(toCancel)} onOpenChange={(v) => !v && setToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar esta cita?</AlertDialogTitle>
            <AlertDialogDescription>
              {toCancel
                ? `${toCancel.services?.title ?? "Consulta general"} · ${toCancel.preferred_time}`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mantener</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => {
                if (toCancel) cancel.mutate(toCancel.id);
                setToCancel(null);
              }}
            >
              Cancelar cita
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
