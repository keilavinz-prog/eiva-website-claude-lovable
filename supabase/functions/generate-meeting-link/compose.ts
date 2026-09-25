// Composición de enlaces de una cita (lógica pura, sin dependencias de Deno).

export type AppointmentForLinks = {
  id: string;
  preferred_date: string; // "YYYY-MM-DD" (hora local de Madrid)
  preferred_time: string; // "09:00-11:00"
  meeting_type: string; // presencial | videollamada | llamada
  service_title: string | null;
};

export type CompanyForLinks = {
  name: string;
  address: string | null;
  phone: string | null;
};

const TZ = "Europe/Madrid";

/** Minutos que la zona horaria va por delante de UTC en ese instante (tiene en cuenta el horario de verano). */
function tzOffsetMinutes(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - utcMs) / 60000);
}

/** Convierte fecha + hora locales de Madrid a un instante UTC. */
export function madridToUtc(date: string, hhmm: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const naive = Date.UTC(y, m - 1, d, h, mi);
  let utc = naive - tzOffsetMinutes(naive, TZ) * 60000;
  const again = naive - tzOffsetMinutes(utc, TZ) * 60000; // corrige cerca del cambio de hora
  if (again !== utc) utc = again;
  return new Date(utc);
}

/** Formato de fechas de Google Calendar: YYYYMMDDTHHMMSSZ */
export function toGoogleDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function parseSlot(slot: string): { start: string; end: string } {
  const m = /^(\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(slot.trim());
  if (!m) throw new Error(`Franja horaria no válida: ${slot}`);
  return { start: m[1], end: m[2] };
}

const TYPE_LABEL: Record<string, string> = {
  presencial: "Visita presencial",
  videollamada: "Videollamada",
  llamada: "Llamada telefónica",
};

export function composeLinks(appt: AppointmentForLinks, company: CompanyForLinks) {
  const { start, end } = parseSlot(appt.preferred_time);
  const dates = `${toGoogleDate(madridToUtc(appt.preferred_date, start))}/${toGoogleDate(
    madridToUtc(appt.preferred_date, end),
  )}`;

  // Sala real de Jitsi Meet: se crea al abrir el enlace, sin cuentas ni API. Se usa el id completo
  // de la cita (sin guiones) para que el nombre de la sala no se pueda adivinar.
  // Si en el futuro EEIVA conecta su cuenta de Google, aquí se sustituiría por Google Meet.
  const meet_link =
    appt.meeting_type === "videollamada"
      ? `https://meet.jit.si/EEIVA-Cita-${appt.id.replace(/-/g, "")}`
      : null;

  const typeLabel = TYPE_LABEL[appt.meeting_type] ?? "Cita";
  const title = `${appt.service_title ?? typeLabel} · EEIVA`;
  const location =
    appt.meeting_type === "presencial"
      ? (company.address ?? company.name)
      : appt.meeting_type === "videollamada"
        ? "Videollamada"
        : "Llamada telefónica";
  const details = [
    `Cita con ${company.name.replace(/\.$/, "")}.`,
    `Tipo: ${typeLabel}.`,
    meet_link ? `Enlace de la videollamada: ${meet_link}` : null,
    company.phone ? `Teléfono de contacto: ${company.phone}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const calendar_event_id =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${dates}` +
    `&location=${encodeURIComponent(location)}` +
    `&details=${encodeURIComponent(details)}`;

  return { calendar_event_id, meet_link };
}
