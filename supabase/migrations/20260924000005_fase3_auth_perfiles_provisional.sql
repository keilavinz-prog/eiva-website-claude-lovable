-- Fase 3 · Autenticación (aplicada el 2026-09-24).
-- Políticas PROVISIONALES de profiles, a revisar en Fase 8. No cambia la estructura de ninguna tabla.

-- 1) Privilegios de profiles: nada para anon; authenticated solo lee y edita campos no sensibles.
revoke all on public.profiles from anon;
revoke insert, update, delete, truncate on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, avatar_url) on public.profiles to authenticated; -- role, email e id NO editables

-- 2) Políticas RLS provisionales (RLS ya estaba activada desde Fase 1)
create policy "profiles_select_own_provisional_f8"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own_provisional_f8"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
-- INSERT: sin política para clientes. Solo lo hace el trigger handle_new_user (SECURITY DEFINER).

-- 3) Trigger de creación automática de perfil
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role', 'cliente');
begin
  -- Rol no reconocido -> cliente (evita que un valor extraño rompa el registro)
  if v_role not in ('cliente', 'admin', 'empleado', 'proveedor') then
    v_role := 'cliente';
  end if;

  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), split_part(new.email, '@', 1)),
    new.email,
    v_role
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
