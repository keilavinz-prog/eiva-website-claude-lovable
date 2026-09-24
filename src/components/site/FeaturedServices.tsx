import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ServiceIcon } from "./icons";
import type { Service } from "@/lib/home-data";

export function FeaturedServices({ services }: { services: Service[] }) {
  return (
    <section id="servicios" className="theme-light bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            kicker="// servicios"
            title="Soluciones integrales en ingeniería eléctrica"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <article className="card-tech card-tech-interactive flex h-full flex-col p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-md border border-line bg-surface-elevated text-electric">
                  <ServiceIcon name={s.icon} className="h-6 w-6" />
                </div>
                {s.category ? (
                  <p className="mt-5 font-mono text-[0.6875rem] text-text-muted">{s.category}</p>
                ) : null}
                <h3 className="mt-2 text-lg leading-snug font-semibold text-text">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                  {s.short_description}
                </p>
                <Link
                  to="/servicios/$slug"
                  params={{ slug: s.slug }}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-electric hover:underline"
                  aria-label={`Ver más sobre ${s.title}`}
                >
                  Ver más
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/servicios" className="btn-secondary px-6 py-3 text-sm">
            Ver todos los servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
