-- Blog de EEIVA (aplicada el 2026-09-24): tabla + lectura pública solo de artículos publicados.
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_url text,
  category text not null,
  author text not null default 'Equipo EEIVA',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_published_idx on public.blog_posts (published, published_at desc);

-- Política provisional, a revisar en Fase 8. La escritura llegará con el panel admin (Fase 4).
alter table public.blog_posts enable row level security;
revoke insert, update, delete, truncate on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon, authenticated;

create policy "blog_posts_select_published_provisional_f8"
  on public.blog_posts for select to anon, authenticated
  using (published and published_at is not null and published_at <= now());

-- Los 3 artículos iniciales se insertaron por separado (INSERT de contenido):
-- mantenimiento-centros-de-transformacion, autoconsumo-fotovoltaico-aislado-o-conectado-a-red,
-- revision-instalaciones-publica-concurrencia.
