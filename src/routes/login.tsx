import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/auth.functions";
import { DASHBOARD_BY_ROLE } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Field, FormAlert, inputClass } from "@/components/auth/fields";

const schema = z.object({
  email: z.string().trim().min(1, "Escribe tu email.").email("Revisa el formato del email."),
  password: z.string().min(1, "Escribe tu contraseña."),
});
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Iniciar sesión | EEIVA" }, { name: "robots", content: "noindex" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: Values) {
    setSending(true);
    setFormError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setSending(false);
      if (/invalid login credentials/i.test(error.message)) {
        setFormError("Email o contraseña incorrectos.");
      } else if (/email not confirmed/i.test(error.message)) {
        setFormError("Todavía no has confirmado tu email. Revisa tu bandeja de entrada.");
      } else {
        setFormError("No hemos podido iniciar sesión. Revisa tu conexión e inténtalo de nuevo.");
      }
      return;
    }
    // El rol se lee en el servidor desde profiles
    const profile = await getMyProfile().catch(() => null);
    setSending(false);
    if (!profile) {
      setFormError("No encontramos tu perfil. Contacta con nosotros si el problema continúa.");
      return;
    }
    await navigate({ to: DASHBOARD_BY_ROLE[profile.role] });
  }

  return (
    <AuthLayout
      title="Accede a tu cuenta"
      subtitle="Consulta tus solicitudes y citas con EEIVA."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-electric hover:underline">
            Regístrate
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
            autoComplete="current-password"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={inputClass}
            {...register("password")}
          />
        </Field>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              toast("Próximamente", {
                description: "La recuperación de contraseña llegará pronto.",
              })
            }
            className="text-sm text-electric hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        {formError ? <FormAlert>{formError}</FormAlert> : null}
        <button
          type="submit"
          disabled={sending}
          className="btn-primary w-full px-6 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
              Entrando...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
