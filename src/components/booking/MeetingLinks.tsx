import { CalendarPlus, Video } from "lucide-react";

const linkClass =
  "inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm text-text transition-colors hover:border-electric hover:text-electric";

/** Enlaces de una cita confirmada: añadir a Google Calendar y unirse a la videollamada. */
export function MeetingLinks({
  calendarUrl,
  meetUrl,
  forClient = false,
}: {
  calendarUrl: string | null;
  meetUrl: string | null;
  forClient?: boolean;
}) {
  if (!calendarUrl && !meetUrl) return null;
  return (
    <>
      {calendarUrl ? (
        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          {forClient ? "Añadir a mi calendario" : "Añadir a Calendario"}
        </a>
      ) : null}
      {meetUrl ? (
        <a href={meetUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <Video className="h-4 w-4" aria-hidden="true" />
          Unirse a videollamada
        </a>
      ) : null}
    </>
  );
}
