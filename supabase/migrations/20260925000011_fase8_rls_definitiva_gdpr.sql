-- FASE 8 · RLS definitiva + hardening + consentimiento RGPD (aplicada el 2026-09-25).
-- Ver HANDOFF FASE 8 para la auditoría previa y las pruebas negativas.

-- 1) Consentimiento
alter table public.contact_requests add column consent_accepted boolean not null default false;
alter table public.appointments add column consent_accepted boolean not null default false;

-- Se BORRAN las firmas antiguas: si no, seguiría existiendo una versión sin consentimiento.
drop function public.submit_contact_request(text, text, text, text, uuid);
create function public.submit_contact_request(
  p_name text, p_email text, p_message text,
  p_phone text default null, p_service_id uuid default null, p_consent boolean default false
)
returns uuid language plpgsql security definer set search_path = public
as $$
declare v_id uuid;
begin
  if p_consent is not true then
    raise exception 'Debes aceptar la política de privacidad' using errcode = '22023';
  end if;
  if p_name is null or char_length(trim(p_name)) < 3 or char_length(p_name) > 120 then
    raise exception 'Nombre no válido' using errcode = '22023';
  end if;
  if p_email is null or p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(p_email) > 254 then
    raise exception 'Email no válido' using errcode = '22023';
  end if;
  if p_message is null or char_length(trim(p_message)) < 10 or char_length(p_message) > 1000 then
    raise exception 'Mensaje no válido' using errcode = '22023';
  end if;
  if p_phone is not null and char_length(p_phone) > 30 then
    raise exception 'Teléfono no válido' using errcode = '22023';
  end if;
  if p_service_id is not null and not exists (select 1 from public.services where id = p_service_id) then
    p_service_id := null;
  end if;
  insert into public.contact_requests (name, email, phone, message, service_id, source, consent_accepted)
  values (trim(p_name), lower(trim(p_email)), nullif(trim(coalesce(p_phone, '')), ''), trim(p_message),
          p_service_id, 'web', true)
  returning id into v_id;
  return v_id;
end;
$$;
revoke all on function public.submit_contact_request(text, text, text, text, uuid, boolean) from public;
grant execute on function public.submit_contact_request(text, text, text, text, uuid, boolean) to anon, authenticated;

drop function public.request_callback(text, text, text);
create function public.request_callback(
  p_name text, p_phone text, p_preferred_time text, p_consent boolean default false
)
returns uuid language plpgsql security definer set search_path = public
as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[\s\-\.\(\)]', '', 'g');
  v_id uuid;
begin
  if p_consent is not true then
    raise exception 'Debes aceptar la política de privacidad' using errcode = '22023';
  end if;
  if p_name is null or char_length(trim(p_name)) < 3 or char_length(p_name) > 120 then
    raise exception 'Escribe tu nombre completo (mínimo 3 caracteres).' using errcode = '22023';
  end if;
  if v_phone !~ '^(\+34|0034|34)?[6789][0-9]{8}$' then
    raise exception 'Introduce un teléfono español válido.' using errcode = '22023';
  end if;
  if p_preferred_time is null or p_preferred_time not in ('09:00-11:00', '11:00-13:00', '16:00-18:00') then
    raise exception 'Elige un horario válido.' using errcode = '22023';
  end if;
  if (select count(*) from public.appointments
       where meeting_type = 'llamada' and phone = v_phone
         and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Ya hemos recibido tu solicitud. Te llamaremos pronto.' using errcode = '22023';
  end if;
  insert into public.appointments
    (client_id, name, email, phone, service_id, preferred_date, preferred_time, meeting_type, status, consent_accepted)
  values
    (null, trim(p_name), 'sin-email@pendiente.eeiva.es', v_phone, null, current_date,
     p_preferred_time, 'llamada', 'pendiente', true)
  returning id into v_id;
  return v_id;
end;
$$;
revoke all on function public.request_callback(text, text, text, boolean) from public;
grant execute on function public.request_callback(text, text, text, boolean) to anon, authenticated;

grant insert (consent_accepted) on public.appointments to authenticated;

-- 2) company_info: RLS + solo lectura pública
alter table public.company_info enable row level security;
create policy company_info_select_public on public.company_info
  for select to anon, authenticated using (true);
revoke insert, update, delete, truncate on public.company_info from anon, authenticated;

-- 3) Políticas provisionales -> definitivas
alter policy blog_posts_select_published_provisional_f8 on public.blog_posts rename to blog_posts_select_published;
alter policy profiles_select_own_provisional_f8 on public.profiles rename to profiles_select_own;
alter policy profiles_update_own_provisional_f8 on public.profiles rename to profiles_update_own;

-- 4) Hardening de privilegios
revoke all on public.contact_requests, public.appointments, public.providers, public.profiles from anon;
revoke insert, update, delete, truncate on
  public.services, public.projects, public.testimonials, public.team_members, public.blog_posts, public.company_info
  from anon;
revoke insert, update, delete, truncate on public.blog_posts from authenticated;
revoke truncate, references, trigger on
  public.company_info, public.services, public.projects, public.testimonials, public.team_members,
  public.providers, public.profiles, public.contact_requests, public.appointments, public.blog_posts
  from anon, authenticated;
