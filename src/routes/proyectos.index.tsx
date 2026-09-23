import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchCompany, fetchProjects } from "@/lib/site-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FilterChips } from "@/components/site/FilterChips";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EmptyState } from "@/components/site/EmptyState";
import { PageSkeleton } from "@/components/site/Skeletons";

const CATEGORIES = [
  "Todos",
  "Industrial",
  "Residencial",
  "Hostelería",
  "Energía Solar",
  "Comercial",
  "Residencial Premium",
  "Movilidad Eléctrica",
] as const;

export const Route = createFileRoute("/proyectos/")({
  loader: async () => {
    const [company, projects] = await Promise.all([fetchCompany(), fetchProjects()]);
    return { company, projects };
  },
  head: () => ({
    meta: [
      { title: "Proyectos | EEIVA" },
      {
        name: "description",
        content: "Más de 500 instalaciones eléctricas ejecutadas en toda la Comunidad Valenciana.",
      },
    ],
  }),
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: ProyectosPage,
});

function ProyectosPage() {
  const { company, projects } = Route.useLoaderData();
  const [filter, setFilter] = useState<string>("Todos");
  const visible = filter === "Todos" ? projects : projects.filter((p) => p.category === filter);

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={<Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Proyectos" }]} />}
        kicker="// proyectos"
        title="Proyectos Ejecutados"
        subtitle="Más de 500 instalaciones en toda la Comunidad Valenciana"
      />
      <section className="theme-light bg-blueprint py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FilterChips
            label="Filtrar proyectos por categoría"
            options={CATEGORIES}
            value={filter}
            onChange={setFilter}
          />
          <div key={filter} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <div
                key={p.id}
                className="animate-in fill-mode-both duration-500 fade-in zoom-in-95"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
          {visible.length === 0 ? (
            <div className="mt-10">
              <EmptyState message="No hay proyectos en esta categoría todavía." />
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
