import type { ReactNode } from "react";
import { CalendarDays, LoaderCircle, MapPin, Phone, Video } from "lucide-react";
import { MeetingLinks } from "./MeetingLinks";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDay, isTempId } from "@/lib/booking";
import type { Tables } from "@/integrations/supabase/types";

type Appointment = Tables<"appointments"> & { services: { title: string } | null };

const MEETING_TYPE: Record<string, { label: string; Icon: typeof MapPin }> = {
  presencial: { label: "Presencial", Icon: MapPin },
  videollamada: { label: "Videollamada", Icon: Video },
  llamada: { label: "Llamada", Icon: Phone },
};

export function MeetingTypeBadge({ type }: { type: string }) {
  const { label, Icon } = MEETING_TYPE[type] ?? { label: type, Icon: MapPin };
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-elevated px-2.5 py-0.5 font-mono text-[0.6875rem] text-text-muted">
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

/** Tarjeta de una cita (cliente, empleado y confirmación de reserva). */
export function AppointmentCard({
  appointment,
  actions,
  extra,
  forClient = false,
  highlight = false,
}: {
  appointment: Appointment;
  actions?: ReactNode;
  extra?: ReactNode;
  forClient?: boolean;
  highlight?: boolean;
}) {
  const saving = isTempId(appointment.id);
  return (
    <div
      className={`rounded-md border border-line bg-surface p-4 ${highlight ? "rt-fresh-card" : ""}`}
      aria-busy={saving}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-text">
            {appointment.services?.title ?? "Consulta general"}
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-text-muted">
            <CalendarDays className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
            {formatDay(appointment.preferred_date)} · {appointment.preferred_time}
          </p>
          {extra}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MeetingTypeBadge type={appointment.meeting_type} />
          <StatusBadge status={appointment.status} />
          {saving ? (
            <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem] text-text-muted">
              <LoaderCircle className="h-3 w-3 animate-spin" aria-hidden="true" />
              Guardando
            </span>
          ) : null}
        </div>
      </div>
      {appointment.status === "confirmada" &&
      (appointment.calendar_event_id || appointment.meet_link) ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <MeetingLinks
            calendarUrl={appointment.calendar_event_id}
            meetUrl={appointment.meet_link}
            forClient={forClient}
          />
        </div>
      ) : null}
      {actions ? <div className="mt-3 flex flex-wrap justify-end gap-2">{actions}</div> : null}
    </div>
  );
}
