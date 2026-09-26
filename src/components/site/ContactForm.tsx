import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleAlert, Check, LoaderCircle, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Service } from "@/lib/site-data";
import { ConsentCheckbox } from "./ConsentCheckbox";
import { CONSENT_ERROR } from "@/lib/consent";
import { OfflineNotice } from "./OfflineNotice";
import {
  OFFLINE_MESSAGE,
  PENDING_KEYS,
  clearPending,
  isNetworkError,
  isOffline,
  readPending,
  savePending,
  useOnReconnect,
} from "@/lib/offline";

const PENDING_KEY = PENDING_KEYS.contact;

const PHONE_ES = /^(\+34|0034)?[\s-]?[6-9](?:[\s-]?\d){8}$/;

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Escribe al menos 3 caracteres.")
    .max(120, "Máximo 120 caracteres."),
  email: z.string().trim().min(1, "El email es obligatorio.").email("Revisa el formato del email."),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || PHONE_ES.test(v), "Introduce un teléfono español válido."),
  service_id: z.string(),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(1000, "Máximo 1000 caracteres."),
  consent: z.boolean().refine((v) => v, CONSENT_ERROR),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-md border border-line bg-canvas px-4 py-3 text-text placeholder:text-text-muted/70 transition focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20 aria-[invalid=true]:border-danger";

function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  );
}

export function ContactForm({
  services,
  defaultServiceId,
}: {
  services: Service[];
  defaultServiceId?: string | undefined;
}) {
  const validDefault = services.some((s) => s.id === defaultServiceId) ? defaultServiceId! : "";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "offline">(
    "idle",
  );
  const [lastValues, setLastValues] = useState<FormValues | null>(null);
  // Envío guardado sin conexión (sobrevive a una recarga de la página)
  const [pending, setPending] = useState<FormValues | null>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    setPending(readPending<FormValues>(PENDING_KEY));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service_id: validDefault,
      message: "",
      consent: false,
    },
  });

  const messageLength = watch("message")?.length ?? 0;

  // Al volver la conexión se reintenta solo el envío pendiente
  useOnReconnect(() => {
    const saved = readPending<FormValues>(PENDING_KEY);
    if (saved) void send(saved);
  });

  function keepForLater(values: FormValues) {
    savePending(PENDING_KEY, values);
    setPending(values);
    setStatus("offline");
  }

  async function send(values: FormValues) {
    if (inFlight.current) return;
    setLastValues(values);
    if (isOffline()) {
      keepForLater(values);
      return;
    }
    inFlight.current = true;
    setStatus("sending");
    const args: {
      p_name: string;
      p_email: string;
      p_message: string;
      p_phone?: string;
      p_service_id?: string;
      p_consent: boolean;
    } = {
      p_name: values.name,
      p_email: values.email,
      p_message: values.message,
      p_consent: values.consent,
    };
    if (values.phone) args.p_phone = values.phone;
    if (values.service_id) args.p_service_id = values.service_id;
    let error: { message?: string } | null = null;
    try {
      ({ error } = await supabase.rpc("submit_contact_request", args));
    } catch (e) {
      error = { message: String(e) };
    }
    inFlight.current = false;
    if (error) {
      if (isNetworkError(error)) keepForLater(values);
      else setStatus("error");
      return;
    }
    clearPending(PENDING_KEY);
    setPending(null);
    setStatus("success");
    reset({ name: "", email: "", phone: "", service_id: "", message: "", consent: false });
  }

  if (status === "success") {
    return (
      <div className="card-tech flex flex-col items-center px-6 py-16 text-center" role="status">
        <span className="flex h-16 w-16 animate-in items-center justify-center rounded-full bg-success/15 text-success duration-500 zoom-in-50">
          <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <p className="mt-6 text-2xl font-semibold text-text">
          ¡Gracias! Te contactaremos en menos de 24h.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-secondary mt-8 px-6 py-3 text-sm"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(send)} noValidate className="card-tech space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text">
            Nombre completo <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Ej: Marta Solsona"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
            {...register("name")}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
            Email <span className="text-danger">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
            {...register("email")}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text">
            Teléfono <span className="text-text-muted">(opcional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+34 600 000 000"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={inputClass}
            {...register("phone")}
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>
        <div>
          <label htmlFor="service_id" className="mb-1.5 block text-sm font-medium text-text">
            Servicio de interés <span className="text-text-muted">(opcional)</span>
          </label>
          <select id="service_id" className={inputClass} {...register("service_id")}>
            <option value="">Otro / No lo sé</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text">
          Mensaje <span className="text-danger">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          maxLength={1000}
          placeholder="Cuéntanos qué necesitas..."
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : "message-count"}
          className={`${inputClass} resize-y`}
          {...register("message")}
        />
        <div className="mt-1.5 flex justify-between gap-4">
          <FieldError id="message-error" message={errors.message?.message} />
          <p id="message-count" className="ml-auto font-mono text-xs text-text-muted">
            {messageLength}/1000
          </p>
        </div>
      </div>

      <ConsentCheckbox
        id="consent"
        registration={register("consent")}
        error={errors.consent?.message}
      />

      {status === "offline" ? (
        <OfflineNotice>{OFFLINE_MESSAGE}</OfflineNotice>
      ) : pending && status !== "sending" ? (
        <OfflineNotice
          action={
            <button
              type="button"
              onClick={() => void send(pending)}
              className="inline-flex items-center gap-1.5 font-medium text-electric hover:underline"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reintentar ahora
            </button>
          }
        >
          Tienes una solicitud pendiente de enviar.
        </OfflineNotice>
      ) : null}

      {status === "error" ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-danger/40 bg-danger/10 p-4 text-sm text-text sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="inline-flex items-center gap-2">
            <CircleAlert className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
            No hemos podido enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.
          </span>
          {lastValues ? (
            <button
              type="button"
              onClick={() => void send(lastValues)}
              className="inline-flex items-center gap-1.5 font-medium text-electric hover:underline"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reintentar
            </button>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full px-7 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
            Enviando...
          </>
        ) : (
          "Enviar solicitud"
        )}
      </button>
    </form>
  );
}
