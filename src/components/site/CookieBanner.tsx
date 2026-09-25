import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { COOKIE_CONSENT_KEY } from "@/lib/consent";

/** Aviso de cookies en la primera visita. Hoy solo hay almacenamiento técnico (sesión). */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(COOKIE_CONSENT_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function save(choice: "aceptadas" | "rechazadas_no_esenciales") {
    try {
      window.localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({ choice, date: new Date().toISOString() }),
      );
    } catch {
      // Sin almacenamiento disponible: se cierra igualmente para esta visita
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed left-4 z-40 max-w-md rounded-lg border border-line bg-surface p-5 text-text shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none right-[5.5rem] sm:right-auto sm:left-6"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <p className="flex items-start gap-3 text-sm leading-relaxed text-text-muted">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-electric" aria-hidden="true" />
        <span>
          Usamos cookies técnicas necesarias para el funcionamiento del sitio (sesión de usuario).
          No usamos cookies de analítica ni publicidad de terceros en esta versión.{" "}
          <a href="/politica-privacidad" className="font-medium text-electric hover:underline">
            Más información
          </a>
        </span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => save("aceptadas")}
          className="btn-primary px-4 py-2 text-sm"
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => save("rechazadas_no_esenciales")}
          className="btn-secondary px-4 py-2 text-sm"
        >
          Rechazar no esenciales
        </button>
      </div>
    </div>
  );
}
