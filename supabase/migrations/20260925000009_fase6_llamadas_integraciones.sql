-- FASE 6 · Integraciones (aplicada el 2026-09-25). Operativo/provisional (auditoría en Fase 8).

-- 1) Nuevo tipo de cita: 'llamada' (solicitudes de devolución de llamada)
alter table public.appointments drop constraint appointments_meeting_type_check;
alter table public.appointments add constraint appointments_meeting_type_check
  check (meeting_type in ('presencial', 'videollamada', 'llamada'));

-- 2) Solicitud pública de llamada (mismo patrón que submit_contact_request)
create or replace function public.request_callback(p_name text, p_phone text, p_preferred_time text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[\s\-\.\(\)]', '', 'g');
  v_id uuid;
begin
  if p_name is null or char_length(trim(p_name)) < 3 or char_length(p_name) > 120 then
    raise exception 'Escribe tu nombre completo (mínimo 3 caracteres).' using errcode = '22023';
  end if;
  if v_phone !~ '^(\+34|0034|34)?[6789][0-9]{8}$' then
    raise exception 'Introduce un teléfono español válido.' using errcode = '22023';
  end if;
  if p_preferred_time is null or p_preferred_time not in ('09:00-11:00', '11:00-13:00', '16:00-18:00') then
    raise exception 'Elige un horario válido.' using errcode = '22023';
  end if;
  -- Protección básica contra envíos repetidos: máx. 3 solicitudes por teléfono y hora
  if (select count(*) from public.appointments
       where meeting_type = 'llamada' and phone = v_phone
         and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Ya hemos recibido tu solicitud. Te llamaremos pronto.' using errcode = '22023';
  end if;

  insert into public.appointments
    (client_id, name, email, phone, service_id, preferred_date, preferred_time, meeting_type, status)
  values
    (null, trim(p_name), 'sin-email@pendiente.eeiva.es', v_phone, null, current_date,
     p_preferred_time, 'llamada', 'pendiente')
  returning id into v_id;

  return v_id;
end;
$$;
revoke all on function public.request_callback(text, text, text) from public;
grant execute on function public.request_callback(text, text, text) to anon, authenticated;
