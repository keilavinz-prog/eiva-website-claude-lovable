import type { ReactNode } from "react";
import { SearchX, type LucideIcon } from "lucide-react";

/**
 * Estado vacío común a toda la aplicación.
 * - Por defecto: tarjeta propia (listas públicas y tablas del admin).
 * - `compact`: sin tarjeta, para usar dentro de otra tarjeta (paneles, gráficas).
 */
export function EmptyState({
  message,
  icon: Icon = SearchX,
  compact = false,
  action,
}: {
  message: ReactNode;
  icon?: LucideIcon;
  compact?: boolean;
  action?: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center ${
        compact ? "h-full px-4 py-8" : "card-tech px-6 py-16"
      }`}
    >
      <Icon className="h-8 w-8 text-electric" aria-hidden="true" />
      <p className="max-w-md text-sm text-text-muted sm:text-base">{message}</p>
      {action}
    </div>
  );
}
