import type { ReactNode } from "react";
import { WifiOff } from "lucide-react";

/** Aviso de envío pendiente por falta de conexión (Fase 9). */
export function OfflineNotice({
  children,
  action,
  compact = false,
}: {
  children: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      role="status"
      className={`flex flex-col gap-2 rounded-md border border-amber/40 bg-amber/10 text-text sm:flex-row sm:items-center sm:justify-between ${
        compact ? "p-3 text-xs" : "p-4 text-sm"
      }`}
    >
      <span className="inline-flex items-start gap-2">
        <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-amber" aria-hidden="true" />
        <span>{children}</span>
      </span>
      {action}
    </div>
  );
}
