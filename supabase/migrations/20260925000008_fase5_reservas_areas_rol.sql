-- FASE 5 · Reservas y áreas por rol (aplicada el 2026-09-25).
-- Políticas operativas provisionales (auditoría en Fase 8).

-- 1) Columnas nuevas
alter table public.appointments
  add column assigned_to uuid references public.profiles(id) on delete set null;
alter table public.contact_requests
  add column assigned_to uuid references public.profiles(id) on delete set null;
alter table public.providers
  add column user_id uuid references public.profiles(id) on delete set null,
  add constraint providers_user_id_unique unique (user_id);

-- 2) Privilegios de columna
-- Reserva: el cliente solo puede rellenar estos campos. status (pendiente por defecto), assigned_to,
-- meet_link y calendar_event_id NO son insertables desde el cliente.
grant insert (client_id, name, email, phone, service_id, preferred_date, preferred_time, meeting_type)
  on public.appointments to authenticated;
-- Estado + asignación (la asignación solo la puede cambiar el admin por las políticas de abajo)
grant update (status, assigned_to) on public.appointments to authenticated;
grant update (status, assigned_to) on public.contact_requests to authenticated;

-- 3) Políticas RLS nuevas
create policy appointments_insert_own on public.appointments
  for insert to authenticated
  with check (client_id = auth.uid());

create policy appointments_select_own_assigned_admin on public.appointments
  for select to authenticated
  using (client_id = auth.uid() or assigned_to = auth.uid() or public.is_admin());

create policy appointments_update_assigned on public.appointments
  for update to authenticated
  using (assigned_to = auth.uid())
  with check (assigned_to = auth.uid());

create policy contact_requests_select_assigned_admin on public.contact_requests
  for select to authenticated
  using (assigned_to = auth.uid() or public.is_admin());

create policy contact_requests_update_assigned on public.contact_requests
  for update to authenticated
  using (assigned_to = auth.uid())
  with check (assigned_to = auth.uid());

create policy providers_select_own_admin on public.providers
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Necesaria para el selector "Asignar a" del admin (listar empleados)
create policy profiles_select_admin on public.profiles
  for select to authenticated
  using (public.is_admin());

-- 4) Vincular la cuenta de proveedor con su ficha (por email)
create or replace function public.link_provider_account()
returns public.providers
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_row public.providers;
begin
  select p.email into v_email
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.id = auth.uid()
    and p.role = 'proveedor'
    and u.email_confirmed_at is not null;

  if v_email is null then
    return null;
  end if;

  update public.providers
     set user_id = auth.uid()
   where id = (
     select id from public.providers
      where lower(email) = lower(v_email) and user_id is null
      order by created_at
      limit 1
   )
  returning * into v_row;

  return v_row; -- null si no hay coincidencia
end;
$$;
revoke all on function public.link_provider_account() from public, anon;
grant execute on function public.link_provider_account() to authenticated;

-- 5) Cancelar una cita propia (solo pendiente o confirmada)
create or replace function public.cancel_my_appointment(appointment_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  update public.appointments
     set status = 'cancelada'
   where id = appointment_id
     and client_id = auth.uid()
     and status in ('pendiente', 'confirmada');
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;
revoke all on function public.cancel_my_appointment(uuid) from public, anon;
grant execute on function public.cancel_my_appointment(uuid) to authenticated;
