import { useState } from "react";
import { MapPin, Zap } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import type { Project } from "@/lib/home-data";

/**
 * Imágenes provisionales (Unsplash) mientras projects.image_url esté vacío.
 * En cuanto el cliente suba sus fotos a BD, se usan esas automáticamente.
 */
const PLACEHOLDER_IMAGES: readonly [string, ...string[]] = [
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=70",
];

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="bg-blueprint flex h-full w-full items-center justify-center">
        <Zap className="h-10 w-10 text-electric/60" aria-hidden="true" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section
      id="proyectos"
      className="theme-light bg-blueprint border-t border-line py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading kicker="// proyectos" title="Proyectos destacados" />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 100}>
              <article className="card-tech card-tech-interactive group overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
                  <ProjectImage
                    src={
                      p.image_url ??
                      PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length] ??
                      PLACEHOLDER_IMAGES[0]
                    }
                    alt={p.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="badge-amber absolute top-4 left-4 backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text">{p.title}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
                    {p.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-electric" aria-hidden="true" />
                        {p.location}
                      </span>
                    ) : null}
                    {p.power_detail ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                        <Zap className="h-4 w-4 text-amber" aria-hidden="true" />
                        {p.power_detail}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
