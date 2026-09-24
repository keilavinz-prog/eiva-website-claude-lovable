import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoaderCircle, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/auth.functions";
import { DASHBOARD_BY_ROLE } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Field, FormAlert, inputClass } from "@/components/auth/fields";

const schema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(3, "Escribe al menos 3 caracteres.")
      .max(120, "Máximo 120 caracteres."),
    email: z.string().trim().min(1, "Escribe tu email.").email("Revisa el formato del email."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(/\d/, "La contraseña debe incluir al menos un número."),
    confirm: z.string().min(1, "Repite la contraseña."),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden.",
  });
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [{ title: "Crear cuenta | EEIVA" }, { name: "robots", content: "noindex" }],
  }),
  component: RegistroPage,
});

function RegistroPage() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", password: "", confirm: "" },
  });

  async function onSubmit(values: Values) {
    setSending(true);
    setFormError(null);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        // El trigger handle_new_user crea el perfil SIEMPRE con rol "cliente".
        // Los roles admin / empleado / proveedor solo los asigna un administrador.
        data: { full_name: values.full_name },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setSending(false);
      if (/already registered|already exists/i.test(error.message)) {
        setError("email", { message: "Este email ya está registrado. Inicia sesión." });
      } else if (/password/i.test(error.message)) {
        setError("password", { message: "La contraseña no cumple los requisitos de seguridad." });
      } else {
        setFormError("No hemos podido crear la cuenta. Revisa tu conexión e inténtalo de nuevo.");
      }
      return;
    }

    // Con confirmación de email activa, un email existente vuelve sin identidades
    if (data.user && data.user.identities?.length === 0) {
      setSending(false);
      setError("email", { message: "Este email ya está registrado. Inicia sesión." });
      return;
    }

    // Sin sesión = el proyecto exige confirmar el email antes de entrar
    if (!data.session) {
      setSending(false);
      setPendingEmail(values.email);
      return;
    }

    const profile = await getMyProfile().catch(() => null);
    setSending(false);
    await navigate({ to: DASHBOARD_BY_ROLE[profile?.role ?? "cliente"] });
  }

  if (pendingEmail) {
    return (
      <AuthLayout
        title="Revisa tu email"
        subtitle="Solo falta un paso para activar tu cuenta."
        footer={
          <Link to="/login" className="font-medium text-electric hover:underline">
            Ir a iniciar sesión
          </Link>
        }
      >
        <div className="flex flex-col items-center text-center" role="status">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
            <MailCheck className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="mt-5 text-text">
            Te hemos enviado un enlace de confirmación a <strong>{pendingEmail}</strong>. Ábrelo y
            después inicia sesión.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Crea tu cuenta EEIVA"
      subtitle="Gestiona tus solicitudes y citas en un solo lugar."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-electric hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Field id="full_name" label="Nombre completo" error={errors.full_name?.message}>
          <input
            id="full_name"
            type="text"
            autoComplete="name"
            placeholder="Ej: Marta Solsona"
            aria-invalid={errors.full_name ? "true" : "false"}
            aria-describedby={errors.full_name ? "full_name-error" : undefined}
            className={inputClass}
            {...register("full_name")}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email?.message}>
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
        </Field>
        <Field id="password" label="Contraseña" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={inputClass}
            {...register("password")}
          />
        </Field>
        <Field id="confirm" label="Confirmar contraseña" error={errors.confirm?.message}>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.confirm ? "true" : "false"}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
            className={inputClass}
            {...register("confirm")}
          />
        </Field>

        {formError ? <FormAlert>{formError}</FormAlert> : null}
        <button
          type="submit"
          disabled={sending}
          className="btn-primary w-full px-6 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
