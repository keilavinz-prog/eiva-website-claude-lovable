import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/lib/seo";

type Entry = { loc: string; lastmod?: string | null; changefreq: string; priority: string };

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] as string,
  );
}

function entryXml({ loc, lastmod, changefreq, priority }: Entry): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : "";
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Sitemap dinámico: rutas estáticas conocidas + servicios, proyectos y artículos de blog
 * reales (leídos de Supabase). Se excluyen a propósito las rutas de cuenta/panel y /reservar,
 * que ya llevan `noindex` y no son contenido indexable.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [services, projects, posts] = await Promise.all([
          supabase.from("services").select("slug"),
          supabase.from("projects").select("slug, created_at"),
          supabase
            .from("blog_posts")
            .select("slug, updated_at, published_at")
            .eq("published", true)
            .lte("published_at", new Date().toISOString()),
        ]);

        const entries: Entry[] = [
          { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
          { loc: `${SITE_URL}/servicios`, changefreq: "monthly", priority: "0.8" },
          { loc: `${SITE_URL}/proyectos`, changefreq: "weekly", priority: "0.7" },
          { loc: `${SITE_URL}/sobre-nosotros`, changefreq: "monthly", priority: "0.5" },
          { loc: `${SITE_URL}/requisitos-legales`, changefreq: "monthly", priority: "0.5" },
          { loc: `${SITE_URL}/contacto`, changefreq: "monthly", priority: "0.5" },
          { loc: `${SITE_URL}/blog`, changefreq: "weekly", priority: "0.6" },
          ...(services.data ?? []).map((s) => ({
            loc: `${SITE_URL}/servicios/${s.slug}`,
            changefreq: "monthly",
            priority: "0.8",
          })),
          ...(projects.data ?? []).map((p) => ({
            loc: `${SITE_URL}/proyectos/${p.slug}`,
            lastmod: p.created_at,
            changefreq: "weekly",
            priority: "0.7",
          })),
          ...(posts.data ?? []).map((post) => ({
            loc: `${SITE_URL}/blog/${post.slug}`,
            lastmod: post.updated_at,
            changefreq: "monthly",
            priority: "0.6",
          })),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entryXml).join("\n")}
</urlset>
`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
