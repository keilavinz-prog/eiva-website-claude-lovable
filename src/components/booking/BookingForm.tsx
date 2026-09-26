import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleCheck, LoaderCircle, MapPin, RotateCcw, Video } from "lucide-react";
import { toast } from "sonner";
import { Field, inputClass } from "@/components/auth/fields";
import { AppointmentCard } from "./AppointmentCard";
import {
  MEETING_TYPES,
  myAppointmentsKey,
  TIME_SLOTS,
  createAppointment,
  fetchMyPhone,
  todayISO,
  type MyAppointment,
  type NewAppointment,
} from "@/lib/booking";
import { DASHBOARD_BY_ROLE, type SessionProfile } from "@/lib/auth";
import type { Service } from "@/lib/site-data";
import { ConsentCheckbox } from "@/components/site/ConsentCheckbox";
import { CONSENT_ERROR } from "@/lib/consent";
import { OfflineNotice } from "@/components/site/OfflineNotice";
import {
  OFFLINE_MESSAGE,
  PENDING_KEYS,
  clearPending,
  isOffline,
  readPending,
  savePending,
  useOnReconnect,
} from "@/lib/offline";

const PENDING_KEY = PENDING_KEYS.booking;

const PHONE = /^[+\d][\d\s-]{6,19}$/;

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Escribe al menos 3 caracteres.")
    .max(120, "Máximo 120 caracteres."),
  email: z.string().trim().min(1, "Escribe tu email.").email("Revisa el formato del email."),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || PHONE.test(v), "Introduce un teléfono válido."),
  service_id: z.string().min(1, "Elige un servicio."),
  preferred_date: z
    .string()
    .min(1, "Elige una fecha.")
    .refine((v) => v >= todayISO(), "La fecha no puede ser anterior a hoy."),
  preferred_time: z.enum(TIME_SLOTS, { message: "Elige una franja horaria." }),
  meeting_type: z.enum(MEETING_TYPES),
  consent: z.boolean().refine((v) => v, CONSENT_ERROR),
});
type Values = z.infer<typeof schema>;

/** Formulario de reserva con confirmación optimista (la tarjeta aparece al instante). */
export function BookingForm({
  profile,
  services,
  initialServiceId,
}: {
  profile: SessionProfile;
  services: Service[];
  initialServiceId?: string | undefined;
}) {
  const qc = useQueryClient();
  const [bookedId, setBookedId] = useState<string | null>(null);
  // Reserva guardada sin conexión (solo si es de este mismo usuario)
  const [pending, setPending] = useState<NewAppointment | null>(null);
  const [savedOffline, setSavedOffline] = useState(false);
  useEffect(() => {
    const saved = readPending<NewAppointment>(PENDING_KEY);
    setPending(saved && saved.client_id === profile.id ? saved : null);
  }, [profile.id]);

  function keepForLater(payload: NewAppointment) {
    savePending(PENDING_KEY, payload);
    setPending(payload);
    setSavedOffline(true);
  }
  const key = myAppointmentsKey(profile.id);
  const phone = useQuery({
    queryKey: ["me", profile.id, "phone"],
    queryFn: () => fetchMyPhone(profile.id),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.full_name,
      email: profile.email,
      phone: "",
      service_id: initialServiceId ?? "",
      preferred_date: "",
      preferred_time: TIME_SLOTS[0],
      meeting_type: "presencial",
      consent: false,
    },
  });

  // Prefill del teléfono cuando llega (sin pisar lo que ya haya escrito el usuario)
  useEffect(() => {
    if (phone.data && !getValues("phone")) setValue("phone", phone.data);
  }, [phone.data, getValues, setValue]);

  const book = useMutation({
    mutationFn: (payload: NewAppointment) => createAppointment(payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<MyAppointment[]>(key);
      const temp: MyAppointment = {
        ...payload,
        id: `temp-${Date.now()}`,
        status: "pendiente",
        assigned_to: null,
        meet_link: null,
        calendar_event_id: null,
        created_at: new Date().toISOString(),
        services: { title: services.find((s) => s.id === payload.service_id)?.title ?? "" },
      };
      qc.setQueryData<MyAppointment[]>(key, (rows) => [...(rows ?? []), temp]);
      setBookedId(temp.id);
      return { prev, tempId: temp.id };
    },
    onSuccess: (real, _payload, ctx) => {
      clearPending(PENDING_KEY);
      setPending(null);
      setSavedOffline(false);
      qc.setQueryData<MyAppointment[]>(key, (rows) =>
        (rows ?? []).map((r) => (r.id === ctx?.tempId ? real : r)),
      );
      setBookedId(real.id);
    },
    onError: (e: Error, payload, ctx) => {
      qc.setQueryData(key, ctx?.prev);
      setBookedId(null);
      if (isOffline()) {
        keepForLater(payload);
        return;
      }
      toast.error("No se ha podido guardar la cita", {
        description: e.message,
        action: { label: "Reintentar", onClick: () => book.mutate(payload) },
      });
    },
  });

  function submitBooking(payload: NewAppointment) {
    if (isOffline()) {
      keepForLater(payload);
      return;
    }
    book.mutate(payload);
  }

  // Al volver la conexión se reintenta sola la reserva pendiente
  useOnReconnect(() => {
    const saved = readPending<NewAppointment>(PENDING_KEY);
    if (saved && saved.client_id === profile.id && !book.isPending) book.mutate(saved);
  });

  const onSubmit = (v: Values) =>
    submitBooking({
      client_id: profile.id,
      name: v.name,
      email: v.email,
      phone: v.phone || null,
      service_id: v.service_id,
      preferred_date: v.preferred_date,
      preferred_time: v.preferred_time,
      meeting_type: v.meeting_type,
      // Solo se llega aquí con la casilla marcada (validación del formulario)
      consent_accepted: v.consent,
    });

  const cached = qc.getQueryData<MyAppointment[]>(key);
  const booked = bookedId ? cached?.find((a) => a.id === bookedId) : undefined;

  if (bookedId && booked) {
    return (
      <div className="space-y-6" role="status">
        <div className="flex items-start gap-3">
          <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-success" aria-hidden="true" />
          <div>
            <p className="text-lg font-semibold text-text">¡Cita solicitada!</p>
            <p className="mt-1 text-text-muted">
              Te confirmaremos por email en las próximas horas.
            </p>
          </div>
        </div>
        <AppointmentCard appointment={booked} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to={DASHBOARD_BY_ROLE[profile.role]} className="btn-primary px-6 py-3 text-sm">
            Ver mis citas
          </Link>
          <button
            type="button"
            onClick={() => {
              setBookedId(null);
              reset({ ...getValues(), preferred_date: "", consent: false });
            }}
            className="btn-secondary px-6 py-3 text-sm"
          >
            Reservar otra cita
          </button>
        </div>
      </div>
    );
  }

  const meetingType = watch("meeting_type");
  const consent = watch("consent");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Nombre completo *" error={errors.name?.message}>
          <input id="name" autoComplete="name" className={inputClass} {...register("name")} />
        </Field>
        <Field id="email" label="Email *" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
        </Field>
        <Field id="phone" label="Teléfono (opcional)" error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+34 600 000 000"
            className={inputClass}
            {...register("phone")}
          />
        </Field>
        <Field id="service_id" label="Servicio *" error={errors.service_id?.message}>
          <select id="service_id" className={inputClass} {...register("service_id")}>
            <option value="">Elige un servicio</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>
        <Field id="preferred_date" label="Fecha preferida *" error={errors.preferred_date?.message}>
          <input
            id="preferred_date"
            type="date"
            min={todayISO()}
            className={inputClass}
            {...register("preferred_date")}
          />
        </Field>
        <Field id="preferred_time" label="Hora preferida *" error={errors.preferred_time?.message}>
          <select id="preferred_time" className={inputClass} {...register("preferred_time")}>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-text">Tipo de reunión *</legend>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Tipo de reunión">
          {(
            [
              { value: "presencial", label: "Presencial", Icon: MapPin },
              { value: "videollamada", label: "Videollamada", Icon: Video },
            ] as const
          ).map(({ value, label, Icon }) => {
            const active = meetingType === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setValue("meeting_type", value)}
                className={`flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-electric bg-electric/10 text-text"
                    : "border-line text-text-muted hover:border-electric/60 hover:text-text"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {savedOffline ? (
        <OfflineNotice>{OFFLINE_MESSAGE}</OfflineNotice>
      ) : pending && !book.isPending ? (
        <OfflineNotice
          action={
            <button
              type="button"
              onClick={() => submitBooking(pending)}
              className="inline-flex items-center gap-1.5 font-medium text-electric hover:underline"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reintentar ahora
            </button>
          }
        >
          Tienes una reserva pendiente de enviar.
        </OfflineNotice>
      ) : null}

      <ConsentCheckbox
        id="booking-consent"
        registration={register("consent")}
        error={errors.consent?.message}
      />

      <button
        type="submit"
        disabled={book.isPending || !consent}
        className="btn-primary w-full px-6 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
      >
        {book.isPending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            Confirmando...
          </>
        ) : (
          "Confirmar reserva"
        )}
      </button>
    </form>
  );
}
