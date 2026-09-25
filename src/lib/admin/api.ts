import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type CrudTable = "services" | "projects" | "testimonials" | "team_members" | "providers";

// Cliente sin tipar para las operaciones genéricas; los tipos se aplican en la firma.
const db = supabase as unknown as SupabaseClient;

/** Traduce errores de Supabase/Postgres a mensajes comprensibles. */
export function friendlyError(
  error: { code?: string; message?: string } | null | undefined,
): string {
  switch (error?.code) {
    case "23505":
      return "Ya existe un registro con ese identificador (slug). Usa otro.";
    case "23503":
      return "No se puede eliminar porque hay solicitudes o citas asociadas.";
    case "23514":
      return "Algún valor no es válido para este campo.";
    case "42501":
      return "No tienes permisos para esta acción.";
    default:
      return "No se ha podido completar la acción. Revisa tu conexión e inténtalo de nuevo.";
  }
}

async function run<T>(
  p: PromiseLike<{ data: unknown; error: { code?: string; message?: string } | null }>,
): Promise<T> {
  const { data, error } = await p;
  if (error) throw new Error(friendlyError(error));
  return data as T;
}

export function crud<T extends CrudTable>(
  table: T,
  orderBy: { column: string; ascending?: boolean },
) {
  type Row = Tables<T>;
  return {
    list: () =>
      run<Row[]>(
        db
          .from(table)
          .select("*")
          .order(orderBy.column, { ascending: orderBy.ascending ?? true }),
      ),
    get: (id: string) => run<Row | null>(db.from(table).select("*").eq("id", id).maybeSingle()),
    insert: (values: TablesInsert<T>) =>
      run<Row>(db.from(table).insert(values).select("*").single()),
    update: (id: string, values: TablesUpdate<T>) =>
      run<Row>(db.from(table).update(values).eq("id", id).select("*").single()),
    remove: (id: string) => run<null>(db.from(table).delete().eq("id", id)),
    /** ¿Hay otro registro con este slug? (excluye el propio al editar) */
    slugTaken: async (slug: string, exceptId?: string) => {
      let q = db.from(table).select("id").eq("slug", slug);
      if (exceptId) q = q.neq("id", exceptId);
      const rows = await run<{ id: string }[]>(q);
      return rows.length > 0;
    },
    count: async () => {
      const { count, error } = await db.from(table).select("*", { count: "exact", head: true });
      if (error) throw new Error(friendlyError(error));
      return count ?? 0;
    },
  };
}

export const servicesApi = crud("services", { column: "order_index" });
export const projectsApi = crud("projects", { column: "created_at" });
export const testimonialsApi = crud("testimonials", { column: "created_at", ascending: false });
export const teamApi = crud("team_members", { column: "order_index" });
export const providersApi = crud("providers", { column: "company_name" });

export type RequestRow = Tables<"contact_requests"> & { services: { title: string } | null };
export type AppointmentRow = Tables<"appointments"> & { services: { title: string } | null };

export async function listRequests(): Promise<RequestRow[]> {
  return run<RequestRow[]>(
    db
      .from("contact_requests")
      .select("*, services(title)")
      .order("created_at", { ascending: false }),
  );
}

export async function setRequestStatus(id: string, status: string) {
  return run<null>(db.from("contact_requests").update({ status }).eq("id", id));
}

export async function listAppointments(): Promise<AppointmentRow[]> {
  return run<AppointmentRow[]>(
    db
      .from("appointments")
      .select("*, services(title)")
      .order("preferred_date", { ascending: true }),
  );
}

export async function setAppointmentStatus(id: string, status: string) {
  return run<null>(db.from("appointments").update({ status }).eq("id", id));
}

export async function countNewRequests(): Promise<{ total: number; nuevas: number }> {
  const [all, nuevas] = await Promise.all([
    db.from("contact_requests").select("*", { count: "exact", head: true }),
    db.from("contact_requests").select("*", { count: "exact", head: true }).eq("status", "nuevo"),
  ]);
  if (all.error) throw new Error(friendlyError(all.error));
  if (nuevas.error) throw new Error(friendlyError(nuevas.error));
  return { total: all.count ?? 0, nuevas: nuevas.count ?? 0 };
}

export async function countAppointments(): Promise<number> {
  const { count, error } = await db
    .from("appointments")
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(friendlyError(error));
  return count ?? 0;
}

export type Employee = { id: string; full_name: string; email: string };

/** Perfiles con rol empleado (para el selector "Asignar a"). */
export async function listEmployees(): Promise<Employee[]> {
  return run<Employee[]>(
    db.from("profiles").select("id, full_name, email").eq("role", "empleado").order("full_name"),
  );
}

export async function assignTo(
  table: "contact_requests" | "appointments",
  id: string,
  userId: string | null,
) {
  return run<null>(db.from(table).update({ assigned_to: userId }).eq("id", id));
}
