import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import { fetchCompany } from "@/lib/site-data";
import { fetchPostBySlug, fetchPosts } from "@/lib/blog-data";
import { formatLongDate, readingMinutes } from "@/lib/format";
import { PageShell } from "@/components/site/PageShell";
import { PageHero } from "@/components/site/PageHero";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { RichText } from "@/components/site/RichText";
import { SafeImage } from "@/components/site/SafeImage";
import { PostCard } from "@/components/site/PostCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand } from "@/components/site/CtaBand";
import { PageSkeleton } from "@/components/site/Skeletons";
import { NotFoundPanel } from "@/components/site/NotFoundPanel";
import { Header } from "@/components/site/Header";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const [company, post, all] = await Promise.all([
      fetchCompany(),
      fetchPostBySlug(params.slug),
      fetchPosts(),
    ]);
    const others = all.filter((p) => p.id !== post.id);
    const sameCategory = others.filter((p) => p.category === post.category);
    const related = [...sameCategory, ...others.filter((p) => p.category !== post.category)].slice(
      0,
      2,
    );
    return { company, post, related };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} | Blog EEIVA` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
          ...(loaderData.post.cover_url
            ? [{ property: "og:image", content: loaderData.post.cover_url }]
            : []),
        ]
      : [{ title: "Artículo no encontrado | EEIVA" }],
  }),
  pendingComponent: () => <PageSkeleton variant="detail" />,
  pendingMs: 150,
  notFoundComponent: PostNotFound,
  component: BlogPostPage,
});

function PostNotFound() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <NotFoundPanel
        title="Este artículo no existe"
        message="Puede que el enlace esté mal escrito o que el artículo ya no esté publicado."
      >
        <Link to="/blog" className="btn-primary px-7 py-3.5">
          Ver todos los artículos
        </Link>
        <Link to="/" className="btn-secondary px-7 py-3.5">
          Volver al inicio
        </Link>
      </NotFoundPanel>
    </div>
  );
}

function BlogPostPage() {
  const { company, post, related } = Route.useLoaderData();
  const date = formatLongDate(post.published_at);

  return (
    <PageShell company={company}>
      <PageHero
        breadcrumb={
          <Breadcrumbs
            items={[
              { label: "Inicio", to: "/" },
              { label: "Blog", to: "/blog" },
              { label: post.title },
            ]}
          />
        }
        title={post.title}
        subtitle={post.excerpt}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-xs text-text-muted">
          <span className="badge-amber">{post.category}</span>
          {date ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-electric" aria-hidden="true" />
              <time dateTime={post.published_at ?? undefined}>{date}</time>
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-electric" aria-hidden="true" />
            {readingMinutes(post.content)} min de lectura
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="h-4 w-4 text-electric" aria-hidden="true" />
            {post.author}
          </span>
        </div>
      </PageHero>

      <article className="theme-light bg-canvas py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {post.cover_url ? (
            <div className="-mt-4 mb-12 aspect-[16/9] overflow-hidden rounded-lg border border-line bg-surface-elevated">
              <SafeImage
                src={post.cover_url}
                alt={post.title}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <RichText text={post.content} lead />
          <div className="mt-12 border-t border-line pt-6">
            <Link to="/blog" className="text-sm font-medium text-electric hover:underline">
              ← Volver al blog
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="theme-light border-t border-line bg-surface py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SectionHeading kicker="// blog" title="Sigue leyendo" />
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand title="¿Tienes un proyecto en mente?">
        <Link to="/contacto" className="btn-accent px-8 py-4 text-base">
          Solicitar consulta
        </Link>
      </CtaBand>
    </PageShell>
  );
}
