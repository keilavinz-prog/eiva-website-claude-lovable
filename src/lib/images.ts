import type { Project, TeamMember } from "@/lib/site-data";

/** Imágenes provisionales (Unsplash) mientras no haya fotos reales en BD. */
const PROJECT_PLACEHOLDERS: readonly [string, ...string[]] = [
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=70",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=70",
];

const PORTRAIT_PLACEHOLDERS: readonly [string, ...string[]] = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=750&q=70",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=750&q=70",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=750&q=70",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&h=750&q=70",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&h=750&q=70",
];

/** Imagen de portada: image_url → primera de la galería → provisional. */
export function projectCover(project: Project, index = 0): string {
  return (
    project.image_url ??
    project.gallery_urls?.[0] ??
    PROJECT_PLACEHOLDERS[index % PROJECT_PLACEHOLDERS.length] ??
    PROJECT_PLACEHOLDERS[0]
  );
}

/** Todas las imágenes de un proyecto para la galería (sin duplicados). */
export function projectImages(project: Project): string[] {
  const all = [project.image_url, ...(project.gallery_urls ?? [])].filter((u): u is string =>
    Boolean(u),
  );
  const unique = Array.from(new Set(all));
  return unique.length > 0 ? unique : [PROJECT_PLACEHOLDERS[0]];
}

export function teamPhoto(member: TeamMember, index: number): string {
  return (
    member.photo_url ??
    PORTRAIT_PLACEHOLDERS[index % PORTRAIT_PLACEHOLDERS.length] ??
    PORTRAIT_PLACEHOLDERS[0]
  );
}

/** Imágenes de cada servicio (tomadas de eeiva.es). */
const SERVICE_IMAGES: Record<string, string> = {
  "revision-mantenimiento-instalaciones-electricas":
    "https://eeiva.es/wp-content/uploads/2020/04/maintenance-engineers-2021-08-26-16-53-14-utc.jpg",
  "ingenieria-automatizacion-control":
    "https://eeiva.es/wp-content/uploads/2020/04/maintenance-engineer-solar-energy-systems-enginee-2022-11-14-08-55-20-utc.jpg",
  "legalizacion-gestion-proyectos-ingenieria":
    "https://eeiva.es/wp-content/uploads/2020/04/a-man-signs-a-contrac-legal-or-business-agreement-2022-11-11-23-30-25-utc-1.jpg",
};

export function serviceImage(slug: string): string | null {
  return SERVICE_IMAGES[slug] ?? null;
}
