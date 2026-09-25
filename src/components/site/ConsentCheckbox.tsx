import type { UseFormRegisterReturn } from "react-hook-form";

/** Casilla de consentimiento RGPD (obligatoria, sin marcar por defecto). */
export function ConsentCheckbox({
  id,
  registration,
  error,
  compact = false,
}: {
  id: string;
  registration: UseFormRegisterReturn;
  error?: string | undefined;
  compact?: boolean;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line accent-[var(--color-brand)]"
          {...registration}
        />
        <label htmlFor={id} className={`${compact ? "text-xs" : "text-sm"} text-text-muted`}>
          He leído y acepto la{" "}
          <a
            href="/politica-privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-electric underline-offset-2 hover:underline"
          >
            Política de Privacidad
          </a>
          .
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
