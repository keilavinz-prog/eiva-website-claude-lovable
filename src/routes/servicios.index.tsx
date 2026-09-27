import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchCompany, fetchProjects, fetchServices, fetchTestimonials } from "@/lib/site-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FilterChips } from "@/components/site/FilterChips";
import { ServiceCard } from "@/components/site/ServiceCard";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { Testimonials } from "@/components/site/Testimonials";
import { EmptyState } from "@/components/site/EmptyState";
import { PageSkeleton } from "@/components/site/Skeletons";
import { breadcrumbLd, ldScript, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/servicios/")({
  loader: async () => {
    const [company, services, projects, testimonials] = await Promise.all([
      fetchCompany(),
      fetchServices(),
      fetchProjects(),
      fetchTestimonials(),
    ]);
    return { company, services, projects, testimonials };
  },
  head: () => {
    const title = "Servicios de Electricista en Valencia | Presupuesto Gratis";
    const description =
      "Instalaciones de baja y alta tensión, automatización, fotovoltaica y mantenimiento en Valencia, con más de 25 años de experiencia. Presupuesto sin compromiso.";
    const crumbs = [{ label: "Inicio", to: "/" }, { label: "Servicios" }];
    const og = pageMeta({ title, description, path: "/servicios" });
    return {
      meta: [{ title }, { name: "description", content: description }, ...og.meta],
      links: og.links,
      scripts: [ldScript(breadcrumbLd(crumbs))],
    };
  },
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: ServiciosPage,
});

function ServiciosPage() {
  const { company, services, projects, testimonials } = Route.useLoaderData();
  const [filter, setFilter] = useState<string>("Todos");
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
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
        title="Instalaciones eléctricas seguras, legalizadas y con garantía"
        subtitle="Desde baja tensión hasta fotovoltaica: diseño, ejecución y mantenimiento, con más de 25 años de experiencia en Valencia."
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
      {featuredProjects.length > 0 ? <FeaturedProjects projects={featuredProjects} /> : null}
      {testimonials.length > 0 ? <Testimonials testimonials={testimonials} /> : null}
    </PageShell>
  );
}
