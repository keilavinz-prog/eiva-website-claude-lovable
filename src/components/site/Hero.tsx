import { EnergyLines } from "./EnergyLines";
import type { CompanyInfo } from "@/lib/home-data";

export function Hero({ company }: { company: CompanyInfo }) {
  const year = company.founded_year ?? 1998;
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-canvas pt-16"
    >
      <EnergyLines />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-xs text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--eeiva-success)]" />
            {company.name}
          </p>
          <h1 className="mt-6 text-4xl leading-[1.05] font-bold text-text sm:text-6xl lg:text-7xl">
            Instalaciones eléctricas de precisión desde {year}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-muted sm:text-xl">
            {company.slogan}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href="#contacto" className="btn-primary px-7 py-3.5 text-base">
              Solicitar Presupuesto
            </a>
            <a href="#proyectos" className="btn-secondary px-7 py-3.5 text-base">
              Ver Proyectos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
