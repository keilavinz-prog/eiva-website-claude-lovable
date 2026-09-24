import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { isRole, type SessionProfile } from "@/lib/auth";

/** En el navegador: adjunta el token de la sesión actual a la llamada al servidor. */
const attachSession = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next(token ? { headers: { Authorization: `Bearer ${token}` } } : {});
});

/**
 * En el servidor: valida el token y lee el perfil (y su rol) desde la tabla profiles
 * con la identidad del propio usuario (RLS: solo su fila). Devuelve null si no hay
 * sesión válida. Es la fuente de verdad para decidir el acceso a los dashboards.
 */
export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([attachSession])
  .handler(async (): Promise<SessionProfile | null> => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return null;

    const auth = getRequest()?.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (token.split(".").length !== 3) return null;

    const db = createClient<Database>(url, key, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    const { data: claims, error: claimsError } = await db.auth.getClaims(token);
    const userId = claims?.claims?.sub;
    if (claimsError || !userId) return null;

    const { data, error } = await db
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data || !isRole(data.role)) return null;

    return { id: data.id, full_name: data.full_name, email: data.email, role: data.role };
  });
