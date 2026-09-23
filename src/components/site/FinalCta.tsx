import { Reveal } from "./Reveal";

export function FinalCta({ phone }: { phone: string | null }) {
  const href = phone ? `tel:${phone.replace(/\s+/g, "")}` : "#contacto";
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand to-brand-dark py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="glow-breathe absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-brand-yellow/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-blueprint absolute inset-0 -z-20 opacity-10 mix-blend-overlay"
      />
      <Reveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-5xl">
          ¿Necesitas un electricista de confianza?
        </h2>
        <div className="mt-10 flex justify-center">
          <a href={href} className="btn-accent px-8 py-4 text-base">
            Contactar ahora
          </a>
        </div>
      </Reveal>
    </section>
  );
}
