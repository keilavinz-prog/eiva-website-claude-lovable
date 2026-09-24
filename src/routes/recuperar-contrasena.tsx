import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoaderCircle, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Field, FormAlert, inputClass } from "@/components/auth/fields";

const schema = z.object({
  email: z.string().trim().min(1, "Escribe tu email.").email("Revisa el formato del email."),
});
type Values = z.infer<typeof schema>;

export const Route = createFileRoute("/recuperar-contrasena")({
  head: () => ({
    meta: [{ title: "Recuperar contraseña | EEIVA" }, { name: "robots", content: "noindex" }],
  }),
  component: RecuperarPage,
});

function RecuperarPage() {
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit(values: Values) {
    setSending(true);
    setFormError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/restablecer-contrasena`,
    });
    setSending(false);
    if (error) {
      setFormError(
        /rate limit/i.test(error.message)
          ? "Has pedido demasiados enlaces seguidos. Espera unos minutos e inténtalo de nuevo."
          : "No hemos podido enviar el enlace. Revisa tu conexión e inténtalo de nuevo.",
      );
      return;
    }
    // Mismo mensaje exista o no la cuenta, para no revelar qué emails están registrados
    setSentTo(values.email);
  }

  const footer = (
    <Link to="/login" className="font-medium text-electric hover:underline">
      Volver a iniciar sesión
    </Link>
  );

  if (sentTo) {
    return (
      <AuthLayout
        title="Revisa tu email"
        subtitle="Te hemos enviado las instrucciones."
        footer={footer}
      >
        <div className="flex flex-col items-center text-center" role="status">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
            <MailCheck className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="mt-5 text-text">
            Si existe una cuenta con <strong>{sentTo}</strong>, recibirás un enlace para crear una
            contraseña nueva. Revisa también la carpeta de spam.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="¿Olvidaste tu contraseña?"
      subtitle="Escribe tu email y te enviaremos un enlace para crear una nueva."
      footer={footer}
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
        {formError ? <FormAlert>{formError}</FormAlert> : null}
        <button
          type="submit"
          disabled={sending}
          className="btn-primary w-full px-6 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
              Enviando...
            </>
          ) : (
            "Enviar enlace"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
