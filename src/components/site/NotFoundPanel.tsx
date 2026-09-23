import type { ReactNode } from "react";
import { EnergyLines } from "./EnergyLines";

/** 404 amigable con el estilo espacial. */
export function NotFoundPanel({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children: ReactNode;
}) {
  return (
    <section className="theme-space relative isolate flex min-h-[80svh] items-center overflow-hidden bg-canvas pt-16">
      <EnergyLines />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <p className="text-glow font-mono text-6xl font-medium text-electric sm:text-8xl">404</p>
        <h1 className="mt-6 text-3xl font-bold text-text sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg text-text-muted">{message}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">{children}</div>
      </div>
    </section>
  );
}
