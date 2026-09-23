-- Fase 1 · Blindaje temporal hasta Fase 8 (aplicada en Supabase el 2026-09-23).
-- NO crea ninguna política RLS.
-- 1) Tablas con datos personales (sin uso en Fase 1): RLS activada sin políticas = bloqueadas para anon/authenticated.
alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.contact_requests enable row level security;
alter table public.appointments enable row level security;

-- 2) Tablas de contenido público: solo lectura para anon/authenticated.
revoke insert, update, delete, truncate on public.company_info, public.services, public.projects, public.testimonials, public.team_members from anon, authenticated;
grant select on public.company_info, public.services, public.projects, public.testimonials, public.team_members to anon, authenticated;
