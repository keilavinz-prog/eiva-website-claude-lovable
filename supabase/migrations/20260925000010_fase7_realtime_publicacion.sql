-- FASE 7 · Tiempo real (aplicada el 2026-09-25): publicar cambios de solicitudes y citas.
-- Realtime respeta RLS: cada usuario solo recibe eventos de las filas que puede leer.
alter publication supabase_realtime add table public.contact_requests;
alter publication supabase_realtime add table public.appointments;
