import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { friendlyError } from "@/lib/admin/api";

export type AssignedAppointment = Tables<"appointments"> & { services: { title: string } | null };
export type AssignedRequest = Tables<"contact_requests"> & { services: { title: string } | null };
export type Provider = Tables<"providers">;

export async function listAssignedAppointments(userId: string): Promise<AssignedAppointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*, services(title)")
    .eq("assigned_to", userId)
    .order("preferred_date", { ascending: true });
  if (error) throw new Error(friendlyError(error));
  return (data ?? []) as AssignedAppointment[];
}

export async function listAssignedRequests(userId: string): Promise<AssignedRequest[]> {
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*, services(title)")
    .eq("assigned_to", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyError(error));
  return (data ?? []) as AssignedRequest[];
}

/** Cambia el estado; lanza error si RLS no dejó actualizar ninguna fila. */
async function updateStatus(
  table: "appointments" | "contact_requests",
  id: string,
  status: string,
) {
  const { data, error } = await supabase.from(table).update({ status }).eq("id", id).select("id");
  if (error) throw new Error(friendlyError(error));
  if (!data || data.length === 0) throw new Error("No tienes permisos para esta acción.");
}

export const setAssignedAppointmentStatus = (id: string, status: string) =>
  updateStatus("appointments", id, status);
export const setAssignedRequestStatus = (id: string, status: string) =>
  updateStatus("contact_requests", id, status);

/** Vincula la cuenta de proveedor con su ficha (por email) y devuelve la ficha, o null. */
export async function linkAndGetMyProvider(userId: string): Promise<Provider | null> {
  const link = await supabase.rpc("link_provider_account");
  if (link.error) throw new Error(friendlyError(link.error));
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(friendlyError(error));
  return data;
}
