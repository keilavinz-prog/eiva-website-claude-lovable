import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTableChanges } from "@/lib/realtime";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ADMIN_NAV } from "../admin-nav";
import {
  countAppointmentsSummary,
  countNewRequests,
  projectsApi,
  providersApi,
  servicesApi,
  teamApi,
  testimonialsApi,
} from "@/lib/admin/api";

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

/** Portada del panel de admin: accesos reales con contadores en vivo. */
export function AdminHome({ name }: { name: string }) {
  const services = useQuery({
    queryKey: ["admin", "count", "services"],
    queryFn: servicesApi.count,
  });
  const projects = useQuery({
    queryKey: ["admin", "count", "projects"],
    queryFn: projectsApi.count,
  });
  const testimonials = useQuery({
    queryKey: ["admin", "count", "testimonials"],
    queryFn: testimonialsApi.count,
  });
  const team = useQuery({ queryKey: ["admin", "count", "team"], queryFn: teamApi.count });
  const providers = useQuery({
    queryKey: ["admin", "count", "providers"],
    queryFn: providersApi.count,
  });
  const requests = useQuery({
    queryKey: ["admin", "count", "requests"],
    queryFn: countNewRequests,
  });
  const appointments = useQuery({
    queryKey: ["admin", "count", "appointments"],
    queryFn: countAppointmentsSummary,
  });

  // Tiempo real: al entrar o cambiar una solicitud/cita, se refresca solo su contador
  const qc = useQueryClient();
  useTableChanges("admin-dashboard", ["contact_requests", "appointments"], (change) => {
    void qc.invalidateQueries({
      queryKey:
        change.table === "contact_requests"
          ? ["admin", "count", "requests"]
          : ["admin", "count", "appointments"],
    });
  });

  const cards = [
    {
      to: "/admin/servicios",
      count: services.data,
      label: (n: number) => plural(n, "servicio", "servicios"),
    },
    {
      to: "/admin/proyectos",
      count: projects.data,
      label: (n: number) => plural(n, "proyecto", "proyectos"),
    },
    {
      to: "/admin/testimonios",
      count: testimonials.data,
      label: (n: number) => plural(n, "testimonio", "testimonios"),
    },
    {
      to: "/admin/equipo",
      count: team.data,
      label: (n: number) => plural(n, "miembro", "miembros"),
    },
    {
      to: "/admin/proveedores",
      count: providers.data,
      label: (n: number) => plural(n, "proveedor", "proveedores"),
    },
    {
      to: "/admin/solicitudes",
      count: requests.data?.total,
      label: (n: number) => plural(n, "solicitud", "solicitudes"),
      pending: requests.data?.nuevas ?? 0,
      pendingLabel: ["nueva", "nuevas"] as const,
    },
    {
      to: "/admin/citas",
      count: appointments.data?.total,
      label: (n: number) => plural(n, "cita", "citas"),
      pending: appointments.data?.pendientes ?? 0,
      pendingLabel: ["pendiente", "pendientes"] as const,
    },
  ];

  return (
    <div>
      <Reveal>
        <p className="font-mono text-xs text-electric">// panel</p>
        <h1 className="mt-3 text-3xl font-bold text-text sm:text-4xl">
          Hola, {name} <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-3 text-lg text-text-muted">Panel de control general de EEIVA</p>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, i) => {
          const nav = ADMIN_NAV.find((n) => n.to === card.to);
          if (!nav) return null;
          const { Icon, label } = nav;
          return (
            <Reveal key={card.to} delay={i * 60}>
              <Link
                to={card.to}
                className="card-tech card-tech-interactive group flex h-full flex-col p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md border border-line bg-surface-elevated text-electric">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  {card.pending && card.pendingLabel ? (
                    <span className="badge-amber" aria-live="polite">
                      {plural(card.pending, card.pendingLabel[0], card.pendingLabel[1])}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-5 text-lg font-semibold text-text">{label}</h2>
                <p className="mt-1 font-mono text-sm text-text-muted">
                  {card.count === undefined ? (
                    <span className="inline-block h-4 w-20 animate-pulse rounded bg-surface-elevated align-middle" />
                  ) : (
                    card.label(card.count)
                  )}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-electric">
                  Gestionar
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
