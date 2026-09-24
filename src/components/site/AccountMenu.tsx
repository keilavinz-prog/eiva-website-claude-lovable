import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSessionProfile } from "@/hooks/use-session-profile";
import { DASHBOARD_BY_ROLE, initials } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Zona de cuenta de la cabecera (escritorio). */
export function AccountMenu() {
  const session = useSessionProfile();
  const navigate = useNavigate();

  if (session.status === "loading")
    return <span className="hidden w-10 lg:block" aria-hidden="true" />;

  if (session.status === "anon") {
    return (
      <div className="hidden items-center gap-2 lg:flex">
        <Link
          to="/login"
          aria-label="Iniciar sesión"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-muted transition-colors hover:text-text xl:hidden"
        >
          <UserRound className="h-4 w-4" />
        </Link>
        <Link
          to="/login"
          className="hidden px-2 text-sm text-text-muted transition-colors hover:text-text xl:inline"
        >
          Iniciar sesión
        </Link>
        <Link to="/registro" className="btn-secondary hidden px-4 py-2 text-sm xl:inline-flex">
          Registrarse
        </Link>
      </div>
    );
  }

  const { profile } = session;
  async function logout() {
    await supabase.auth.signOut();
    await navigate({ to: "/" });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hidden items-center gap-2 rounded-full border border-line py-1 pr-3 pl-1 text-sm text-text transition-colors hover:border-electric lg:flex"
        aria-label="Menú de usuario"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand font-display text-xs font-semibold text-white">
          {initials(profile.full_name)}
        </span>
        <span className="hidden max-w-32 truncate xl:inline">{profile.full_name}</span>
        <ChevronDown className="h-4 w-4 text-text-muted" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{profile.full_name}</p>
          <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={DASHBOARD_BY_ROLE[profile.role]} className="cursor-pointer">
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Mi Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void logout()} className="cursor-pointer">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Enlaces de cuenta para el menú móvil. */
export function MobileAccountLinks({ onNavigate }: { onNavigate: () => void }) {
  const session = useSessionProfile();
  const navigate = useNavigate();
  if (session.status === "loading") return null;

  if (session.status === "anon") {
    return (
      <li className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-4">
        <Link to="/login" onClick={onNavigate} className="btn-secondary px-4 py-3 text-sm">
          Iniciar sesión
        </Link>
        <Link to="/registro" onClick={onNavigate} className="btn-secondary px-4 py-3 text-sm">
          Registrarse
        </Link>
      </li>
    );
  }

  const { profile } = session;
  return (
    <li className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-4">
      <Link
        to={DASHBOARD_BY_ROLE[profile.role]}
        onClick={onNavigate}
        className="btn-secondary px-4 py-3 text-sm"
      >
        Mi Dashboard
      </Link>
      <button
        type="button"
        onClick={async () => {
          onNavigate();
          await supabase.auth.signOut();
          await navigate({ to: "/" });
        }}
        className="btn-secondary px-4 py-3 text-sm"
      >
        Cerrar sesión
      </button>
    </li>
  );
}
