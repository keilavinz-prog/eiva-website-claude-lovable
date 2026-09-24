import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { SafeImage } from "./SafeImage";
import { formatLongDate, readingMinutes } from "@/lib/format";
import type { BlogPost } from "@/lib/blog-data";

function Meta({ post }: { post: BlogPost }) {
  const date = formatLongDate(post.published_at);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-text-muted">
      {date ? (
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
          <time dateTime={post.published_at ?? undefined}>{date}</time>
        </span>
      ) : null}
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
        {readingMinutes(post.content)} min de lectura
      </span>
    </div>
  );
}

/** Tarjeta de artículo. `featured` la muestra en horizontal y más grande. */
export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={`card-tech card-tech-interactive group grid h-full overflow-hidden ${
        featured ? "lg:grid-cols-2" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-surface-elevated ${
          featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-80" : "aspect-[16/10]"
        }`}
      >
        {post.cover_url ? (
          <SafeImage
            src={post.cover_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="bg-blueprint absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <span className="badge-amber absolute top-4 left-4">{post.category}</span>
      </div>
      <div className={`flex flex-col ${featured ? "p-6 sm:p-10" : "p-6"}`}>
        <Meta post={post} />
        <h3
          className={`mt-4 font-semibold text-text ${
            featured ? "text-2xl leading-tight sm:text-3xl" : "text-xl leading-snug"
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-text-muted">{post.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-electric">
          Leer artículo
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
