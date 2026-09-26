/**
 * Utilidades de SEO compartidas: URL absoluta, meta Open Graph/Twitter, canonical y JSON-LD.
 *
 * IMPORTANTE: SITE_URL apunta hoy al dominio real en producción (eeiva.lovable.app).
 * Cuando se migre a eeiva.es, actualizar ÚNICAMENTE esta constante.
 */
export const SITE_URL = "https://eeiva.lovable.app";

/** Imagen de reserva para Open Graph cuando la página no tiene una propia (foto real ya usada en el sitio). */
export const DEFAULT_OG_IMAGE =
  "https://eeiva.es/wp-content/uploads/2020/04/maintenance-engineers-2021-08-26-16-53-14-utc.jpg";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type Crumb = { label: string; to?: string };

/** meta (Open Graph + Twitter Card) y link canonical comunes a toda página pública. */
export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null | undefined;
  type?: "website" | "article";
}) {
  const url = absoluteUrl(path);
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  return {
    meta: [
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/** Envuelve un objeto JSON-LD en la forma que espera `scripts` dentro de head(). */
export function ldScript(data: Record<string, unknown>) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

/** @id estable de la organización, para referenciarla desde Service/Article sin repetir sus datos. */
export const ORG_ID = `${SITE_URL}/#organization`;

/**
 * JSON-LD de la empresa (home): combina ElectricalContractor + LocalBusiness.
 * La dirección se parte a mano a partir del texto libre de company_info.address (único campo en BD);
 * si cambia la dirección real, actualizar también estos campos.
 */
export function organizationLd(company: {
  name: string;
  phone: string | null;
  email: string | null;
  schedule: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["ElectricalContractor", "LocalBusiness"],
    "@id": ORG_ID,
    name: company.name,
    url: SITE_URL,
    telephone: company.phone ? `+34${company.phone.replace(/\D/g, "")}` : undefined,
    email: company.email ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Siderurgia nº31",
      postalCode: "46520",
      addressLocality: "Puerto de Sagunto",
      addressRegion: "Valencia",
      addressCountry: "ES",
    },
    areaServed: { "@type": "AdministrativeArea", name: "Valencia" },
    openingHoursSpecification: company.schedule?.includes("24h")
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
          },
        ]
      : undefined,
    sameAs: [
      "https://www.instagram.com/eeivainstalaciones",
      "https://www.facebook.com/profile.php?id=100066451961767",
      "https://twitter.com/eeivainstalaci1",
    ],
  };
}

/** JSON-LD de un servicio, referenciando a la organización como proveedor. */
export function serviceLd(service: { title: string; short_description: string }, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.short_description,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "AdministrativeArea", name: "Valencia" },
  };
}

/** JSON-LD de migas de pan; refleja exactamente los mismos `items` que ve el usuario en <Breadcrumbs>. */
export function breadcrumbLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.to ? absoluteUrl(item.to) : undefined,
    })),
  };
}

/** JSON-LD de un artículo de blog. */
export function articleLd(
  post: {
    title: string;
    excerpt: string;
    cover_url: string | null;
    published_at: string | null;
    updated_at: string;
  },
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_url ?? DEFAULT_OG_IMAGE,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    author: { "@type": "Organization", name: "EEIVA", "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}
