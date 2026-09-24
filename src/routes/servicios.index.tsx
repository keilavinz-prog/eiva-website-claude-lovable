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

export const Route = createFileRoute("/servicios/")({
  loader: async () => {
    const [company, services] = await Promise.all([fetchCompany(), fetchServices()]);
    return { company, services };
  },
  head: () => ({
    meta: [
      { title: "Áreas de trabajo | EEIVA" },
      {
        name: "description",
        content:
          "Áreas de trabajo de EEIVA: instalaciones eléctricas, energías renovables, automatización, telecomunicaciones, seguridad y eficiencia energética.",
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
        breadcrumb={
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Áreas de trabajo" }]} />
        }
        kicker="// áreas de trabajo"
        title="Áreas de trabajo"
        subtitle="Un departamento de ingeniería para resolver cualquier cuestión relacionada con el sector eléctrico"
      />
      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FilterChips
            label="Filtrar áreas de trabajo por categoría"
            options={categories}
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
              <EmptyState message="No hay áreas de trabajo en esta categoría todavía." />
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
