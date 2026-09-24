import type { ReactNode } from "react";

/** Cabecera común de cada sección del panel. */
export function AdminPage({
  kicker,
  title,
  description,
  action,
  children,
}: {
  kicker: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs text-electric">{kicker}</p>
          <h1 className="mt-2 text-2xl font-bold text-text sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 text-text-muted">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
