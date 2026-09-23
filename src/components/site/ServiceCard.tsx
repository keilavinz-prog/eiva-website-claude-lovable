import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ServiceIcon } from "./icons";
import type { Service } from "@/lib/site-data";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card-tech card-tech-interactive flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-line bg-surface-elevated text-electric">
          <ServiceIcon name={service.icon} className="h-6 w-6" />
        </div>
        {service.category ? <span className="badge-amber">{service.category}</span> : null}
      </div>
      <h3 className="mt-5 text-lg leading-snug font-semibold text-text">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
        {service.short_description}
      </p>
      <Link
        to="/servicios/$slug"
        params={{ slug: service.slug }}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-electric hover:underline"
      >
        Ver detalle
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
