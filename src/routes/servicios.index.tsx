import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchCompany, fetchServices } from "@/lib/site-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FilterChips } from "@/components/site/FilterChips";
import { ServiceCard } from "@/components/site/ServiceCard";
import { EmptyState } from "@/components/site/EmptyState";
import { PageSkeleton } from "@/components/site/Skeletons";

const CATEGORIES = [
  "Todos",
  "Instalaciones",
  "Certificación",
  "Automatización",
  "Movilidad",
  "Energía",
  "Climatización",
  "Eficiencia",
  "Telecomunicaciones",
] as const;

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
          "Soluciones eléctricas integrales para vivienda, comercio e industria en Valencia.",
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
  const visible = filter === "Todos" ? services : services.filter((s) => s.category === filter);

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={<Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Servicios" }]} />}
        kicker="// servicios"
        title="Nuestros Servicios"
        subtitle="Soluciones eléctricas integrales para vivienda, comercio e industria"
      />
      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FilterChips
            label="Filtrar servicios por categoría"
            options={CATEGORIES}
            value={filter}
            onChange={setFilter}
          />
          <div
            key={filter}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
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
    </PageShell>
  );
}
