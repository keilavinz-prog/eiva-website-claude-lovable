-- FASE 4 · Paso 0 + permisos operativos de admin (aplicada el 2026-09-24).
-- Provisionales hasta el hardening de Fase 8. No hay ALTER de columnas.

-- 0) Registro público: SIEMPRE 'cliente'. Se ignora cualquier rol enviado en los metadatos.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), split_part(new.email, '@', 1)),
    new.email,
    'cliente'
  );
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- 1) ¿El usuario autenticado es admin? Lee profiles.role en BD (nunca un valor del cliente).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 2) Contenido público: lectura pública + escritura SOLO admin.
do $$
declare t text;
begin
  foreach t in array array['services','projects','testimonials','team_members'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true)', t || '_select_public', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_admin())', t || '_insert_admin', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t || '_update_admin', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin())', t || '_delete_admin', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- 3) Proveedores: CRUD completo solo admin.
create policy providers_select_admin on public.providers for select to authenticated using (public.is_admin());
create policy providers_insert_admin on public.providers for insert to authenticated with check (public.is_admin());
create policy providers_update_admin on public.providers for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy providers_delete_admin on public.providers for delete to authenticated using (public.is_admin());
revoke truncate on public.providers from authenticated;

-- 4) Solicitudes de contacto: admin lee todas y solo puede cambiar el estado.
create policy contact_requests_select_admin on public.contact_requests for select to authenticated using (public.is_admin());
create policy contact_requests_update_admin on public.contact_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
revoke insert, update, delete, truncate on public.contact_requests from authenticated;
grant update (status) on public.contact_requests to authenticated;

-- 5) Citas: admin lee todas y solo puede cambiar el estado.
create policy appointments_select_admin on public.appointments for select to authenticated using (public.is_admin());
create policy appointments_update_admin on public.appointments for update to authenticated using (public.is_admin()) with check (public.is_admin());
revoke insert, update, delete, truncate on public.appointments from authenticated;
grant update (status) on public.appointments to authenticated;
