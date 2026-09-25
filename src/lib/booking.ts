import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { friendlyError } from "@/lib/admin/api";

/** Franjas horarias disponibles para reservar. */
export const TIME_SLOTS = ["09:00-11:00", "11:00-13:00", "16:00-18:00"] as const;
export const MEETING_TYPES = ["presencial", "videollamada"] as const;
export type MeetingType = (typeof MEETING_TYPES)[number];

export type MyAppointment = Tables<"appointments"> & { services: { title: string } | null };

/** Clave de caché compartida por la reserva y el panel del cliente (incluye el usuario). */
export const myAppointmentsKey = (userId: string) => ["me", userId, "appointments"] as const;

export function isTempId(id: string) {
  return id.startsWith("temp-");
}

/** Hoy en formato YYYY-MM-DD (hora local), para impedir fechas pasadas. */
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDay(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function listMyAppointments(clientId: string): Promise<MyAppointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*, services(title)")
    .eq("client_id", clientId)
    .order("preferred_date", { ascending: true });
  if (error) throw new Error(friendlyError(error));
  return (data ?? []) as MyAppointment[];
}

export type NewAppointment = {
  client_id: string;
  name: string;
  email: string;
  phone: string | null;
  service_id: string;
  preferred_date: string;
  preferred_time: string;
  meeting_type: MeetingType;
};

/** Crea la cita (estado 'pendiente' por defecto; meet_link y calendar_event_id quedan a null hasta la Fase 6). */
export async function createAppointment(values: NewAppointment): Promise<MyAppointment> {
  const { data, error } = await supabase
    .from("appointments")
    .insert(values)
    .select("*, services(title)")
    .single();
  if (error) throw new Error(friendlyError(error));
  return data as MyAppointment;
}

export async function cancelMyAppointment(id: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("cancel_my_appointment", { appointment_id: id });
  if (error) throw new Error(friendlyError(error));
  return data === true;
}

export async function fetchMyPhone(userId: string): Promise<string | null> {
  const { data } = await supabase.from("profiles").select("phone").eq("id", userId).maybeSingle();
  return data?.phone ?? null;
}
