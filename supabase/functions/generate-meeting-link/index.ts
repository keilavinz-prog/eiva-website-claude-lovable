// Edge Function: genera el enlace "Añadir a Google Calendar" y, si es videollamada, el enlace
// de la videollamada (Jitsi Meet) de una cita CONFIRMADA. Solo admin o el empleado asignado.
import { createClient } from "npm:@supabase/supabase-js@2";
import { composeLinks } from "./compose.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json(405, { error: "Método no permitido" });

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) return json(500, { error: "Configuración incompleta" });

  // 1) Identidad de quien llama (nunca se confía en datos del cliente)
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return json(401, { error: "No autenticado" });

  const asUser = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await asUser.auth.getUser(token);
  const user = userData?.user;
  if (userError || !user) return json(401, { error: "Sesión no válida" });

  let appointmentId: unknown;
  try {
    appointmentId = (await req.json())?.appointment_id;
  } catch {
    return json(400, { error: "Cuerpo no válido" });
  }
  if (typeof appointmentId !== "string" || !UUID.test(appointmentId)) {
    return json(400, { error: "appointment_id no válido" });
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 2) Autorización: admin (is_admin() con la identidad del usuario) o empleado asignado
  const { data: isAdmin } = await asUser.rpc("is_admin");
  const { data: appt, error: apptError } = await admin
    .from("appointments")
    .select("id, status, meeting_type, preferred_date, preferred_time, assigned_to, services(title)")
    .eq("id", appointmentId)
    .maybeSingle();
  if (apptError) return json(500, { error: "No se pudo leer la cita" });

  let allowed = isAdmin === true;
  if (!allowed && appt && appt.assigned_to === user.id) {
    const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
    allowed = profile?.role === "empleado";
  }
  if (!allowed) return json(403, { error: "No tienes permiso sobre esta cita" });

  // 3) La cita debe existir y estar confirmada
  if (!appt || appt.status !== "confirmada") {
    return json(400, { error: "La cita no existe o no está confirmada" });
  }

  const { data: company } = await admin
    .from("company_info")
    .select("name, address, phone")
    .eq("id", 1)
    .maybeSingle();

  const service = appt.services as { title: string } | { title: string }[] | null;
  const serviceTitle = Array.isArray(service) ? (service[0]?.title ?? null) : (service?.title ?? null);

  let links: { calendar_event_id: string; meet_link: string | null };
  try {
    links = composeLinks(
      { ...appt, service_title: serviceTitle },
      {
        name: company?.name ?? "EEIVA",
        address: company?.address ?? null,
        phone: company?.phone ?? null,
      },
    );
  } catch (e) {
    return json(400, { error: (e as Error).message });
  }

  // 4) Guardar (con la clave de servicio: estas columnas no son editables desde el cliente)
  const { error: updError } = await admin.from("appointments").update(links).eq("id", appt.id);
  if (updError) return json(500, { error: "No se pudo guardar el enlace" });

  return json(200, links);
});
