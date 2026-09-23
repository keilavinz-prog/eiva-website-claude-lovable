import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Franja de llamada a la acción en morado de marca (el botón se pasa como hijo). */
export function CtaBand({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand to-brand-dark py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="glow-breathe absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-brand-yellow/25 blur-3xl"
      />
      <Reveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-5xl">{title}</h2>
        <div className="mt-10 flex justify-center">{children}</div>
      </Reveal>
    </section>
  );
}
