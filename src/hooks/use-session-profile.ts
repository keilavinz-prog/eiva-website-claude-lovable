import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isRole, type SessionProfile } from "@/lib/auth";

type State =
  | { status: "loading"; profile: null }
  | { status: "anon"; profile: null }
  | { status: "auth"; profile: SessionProfile };

/** Estado de sesión para la interfaz (cabecera). No se usa para decidir accesos. */
export function useSessionProfile(): State {
  const [state, setState] = useState<State>({ status: "loading", profile: null });

  useEffect(() => {
    let active = true;

    async function load(userId: string | undefined) {
      if (!userId) {
        if (active) setState({ status: "anon", profile: null });
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email, role")
        .eq("id", userId)
        .maybeSingle();
      if (!active) return;
      if (data && isRole(data.role)) {
        setState({
          status: "auth",
          profile: { id: data.id, full_name: data.full_name, email: data.email, role: data.role },
        });
      } else {
        setState({ status: "anon", profile: null });
      }
    }

    void supabase.auth.getSession().then(({ data }) => load(data.session?.user.id));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Diferido para no llamar a Supabase dentro del propio callback de auth
      setTimeout(() => void load(session?.user.id), 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
