import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { RoleBadge } from "./RoleBadge";
import { initials, type SessionProfile } from "@/lib/auth";

/** Entrada de la barra lateral. Con `soon` se muestra deshabilitada ("Pronto"). */
export type ShellNavItem = {
  label: string;
  to: string;
  Icon: LucideIcon;
  exact?: boolean;
  soon?: boolean;
};

function SidebarContent({
  profile,
  onLogout,
  nav,
  onNavigate,
}: {
  profile: SessionProfile;
  onLogout: () => void;
  nav: ShellNavItem[];
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="px-6 pt-6">
        <Logo className="text-2xl" />
      </Link>

      <div className="mx-4 mt-6 flex items-center gap-3 rounded-md border border-line bg-surface p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-display text-sm font-semibold text-white">
          {initials(profile.full_name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text">{profile.full_name}</p>
          <div className="mt-1">
            <RoleBadge role={profile.role} />
          </div>
        </div>
      </div>

      <nav aria-label="Panel" className="mt-6 flex-1 space-y-1 overflow-y-auto px-3">
        {nav.map(({ label, to, Icon, exact, soon }) =>
          soon ? (
            <span
              key={to}
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-muted/70"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="flex-1">{label}</span>
              <span className="font-mono text-[0.625rem]">Pronto</span>
            </span>
          ) : (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              activeOptions={{ exact: Boolean(exact) }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-surface-elevated hover:text-text"
              activeProps={{ className: "bg-surface-elevated font-medium text-text" }}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ),
        )}
      </nav>

      <div className="space-y-1 border-t border-line p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-surface-elevated hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a la web
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

/** Estructura común de los paneles: barra lateral (cajón en móvil) + contenido. */
export function DashboardShell({
  profile,
  children,
  nav,
}: {
  profile: SessionProfile;
  children: ReactNode;
  nav: ShellNavItem[];
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function logout() {
    await supabase.auth.signOut();
    await navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-canvas text-text">
      {/* Barra lateral fija (escritorio) */}
      <aside className="theme-space bg-blueprint fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-line lg:block">
        <SidebarContent profile={profile} onLogout={logout} nav={nav} />
      </aside>

      {/* Barra superior (móvil) */}
      <header className="theme-space sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-canvas/90 px-5 backdrop-blur lg:hidden">
        <Link to="/">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú del panel"
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-text"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Cajón lateral (móvil) */}
      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú del panel"
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <aside className="theme-space bg-blueprint absolute inset-y-0 left-0 w-80 max-w-[85%] animate-in border-r border-line duration-300 slide-in-from-left">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="absolute top-5 right-4 rounded-md p-2 text-text-muted hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              profile={profile}
              onLogout={logout}
              nav={nav}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <main className="lg:pl-72">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">{children}</div>
      </main>
    </div>
  );
}
