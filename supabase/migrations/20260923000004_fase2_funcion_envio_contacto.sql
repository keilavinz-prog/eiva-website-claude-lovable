-- Fase 2 · Envío del formulario de contacto sin abrir la tabla contact_requests (aplicada el 2026-09-23).
-- No crea políticas RLS ni modifica columnas: la web solo puede INSERTAR a través de esta función,
-- y nunca puede leer, editar ni borrar solicitudes.
create or replace function public.submit_contact_request(
  p_name text,
  p_email text,
  p_message text,
  p_phone text default null,
  p_service_id uuid default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
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

  insert into public.contact_requests (name, email, phone, message, service_id, source)
  values (trim(p_name), lower(trim(p_email)), nullif(trim(coalesce(p_phone, '')), ''), trim(p_message), p_service_id, 'web')
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_contact_request(text, text, text, text, uuid) from public;
grant execute on function public.submit_contact_request(text, text, text, text, uuid) to anon, authenticated;
