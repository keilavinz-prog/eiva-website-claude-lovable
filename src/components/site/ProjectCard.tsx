import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Zap } from "lucide-react";
import { SafeImage } from "./SafeImage";
import { projectCover } from "@/lib/images";
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/site-data";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const date = formatDate(project.completion_date);
  return (
    <Link
      to="/proyectos/$slug"
      params={{ slug: project.slug }}
      className="card-tech card-tech-interactive group block h-full overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        <SafeImage
          src={projectCover(project, index)}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <span className="badge-amber absolute top-4 left-4">{project.category}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-text">{project.title}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
          {project.location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-electric" aria-hidden="true" />
              {project.location}
            </span>
          ) : null}
          {date ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-electric" aria-hidden="true" />
              {date}
            </span>
          ) : null}
          {project.power_detail ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs">
              <Zap className="h-4 w-4 text-amber" aria-hidden="true" />
              {project.power_detail}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
