import { createFileRoute, Link } from "@tanstack/react-router";
import {
  fetchCompany,
  fetchProjects,
  fetchServiceBySlug,
  pickRelatedProjects,
} from "@/lib/site-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ServiceIcon } from "@/components/site/icons";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { PageSkeleton } from "@/components/site/Skeletons";
import { NotFoundPanel } from "@/components/site/NotFoundPanel";
import { Header } from "@/components/site/Header";

export const Route = createFileRoute("/servicios/$slug")({
  loader: async ({ params }) => {
    const [company, service, projects] = await Promise.all([
      fetchCompany(),
      fetchServiceBySlug(params.slug),
      fetchProjects(),
    ]);
    return { company, service, related: pickRelatedProjects(service, projects) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.service.title} | EEIVA` },
          { name: "description", content: loaderData.service.short_description },
        ]
      : [{ title: "Servicio no encontrado | EEIVA" }],
  }),
  pendingComponent: () => <PageSkeleton variant="detail" />,
  pendingMs: 150,
  notFoundComponent: ServiceNotFound,
  component: ServicioDetalle,
});

function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <NotFoundPanel
        title="Este servicio no existe"
        message="Puede que el enlace esté mal escrito o que el servicio ya no esté disponible."
      >
        <Link to="/servicios" className="btn-primary px-7 py-3.5">
          Ver todos los servicios
        </Link>
        <Link to="/" className="btn-secondary px-7 py-3.5">
          Volver al inicio
        </Link>
      </NotFoundPanel>
    </div>
  );
}

function ServicioDetalle() {
  const { company, service, related } = Route.useLoaderData();
  const paragraphs = (service.full_description ?? service.short_description)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: "Inicio", to: "/" },
              { label: "Servicios", to: "/servicios" },
              { label: service.title },
            ]}
          />
        }
        title={service.title}
        subtitle={service.short_description}
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-lg border border-line bg-surface text-electric shadow-glow">
            <ServiceIcon name={service.icon} className="h-8 w-8" />
          </span>
          {service.category ? <span className="badge-amber">{service.category}</span> : null}
        </div>
      </PageHero>

      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-[68ch] space-y-6 text-lg leading-relaxed text-text-muted">
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "text-xl text-text" : undefined}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="theme-light bg-blueprint border-t border-line py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading kicker="// proyectos" title="Proyectos relacionados" />
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProjectCard project={p} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand title="¿Necesitas este servicio?">
        <Link
          to="/contacto"
          search={{ service_id: service.id }}
          className="btn-accent px-8 py-4 text-base"
        >
          Solicitar presupuesto
        </Link>
      </CtaBand>
    </PageShell>
  );
}
