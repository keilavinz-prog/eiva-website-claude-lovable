import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchCompany, fetchProjectBySlug } from "@/lib/site-data";
import { projectImages } from "@/lib/images";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Gallery } from "@/components/site/Gallery";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { PageSkeleton } from "@/components/site/Skeletons";
import { NotFoundPanel } from "@/components/site/NotFoundPanel";
import { Header } from "@/components/site/Header";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/proyectos/$slug")({
  loader: async ({ params }) => {
    const [company, project] = await Promise.all([fetchCompany(), fetchProjectBySlug(params.slug)]);
    return { company, project };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} | Proyectos EEIVA` },
          {
            name: "description",
            content: (loaderData.project.description ?? loaderData.project.title).slice(0, 155),
          },
        ]
      : [{ title: "Proyecto no encontrado | EEIVA" }],
  }),
  pendingComponent: () => <PageSkeleton variant="detail" />,
  pendingMs: 150,
  notFoundComponent: ProjectNotFound,
  component: ProyectoDetalle,
});

function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <NotFoundPanel
        title="Este proyecto no existe"
        message="Puede que el enlace esté mal escrito o que el proyecto ya no esté publicado."
      >
        <Link to="/proyectos" className="btn-primary px-7 py-3.5">
          Ver todos los proyectos
        </Link>
        <Link to="/" className="btn-secondary px-7 py-3.5">
          Volver al inicio
        </Link>
      </NotFoundPanel>
    </div>
  );
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-4 last:border-b-0">
      <dt className="font-mono text-[0.6875rem] tracking-wider text-text-muted uppercase">
        {label}
      </dt>
      <dd className="font-mono text-sm text-text">{children}</dd>
    </div>
  );
}

function ProyectoDetalle() {
  const { company, project } = Route.useLoaderData();
  const images = projectImages(project);
  const date = formatDate(project.completion_date);
  const paragraphs = (project.description ?? "")
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
              { label: "Proyectos", to: "/proyectos" },
              { label: project.title },
            ]}
          />
        }
        title={project.title}
        subtitle={project.location ?? undefined}
      >
        <div className="mt-6">
          <span className="badge-amber">{project.category}</span>
        </div>
      </PageHero>

      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <Gallery images={images} title={project.title} />
            {paragraphs.length > 0 ? (
              <Reveal className="mt-10 max-w-[68ch] space-y-5 text-lg leading-relaxed text-text-muted">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Reveal>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card-tech p-6">
              <p className="font-mono text-xs text-electric">// ficha técnica</p>
              <dl className="mt-2">
                {project.client_name ? (
                  <SpecRow label="Cliente">{project.client_name}</SpecRow>
                ) : null}
                {project.location ? <SpecRow label="Ubicación">{project.location}</SpecRow> : null}
                <SpecRow label="Categoría">{project.category}</SpecRow>
                <SpecRow label="Fecha finalización">{date ?? "—"}</SpecRow>
                {project.power_detail ? (
                  <SpecRow label="Potencia">
                    <span className="font-semibold text-electric">{project.power_detail}</span>
                  </SpecRow>
                ) : null}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand title="¿Quieres un proyecto similar?">
        <Link to="/contacto" className="btn-accent px-8 py-4 text-base">
          Contactar ahora
        </Link>
      </CtaBand>
    </PageShell>
  );
}
