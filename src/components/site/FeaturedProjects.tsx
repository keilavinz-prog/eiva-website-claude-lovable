import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/home-data";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section
      id="proyectos"
      className="theme-light bg-blueprint border-t border-line py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading kicker="// áreas de trabajo" title="Áreas de trabajo">
            Un departamento de ingeniería para resolver cualquier cuestión relacionada con el sector
            eléctrico.
          </SectionHeading>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 100}>
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/proyectos" className="btn-secondary px-6 py-3 text-sm">
            Ver todas las áreas de trabajo
          </Link>
        </div>
      </div>
    </section>
  );
}
