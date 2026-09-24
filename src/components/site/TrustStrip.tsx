import { Reveal } from "./Reveal";
import { VideoBackground } from "./VideoBackground";
import { EnergyLines } from "./EnergyLines";
import { TRUST_VIDEO } from "@/lib/media";
import { experienceLabel } from "@/lib/site-data";

export function TrustStrip({ foundedYear }: { foundedYear: number | null }) {
  const metrics = [
    { value: experienceLabel(foundedYear), label: "años de experiencia" },
    { value: "24/7", label: "asistencia en averías, 365 días" },
    { value: "BT·MT·AT", label: "baja, media y alta tensión" },
    { value: "Nac. + Int.", label: "trabajos provinciales, nacionales e internacionales" },
  ];

  return (
    <section
      id="nosotros"
      aria-label="Datos de confianza"
      className="theme-space relative isolate overflow-hidden border-y border-line bg-canvas"
    >
      <VideoBackground video={TRUST_VIDEO} overlay="bg-canvas/80" />
      <EnergyLines fade={false} />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 py-6 sm:py-12 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 80}
            className={`px-5 py-8 sm:px-8 sm:py-10 ${i % 2 === 1 ? "border-l border-line" : ""} ${
              i > 1 ? "border-t border-line lg:border-t-0" : ""
            } ${i === 2 ? "lg:border-l" : ""}`}
          >
            <p className="text-glow font-mono text-3xl font-medium text-electric sm:text-4xl">
              {m.value}
            </p>
            <p className="mt-2 font-mono text-xs text-text-muted sm:text-sm">{m.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
