import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchCompany, fetchServices } from "@/lib/site-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FilterChips } from "@/components/site/FilterChips";
import { ServiceCard } from "@/components/site/ServiceCard";
import { EmptyState } from "@/components/site/EmptyState";
import { PageSkeleton } from "@/components/site/Skeletons";

export const Route = createFileRoute("/servicios/")({
  loader: async () => {
    const [company, services] = await Promise.all([fetchCompany(), fetchServices()]);
    return { company, services };
  },
  head: () => ({
    meta: [
      { title: "Servicios | EEIVA" },
      {
        name: "description",
        content:
          "Servicios de EEIVA: revisión y mantenimiento de instalaciones eléctricas, ingeniería de automatización y control, y legalización y gestión de proyectos.",
      },
    ],
  }),
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: ServiciosPage,
});

function ServiciosPage() {
  const { company, services } = Route.useLoaderData();
  const [filter, setFilter] = useState<string>("Todos");
  const categories = [
    "Todos",
    ...Array.from(new Set(services.map((s) => s.category).filter((c): c is string => Boolean(c)))),
  ];
  const visible = filter === "Todos" ? services : services.filter((s) => s.category === filter);

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={<Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Servicios" }]} />}
        kicker="// servicios"
        title="Nuestros servicios"
        subtitle="Soluciones integrales en ingeniería eléctrica: diseño, automatización y seguridad para proyectos eléctricos"
      />
      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FilterChips
            label="Filtrar servicios por categoría"
            options={categories}
            value={filter}
            onChange={setFilter}
          />
          <div key={filter} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((s, i) => (
              <div
                key={s.id}
                className="animate-in fill-mode-both duration-500 fade-in zoom-in-95"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ServiceCard service={s} />
              </div>
            ))}
          </div>
          {visible.length === 0 ? (
            <div className="mt-10">
              <EmptyState message="No hay servicios en esta categoría todavía." />
            </div>
          ) : null}
        </div>
      </section>
      <section className="theme-light border-t border-line bg-surface py-16 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-electric">// áreas de trabajo</p>
            <h2 className="mt-3 text-2xl font-bold text-text sm:text-3xl">
              Baja y alta tensión, renovables, telecomunicaciones, seguridad, climatización y más
            </h2>
            <p className="mt-3 text-text-muted">
              Descubre las 9 áreas en las que trabajamos a nivel provincial, nacional e
              internacional, con asistencia en averías las 24 horas, los 365 días del año.
            </p>
          </div>
          <Link to="/proyectos" className="btn-primary shrink-0 px-7 py-3.5">
            Ver áreas de trabajo
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
