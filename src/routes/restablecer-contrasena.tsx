import { useEffect, useState } from "react";
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

const schema = z
  .object({
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

export const Route = createFileRoute("/restablecer-contrasena")({
  // El enlace del email trae la sesión en la URL: esta página solo funciona en el navegador
  ssr: false,
  head: () => ({
    meta: [{ title: "Nueva contraseña | EEIVA" }, { name: "robots", content: "noindex" }],
  }),
  component: RestablecerPage,
});

type LinkState = "checking" | "ready" | "invalid";

function RestablecerPage() {
  const navigate = useNavigate();
  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  useEffect(() => {
    // Enlace caducado o ya usado: Supabase lo indica en la propia URL
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
    if (params.get("error") || params.get("error_code")) {
      setLinkState("invalid");
      return;
    }

    let settled = false;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && !settled)) {
        settled = true;
        setLinkState("ready");
      }
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        settled = true;
        setLinkState("ready");
      }
    });
    // Si en unos segundos no hay sesión, el enlace no es válido
    const timer = window.setTimeout(() => {
      if (!settled) setLinkState("invalid");
    }, 4000);

    return () => {
      window.clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(values: Values) {
    setSaving(true);
    setFormError(null);
    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) {
      setSaving(false);
      setFormError(
        /different from the old/i.test(error.message)
          ? "La nueva contraseña debe ser distinta de la anterior."
          : "No hemos podido guardar la contraseña. Pide un enlace nuevo e inténtalo otra vez.",
      );
      return;
    }
    toast.success("Contraseña actualizada");
    const profile = await getMyProfile().catch(() => null);
    setSaving(false);
    await navigate({ to: profile ? DASHBOARD_BY_ROLE[profile.role] : "/login" });
  }

  const footer = (
    <Link to="/login" className="font-medium text-electric hover:underline">
      Volver a iniciar sesión
    </Link>
  );

  if (linkState === "checking") {
    return (
      <AuthLayout title="Nueva contraseña" subtitle="Comprobando el enlace..." footer={footer}>
        <div className="flex justify-center py-6" role="status" aria-label="Comprobando el enlace">
          <LoaderCircle className="h-8 w-8 animate-spin text-electric" aria-hidden="true" />
        </div>
      </AuthLayout>
    );
  }

  if (linkState === "invalid") {
    return (
      <AuthLayout
        title="Enlace no válido"
        subtitle="El enlace ha caducado o ya se ha usado."
        footer={footer}
      >
        <div className="text-center">
          <p className="text-text">Pide un enlace nuevo para crear tu contraseña.</p>
          <Link to="/recuperar-contrasena" className="btn-primary mt-6 w-full px-6 py-3.5">
            Pedir un enlace nuevo
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Elige una contraseña nueva para tu cuenta."
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Field id="password" label="Nueva contraseña" error={errors.password?.message}>
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
          disabled={saving}
          className="btn-primary w-full px-6 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
              Guardando...
            </>
          ) : (
            "Guardar contraseña"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
