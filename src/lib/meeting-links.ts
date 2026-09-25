import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type MeetingLinks = { calendar_event_id: string; meet_link: string | null };

/** Llama a la Edge Function que genera los enlaces de una cita ya confirmada. */
export async function generateMeetingLink(appointmentId: string): Promise<MeetingLinks> {
  const { data, error } = await supabase.functions.invoke<MeetingLinks>("generate-meeting-link", {
    body: { appointment_id: appointmentId },
  });
  if (error || !data?.calendar_event_id) {
    throw new Error(
      "La cita está confirmada, pero no se han podido generar los enlaces de calendario.",
    );
  }
  return data;
}

/** Tras confirmar una cita: genera los enlaces y los refleja en la fila de la caché. */
export async function attachLinksAfterConfirm(
  qc: QueryClient,
  key: readonly unknown[],
  appointmentId: string,
) {
  try {
    const links = await generateMeetingLink(appointmentId);
    qc.setQueryData<{ id: string }[]>(key, (rows) =>
      rows?.map((r) => (r.id === appointmentId ? { ...r, ...links } : r)),
    );
    toast.success("Enlace de calendario generado");
  } catch (e) {
    toast.error((e as Error).message);
  }
}
