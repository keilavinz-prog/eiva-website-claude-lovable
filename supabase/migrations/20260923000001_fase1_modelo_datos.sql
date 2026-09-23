-- Fase 1 · Modelo de datos EEIVA (aplicada en Supabase el 2026-09-23)
create table public.company_info (
  id integer primary key check (id = 1),
  name text not null default 'EEIVA Instalaciones Eléctricas S.L.',
  slogan text not null default 'Energía que conecta, calidad que perdura',
  cif text default 'B-98765432',
  address text default 'Polígono Industrial Fuente del Jarro, C/ Arquitecto Alfaro 12, 46988 Paterna (Valencia)',
  phone text default '+34 961 234 567',
  whatsapp text default '+34 611 234 567',
  email text default 'info@eeiva.es',
  schedule text default 'Lunes a Viernes, 8:00 - 18:00',
  founded_year integer default 1998,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null,
  full_description text,
  icon text not null,
  category text,
  featured boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text not null,
  location text,
  client_name text,
  image_url text,
  gallery_urls text[],
  completion_date date,
  power_detail text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  role_context text,
  content text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  avatar_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null,
  bio text,
  photo_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  service_category text,
  phone text,
  email text,
  status text not null default 'activo' check (status in ('activo','inactivo','pendiente')),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'cliente' check (role in ('cliente','admin','empleado','proveedor')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  service_id uuid references public.services(id),
  status text not null default 'nuevo' check (status in ('nuevo','en_proceso','cerrado')),
  source text default 'web',
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id),
  name text not null,
  email text not null,
  phone text,
  service_id uuid references public.services(id),
  preferred_date date not null,
  preferred_time text not null,
  meeting_type text not null default 'presencial' check (meeting_type in ('presencial','videollamada')),
  calendar_event_id text,
  meet_link text,
  status text not null default 'pendiente' check (status in ('pendiente','confirmada','cancelada','completada')),
  created_at timestamptz not null default now()
);
