import { redirect } from "@tanstack/react-router";
import { getMyProfile } from "@/lib/auth.functions";
import { DASHBOARD_BY_ROLE, type Role, type SessionProfile } from "@/lib/auth";

/**
 * Guard de ruta por rol. La decisión la toma el servidor (getMyProfile valida el token
 * y lee profiles.role); el navegador solo aporta el token de su sesión.
 * - Sin sesión → /login
 * - Rol distinto → su propio dashboard (redirección silenciosa)
 */
export function requireRole(role: Role) {
  return async (): Promise<{ profile: SessionProfile }> => {
    let profile: SessionProfile | null = null;
    try {
      profile = await getMyProfile();
    } catch {
      profile = null;
    }
    if (!profile) throw redirect({ to: "/login" });
    if (profile.role !== role) throw redirect({ to: DASHBOARD_BY_ROLE[profile.role] });
    return { profile };
  };
}
