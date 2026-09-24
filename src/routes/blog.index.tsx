import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchCompany } from "@/lib/site-data";
import { fetchPosts } from "@/lib/blog-data";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FilterChips } from "@/components/site/FilterChips";
import { PostCard } from "@/components/site/PostCard";
import { EmptyState } from "@/components/site/EmptyState";
import { Reveal } from "@/components/site/Reveal";
import { PageSkeleton } from "@/components/site/Skeletons";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const [company, posts] = await Promise.all([fetchCompany(), fetchPosts()]);
    return { company, posts };
  },
  head: () => ({
    meta: [
      { title: "Blog | EEIVA · Electrotecnia e Ingeniería Valencia" },
      {
        name: "description",
        content:
          "Guías y novedades sobre instalaciones eléctricas, alta tensión, energía solar y mantenimiento, del equipo de EEIVA.",
      },
    ],
  }),
  pendingComponent: () => <PageSkeleton variant="grid" />,
  pendingMs: 150,
  component: BlogPage,
});

function BlogPage() {
  const { company, posts } = Route.useLoaderData();
  const [filter, setFilter] = useState("Todos");
  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts],
  );
  const visible = filter === "Todos" ? posts : posts.filter((p) => p.category === filter);
  const [first, ...rest] = visible;

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={<Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Blog" }]} />}
        kicker="// blog"
        title="Actualidad y guías técnicas"
        subtitle="Normativa, consejos y novedades sobre instalaciones eléctricas, explicados por el equipo de EEIVA."
      />
      <section className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {categories.length > 2 ? (
            <FilterChips
              label="Filtrar artículos por categoría"
              options={categories}
              value={filter}
              onChange={setFilter}
            />
          ) : null}

          {first ? (
            <div key={filter} className="mt-10 space-y-5">
              <Reveal>
                <PostCard post={first} featured />
              </Reveal>
              {rest.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <Reveal key={post.id} delay={i * 80}>
                      <PostCard post={post} />
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                message={
                  posts.length === 0
                    ? "Todavía no hay artículos publicados. Vuelve pronto."
                    : "No hay artículos en esta categoría todavía."
                }
              />
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
