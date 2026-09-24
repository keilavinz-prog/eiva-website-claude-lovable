import { DashboardShell } from "./DashboardShell";
import { DASHBOARD_CONFIG } from "./dashboard-config";
import { Reveal } from "@/components/site/Reveal";
import type { SessionProfile } from "@/lib/auth";

/** Contenido provisional del panel: bienvenida + 3 accesos rápidos (aún sin activar). */
export function RoleDashboard({ profile }: { profile: SessionProfile }) {
  const { subtitle, items } = DASHBOARD_CONFIG[profile.role];
  return (
    <DashboardShell profile={profile}>
      <Reveal>
        <p className="font-mono text-xs text-electric">// panel</p>
        <h1 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
          Hola, {profile.full_name} <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-3 text-lg text-text-muted">{subtitle}</p>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ title, phase, Icon }, i) => (
          <Reveal key={title} delay={i * 80}>
            <div
              aria-disabled="true"
              className="card-tech flex h-full cursor-not-allowed flex-col p-6 opacity-80"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-md border border-line bg-surface-elevated text-electric">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="badge-amber">Próximamente</span>
              </div>
              <h2 className="mt-5 text-lg font-semibold text-text">{title}</h2>
              <p className="mt-2 font-mono text-xs text-text-muted">Se activará en la {phase}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </DashboardShell>
  );
}
