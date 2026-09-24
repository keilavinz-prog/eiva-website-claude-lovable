import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-md border border-line bg-canvas px-4 py-3 text-text placeholder:text-text-muted/70 transition focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20 aria-[invalid=true]:border-danger";

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-text"
    >
      {children}
    </div>
  );
}
