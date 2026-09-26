import { useEffect, useState } from "react";
import { useMatches, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleCheck, LoaderCircle, MessageCircle, PhoneCall, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchCompany } from "@/lib/site-data";
import {
  CALLBACK_SLOTS,
  SPANISH_PHONE,
  cleanPhone,
  whatsappNumber,
  whatsappUrl,
} from "@/lib/contact-widgets";
import { Field, inputClass } from "@/components/auth/fields";
import { ConsentCheckbox } from "./ConsentCheckbox";
import { CONSENT_ERROR } from "@/lib/consent";

/** Zonas privadas donde no se muestran los widgets. */
const PRIVATE_PREFIXES = ["/admin", "/cliente", "/empleado", "/proveedor"];

type Panel = "whatsapp" | "callback" | null;

const panelClass =
  "absolute right-0 bottom-full mb-3 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-line bg-surface p-5 text-text shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none";

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Cerrar"
      className="absolute top-3 right-3 rounded-md p-1 text-text-muted transition-colors hover:text-text"
    >
      <X className="h-4 w-4" />
    </button>
  );
}

function WhatsAppPanel({
  number,
  serviceTitle,
  onClose,
}: {
  number: string;
  serviceTitle: string | null;
  onClose: () => void;
}) {
  return (
    <div
      id="panel-whatsapp"
      role="dialog"
      aria-label="Contactar por WhatsApp"
      className={panelClass}
    >
      <CloseButton onClick={onClose} />
      <p className="font-display font-semibold">EEIVA</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
        <span className="h-2 w-2 rounded-full bg-[#25D366]" aria-hidden="true" />
        Normalmente responde en unos minutos
      </p>
      <p className="mt-4 rounded-md border border-line bg-surface-elevated p-3 text-sm">
        {serviceTitle
          ? `¿Tienes dudas sobre ${serviceTitle}?`
          : "¿Necesitas ayuda con tu instalación eléctrica?"}
      </p>
      <a
        href={whatsappUrl(number, serviceTitle)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-[#0b2e1a] transition-transform hover:scale-[1.02]"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Escribir por WhatsApp
      </a>
    </div>
  );
}

const callbackSchema = z.object({
  name: z.string().trim().min(3, "Escribe al menos 3 caracteres.").max(120),
  phone: z
    .string()
    .trim()
    .min(1, "Escribe tu teléfono.")
    .refine((v) => SPANISH_PHONE.test(cleanPhone(v)), "Introduce un teléfono español válido."),
  slot: z.string().min(1, "Elige un horario."),
  consent: z.boolean().refine((v) => v, CONSENT_ERROR),
});
type CallbackValues = z.infer<typeof callbackSchema>;

function CallbackPanel({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<"form" | "sending" | "done">("form");
  const [error, setError] = useState<{ message: string; retry: boolean } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CallbackValues>({
    resolver: zodResolver(callbackSchema),
    defaultValues: { name: "", phone: "", slot: "", consent: false },
  });

  // Tras el éxito, el panel se cierra solo a los 4 segundos
  useEffect(() => {
    if (state !== "done") return;
    const t = window.setTimeout(() => {
      reset();
      setState("form");
      onClose();
    }, 4000);
    return () => window.clearTimeout(t);
  }, [state, reset, onClose]);

  async function onSubmit(v: CallbackValues) {
    setState("sending");
    setError(null);
    try {
      const { error: rpcError } = await supabase.rpc("request_callback", {
        p_name: v.name,
        p_phone: v.phone,
        p_preferred_time: v.slot,
        p_consent: v.consent,
      });
      if (rpcError) {
        // 22023 = validación del servidor, con mensaje ya pensado para el usuario
        setError(
          rpcError.code === "22023"
            ? { message: rpcError.message, retry: false }
            : { message: "No hemos podido enviar tu solicitud.", retry: true },
        );
        setState("form");
        return;
      }
      setState("done");
    } catch {
      setError({ message: "No hay conexión. Revisa tu red.", retry: true });
      setState("form");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className={panelClass}>
        <CloseButton onClick={onClose} />
        <div className="flex flex-col items-center py-4 text-center">
          <CircleCheck
            className="h-12 w-12 text-success animate-in zoom-in-50 duration-300 motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p className="mt-4 font-medium">¡Perfecto! Te llamaremos en el horario indicado.</p>
        </div>
      </div>
    );
  }

  const sending = state === "sending";
  return (
    <div id="panel-llamada" role="dialog" aria-label="Solicitar una llamada" className={panelClass}>
      <CloseButton onClick={onClose} />
      <p className="pr-6 font-display font-semibold">¿Prefieres que te llamemos?</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
        <Field id="cb-name" label="Nombre completo" error={errors.name?.message}>
          <input
            id="cb-name"
            autoComplete="name"
            placeholder="Ej: Javier Moreno"
            aria-invalid={errors.name ? "true" : "false"}
            className={`${inputClass} py-2.5`}
            {...register("name")}
          />
        </Field>
        <Field id="cb-phone" label="Teléfono" error={errors.phone?.message}>
          <input
            id="cb-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+34 600 000 000"
            aria-invalid={errors.phone ? "true" : "false"}
            className={`${inputClass} py-2.5`}
            {...register("phone")}
          />
        </Field>
        <Field id="cb-slot" label="Horario preferido" error={errors.slot?.message}>
          <select id="cb-slot" className={`${inputClass} py-2.5`} {...register("slot")}>
            <option value="">Elige una franja</option>
            {CALLBACK_SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <ConsentCheckbox
          id="cb-consent"
          registration={register("consent")}
          error={errors.consent?.message}
          compact
        />
        {error ? (
          <div role="alert" className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm">
            {error.message}
            {error.retry ? (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="ml-2 font-medium text-electric hover:underline"
              >
                Reintentar
              </button>
            ) : null}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={sending}
          className="btn-primary w-full px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Solicitar llamada
        </button>
        <p className="text-[0.6875rem] leading-snug text-text-muted">
          Servicio de devolución de llamada gestionado por nuestro equipo. Próximamente disponible
          con atención automatizada.
        </p>
      </form>
    </div>
  );
}

/** Widgets flotantes de contacto (WhatsApp y solicitud de llamada) para las páginas públicas. */
export function FloatingContact() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const matches = useMatches();
  const [open, setOpen] = useState<Panel>(null);
  const company = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
    staleTime: 10 * 60_000,
  });

  // Cerrar con Escape o al cambiar de página
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => setOpen(null), [pathname]);

  if (PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  // Título real del servicio cuando estamos en /servicios/[slug]
  const serviceMatch = matches.find((m) => m.routeId === "/servicios/$slug");
  const serviceTitle =
    (serviceMatch?.loaderData as { service?: { title?: string } } | undefined)?.service?.title ??
    null;
  const number = whatsappNumber(company.data?.whatsapp);
  const toggle = (p: Exclude<Panel, null>) => setOpen((cur) => (cur === p ? null : p));

  return (
    <div
      className="fixed right-4 z-40 flex flex-col items-end gap-3.5 sm:right-6"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="relative">
        {open === "callback" ? <CallbackPanel onClose={() => setOpen(null)} /> : null}
        <button
          type="button"
          onClick={() => toggle("callback")}
          aria-expanded={open === "callback"}
          aria-controls="panel-llamada"
          aria-label="Solicitar que te llamemos"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 transition duration-200 hover:scale-105 hover:shadow-brand/70 motion-reduce:transition-none"
        >
          {open === "callback" ? <X className="h-6 w-6" /> : <PhoneCall className="h-6 w-6" />}
        </button>
      </div>
      {number ? (
        <div className="relative">
          {open === "whatsapp" ? (
            <WhatsAppPanel
              number={number}
              serviceTitle={serviceTitle}
              onClose={() => setOpen(null)}
            />
          ) : null}
          <button
            type="button"
            onClick={() => toggle("whatsapp")}
            aria-expanded={open === "whatsapp"}
            aria-controls="panel-whatsapp"
            aria-label="Contactar por WhatsApp"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition duration-200 hover:scale-105 hover:shadow-[#25D366]/60 motion-reduce:transition-none"
          >
            {open === "whatsapp" ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
