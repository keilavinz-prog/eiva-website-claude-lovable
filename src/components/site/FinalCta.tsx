import { Reveal } from "./Reveal";

export function FinalCta({ phone }: { phone: string | null }) {
  const href = phone ? `tel:${phone.replace(/\s+/g, "")}` : "#contacto";
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-gradient-to-b from-surface to-canvas py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="glow-breathe absolute top-1/2 left-1/2 -z-10 h-80 w-[40rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-3xl"
      />
      <Reveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="text-3xl font-bold text-text sm:text-5xl">
          ¿Necesitas un electricista de confianza?
        </h2>
        <div className="mt-10 flex justify-center">
          <a href={href} className="btn-primary px-8 py-4 text-base">
            Contactar ahora
          </a>
        </div>
      </Reveal>
    </section>
  );
}
