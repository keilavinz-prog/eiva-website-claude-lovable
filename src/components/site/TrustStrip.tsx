import { Reveal } from "./Reveal";

export function TrustStrip({ foundedYear }: { foundedYear: number | null }) {
  const years = new Date().getFullYear() - (foundedYear ?? 1998);
  const metrics = [
    { value: `${years}`, label: "años de experiencia" },
    { value: "+500", label: "proyectos ejecutados" },
    { value: "98%", label: "clientes satisfechos" },
    { value: "CIE", label: "certificación oficial" },
  ];

  return (
    <section
      id="nosotros"
      aria-label="Datos de confianza"
      className="border-y border-line bg-surface"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 80}
            className={`px-5 py-8 sm:px-8 sm:py-10 ${i % 2 === 1 ? "border-l border-line" : ""} ${
              i > 1 ? "border-t border-line lg:border-t-0" : ""
            } ${i === 2 ? "lg:border-l" : ""}`}
          >
            <p className="font-mono text-3xl font-medium text-electric sm:text-4xl">{m.value}</p>
            <p className="mt-2 font-mono text-xs text-text-muted sm:text-sm">{m.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
